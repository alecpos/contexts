import { RenewalOrderProviderOverview } from '@/app/types/renewal-orders/renewal-orders-types';
import { getDateDayDifference, getDateHourDifference } from '../../functions/dates';

function getTrackingId(orderItem: any): string | null {
    if (orderItem.assigned_pharmacy === 'empower') {
        return orderItem.external_tracking_metadata?.eipOrderId ;
    } 

    else if (orderItem.assigned_pharmacy === 'tmc') {
        return orderItem.external_tracking_metadata?.tmc_order_id || null;
    } else {
        return '-';
    }
}

export const prescriptionRequestToAdminDashboard = (
    res: any[],
): PatientOrderAdminDetails[] =>
    res.map((orderItem) => {
        // Check if both received and completed are populated
        const hasValidProcessingTime = orderItem.received != null && orderItem.completed != null;
        
        return {
            id: orderItem.id,
            pharmacy_id: getTrackingId(orderItem),
            providerName: orderItem.provider_name,
            patientId: orderItem.customer_uid,
            state: orderItem.state,
            patient_first_name:orderItem.first_name,
            patient_last_name:orderItem.last_name,
            date_of_birth:orderItem.date_of_birth,
            pharmacy: orderItem.assigned_pharmacy,
            product_name: orderItem.variant_text != null ? `${orderItem.product_name} ${orderItem.variant_text}` : orderItem.product_name,
            order_status: orderItem.order_status,
            shipping_status: orderItem.shipping_status,
            amount_paid: orderItem.price,
            variant: orderItem.variant_text,

            // Include processing_time only if both received and completed are populated
            processing_time: hasValidProcessingTime 
                ? getDateHourDifference(new Date(orderItem.received), new Date(orderItem.completed))
                : null,
            tracking_number: orderItem.tracking_number,
            updated: orderItem.last_updated,
            prescribed_time:orderItem.prescribed_time,
            created_at: orderItem.created_at,
            is_escalated:orderItem.is_escalated

        };
    });



export const renewalOrderToProviderDashboard = (
    renewalOrders: any[],
): PatientOrderAdminDetails[] => {
    return renewalOrders.map((renewalOrder) => {
        const hasValidProcessingTime = renewalOrder.received != null && renewalOrder.completed != null;
        
        return {
            id: renewalOrder.id,
            pharmacy_id: getTrackingId(renewalOrder),
            providerName: renewalOrder.provider_name,
            patientId: renewalOrder.customer_uid,
            state: renewalOrder.state,
            patient_first_name:renewalOrder.first_name,
            patient_last_name:renewalOrder.last_name,
            date_of_birth:renewalOrder.date_of_birth,
            pharmacy: renewalOrder.assigned_pharmacy,
            product_name: renewalOrder.product_name,
            order_status: renewalOrder.order_status,
            shipping_status: renewalOrder.shipping_status,
            amount_paid: renewalOrder.price,
            variant: renewalOrder.variant_text,

            // Include processing_time only if both received and completed are populated
            processing_time: hasValidProcessingTime 
                ? getDateHourDifference(new Date(renewalOrder.received), new Date(renewalOrder.completed))
                : null,
            tracking_number: renewalOrder.tracking_number,
            updated: renewalOrder.last_updated,
            prescribed_time:renewalOrder.prescribed_time,
            created_at: renewalOrder.created_at,
            is_escalated:renewalOrder.is_escalated
        };
    });
};