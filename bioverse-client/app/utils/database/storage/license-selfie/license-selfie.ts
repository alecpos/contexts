'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getLicenseSelfieSignedURL(
    patient_id: string,
): Promise<LicenseData | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('license_photo_url, selfie_photo_url')
        .eq('id', patient_id)
        .single();

    if (!data || error) {
        return null;
    }

    const urlToRetrieveLicenseFrom = `${patient_id}/${data?.license_photo_url}`;
    const { data: licenseUrl, error: licenseError } =
        await getLicenseOrSelfieSignedURL(urlToRetrieveLicenseFrom);

    const urlToRetrieveSelfieFrom = `${patient_id}/${data?.selfie_photo_url}`;
    const { data: selfieUrl, error: selfieError } =
        await getLicenseOrSelfieSignedURL(urlToRetrieveSelfieFrom);

    const licenseData: LicenseData = {
        license: licenseError ? undefined : licenseUrl.signedUrl,
        selfie: selfieError ? undefined : selfieUrl.signedUrl,
    };

    return licenseData;
}

export async function getLicenseOrSelfieSignedURL(filePath: string) {
    const supabase = createSupabaseServiceClient();

    const { data: urlData, error } = await supabase.storage
        .from('license_and_selfie_images')
        .createSignedUrl(filePath, 60 * 60);

    if (error) {
        console.log('getLicenseOrSelfieURL', error);
        return { data: null, error: error };
    } else return { data: urlData, error: null };
}

export async function getAllLicenseAndSelfiePhotos(
    user_id: string,
): Promise<{ url: string; created_at: string; name: string }[]> {
    const supabase = createSupabaseServiceClient();

    // List all files in the user's folder
    const { data: files, error } = await supabase.storage
        .from('license_and_selfie_images')
        .list(user_id);

    if (error) {
        console.error('Error listing files:', error);
        return [];
    }

    if (!files || files.length === 0) {
        return [];
    }

    // Generate signed URLs and collect created_at dates and file names for each file
    const fileDataArray = await Promise.all(
        files.map(async (file) => {
            const filePath = `${user_id}/${file.name}`;
            const { data: urlData, error: urlError } =
                await getLicenseOrSelfieSignedURL(filePath);

            if (urlError) {
                console.error(
                    'Error getting signed URL for',
                    filePath,
                    urlError,
                );
                return null;
            }

            return {
                url: urlData.signedUrl,
                created_at: file.created_at,
                name: file.name,
            };
        }),
    );

    // Filter out any null values in case of errors
    return fileDataArray.filter(
        (
            fileData,
        ): fileData is { url: string; created_at: string; name: string } =>
            fileData !== null,
    );
}
