'use server';

import { getLicenseOrSelfieURL } from '@/app/utils/actions/membership/membership-portal-actions';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getLicenseSelfieSignedURL(
    patient_id: string
): Promise<LicenseData | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('license_photo_url, selfie_photo_url')
        .eq('id', patient_id)
        .limit(1)
        .maybeSingle();

    if (!data || error) {
        //TODO write handler here
        console.error('getLicenseSelfieSignedURL error: ', error);
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
