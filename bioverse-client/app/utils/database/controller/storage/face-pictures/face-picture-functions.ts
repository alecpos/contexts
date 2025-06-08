'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function updateUserRightSidePhotoURL(
    userId: string,
    sideFileName: string
) {
    const supabase = await createSupabaseServerComponentClient();

    // Perform the update
    const { data, error } = await supabase
        .from('profiles')
        .update({ right_side_profile_url: sideFileName })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    console.log('Profile updated successfully!', data);
}

export async function updateUserLeftSidePhotoURL(
    userId: string,
    sideFileName: string
) {
    const supabase = await createSupabaseServerComponentClient();

    // Perform the update
    const { data, error } = await supabase
        .from('profiles')
        .update({ left_side_profile_url: sideFileName })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    console.log('Profile updated successfully!', data);
}
