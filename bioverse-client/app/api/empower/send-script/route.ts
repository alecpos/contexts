import { createRenewalOrdersForRenewals } from '@/app/(testing_and_development)/olivier-dev/utils';
import { getEmpowerTokenAsync } from '@/app/services/pharmacy-integration/empower/token';
import { autoUpdateStripeSubscriptionRenewalDate } from '@/app/services/stripe/subscriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderStatus, OrderType } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    generateCustomOrderIdForReferenceOrder,
    insertNewCustomOrder,
} from '@/app/utils/database/controller/custom_orders/custom_orders_api';
import { OrderDataAuditActions } from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import {
    createOrderDataAudit,
    hasOrderPharmacyScriptBeenSent,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import { updateExistingOrderStatusUsingId } from '@/app/utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '@/app/utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import {
    incrementSinceLastCheckup,
    updateRecentVariants,
    updateSubscriptionLastUsedJSON,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    createFirstTimeRenewalOrder,
    createUpcomingRenewalOrderWithRenewalOrderId,
    getRenewalOrder,
    updateRenewalOrder,
    updateRenewalOrderFromRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
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

    const {
        jsonPayload,
        orderId,
        providerId,
        orderType,
        renewal_order_id,
        subscriptionId,
        custom_order_id,
        source,
        source_uuid,
        patient_id,
        product_href,
        overrideAudit,
    } = await req.json();

    const hasSent = await hasOrderPharmacyScriptBeenSent(
        orderId,
        renewal_order_id
    );

    if (hasSent && !overrideAudit) {
        await createOrderDataAudit(
            orderId,
            renewal_order_id,
            `Order ${
                renewal_order_id ?? orderId
            } attempted to send a dupliacte prescription to Empower.`,
            OrderDataAuditActions.DuplicateScriptBlocked,
            {
                source: source,
                pharmacy: 'Empower',
            },
            { script_json: jsonPayload }
        );

        return Response.json(
            {
                result: Status.Failure,
                reason: 'script-already-sent-safeguard',
            },
            { status: 409 } //409 = conflict with resource
        );
    }

    try {
        const accessToken = await getEmpowerTokenAsync();
        const url = process.env.EMPOWER_API_URL_RX!;
        const { jsonContent, modified } = updateAddressLine2(jsonPayload);
        const new_jsonContent = updateProvidrToBobbyDesai(jsonContent);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Token: accessToken.token,
            },
            body: JSON.stringify(new_jsonContent),
        });

        if (response.status !== 200) {
            const responseContent = await response.text();
            if (orderType === OrderType.Order) {
                SaveJsonUsedToFailureTable(
                    jsonContent,
                    orderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'Empower',
                    source
                );
            } else if (orderType === OrderType.RenewalOrder) {
                SaveJsonUsedToFailureTable(
                    jsonContent,
                    renewal_order_id,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'Empower',
                    source
                );
            } else if (orderType === OrderType.CustomOrder) {
                SaveJsonUsedToFailureTable(
                    jsonContent,
                    orderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'Empower',
                    source
                );
            }

            return Response.json({
                result: Status.Failure,
                reason: 'empower-script-error: ' + responseContent,
            });
        }

        const model = await response.json();

        if (orderType === OrderType.Order) {
            await updateSubscriptionLastUsedJSON(
                orderId,
                'empower',
                jsonContent
            );

            await insertPharmacyOrderAudit(
                jsonContent,
                'Empower',
                orderId,
                providerId,
                source,
                model
            );
            await createFirstTimeRenewalOrder(orderId);
        } else if (orderType === OrderType.RenewalOrder) {
            await updateSubscriptionLastUsedJSON(
                orderId,
                'empower',
                jsonContent
            );

            await insertPharmacyOrderAudit(
                jsonContent,
                'Empower',
                renewal_order_id,
                providerId,
                source,
                model
            );

            if (modified) {
                await updateRenewalOrderFromRenewalOrderId(renewal_order_id, {
                    prescription_json: JSON.stringify(jsonContent),
                });
            }
            await createUpcomingRenewalOrderWithRenewalOrderId(
                renewal_order_id
            );
        } else if (orderType === OrderType.CustomOrder) {
            // For custom orders, orderId is the reference order id
            await insertNewCustomOrder(
                custom_order_id,
                orderId,
                jsonContent,
                source_uuid,
                product_href,
                patient_id
            );
        }

        if (orderType === OrderType.RenewalOrder) {
            if (subscriptionId) {
                await autoUpdateStripeSubscriptionRenewalDate(
                    orderId,
                    subscriptionId
                );
            }

            await updateRenewalOrder(Number(orderId), {
                order_status: RenewalOrderStatus.PharmacyProcessing,
            });

            await incrementSinceLastCheckup(subscriptionId);

            /**
             * Olivier says: (1/30/25) - We should deprecate the below and not fire it.
             */
            const renewalOrder = await getRenewalOrder(renewal_order_id);
            if (renewalOrder) {
                await updateRecentVariants(
                    subscriptionId,
                    renewalOrder.variant_index
                );
            }
        } else if (orderType === OrderType.Order) {
            const { error } = await updateExistingOrderStatusUsingId(
                Number(orderId),
                OrderStatus.ApprovedCardDownFinalized
            );
        }

        await createOrderDataAudit(
            orderId,
            renewal_order_id ?? undefined,
            `Empower Script for Order: ${orderId} has been sent.`,
            !overrideAudit
                ? OrderDataAuditActions.PrescriptionSent
                : OrderDataAuditActions.ResendPrescription,
            {
                source: source,
                pharmacy: 'empower',
            },
            { script_json: jsonPayload }
        );

        return Response.json(
            { result: Status.Success, reason: null },
            { status: 200 }
        );
    } catch (error: any) {
        await SaveJsonUsedToFailureTable(
            jsonPayload,
            renewal_order_id,
            providerId,
            'Error occurred in sending script: ' + error.message,
            null,
            'Empower',
            source
        );

        return Response.json(
            { result: Status.Failure, reason: error.message },
            { status: 400 }
        );
    }
}

// Extra safety to check addressLine2 is null if empty string
function updateAddressLine2(jsonData: any) {
    let modified = false;
    for (const rx of jsonData.newRxs) {
        if (rx.patient.address.addressLine2 === '') {
            rx.patient.address.addressLine2 = null;
            modified = true;
        }
    }
    return { jsonContent: jsonData, modified };
}

function updateProvidrToBobbyDesai(jsonData: any) {
    for (const rx of jsonData.newRxs) {
        if (rx.prescriber.npi !== '1013986835') {
            rx.prescriber = {
                npi: '1013986835',
                stateLicenseNumber: 'ME80459',
                lastName: 'Desai',
                firstName: 'Bobby',
                address: {
                    city: 'New York',
                    postalCode: '10014',
                    countryCode: 'US',
                    addressLine1: '875 Washington Street',
                    stateProvince: 'NY',
                },
                phoneNumber: '7476668167',
            };
        }
    }

    return jsonData;
}
