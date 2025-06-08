import { RenewalOrderProviderOverview } from '@/app/types/renewal-orders/renewal-orders-types';

/**
 * @author Nathan Cho
 * Modified by Nathan Cho post creation
 * @description transforms the data retrieved from a provider request to the prescription-requests table
 * @param res the data returned from the DB call - TODO: specify param type once they are finalized / integrated into our Supabase config
 * @returns only the information needed for the provider dashboard - {@link PatientOrderProviderDetails}
 */
export const prescriptionRequestToProviderDashboard = (
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

export const prescriptionRequestToProviderDashboardv2 = (
    res: any[]
): PatientOrderProviderDetails[] =>
    res.map((orderItem) => {
        return {
            id: orderItem.order_id,
            patientId: orderItem.customer_uid,
            patientName: `${orderItem.first_name} ${orderItem.last_name}`,
            requestSubmissionTime: orderItem.created_at,
            deliveryState: orderItem.state,
            prescription: orderItem.name + ', ' + orderItem.variant_text,
            approvalStatus: orderItem.order_status,
            licensePhotoUrl: orderItem.license_photo_url ?? '',
            selfiePhotoUrl: orderItem.selfie_photo_url ?? '',
            statusTag: orderItem.status_tag,
            statusTags: orderItem.status_tags,
            vial_dosages: orderItem.vial_dosages,
            productName: orderItem.name,
            variant: orderItem.variant,
            subscriptionType: orderItem.subscription_type,
            status_tag_id: orderItem.status_tag_id,
        };
    });
export const renewalOrderToProviderDashboard = (
    renewalOrders: RenewalOrderProviderOverview[]
): PatientOrderProviderDetails[] => {
    return renewalOrders.map((renewalOrder: RenewalOrderProviderOverview) => ({
        id: renewalOrder.renewal_order_id,
        patientId: renewalOrder.id,
        patientName: `${renewalOrder.first_name} ${renewalOrder.last_name}`,
        requestSubmissionTime: renewalOrder.submission_time,
        deliveryState: renewalOrder.state,
        prescription: `${renewalOrder.name}, ${renewalOrder.variant_text}`,
        approvalStatus: renewalOrder.order_status,
        licensePhotoUrl: renewalOrder.license_photo_url ?? '',
        selfiePhotoUrl: renewalOrder.selfie_photo_url ?? '',
        statusTag: renewalOrder.status_tag,
        statusTags: renewalOrder.status_tags,
        vial_dosages: renewalOrder.vial_dosages ?? undefined,
        productName: renewalOrder.name,
        variant: renewalOrder.variant,
        subscriptionType: renewalOrder.subscription_type,
        status_tag_id: renewalOrder.status_tag_id,
    }));
};

/**
 * @author rgorai
 * @description transforms the data retrieved from a provider request for a patient's general health history
 * @param res the data returned from the DB call - TODO: specify param type once they are finalized / integrated into our Supabase config
 * @returns only the information needed for the provider - {@link IntakeData}
 */
export const generalIntakeToProviderDisplay = (res: any): IntakeData[] =>
    res
        ? Object.entries(res).map(([_, [v]]: [any, any]) => ({
              question: v.question,
              answer: v.answer,
          }))
        : [];
