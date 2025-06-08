'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getSkinCareFaceUploads(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('right_side_profile_url, left_side_profile_url')
        .eq('id', patient_id)
        .single();

    if (!data || error) {
        return {
            left_side_url: undefined,
            right_side_url: undefined,
        };
    }

    const urlToRetrieveRightSideFrom = `${patient_id}/${data?.right_side_profile_url}`;
    const { data: rightSideUrl, error: rightSideError } =
        await getFacePictureSignedURL(urlToRetrieveRightSideFrom);

    const urlToRetrieveSelfieFrom = `${patient_id}/${data?.left_side_profile_url}`;
    const { data: leftSideUrl, error: leftSideError } =
        await getFacePictureSignedURL(urlToRetrieveSelfieFrom);

    return {
        left_side_url: leftSideUrl?.signedUrl,
        right_side_url: rightSideUrl?.signedUrl,
    };
    //face-picture-uploads
}

export async function getFacePictureSignedURL(filePath: string) {
    const supabase = await createSupabaseServiceClient();

    const { data: urlData, error } = await supabase.storage
        .from('face-picture-uploads')
        .createSignedUrl(filePath, 60 * 60);

    if (error) {
        console.log('getFacePictureSignedURL', error);
        return { data: null, error: error };
    } else return { data: urlData, error: null };
}
