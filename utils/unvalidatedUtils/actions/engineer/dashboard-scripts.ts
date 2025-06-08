'use server';

import { getEngineerStatusTagOrders } from '../../database/controller/patient-status-tags/patient-status-tags-api';

export async function EngineerDashboardFetch() {
    const { data: completeOrderData, error: orderError } =
        await getEngineerStatusTagOrders();

    return completeOrderData;
}
