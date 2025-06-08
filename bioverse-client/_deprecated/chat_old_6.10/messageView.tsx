// 'use client';
// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import {
//     InitialMessage,
//     InitialThreadData,
// } from '@/app/types/messages/messages-types';
// import { formatChatTimestamp } from '@/app/utils/actions/message/message-util';
// import { Avatar, ListItemIcon } from '@mui/material';
// import React, { useRef } from 'react';

// interface MessagesViewProps {
//     userId: string;
//     currentMessages: InitialMessage[];
//     currentThread: InitialThreadData;
// }
// const MessagesView: React.FC<MessagesViewProps> = ({
//     userId,
//     currentMessages,
//     currentThread,
// }) => {
//     const scrollableDivRef = useRef<HTMLDivElement>(null);
//     React.useEffect(() => {
//         const div = scrollableDivRef.current;
//         if (div) {
//             div.scrollTop = div.scrollHeight;
//             console.log('scrolling');
//         }
//     }, [currentMessages]);

//     console.log('cta', currentThread.avatar);

//     return (
//         <div className='md:px-9 overflow-y-auto'>
//             <div className='mb-5 '>
//                 {currentMessages.map((message, index) => (
//                     <div key={index}>
//                         <div className={`flex w-full justify-start`}>
//                             <div className='w-full text-gray-500 my-1'>
//                                 {index === 0 ||
//                                 message.sender_id !=
//                                     currentMessages[index - 1].sender_id ? (
//                                     <>
//                                         {currentThread ? (
//                                             <div className='flex w-full justify-between'>
//                                                 <div className='flex'>
//                                                     <ListItemIcon>
//                                                         <Avatar>
//                                                             {
//                                                                 currentThread.avatar
//                                                             }
//                                                         </Avatar>
//                                                     </ListItemIcon>
//                                                     <div>
//                                                         <BioType className='it-input text-black'>
//                                                             {`${currentThread.first_name} ${currentThread.last_name}`}
//                                                         </BioType>
//                                                         <BioType className='it-body text-black'>
//                                                             {message.sender_id ===
//                                                             userId
//                                                                 ? 'Patient'
//                                                                 : 'Care Coordinator'}
//                                                         </BioType>
//                                                     </div>
//                                                 </div>
//                                                 <div className='flex justify-center items-center'>
//                                                     <BioType className='it-body '>
//                                                         {formatChatTimestamp(
//                                                             message.created_at
//                                                         )}
//                                                     </BioType>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             'Messages'
//                                         )}
//                                     </>
//                                 ) : null}
//                             </div>
//                         </div>
//                         <div
//                             className={`flex w-full ${
//                                 message.sender_id === userId
//                                     ? 'justify-end'
//                                     : 'justify-start'
//                             }`}
//                         >
//                             {/* Time stamp for other user */}
//                             <div
//                                 className={`flex flex-col ${
//                                     message.sender_id === userId
//                                         ? 'items-end'
//                                         : 'items-start'
//                                 }`}
//                             >
//                                 <div
//                                     className={`flex flex-col ${
//                                         message.sender_id === userId
//                                             ? 'items-end'
//                                             : 'items-start'
//                                     }`}
//                                 >
//                                     <div
//                                         className={`relative max-w-xs px-4 py-2 ${
//                                             message.sender_id === userId
//                                                 ? 'bg-[#64B5F6] rounded-lg'
//                                                 : 'bg-[#FFF] rounded-lg bubble-grey-border'
//                                         }`}
//                                     >
//                                         <span
//                                             className={`text-sm ${
//                                                 message.sender_id === userId
//                                                     ? 'white'
//                                                     : 'black'
//                                             }`}
//                                         >
//                                             {message.content}
//                                         </span>
//                                     </div>
//                                     {/* Chat timestamp for current user */}
//                                     {/* {userId ===
//                                                     message.sender_id ? (
//                                                         <div className="w-full flex justify-end">
//                                                             <span className="text-xs text-gray-500 mt-1">
//                                                                 {index ===
//                                                                     currentMessages.length -
//                                                                         1 ||
//                                                                 message.sender_id !=
//                                                                     currentMessages[
//                                                                         index +
//                                                                             1
//                                                                     ].sender_id
//                                                                     ? formatChatTimestamp(
//                                                                           message.created_at,
//                                                                       )
//                                                                     : null}
//                                                             </span>
//                                                         </div>
//                                                     ) : (
//                                                         <span className="text-xs text-gray-500 mt-1">
//                                                             {index ===
//                                                                 currentMessages.length -
//                                                                     1 ||
//                                                             message.sender_id !=
//                                                                 currentMessages[
//                                                                     index + 1
//                                                                 ].sender_id ? (
//                                                                 formatChatTimestamp(
//                                                                     message.created_at,
//                                                                 )
//                                                             ) : (
//                                                                 <></>
//                                                             )}
//                                                         </span>
//                                                     )} */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MessagesView;
