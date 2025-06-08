import { Status } from '@/app/types/global/global-enumerators';
import {
    getOrderById,
    updateExistingOrderStatusAndExternalMetadataUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '@/app/utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import { updateSubscriptionLastUsedJSON } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    getLatestRenewalOrderForSubscription,
    createUpcomingRenewalOrder,
    createFirstTimeRenewalOrder,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { orderBy } from 'lodash';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return Response.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }

    // Verify the token is in the Bearer format
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return Response.json(
            { message: 'Invalid Authorization Format' },
            { status: 401 }
        );
    }

    const key = process.env.BV_API_KEY;

    if (token !== key) {
        return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { jsonData, orderId, providerId, source } = await req.json();

    try {
        // Define the URL and headers for the request
        const url = `${process.env.TMC_URL!}/ReceiveOrder`;
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        // Convert the JSON data to a URL-encoded string
        const encodedData = new URLSearchParams({
            AuthorizationKey: process.env.TMC_KEY!,
            Values: JSON.stringify(jsonData),
        }).toString();

        // Send the POST request with the encoded data
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: encodedData,
        });

        // Check if the request was successful
        if (!response.ok) {
            SaveJsonUsedToFailureTable(
                jsonData,
                orderId,
                providerId,
                'TMC: Error in POST Method while sending order.',
                response,
                'tmc',
                source
            );
            return Response.json({
                result: Status.Failure,
                reason: 'tmc-post-error',
            });
        }

        console.log('testing result log: ', response);

        try {
            // Parse the response as JSON
            const result = await response.json();

            insertPharmacyOrderAudit(
                JSON.stringify(jsonData),
                'TMC',
                orderId,
                providerId,
                source,
                result
            );
            updateSubscriptionLastUsedJSON(orderId, 'tmc', jsonData);

            if (!result) {
                return Response.json({
                    result: Status.Failure,
                    reason: 'tmc-body-error',
                });
            }

            if (
                result.request_status === 'success' &&
                result.order_status === 'Order Received'
            ) {
                //If it is successful we update the order to a finalized state.
                const { error } =
                    await updateExistingOrderStatusAndExternalMetadataUsingId(
                        Number(orderId),
                        'Approved-CardDown-Finalized',
                        { tmc_order_id: result.order_id }
                    );

                /**
                 * 12/23/2024 - Nathan Cho:
                 * Adding a change here to make this work for renewal orders - TMC:
                 */

                try {
                    let latestRenewalOrder = undefined;

                    const { data: orderData, error: orderError } =
                        await getOrderById(orderId);

                    if (orderData?.subscription_id) {
                        latestRenewalOrder =
                            await getLatestRenewalOrderForSubscription(
                                orderData.subscription_id
                            );
                    }

                    if (latestRenewalOrder) {
                        await createUpcomingRenewalOrder(latestRenewalOrder);
                    } else {
                        await createFirstTimeRenewalOrder(orderId);
                    }
                } catch (error) {
                    console.error(
                        'TMC renewal generation error Details ',
                        error
                    );
                }

                return Response.json({
                    result: Status.Success,
                    reason: null,
                });
            } else {
                SaveJsonUsedToFailureTable(
                    jsonData,
                    orderId,
                    providerId,
                    'TMC: Error in POST Method while sending order.',
                    result,
                    'tmc',
                    source
                );
                return Response.json({
                    result: Status.Failure,
                    reason: 'tmc-script-error',
                });
            }
        } catch (error: any) {
            SaveJsonUsedToFailureTable(
                jsonData,
                orderId,
                providerId,
                'TMC: Error in reading body response.',
                response,
                'tmc',
                source
            );

            return Response.json({
                result: Status.Failure,
                reason: 'tmc-general-error: ' + error.message,
            });
        }
    } catch (error: any) {
        SaveJsonUsedToFailureTable(
            jsonData,
            orderId,
            providerId,
            'TMC: Error in reading body response.',
            null,
            'tmc',
            source
        );

        return Response.json({
            result: Status.Failure,
            reason: 'tmc-general-catch-error: ' + error.message,
        });
    }
}
