'use server';

import { chargeCustomerV2 } from '../../stripe/charge-customer';
import { OrderType } from '@/app/types/orders/order-types';
import { updateOrderPharmacyScript } from '@/app/utils/database/controller/orders/orders-api';
import { getURL } from '@/app/utils/functions/utils';
import { Status } from '@/app/types/global/global-enumerators';

export default async function ProcessTMCScript(
    order_id: string,
    order_status: string,
    provider_id: string,
    customer_id: string,
    payload: TMCPrescriptionForm
): Promise<{ result: Status; reason: string | null }> {
    await updateOrderPharmacyScript(payload, order_id);

    const chargeStatus =
        order_status == 'Payment-Completed' ||
        order_status == 'Approved-CardDown-Finalized' //if order is already paid for, then it is automatic success.
            ? { result: 'success', reason: null }
            : await chargeCustomerV2(order_id, provider_id, OrderType.Order);

    if (chargeStatus.result === 'success') {
        // const resp = await sendOrderToTailormadeHealthEMRV2(
        //     payload,
        //     order_id,
        //     provider_id,
        //     customer_id
        // );

        const apiUrl = await getURL();

        const tmc_script_result = await fetch(`${apiUrl}/api/tmc/send-script`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                jsonData: payload,
                orderId: order_id,
                providerId: provider_id,
            }),
        });

        const result = await tmc_script_result.json();
        console.log('logging tmc result: ', result);
        return result;
    } else {
        /**
         * Note: Nathan Cho - failure loop handles everything here now.
         */

        // await updateExistingOrderStatus(Number(order_id), 'Payment-Declined');
        return { result: Status.Success, reason: null };
    }
}
