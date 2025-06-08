import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function handlePrescriberNotificationCounts(jsonData: any) {
    const supabase = createSupabaseServerComponentClient();

    // Map the JSON data to the table columns
    const notificationData = {
        clinician_id: jsonData.Data.ClinicianId,
        clinic_id: jsonData.Data.ClinicId,
        pending_prescription_count:
            jsonData.Data.Total.PendingPrescriptionCount,
        transmission_error_count: jsonData.Data.Total.TransmissionErrorCount,
        refill_request_count: jsonData.Data.Total.RefillRequestCount,
        change_request_count: jsonData.Data.Total.ChangeRequestCount,
        last_updated: new Date(), // Set the current timestamp
    };

    // Upsert the data into the 'dose_spot_provider_notifications' table
    const {
        data: prescriptionNotificationData,
        error: prescriptionNotificationError,
    } = await supabase
        .from('dose_spot_provider_notifications')
        .upsert(notificationData, { onConflict: 'clinician_id' });

    if (prescriptionNotificationError) {
        throw prescriptionNotificationError;
    }

    // Return a successful response
    return new NextResponse(
        JSON.stringify({ message: 'Notification processed successfully' }),
        {
            status: 200, // OK
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
