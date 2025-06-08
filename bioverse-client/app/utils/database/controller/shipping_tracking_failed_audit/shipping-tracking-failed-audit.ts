import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function auditShippingTrackingFailed(
    orderId: number | string,
    status: string,
    request_data: any,
    carrier: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('shipping_tracking_failed_audit')
        .insert([
            {
                order_id: orderId,
                status: status,
                request_data: JSON.stringify(request_data),
                carrier: carrier,
            },
        ]);

    if (error) {
        console.log(
            'Controller Error. tablename: shipping_tracking_failed_audit, method: updateOrderTrackingNumber, error: ',
            error,
            orderId
        );
    }
}
