// 'use client';
// import { TextField, IconButton, Box, Paper } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import HorizontalDivider from '@/app/components/dividers/horizontalDivider/horizontalDivider';
// import { updateInitialThreadData } from '@/app/utils/actions/message/message-util';
// import { dispatchMessage } from '@/app/utils/actions/message/message-actions';
// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import QuickSupport from './quickSupport';
// import Loading from './loading';
// import MessagePreview from './messagePreview';
// import MessageView from './messageView';
// import {
//     InitialMessage,
//     InitialThreadData,
//     MessagePayload,
// } from '@/app/types/messages/messages-types';

// interface MessageChatUIProps {
//     currentMessages: InitialMessage[];
//     currentThread: InitialThreadData | null;
//     userId: string;
//     currentMessage: string;
//     setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
//     setCurrentMessages: React.Dispatch<React.SetStateAction<InitialMessage[]>>;
//     setInitialThreadData: React.Dispatch<
//         React.SetStateAction<InitialThreadData[]>
//     >;
//     handleThreadClick: (thread: InitialThreadData) => {};
//     setCurrentThread: React.Dispatch<
//         React.SetStateAction<InitialThreadData | null>
//     >;
//     initialThreadData: InitialThreadData[];
// }

// export default function MessageChatUI({
//     currentMessages,
//     currentThread,
//     userId,
//     currentMessage,
//     initialThreadData,
//     setCurrentMessage,
//     setCurrentThread,
//     setCurrentMessages,
//     setInitialThreadData,
//     handleThreadClick,
// }: MessageChatUIProps) {
//     const handleSend = async () => {
//         if (currentMessage && currentThread) {
//             const messagePayload: MessagePayload = {
//                 sender_id: userId,
//                 content: currentMessage,
//                 thread_id: currentThread.thread_id,
//             };

//             const res = await dispatchMessage(messagePayload);

//             if (res) {
//                 setCurrentMessages((prevMessages: InitialMessage[]) => [
//                     ...prevMessages,
//                     { ...res[0], created_at: Date.now(), message_id: 0 },
//                 ]);
//                 setInitialThreadData(
//                     (previousInitialThreadData: InitialThreadData[]) =>
//                         updateInitialThreadData(
//                             previousInitialThreadData,
//                             currentMessage,
//                             currentThread.thread_id
//                         )
//                 );
//             }

//             setCurrentMessage('');
//         }
//     };

//     // Viewing Threads
//     const drawer = (
//         <div className=' w-full md:w-[520px]'>
//             <div className=' flex justify-between items-center'>
//                 <div className='justify-start'>
//                     <BioType className=' text-primary itd-h1'>Messages</BioType>
//                     <div className='font-light mt-4'>
//                         <BioType className='itd-subtitle twentiethcentury'>
//                             Chat with a provider.
//                         </BioType>
//                         <BioType className='itd-body'>
//                             Message your provider with questions about your
//                             treatment.
//                         </BioType>
//                     </div>
//                 </div>
//             </div>

//             <div className='border-b mt-3'>
//                 <HorizontalDivider backgroundColor='#e3e3e3' height={1} />
//             </div>
//             {initialThreadData ? (
//                 <div className='flex flex-col space-y-4'>
//                     {initialThreadData.map((thread, index) => (
//                         <MessagePreview
//                             key={index}
//                             thread={thread}
//                             userId={userId}
//                             index={index}
//                             currentThread={currentThread}
//                             handleThreadClick={handleThreadClick}
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <Loading />
//             )}
//         </div>
//     );

//     return (
//         <div className='bg-white mt-[70px] w-full  justify-center'>
//             <Paper
//                 component='main'
//                 className='flex flex-col items-center '
//                 sx={{
//                     flexGrow: 1,
//                     p: 3,
//                     marginTop: '20px',
//                     minHeight: '66vh',
//                 }}
//             >
//                 {currentThread ? (
//                     <div className='flex flex-col w-full items-center'>
//                         <div className='h-5 mb-5'>
//                             <IconButton
//                                 color='inherit'
//                                 aria-label='back to contacts'
//                                 edge='start'
//                                 onClick={() => setCurrentThread(null)}
//                             >
//                                 <ArrowBackIcon
//                                     sx={{
//                                         color: 'grey',
//                                         fontSize: '12px',
//                                         lineHeight: '16px',
//                                     }}
//                                 />
//                                 <BioType className=' ml-2 text-gray-400 text-sm'>
//                                     {' '}
//                                     Back to messages
//                                 </BioType>
//                             </IconButton>
//                         </div>
//                         <div className='border-t-2 border-[#e5e5e5] border-solid border-0 md:border-2 md:rounded w-full h-[600px] md:w-[500px] relative  flex flex-col justify-end'>
//                             <MessageView
//                                 userId={userId}
//                                 currentMessages={currentMessages}
//                                 currentThread={currentThread}
//                             />

//                             <div className='sticky bottom-0 left-0 w-full  '>
//                                 <Box
//                                     sx={{
//                                         borderTop: '1px solid #e3e3e3',
//                                         backgroundColor: 'white',
//                                         padding: '2px',
//                                         paddingTop: '5px',
//                                     }}
//                                 >
//                                     <div className='flex w-full'>
//                                         <div className='flex-1'>
//                                             <TextField
//                                                 fullWidth
//                                                 size='small'
//                                                 placeholder='Type a message...'
//                                                 value={currentMessage}
//                                                 onChange={(e) =>
//                                                     setCurrentMessage(
//                                                         e.target.value
//                                                     )
//                                                 }
//                                                 onKeyPress={(event) => {
//                                                     if (event.key === 'Enter') {
//                                                         handleSend();
//                                                         event.preventDefault();
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                         <div className='flex items-center'>
//                                             <IconButton
//                                                 color='primary'
//                                                 onClick={handleSend}
//                                             >
//                                                 <SendIcon />
//                                             </IconButton>
//                                         </div>
//                                     </div>
//                                 </Box>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         {drawer}

//                         <QuickSupport />
//                     </>
//                 )}
//             </Paper>
//         </div>
//     );
// }
