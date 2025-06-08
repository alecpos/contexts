/**
 * @author Nathan Cho
 * Modified by Nathan Cho post creation
 * @description transforms the data retrieved from a provider request to the prescription-requests table
 * @param res the data returned from the DB call - TODO: specify param type once they are finalized / integrated into our Supabase config
 * @returns only the information needed for the provider dashboard - {@link PatientOrderProviderDetails}
 */
export const prescriptionRequestToAdminDashboard = (
    res: any[],
): PatientOrderProviderDetailsAdminOrderAPI[] =>
    res.map((orderItem) => ({
        id: orderItem.id,
        patientId: orderItem.customer_uid,
        patientName: `${orderItem.patient.first_name} ${orderItem.patient.last_name}`,
        requestSubmissionTime: orderItem.created_at,
        deliveryState: orderItem.patient.state,
        prescription: orderItem.product.name + ', ' + orderItem.variant_text,
        approvalStatus: orderItem.order_status,
        licensePhotoUrl: orderItem.patient.license_photo_url ?? '',
        selfiePhotoUrl: orderItem.patient.selfie_photo_url ?? '',
        patientDOB: orderItem.patient.date_of_birth,
        email: orderItem.patient.email,
        patientAddress: {
            line1: orderItem.address_line1,
            line2: orderItem.address_line2 ?? '',
            city: orderItem.city,
            state: orderItem.state,
            zip: orderItem.zip,
        },
        patientGender: orderItem.patient.sex_at_birth,
        patientPhone: orderItem.patient.phone_number,
        stripeCustomerId: orderItem.patient.stripe_customer_id,
        tracking_number: orderItem.tracking_number,
    }));

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
