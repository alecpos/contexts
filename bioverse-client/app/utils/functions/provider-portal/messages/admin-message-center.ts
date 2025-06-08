'use server';

import {
    AccessLevel,
    GetUserThreadsResponse,
    Message,
    ThreadMember,
    UserMessage,
} from '@/app/types/provider-portal/messages/message-types';
import { getAllThreadsForUser } from '@/app/utils/actions/message/message-actions';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function getAccessLevel(authLevel: number) {
    switch (authLevel) {
        case 0: // customer
            return AccessLevel.Patient;
        case 1: // provider
            return AccessLevel.Provider;
        case 2: // developer
            return AccessLevel.Developer;
        case 3: // admin
            return AccessLevel.Admin;
        case 4: // customer support
            return AccessLevel.CustomerSupport;
        default:
            return AccessLevel.Denied;
    }
}

export async function getAvailableUsers(
    user_id: string,
    accessLevel: AccessLevel,
): Promise<UserMessage[]> {
    const supabase = createSupabaseServerComponentClient();

    let rpcMethod = '';
    let params = {};
    if (accessLevel === AccessLevel.Provider) {
        rpcMethod = 'get_patients_for_provider';
        params = { provider_id_: user_id };
    } else if (
        accessLevel === AccessLevel.Developer ||
        accessLevel === AccessLevel.Admin ||
        accessLevel === AccessLevel.CustomerSupport
    ) {
        rpcMethod = 'get_all_patients_and_providers';
    } else {
        console.error("This user shouldn't be here");
        return [];
    }

    const response = await supabase.rpc(rpcMethod, params);

    if (response.error) {
        console.error('Error getting available users', response.error);
        return [];
    }
    return response.data;
}

export async function getUserThreads(
    user_id: string,
): Promise<GetUserThreadsResponse> {
    const supabase = createSupabaseServerComponentClient();

    const thread_ids = await getAllThreadsForUser(user_id, 0);

    const threadMembers = await getThreadRecepientNames(user_id, thread_ids);

    const { data: messageData, error } = await supabase.rpc(
        'get_all_messages',
        { lookup_user_id: user_id, _thread_ids: thread_ids },
    );

    if (error) {
        console.log('get thread members error provider');
        console.log(error, error.message);
        return { messageData: [], threadMembers: [], success: false };
    }
    return { messageData, threadMembers, success: true };
}

export async function groupMessagesByThreadId(
    messages: Message[],
): Promise<Record<number, Message[]>> {
    const groupedMessages: Record<number, Message[]> = {};

    // Group messages by thread_id
    messages.forEach((message) => {
        if (!groupedMessages[message.thread_id]) {
            groupedMessages[message.thread_id] = [];
        }
        groupedMessages[message.thread_id].push(message);
    });

    // Sort messages in each thread by created_at
    Object.keys(groupedMessages).forEach((threadId: any) => {
        groupedMessages[threadId].sort(
            (a: any, b: any) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
        );
    });

    return groupedMessages;
}

export async function getThreadRecepientNames(
    user_id: string,
    thread_ids: number[],
): Promise<ThreadMember[]> {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase.rpc('get_thread_members', {
        lookup_user_id: user_id,
        _thread_ids: thread_ids,
    });

    if (error) {
        console.log('get thread members error provider');
        console.log(error, error.message);
        return [];
    }

    return data;
}

export async function formatDate(isoDateString: string | Date) {
    const date = new Date(isoDateString);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${monthNames[monthIndex]} ${day} at ${formattedHours}:${formattedMinutes}${ampm}`;
}
