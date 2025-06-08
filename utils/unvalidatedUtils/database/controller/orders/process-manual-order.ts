'use server';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { ManualCreateOrderInformation } from './create-manual-order';
import {
    RenewalOrder,
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { getSubscriptionByProduct } from '../prescription_subscriptions/prescription_subscriptions';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { PaymentAction } from '@/app/types/orders/order-types';
import {
    createBalanceTransaction,
    refundStripeInvoice,
    refundStripeInvoiceWithAmount,
    updateStripeProduct,
    updateStripeSubscriptionImmediately,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import {
    createRenewalOrderWithPayload,
    getLatestRenewalOrderByCustomerAndProduct,
} from '../renewal_orders/renewal_orders';
import { getNextRenewalOrderId } from './create-order-utils';
import { getEligiblePharmacy } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import { shouldOrderNeedReview } from '@/app/utils/actions/intake/order-util';
import { updateStatusTagToReview } from '../patient-status-tags/patient-status-tags-api';
import { updatePrescriptionScript } from '@/app/utils/functions/prescription-scripts/prescription-scripts-utils';
import { updatePrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { createOrderDataAudit } from '../order_data_audit/order_data_audit_api';
import { getPriceIdForProductVariant} from '@/app/utils/database/controller/products/products';
import {
    OrderDataAuditActions,
    OrderDataAuditDescription,
} from '../order_data_audit/order_audit_descriptions';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';

export async function processAndCreateManualOrder(
    orderInformation: ManualCreateOrderInformation,
    profile_data: APProfileData,
    product_href: PRODUCT_HREF,
    variant_index: number,
    cadence: SubscriptionCadency,
    metadata: any,
    needsProviderReview: boolean
) {
    const subscription = await getSubscriptionByProduct(
        product_href,
        profile_data.id
    );

    if (!subscription) {
        throw new Error('Could not find subscription for user');
    }

    if (subscription.status !== 'active') {
        throw new Error('Could not find active subscription for user');
    }

    const pvc = new ProductVariantController(
        product_href as PRODUCT_HREF,
        variant_index,
        profile_data.state as USStates
    );
    const pvc_conversion = pvc.getConvertedVariantIndex();
    const pharmacy = pvc_conversion.pharmacy;
    const new_variant_index = pvc_conversion.variant_index!;

    const new_price_id = await getPriceIdForProductVariant( 
        product_href,
        new_variant_index,
        process.env.NEXT_PUBLIC_ENVIRONMENT!
    );

    if (!new_price_id) {
        throw new Error(
            `Could not find new price id for ${product_href} ${new_variant_index}`
        );
    }

    if (!pharmacy) {
        throw new Error('Could not find pharmacy for product');
    }

    if (needsProviderReview) {
        return await createManualOrderNeedsProviderReview(
            orderInformation,
            subscription,
            profile_data,
            product_href,
            new_variant_index,
            cadence,
            pharmacy,
            metadata,
            new_price_id
        );
    } else {
        return await createManualOrderDoesntNeedProviderReview(
            orderInformation,
            subscription,
            profile_data,
            product_href,
            new_variant_index,
            cadence,
            pharmacy,
            metadata,
            new_price_id
        );
    }
}

async function createManualOrderNeedsProviderReview(
    orderInformation: ManualCreateOrderInformation,
    subscription: PrescriptionSubscription,
    profile_data: APProfileData,
    product_href: string,
    variant_index: number,
    cadence: SubscriptionCadency,
    pharmacy: string,
    metadata: any,
    new_price_id: string
) {
    const amount = Number(metadata.amount);

    // if (Number(amount)) {
    //     throw new Error(`Invalid refund amount ${amount}`);
    // }

    if (orderInformation.paymentAction === PaymentAction.Refund) {
        const invoiceId = metadata.invoiceId;

        if (!invoiceId) {
            throw new Error(
                'Could not find invoice ID - needs provider review'
            );
        }
        await refundStripeInvoiceWithAmount(invoiceId, Number(amount) * 100);

        const renewalOrder = await createNewNthRenewalOrder(
            profile_data,
            product_href as PRODUCT_HREF,
            variant_index,
            cadence,
            new_price_id,
            pharmacy,
            RenewalOrderStatus.CheckupComplete_Unprescribed_Paid
        );

        if (renewalOrder) {
            await updateStatusTagToReview(
                renewalOrder.customer_uuid,
                renewalOrder.renewal_order_id
            );

            await updateStripeSubscriptionImmediately(
                subscription.stripe_subscription_id,
                new_price_id,
                true
            );
        }
    } else if (orderInformation.paymentAction === PaymentAction.Credit) {
        await createBalanceTransaction(
            profile_data.stripe_customer_id,
            -amount * 100
        );

        const renewalOrder = await createNewNthRenewalOrder(
            profile_data,
            product_href as PRODUCT_HREF,
            variant_index,
            cadence,
            new_price_id,
            pharmacy,
            RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid
        );

        if (renewalOrder) {
            await updateStatusTagToReview(
                renewalOrder.customer_uuid,
                renewalOrder.renewal_order_id
            );

            await updateStripeSubscriptionImmediately(
                subscription.stripe_subscription_id,
                new_price_id,
                false,
                {
                    manual_order: 'true',
                }
            );
        }
    } else if (orderInformation.paymentAction === PaymentAction.FullyPaid) {
        const renewalOrder = await createNewNthRenewalOrder(
            profile_data,
            product_href as PRODUCT_HREF,
            variant_index,
            cadence,
            new_price_id,
            pharmacy,
            RenewalOrderStatus.CheckupComplete_Unprescribed_Paid
        );

        if (renewalOrder) {
            await updateStatusTagToReview(
                renewalOrder.customer_uuid,
                renewalOrder.renewal_order_id
            );

            await updateStripeSubscriptionImmediately(
                subscription.stripe_subscription_id,
                new_price_id,
                true
            );
        }
    } else if (orderInformation.paymentAction === PaymentAction.FullyUnpaid) {
        const renewalOrder = await createNewNthRenewalOrder(
            profile_data,
            product_href as PRODUCT_HREF,
            variant_index,
            cadence,
            new_price_id,
            pharmacy,
            RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid
        );

        if (renewalOrder) {
            await updateStripeProduct(subscription.id, variant_index, false);
            await updateStatusTagToReview(
                renewalOrder.customer_uuid,
                renewalOrder.renewal_order_id
            );
            await createOrderDataAudit(
                renewalOrder.original_order_id,
                renewalOrder.renewal_order_id,
                OrderDataAuditDescription.CoordinatorManualCreateOrder,
                OrderDataAuditActions.CoordinatorManualCreateOrder,
                {
                    selectedVariantIndex: variant_index,
                    renewalOrder,
                },
                {
                    updateStripeProductWithProductPayload: {
                        subscription,
                        variant_index,
                        hasPaid: false,
                    },
                    updateStatusTagToReviewPayload: {
                        customer_uuid: renewalOrder.customer_uuid,
                        renewal_order_id: renewalOrder.renewal_order_id,
                    },
                }
            );
        }
    }

    await updatePrescriptionSubscription(subscription.id, {
        product_href,
        assigned_pharmacy: pharmacy,
        since_last_checkup: 0,
        status: 'active',
        subscription_type: cadence,
        price_id: new_price_id,
        variant_text: metadata.variant_text,
    });
}

async function createManualOrderDoesntNeedProviderReview(
    orderInformation: ManualCreateOrderInformation,
    subscription: PrescriptionSubscription,
    profile_data: APProfileData,
    product_href: string,
    variant_index: number,
    cadence: SubscriptionCadency,
    pharmacy: string,
    metadata: any,
    new_price_id: string
) {
    throw new Error('Was not prepared for this');
}

async function createNewNthRenewalOrder(
    profile_data: APProfileData,
    product_href: PRODUCT_HREF,
    variant_index: number,
    cadence: SubscriptionCadency,
    new_price_id: string,
    newPharmacy: string,
    order_status: string
) {
    const latestRenewalOrder = await getLatestRenewalOrderByCustomerAndProduct(
        profile_data.id,
        product_href
    );

    if (!latestRenewalOrder) {
        throw new Error('Could not get latest renewal order for customer');
    }

    const new_renewal_order_id = getNextRenewalOrderId(
        String(latestRenewalOrder.original_order_id),
        latestRenewalOrder.renewal_order_id
    );

    const renewalOrderPayload: Partial<RenewalOrder> = {
        price_id: new_price_id,
        address_line1: profile_data.address_line1!,
        address_line2: profile_data.address_line2!,
        city: profile_data.city!,
        state: profile_data.state!,
        zip: profile_data.zip!,
        order_status: order_status as RenewalOrderStatus,
        original_order_id: latestRenewalOrder.original_order_id,
        customer_uuid: latestRenewalOrder.customer_uuid,
        assigned_pharmacy: newPharmacy,
        subscription_type: cadence,
        product_href,
        subscription_id: latestRenewalOrder.subscription_id!,
        renewal_order_id: new_renewal_order_id,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        variant_index: variant_index,
        dosage_selection_completed: true,
        source: 'manual',
    };

    return await createRenewalOrderWithPayload(renewalOrderPayload);
}
