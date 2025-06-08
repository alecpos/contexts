'use server';

import { OrderType } from '@/app/types/orders/order-types';
import { getOrderPillStatus } from '@/app/utils/actions/intake/order-util';
import { getGLP1Statuses } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import {
    fetchOrderData,
    getCurrentAssignedDosageForOrder,
    getFirstCompletedOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { getUserStatusTag } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

/**
 * Fetches data required for a provider to review a new intake OR a renewal order
 * Used in ProviderReviewTopInfoComponent and elsewhere
 * @param orderId - The order ID
 * @returns The data required for the intake view
 */
export async function coordinatorTaskDataFetch(orderId: string) {
    // First fetch order data as it's required for subsequent calls
    const { type: orderType, data: orderData } = await fetchOrderData(orderId);
    if (!orderData) throw new Error('Order data not found');

    const patient_id =
        orderType === OrderType.Order
            ? orderData.customer_uid
            : orderData.customer_uuid;

    // Group independent API calls together
    const [current_assigned_dosage, glp1Statuses, patientData, statusTagData] =
        await Promise.all([
            getCurrentAssignedDosageForOrder(
                orderType === OrderType.Order
                    ? orderData.id
                    : orderData.renewal_order_id.split('-')[0]
            ),
            getGLP1Statuses(patient_id),
            getPatientInformationById(patient_id).then((res) => res.data),
            getUserStatusTag(patient_id, orderId).then((res) => res.data),
        ]);

    // Get questionnaire response

    let baseOrderId = orderId;

    if (orderData.renewal_order_id) {
        baseOrderId = orderData.original_order_id;
    }

    // Get order pill statuses
    const orderPillStatuses = await getOrderPillStatus(
        orderType === OrderType.Order ? orderId : orderData?.original_order_id,
        orderData?.order_status,
        orderData?.product_href
    );

    const firstOrder = await getFirstCompletedOrder(
        patient_id,
        orderData.product_href
    );

    let isFirstOrder = true;
    if (firstOrder) {
        if (orderType === OrderType.Order) {
            if (firstOrder.id !== orderData.id) {
                isFirstOrder = false;
            }
        }
    }

    /**
     * For implementation of the the autoship indicators
     * The data is currently dirty, so we need to clean it up before we can use it. At that point, logic would look like this:
     *
     * We should check if the current order is a renewal order and check whether it's been shipped.
     * If it has been shipped, we should check if the order was autoshipped, and if so, return autoshipped-true
     * If it hasn't been shipped, we should check if the previous order was autoshipped, and if so, return autoshipped-true
     * Might be good to return {autoshipped: true/false, currentOrPreviousOrder: "previous"}
     * Then the StatusPill could either say "This order was autoshipped" or "The customer's previous order was autoshipped"
     */
    return {
        patientData,
        orderData,
        orderType,
        orderPillStatuses,
        statusTag: statusTagData?.status_tag,
        currentDosage: current_assigned_dosage,
        glp1Statuses,
    };
}

//
