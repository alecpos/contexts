'use server';
import { getTokenV2 } from '../../v2/token/dose-spot-token-v2';

export default async function getDoseSpotPrescriptionWithPrescriptionIdAndPatientId(
    prescriptionId: string,
    patientId: string,
    userId: string
) {
    //Get Dose Spot access token. - current version : V2 Dose Spot
    const accessTokenData = await getTokenV2(userId);

    //Access Dose spot web api for patient prescriptions
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

    //returns the first indexed item of the json result.
    //Since prescriptionId is unique it should only give back 1 item because -
    // we ask providers to only prescribe one thing at a time so we can match it.
    const result_json = await response.json();

    console.log('result: ', result_json);

    if (Array.isArray(result_json)) {
        return result_json[0];
    } else {
        return result_json.Prescription;
    }
}
