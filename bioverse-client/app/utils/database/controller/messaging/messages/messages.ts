'use server';

import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    CONFIRM_TREATMENT,
    CONFIRM_TREATMENT_QUARTERLY,
    NEW_MESSAGE,
    NEW_NONPHI_MESSAGE,
} from '@/app/services/customerio/event_names';
import { Status } from '@/app/types/global/global-enumerators';
import { MessagePayload } from '@/app/types/messages/messages-types';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { JSDOM } from 'jsdom';
import { replaceParametersAutomaticSend } from '../../macros/macros';
import { getMacroById } from '../../macros/macros-api';
import { getProviderFromId } from '../../providers/providers-api';
import { logPatientAction } from '../../patient_action_history/patient-action-history';
import { PatientActionTask } from '../../patient_action_history/patient-action-history-types';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';

// Called when firing a message from in the chat UI
export async function postNewMessage(message_payload: MessagePayload) {
    const supabase = createSupabaseServiceClient();

    const { data: recipient, error: recipient_error } = await supabase
        .from('threads')
        .select('patient_id')
        .eq('id', message_payload.thread_id)
        .maybeSingle();

    const { data, error } = await supabase
        .from('messages')
        .insert(message_payload)
        .select();

    if (error) {
        console.log('dispatch message error');
        console.log(error, error.message);
        return false;
    }

    await logPatientAction(
        message_payload.sender_id,
        PatientActionTask.SENT_MESSAGE,
        {
            message: message_payload.content,
        }
    );

    let sender_name_fetched: string | undefined = undefined;

    if (!message_payload.contains_phi) {
        const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', message_payload.sender_id)
            .limit(1)
            .maybeSingle();

        if (data) {
            sender_name_fetched = data.first_name;
        }
    }

    if (recipient?.patient_id !== message_payload.sender_id) {
        if (message_payload.contains_phi === true) {
            await triggerEvent(recipient?.patient_id, NEW_MESSAGE);
        } else if (!message_payload.contains_phi) {
            await triggerEvent(recipient?.patient_id, NEW_NONPHI_MESSAGE, {
                sender_name: sender_name_fetched ?? 'Team Member',
                message: extractTextFromHTML(message_payload.content),
            });
        }
    }

    // updateThreadMemberLastReadAt(
    //     message_payload.sender_id,
    //     message_payload.thread_id
    // );

    return data;
}

function extractTextFromHTML(text: string) {
    const dom = new JSDOM(text);
    return dom.window.document.body.textContent || '';
}

export async function getMessagesForThread(thread_id: string): Promise<any[]> {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('messages')
        .select(
            `
            id, created_at, sender_id, content, thread_id, attachment_urls,
            sender:profiles!sender_id(
                first_name,
                last_name,
                provider_data:providers!id(role, profile_picture_url)
            )
            `
        )
        .eq('thread_id', thread_id)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages for thread. ', error);
        return [];
    }

    return data;
}

export async function getFirstMessageForThread(
    thread_id: string
): Promise<any> {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('messages')
        .select(
            `
            id, created_at, sender_id, content, thread_id,
            sender:profiles!sender_id(
                first_name,
                last_name,
                provider_data:providers!id(role, profile_picture_url)
            )
            `
        )
        .eq('thread_id', thread_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages for thread. ', error);
        return null;
    }

    return data[0];
}

export async function getAutomaticMacroContent(
    orderData: DBOrderData,
    patientData: DBPatientData,
    provider_id: string,
    macroId: number
) {
    const subscription = await getPrescriptionSubscription(
        Number(orderData.subscription_id)
    );

    const { status, data: macroData, error } = await getMacroById(macroId);

    const macroHTML = macroData?.macroHtml;

    if (status === Status.Failure || !macroHTML) {
        console.log('Nathin, Issue persisted here - 1 ======================');
        return Status.Failure;
    }

    if (!subscription) {
        console.log('Nathin, Issue persisted here - 2 ======================');
        return Status.Failure;
    }

    const stripeSubscription = await getStripeSubscription(
        subscription.stripe_subscription_id
    );

    const endDate = stripeSubscription.current_period_end;

    const endDateFormatted = convertEpochToDate(endDate);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedDate = endDateFormatted.toLocaleDateString('en-US', options);

    const providerData = await getProviderFromId(provider_id);

    if (
        !providerData ||
        !providerData.id ||
        !providerData.name ||
        !providerData.credentials
    ) {
        console.error('Invalid provider id', provider_id, orderData);
        return Status.Failure;
    }

    const formattedContent = replaceParametersAutomaticSend(
        patientData,
        macroHTML,
        providerData.name,
        formattedDate,
        providerData.credentials
    );

    await triggerEvent(
        patientData.id,
        subscription.subscription_type === SubscriptionCadency.Quarterly
            ? CONFIRM_TREATMENT_QUARTERLY
            : CONFIRM_TREATMENT,
        {
            click_url: `https://app.gobioverse.com/dosage-selection/${orderData.product_href}`,
            renewal_date: formattedDate,
        }
    );

    return formattedContent;
    // const thread_id = await getThreadIDByPatientIDAndProduct(
    //     patientData.id,
    //     orderData.product_href,
    // );

    // if (!thread_id) {
    //     console.error(
    //         'Unable to get thread id for patient',
    //         orderData,
    //         patientData,
    //     );
    //     return Status.Failure;
    // }

    // const messagePayload: MessagePayload = {
    //     sender_id: providerData.id,
    //     content: formattedContent,
    //     thread_id: Number(thread_id),
    //     contains_phi: true,
    //     requires_coordinator: false,
    //     requires_lead: false,
    //     requires_provider: false,
    // };

    // await postNewMessage(messagePayload);

    return Status.Success;
}
