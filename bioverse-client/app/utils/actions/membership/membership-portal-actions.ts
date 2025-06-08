'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function getLicenseOrSelfieURL(filePath: string) {
    const supabase = await createSupabaseServiceClient();

    const { data: urlData, error } = await supabase.storage
        .from('license_and_selfie_images')
        .createSignedUrl(filePath, 60 * 60);

    if (error) {
        console.log('getLicenseOrSelfieURL', error);
        return { data: null, error: error };
    } else return { data: urlData, error: null };
}

export async function getSideProfileURL(filePath: string) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: urlData, error } = await supabase.storage
        .from('face-picture-uploads')
        .createSignedUrl(filePath, 60 * 60);

    if (error) {
        console.log('getSideProfileURL', error);
        return { data: null, error: error };
    } else return { data: urlData, error: null };
}

export async function changeUserPassword(
    oldPassword: string,
    newPassword: string,
    userEmail: string
) {
    const supabase = await createSupabaseServerComponentClient();

    // Update the password if the old password is correct
    const { data: updatedData, error: changePasswordError } =
        await supabase.auth.updateUser({ password: newPassword });

    if (changePasswordError) {
        console.log('Failed to update password for user: ' + userEmail);
        return 'new_password_issue';
    }

    console.log('Password updated successfully for user: ' + userEmail);
    return 'success';
}
