'use server';

import {
    getLicenseOrSelfieURL,
    getSideProfileURL,
} from '@/app/utils/actions/membership/membership-portal-actions';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getLicenseSelfieSignedURL(
    patient_id: string
): Promise<LicenseData | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('license_photo_url, selfie_photo_url')
        .eq('id', patient_id)
        .single();

    if (!data || error) {
        //TODO write handler here

        return null;
    }

    const urlToRetrieveLicenseFrom = `${patient_id}/${data?.license_photo_url}`;
    const { data: licenseUrl, error: licenseError } =
        await getLicenseOrSelfieURL(urlToRetrieveLicenseFrom);

    const urlToRetrieveSelfieFrom = `${patient_id}/${data?.selfie_photo_url}`;
    const { data: selfieUrl, error: selfieError } = await getLicenseOrSelfieURL(
        urlToRetrieveSelfieFrom
    );

    const licenseData: LicenseData = {
        license: licenseError ? undefined : licenseUrl.signedUrl,
        selfie: selfieError ? undefined : selfieUrl.signedUrl,
    };

    return licenseData;
}

export async function getSideProfileSignedURL(
    patient_id: string
): Promise<SideProfileData | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('right_side_profile_url, left_side_profile_url')
        .eq('id', patient_id)
        .single();

    if (!data || error) {
        return null;
    }

    const urlToRetrieveRightProfileFrom = `${patient_id}/${data?.right_side_profile_url}`;
    const { data: rightSideProfile, error: rightSideProfileError } =
        await getSideProfileURL(urlToRetrieveRightProfileFrom);

    const urlToRetrieveLeftProfileFrom = `${patient_id}/${data?.left_side_profile_url}`;
    const { data: leftSideProfile, error: leftSideProfileError } =
        await getSideProfileURL(urlToRetrieveLeftProfileFrom);

    const licenseData: SideProfileData = {
        right_side_profile: rightSideProfileError
            ? undefined
            : rightSideProfile.signedUrl,
        left_side_profile: leftSideProfileError
            ? undefined
            : leftSideProfile.signedUrl,
    };

    return licenseData;
}
