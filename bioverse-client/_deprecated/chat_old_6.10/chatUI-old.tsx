// 'use client';

// import { useState, useEffect, useRef, Fragment } from 'react';
// import {
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Avatar,
//     Button,
//     Paper,
//     useMediaQuery,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Select,
// } from '@mui/material';
// import VerticalDivider from '@/app/components/dividers/verticalDivider/verticalDivider';
// // import MobileChatUI from '../../messageMobile';
// import {
//     getAllThreadsForUser,
//     getThreadConversation,
//     getThreadsData,
//     getUsersToMessage,
//     viewedMessage,
// } from '@/app/utils/actions/message/message-actions';
// import {
//     formatThreadSidebarTimestamp,
//     hasMessageBeenRead,
//     truncateMessageContent,
//     updateInitialThreadData,
//     updateLastViewedThread,
// } from '@/app/utils/actions/message/message-util';
// import ChatInterface from './chatInterface-old';
// import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import NewMessageModal from './newMessageModal';
// import { SelectChangeEvent } from '@mui/material';
// import { PRELOADED_MESSAGE_ARRAY } from './pre-written-messages';
// import {
//     AvailableUser,
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
//     const [activeThreadIds, setActiveThreadIds] = useState<number[]>([]);
//     const [currentMessages, setCurrentMessages] = useState<InitialMessage[]>(
//         []
//     );
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     const [initialThreadData, setInitialThreadData] = useState<
//         InitialThreadData[]
//     >([]);
//     const [tab, setTab] = useState<number>(1);
//     const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
//     const [open, setOpen] = useState(false);

//     const [preloadedMesageSelection, setPreloadedMessageSelection] =
//         useState<string>('');

//     const handlePreselectedMessageChange = (
//         event: SelectChangeEvent<string>
//     ) => {
//         setPreloadedMessageSelection(event.target.value);
//     };

//     useEffect(() => {
//         setCurrentMessage(preloadedMesageSelection);
//     }, [preloadedMesageSelection]);

//     const handleOpen = () => setOpen(true);

//     const isNotMobile = useMediaQuery('(min-width:640px)');

//     // Load available users to message
//     useEffect(() => {
//         const fetchUsersToMessage = async () => {
//             if (userId) {
//                 const response = await getUsersToMessage(userId, isProvider);
//                 if (response) {
//                     setAvailableUsers(response);
//                 }
//             }
//         };
//         fetchUsersToMessage();
//     }, []);

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
//         setActiveThreadIds(threads);

//         if (threads.length === 0) {
//             return;
//         }

//         const threadData = await getThreadsData(userId, threads, tab);
//         setInitialThreadData(threadData);
//         if (!run_silent && threadData.length > 0 && isNotMobile) {
//             setCurrentThread(threadData[0]);
//             if (tab === 0) {
//                 await viewedMessage(userId, threadData[0].thread_id);
//             }
//         }
//     };

//     useEffect(() => {
//         loadChatData();
//     }, [isNotMobile, userId, tab]);

//     useEffect(() => {
//         const loadCurrentThread = async () => {
//             if (!currentThread) {
//                 return;
//             }
//             const threadConversation = await getThreadConversation(
//                 currentThread.thread_id
//             );
//             setCurrentMessages(threadConversation);
//         };

//         loadCurrentThread();
//     }, [currentThread]);

//     const handleThreadClick = async (thread: InitialThreadData) => {
//         await loadChatData(true);
//         await viewedMessage(userId, thread.thread_id);
//         setCurrentThread(thread);
//         if (tab === 0) {
//             updateLastViewedThread(
//                 thread,
//                 initialThreadData,
//                 setInitialThreadData
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
//         <div className='w-full'>
//             {!isNotMobile ? (
//                 <MobileChatUI
//                     currentMessages={currentMessages}
//                     currentMessage={currentMessage}
//                     setCurrentMessage={setCurrentMessage}
//                     setCurrentMessages={setCurrentMessages}
//                     initalThreadData={initialThreadData}
//                     setInitialThreadData={setInitialThreadData}
//                     currentThread={currentThread}
//                     handleThreadClick={handleThreadClick}
//                     setCurrentThread={setCurrentThread}
//                     handleOpen={handleOpen}
//                     userId={userId}
//                     loadChatData={loadChatData}
//                 />
//             ) : (
//                 <div className='h-screen'>
//                     <div className='flex justify-center'>
//                         <div className=' w-9/12 flex justify-between mt-28'>
//                             <div className=''>
//                                 <BioType className='text-2xl font-semibold'>
//                                     Messages
//                                 </BioType>
//                             </div>
//                             <div className='justify-end'>
//                                 <Button
//                                     variant='contained'
//                                     sx={{ marginRight: '16px' }}
//                                     onClick={() => loadChatData(true)}
//                                 >
//                                     Refresh
//                                 </Button>
//                                 {/* <Button
//                                     variant='contained'
//                                     onClick={handleOpen}
//                                 >
//                                     New Message
//                                 </Button> */}
//                                 {/* <Button
//                                     sx={{ marginLeft: 2 }}
//                                     variant={'contained'}
//                                     onClick={handleTabClick}
//                                 >
//                                     {tab === 0
//                                         ? 'View All Unread Messages'
//                                         : 'View Latest Messages'}
//                                 </Button> */}
//                             </div>
//                         </div>
//                     </div>
//                     <div className='flex justify-center mt-6 '>
//                         <Paper
//                             className='flex max-h-144 w-10/12'
//                             sx={{ height: '700px' }}
//                         >
//                             <div className='w-1/3 bg-white flex flex-col border-0 border-solid border-r-[1px] border-[#E5E5E5]'>
//                                 {/* Added flex flex-col */}

//                                 <List
//                                     className='overflow-y-auto flex-grow'
//                                     sx={{ marginTop: '72px' }}
//                                 >
//                                     {/* Thread Side Bar */}
//                                     {initialThreadData.map((thread, index) => (
//                                         <ListItem
//                                             key={index}
//                                             // selected={
//                                             // 	contact.id ===
//                                             // 	currentContact?.id
//                                             // }
//                                             sx={{
//                                                 backgroundColor:
//                                                     currentThread?.thread_id ===
//                                                     thread?.thread_id
//                                                         ? '#E4F2FE'
//                                                         : null,
//                                                 borderBottom: '1px solid',
//                                                 ...(index === 0 && {
//                                                     borderTop: '1px solid',
//                                                 }),
//                                                 borderColor: '#E5E5E5',
//                                                 cursor: 'pointer',
//                                             }}
//                                             onClick={() =>
//                                                 handleThreadClick(thread)
//                                             }
//                                         >
//                                             <ListItemIcon>
//                                                 <Avatar>{thread.avatar}</Avatar>
//                                             </ListItemIcon>
//                                             <div className='flex flex-col w-full'>
//                                                 <div className='flex items-end'>
//                                                     <ListItemText
//                                                         primary={`${thread.first_name} ${thread.last_name}`}
//                                                         secondary={truncateMessageContent(
//                                                             thread.message
//                                                                 .content,
//                                                             42
//                                                         )}
//                                                         primaryTypographyProps={{
//                                                             style: {
//                                                                 fontSize:
//                                                                     '0.875rem',
//                                                             }, // Smaller font size for primary text
//                                                         }}
//                                                         secondaryTypographyProps={{
//                                                             style: {
//                                                                 fontSize:
//                                                                     '0.75rem',
//                                                             }, // Even smaller font size for secondary text
//                                                         }}
//                                                     />
//                                                     <div className='flex flex-col items-center'>
//                                                         {hasMessageBeenRead(
//                                                             thread,
//                                                             currentThread
//                                                         ) ? null : (
//                                                             <div className='h-3 w-3 mb-2.5 bg-[#2196F3] rounded-full'></div>
//                                                         )}
//                                                         <span className='text-xs text-gray-600'>
//                                                             {formatThreadSidebarTimestamp(
//                                                                 thread.message
//                                                                     .created_at
//                                                             )}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             </div>
//                             <VerticalDivider backgroundColor='#d3d3d3' />
//                             {/* Chat Box */}
//                             <ChatInterface
//                                 currentMessage={currentMessage}
//                                 currentMessages={currentMessages}
//                                 setCurrentMessage={setCurrentMessage}
//                                 setCurrentMessages={setCurrentMessages}
//                                 setInitialThreadData={setInitialThreadData}
//                                 currentThread={currentThread}
//                                 userId={userId}
//                                 authLevel={authLevel}
//                             />
//                         </Paper>
//                     </div>
//                     <div className='flex flex-col justify-center items-center w-full p-6'>
//                         <Paper className='w-1/3'>
//                             <FormControl fullWidth>
//                                 <InputLabel id='preloaded-select-label'>
//                                     Pre-written Messages
//                                 </InputLabel>
//                                 <Select
//                                     labelId='preloaded-select-label'
//                                     label='Pre-written Messages'
//                                     id='demo-simple-select'
//                                     value={preloadedMesageSelection}
//                                     onChange={handlePreselectedMessageChange}
//                                 >
//                                     <MenuItem disabled value={''}>
//                                         Please select
//                                     </MenuItem>
//                                     {PRELOADED_MESSAGE_ARRAY.map((item) => {
//                                         return (
//                                             <MenuItem
//                                                 value={item.message}
//                                                 key={item.description}
//                                             >
//                                                 {item.description}
//                                             </MenuItem>
//                                         );
//                                     })}
//                                 </Select>
//                             </FormControl>
//                         </Paper>
//                     </div>
//                 </div>
//             )}
//             <NewMessageModal
//                 open={open}
//                 setOpen={setOpen}
//                 availableUsers={availableUsers}
//                 userId={userId}
//                 loadChatData={loadChatData}
//                 isProvider={isProvider}
//             />
//         </div>
//     );
// };

// export default ChatUI;
