// 'use client';
// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import {
//     formatThreadSidebarTimestamp,
//     hasMessageBeenRead,
//     truncateMessageContent,
// } from '@/app/utils/actions/message/message-util';
// import { Avatar, Paper } from '@mui/material';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import React from 'react';
// import { InitialThreadData } from '@/app/types/messages/messages-types';

// interface MessagePreviewProps {
//     thread: InitialThreadData;
//     userId: string;
//     index: number;
//     currentThread: InitialThreadData | null;
//     handleThreadClick: (thread: InitialThreadData) => {};
// }

// const MessagePreview: React.FC<MessagePreviewProps> = ({
//     thread,
//     userId,
//     index,
//     currentThread,
//     handleThreadClick,
// }) => {
//     const [isMobileScreen, setIsMobileScreen] = React.useState<boolean>(false);

//     const handleResize = () => {
//         setIsMobileScreen(window.innerWidth <= 530);
//     };

//     React.useEffect(() => {
//         handleResize();
//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     return (
//         <Paper elevation={3} className="h-[74px] p-4" key={index}>
//             <div
//                 className="flex flex-row"
//                 onClick={() => {
//                     handleThreadClick(thread);
//                 }}
//             >
//                 <div className="flex items-center ">
//                     <Avatar className="h-[50px] w-[50px]">
//                         {thread.avatar}
//                     </Avatar>
//                 </div>

//                 <div className="ml-3 w-full">
//                     <div className=" flex justify-between">
//                         <BioType className="itd-subtitle">
//                             {thread.first_name} {thread.last_name}
//                         </BioType>

//                         <BioType className=" itd-body text-textSecondary right-0 flex justify-end">
//                             {formatThreadSidebarTimestamp(
//                                 thread.message.created_at,
//                             )}
//                         </BioType>
//                     </div>
//                     <div className="flex flex-row justify-between w-full relative">
//                         <BioType className="text-textSecondary body1 mt-1">
//                             {isMobileScreen
//                                 ? truncateMessageContent(
//                                       thread.message.content,
//                                       42,
//                                   )
//                                 : truncateMessageContent(
//                                       thread.message.content,
//                                       100,
//                                   )}
//                         </BioType>
//                         <ChevronRightIcon
//                             className="text-gray-400"
//                             fontSize="large"
//                         />
//                         {!hasMessageBeenRead(thread, currentThread) ? (
//                             thread.message.sender_id !== userId ? (
//                                 <div className="flex absolute right-0 top-1/2 -translate-y-1/2">
//                                     <div className="h-3 w-3 bg-[#2196F3] rounded-full"></div>
//                                 </div>
//                             ) : null
//                         ) : null}
//                     </div>
//                 </div>
//             </div>
//         </Paper>
//     );
// };

// export default MessagePreview;
