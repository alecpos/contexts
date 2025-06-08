'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
/**
 * @author Nathan Cho
 * @description updates the ds_match_failures component with data provided.
 */
export async function insertNewOrderMatchFailure(
    prescriptionData: any,
    statusUpdateJson: any,
    testedOrderData: any,
    issueCause: string,
    errorData: any,
) {
    const supabase = createSupabaseServerComponentClient();

    const { error: dataInsertError } = await supabase
        .from('ds_match_failures')
        .insert({
            created_at: new Date(),
            prescription_data: prescriptionData,
            status_update_json: statusUpdateJson,
            tested_order_data: testedOrderData,
            issue_cause: issueCause,
            error_data: errorData,
        });

    if (dataInsertError) {
        console.log(
            'Controller tablename: ds_match_failures, method: insertNewOrderMatchFailure, Error: ',
            dataInsertError,
        );
    }
}
