'use server';

import { createHash } from 'crypto';

export async function getEncryptedValuesDoseSpot() {
    const userId = process.env.DOSE_SPOT_V2_USER_NAME!;

    const randomString = generateRandomString(32);

    const appendedString = randomString + process.env.DOSE_SPOT_CLINIC_KEY;

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

    return {
        encryptedClinicId: encryptedClinicId,
        encryptedClinicIdEncoded: encryptedClinicIdEncoded,
        encryptedUserId: encryptedUserId,
        encryptedUserIdEncoded: encryptedUserIdEncoded,
    };
}

export async function getEncryptedValuesDoseSpotV2(provider_id?: string) {
    const userId = provider_id ?? process.env.DOSE_SPOT_V2_USER_NAME!;

    const randomString = generateRandomString(32);

    const appendedString = randomString + process.env.DOSE_SPOT_V2_CLINIC_KEY;

    const hash1 = createHash('sha512').update(appendedString, 'utf8').digest();

    let base64String1 = hash1.toString('base64');

    base64String1 = base64String1.replace(/==$/, '');

    const encryptedClinicId = randomString + base64String1;

    const encryptedClinicIdEncoded = encodeURIComponent(encryptedClinicId);

    const first22Chars = randomString.substring(0, 22);
    const userIdAndPhrase = userId + first22Chars;
    const stringToHash = userIdAndPhrase + process.env.DOSE_SPOT_V2_CLINIC_KEY;
    const hash2 = createHash('sha512').update(stringToHash, 'utf8').digest();
    let base64String2 = hash2.toString('base64');
    base64String2 = base64String2.replace(/==$/, '');

    const encryptedUserId = base64String2;

    const encryptedUserIdEncoded = encodeURIComponent(base64String2);

    return {
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
