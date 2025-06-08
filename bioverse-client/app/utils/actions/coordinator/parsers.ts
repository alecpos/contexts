import { OrderCoordinatorOverview } from '@/app/types/orders/order-types';
import { RenewalOrderCoordinatorOverview } from '@/app/types/renewal-orders/renewal-orders-types';

export const prescriptionRequestToCoordinatorDashboard = (
    res: any[]
): PatientOrderProviderDetails[] =>
    res.map((orderItem) => ({
        id: orderItem.id,
        patientId: orderItem.customer_uid,
        patientName: `${orderItem.first_name} ${orderItem.last_name}`,
        requestSubmissionTime: orderItem.created_at,
        deliveryState: orderItem.state,
        prescription: orderItem.name + ', ' + orderItem.variant_text,
        approvalStatus: orderItem.order_status,
        licensePhotoUrl: orderItem.license_photo_url ?? '',
        selfiePhotoUrl: orderItem.selfie_photo_url ?? '',
        statusTag: orderItem.statusTag,
        vial_dosages: orderItem.vial_dosages,
        productName: orderItem.name,
        variant: orderItem.variant,
        subscriptionType: orderItem.subscription_type,
        status_tag_id: orderItem.status_tag_id,
    }));
export const prescriptionRequestToCoordinatorDashboardv2 = (
    res: any[]
): PatientOrderCoordinatorDetails[] =>
    res.map((orderItem) => ({
        id: orderItem.id ?? orderItem.order_id,
        patientId: orderItem.customer_uid,
        patientName: `${orderItem.first_name} ${orderItem.last_name}`,
        requestSubmissionTime: orderItem.created_at,
        deliveryState: orderItem.state,
        prescription: orderItem.name + ', ' + (orderItem.variant_text ?? ''),
        approvalStatus: orderItem.order_status,
        licensePhotoUrl: orderItem.license_photo_url ?? '',
        selfiePhotoUrl: orderItem.selfie_photo_url ?? '',
        statusTag: orderItem.status_tag,
        statusTags: orderItem.status_tags,
        vial_dosages: orderItem.vial_dosages,
        productName: orderItem.name,
        variant: orderItem.variant,
        subscriptionType: orderItem.subscription_type,
    }));

export const renewalOrderToCoordinatorDashboard = (
    renewalOrders: RenewalOrderCoordinatorOverview[]
): PatientOrderCoordinatorDetails[] => {
    return renewalOrders.map(
        (renewalOrder: RenewalOrderCoordinatorOverview) => {
            return {
                id: renewalOrder.renewal_order_id,
                patientId: renewalOrder.id,
                patientName: `${renewalOrder.first_name} ${renewalOrder.last_name}`,
                requestSubmissionTime: renewalOrder.submission_time,
                deliveryState: renewalOrder.state,
                prescription: `${renewalOrder.name}, ${renewalOrder.variant_text}`,
                approvalStatus: renewalOrder.order_status,
                licensePhotoUrl: renewalOrder.license_photo_url,
                selfiePhotoUrl: renewalOrder.selfie_photo_url,
                statusTag: renewalOrder.status_tag,
                statusTags: renewalOrder.status_tags,
                productName: renewalOrder.name,
            };
        }
    );
};
