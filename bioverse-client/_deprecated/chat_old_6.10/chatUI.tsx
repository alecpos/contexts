// 'use client';

// import { useState, useEffect } from 'react';
// import MessageChatUI from './messageUi';
// import {
//     getAllThreadsForUser,
//     getThreadConversation,
//     getThreadsData,
//     viewedMessage,
// } from '@/app/utils/actions/message/message-actions';
// import { updateLastViewedThread } from '@/app/utils/actions/message/message-util';
// import { listAllThreadsForPatient } from '@/app/utils/database/controller/messaging/threads/threads';
// import useSWR from 'swr';
// import {
//     InitialMessage,
//     InitialThreadData,
// } from '@/app/types/messages/messages-types';

// interface Props {
//     userId: string;
//     isProvider?: boolean;
//     authLevel: any;
// }

// const ChatUI = ({ userId, authLevel, isProvider = false }: Props) => {
//     const [currentThread, setCurrentThread] =
//         useState<InitialThreadData | null>(null);
//     // const [activeThreadIds, setActiveThreadIds] = useState<number[]>([]);
//     const [currentMessages, setCurrentMessages] = useState<InitialMessage[]>(
//         [],
//     );
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     const [initialThreadData, setInitialThreadData] = useState<
//         InitialThreadData[]
//     >([]);
//     const [tab, setTab] = useState<number>(0);
//     // const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
//     const [open, setOpen] = useState(false);

//     const [preloadedMesageSelection, setPreloadedMessageSelection] =
//         useState<string>('');

//     // const handlePreselectedMessageChange = (
//     //     event: SelectChangeEvent<string>
//     // ) => {
//     //     setPreloadedMessageSelection(event.target.value);
//     // };

//     useEffect(() => {
//         setCurrentMessage(preloadedMesageSelection);
//     }, [preloadedMesageSelection]);

//     const handleOpen = () => setOpen(true);

//     // Load available users to message
//     // useEffect(() => {
//     //     const fetchUsersToMessage = async () => {
//     //         if (userId) {
//     //             const response = await getUsersToMessage(userId, isProvider);
//     //             if (response) {
//     //                 setAvailableUsers(response);
//     //             }
//     //         }
//     //     };
//     //     fetchUsersToMessage();
//     // }, []);

//     /**
//      * @author Nathan Cho
//      * @reason this can be revisisted and we can look into trying to make it work.
//      */
//     // Subscribe to Supabase events
//     // useEffect(() => {
//     //     const supabase = createSupabaseBrowserClient();
//     //     const listener = supabase
//     //         .channel('chat-room')
//     //         .on(
//     //             'postgres_changes',
//     //             { event: 'INSERT', schema: 'public', table: 'messages' },
//     //             (payload) => {
//     //                 if (payload.errors) {
//     //                     console.log(payload.errors);
//     //                 }

//     //                 // Upon receiving a message event, check if it pertains to this user. Relevant to user if:
//     //                 // 1. The thread_id is part of the active thread ids the user is part of
//     //                 // 2. The sender of the message is NOT the user (because we already optimistically update)
//     //                 if (
//     //                     activeThreadIds.includes(payload.new.thread_id) &&
//     //                     userId !== payload.new.sender_id
//     //                 ) {
//     //                     // Add the message to InitialThreadData and push it to the top of the the chat list

//     //                     const newThreadData = updateInitialThreadData(
//     //                         initialThreadData,
//     //                         payload.new.content,
//     //                         payload.new.thread_id
//     //                     );
//     //                     setInitialThreadData(
//     //                         (previousInitialThreadData: InitialThreadData[]) =>
//     //                             newThreadData
//     //                     );
//     //                     // If it's a current active thread, update currentMessages
//     //                     if (
//     //                         currentThread?.thread_id === payload?.new?.thread_id
//     //                     ) {
//     //                         setCurrentMessages(
//     //                             (prevMessages: InitialMessage[]) => [
//     //                                 ...prevMessages,
//     //                                 payload.new as InitialMessage,
//     //                             ]
//     //                         );
//     //                     }
//     //                 }
//     //             }
//     //         )
//     //         .subscribe();

//     //     return () => {
//     //         listener.unsubscribe();
//     //     };
//     // });

//     const loadChatData = async (run_silent: boolean = false) => {
//         if (!userId) {
//             return;
//         }
//         const threads = await getAllThreadsForUser(userId, tab);
//         console.log('old', threads);
//         // setActiveThreadIds(threads);

//         if (threads.length === 0) {
//             return;
//         }

//         const threadData = await getThreadsData(userId, threads, tab);
//         setInitialThreadData(threadData);
//     };

//     useEffect(() => {
//         loadChatData();
//     }, [userId, tab]);

//     useEffect(() => {
//         const loadCurrentThread = async () => {
//             if (!currentThread) {
//                 return;
//             }
//             const threadConversation = await getThreadConversation(
//                 currentThread.thread_id,
//             );
//             setCurrentMessages(threadConversation);
//         };

//         loadCurrentThread();
//     }, [currentThread]);

//     /**
//      * SWR method to obtain thread ID list
//      */
//     const {
//         data: thread_data,
//         error: thread_error,
//         isLoading: threads_Loading,
//     } = useSWR(`${userId}-chat-threads`, () =>
//         listAllThreadsForPatient(userId),
//     );

//     console.log('new', thread_data);

//     const handleThreadClick = async (thread: InitialThreadData) => {
//         await loadChatData(true);
//         await viewedMessage(userId, thread.thread_id);
//         setCurrentThread(thread);
//         if (tab === 0) {
//             updateLastViewedThread(
//                 thread,
//                 initialThreadData,
//                 setInitialThreadData,
//             );
//         }
//     };

//     // const handleTabClick = () => {
//     //     if (tab === 0) {
//     //         setTab(1);
//     //     } else {
//     //         setTab(0);
//     //     }
//     // };

//     return (
//         <div className="w-full bg-white mt-[17px] flex flex-col justify-center items-center">
//             <MessageChatUI
//                 currentMessages={currentMessages}
//                 currentMessage={currentMessage}
//                 setCurrentMessage={setCurrentMessage}
//                 setCurrentMessages={setCurrentMessages}
//                 initialThreadData={initialThreadData}
//                 setInitialThreadData={setInitialThreadData}
//                 currentThread={currentThread}
//                 handleThreadClick={handleThreadClick}
//                 setCurrentThread={setCurrentThread}
//                 userId={userId}
//             />

//             {/* <NewMessageModal
//                 open={open}
//                 setOpen={setOpen}
//                 availableUsers={availableUsers}
//                 userId={userId}
//                 loadChatData={loadChatData}
//                 isProvider={isProvider}
//             /> */}
//         </div>
//     );
// };

// export default ChatUI;
