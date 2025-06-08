'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

interface ProviderTaskWithOrder {
    type: string;
    order_id: number;
    renewal_order_id: string | null;
    orders: {
        state: string;
    } | null;
    providers: {
        name: string;
    } | null;
    created_at: Date;
}

export async function getTxPatientCSVData(startDate: string, endDate: string) {
    const supabase = createSupabaseServiceClient();

    const TX_PROVIDER_ID_LIST: string[] = [
        'da5b213d-7676-4792-bc73-11151d0da4e6',
        '28e2a459-2805-425f-96f3-a3d7f39c0528',
        'b34211ca-fc99-4aac-a8eb-f7e3eebaeb9a',
        '7cf6a976-fce4-443e-be9c-f265adfb67e7',
        '3bc131b7-b978-4e21-8fbc-73809ee9fcce',
    ];

    const { data, error } = await supabase
        .from('provider_tasks')
        .select(
            'created_at, type, order_id, renewal_order_id, orders (state), providers (name)'
        )
        .eq('completion_status', true)
        .in('assigned_provider', TX_PROVIDER_ID_LIST)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    const filtered_data = (data as ProviderTaskWithOrder[] | null)?.filter(
        (item) => item.orders?.state === 'TX'
    );

    if (error) {
        console.error(error);
        return null;
    }

    const transformed_data = filtered_data?.map((item) => ({
        Provider_Name: item.providers?.name || '',
        URL: `https://app.gobioverse.com/provider/intakes/${
            item.renewal_order_id ? item.renewal_order_id : item.order_id
        }`,
        Created_At: new Date(item.created_at).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }),
    }));

    return transformed_data;
}
