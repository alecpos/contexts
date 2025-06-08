'use server';
import { createHash } from 'crypto';
import { getEncryptedValuesDoseSpotV2 } from '../utils/token-encryption';

export async function getDoseSpotIframeUrlForPatientV2(
    patientId: string,
    provider_id?: string
) {
    const providerIDForUse = provider_id ?? process.env.DOSE_SPOT_V2_USER_NAME!;

    const {
        encryptedClinicId,
        encryptedClinicIdEncoded,
        encryptedUserId,
        encryptedUserIdEncoded,
    } = await getEncryptedValuesDoseSpotV2(providerIDForUse);

    //   const url1 = `${process.env.DOSE_SPOT_URL}LoginSingleSignOn.aspx?&SingleSignOnClinicId=${clinicId}&SingleSignOnUserId=${userId}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encryptedClinicIdEncoded}&SingleSignOnUserIdVerify=${encryptedUserIdEncoded}&RefillsErrors=1`;
    const url = `${process.env.DOSE_SPOT_URL}LoginSingleSignOn.aspx?&SingleSignOnClinicId=${process.env.DOSE_SPOT_V2_CLINIC_ID}&SingleSignOnUserId=${providerIDForUse}&PatientId=${patientId}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encryptedClinicIdEncoded}&SingleSignOnUserIdVerify=${encryptedUserIdEncoded}`;
    //const url = `${process.env.DOSE_SPOT_URL}LoginSingleSignOn.aspx?&SingleSignOnClinicId=${process.env.DOSE_SPOT_CLINIC_ID}&SingleSignOnUserId=${userId}&PatientId=${patientId}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encryptedClinicIdEncoded}&SingleSignOnUserIdVerify=${encryptedUserIdEncoded}`;

    return {
        url: url,
        encryptedClinicId: encryptedClinicId,
        encryptedClinicIdEncoded: encryptedClinicIdEncoded,
        encryptedUserId: encryptedUserId,
        encryptedUserIdEncoded: encryptedUserIdEncoded,
    };
}

export async function getDoseSpotIframeUrlForGeneral(userId: string) {
    // const clinicId = '143600'
    // const userId = '299334'
    // const randomString = generateRandomAlphanumeric();
    //   const randomString = "NTMwNTRCOUABCTlFOUYwQjg3NDI5OTJB";
    const randomString = generateRandomString(32);

    const appendedString = randomString + process.env.DOSE_SPOT_V2_CLINIC_KEY;

    const hash1 = createHash('sha512').update(appendedString, 'utf8').digest();

    let base64String1 = hash1.toString('base64');

    base64String1 = base64String1.replace(/==$/, '');

    const encryptedClinicId = randomString + base64String1;

    const encryptedClinicIdEncoded = encodeURIComponent(encryptedClinicId);

    const first22Chars = randomString.substring(0, 22);
    const userIdAndPhrase = userId + first22Chars;
    const stringToHash = userIdAndPhrase + process.env.DOSE_SPOT_CLINIC_KEY;
    const hash2 = createHash('sha512').update(stringToHash, 'utf8').digest();
    let base64String2 = hash2.toString('base64');
    base64String2 = base64String2.replace(/==$/, '');

    const encryptedUserId = base64String2;

    const encryptedUserIdEncoded = encodeURIComponent(base64String2);

    const url = `${
        process.env.DOSE_SPOT_URL
    }LoginSingleSignOn.aspx?&SingleSignOnClinicId=${
        process.env.DOSE_SPOT_V2_CLINIC_ID
    }&SingleSignOnUserId=${process.env
        .DOSE_SPOT_V2_USER_NAME!}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encryptedClinicIdEncoded}&SingleSignOnUserIdVerify=${encryptedUserIdEncoded}&RefillsErrors=1`;

    return {
        url: url,
        encryptedClinicId: encryptedClinicId,
        encryptedClinicIdEncoded: encryptedClinicIdEncoded,
        encryptedUserId: encryptedUserId,
        encryptedUserIdEncoded: encryptedUserIdEncoded,
    };
}

function generateRandomString(length: number): string {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
