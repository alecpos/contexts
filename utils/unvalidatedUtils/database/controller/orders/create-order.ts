'use server';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    deleteOrderById,
    getBaseOrderByProduct,
    insertNewManualOrder,
    updateOrder,
} from './orders-api';
import {
    RenewalOrder,
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    BaseOrderInterface,
    ManualOrderAction,
    OrderStatus,
} from '@/app/types/orders/order-types';
import { updateStatusTagToReview } from '../patient-status-tags/patient-status-tags-api';
import {
    createRenewalOrderWithPayload,
    getLatestOrderForSubscriptionThatWasSent,
    getLatestRenewalOrderByCustomerAndProduct,
} from '../renewal_orders/renewal_orders';
import {
    cancelStripeSubscriptionManualOrder,
    createBalanceTransaction,
    getStripePriceId,
    listPaidInvoices,
    refundStripeInvoice,
    updateStripeProductWithProduct,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { getAllActiveGLP1SubscriptionsForProduct } from '@/app/utils/actions/prescription-subscriptions/prescription-subscriptions-actions';
import { getNextRenewalOrderId } from './create-order-utils';
import { convertStripePriceToDollars } from '@/app/utils/functions/client-utils';
import { Status } from '@/app/types/global/global-enumerators';
import {
    getPrescriptionSubscription,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import Stripe from 'stripe';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
import { getPriceIdForProductVariant } from '@/app/utils/database/controller/products/products';


export async function createNewManualOrder(
    profile_data: DBPatientData,
    product_href: PRODUCT_HREF,
    variant_index: number,
    hasPaid: boolean,
    cadence: SubscriptionCadency,
    selectedPaymentMethod: string
) {
    const baseOrder = await getBaseOrderByProduct(
        profile_data.id,
        product_href
    );

    const pvc = new ProductVariantController(
        product_href as PRODUCT_HREF,
        variant_index,
        profile_data.state as USStates
    );

    const pvc_conversion = pvc.getConvertedVariantIndex();
    const newPharmacy = pvc_conversion.pharmacy;
    const newVariantIndex = pvc_conversion.variant_index!;

    const new_price_id = await getPriceIdForProductVariant( 
        product_href,
        newVariantIndex,
        process.env.NEXT_PUBLIC_ENVIRONMENT!
    );

    if (!new_price_id) {
        throw new Error(
            `Could not find price id for this product ${product_href} ${newVariantIndex}`
        );
    }

    if (!newPharmacy) {
        throw new Error(
            `Could not find pharmacy for this product and var index ${product_href} ${newVariantIndex}`
        );
    }

    // Do subscription stuff here

    if (!baseOrder) {
        // Swapping from A -> B, just create a new order
        await createNewBaseOrder(
            profile_data,
            product_href,
            newVariantIndex,
            cadence,
            selectedPaymentMethod,
            new_price_id,
            newPharmacy
        );
        // Void current glp 1 subscription
    } else {
        // A base order exists for this product. Check if a renewal order exists for it, if yes then create a new renewal
        // If no, then reasonable to assume the base order is 'incomplete' and can be overwritten

        const latestRenewalOrder =
            await getLatestRenewalOrderByCustomerAndProduct(
                profile_data.id,
                product_href
            );

        if (
            !latestRenewalOrder &&
            baseOrder.order_status !== OrderStatus.ApprovedCardDownFinalized
        ) {
            // No renewal order exists, can overwrite the existing order
            await overwriteExistingBaseOrder(
                baseOrder,
                newVariantIndex,
                cadence,
                selectedPaymentMethod,
                new_price_id,
                newPharmacy
            );

            // Need to void / cancel other GLP-1 order if exists
        } else if (latestRenewalOrder) {
            // Renewal order exists, void the latest one and create a new renewal
            // await createNewNthRenewalOrder(
            //     latestRenewalOrder,
            //     variant_index,
            //     cadence,
            //     new_price_id,
            //     newPharmacy,
            // );
        } else {
            // Base Order is finalized, create a first time renewal order
            // await createNewFirstTimeRenewalOrder(
            //     baseOrder,
            //     variant_index,
            //     cadence,
            //     new_price_id,
            //     newPharmacy,
            // );
        }
    }
}

export async function getManualCreateOrderInformation(
    profile_data: APProfileData,
    product_href: PRODUCT_HREF,
    variant_index: number,
    hasPaid: boolean,
    cadence: SubscriptionCadency,
    selectedPaymentMethod: string
) {
    const baseOrder = await getBaseOrderByProduct(
        profile_data.id,
        product_href
    );

    const pvc = new ProductVariantController(
        product_href as PRODUCT_HREF,
        variant_index,
        profile_data.state as USStates
    );

    const pvc_conversion = pvc.getConvertedVariantIndex();
    const newPharmacy = pvc_conversion.pharmacy;
    const newVariantIndex = pvc_conversion.variant_index!;

    const new_price_id = await getPriceIdForProductVariant(
        product_href,
        newVariantIndex,
        process.env.NEXT_PUBLIC_ENVIRONMENT!
    );

    if (!new_price_id) {
        throw new Error('Could not find new price id');
    }

    if (!newPharmacy) {
        throw new Error(
            `Could not find pharmacy for price id ${product_href} ${newVariantIndex}`
        );
    }

    // Do subscription stuff here

    // If user hasn't paid yet, can just always use updateStripeProduct
    // If customer has paid, show much extra they will be charged or refunded

    const newStripePrice = await getPriceForStripePriceId(new_price_id);
    if (!newStripePrice) {
        throw new Error('Unable to get new stripe price');
    }

    if (!baseOrder) {
        // Swapping from A -> B, just create a new order

        if (hasPaid) {
            const oldStripePrice = await getLastPaidAmountForGLP1(
                profile_data.id
            );
            if (oldStripePrice && newStripePrice) {
                const payload = getOrderInformationPayload(
                    profile_data,
                    oldStripePrice,
                    newStripePrice
                );
                // If the new product is more expensive than last paid, credit the user the amount of last paid
                return {
                    action: ManualOrderAction.NewBaseOrder,
                    ...payload,
                };
            } else {
                throw new Error(
                    'Could not get old price and new price for user'
                );
            }
        }
        // If subscriptions exist for the user, find them
        // If need to pay more, refund a selected invoice entirely
        // If need to get a refund, do it via prorations

        // If no subscriptions exist, do nothing
        else {
            return {
                action: ManualOrderAction.NewBaseOrder,
                price: convertStripePriceToDollars(newStripePrice),
            };
        }
        // Void current glp 1 subscription
    } else {
        // A base order exists for this product. Check if a renewal order exists for it, if yes then create a new renewal
        // If no, then reasonable to assume the base order is 'incomplete' and can be overwritten

        const latestRenewalOrder =
            await getLatestRenewalOrderByCustomerAndProduct(
                profile_data.id,
                product_href
            );

        if (
            !latestRenewalOrder &&
            baseOrder.order_status !== OrderStatus.ApprovedCardDownFinalized
        ) {
            await deleteOrderById(baseOrder.id);
            return await getManualCreateOrderInformation(
                profile_data,
                product_href,
                newVariantIndex,
                hasPaid,
                cadence,
                selectedPaymentMethod
            );

            // Need to void / cancel other GLP-1 order if exists
        } else if (latestRenewalOrder) {
            // Renewal order exists, void the latest one and create a new renewal
            if (hasPaid) {
                const oldStripePrice = await getLastPaidAmountForGLP1(
                    profile_data.id
                );

                if (oldStripePrice && newStripePrice) {
                    const payload = await getOrderInformationPayload(
                        profile_data,
                        oldStripePrice,
                        newStripePrice
                    );
                    console.log('payload', payload);
                    // If the new product is more expensive than last paid, credit the user the amount of last paid
                    return {
                        action: ManualOrderAction.NewRenewalOrder,
                        ...payload,
                    };
                } else {
                    throw new Error(
                        'Could not get old price and new price for user'
                    );
                }
            }
            return {
                action: ManualOrderAction.NewRenewalOrder,
                price: convertStripePriceToDollars(newStripePrice),
            };
        } else {
            // Base Order is finalized, create a first time renewal order
            throw new Error(
                '[EDGE CASE] Need to create first time renewal order - flag engineering'
            );
        }
    }
}

export async function getPriceForStripePriceId(price_id: string) {
    const stripePrice = await getStripePriceId(price_id);

    return stripePrice.unit_amount;
}

export async function processOnCreateOrder(
    profile_data: APProfileData,
    orderInformation: any,
    selectedVariant: number,
    selectedCadence: SubscriptionCadency,
    selectedPaymentMethod: string,
    selectedProduct: string,
    needsProviderReview: boolean,
    hasPaid: boolean,
    metadata: any
) {
    const pvc = new ProductVariantController(
        selectedProduct as PRODUCT_HREF,
        selectedVariant,
        profile_data.state as USStates
    );

    const pvc_conversion = pvc.getConvertedVariantIndex();
    const newPharmacy = pvc_conversion.pharmacy;
    const newVariantIndex = pvc_conversion.variant_index!;

    const priceId = await getPriceIdForProductVariant( 
        selectedProduct,
        newVariantIndex,
        process.env.NEXT_PUBLIC_ENVIRONMENT!
    );

    if (!priceId) {
        throw new Error('Unable to find price id');
    }

    if (!newPharmacy) {
        throw new Error('Unable to locate pharmacy for product');
    }

    if (orderInformation.credit) {
        const creditAmount = orderInformation.creditAmount;

        await createBalanceTransaction(
            profile_data.stripe_customer_id,
            -creditAmount
        );
    } else if (orderInformation.refund) {
        const invoiceId: string = metadata.invoiceId;

        const refundStatus = await refundStripeInvoice(invoiceId);

        if (refundStatus === Status.Failure) {
            throw new Error('Failed to refund invoice for user');
        }
        // Refund the charge on the invoice and then create new order
    }

    if (orderInformation.action === ManualOrderAction.NewBaseOrder) {
        const orderPayload: OrdersSBR = {
            customer_uid: profile_data.id,
            variant_index: newVariantIndex,
            variant_text: metadata.variant_text,
            subscription_type: selectedCadence,
            stripe_metadata: {
                clientSecret: '',
                setupIntentId: '',
                paymentMethodId: selectedPaymentMethod,
            },
            order_status: OrderStatus.UnapprovedCardDown,
            product_href: selectedProduct,
            price_id: priceId,
            discount_id: undefined,
            assigned_pharmacy: newPharmacy,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
            address_line1: profile_data.address_line1,
            address_line2: profile_data.address_line2,
            city: profile_data.city,
            state: profile_data.state,
            zip: profile_data.zip,
            source: 'admin',
        };

        const order = await insertNewManualOrder(orderPayload);

        // Cancel and void any ongoing GLP-1 subscriptions
        const subscriptions = await getAllActiveGLP1SubscriptionsForProduct(
            profile_data.id
        );
        if (subscriptions.length === 1) {
            const subscription = subscriptions[0];

            await cancelStripeSubscriptionManualOrder(subscription);
        }

        await updateStatusTagToReview(profile_data.id, String(order.id));
    } else if (orderInformation.action === ManualOrderAction.NewRenewalOrder) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

        const latestRenewalOrder =
            await getLatestRenewalOrderByCustomerAndProduct(
                profile_data.id,
                selectedProduct
            );

        if (!latestRenewalOrder) {
            throw new Error('Could not find latest renewal order for user');
        }

        let subscription = await getPrescriptionSubscription(
            latestRenewalOrder.subscription_id
        );

        if (!subscription) {
            const subscriptions = await getAllActiveGLP1SubscriptionsForProduct(
                profile_data.id
            );
            if (subscriptions.length === 1) {
                subscription = subscriptions[0];
            } else {
                throw new Error(
                    'Could not find subscription for renewal order'
                );
            }
        }

        if (subscription.status === 'scheduled-cancel') {
            await stripe.subscriptions.update(
                subscription.stripe_subscription_id,
                {
                    cancel_at_period_end: false,
                }
            );
        }

        if (subscription.status !== 'active') {
            throw new Error('Unexpected subscription status');
        }

        const new_renewal_order_id = getNextRenewalOrderId(
            String(latestRenewalOrder.original_order_id),
            latestRenewalOrder.renewal_order_id
        );

        if (needsProviderReview) {
            if (hasPaid) {
                await updateStripeProductWithProduct(
                    { ...subscription, product_href: selectedProduct },
                    newVariantIndex,
                    true
                );
            } else {
                await updateStripeProductWithProduct(
                    { ...subscription, product_href: selectedProduct },
                    newVariantIndex,
                    false
                );
            }
            const order_status = hasPaid
                ? RenewalOrderStatus.CheckupComplete_Unprescribed_Paid
                : RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid;

            const renewalOrderPayload: Partial<RenewalOrder> = {
                customer_uuid: profile_data.id,
                variant_index: newVariantIndex,
                subscription_type: selectedCadence,
                order_status,
                product_href: selectedProduct,
                assigned_pharmacy: newPharmacy,
                environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
                address_line1: profile_data.address_line1,
                address_line2: profile_data.address_line2,
                city: profile_data.city,
                state: profile_data.state,
                zip: profile_data.zip,
                original_order_id: latestRenewalOrder.original_order_id,
                renewal_order_id: new_renewal_order_id,
                subscription_id: latestRenewalOrder.subscription_id,
                price_id: priceId,
            };

            await createRenewalOrderWithPayload(renewalOrderPayload);

            await updateStatusTagToReview(
                profile_data.id,
                new_renewal_order_id
            );
        } else {
            if (hasPaid) {
                const renewalOrderPayload: Partial<RenewalOrder> = {
                    customer_uuid: profile_data.id,
                    variant_index: newVariantIndex,
                    subscription_type: selectedCadence,
                    order_status:
                        RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    product_href: selectedProduct,
                    assigned_pharmacy: newPharmacy,
                    environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
                    address_line1: profile_data.address_line1,
                    address_line2: profile_data.address_line2,
                    city: profile_data.city,
                    state: profile_data.state,
                    zip: profile_data.zip,
                    original_order_id: latestRenewalOrder.original_order_id,
                    renewal_order_id: new_renewal_order_id,
                    subscription_id: latestRenewalOrder.subscription_id,
                    price_id: priceId,
                };

                await createRenewalOrderWithPayload(renewalOrderPayload);

                await updateStripeProductWithProduct(
                    { ...subscription, product_href: selectedProduct },
                    newVariantIndex,
                    true
                );
            } else {
                const renewalOrderPayload: Partial<RenewalOrder> = {
                    customer_uuid: profile_data.id,
                    variant_index: newVariantIndex,
                    subscription_type: selectedCadence,
                    order_status:
                        RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    product_href: selectedProduct,
                    assigned_pharmacy: newPharmacy,
                    environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
                    address_line1: profile_data.address_line1,
                    address_line2: profile_data.address_line2,
                    city: profile_data.city,
                    state: profile_data.state,
                    zip: profile_data.zip,
                    original_order_id: latestRenewalOrder.original_order_id,
                    renewal_order_id: new_renewal_order_id,
                    subscription_id: latestRenewalOrder.subscription_id,
                    price_id: priceId,
                };

                await createRenewalOrderWithPayload(renewalOrderPayload);

                await updateStripeProductWithProduct(
                    { ...subscription, product_href: selectedProduct },
                    newVariantIndex,
                    false
                );
            }
        }

        await updatePrescriptionSubscription(subscription.id, {
            product_href: selectedProduct,
            assigned_pharmacy: newPharmacy,
            since_last_checkup: 0,
            status: 'active',
            subscription_type: selectedCadence,
            price_id: priceId,
            order_id: latestRenewalOrder.original_order_id,
            variant_text: metadata.variant_text,
        });

        // When creating a new renewal order, will need to create it accordingly
        // Move customer's existing glp1 subscription
        // If active stripe sub exists:
        // If needs provider review
        // If has paid: updateStripeProduct
        // If hasn't paid: updateStripeProduct
        // Order status: checkupcomplete_unprescribed_paid/unpaid

        // If doesn't need provider review:
        // If has paid: updateStripeProduct
        // Update renewal order details
        // updateStripeProduct
        // if hasn't paid: updateStripeProduct
        // order status: checkupcomplete_prescribed_unpaid
        // variant index, pharmacy

        // If no active glp1 stripe sub exists:
        // break
    }
}

export async function createNewBaseOrder(
    profile_data: DBPatientData,
    product_href: PRODUCT_HREF,
    variant_index: number,
    cadence: SubscriptionCadency,
    selectedPaymentMethod: string,
    new_price_id: string,
    newPharmacy: string
) {
    const newOrder: OrdersSBR = {
        customer_uid: profile_data.id,
        variant_index: variant_index,
        subscription_type: cadence,
        stripe_metadata: {
            clientSecret: '',
            setupIntentId: '',
            paymentMethodId: selectedPaymentMethod,
        },
        order_status: OrderStatus.UnapprovedCardDown,
        product_href: product_href,
        price_id: new_price_id,
        assigned_pharmacy: newPharmacy,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        address_line1: profile_data.address_line1,
        address_line2: profile_data.address_line2,
        city: profile_data.city,
        state: profile_data.state,
        zip: profile_data.zip,
        source: 'admin',
    };

    const resp = await insertNewManualOrder(newOrder);

    if (resp) {
        await updateStatusTagToReview(profile_data.id, String(resp.id));
    } else {
        throw new Error('Failed to update status tag to review');
    }
}

export async function overwriteExistingBaseOrder(
    baseOrder: BaseOrderInterface,
    variant_index: number,
    cadence: SubscriptionCadency,
    selectedPaymentMethod: string,
    new_price_id: string,
    newPharmacy: string
) {
    const updatedOrderPayload: OrdersSBR = {
        variant_index: variant_index,
        subscription_type: cadence,
        stripe_metadata: {
            clientSecret: '',
            setupIntentId: '',
            paymentMethodId: selectedPaymentMethod,
        },
        assigned_pharmacy: newPharmacy,
        order_status: OrderStatus.UnapprovedCardDown,
        price_id: new_price_id,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        address_line1: baseOrder.address_line1,
        address_line2: baseOrder.address_line2,
        city: baseOrder.city,
        state: baseOrder.state,
        zip: baseOrder.zip,
        source: 'admin',
    };

    await updateOrder(baseOrder.id, updatedOrderPayload);

    await updateStatusTagToReview(baseOrder.customer_uid, String(baseOrder.id));
}

async function getOrderInformationPayload(
    profile_data: APProfileData,
    oldStripePrice: number,
    newStripePrice: number
) {
    if (newStripePrice > oldStripePrice) {
        return {
            credit: true,
            price: convertStripePriceToDollars(newStripePrice),
            chargeAmount: convertStripePriceToDollars(
                newStripePrice - oldStripePrice
            ),
            creditAmount: oldStripePrice,
        };
    } else if (newStripePrice < oldStripePrice) {
        const invoices = await listPaidInvoices(
            profile_data.stripe_customer_id,
            oldStripePrice
        );

        return {
            refund: true,
            price: convertStripePriceToDollars(newStripePrice),
            invoices,
        };
    } else {
        return {
            price: convertStripePriceToDollars(newStripePrice),
        };
    }
}

// async function createNewNthRenewalOrder(
//     latestRenewalOrder: RenewalOrder,
//     variant_index: number,
//     cadence: SubscriptionCadency,
//     new_price_id: string,
//     newPharmacy: string,
// ) {
//     const new_renewal_order_id = getNextRenewalOrderId(
//         String(latestRenewalOrder.original_order_id),
//         latestRenewalOrder.renewal_order_id,
//     );

//     const renewalOrderPayload: Partial<RenewalOrder> = {
//         price_id: new_price_id,
//         address_line1: latestRenewalOrder.address_line1!,
//         address_line2: latestRenewalOrder.address_line2!,
//         city: latestRenewalOrder.city!,
//         state: latestRenewalOrder.state!,
//         zip: latestRenewalOrder.zip!,
//         order_status: 'asd',
//         original_order_id: latestRenewalOrder.original_order_id,
//         customer_uuid: latestRenewalOrder.customer_uuid,
//         assigned_pharmacy: newPharmacy,
//         subscription_type: cadence,
//         product_href: latestRenewalOrder.product_href!,
//         subscription_id: latestRenewalOrder.subscription_id!,
//         renewal_order_id: new_renewal_order_id,
//         environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
//         variant_index: variant_index,
//     };

//     await createRenewalOrderWithPayload(renewalOrderPayload);
// }

// export async function createNewFirstTimeRenewalOrder(
//     baseOrder: BaseOrderInterface,
//     variant_index: number,
//     cadence: SubscriptionCadency,
//     new_price_id: string,
//     newPharmacy: string,
// ) {
//     const new_renewal_order_id = `${baseOrder.id}-1`;

//     const renewalOrderPayload: Partial<RenewalOrder> = {
//         price_id: new_price_id,
//         address_line1: baseOrder.address_line1!,
//         address_line2: baseOrder.address_line2!,
//         city: baseOrder.city!,
//         state: baseOrder.state!,
//         zip: baseOrder.zip!,
//         order_status: 'asd',
//         original_order_id: baseOrder.id,
//         customer_uuid: baseOrder.customer_uid,
//         assigned_pharmacy: newPharmacy,
//         subscription_type: cadence,
//         product_href: baseOrder.product_href!,
//         subscription_id: baseOrder.subscription_id!,
//         renewal_order_id: new_renewal_order_id,
//         environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
//         variant_index: variant_index,
//     };

//     await createRenewalOrderWithPayload(renewalOrderPayload);
// }

async function getLastPaidAmountForGLP1(user_id: string) {
    const subscriptions = await getAllActiveGLP1SubscriptionsForProduct(
        user_id
    );
    if (!subscriptions) {
        throw new Error('No active subscriptions found for user');
    }
    if (subscriptions.length > 1) {
        throw new Error('Found more than 1 active glp 1 subscription');
    }

    const subscription = subscriptions[0];

    const latestRenewalOrderForSub =
        await getLatestOrderForSubscriptionThatWasSent(subscription.id);

    console.log(latestRenewalOrderForSub);

    if (!latestRenewalOrderForSub) {
        throw new Error('Could not find renewal order for subscription');
    }

    const old_price_id = await getPriceIdForProductVariant( 
        latestRenewalOrderForSub.product_href,
        latestRenewalOrderForSub.variant_index,
        process.env.NEXT_PUBLIC_ENVIRONMENT!
    );

    if (!old_price_id) {
        throw new Error('Could not find price id error');
    }

    const oldStripePrice = await getPriceForStripePriceId(old_price_id);
    return oldStripePrice;
}

// function getOrderStatusForManualCreateOrder(hasPaid: boolean) {
//     if (hasPaid) {
//         return RenewalOrderStatus.CheckupComplete_Unprescribed_Paid;
//     }
//     // return RenewalOrderStatus.CheckupComplete_Un;
// }
