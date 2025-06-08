'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

/**
 *
 * @returns array of objects with keys 'control' : item
 */
export async function getAllControlledStates() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('admin_controlled_items')
        .select('control');

    return data;
}

export async function getAdminControlState(
    controlVariable: string
): Promise<{ id: number; control: string; active: boolean } | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('admin_controlled_items')
        .select('id, control, active')
        .eq('control', controlVariable)
        .limit(1)
        .single();

    if (error) {
        return null;
    }

    return data;
}

export async function changeAdminControlState(
    controlVariable: string,
    active: boolean
): Promise<Status> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('admin_controlled_items')
        .update({
            active: active,
        })
        .eq('control', controlVariable);

    if (error) {
        console.error('changeAdminControlState error: ', error);
        return Status.Error;
    }

    return Status.Success;
}
