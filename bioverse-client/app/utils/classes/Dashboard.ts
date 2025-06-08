import { OrderType } from '@/app/types/orders/order-types';
import {
    getDaysBetweenDates,
    getIntakeDashboardTitle,
} from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/intake-helpers';
import {
    PRODUCT_HREF,
    PRODUCT_NAME,
} from '@/app/types/global/product-enumerator';
import { getFormattedCadence } from '../functions/formatting';
import { isGLP1Product, isWeightlossProduct } from '../functions/pricing';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { getStripeSubscription, getSubscriptionRenewalDate } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { convertEpochToDate } from '../functions/dates';
import { getLatestProcessedOrderGeneral } from '../database/controller/renewal_orders/renewal_orders';
import { getPriceDataRecordWithVariant } from '../database/controller/product_variants/product_variants';
import { getPrescriptionSubscription } from '../actions/subscriptions/subscription-actions';

export interface TitleInformation {
    taskName: string; //the 'title'
    currentOrder: string;
    upcomingOrder: string;
    currentOrderPharmacy?: string;
    upcomingOrderPharmacy?: string;
    currentDosage?: string;
    previousDosage?: string;
    providerActionRequired?: string;
}

export class Dashboard {
    order: DBOrderData;
    orderType: OrderType;

    constructor(order: DBOrderData, orderType: OrderType) {
        this.order = order;
        this.orderType = orderType;
    }

    async getCurrentMonth() {
        if (this.order.subscription_type === SubscriptionCadency.Monthly) {
            return 1;
        }

        if (
            this.order.subscription &&
            this.order.subscription.stripe_subscription_id
        ) {
            const stripeSubscription = await getStripeSubscription(
                this.order.subscription.stripe_subscription_id
            );

            const date = convertEpochToDate(
                stripeSubscription.current_period_end
            );

            const daysBetween = await getDaysBetweenDates(new Date(), date);
            if (isWeightlossProduct(this.order.product_href)) {
                if (
                    this.order.subscription_type ===
                    SubscriptionCadency.Quarterly
                ) {
                    if (daysBetween >= 60) {
                        return 1;
                    } else if (daysBetween >= 30) {
                        return 2;
                    } else {
                        return 3;
                    }
                } else if (
                    this.order.subscription_type ===
                    SubscriptionCadency.Biannually
                ) {
                    if (daysBetween >= 150) {
                        return 1;
                    } else if (daysBetween >= 120) {
                        return 2;
                    } else if (daysBetween >= 90) {
                        return 3;
                    } else if (daysBetween >= 60) {
                        return 4;
                    } else if (daysBetween >= 30) {
                        return 5;
                    } else {
                        return 6;
                    }
                } else if (
                    this.order.subscription_type ===
                    SubscriptionCadency.Annually
                ) {
                    if (daysBetween >= 330) {
                        return 1;
                    } else if (daysBetween >= 300) {
                        return 2;
                    } else if (daysBetween >= 270) {
                        return 3;
                    } else if (daysBetween >= 240) {
                        return 4;
                    } else if (daysBetween >= 210) {
                        return 5;
                    } else if (daysBetween >= 180) {
                        return 6;
                    } else if (daysBetween >= 150) {
                        return 7;
                    } else if (daysBetween >= 120) {
                        return 8;
                    } else if (daysBetween >= 90) {
                        return 9;
                    } else if (daysBetween >= 60) {
                        return 10;
                    } else if (daysBetween >= 30) {
                        return 11;
                    } else {
                        return 12;
                    }
                }
            }
        }
        return 1;
    }

    async getDashboardTitle(): Promise<TitleInformation> {
        const { lastOrderSent, lastOrderSentType } =
            await getLatestProcessedOrderGeneral(this.order.renewal_order_id); //will return { null, OrderType.Order } if this.order is an initial order (not a renewal order)

        if (isGLP1Product(this.order.product_href)) {
            return await getIntakeDashboardTitle(
                this.order,
                this.orderType,
                lastOrderSent
            );
        }

        let variant_index;
        let productData;
        let formattedCadence;

        if (!lastOrderSent) {
            variant_index = this.order.variant_index;
            productData = await getPriceDataRecordWithVariant(
                this.order.product_href,
                variant_index
            );
            formattedCadence = getFormattedCadence(
                this.order.subscription_type
            );
        } else {
            variant_index = lastOrderSent.variant_index;
            productData = await getPriceDataRecordWithVariant(
                lastOrderSent?.product_href!,
                variant_index!
            );
            formattedCadence = getFormattedCadence(
                lastOrderSent?.subscription_type!
            );
        }

        var payload;

        switch (this.order.product_href) {
            case PRODUCT_HREF.NAD_INJECTION:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.NAD_INJECTION,
                    upcomingOrder: PRODUCT_NAME.NAD_INJECTION,
                };
                break;
            case PRODUCT_HREF.NAD_PATCHES:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.NAD_PATCHES,
                    upcomingOrder: PRODUCT_NAME.NAD_PATCHES,
                };
                break;
            case PRODUCT_HREF.NAD_FACE_CREAM:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.NAD_FACE_CREAM,
                    upcomingOrder: PRODUCT_NAME.NAD_FACE_CREAM,
                };
                break;
            case PRODUCT_HREF.NAD_NASAL_SPRAY:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.NAD_NASAL_SPRAY,
                    upcomingOrder: PRODUCT_NAME.NAD_NASAL_SPRAY,
                };
                break;
            case PRODUCT_HREF.TADALAFIL_AS_NEEDED:
            case PRODUCT_HREF.TADALAFIL_DAILY:
                const upcomingProductData = await getPriceDataRecordWithVariant(
                    this.order.product_href,
                    this.order.variant_index
                );
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.TADALAFIL_GENERIC} ${productData?.variant}`,
                    upcomingOrder: `${PRODUCT_NAME.TADALAFIL_GENERIC} ${upcomingProductData?.variant}`,
                };
                break;
            case PRODUCT_HREF.TRETINOIN:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.TRETINOIN,
                    upcomingOrder: PRODUCT_NAME.TRETINOIN,
                };
                break;
            case PRODUCT_HREF.METFORMIN:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.METFORMIN,
                    upcomingOrder: PRODUCT_NAME.METFORMIN,
                };
                break;
            case PRODUCT_HREF.B12_INJECTION:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.B12_INJECTION,
                    upcomingOrder: PRODUCT_NAME.B12_INJECTION,
                };
                break;
            case PRODUCT_HREF.TELMISARTAN:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.TELMISARTAN,
                    upcomingOrder: PRODUCT_NAME.TELMISARTAN,
                };
                break;
            case PRODUCT_HREF.FINASTERIDE_AND_MINOXIDIL:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.FINASTERIDE_AND_MINOXIDIL,
                    upcomingOrder: PRODUCT_NAME.FINASTERIDE_AND_MINOXIDIL,
                };
                break;
            case PRODUCT_HREF.ACARBOSE: {
                const upcomingProductData = await getPriceDataRecordWithVariant(
                    this.order.product_href,
                    this.order.variant_index
                );
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.ACARBOSE} ${productData?.variant}`,
                    upcomingOrder: `${PRODUCT_NAME.ACARBOSE} ${upcomingProductData?.variant}`,
                };
                break;
            }
            case PRODUCT_HREF.GLUTATIONE_INJECTION:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.GLUTATIONE_INJECTION,
                    upcomingOrder: PRODUCT_NAME.GLUTATIONE_INJECTION,
                };
                break;
            case PRODUCT_HREF.ZOFRAN:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.ZOFRAN,
                    upcomingOrder: PRODUCT_NAME.ZOFRAN,
                };
                break;
            case PRODUCT_HREF.WL_CAPSULE:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: PRODUCT_NAME.WL_CAPSULE,
                    upcomingOrder: PRODUCT_NAME.WL_CAPSULE,
                };
                break;

            case PRODUCT_HREF.PEAK_CHEWS:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.PEAK_CHEWS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.PEAK_CHEWS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.RUSH_CHEWS:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.RUSH_CHEWS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.RUSH_CHEWS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.X_CHEWS:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.X_CHEWS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.X_CHEWS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.X_MELTS:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.X_MELTS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.X_MELTS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.TADALAFIL:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.TADALAFIL} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.TADALAFIL} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.RUSH_MELTS:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.RUSH_MELTS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.RUSH_MELTS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.SILDENAFIL:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.SILDENAFIL} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.SILDENAFIL} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.VIAGRA:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.VIAGRA} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.VIAGRA} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.CIALIS:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.CIALIS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                    upcomingOrder: `${PRODUCT_NAME.CIALIS} (${productData?.variant}) ${productData?.cadence} Quantity: ${productData?.price_data.quantity}`,
                };
                break;

            case PRODUCT_HREF.SERMORELIN:
                payload = {
                    taskName: `${formattedCadence} ${
                        lastOrderSentType === OrderType.Order
                            ? 'Request'
                            : 'Check in'
                    }`,
                    currentOrder: `${PRODUCT_NAME.SERMORELIN} (${productData?.variant}) ${productData?.cadence} `,
                    upcomingOrder: `${PRODUCT_NAME.SERMORELIN} (${productData?.variant}) ${productData?.cadence} `,
                };
                break;

            default:
                payload = {
                    taskName: `Unknown Request`,
                    currentOrder: 'Unknown',
                    upcomingOrder: 'Unknown',
                };
                break;
        }

        if (payload.taskName.includes('Request')) {
            payload.upcomingOrder = '';
        }
        return payload;
    }

    async getSubscriptionRenewalDate(): Promise<string> {
        try {
            const subscription = await getPrescriptionSubscription(
                Number(this.order.subscription_id)
            );

            if (!subscription) {
                return '';
            }

            const stripeSubscription = await getStripeSubscription(
                subscription?.stripe_subscription_id
            );

            const renewal_date = convertEpochToDate(
                stripeSubscription.current_period_end
            );

            const formattedDate = renewal_date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            return formattedDate;
        } catch (error) {
            console.log('error in getting subscription renewal date: ', error);
            return '';
        }
    }
}
