'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getProviderLicensedStatesWithID } from '@/app/utils/database/controller/providers/providers-api';

export async function getRegisteredNurseDashboardTasks(user_id: string) {
    const supabase = createSupabaseServiceClient();

    const licensed_states = await getProviderLicensedStatesWithID(user_id);

    const { data, error } = await supabase.rpc('get_rn_dashboard_table_data', {
        status_tag_environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        licensed_states_for_provider: licensed_states ?? null,
    });

    if (error) {
        console.error('Error fetching rn dashboard tasks:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        patientId: item.patientid,
        patientName: item.patientname,
        requestSubmissionTime: item.requestsubmissiontime,
        deliveryState: item.deliverystate,
        prescription: item.prescription,
        approvalStatus: item.approvalstatus,
        statusTag: item.statustag,
        productName: item.productname,
        subscriptionType: item.subscriptiontype,
        variant: item.variant,
        vial_dosages: undefined,
    }));
}
