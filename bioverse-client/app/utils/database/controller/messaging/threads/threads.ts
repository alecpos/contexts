'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { getFirstMessageForThread } from '../messages/messages';

/**
 * Creates a new Thread for the patient and product.
 * @param patient_id
 * @param product_href
 * @returns the Thread ID value of the thread created as a string. Returns falsy '' empty string if an error occured.
 */
export async function createNewThreadForPatientProduct(
    patient_id: string,
    product_href: string
): Promise<string> {
    const supabase = createSupabaseServiceClient();

    if (!patient_id || !product_href) {
        return '';
    }

    const { data, error } = await supabase
        .from('threads')
        .insert({ patient_id: patient_id, product: product_href })
        .select();

    if (error || data.length === 0) {
        console.log('create new thread error');
        console.error(error, error?.message);
        return '';
    }

    return data[0].id;
}

/**
 *
 * This function creates a new thread for a patient
 *
 * @param patient_id - patient's uuid
 * @param product_href - product href
 * @returns the created thread's ID
 */
export async function createNewThreadForPatientProductWithCheck(
    patient_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    console.log('creating thread for patient!');

    const { data: pre_check, error: pre_check_error } = await supabase
        .from('threads')
        .select('*')
        .eq('patient_id', patient_id)
        .eq('product', product_href);

    if (pre_check_error) {
        console.log('create new thread error');
        console.log(pre_check_error, pre_check_error?.message);
        return false;
    }

    if (pre_check.length > 0) {
        console.log(
            'create new thread error - a thread already exists for this.'
        );
        return false;
    }

    const { data, error } = await supabase
        .from('threads')
        .insert({
            patient_id: patient_id,
            product: product_href,
        })
        .select();

    if (error || data.length === 0) {
        console.log('create new thread error');
        console.log(error, error?.message);
        return false;
    }

    return data[0].id;
}

/**
 * @author Nathan Cho
 *
 * listAllThreadsForPatient function is used to obtain alal thread ID's and just their ID/product values
 * @param patient_id
 * @returns
 */
export async function listAllThreadsForPatient(
    patient_id: string
): Promise<{ id: any; product: any }[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('threads')
        .select('id, product')
        .eq('patient_id', patient_id);

    if (error || !data) {
        console.log('Error in fetching thread');
        console.error(error, error?.message);
        return [];
    }

    return data;
}

/**
 * @author Nathan Cho
 * @usage This is the method used to query the database for the thread data to load patient messages.
 * This function does not use the service client in order to guarantee security.
 * Uses auth to validate ID's prior to getting the data.
 *
 * @returns object with all necessary information to render the message list.
 *
 */
export async function getPatientThreadData(): Promise<any[]> {
    const supabase = createSupabaseServerComponentClient();

    const user_id = (await readUserSession()).data.session?.user.id;

    if (!user_id) {
        console.log('getPatientThreadData - found no userId');
        return [];
    }

    const { data, error } = await supabase
        .from('threads')
        .select('id, product, product_data:products!product(name)')
        .eq('patient_id', user_id);

    if (error || !data) {
        console.log('Error in fetching thread');
        console.error(error, error?.message);
        return [];
    }

    let thread_and_message_preview_data = [];

    for (const item of data) {
        const first_message_data = await getFirstMessageForThread(item.id);

        thread_and_message_preview_data.push({
            ...item,
            message_preview: first_message_data,
        });
    }

    return thread_and_message_preview_data;
}

/**
 *
 * @param patient_id the patient that owns the thread.
 * @param product_href The product's href. Use 'version_old' if looking for pre-migration threads.
 * @returns
 */
export async function getThreadIDByPatientIDAndProduct(
    patient_id: string,
    product_href: string
): Promise<string> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('threads')
        .select('id')
        .eq('patient_id', patient_id)
        .eq('product', product_href)
        .maybeSingle();

    if (error || !data) {
        console.log('Error in fetching thread');
        console.error(error, error?.message);
        return '';
    }

    return data.id;
}
