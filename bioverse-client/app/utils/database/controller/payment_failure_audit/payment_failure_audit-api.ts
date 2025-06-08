'use server';

import { metadata } from '@/app/(content)/page';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { PAYMENT_FAILED } from '@/app/services/customerio/event_names';
import { OrderType } from '@/app/types/orders/order-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { logPatientAction } from '../patient_action_history/patient-action-history';
import { PatientActionTask } from '../patient_action_history/patient-action-history-types';

// API For Tablename: payment_failure_audit
// Created on: 5.28.24
// Created by: Nathan Cho

////////////////////////////////////////////////////////////////////////////////
// Create
// -----------------------------
export async function createPaymentFailureAudit(
    patient_id: string,
    order_id: string,
    product_href: string,
    payment_method_id: string,
    reason: string,
): Promise<{
    success: boolean;
    message: string;
}> {
    /**
     * Parameter validation
     */
    const params = { patient_id, order_id, payment_method_id, reason };
    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
            return {
                success: false,
                message: `${key} is undefined/null`,
            };
        }
    }

    const supabase = createSupabaseServiceClient();

    const data = await getFailureAuditsByOrderId(order_id);

    // First time failures trigger customerio event
    if (!data || data.length === 0) {
        await triggerEvent(patient_id, PAYMENT_FAILED, {
            order_id,
            order_type: OrderType.Order,
        });
    }

    const { error } = await supabase.from('payment_failure_audit').insert({
        patient_id: patient_id,
        order_id: order_id,
        payment_method_id: payment_method_id,
        metadata: {
            reason: reason,
        },
    });

    await logPatientAction(patient_id, PatientActionTask.PAYMENT_FAILED, {
        product_href,
        order_id,
        source: 'first_time_order',
    });

    /**
     * Log error to console if encountered.
     */
    if (error) {
        console.error(
            'createPaymentFailureAudit',
            'json data: ',
            {
                patient_id: patient_id,
                order_id: order_id,
                payment_method_id: payment_method_id,
                metadata: {
                    reason: reason,
                },
            },
            error,
            error.message,
        );
        return {
            success: false,
            message: `supabase-error: ${error.message}`,
        };
    }

    return { success: true, message: '' };
}

export async function createPaymentFailureAuditForRenewalOrder(
    patient_id: string,
    renewalOrder: RenewalOrder,
    payment_method_id: string,
    invoice_id: string,
    reason: string,
): Promise<{
    success: boolean;
    message: string;
}> {
    /**
     * Parameter validation
     */
    const params = { patient_id, renewalOrder, payment_method_id, reason };
    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
            return {
                success: false,
                message: `${key} is undefined/null`,
            };
        }
    }

    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('payment_failure_audit').insert({
        patient_id: patient_id,
        order_id: renewalOrder.original_order_id,
        renewal_order_id: renewalOrder.renewal_order_id,
        payment_method_id: payment_method_id,
        metadata: {
            reason: reason,
            invoice_id,
        },
    });

    /**
     * Log error to console if encountered.
     */
    if (error) {
        console.error(
            'createPaymentFailureAudit',
            'json data: ',
            {
                patient_id: patient_id,
                renewal_order_id: renewalOrder.renewal_order_id,
                payment_method_id: payment_method_id,
                metadata: {
                    reason: reason,
                    invoice_id,
                },
            },
            error,
            error.message,
        );
        return {
            success: false,
            message: `supabase-error: ${error.message}`,
        };
    }

    return { success: true, message: '' };
}

// -----------------------------
// END CREATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Read
// -----------------------------

/**
 * Get single payment failure audit using table PK ID
 * @param id
 * @returns PaymentFailureAuditSBR object
 */
export async function getFailureAuditById(
    id: string,
): Promise<PaymentFailureAuditSBR | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('id', id)
        .limit(1)
        .single();

    if (error) {
        console.error('getFailureAuditById', `id: ${id}`, error, error.message);
        return null;
    }

    return data as PaymentFailureAuditSBR;
}

/**
 * Get the latest payment failure for a specific order
 * @param order_id
 * @returns
 */
export async function getLatestFailureAuditByOrderId(
    order_id: string,
): Promise<PaymentFailureAuditSBR | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('order_id', order_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'getLatestFailureAuditByOrderId',
            `order_id: ${order_id}`,
            error,
            error.message,
        );
        return null;
    }

    return data as PaymentFailureAuditSBR;
}

/**
 * Get all payment failures for a specific order ID
 * @param order_id
 * @returns
 */
export async function getFailureAuditsByOrderId(
    order_id: string,
): Promise<PaymentFailureAuditSBR[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('order_id', order_id);

    if (error) {
        console.error(
            'getFailureAuditsByOrderId',
            `order_id: ${order_id}`,
            error,
            error.message,
        );
        return [];
    }

    return data as PaymentFailureAuditSBR[];
}

/**
 * Get the latest payment failure for a specific patient ID
 * @param patient_id
 * @returns
 */
export async function getLatestFailureAuditByPatientId(
    patient_id: string,
): Promise<PaymentFailureAuditSBR | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('patient_id', patient_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'getLatestFailureAuditByPatientId',
            `patient_id: ${patient_id}`,
            error,
            error.message,
        );
        return null;
    }

    return data as PaymentFailureAuditSBR;
}

/**
 * Get all payment failures for a specific patient.
 * @param patient_id
 * @returns
 */
export async function getFailureAuditsByPatientId(
    patient_id: string,
): Promise<PaymentFailureAuditSBR[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('order_id', patient_id);

    if (error) {
        console.error(
            'getFailureAuditsByPatientId',
            `patient_id: ${patient_id}`,
            error,
            error.message,
        );
        return null;
    }

    return data as PaymentFailureAuditSBR[];
}

/**
 * Get the latest payment failure for a specific payment method ID
 * @param payment_method_id
 * @returns
 */
export async function getLatestFailureAuditByPaymentMethodId(
    payment_method_id: string,
): Promise<PaymentFailureAuditSBR | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('payment_method_id', payment_method_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'getLatestFailureAuditByPaymentMethodId',
            `payment_method_id: ${payment_method_id}`,
            error,
            error.message,
        );
        return null;
    }

    return data as PaymentFailureAuditSBR;
}

/**
 * Get all payment failures for a specific payment method
 * @param payment_method_id
 * @returns
 */
export async function getFailureAuditsByPaymentMethodId(
    payment_method_id: string,
): Promise<PaymentFailureAuditSBR[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_audit')
        .select('*')
        .eq('payment_method_id', payment_method_id);

    if (error) {
        console.error(
            'getFailureAuditsByPaymentMethodId',
            `payment_method_id: ${payment_method_id}`,
            error,
            error.message,
        );
        return null;
    }

    return data as PaymentFailureAuditSBR[];
}

// -----------------------------
// END READ FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Update
// -----------------------------

// -----------------------------
// END UPDATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Delete
// -----------------------------

// -----------------------------
// END DELETE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
