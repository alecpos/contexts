// 'use client';

// import { useEffect, useRef } from 'react';
// import { IconButton, Avatar, TextField, Button } from '@mui/material';
// import {
//     formatChatTimestamp,
//     updateInitialThreadData,
// } from '@/app/utils/actions/message/message-util';
// import HorizontalDivider from '@/app/components/dividers/horizontalDivider/horizontalDivider';
// import SendIcon from '@mui/icons-material/Send';
// import {
//     dispatchMessage,
//     getOtherUserInThread,
//     viewedMessage,
// } from '@/app/utils/actions/message/message-actions';
// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import ScrollToBottom from 'react-scroll-to-bottom';
// import { NEW_MESSAGE } from '@/app/services/customerio/event_names';
// import {
//     InitialMessage,
//     InitialThreadData,
//     MessagePayload,
// } from '@/app/types/messages/messages-types';

// interface Props {
//     currentMessages: InitialMessage[];
//     currentThread: InitialThreadData | null;
//     userId: string;
//     currentMessage: string;
//     setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
//     setCurrentMessages: React.Dispatch<React.SetStateAction<InitialMessage[]>>;
//     setInitialThreadData: React.Dispatch<
//         React.SetStateAction<InitialThreadData[]>
//     >;
//     authLevel: any;
// }

// const ChatInterface = ({
//     currentMessages,
//     currentThread,
//     userId,
//     currentMessage,
//     setCurrentMessage,
//     setCurrentMessages,
//     setInitialThreadData,
//     authLevel,
// }: Props) => {
//     const messagesEndRef = useRef<HTMLDivElement>(null);

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
//                             currentThread.thread_id,
//                         ),
//                 );
//                 setCurrentMessage('');
//                 viewedMessage(userId, currentThread.thread_id);
//             }

//             setCurrentMessage('');
//             // setNewMessageIndicator({
//             // 	...newMessageIndicator,
//             // 	[currentContact.id]: false,
//             // });
//         }
//     };

//     const downloadChatLogs = async () => {
//         try {
//             const { user_id }: any = await getOtherUserInThread(
//                 userId,
//                 currentThread?.thread_id,
//             );

//             const response = await fetch('/api/patient-portal/messages', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId: user_id }),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'chat-log.pdf');
//             document.body.appendChild(link);
//             link.click();
//             if (link.parentNode) {
//                 link.parentNode.removeChild(link);
//             }
//         } catch (error) {
//             console.error('Error fetching data: ', error);
//         }
//     };

//     return (
//         <div className="flex-1 flex flex-col">
//             <div
//                 className="flex justify-between items-center h-[81px]"
//                 style={{
//                     borderBottomWidth: '1px',
//                     borderColor: '#E5E5E5',
//                     borderBottomStyle: 'solid',
//                 }}
//             >
//                 <div className="flex-none h-16 flex items-center p-4 ">
//                     {currentThread && <Avatar>{currentThread?.avatar}</Avatar>}

//                     <BioType className="text-xl font-semibold ml-4">
//                         {currentThread?.first_name} {currentThread?.last_name}
//                     </BioType>
//                 </div>
//                 {/* Customer support or provider can download chat logs for whoever they're talking to */}
//                 {userId === process.env.NEXT_PUBLIC_CUSTOMER_SUPPORT_USER_ID ||
//                 authLevel >= 1 ? (
//                     <div>
//                         <Button
//                             variant="contained"
//                             sx={{ marginRight: '16px' }}
//                             onClick={downloadChatLogs}
//                         >
//                             Download Chat Logs
//                         </Button>
//                     </div>
//                 ) : null}
//             </div>
//             <div className="">
//                 {/* <HorizontalDivider backgroundColor="#E5E5E5" height={1} /> */}
//             </div>
//             <ScrollToBottom className="flex overflow-y-scroll">
//                 <div className="p-8">
//                     {currentMessages.map((message: any, index: number) => (
//                         <div
//                             key={index}
//                             className={`flex ${
//                                 message.sender_id === userId
//                                     ? 'justify-end'
//                                     : 'justify-start'
//                             }`}
//                         >
//                             {/* Name for other person */}
//                             <div
//                                 className={`flex flex-col  ${
//                                     message.sender_id === userId
//                                         ? 'items-end'
//                                         : 'items-start'
//                                 }`}
//                             >
//                                 {message.sender_id !== userId && (
//                                     <BioType className="text-xs text-gray-500 mb-1">
//                                         {index === 0 ||
//                                         message.sender_id !=
//                                             currentMessages[index - 1].sender_id
//                                             ? `${message?.first_name} ${message?.last_name}`
//                                             : null}
//                                     </BioType>
//                                 )}
//                                 {message.sender_id === userId && (
//                                     <BioType className="text-xs text-gray-500 mt-1">
//                                         {index === 0 ||
//                                         message.sender_id !=
//                                             currentMessages[index - 1].sender_id
//                                             ? 'You'
//                                             : null}
//                                     </BioType>
//                                 )}
//                                 <div className="flex items-center">
//                                     {/* Chat timestamp for person typing */}
//                                     {message.sender_id === userId && (
//                                         <BioType className="text-xs text-gray-500 mr-2">
//                                             {index ===
//                                                 currentMessages.length - 1 ||
//                                             message.sender_id !=
//                                                 currentMessages[index + 1]
//                                                     .sender_id
//                                                 ? formatChatTimestamp(
//                                                       message.created_at,
//                                                   )
//                                                 : null}
//                                         </BioType>
//                                     )}
//                                     <div
//                                         className={`relative max-w-xs px-4 py-2 ${
//                                             message.sender_id === userId
//                                                 ? 'bg-[#FAFAFA] rounded-l-lg rounded-b-lg bubble-grey-border'
//                                                 : 'bg-[#64B5F6] rounded-r-lg rounded-b-lg'
//                                         }`}
//                                     >
//                                         <span
//                                             className={`text-sm ${
//                                                 message.sender_id === userId
//                                                     ? 'text-[#9E9E9E]'
//                                                     : 'text-white'
//                                             }`}
//                                         >
//                                             {message.content}
//                                         </span>
//                                     </div>
//                                     {/* Chat timestamp for other user */}
//                                     <div className="flex items-center">
//                                         {message.sender_id !== userId && (
//                                             <BioType className="text-xs text-gray-500 ml-2 items-center">
//                                                 {index ===
//                                                     currentMessages.length -
//                                                         1 ||
//                                                 message.sender_id !=
//                                                     currentMessages[index + 1]
//                                                         .sender_id ? (
//                                                     formatChatTimestamp(
//                                                         message.created_at,
//                                                     )
//                                                 ) : (
//                                                     <></>
//                                                 )}
//                                             </BioType>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 {/* <div ref={messagesEndRef} /> */}
//             </ScrollToBottom>
//             <div className="mt-auto *:">
//                 <div className="flex items-center p-4">
//                     <TextField
//                         multiline
//                         fullWidth
//                         size="small"
//                         placeholder="Type a message..."
//                         value={currentMessage}
//                         onChange={(e) => setCurrentMessage(e.target.value)}
//                         onKeyPress={(e) => {
//                             if (e.key === 'Enter' && !e.shiftKey) {
//                                 e.preventDefault(); // Prevent the default action
//                                 handleSend();
//                             }
//                         }}
//                     />
//                     <IconButton color="primary" onClick={handleSend}>
//                         <SendIcon />
//                     </IconButton>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatInterface;
