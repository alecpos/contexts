'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function updateUserProfileLicensePhotoURL(
    userId: string,
    licensePhotoUrl: string
) {
    const supabase = await createSupabaseServerComponentClient();

    // Perform the update
    const { data, error } = await supabase
        .from('profiles')
        .update({ license_photo_url: licensePhotoUrl })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    console.log('Profile updated successfully!', data);
}

export async function updateUserProfileSelfiePhotoURL(
    userId: string,
    selfie_photo_url: string
) {
    const supabase = await createSupabaseServerComponentClient();

    // Perform the update
    const { data, error } = await supabase
        .from('profiles')
        .update({ selfie_photo_url: selfie_photo_url })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    console.log('Profile updated successfully!', data);
}
