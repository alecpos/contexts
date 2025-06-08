'use server';

import { getMessagesForThread } from '../../database/controller/messaging/messages/messages';
import { listAllThreadsForPatient } from '../../database/controller/messaging/threads/threads';

/**
 * This method should ONLY be called from a PROVIDER-facing side.
 * DO NOT CALL THIS METHOD TO SHOW MESSAGES TO THE PATIENT - THIS USES SERVICE CLIENT TO OBTAIN EVERYTHING.
 *
 * This function will obtain all message logs from the patient and return them.
 * Method use cases:
 * - Provider/Coordinator loading all messages for patient.
 * - When someone needs to download all message history of a patient.
 *
 * @param patient_id Patient UUID
 * @returns constructed data object containing a key of 'thread_id' : [MessageObject]
 */
export async function loadPatientThreadData(
    patient_id: string,
): Promise<{ id: string; product: string; messages: any[] }[]> {
    let thread_and_message_data: any[] = [];

    const thread_array = await listAllThreadsForPatient(patient_id);

    for (const thread of thread_array) {
        const message_array = await getMessagesForThread(thread.id);

        thread_and_message_data.push({
            id: thread.id,
            product: thread.product,
            messages: [...message_array],
        });
    }

    // console.log('THRHRHRHR ', thread_and_message_data[0].messages);

    return thread_and_message_data;
}
