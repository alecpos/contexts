'use server';

import { concat } from 'lodash';
import {
    getAllLeadCoordinatorOrders,
    getAllOrdersForCoordinatorOrderTable,
} from '../../database/controller/orders/orders-api';
import { getAllRenewalOrdersForCoordinatorOrderTable } from '../../database/controller/renewal_orders/renewal_orders';
import {
    prescriptionRequestToCoordinatorDashboardv2,
    renewalOrderToCoordinatorDashboard,
} from './parsers';

export async function CoordinatorDashboardFetch() {
    const { data: completeOrderData, error: orderError } =
        await getAllOrdersForCoordinatorOrderTable();

    const renewalOrderData =
        await getAllRenewalOrdersForCoordinatorOrderTable();

    if (!completeOrderData && orderError) {
        console.error(
            'Order Fetching for general orders failed. error message: ',
            orderError.message
        );
    }

    const generalOrders = prescriptionRequestToCoordinatorDashboardv2(
        completeOrderData ?? []
    );
    const renewalOrders = renewalOrderToCoordinatorDashboard(renewalOrderData);
    const mergedOrders = concat(renewalOrders, generalOrders);

    // console.log('merged orders: ', mergedOrders.length);

    return mergedOrders;
}

export async function LeadCoordinatorDashboardFetch() {
    const data = await getAllLeadCoordinatorOrders();

    console.log(data);

    const lead_orders = prescriptionRequestToCoordinatorDashboardv2(data ?? []);

    return lead_orders;
}
