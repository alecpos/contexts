'use server';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { PRESCRIPTION_DELIVERED } from '@/app/services/customerio/event_names';
import { CustomOrderStatus } from '@/app/types/custom_orders/custom-order-types';
import { JobSchedulerTypes } from '@/app/types/job-scheduler/job-scheduler-types';
import { OrderType, ShippingStatus } from '@/app/types/orders/order-types';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { deactivateAllActionItemsForProduct } from '@/app/utils/database/controller/action-items/action-items-actions';
import { updateRenewalCount } from '@/app/utils/actions/prescription-subscriptions/prescription-subscriptions-actions';
import { updateCustomOrder } from '@/app/utils/database/controller/custom_orders/custom_orders_api';
import { createNewFirstTimeCommJob } from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import {
    getBaseOrderById,
    getCustomerIDFromEasyPostTrackingID,
    updateShippingStatusByEasyPostTrackingID,
} from '@/app/utils/database/controller/orders/orders-api';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getProductName } from '@/app/utils/database/controller/products/products';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { isWeightlossProduct } from '@/app/utils/functions/pricing';
import { NextRequest, NextResponse } from 'next/server';

/**
 *
 * EasyPost Webhook for prescription delivery
 *     triggers the customer.io event PRESCRIPTION_DELIVERED
 *     updates the order status to DELIVERED
 *     updates the shipping status to DELIVERED
 *     deactivates all action items for the product
 *     creates a new first time comm job for the user with one of the following job types:
 *         JobSchedulerTypes.MonthlyCheckInCustomerIO
 *         JobSchedulerTypes.QuarterlyCheckInCustomerIO
 *         JobSchedulerTypes.BiannuallyCheckInCustomerIO
 *         JobSchedulerTypes.AnnuallyCheckInCustomerIO
 *
 */
export async function POST(request: NextRequest) {
    const webhookData = await request.json();
    const trackerID = webhookData?.result?.id;
    const updatedStatus = webhookData?.result?.status;
    const trackingNumber = webhookData?.result?.tracking_code;
    const trackingURL = webhookData?.result?.public_url;

    try {
        // 1. Get user to notify
        const {
            id: userID,
            order_id,
            success,
            type,
            product_href,
            subscription_type,
        } = await getCustomerIDFromEasyPostTrackingID(trackerID);

        if (!success || !userID) {
            console.error(
                'Failed to get customer id from easypost tracking ID',
                trackerID,
                userID,
                success,
                webhookData
            );
            return NextResponse.json({});
        }

        const productName = await getProductName(product_href || '');

        // 2. Send appropriate customer.io event based on event status
        switch (updatedStatus) {
            case 'in_transit':
                // console.log('Shipped event received', userID);
                // Shipped event already sent when creating tracker

                // console.log(webhookData);
                // if (type === OrderType.Order) {
                //     await triggerEvent(userID, PRESCRIPTION_SHIPPED, {
                //         order_id,
                //         tracking_number: trackingNumber,
                //         tracking_url: trackingURL,
                //         product_name: productName.name,
                //     });
                // } else {
                //     await triggerEvent(userID, PRESCRIPTION_RENEWAL_SHIPPED, {
                //         order_id,
                //         tracking_number: trackingNumber,
                //         tracking_url: trackingURL,
                //         product_name: productName.name,
                //     });
                // }

                // await updateShippingStatusByEasyPostTrackingID(
                //     trackerID,
                //     ShippingStatus.Shipped,
                // );
                break;
            case 'delivered':
                // console.log('Sending delivered event to', userID);
                // console.log(webhookData);

                await triggerEvent(userID, PRESCRIPTION_DELIVERED, {
                    order_id,
                    tracking_number: trackingNumber,
                    tracking_url: trackingURL,
                    product_name: productName.name,
                });

                if (type === OrderType.CustomOrder) {
                    await updateCustomOrder(String(order_id) || '', {
                        order_status: CustomOrderStatus.Delivered,
                    });
                    break;
                }

                await updateShippingStatusByEasyPostTrackingID(
                    trackerID,
                    ShippingStatus.Delivered
                );

                if (
                    subscription_type === SubscriptionCadency.Monthly ||
                    subscription_type === SubscriptionCadency.Quarterly ||
                    subscription_type === SubscriptionCadency.Biannually ||
                    subscription_type === SubscriptionCadency.Annually
                ) {
                    // Just to be safe
                    if (order_id) {
                        await updateRenewalCount(order_id, type);
                        if (product_href) {
                            await deactivateAllActionItemsForProduct(
                                userID,
                                product_href
                            );
                        }
                    }
                }

                try {
                    if (
                        subscription_type === SubscriptionCadency.Monthly &&
                        isWeightlossProduct(product_href || '')
                    ) {
                        if (type === OrderType.Order) {
                            const baseOrder = await getBaseOrderById(
                                Number(order_id)
                            );

                            if (baseOrder && baseOrder?.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.MonthlyCheckInCustomerIO,
                                    userID,
                                    baseOrder.subscription_id
                                );
                            }
                        } else if (type === OrderType.RenewalOrder) {
                            const renewalOrder = await getRenewalOrder(
                                String(order_id)
                            );

                            if (renewalOrder && renewalOrder.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.MonthlyCheckInCustomerIO,
                                    userID,
                                    renewalOrder.subscription_id
                                );
                            }
                        }
                    } else if (
                        subscription_type === SubscriptionCadency.Quarterly &&
                        isWeightlossProduct(product_href || '')
                    ) {
                        if (type === OrderType.Order) {
                            const baseOrder = await getBaseOrderById(
                                Number(order_id)
                            );

                            if (baseOrder && baseOrder?.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.QuarterlyCheckInCustomerIO,
                                    userID,
                                    baseOrder.subscription_id
                                );
                            }
                        } else if (type === OrderType.RenewalOrder) {
                            const renewalOrder = await getRenewalOrder(
                                String(order_id)
                            );

                            if (renewalOrder && renewalOrder.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.QuarterlyCheckInCustomerIO,
                                    userID,
                                    renewalOrder.subscription_id
                                );
                            }
                        }
                    } else if (
                        subscription_type === SubscriptionCadency.Biannually &&
                        isWeightlossProduct(product_href || '')
                    ) {
                        if (type === OrderType.Order) {
                            const baseOrder = await getBaseOrderById(
                                Number(order_id)
                            );

                            if (baseOrder && baseOrder?.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.BiannuallyCheckInCustomerIO,
                                    userID,
                                    baseOrder.subscription_id
                                );
                            }
                        } else if (type === OrderType.RenewalOrder) {
                            const renewalOrder = await getRenewalOrder(
                                String(order_id)
                            );

                            if (renewalOrder && renewalOrder.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.BiannuallyCheckInCustomerIO,
                                    userID,
                                    renewalOrder.subscription_id
                                );
                            }
                        }
                    } else if (
                        subscription_type === SubscriptionCadency.Annually &&
                        isWeightlossProduct(product_href || '')
                    ) {
                        if (type === OrderType.Order) {
                            const baseOrder = await getBaseOrderById(
                                Number(order_id)
                            );

                            if (baseOrder && baseOrder?.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.AnnuallyCheckInCustomerIO,
                                    userID,
                                    baseOrder.subscription_id
                                );
                            }
                        } else if (type === OrderType.RenewalOrder) {
                            const renewalOrder = await getRenewalOrder(
                                String(order_id)
                            );

                            if (renewalOrder && renewalOrder.subscription_id) {
                                await createNewFirstTimeCommJob(
                                    JobSchedulerTypes.AnnuallyCheckInCustomerIO,
                                    userID,
                                    renewalOrder.subscription_id
                                );
                            }
                        }
                    }
                } catch (error) {
                    await forwardOrderToEngineering(
                        String(order_id),
                        userID,
                        'Failed to start check in form job for user'
                    );
                }

                break;
            default:
                break;
        }
    } catch (error) {
        console.error('error with shipping', error, trackerID, trackingNumber);
    }
    // Return a NextResponse with JSON data
    return NextResponse.json({});
}
