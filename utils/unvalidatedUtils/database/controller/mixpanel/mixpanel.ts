'use server';

import {
    LEAD_STARTED,
    ALIAS_CREATED,
    SIGNUP_VIEWED,
} from '@/app/services/mixpanel/mixpanel-constants';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { Status } from '@/app/types/global/global-enumerators';

export async function checkMixpanelSignUpViewedFired(
    anonId: string
): Promise<{ data: MixPanelAudit | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data: startedData, error: startedError } = await supabase
        .from('mixpanel-audit')
        .select('*')
        .eq('anon_id', anonId)
        .eq('event_name', SIGNUP_VIEWED)
        .maybeSingle();

    if (startedError) {
        console.error(
            'Controller Error. tablename: mixpanel_audits, method: checkMixpanelSignUpViewedFired, error: ',
            startedError
        );
        return { data: null, error: startedError };
    }

    return { data: startedData, error: null };
}

export async function checkMixpanelAliasFired(
    user_id: string,
    product_href: string
): Promise<{ data: MixPanelAudit | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data: startedData, error: startedError } = await supabase
        .from('mixpanel-audit')
        .select('*')
        .eq('user_id', user_id)
        .eq('event_name', ALIAS_CREATED)
        .eq('product_href', product_href)
        .maybeSingle();

    if (startedError) {
        console.error(
            'Controller Error. tablename: mixpanel_audits, method: checkMixpanelAliasFired, error: ',
            startedError
        );
        return { data: null, error: startedError };
    }

    return { data: startedData, error: null };
}

export async function checkMixpanelEventFired(
    user_id: string,
    event_name: string,
    product_href: string
): Promise<{ data: MixPanelAudit | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data: startedData, error: startedError } = await supabase
        .from('mixpanel-audit')
        .select('*')
        .eq('user_id', user_id)
        .eq('event_name', LEAD_STARTED)
        .maybeSingle();

    //If a lead start event does not already exist, then that means that the user did not come from the advertising and should be handled regularly
    if (event_name != LEAD_STARTED && !startedData) {
        return { data: { continue: 'false' }, error: null };
    }

    if (startedError) {
        console.error(
            'Controller Error. tablename: mixpanel_audits, method: checkMixpanelEventFired, error: ',
            startedError
        );
        return { data: null, error: startedError };
    }

    const { data, error } = await supabase
        .from('mixpanel-audit')
        .select('*')
        .eq('user_id', user_id)
        .eq('event_name', event_name)
        .eq('product_href', product_href)
        .maybeSingle();

    if (error) {
        console.error(
            'Controller Error. tablename: mixpanel_audits, method: checkMixpanelEventFired, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

export async function createMixpanelEventAudit(
    user_id: string,
    event_name: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('mixpanel-audit').insert([
        {
            user_id,
            event_name,
            product_href,
        },
    ]);

    if (error) {
        console.error(
            'Controller Error. tablename: mixpanel-audit, method: createMixpanelEventAudit, error: ',
            error
        );
        return Status.Error;
    }

    return Status.Success;
}

export async function createMixpanelSignUpAudit(
    anon_id: string,
    event_name: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('mixpanel-audit').insert([
        {
            anon_id,
            event_name,
        },
    ]);

    if (error) {
        console.error(
            'Controller Error. tablename: mixpanel-audit, method: createMixpanelSignUpAudit, error: ',
            error
        );
        return Status.Error;
    }

    return Status.Success;
}
