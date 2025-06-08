'use server';
import {
    createSupabaseServerClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';
import RudderAnalytics from '@rudderstack/rudder-sdk-node';

interface Data {
    email: string;
    password: string;
    anonymousId: string;
}

const client = new RudderAnalytics(process.env.RUDDERSTACK_API_KEY!, {
    dataPlaneUrl: process.env.RUDDERSTACK_DATA_PLANE_URL!,
    flushAt: 20,
    flushInterval: 20000,
    // the max number of elements that the SDK can hold in memory,
    // this is different than the Redis list created when persistence is enabled.
    // This restricts the data in-memory when Redis is down, unreachable etc.
    maxInternalQueueSize: 20000,
});

export async function signUpWithEmailAndPassword(data: Data) {
    const supabase = await createSupabaseServiceClient();

    const result = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    if (result.error) {
        console.log('signUpWithEmailAndPassword', result.error);
    }

    return JSON.stringify(result);
}

export async function signInUser(data: Data) {
    const supabase = createSupabaseServerClient();
    // Sign in the user
    const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

    if (signInError) {
        console.log('Error signing in: ', signInError.message);
        return { success: false, error: signInError.message };
    } else {
        //console.log('Signed in: ', signInData);
        return { success: true, data: signInData };
    }
}

export async function signOutUser() {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error);
    }
}
