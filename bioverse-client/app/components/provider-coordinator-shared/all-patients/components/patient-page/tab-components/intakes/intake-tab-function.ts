'use server';

import { getAllActionItems } from '@/app/utils/database/controller/action-items/action-items-actions';
import { getPatientOrderTabData } from '@/app/utils/database/controller/orders/orders-api';
import { getRenewalListForIntakesTabAllPatients } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

export async function obtainIntakeTabData(patient_id: string) {
    const { data: order_data, error: order_error } =
        await getPatientOrderTabData(patient_id);

    const renewal_data = await getAllActionItems(patient_id);
    console.log(renewal_data);

    return { order_data: order_data, renewal_data: renewal_data };
}
