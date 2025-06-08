// import React, { useState, useEffect, useRef } from 'react';
// import {
//     Drawer,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Avatar,
//     TextField,
//     IconButton,
//     Box,
//     Button,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import HorizontalDivider from '@/app/components/dividers/horizontalDivider/horizontalDivider';
// import Typography from '@mui/material/Typography';
// import {
//     formatChatTimestamp,
//     formatThreadSidebarTimestamp,
//     hasMessageBeenRead,
//     truncateMessageContent,
//     updateInitialThreadData,
// } from '@/app/utils/actions/message/message-util';
// import { dispatchMessage } from '@/app/utils/actions/message/message-actions';
// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import {
//     InitialMessage,
//     InitialThreadData,
//     MessagePayload,
// } from '@/app/types/messages/messages-types';

// const drawerWidth = 240;

// interface MobileChatUIProps {
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
//     initalThreadData: InitialThreadData[];
//     handleOpen: () => void;
//     loadChatData: (run_silent: boolean) => void;
// }

// const MobileChatUI: React.FC<MobileChatUIProps> = ({
//     currentMessages,
//     currentThread,
//     userId,
//     currentMessage,
//     initalThreadData,
//     setCurrentMessage,
//     setCurrentThread,
//     setCurrentMessages,
//     setInitialThreadData,
//     handleThreadClick,
//     handleOpen,
//     loadChatData,
// }) => {
//     const [mobileOpen, setMobileOpen] = useState(false);
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
//             }

//             setCurrentMessage('');
//         }
//     };

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     // Viewing Threads
//     const drawer = (
//         <div className=" bg-white">
//             <div className=" flex justify-between items-center">
//                 <div className="justify-start">
//                     <BioType className="text-2xl font-semibold">
//                         Messages
//                     </BioType>
//                 </div>
//             </div>
//             <div className="flex items-center align-middle mt-4">
//                 <Button
//                     variant="contained"
//                     sx={{ marginRight: '16px' }}
//                     onClick={() => loadChatData(true)}
//                 >
//                     <BioType className="body1 text-white">Refresh</BioType>
//                 </Button>
//                 <Button variant="contained" onClick={handleOpen}>
//                     <BioType className="body1 text-white">New Message</BioType>
//                 </Button>
//             </div>
//             <div className="border-b mt-3">
//                 <HorizontalDivider backgroundColor="#e3e3e3" height={1} />
//             </div>
//             <List className="">
//                 {initalThreadData.map((thread, index) => (
//                     <div key={index}>
//                         <ListItem
//                             onClick={() => {
//                                 handleThreadClick(thread);

//                                 setMobileOpen(false);
//                             }}
//                         >
//                             <ListItemIcon>
//                                 <Avatar>{thread.avatar}</Avatar>
//                             </ListItemIcon>
//                             <ListItemText
//                                 primary={`${thread.first_name} ${thread.last_name}`}
//                                 secondary={truncateMessageContent(
//                                     thread.message.content,
//                                     100,
//                                 )}
//                             />
//                             <div className="flex items-center">
//                                 {hasMessageBeenRead(
//                                     thread,
//                                     currentThread,
//                                 ) ? null : (
//                                     <div className="h-3 w-3 mr-5 bg-[#2196F3] rounded-full"></div>
//                                 )}

//                                 <ListItemText
//                                     primary={formatThreadSidebarTimestamp(
//                                         thread.message.created_at,
//                                     )}
//                                     className="text-grey right-0 flex justify-end"
//                                     primaryTypographyProps={{
//                                         style: { color: 'grey' }, // Set the text color to grey and align to the right
//                                     }}
//                                 />
//                             </div>
//                         </ListItem>
//                         <HorizontalDivider
//                             backgroundColor="#e3e3e3"
//                             height={1}
//                         />
//                     </div>
//                 ))}
//             </List>
//         </div>
//     );
//     return (
//         <div className="flex bg-white mt-[81px] h-full">
//             <Box
//                 component="nav"
//                 sx={{
//                     width: { sm: drawerWidth },
//                     flexShrink: { sm: 0 },
//                     height: '100%',
//                 }}
//                 aria-label="mailbox folders"
//             >
//                 <Drawer
//                     variant="temporary"
//                     open={mobileOpen}
//                     onClose={handleDrawerToggle}
//                     ModalProps={{
//                         keepMounted: true,
//                     }}
//                     sx={{
//                         display: { xs: 'block', sm: 'none' },
//                         '& .MuiDrawer-paper': {
//                             boxSizing: 'border-box',
//                             width: drawerWidth,
//                         },
//                     }}
//                 >
//                     {drawer}
//                 </Drawer>
//             </Box>
//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     p: 3,
//                     marginTop: '20px',
//                     minHeight: '100vh',
//                     overflowY: 'auto',
//                 }}
//             >
//                 {currentThread ? (
//                     <div className=" -mt-8">
//                         <div className="h-5 mb-5">
//                             <IconButton
//                                 color="inherit"
//                                 aria-label="back to contacts"
//                                 edge="start"
//                                 onClick={() => setCurrentThread(null)}
//                             >
//                                 <ArrowBackIcon
//                                     sx={{
//                                         color: 'grey',
//                                         fontSize: '12px',
//                                         lineHeight: '16px',
//                                     }}
//                                 />
//                                 <BioType className=" ml-2 text-gray-400 text-sm">
//                                     {' '}
//                                     Back to messages
//                                 </BioType>
//                             </IconButton>
//                         </div>

//                         <Typography variant="h6" noWrap component="div">
//                             {currentThread ? (
//                                 <div>
//                                     {' '}
//                                     <ListItemIcon>
//                                         <Avatar>{currentThread.avatar}</Avatar>
//                                     </ListItemIcon>
//                                     {`${currentThread.first_name} ${currentThread.last_name}`}
//                                 </div>
//                             ) : (
//                                 'Messages'
//                             )}
//                         </Typography>
//                         <div className="mb-4 mt-4">
//                             {' '}
//                             <HorizontalDivider
//                                 backgroundColor="#e3e3e3"
//                                 height={1}
//                             />
//                         </div>
//                         <div className="">
//                             {currentMessages.map((message, index) => (
//                                 <div
//                                     key={index}
//                                     className={`flex ${
//                                         message.sender_id === userId
//                                             ? 'justify-end'
//                                             : 'justify-start'
//                                     }`}
//                                 >
//                                     {/* Time stamp for other user */}
//                                     <div
//                                         className={`flex flex-col ${
//                                             message.sender_id === userId
//                                                 ? 'items-end'
//                                                 : 'items-start'
//                                         }`}
//                                     >
//                                         {/* Name label for current user */}
//                                         {message.sender_id === userId && (
//                                             <span className="text-xs text-gray-500 mt-1">
//                                                 {index === 0 ||
//                                                 message.sender_id !=
//                                                     currentMessages[index - 1]
//                                                         .sender_id
//                                                     ? 'You'
//                                                     : null}
//                                             </span>
//                                         )}
//                                         {message.sender_id !== userId && (
//                                             <span className="text-xs text-gray-500 my-1">
//                                                 {index === 0 ||
//                                                 message.sender_id !=
//                                                     currentMessages[index - 1]
//                                                         .sender_id
//                                                     ? `${currentThread.first_name} ${currentThread.last_name}`
//                                                     : null}
//                                             </span>
//                                         )}
//                                         <div
//                                             className={`flex flex-col ${
//                                                 message.sender_id === userId
//                                                     ? 'items-end'
//                                                     : 'items-start'
//                                             }`}
//                                         >
//                                             <div
//                                                 className={`relative max-w-xs px-4 py-2 ${
//                                                     message.sender_id === userId
//                                                         ? 'bg-[#FAFAFA] rounded-l-lg rounded-b-lg bubble-grey-border'
//                                                         : 'bg-[#64B5F6] rounded-r-lg rounded-b-lg'
//                                                 }`}
//                                             >
//                                                 <span
//                                                     className={`text-sm ${
//                                                         message.sender_id ===
//                                                         userId
//                                                             ? 'text-[#9E9E9E]'
//                                                             : 'text-white'
//                                                     }`}
//                                                 >
//                                                     {message.content}
//                                                 </span>
//                                             </div>
//                                             {/* Chat timestamp for current user */}
//                                             {userId === message.sender_id ? (
//                                                 <div className="w-full flex justify-end">
//                                                     <span className="text-xs text-gray-500 mt-1">
//                                                         {index ===
//                                                             currentMessages.length -
//                                                                 1 ||
//                                                         message.sender_id !=
//                                                             currentMessages[
//                                                                 index + 1
//                                                             ].sender_id
//                                                             ? formatChatTimestamp(
//                                                                   message.created_at,
//                                                               )
//                                                             : null}
//                                                     </span>
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-xs text-gray-500 mt-1">
//                                                     {index ===
//                                                         currentMessages.length -
//                                                             1 ||
//                                                     message.sender_id !=
//                                                         currentMessages[
//                                                             index + 1
//                                                         ].sender_id ? (
//                                                         formatChatTimestamp(
//                                                             message.created_at,
//                                                         )
//                                                     ) : (
//                                                         <></>
//                                                     )}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}

//                             <Box
//                                 sx={{
//                                     position: 'fixed',
//                                     bottom: 0,
//                                     left: 0,
//                                     right: 0,
//                                     borderTop: '1px solid #e3e3e3',
//                                     p: 1,
//                                     backgroundColor: 'white',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                 }}
//                             >
//                                 <div className=" mb-14 flex w-screen">
//                                     <div className="justify-start w-11/12">
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="Type a message..."
//                                             value={currentMessage}
//                                             onChange={(e) =>
//                                                 setCurrentMessage(
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             onKeyPress={(event) => {
//                                                 if (event.key === 'Enter') {
//                                                     handleSend();
//                                                     event.preventDefault();
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="justify-end">
//                                         <IconButton
//                                             color="primary"
//                                             onClick={handleSend}
//                                         >
//                                             <SendIcon />
//                                         </IconButton>
//                                     </div>
//                                 </div>
//                             </Box>
//                         </div>
//                     </div>
//                 ) : (
//                     drawer
//                 )}
//             </Box>
//         </div>
//     );
// };

// export default MobileChatUI;
