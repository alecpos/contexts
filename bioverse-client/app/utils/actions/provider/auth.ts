'use server';

import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';

/**
 * @author rgorai
 * @description once a provider has completed the default Supabase user signup, their profile role needs to be updated and they need to be inserted into the providers table to finalize their signup
 * @returns an object with the data returned from Supabase from the profile update and providers insertion
 */
export const completeProviderSignup = async () => {
    const supabase = createSupabaseServiceClient();

    const { data: activeSession } = await supabase.auth.getSession();
    if (!activeSession.session)
        return {
            error: 'Something went wrong. The user has not been successfully signed up and logged in',
            data: null,
        };
    const providerId = activeSession.session.user.id;

    // update profile role
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .update({ authorization: 'provider' })
        .eq('id', providerId);
    if (profilesError) return { error: profilesError.message, data: null };

    // add record to providers table
    const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .insert({
            id: providerId,
            // other signup data
        });
    if (providersError) return { error: providersError.message, data: null };

    return {
        data: {
            profilesData,
            providersData,
        },
    };
};
