'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

// API For Tablename: macros
// Created on: 6.4.24
// Created by: Nathan Cho

////////////////////////////////////////////////////////////////////////////////
// Create
// -----------------------------

// -----------------------------
// END CREATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Read
// -----------------------------

export async function getAllMacrosByResponder(
    responder: string
): Promise<{ macros: MacrosSBR[]; categories: any[] } | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('macros')
        .select('*')
        .eq('responder', responder);

    const { data: macrosData, error: macrosDataError } = await supabase.rpc(
        'get_distinct_categories',
        { responder_: responder }
    );
    if (error) {
        console.error(
            'getAllMacrosByResponder',
            error,
            'responder: ',
            responder,
            error.message
        );
        return null;
    }

    if (macrosDataError) {
        console.error(
            'getAllMacrosByResponder',
            macrosDataError,
            'responder: ',
            responder,
            macrosDataError.message
        );
    }

    return { macros: data as MacrosSBR[], categories: macrosData };
}

export async function getCategoriesByResponder(
    responder: string
): Promise<any> {
    const supabase = await createSupabaseServiceClient();

    const { data: macrosData, error: macrosDataError } = await supabase.rpc(
        'get_distinct_categories',
        { responder_: responder }
    );

    if (macrosDataError) {
        console.error('Error fetching data:', macrosDataError);
        return [];
    }

    return macrosData;
}

export async function getMacrosByResponder(responder: string) {
    const supabase = await createSupabaseServiceClient();

    const { data: macrosData, error: macrosDataError } = await supabase
        .from('macros')
        .select('*')
        .eq('responder', responder);

    if (macrosDataError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            macrosDataError
        );
        return { data: null, error: macrosDataError };
    }

    return { data: macrosData, error: null };
}

export async function getMacrosByCategoryAndResponder(
    responder: string,
    category: string
): Promise<MacrosSBR[]> {
    const supabase = await createSupabaseServiceClient();

    const { data: macrosData, error: macrosDataError } = await supabase
        .from('macros')
        .select('*')
        .eq('responder', responder)
        .eq('category', category);

    console.log(macrosData);
    if (macrosDataError) {
        return [];
    }

    return macrosData;
}

/**
 * @author Nathan Cho
 * Obtains Macro by Macro record ID in database
 */
export async function getMacroById(id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('macros')
        .select('macroHtml')
        .eq('id', id)
        .limit(1)
        .single();

    if (error) {
        return { status: Status.Failure, data: null, error: error };
    }

    return { status: Status.Success, data, error: null };
}

// -----------------------------
// END READ FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Update
// -----------------------------

export async function updateMacroTitle(
    macroId: number | string,
    newMacroTitle: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('macros')
        .update({ name: newMacroTitle })
        .eq('id', macroId);

    if (error) {
        console.error('updateMacroTitle function error: ', error.message);
        return Status.Error;
    }

    return Status.Success;
}

export async function updateMacroTags(
    macroId: string | number,
    newTags: string[]
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('macros')
        .update({ tags: newTags })
        .eq('id', macroId);

    if (error) {
        console.error('updateMacroTags function error: ', error.message);
        return Status.Error;
    }

    return Status.Success;
}

// -----------------------------
// END UPDATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Delete
// -----------------------------

// -----------------------------
// END DELETE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
