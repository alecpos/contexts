'use server';
import { getOtherUserInThread } from '@/app/utils/actions/message/message-actions';
import { triggerEvent } from './customerioApiFactory';
import { NEW_MESSAGE } from './event_names';

export async function trackMessageEvent(user_id: string, thread_id: number) {
    try {
        const { user_id: receiver_user_id }: any = await getOtherUserInThread(
            user_id,
            thread_id,
        );
        await triggerEvent(receiver_user_id, NEW_MESSAGE);
    } catch (error) {
        console.error('Could not fire message request');
        console.error(error);
    }
}
