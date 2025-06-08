'use server';

import { getTokenV2 } from '../token/dose-spot-token-v2';

export default async function getDoseSpotPrescriptionWithPrescriptionIdAndPatientIdV2(
    prescriptionId: string,
    patientId: string,
    userId: string
): Promise<DoseSpotPrescriptionItemObjectV2> {
    const accessTokenData = await getTokenV2(userId);

    const response = await fetch(
        `${process.env.DOSE_SPOT_V2_URL}api/patients/${patientId}/prescriptions/${prescriptionId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Subscription-Key': process.env.DOSE_SPOT_V2_SUBSCRIPTION_KEY!,
                Authorization: `Bearer ${accessTokenData}`,
            },
        }
    );

    const e = await response.json();
    console.log('dose spot fetch request response', e);

    return e.Items[0] as DoseSpotPrescriptionItemObjectV2;
}
