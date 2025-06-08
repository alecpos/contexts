'use server';

import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { isEmpty } from 'lodash';
import { PaymentFailureStatus } from './payment_failure_tracker_enums';
import { PaymentFailureTrackerSBR } from './payment_failure_tracker';

// API For Tablename: payment_failure_tracker
// Created on: 5.28.24
// Created by: Nathan Cho

////////////////////////////////////////////////////////////////////////////////
// Create
// -----------------------------

/**
 * Payment Failure Tracker create method is not necessary since creation of payment failure tracker
 * always occurs with a trigger within database.
 * An Upsert exists such that on insert into payment_failure_audit it will trigger the upsert into
 * payment failure tracker. Where the order # is used as the PKFK to trace whether a new record should be made or not.
 */
export async function createPaymentFailureTrackerForRenewals(
    renewalOrder: RenewalOrder,
    invoice_id: string,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_tracker')
        .insert({
            order_id: renewalOrder.original_order_id,
            renewal_order_id: renewalOrder.renewal_order_id,
            last_attempted_payment: new Date(Date.now()),
            status: PaymentFailureStatus.Retrying,
            patient_id: renewalOrder.customer_uuid,
            invoice_id,
            environment: renewalOrder.environment,
        });
}

export async function shouldCreateTrackerForRenewals(
    renewalOrder: RenewalOrder,
    invoice_id: string,
) {
    const tracker = await getPaymentFailureTrackerForRenewalOrder(
        renewalOrder.renewal_order_id,
    );

    if (!tracker) {
        await createPaymentFailureTrackerForRenewals(renewalOrder, invoice_id);
        return true;
    }

    if (tracker.status !== PaymentFailureStatus.Retrying) {
        await updateTrackerStatusById(
            tracker.id,
            PaymentFailureStatus.Retrying,
        );
        return true;
    }

    return false;
}

// -----------------------------
// END CREATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Read
// -----------------------------

/**
 * Obtains tracker information for order_id.
 * @param order_id
 * @returns null if no tracker or error.
 */
export async function getPaymentFailureTrackerForOrder(
    order_id: string,
): Promise<PaymentFailureTrackerSBR | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_tracker')
        .select('*')
        .eq('order_id', order_id)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'getPaymentFailureTrcakerForOrder',
            'order_id: ',
            order_id,
            error,
            error.message,
        );
        return null;
    }

    return data as PaymentFailureTrackerSBR;
}

export async function getPaymentFailureTrackerForRenewalOrder(
    renewal_order_id: string,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_tracker')
        .select('*')
        .eq('renewal_order_id', renewal_order_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'getPaymentFailureTrcakerForOrder',
            'order_id: ',
            renewal_order_id,
            error,
            error.message,
        );
        return null;
    }

    if (isEmpty(data)) {
        return null;
    }

    return data as PaymentFailureTrackerSBR;
}

// -----------------------------
// END READ FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Update
// -----------------------------

export async function updateTrackerStatus(
    order_id: string,
    new_status: 'retrying' | 'resolved' | 'expired',
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_tracker')
        .update({ status: new_status })
        .eq('order_id', order_id)
        .select();

    if (error) {
        console.error(
            'updateTrackerStatus',
            `order_id: ${order_id}`,
            `new_status: ${new_status}`,
        );
        return null;
    }

    return data;
}

export async function updateTrackerStatusById(
    tracker_id: number,
    new_status: PaymentFailureStatus,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('payment_failure_tracker')
        .update({ status: new_status })
        .eq('id', tracker_id)
        .select();

    if (error) {
        console.error(
            'updateTrackerStatus',
            `tracker_id: ${tracker_id}`,
            `new_status: ${new_status}`,
        );
        return null;
    }

    return data;
}

// Stops all payment failure retries linked to this base order id
export async function stopAllPaymentFailureRetriesForOriginalOrderId(
    order_id: number,
) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('payment_failure_tracker')
        .update({ status: PaymentFailureStatus.Resolved })
        .eq('order_id', order_id)
        .eq('status', PaymentFailureStatus.Retrying);
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
