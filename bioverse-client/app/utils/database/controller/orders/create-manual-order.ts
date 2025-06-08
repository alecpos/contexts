'use server';

import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { getSubscriptionByProduct } from '../prescription_subscriptions/prescription_subscriptions';
import { getPriceIdForProductVariant } from '@/app/utils/database/controller/products/products';
import {
    getStripeInvoice,
    getStripeSubscription,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { getPriceForStripePriceId } from './create-order';
import {
    ManualOrderAction,
    OrderStatus,
    PaymentAction,
} from '@/app/types/orders/order-types';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { formatDateToMMDDYYYY } from '@/app/utils/functions/client-utils';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { getBaseOrderByProduct } from './orders-api';
import { isGLP1Product } from '@/app/utils/functions/pricing';
import { SubscriptionStatus } from '@/app/types/enums/master-enums';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    WEIGHT_LOSS_SWAP_PRODUCT,
    WL_CHECKIN_COMPLETE,
} from '@/app/services/customerio/event_names';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { Status } from '@/app/types/global/global-enumerators';
import { createNewThreadForPatientProduct } from '../messaging/threads/threads';

export interface ManualOrderInformation {
    profile_data: APProfileData;
    product_href: PRODUCT_HREF;
    variant_index: number;
    hasPaid: boolean;
    cadence: SubscriptionCadency;
    needsProviderReview: boolean;
    selectedPaymentMethod: string;
    metadata: any;
}

export interface ManualCreateOrderInformation {
    paymentAction: PaymentAction | ManualOrderAction;
    amount: number;
    newPrice: number;
    subscriptionRenewalDate: string;
}

export async function getPreloadManualCreateOrderInformation(
    orderInformation: ManualOrderInformation
) {
    const { profile_data, product_href, variant_index, needsProviderReview } =
        orderInformation;

    const new_price_id = await getPriceIdForProductVariant(
        product_href,
        variant_index,
        process.env.NEXT_PUBLIC_ENVIRONMENT!
    );

    if (!isGLP1Product(product_href)) {
        return {
            paymentAction: ManualOrderAction.NewBaseOrder,
            //We don't use amount for new first time orders that are no GLP-1, so we can pass 0.
            amount: 0,
        };
    }

    if (!new_price_id) {
        throw new Error(
            `Could not find new price id for ${product_href} ${variant_index}`
        );
    }

    let subscription = await getSubscriptionByProduct(
        product_href,
        profile_data.id
    );

    if (!subscription) {
        const baseOrder = await getBaseOrderByProduct(
            profile_data.id,
            orderInformation.product_href
        );

        if (!baseOrder) {
            return {
                paymentAction: ManualOrderAction.NewBaseOrder,
                amount: await getPriceForStripePriceId(new_price_id),
            };
        }

        if (baseOrder.order_status !== OrderStatus.ApprovedCardDownFinalized) {
            return {
                paymentAction: ManualOrderAction.NewBaseOrderVoidOrder,
                amount: await getPriceForStripePriceId(new_price_id),
            };
        }
        throw new Error('Could not find subscription for user');
    }

    if (
        subscription.status === SubscriptionStatus.Canceled ||
        subscription.status === SubscriptionStatus.Scheduled_Cancel
    ) {
        return {
            paymentAction: ManualOrderAction.ReactivateSubscription,
            amount: await getPriceForStripePriceId(new_price_id),
        };
    }
    if (subscription.status !== 'active') {
        throw new Error('Could not find active subscription for user');
    }

    await triggerEvent(profile_data.id, WEIGHT_LOSS_SWAP_PRODUCT);
    await triggerEvent(profile_data.id, WL_CHECKIN_COMPLETE);

    if (needsProviderReview) {
        return await handleOrderNeedsProviderReview(
            orderInformation,
            subscription,
            new_price_id
        );
    } else {
        return await handleOrderDoesntNeedProviderReview(
            orderInformation,
            subscription,
            new_price_id
        );
    }
}

async function handleOrderNeedsProviderReview(
    orderInformation: ManualOrderInformation,
    subscription: PrescriptionSubscription,
    new_price_id: string
) {
    // The dollar amount of the new price
    const newPrice = await getPriceForStripePriceId(new_price_id);

    if (!newPrice) {
        throw new Error(`Could not get price for new price id ${new_price_id}`);
    }

    if (orderInformation.hasPaid) {
        const invoiceId = orderInformation.metadata.invoiceId;

        if (!invoiceId) {
            throw new Error('Could not find invoice id');
        }

        const stripeInvoice = await getStripeInvoice(invoiceId);

        const amountPaid = stripeInvoice.amount_paid;

        const subscriptionRenewalDate = await determineSubscriptionRenewalDate(
            subscription.stripe_subscription_id,
            true
        );

        // User paid more than they should have, need to refund some amount
        if (amountPaid > newPrice) {
            return {
                paymentAction: PaymentAction.Refund,
                amount: amountPaid - newPrice,
                subscriptionRenewalDate,
                newPrice,
            };
            // User paid less than they should have, credit that amount to the user so they're charged the difference
        } else if (amountPaid < newPrice) {
            return {
                paymentAction: PaymentAction.Credit,
                amount: newPrice - amountPaid,
                subscriptionRenewalDate,
                newPrice,
            };
        }

        // Otherwise, the product the user is switching to is the same price, so no need to pay anything
        return {
            paymentAction: PaymentAction.FullyPaid,
            amount: 0,
            subscriptionRenewalDate,
            newPrice,
        };
    } else {
        // User has not paid yet
        const shouldResetBillingCycle =
            orderInformation.metadata.shouldResetBillingCycle;

        if (
            shouldResetBillingCycle == null ||
            shouldResetBillingCycle == undefined
        ) {
            throw new Error(
                'Could not determine if we should charge the user now'
            );
        }

        const subscriptionRenewalDate = await determineSubscriptionRenewalDate(
            subscription.stripe_subscription_id,
            true
        );

        // I know it's the same thing

        if (shouldResetBillingCycle) {
            return {
                paymentAction: PaymentAction.FullyUnpaid,
                amount: newPrice,
                subscriptionRenewalDate,
                newPrice,
            };
        } else {
            return {
                paymentAction: PaymentAction.FullyUnpaid,
                amount: newPrice,
                subscriptionRenewalDate,
                newPrice,
            };
        }
    }
}

async function determineSubscriptionRenewalDate(
    stripe_subscription_id: string,
    shouldResetBillingCycle: boolean
) {
    if (shouldResetBillingCycle) {
        return 'Immediately';
    }
    const stripeSub = await getStripeSubscription(stripe_subscription_id);

    const date = convertEpochToDate(stripeSub.current_period_end);

    return formatDateToMMDDYYYY(date);
}

async function handleOrderDoesntNeedProviderReview(
    orderInformation: ManualOrderInformation,
    subscription: PrescriptionSubscription,
    new_price_id: string
) {
    if (orderInformation.hasPaid) {
        return await handleOrderDoesntNeedProviderReviewAndPaid(
            orderInformation,
            subscription,
            new_price_id
        );
    } else {
        return await handleOrderDoesntNeedProviderReviewAndUnpaid(
            orderInformation,
            subscription,
            new_price_id
        );
    }
}

async function handleOrderDoesntNeedProviderReviewAndPaid(
    orderInformation: ManualOrderInformation,
    subscription: PrescriptionSubscription,
    new_price_id: string
) {
    const invoiceId = orderInformation.metadata.invoiceId;

    if (!invoiceId) {
        throw new Error('Could not find invoice id');
    }

    const newPrice = await getPriceForStripePriceId(new_price_id);

    if (!newPrice) {
        throw new Error(`Could not get price for new price id ${new_price_id}`);
    }

    const stripeInvoice = await getStripeInvoice(invoiceId);

    const amountPaid = stripeInvoice.amount_paid;

    const subscriptionRenewalDate = await determineSubscriptionRenewalDate(
        subscription.stripe_subscription_id,
        true
    );

    // User paid more than they should have, need to refund some amount
    if (amountPaid > newPrice) {
        return {
            paymentAction: PaymentAction.Refund,
            amount: amountPaid - newPrice,
            subscriptionRenewalDate,
            newPrice,
        };
        // User paid less than they should have, credit that amount to the user so they're charged the difference
    } else if (amountPaid < newPrice) {
        return {
            paymentAction: PaymentAction.Credit,
            amount: amountPaid,
            subscriptionRenewalDate,
            newPrice,
        };
    }

    // Otherwise, the product the user is switching to is the same price, so no need to pay anything
    return {
        paymentAction: PaymentAction.FullyPaid,
        amount: 0,
        subscriptionRenewalDate,
        newPrice,
    };
}

async function handleOrderDoesntNeedProviderReviewAndUnpaid(
    orderInformation: ManualOrderInformation,
    subscription: PrescriptionSubscription,
    new_price_id: string
) {
    const newPrice = await getPriceForStripePriceId(new_price_id);

    if (!newPrice) {
        throw new Error(`Could not get price for new price id ${new_price_id}`);
    }

    const shouldResetBillingCycle =
        orderInformation.metadata.shouldResetBillingCycle;

    if (
        shouldResetBillingCycle == null ||
        shouldResetBillingCycle == undefined
    ) {
        throw new Error('Could not determine if we should charge the user now');
    }

    const subscriptionRenewalDate = await determineSubscriptionRenewalDate(
        subscription.stripe_subscription_id,
        true
    );

    // I know it's the same thing

    if (shouldResetBillingCycle) {
        return {
            paymentAction: PaymentAction.FullyUnpaid,
            amount: newPrice,
            subscriptionRenewalDate,
            newPrice,
        };
    } else {
        return {
            paymentAction: PaymentAction.FullyUnpaid,
            amount: newPrice,
            subscriptionRenewalDate,
            newPrice,
        };
    }
}

export async function isUserEligibleForManualOrderCreation(
    patient_id: string,
    product_href: PRODUCT_HREF
): Promise<boolean> {
    const getProductsToCheck = (href: PRODUCT_HREF): PRODUCT_HREF[] => {
        switch (href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
            case PRODUCT_HREF.TIRZEPATIDE:
                return [PRODUCT_HREF.SEMAGLUTIDE, PRODUCT_HREF.TIRZEPATIDE];
            default:
                return [href];
        }
    };

    const products_to_check = getProductsToCheck(product_href);

    const supabase = createSupabaseServiceClient();

    const { data: subscriptions, error } = await supabase
        .from('prescription_subscriptions')
        .select('id, status')
        .eq('patient_id', patient_id)
        .in('product_href', products_to_check);

    if (error) {
        console.error('Error fetching subscriptions', error);
        return false;
    }

    // Return true if there are no subscriptions or if all subscriptions are canceled
    return (
        subscriptions.length === 0 ||
        subscriptions.every(
            (subscription) =>
                subscription.status === SubscriptionStatus.Canceled
        )
    );
}

/**
 * This function swaps the user thread on a GLP-1 product when a manual order is created such that the messaging system tags the correct order.
 *
 * @param patient_id - The patient id of the user.
 * @param new_product_href - The product href of the new product.
 * @returns - The status of the operation.
 *
 * Error - an error occured during set up, check logs for details.
 * Failure - A new thread was created for the patient. Failed to find existing thread.
 * Success - The thread product was swapped successfully.
 */
export async function handleUserThreadsOnManualCreateOrder(
    patient_id: string,
    new_product_href: PRODUCT_HREF
) {
    try {
        const target_thread_product = (() => {
            switch (new_product_href) {
                case PRODUCT_HREF.TIRZEPATIDE:
                    return PRODUCT_HREF.SEMAGLUTIDE;
                case PRODUCT_HREF.SEMAGLUTIDE:
                    return PRODUCT_HREF.TIRZEPATIDE;
                default:
                    return new_product_href;
            }
        })();

        const supabase = createSupabaseServiceClient();

        const { data: threads, error } = await supabase
            .from('threads')
            .select('*')
            .eq('patient_id', patient_id);

        if (error) {
            console.error('Error fetching threads', error);
            return Status.Error;
        }

        if (threads.length === 0) {
            await createNewThreadForPatientProduct(
                patient_id,
                new_product_href
            );
            return Status.Failure;
        }

        const target_thread = threads.find(
            (thread) => thread.product === target_thread_product
        );

        if (!target_thread) {
            await createNewThreadForPatientProduct(
                patient_id,
                new_product_href
            );
            return Status.Failure;
        }

        if (target_thread.product === new_product_href) {
            return Status.Success;
        }

        await supabase
            .from('threads')
            .update({
                product: new_product_href,
            })
            .eq('id', target_thread.id);

        if (error) {
            console.error('Error swapping user thread on GLP-1 product', error);
            return Status.Error;
        }
    } catch (error) {
        console.error('Error swapping user thread on GLP-1 product', error);
        return Status.Error;
    }
}
