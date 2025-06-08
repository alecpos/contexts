'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import Stripe from 'stripe';

export async function createRechargeForPayment(
    stripe_customer_id:string,
    current_invoice: InvoiceTableItem,
    amount:number, 
    reason:string 
){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const supabase = createSupabaseServiceClient();

    const user_id = (await readUserSession()).data.session?.user.id;


    const { data, error } = await supabase
        .from('stripe_audit')
        .insert({
            event_type: 'recharge',
            user_id: user_id,
            enacted_object_id: current_invoice.id,
            request_data: {
                amount: amount,
                payment_intent: current_invoice.id,
            },
            metadata: {
                reason: reason,
            },
        })
        .select();
    if (error) {
        return { status: 'failure', error: error };
    }

    const invoice = await stripe.invoices.retrieve(current_invoice.payment_intent_data.invoice.id);
    
    const productTitle=invoice.lines.data[0].description
        
    const description= amount === invoice.amount_due? 'Recharge of '+productTitle :'Partial Recharge of '+productTitle
    try{
        
        const newInvoice = await stripe.invoices.create({
            customer: stripe_customer_id,
            default_payment_method: current_invoice.payment_intent_data.payment_method,
            auto_advance: true,
            description:description,

        });

        const invoiceItem = await stripe.invoiceItems.create({
            customer: stripe_customer_id,
            amount: amount,
            currency: 'usd',
            description : description,
            invoice: newInvoice.id,

        });
        
        const paidInvoice = await stripe.invoices.pay(newInvoice.id);
        
        const paymentIntentId = paidInvoice.payment_intent as string;

        if (paymentIntentId) {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            // Update the Payment Intent's description
            await stripe.paymentIntents.update(paymentIntentId, {
                description: amount === invoice.amount_due? 'Recharge of '+current_invoice.description :'Partial Recharge of '+current_invoice.description
            });

        }

        const { error: error_update } = await supabase
            .from('stripe_audit')
            .update({ response_data: paidInvoice })
            .eq('event_id', data[0].event_id);

        if (error_update) {
            return { status: 'failure', error: error };
        }
        

        return { status: 'success', error: null };
    } catch (error: any) {
        console.error("Error recharging patient- ",error)

        return { status: 'failure', error: error };
    }
}