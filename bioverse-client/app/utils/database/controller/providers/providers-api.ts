'use server';

import { USStates } from '@/app/types/enums/master-enums';
import { Status } from '@/app/types/global/global-enumerators';
import {
    getCurrentUserId,
    readUserSession,
} from '@/app/utils/actions/auth/session-reader';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { isEmpty } from 'lodash';
import Error from '../../../../(testing_and_development)/error';

export async function getProviderLicensedStates(): Promise<USStates[] | null> {
    const user_id = (await readUserSession()).data.session?.user.id;

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('licensed_states')
        .eq('id', user_id)
        .single();

    if (error) {
        return null;
    }

    return data.licensed_states;
}

export async function getProviderLicensedStatesWithID(
    provider_id: string
): Promise<USStates[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('licensed_states')
        .eq('id', provider_id)
        .single();

    if (error) {
        console.error('getProviderLicensedStatesWithID error ', error);
        return [];
    }

    return data.licensed_states;
}

export async function getProviderDoseSpotIdWithId(userId: string) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: doseSpotId, error: doseSpotNotificationError } =
        await supabase
            .from('providers')
            .select('dose_spot_clinician_id')
            .eq('id', userId)
            .single();

    if (doseSpotNotificationError) {
        return null;
    }

    return doseSpotId.dose_spot_clinician_id;
}

export async function getCurrentProviderDoseSpotId() {
    const supabase = await createSupabaseServerComponentClient();

    const userId = await getCurrentUserId();

    const { data: doseSpotId, error: doseSpotNotificationError } =
        await supabase
            .from('providers')
            .select('dose_spot_clinician_id')
            .eq('id', userId)
            .single();

    if (doseSpotNotificationError) {
        return null;
    }

    return doseSpotId.dose_spot_clinician_id;
}

export async function getProviderFromId(
    user_id: string
): Promise<Partial<ProvidersSBR> | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', user_id)
        .limit(1)
        .single();

    if (error) {
        console.error('getProviderFromId', error, `user_id: ${user_id}`);
        return null;
    }

    return data as ProvidersSBR;
}

/**
 * Specifically gets the list of 'providers'
 */
export async function getProviderList(): Promise<ProviderOption[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('id, name')
        .in('role', ['provider', 'lead-provider']);

    if (error) {
        console.error('getProviderList', error);
    }

    return data;
}

/**
 * Returns the current intake counter and licensed states for the provider
 * @param providerId
 */
export async function getProviderIntakeCounterAndStates(
    providerId: string
): Promise<{
    intake_counter: number | null;
    licensed_states: USStates[] | null;
    status: Status;
}> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('intake_counter, licensed_states')
        .eq('id', providerId)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'getProviderIntakeCounterAndStates error - providerId: ',
            providerId,
            ' error message: ',
            error.message
        );
        return {
            intake_counter: null,
            licensed_states: null,
            status: Status.Error,
        };
    }

    if (isEmpty(data)) {
        return {
            intake_counter: null,
            licensed_states: null,
            status: Status.Failure,
        };
    }

    return {
        intake_counter: data.intake_counter,
        licensed_states: data.licensed_states,
        status: Status.Success,
    };
}

export async function updateProviderIntakeCounter(
    providerId: string,
    new_count: number
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('providers')
        .update({ intake_counter: new_count })
        .eq('id', providerId);

    if (error) {
        return { status: Status.Error };
    }

    return { status: Status.Success };
}
