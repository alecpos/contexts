'use server';

import { createSupabaseServerComponentClient } from '../../clients/supabaseServerClient';

// export const submitRequestToProvider = async (
//   details: PatientRequestCreationDetails
// ): Promise<SupabaseResponse> => {
//   const supabase = createSupabaseServerClient()

//   const { data, error } = await supabase
//     .from('prescription_requests')
//     .insert({
//       provider_id: details.providerId,
//       patient_id: details.patientId,
//       patient_name: details.patientName,
//       delivery_state: details.deliveryState,
//       prescription: details.prescription,
//       request_submission_time: new Date().toISOString(),
//     })

//   if (error) return { error: error.message, data: null }

//   return { data }
// }

//Deprecated Method from Ron G. Work trial
// export const getPatientRequests = async (providerId: string) => {
//   const supabase = createSupabaseServerClient()

//   const { data, error } = await supabase
//     .from('orders')
//     .select(`
//         *,
//         patient:profiles!patient_id (
//           first_name,
//           last_name
//         )
//     `)
//     // .eq('provider_id', providerId)
//     .order('request_submission_time', { ascending: false })

//   if (error) return { error: error.message, data: null }

//   return { data }
// }

export async function getAllReviewableOrdersFromOrdersTable() {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
    *,
    product:products!product_href (
      name
    ),
    patient:profiles!customer_uid (
      first_name,
      last_name,
      state
    )
    `,
        )
        .in('order_status', [
            'Unapproved-NoCard',
            'Unapproved-CardDown',
            'Approved-NoCard',
            'Approved-CardDown',
            'Pending-Customer-Response',
            'Denied-CardDown',
            'Denied-NoCard',
        ])
        .order('created_at', { ascending: false });

    if (error) return { error: error, data: null };

    return { data: data, error: null };
}

export async function getAllPrescribableOrdersFromOrdersTable() {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
    *,
    product:products!product_href (
      name
    ),
    patient:profiles!customer_uid (
      first_name,
      last_name,
      state
    )
    `,
        )
        .in('order_status', [
            'Payment-Completed',
            'Denied-CardDown',
            'Denied-NoCard',
            'Pending-Customer-Response',
            'Approved-NoCard',
            'Approved-CardDown',
            'Approved-NoCard-Finalized',
            'Approved-CardDown-Finalized',
        ])
        .order('created_at', { ascending: false });

    if (error) return { error: error.message, data: null };

    return { data: data, error: null };
}

export async function getOrderByPatientId(patientId: string) {
    console.log(patientId);
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('orders')
        .select(
            `
      id,
      created_at,
      variant_text,
      address_line1,
      address_line2,
      state,
      zip,
      city,
      product_href,
      product:products!product_href (
        name
      )
    `,
        )
        .eq('customer_uid', patientId)
        .eq('environment', process.env.NEXT_PUBLIC_ENVIRONMENT);

    if (error) {
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

/**
 * Deprecated method made by Ron for back-end implementation of the request orders.
 * @param orderId
 * @returns
 */
// export const getRequestById = async (orderId: string) => {
//   const supabase = createSupabaseBrowserClient()

//   const { data, error } = await supabase
//     .from('prescription_requests')
//     .select(`
//         id, patient_id, prescription,
//         patient:profiles!patient_id (
//           first_name,
//           last_name
//         )
//     `)
//     .eq('id', orderId)
//     .single()

//   if (error) return { error: error.message, data: null }

//   return { data }
// }
