'use server';

import { insertNewOrderMatchFailure } from '@/app/utils/database/controller/ds_match_failures/ds-match-failures';
import { getBestOrderMatchesFromDatabase } from '@/app/utils/database/controller/orders/order-matching-dose-spot';
import { getUserIdFromDoseSpotId } from '@/app/utils/database/controller/profiles/profiles';
import getDoseSpotPrescriptionWithPrescriptionIdAndPatientId from '@/app/services/dosespot/v1/prescription/prescription';

export async function getBestMatchingOrder(
    statusUpdateData: DoseSpotStatusPrescriptionData
) {
    const patientId = statusUpdateData.patient_id;

    // should be type DoseSpotPrescriptionItemObject
    const doseSpotPrescriptionData: any =
        await getDoseSpotPrescriptionWithPrescriptionIdAndPatientId(
            statusUpdateData.prescription_id,
            patientId,
            statusUpdateData.clinician_id
        );

    /**
     * Finding the patient's information by reverse searching against the dose spot Id saved in profiles table.
     */
    const { id: userId, error: getUserIdError } = await getUserIdFromDoseSpotId(
        patientId
    );

    /**
     * Order match failures are logged into a table in supabase.
     * Use this function to find the table and investigate if there is suspicion of failure.
     */
    if (!userId) {
        insertNewOrderMatchFailure(
            doseSpotPrescriptionData,
            statusUpdateData,
            null,
            'No User Id found',
            getUserIdError
        );
        return { order: null, prescriptionData: null };
    }

    let assigned_pharmacy;

    //Curexa
    if (doseSpotPrescriptionData.PharmacyId == '29992') {
        assigned_pharmacy = 'curexa';
    } else if (doseSpotPrescriptionData.PharmacyId == '78463') {
        assigned_pharmacy = 'ggm';
    } else {
        insertNewOrderMatchFailure(
            doseSpotPrescriptionData,
            statusUpdateData,
            null,
            'There was no matching pharmacy.',
            null
        );
        return { order: null, prescriptionData: null };
    }

    const order = await getBestOrderMatchesFromDatabase(
        userId,
        assigned_pharmacy,
        doseSpotPrescriptionData
    );

    if (!order) {
        insertNewOrderMatchFailure(
            doseSpotPrescriptionData,
            statusUpdateData,
            order,
            'There was no order that was eligible to match.',
            null
        );
        return { order: null, prescriptionData: null };
    }

    return { order: order, prescriptionData: doseSpotPrescriptionData };
}
