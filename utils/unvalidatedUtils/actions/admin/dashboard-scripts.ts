'use server';

import { concat } from 'lodash';
import { getAllOrdersForAdminTable, getAllOrdersForProviderOrderTablev2 } from '../../database/controller/orders/orders-api';
import { getAllRenewalOrdersForAdminOrderTable, getAllRenewalOrdersForProviderOrderTablev2 } from '../../database/controller/renewal_orders/renewal_orders';
import {
    prescriptionRequestToAdminDashboard,
    renewalOrderToProviderDashboard,
} from './parsers';
import { getProviderLicensedStates } from '../../database/controller/providers/providers-api';
import { USStates } from '@/app/types/enums/master-enums';
import { combineEventHandlers } from 'recharts/types/util/ChartUtils';

export async function AdminOrderDashboardFetch() {
    const { data: completeOrderData, error: orderError } =
        await getAllOrdersForAdminTable();

    const renewalOrderData = await getAllRenewalOrdersForAdminOrderTable();

    if (!completeOrderData && orderError) {
        console.error(
            'Order Fetching for general orders failed. error message: ',
            orderError.message
        );
    }
    const generalOrders = prescriptionRequestToAdminDashboard(
        completeOrderData ?? []
    );

    const renewalOrders = renewalOrderToProviderDashboard(renewalOrderData);

    const mergedOrders = concat(renewalOrders, generalOrders);
    
    mergedOrders.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
    });
    

    return mergedOrders;
}
