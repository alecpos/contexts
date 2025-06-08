'use server';

import {
    InitialThreadData,
    LatestMessage,
    MessagePayload,
    ThreadMember,
} from '@/app/types/messages/messages-types';
import {
    createSupabaseServerClient,
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';
import { trackMessageEvent } from '@/app/services/customerio/event_actions';

// export async function getAccountProfileData(uuid: string) {
//     const supabase = await createSupabaseServerComponentClient();
//     const { data, error } = await supabase
//         .from('profiles')
//         .select(
//             'first_name, last_name, license_photo_url, selfie_photo_url, address_line1, address_line2, city, state, zip, phone_number',
//         )
//         .eq('id', uuid)
//         .single();

//     if (error) {
//         console.log(error, error.message);
//     } else {
//         return data;
//     }
// }

export async function getThreadIdBetweenUsers(
    uuid1: string,
    uuid2: string,
    tab: number
) {
    const supabase = await createSupabaseServerComponentClient();

    if (tab === 0) {
        const { data, error } = await supabase.rpc('get_common_thread_ids', {
            user_id1: uuid1,
            user_id2: uuid2,
        });

        if (error) {
            console.log('Get common thread id error');
            console.log(error, error.message);
            return [];
        } else {
            return data.map((thread: any) => thread.thread_id);
        }
    } else {
        const { data, error } = await supabase.rpc(
            'get_unread_provider_messages'
        );
        if (error) {
            console.log('get all threads error');
            console.log(error, error.message);
            return [];
        } else {
            return data.map((thread: any) => thread.thread_id);
        }
    }
}

// 1. Get all threads for user
// 2. Extract last message sent from each thread
// 2.5. Extract last_read_at for each thread
// 3. Load threads up on left side

export async function getAllThreadsForUser(uuid: string, tab: number) {
    const supabase = await createSupabaseServerComponentClient();

    if (tab === 0) {
        const { data, error } = await supabase
            .from('thread_members')
            .select('thread_id')
            .eq('user_id', uuid);

        if (error) {
            console.log('get all threads error');
            console.log(error, error.message);
            return [];
        } else {
            return data.map((thread) => thread.thread_id);
        }
    } else {
        const { data, error } = await supabase.rpc(
            'get_unread_provider_messages'
        );
        if (error) {
            console.log('get all threads error');
            console.log(error, error.message);
            return [];
        } else {
            return data.map((thread: any) => thread.thread_id);
        }
    }
}

// Getting Threads Data:
// 1. First fetch latest messages to populate for the last sent message
// 2. Fetch the information of the user they're talking to in this thread
// Now that we can fetch
export async function getThreadsData(
    user_id: string,
    thread_ids: number[],
    tab: number
) {
    const supabase = await createSupabaseServerComponentClient();

    const rpc_function =
        tab === 0 ? 'get_latest_messages' : 'get_latest_unread_messages';
    // Think just write another function if tab = 1
    const { data, error } = await supabase.rpc(rpc_function, {
        _thread_ids: thread_ids,
        ...(tab === 0 && { lookup_user_id: user_id }),
    });
    // TODO: If tab = 1: ignore user_ids of providers

    const tm_rpc_function =
        tab === 0 ? 'get_thread_members' : 'get_thread_members_for_provider';
    const { data: nameData, error: nameError } = await supabase.rpc(
        tm_rpc_function,
        {
            ...(tab === 0 && { lookup_user_id: user_id }),
            _thread_ids: thread_ids,
        }
    );

    if (error) {
        console.log('get latest messages error');
        console.log(error, error.message);
    } else if (nameError) {
        console.log('get thread members error');
        console.log(nameError, nameError.message);
    }

    const threadData: InitialThreadData[] = constructThreadData(
        data,
        nameData
    ) as InitialThreadData[];

    return threadData;
}

export async function getThreadConversation(thread_id: number) {
    const supabase = await createSupabaseServerComponentClient();

    const { data, error } = await supabase.rpc('get_thread_messages', {
        thread_id_: thread_id,
    });

    if (error) {
        console.log('get thread conversation error');
        console.log(error, error.message);
    }
    return data;
}

// Called when firing a message from in the chat UI
export async function dispatchMessage(message_payload: MessagePayload) {
    const supabase = await createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('messages')
        .insert(message_payload)
        .select();

    if (error) {
        console.log('dispatch message error');
        console.log(error, error.message);
        return false;
    }

    viewedMessage(message_payload.sender_id, message_payload.thread_id);

    return data;
}

export async function getUsersToMessage(
    user_id: string,
    isProvider: boolean
): Promise<any> {
    const supabase = createSupabaseServerComponentClient();
    let result;

    try {
        if (user_id === process.env.NEXT_PUBLIC_CUSTOMER_SUPPORT_USER_ID) {
            result = await supabase.rpc('get_all_patients_and_providers');
        } else if (isProvider) {
            result = await supabase.rpc('get_patients_for_provider', {
                provider_id_: user_id,
            });
        } else {
            result = await supabase.rpc('get_provider_information', {
                lookup_user_id: user_id,
            });
        }
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
            console.error(`Error fetching users to message: ${error.message}`);
        } else {
            console.error(
                'An unknown error occurred while fetching users to message.'
            );
        }
        throw error; // Optionally rethrow the error if you want the caller to handle it
    }

    if ('error' in result && result.error) {
        console.error(`Error in response: ${result.error.message}`);
        return false;
    }

    return result.data;
}

// Called when firing a message from the New Chat Modal
/**
 * Deprecated - not in use.
 * @param user_id
 * @param receiver_id
 * @param content
 */
export async function dispatchNewMessage(
    user_id: string,
    receiver_id: string,
    content: string
) {
    const supabase = createSupabaseServerComponentClient();

    const thread_id = await createOrGetThread(user_id, receiver_id);

    // Fire Message
    const NewMessage: MessagePayload = {
        sender_id: user_id,
        content,
        thread_id,
    };

    await dispatchMessage(NewMessage);

    /**
     * Customer IO activation for tracking message
     */
    await trackMessageEvent(user_id, thread_id);
}

export async function createOrGetThread(user_id: string, receiver_id: string) {
    const supabase = createSupabaseServerComponentClient();

    // 1. Check if a thread exists between the users
    const { data: existingThread, error: existingThreadError } =
        await supabase.rpc('check_existing_thread', {
            user_id_1: user_id,
            user_id_2: receiver_id,
        });

    if (existingThreadError) {
        console.log('existing thread error');
        console.log(existingThreadError, existingThreadError.message);
    }

    if (existingThread.length > 0) {
        return existingThread[0].thread_id_;
    }

    // 2. Create a new thread if no existing thread

    const newThreadID = await createNewThread();

    if (!newThreadID) {
        return false;
    }

    // 3. Add users to the thread

    const threadMembers = await addThreadMembers(
        user_id,
        receiver_id,
        newThreadID
    );

    return newThreadID;
}

export async function getOtherUserInThread(
    user_id: string,
    thread_id: number | undefined
) {
    if (!thread_id) {
        return false;
    }
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .rpc('get_other_user_in_thread', {
            user_id_: user_id,
            thread_id_: thread_id,
        })
        .single();
    console.log(data);
    if (error) {
        console.log('get other user in thread error');
        console.error(error, error.message);
        return;
    }

    return data;
}

export async function addThreadMembers(
    user_id: string,
    receiver_id: string,
    thread_id: any
) {
    const supabase = createSupabaseServerComponentClient();

    if (!user_id || !receiver_id || !thread_id) {
        console.log('Invalid incoming data!');
        return false;
    }

    // Add both users
    const { data, error } = await supabase.from('thread_members').insert([
        { user_id, thread_id },
        { user_id: receiver_id, thread_id },
    ]);

    if (error) {
        console.log('add thread members error');
        console.log(error, error.message);
        return false;
    }
    return data;
}

export async function createNewThread() {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase.from('threads').insert({}).select();

    if (error || data.length === 0) {
        console.log('create new thread error');
        console.log(error, error?.message);
        return false;
    }

    return data[0].id;
}

export async function viewedMessage(user_id: string, thread_id: number) {
    const supabase = createSupabaseServerComponentClient();

    const { error } = await supabase
        .from('thread_members')
        .update({ last_read_at: new Date() })
        .eq('user_id', user_id)
        .eq('thread_id', thread_id);

    if (error) {
        console.error(error, error.message);
    }
}

function constructAvatar(first_name: string, last_name: string) {
    if (!first_name || !last_name) {
        return '';
    }
    const firstInitial = first_name.charAt(0);
    const secondInitial = last_name.charAt(0);
    return `${firstInitial}${secondInitial}`;
}

function constructThreadData(
    threadData: LatestMessage[],
    threadMembersData: ThreadMember[]
) {
    if (threadMembersData?.length === 0 || threadData?.length === 0) {
        return [];
    }
    const memberMap: {
        [key: number]: { first_name: string; last_name: string };
    } = {};

    for (const member of threadMembersData) {
        memberMap[member.thread_id] = {
            first_name: member.first_name,
            last_name: member.last_name,
        };
    }

    // Combine thread and message information
    const combinedArray = threadData.map((thread: any) => {
        const { thread_id_, ...threadInfo } = thread;
        const memberInfo = memberMap[thread_id_];
        return {
            thread_id: thread_id_,
            first_name: memberInfo?.first_name,
            last_name: memberInfo?.last_name,
            avatar: constructAvatar(
                memberInfo?.first_name,
                memberInfo?.last_name
            ),
            message: {
                message_id_: thread.message_id_,
                created_at: thread.created_at,
                sender_id: thread.sender_id,
                content: thread.content,
                last_read_at: thread.last_read_at,
            },
        };
    });
    return combinedArray;
}

interface UnreadMessages {
    unread_messages: number;
}

export async function getNumberUnreadMessages(
    user_id: string
): Promise<UnreadMessages> {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .rpc('get_number_unread_messages', { user_id_: user_id })
        .single();

    if (error) {
        console.error(
            'Error retreiving number of unread messages for user',
            user_id
        );
        console.error(error);
        return { unread_messages: 0 };
    }

    return data as UnreadMessages;
}

export async function getNumberUnreadProviderMessages(
    user_id: string
): Promise<UnreadMessages> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .rpc('get_number_unread_provider_messages', { user_id_: user_id })
        .single();

    if (error) {
        console.error(
            'Error retreiving number of unread messages for user',
            user_id
        );
        console.error(error);
        return { unread_messages: 0 };
    }

    return data as UnreadMessages;
}