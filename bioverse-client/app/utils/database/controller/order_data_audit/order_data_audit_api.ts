'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { OrderDataAuditActions } from './order_audit_descriptions';
import { isEmpty } from 'lodash';

/**
 * Creates order data audit into database for future use.
 * @param order_id Order ID
 * @param renewal_order_id Renewal Order ID, if applicable
 * @param description 1 sentence description hard-coded
 * @param action Action - To be made into enumerator
 * @param metadata Metadata for engineering use
 * @param payload Payload of data used in change
 */
export async function createOrderDataAudit(
    order_id: number,
    renewal_order_id: string | undefined,
    description: string | undefined,
    action: OrderDataAuditActions,
    metadata: any,
    payload: any
) {
    const supabase = createSupabaseServiceClient();

    const orderDataAuditToInsert: Partial<OrderDataAuditType> = {
        order_id: order_id,
        renewal_order_id: renewal_order_id,
        description: description,
        action: action,
        metadata: metadata,
        payload_data: payload,
    };

    const { error } = await supabase
        .from('order_data_audit')
        .insert(orderDataAuditToInsert);

    if (error) {
        console.error('Error in creating Order Data Audit: ', error);
    }
    return;
}

export async function getLatestDosageSelectionForRenewalOrder(
    renewal_order_id: string
): Promise<OrderDataAuditType | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('order_data_audit')
        .select('*')
        .in('action', [
            OrderDataAuditActions.CoordinatorDosageSelection,
            OrderDataAuditActions.DosageSelection,
            OrderDataAuditActions.CoordinatorManualCreateOrder,
        ])
        .eq('renewal_order_id', renewal_order_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(
            'Error getting latest dosage selection for renewal order'
        );
    }

    if (isEmpty(data)) {
        return null;
    }

    return data as OrderDataAuditType;
}

/**
 * Checks the order_data_audit whether a script was sent for a specific order or renewal order.
 * Intended to be used to not send duplicate scripts.
 *
 * @param order_id
 * @param renewal_order_id
 */
export async function hasOrderPharmacyScriptBeenSent(
    order_id: number,
    renewal_order_id?: string
) {
    const supabase = createSupabaseServiceClient();

    let audit_data;

    if (renewal_order_id) {
        const { data, error } = await supabase
            .from('order_data_audit')
            .select('*')
            .eq('action', OrderDataAuditActions.PrescriptionSent)
            .eq('renewal_order_id', renewal_order_id);

        if (error) {
            console.log(error);
            //returning true as a safeguard.
            return true;
        }

        audit_data = data;
    } else {
        const { data, error } = await supabase
            .from('order_data_audit')
            .select('*')
            .eq('action', OrderDataAuditActions.PrescriptionSent)
            .eq('order_id', order_id);

        if (error) {
            console.log(error);
            //returning true as a safeguard.
            return true;
        }

        audit_data = data;
    }

    if (!audit_data || audit_data.length === 0) {
        return false;
    }
    return true;
}

export async function getRenewalDosageSelectionAudit(
    renewal_order_id: string
): Promise<{
    selectedDosageString: string;
    selectedVariantIndex: string;
    pharmacy: string;
    created_at: string;
} | null> {
    const supabase = createSupabaseServiceClient();
    if (renewal_order_id) {
        const { data, error } = await supabase
            .from('order_data_audit')
            .select('*')
            .in('action', [OrderDataAuditActions.DosageSelection])
            .eq('renewal_order_id', renewal_order_id)
            .order('created_at', { ascending: true });

        if (error) {
            console.log(error);
            return null;
        }

        if (data && data.length > 0) {
            const latestRecord = data[data.length - 1];
            return {
                selectedDosageString:
                    latestRecord?.metadata?.dosageUpdateString ?? '',
                selectedVariantIndex:
                    latestRecord?.metadata?.selectedVariantIndex.toString() ??
                    '',
                pharmacy: latestRecord?.metadata?.new_pharmacy ?? '',
                created_at: latestRecord?.created_at ?? '',
            };
        }
    }

    return null;
}

export async function getPrescriptionSentAudit(
    order_id: number,
    renewal_order_id?: string
): Promise<OrderDataAuditType[] | null> {
    const supabase = createSupabaseServiceClient();

    let audit_data;

    if (renewal_order_id) {
        const { data, error } = await supabase
            .from('order_data_audit')
            .select('*')
            .in('action', [
                OrderDataAuditActions.PrescriptionSent,
                OrderDataAuditActions.ResendPrescription,
                OrderDataAuditActions.SecondSplitShipmentScriptSent,
                OrderDataAuditActions.SecondAnnualShipmentSent,
            ])
            .eq('renewal_order_id', renewal_order_id)
            .order('created_at', { ascending: true });

        if (error) {
            console.log(error);
            //returning true as a safeguard.
            return null;
        }

        audit_data = data;
    } else {
        const { data, error } = await supabase
            .from('order_data_audit')
            .select('*')
            .in('action', [
                OrderDataAuditActions.PrescriptionSent,
                OrderDataAuditActions.ResendPrescription,
                OrderDataAuditActions.SecondSplitShipmentScriptSent,
                OrderDataAuditActions.SecondAnnualShipmentSent,
            ])
            .eq('order_id', order_id)
            .is('renewal_order_id', null);

        if (error) {
            console.log(error);
            //returning true as a safeguard.
            return null;
        }

        audit_data = data;
    }

    if (!audit_data || audit_data.length === 0) {
        return null;
    }
    return audit_data as OrderDataAuditType[];
}

export async function getResendCount(
    order_id: number,
    renewal_order_id?: string
) {
    const supabase = createSupabaseServiceClient();

    let resend_count = 0;

    let records;

    if (renewal_order_id) {
        const { data } = await supabase
            .from('order_data_audit')
            .select('id')
            .eq('action', OrderDataAuditActions.ResendPrescription)
            .eq('renewal_order_id', renewal_order_id);

        records = data;
    } else {
        const { data } = await supabase
            .from('order_data_audit')
            .select('id')
            .eq('action', OrderDataAuditActions.ResendPrescription)
            .eq('order_id', order_id);

        records = data;
    }

    resend_count = records?.length ?? 0;
    return resend_count;
}
