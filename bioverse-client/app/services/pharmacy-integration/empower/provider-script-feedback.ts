'use server';

import {
    updateExistingOrderStatusUsingId,
    updateOrder,
    updateOrderPharmacyScript,
} from '@/app/utils/database/controller/orders/orders-api';
import { chargeCustomerV2 } from '../../stripe/charge-customer';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import {
    updateRenewalOrder,
    updateRenewalOrderByRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { auditRenewalOrder } from '@/app/utils/database/controller/renewal_order_audit/renewal_order_audit';
import { Status } from '@/app/types/global/global-enumerators';
import {
    updatePrescriptionProvider,
    updatePrescriptionScript,
} from '@/app/utils/functions/prescription-scripts/prescription-scripts-utils';
import { getURL } from '@/app/utils/functions/utils';
import { updateRecentVariants } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { generateCustomOrderIdForReferenceOrder } from '@/app/utils/database/controller/custom_orders/custom_orders_api';

export default async function processEmpowerScript(
    order_id: string,
    order_status: string,
    provider_id: string,
    payload: EmpowerPrescriptionOrder,
    orderType: OrderType,
    subscription_id: string,
    orderData: any,
    variant_index: number
): Promise<{ result: Status; reason: string | null }> {
    if (orderType === OrderType.Order) {
        await updateOrderPharmacyScript(payload, order_id);
    }

    const chargeStatus: {
        result: string;
        reason: string | null;
        actually_paid?: boolean;
    } =
        order_status === 'Payment-Completed' ||
        order_status === 'Approved-CardDown-Finalized' ||
        order_status === RenewalOrderStatus.CheckupComplete_Unprescribed_Paid ||
        order_status ===
            RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid ||
        order_status === RenewalOrderStatus.CheckupComplete_Prescribed_Paid
            ? { result: 'success', reason: null }
            : await chargeCustomerV2(order_id, provider_id, orderType);

    if (chargeStatus.result === 'success') {
        //Once the script itself is sent, there is nothing more for the provider to do here.
        //However we do it PRIOR to sending the script such that if the script fails, it will update the status.
        const details = getOrderStatusDetails(order_status);
        if (
            orderType === OrderType.RenewalOrder &&
            (!details.isPaid ||
                order_status ===
                    RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid)
        ) {
            // const updatedPrescription = await updatePrescriptionScript(payload)
            // Save script to user
            const updatedDateScript = updatePrescriptionScript(
                payload,
                orderData.renewal_order_id
            );
            const updatedProviderScript =
                updatePrescriptionProvider(updatedDateScript);

            const res = await updateRenewalOrderByRenewalOrderId(
                orderData.renewal_order_id,
                {
                    prescription_json: updatedProviderScript,
                    order_status:
                        RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                }
            );

            return { result: res.status, reason: null };
        } else {
            const updatedProviderScript = updatePrescriptionProvider(payload);

            // const res = await sendEmpowerRequestV2(
            //     updatedProviderScript,
            //     order_id,
            //     provider_id,
            //     orderType,
            //     orderData
            // );

            const apiUrl = await getURL();
            const empower_script_result = await fetch(
                `${apiUrl}/api/empower/send-script`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.BV_API_KEY}`,
                    },
                    body: JSON.stringify({
                        jsonPayload: updatedProviderScript,
                        orderId:
                            orderType === OrderType.Order
                                ? orderData.id
                                : orderData.renewal_order_id,
                        providerId: provider_id,
                        orderType: orderType,
                        renewal_order_id:
                            orderData.renewal_order_id || undefined,
                        subscriptiond: subscription_id,
                        source: ScriptSource.Manual,
                    }),
                }
            );

            const res = await empower_script_result.json();

            if (orderType === OrderType.Order) {
                await updateOrder(Number(order_id), {
                    pharmacy_script: updatedProviderScript,
                    variant_index,
                });

                if (res.result === Status.Success) {
                    /**
                     * Change status to ACDF once a success message comes through as success
                     */
                    const { error } = await updateExistingOrderStatusUsingId(
                        Number(order_id),
                        'Approved-CardDown-Finalized'
                    );

                    if (error) {
                        console.error(
                            'Empower sending script issue: ',
                            error.message
                        );
                    }
                } else {
                    return { result: Status.Failure, reason: null };
                }
            } else if (orderType === OrderType.RenewalOrder) {
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id,
                    {
                        prescription_json: updatedProviderScript,
                        variant_index,
                    }
                );
                if (Number(subscription_id) && variant_index) {
                    await updateRecentVariants(
                        Number(subscription_id),
                        variant_index
                    );
                }
            }
        }
        return { result: Status.Success, reason: null };
    } else {
        return { result: Status.Success, reason: 'Payment-Failure' };
    }
}

// To be used for automatically sending the script via invoice.paid events
export async function processAutomaticEmpowerScript(
    payload: any,
    order_id: number,
    provider_id: string,
    orderData: any,
    source: string,
    resend?: boolean
): Promise<Status> {
    const updatedDateScript = updatePrescriptionScript(
        payload,
        orderData.renewal_order_id
    );

    const updatedProviderScript = updatePrescriptionProvider(updatedDateScript);

    // const res = await sendEmpowerRequestV2(
    //     updatedProviderScript,
    //     '', // order id unused
    //     provider_id,
    //     OrderType.RenewalOrder,
    //     orderData
    // );

    const apiUrl = await getURL();

    const empower_script_result = await fetch(
        `${apiUrl}/api/empower/send-script`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                jsonPayload: updatedProviderScript,
                orderId: order_id,
                providerId: provider_id,
                orderType: OrderType.RenewalOrder,
                renewal_order_id: orderData.renewal_order_id,
                subscriptionId: null,
                source,
                overrideAudit: resend ?? false,
            }),
        }
    );

    const res = await empower_script_result.json();

    if (res.result == 'success') {
        //If it is successful we update the order to a finalized state.
        await updateRenewalOrder(Number(order_id), {
            order_status: RenewalOrderStatus.PharmacyProcessing,
            variant_index: orderData.variant_index || -1,
        });

        await updateRecentVariants(
            orderData.subscription_id,
            orderData.variant_index
        );

        return Status.Success;
    } else {
        await auditRenewalOrder(
            orderData.renewal_order_id,
            JSON.stringify(orderData),
            'Unable to send empower request for renewal order'
        );
        return Status.Failure;
    }
}

export async function processCustomPrescriptionEmpowerScript(
    script: EmpowerGeneratedScript,
    order_id: string,
    provider_id: string,
    source: string,
    source_uuid: string,
    product_href: string,
    patient_id: string
): Promise<Status> {
    const apiUrl = await getURL();

    const custom_order_id = await generateCustomOrderIdForReferenceOrder(
        order_id
    );

    script.script.poNumber = custom_order_id;
    script.script.clientOrderId = custom_order_id;

    const empower_script_result = await fetch(
        `${apiUrl}/api/empower/send-script`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                jsonPayload: script.script,
                providerId: provider_id,
                orderType: OrderType.CustomOrder,
                orderId: order_id,
                custom_order_id,
                renewal_order_id: null,
                subscriptionId: null,
                source,
                source_uuid,
                product_href,
                patient_id,
            }),
        }
    );

    const res = await empower_script_result.json();

    if (res.result == 'success') {
        //If it is successful we update the order to a finalized state.
        return Status.Success;
    } else {
        return Status.Failure;
    }
}
