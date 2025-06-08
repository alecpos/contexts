// 'use client';

// // Chat.tsx
// import { useState, useEffect, useRef, RefObject, createRef } from 'react';
// import { SupabaseClient, createClient } from '@supabase/supabase-js';
// import { getMessages } from '../../../../../utils/actions/message/messageTest';
// import { sendMessage } from '../../../../../utils/actions/message/messageTest';
// import {
//     Drawer,
//     IconButton,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Avatar,
//     TextField,
//     Button,
//     Paper,
//     Box,
// } from '@mui/material';
// import Badge from '@mui/material/Badge';
// import Typography from '@mui/material/Typography';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SearchIcon from '@mui/icons-material/Search';
// import SendIcon from '@mui/icons-material/Send';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import HorizontalDivider from '@/app/components/dividers/horizontalDivider/horizontalDivider';
// import VerticalDivider from '@/app/components/dividers/verticalDivider/verticalDivider';
// import { readUserSession } from '@/app/utils/actions/auth/session-reader';
// import { getAllAccountProfiles } from '@/app/utils/actions/message/message-user';
// import { getUserAuthorization } from '@/app/utils/actions/message/message-user';
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';
// import cx from 'classnames';
// import styles from './chat.module.scss';

// const drawerWidth = 240;

// interface Contact {
//     id: string;
//     firstName: string;
//     lastName: string;
//     fullName: string;
//     initials: string;
// }

// const DEFAULT_CONTACT: Contact = {
//     id: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE ?? '',
//     firstName: 'Customer',
//     lastName: 'Service',
//     fullName: 'Customer Service',
//     initials: 'CS',
// };

// interface getAccountProfileDataforMessage {
//     id: string;
// }

// interface Profile {
//     id: string;
//     first_name: string;
//     last_name: string;
//     lastMessage: string;
//     time: string;
//     unreadMessages: number;
//     hasUnreadMessages: boolean;
// }

// interface Message {
//     id: string;
//     sender_id: string;
//     provider_id: string;
//     message: string;
//     created_at: string;
// }

// const Chat = () => {
//     const searchParams = useSearchParams();
//     const chatEndRef = useRef<HTMLDivElement>(null);
//     const contactListItemsRef = useRef<Record<string, HTMLDivElement> | null>(
//         null
//     );
//     const [personalData, setPersonalData] =
//         useState<getAccountProfileDataforMessage>();
//     const [allAccountProfiles, setAllAccountProfiles] = useState<Profile[]>([]);
//     const [currentUserAuthorization, setCurrentUserAuthorization] = useState<
//         string | null
//     >(null);
//     const contactIdParam = searchParams.get('contact');
//     const [currentContact, setCurrentContact] = useState<Contact | null>(null);
//     const [unreadCount, setUnreadCount] = useState({});
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const [isMobile, setIsMobile] = useState(false);
//     const [gatheringData, setGatheringData] = useState<boolean>(true);
//     const [userId, setUserId] = useState('');

//     const [initializing, setInitializing] = useState(true);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [newMessage, setNewMessage] = useState('');
//     const supabaseUrl: string = process.env.NEXT_PUBLIC_supabase_url || '';
//     const supabaseAnonKey: string =
//         process.env.NEXT_PUBLIC_supabase_anon_key || '';
//     const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
//     const isAuthorizedUser = [
//         'provider',
//         'administrator',
//         'developer',
//     ].includes(currentUserAuthorization || '');
//     const handleUserClickAndSetContact = (
//         id: string,
//         firstName: string,
//         lastName: string
//     ) => {
//         const updatedProfiles = allAccountProfiles.map((profile) => {
//             if (profile.id === id) {
//                 return { ...profile, unreadMessages: 0 }; // 重置未读消息计数
//             }
//             return profile;
//         });
//         setAllAccountProfiles(updatedProfiles);

//         setCurrentContact({
//             id,
//             firstName,
//             lastName,
//             fullName: `${firstName} ${lastName}`,
//             initials: `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`,
//         });
//     };

//     const handleButtonClick = () => {
//         handleSendMessage();
//     };

//     const getContactListItemRef = (
//         node: HTMLDivElement | null,
//         profileId: string
//     ) => {
//         if (!contactListItemsRef.current) contactListItemsRef.current = {};

//         if (node) contactListItemsRef.current[profileId] = node;
//     };

//     useEffect(() => {
//         function checkScreenWidth() {
//             setIsMobile(window.innerWidth < 844);
//         }
//         checkScreenWidth();
//         window.addEventListener('resize', checkScreenWidth);
//         return () => window.removeEventListener('resize', checkScreenWidth);
//     }, []);

//     useEffect(() => {
//         const fetchAllProfiles = async () => {
//             const profiles = await getAllAccountProfiles();
//             if (profiles) {
//                 const initializedProfiles = profiles.map((profile) => ({
//                     ...profile,
//                     unreadMessages: 0, // 初始化未读消息计数
//                 }));

//                 setAllAccountProfiles(initializedProfiles);
//                 console.log(
//                     'profiles',
//                     initializedProfiles.map(
//                         (people) =>
//                             people.first_name + 'hello' + people.unreadMessages
//                     )
//                 );
//                 // if contactIdParam is provided and found, open that chat on render
//                 if (contactIdParam) {
//                     const contact = profiles.find(
//                         (e) => e.id === contactIdParam
//                     );
//                     if (contact) {
//                         handleUserClickAndSetContact(
//                             contact.id,
//                             contact.first_name,
//                             contact.last_name
//                         );
//                         // contactListItemsRef.current?.[contact.id].scrollIntoView({
//                         //   behavior: "smooth",
//                         // });
//                     }
//                 }
//             }
//         };

//         const currentUserAuthorizationLevel = async () => {
//             const sessionData = await readUserSession();
//             const userIdFromSession = sessionData.data.session?.user.id;
//             if (typeof userIdFromSession === 'string') {
//                 const authorizationData = await getUserAuthorization(
//                     userIdFromSession
//                 );
//                 if (authorizationData && authorizationData.authorization) {
//                     setCurrentUserAuthorization(
//                         authorizationData.authorization
//                     );
//                     if (
//                         ['provider', 'administrator', 'developer'].includes(
//                             authorizationData.authorization
//                         )
//                     ) {
//                         setCurrentContact(null);
//                     } else {
//                         setCurrentContact(DEFAULT_CONTACT);
//                     }
//                 }
//             } else {
//                 console.error('User ID is undefined');
//             }
//         };

//         const fetchData = async () => {
//             try {
//                 const sessionData = await readUserSession();
//                 const userIdFromSession = sessionData.data.session?.user.id;
//                 if (!userIdFromSession) {
//                     throw new Error('User ID is not available in session data');
//                 }

//                 await currentUserAuthorizationLevel();
//                 setUserId(userIdFromSession);
//                 setPersonalData({
//                     id: userIdFromSession,
//                 });
//                 fetchAllProfiles();
//                 setGatheringData(false);
//                 setInitializing(false);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         if (!currentContact && !isMobile) {
//             setCurrentContact(null);
//         }

//         if (initializing) {
//             fetchData();
//         }
//     }, [contactIdParam, currentContact, initializing, isMobile]);

//     // useEffect(() => {
//     //   setTimeout(() => {
//     //     if (chatEndRef.current) {
//     //       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     //     }
//     //   }, 100);
//     // }, [messages]);

//     useEffect(() => {
//         // Load historical messages
//         const loadMessages = async () => {
//             const { data, error } = await getMessages(
//                 personalData?.id || '',
//                 currentContact?.id || ''
//             );
//             if (error) {
//                 console.error('Error loading messages:', error);
//             } else {
//                 setMessages(data || []);
//             }
//         };

//         const onNewMessageReceived = (newMessage: any) => {
//             console.log('New message received:', newMessage);
//             if (newMessage.sender_id !== currentContact?.id) {
//                 const updatedProfiles = allAccountProfiles.map((profile) => {
//                     if (profile.id === newMessage.sender_id) {
//                         return {
//                             ...profile,
//                             unreadMessages: profile.unreadMessages + 1,
//                         };
//                     }
//                     return profile;
//                 });
//                 setAllAccountProfiles(updatedProfiles);
//             }
//         };

//         const messageSubscription = supabase
//             .channel('realtime posts')
//             .on(
//                 'postgres_changes',
//                 { event: 'INSERT', schema: 'public', table: 'messages' },

//                 (payload) => {
//                     console.log('Message subscription payload:', payload);
//                     setMessages((prevMessages: any) => [
//                         ...prevMessages,
//                         payload.new,
//                     ]);
//                     onNewMessageReceived(payload.new); // 在这里调用新的函数
//                 }
//             )
//             .subscribe();

//         // Initial load of historical messages
//         if (currentContact) {
//             loadMessages();
//         }

//         // Cleanup function: unsubscribe
//         return () => {
//             supabase.removeChannel(messageSubscription);
//         };
//     }, [currentContact, personalData?.id, supabase]);

//     const handleInputKeyPress = (event: React.KeyboardEvent) => {
//         if (event.key !== 'Enter') return;

//         event.preventDefault();

//         handleSendMessage();
//     };

//     const handleSendMessage = async () => {
//         if (!newMessage.trim() || !personalData?.id) return;

//         // Submit message
//         const { data, error } = await sendMessage(
//             personalData.id,
//             currentContact?.id ?? '',
//             newMessage.trim()
//         );
//         if (error) return console.error('send message error:', error);

//         // Update UI
//         setNewMessage('');
//         setMessages((prev) => [...prev, data]);
//     };

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     const drawer = (
//         <div className='mb-8 bg-white'>
//             <div className=' flex justify-between '>
//                 <div className='justify-start'>
//                     <h3>Messages</h3>
//                 </div>
//                 <div className='justify-end'>
//                     {/* <Button variant="contained">New Message</Button> */}
//                 </div>
//             </div>
//             <div className='pl-4 pt-4 pr-4 border-b h-10'>
//                 <div className='flex items-center'>
//                     <input
//                         className='ml-2 border-none py-2 px-3 text-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//                         placeholder='Search contact'
//                         style={{
//                             color: 'grey',
//                             minWidth: '200px',
//                             flexGrow: 1,
//                             boxShadow: 'none',
//                             outline: 'none',
//                         }}
//                     />
//                     <SearchIcon />
//                 </div>

//                 <HorizontalDivider backgroundColor='#e3e3e3' height={1} />
//             </div>
//             <List className=''>
//                 {isAuthorizedUser ? (
//                     allAccountProfiles.map((profile) => (
//                         <div key={profile.id}>
//                             <ListItem
//                                 onClick={() => {
//                                     handleUserClickAndSetContact(
//                                         profile.id,
//                                         profile.first_name,
//                                         profile.last_name
//                                     );
//                                     setMobileOpen(false);
//                                 }}
//                                 button
//                                 ref={(node) =>
//                                     getContactListItemRef(node, profile.id)
//                                 }
//                             >
//                                 <ListItemIcon>
//                                     <Avatar>
//                                         {profile.first_name
//                                             ?.split(' ')[0][0]
//                                             .toUpperCase() +
//                                             profile.last_name
//                                                 ?.split(' ')[0][0]
//                                                 .toUpperCase() || null}
//                                     </Avatar>
//                                 </ListItemIcon>
//                                 <ListItemText
//                                     primary={
//                                         profile?.first_name +
//                                         ' ' +
//                                         profile?.last_name
//                                     }
//                                     secondary={profile.lastMessage}
//                                 />
//                                 {profile.unreadMessages > 0 && (
//                                     <Badge
//                                         color='secondary'
//                                         variant='dot'
//                                     ></Badge>
//                                 )}
//                                 <ListItemText
//                                     primary={profile.time}
//                                     className='text-grey right-0 flex justify-end'
//                                     primaryTypographyProps={{
//                                         style: { color: 'grey' },
//                                     }}
//                                 />
//                             </ListItem>

//                             <HorizontalDivider
//                                 backgroundColor='#e3e3e3'
//                                 height={1}
//                             />
//                         </div>
//                     ))
//                 ) : (
//                     <div>
//                         <ListItem
//                             onClick={() => {
//                                 handleUserClickAndSetContact(
//                                     DEFAULT_CONTACT.id,
//                                     DEFAULT_CONTACT.firstName,
//                                     DEFAULT_CONTACT.lastName
//                                 );
//                                 setMobileOpen(false);
//                             }}
//                         >
//                             <ListItemIcon>
//                                 <Avatar>{DEFAULT_CONTACT.initials}</Avatar>
//                             </ListItemIcon>

//                             <ListItemText
//                                 primary={DEFAULT_CONTACT.fullName}
//                                 secondary={''}
//                             />
//                             <ListItemText
//                                 primary={''}
//                                 className='text-grey right-0 flex justify-end'
//                                 primaryTypographyProps={{
//                                     style: { color: 'grey' },
//                                 }}
//                             />
//                         </ListItem>
//                         <HorizontalDivider
//                             backgroundColor='#e3e3e3'
//                             height={1}
//                         />
//                     </div>
//                 )}
//             </List>
//         </div>
//     );

//     const container =
//         typeof window !== 'undefined' ? () => window.document.body : undefined;

//     const formatDate = (timestamp: number | string) => {
//         const date = new Date(timestamp);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);

//         if (date.getTime() >= today.getTime()) {
//             return `Today ${date.toLocaleString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: false,
//             })}`;
//         } else if (date.getTime() >= yesterday.getTime()) {
//             return `Yesterday ${date.toLocaleString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: false,
//             })}`;
//         } else {
//             return date
//                 .toLocaleString('en-US', {
//                     month: '2-digit',
//                     day: '2-digit',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: false,
//                 })
//                 .replace(',', '');
//         }
//     };

//     if (!userId) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             {isMobile ? (
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         bgcolor: 'white',
//                         marginTop: '70px',
//                     }}
//                 >
//                     <Box
//                         component='nav'
//                         sx={{
//                             width: { sm: drawerWidth },
//                             flexShrink: { sm: 0 },
//                         }}
//                         aria-label='mailbox folders'
//                     >
//                         <Drawer
//                             container={container}
//                             variant='temporary'
//                             open={mobileOpen}
//                             onClose={handleDrawerToggle}
//                             ModalProps={{
//                                 keepMounted: true,
//                             }}
//                             sx={{
//                                 display: { xs: 'block', sm: 'none' },
//                                 '& .MuiDrawer-paper': {
//                                     boxSizing: 'border-box',
//                                     width: drawerWidth,
//                                 },
//                             }}
//                         >
//                             {drawer}
//                         </Drawer>
//                     </Box>
//                     <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
//                         {currentContact ? (
//                             <div className=' -mt-10'>
//                                 <div className='h-5 mb-5'>
//                                     <IconButton
//                                         color='inherit'
//                                         aria-label='back to contacts'
//                                         edge='start'
//                                         onClick={() => setCurrentContact(null)}
//                                     >
//                                         <ArrowBackIcon
//                                             style={{ color: 'grey' }}
//                                             className='text-xs'
//                                         />
//                                         <span className=' ml-2 text-gray-400 text-sm'>
//                                             {' '}
//                                             Back to messages
//                                         </span>
//                                     </IconButton>
//                                 </div>

//                                 <Typography variant='h6' noWrap component='div'>
//                                     {currentContact ? (
//                                         <div>
//                                             {' '}
//                                             <ListItemIcon>
//                                                 <Avatar>
//                                                     {currentContact.initials}
//                                                 </Avatar>{' '}
//                                             </ListItemIcon>
//                                             {currentContact.fullName}
//                                         </div>
//                                     ) : (
//                                         'Messages'
//                                     )}
//                                 </Typography>
//                                 <div className='mb-4 mt-4'>
//                                     {' '}
//                                     <HorizontalDivider
//                                         backgroundColor='#e3e3e3'
//                                         height={1}
//                                     />
//                                 </div>
//                                 <div>
//                                     <div
//                                         style={{
//                                             maxHeight: '63vh',
//                                             overflow: 'auto',
//                                         }}
//                                     >
//                                         {messages.map((message, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`flex ${
//                                                     message.sender_id ===
//                                                     personalData?.id
//                                                         ? 'justify-end'
//                                                         : 'justify-start'
//                                                 }`}
//                                             >
//                                                 <div
//                                                     className={`flex flex-col ${
//                                                         message.sender_id ===
//                                                         personalData?.id
//                                                             ? 'items-end'
//                                                             : 'items-start'
//                                                     }`}
//                                                 >
//                                                     {message.sender_id !==
//                                                         personalData?.id && (
//                                                         <span className='text-xs text-gray-500 mb-1'>
//                                                             <ListItemIcon>
//                                                                 <Avatar>
//                                                                     {
//                                                                         currentContact.initials
//                                                                     }
//                                                                 </Avatar>{' '}
//                                                             </ListItemIcon>

//                                                             {
//                                                                 currentContact.fullName
//                                                             }

//                                                             <span className='text-xs text-gray-500 pt-7 ml-4'>
//                                                                 {formatDate(
//                                                                     message.created_at
//                                                                 )}
//                                                             </span>
//                                                         </span>
//                                                     )}
//                                                     {message.sender_id ===
//                                                         personalData?.id && (
//                                                         <span className='text-xs text-gray-500 mt-1'>
//                                                             <span className='mr-4'>
//                                                                 {formatDate(
//                                                                     message.created_at
//                                                                 )}
//                                                             </span>
//                                                             {'You'}
//                                                         </span>
//                                                     )}
//                                                     <div
//                                                         className={`relative max-w-xs px-4 py-2 mb-4 ${
//                                                             message.sender_id ===
//                                                             personalData?.id
//                                                                 ? 'bg-[#FAFAFA] rounded-l-lg rounded-b-lg bubble-grey-border'
//                                                                 : 'bg-[#64B5F6] rounded-r-lg rounded-b-lg'
//                                                         }`}
//                                                     >
//                                                         <span
//                                                             className={`text-sm ${
//                                                                 message.sender_id ===
//                                                                 personalData?.id
//                                                                     ? 'text-[#9E9E9E]'
//                                                                     : 'text-white'
//                                                             }`}
//                                                         >
//                                                             {message.message ||
//                                                                 null}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         <div ref={chatEndRef} />
//                                     </div>

//                                     <Box
//                                         sx={{
//                                             position: 'fixed',
//                                             bottom: 0,
//                                             left: 0,
//                                             right: 0,
//                                             borderTop: '1px solid #e3e3e3',
//                                             p: 1,
//                                             backgroundColor: 'white',
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                         }}
//                                     >
//                                         <div className=' mb-14 flex w-screen'>
//                                             <div className='justify-start w-11/12'>
//                                                 <TextField
//                                                     fullWidth
//                                                     size='small'
//                                                     placeholder='Type a message...'
//                                                     value={newMessage}
//                                                     onChange={(e) =>
//                                                         setNewMessage(
//                                                             e.target.value
//                                                         )
//                                                     }
//                                                     onKeyPress={
//                                                         handleInputKeyPress
//                                                     }
//                                                 />
//                                             </div>
//                                             <div className='justify-end'>
//                                                 <IconButton
//                                                     color='primary'
//                                                     onClick={handleButtonClick}
//                                                 >
//                                                     <SendIcon />
//                                                 </IconButton>
//                                             </div>
//                                         </div>
//                                     </Box>
//                                 </div>
//                             </div>
//                         ) : (
//                             drawer
//                         )}
//                     </Box>
//                 </Box>
//             ) : (
//                 <div className='flex flex-col pt-5 box-border h-screen'>
//                     <div className='flex-grow flex items-start justify-center'>
//                         <div className='w-screen p-6 box-border'>
//                             <div className='flex justify-center'>
//                                 <div className=' w-7/12 flex justify-between '>
//                                     <div className='justify-start mt-5'>
//                                         <h2 className='text-[2rem] font-normal'>
//                                             Messages
//                                         </h2>
//                                     </div>
//                                     <div className='justify-end mt-5'>
//                                         {/* <Button variant="contained">New Message</Button> */}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='flex justify-center mt-6 '>
//                                 <Paper className='flex h-144 w-7/12 '>
//                                     <div className='w-1/3 bg-white flex flex-col'>
//                                         <div className='p-4 border-b h-14'>
//                                             <div className='flex items-center'>
//                                                 <input
//                                                     className=' text-lg ml-2 p-1 min-w-[200px] h-9 flex-grow border-none text-gray-400 -mb-16  '
//                                                     placeholder='Search contact'
//                                                 />
//                                                 <span className='-mb-16'>
//                                                     <SearchIcon />
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className='pl-4 pr-4'>
//                                             <HorizontalDivider
//                                                 backgroundColor='#E5E5E5'
//                                                 height={1}
//                                             />
//                                         </div>
//                                         <List className='overflow-y-auto flex-grow h-144  '>
//                                             {isAuthorizedUser ? (
//                                                 allAccountProfiles.map(
//                                                     (profile) => (
//                                                         <ListItem
//                                                             button
//                                                             key={profile.id}
//                                                             selected={
//                                                                 profile.id ===
//                                                                 currentContact?.id
//                                                             }
//                                                             onClick={() =>
//                                                                 handleUserClickAndSetContact(
//                                                                     profile.id,
//                                                                     profile.first_name,
//                                                                     profile.last_name
//                                                                 )
//                                                             }
//                                                             ref={(node) =>
//                                                                 getContactListItemRef(
//                                                                     node,
//                                                                     profile.id
//                                                                 )
//                                                             }
//                                                         >
//                                                             <ListItemIcon>
//                                                                 <Avatar>
//                                                                     {profile.first_name
//                                                                         ?.split(
//                                                                             ' '
//                                                                         )[0][0]
//                                                                         .toUpperCase() +
//                                                                         profile.last_name
//                                                                             ?.split(
//                                                                                 ' '
//                                                                             )[0][0]
//                                                                             .toUpperCase() ||
//                                                                         null}
//                                                                 </Avatar>
//                                                             </ListItemIcon>
//                                                             <ListItemText
//                                                                 primary={
//                                                                     profile?.first_name +
//                                                                     ' ' +
//                                                                     profile?.last_name
//                                                                 }
//                                                                 secondary={
//                                                                     profile.lastMessage
//                                                                 }
//                                                                 primaryTypographyProps={{
//                                                                     style: {
//                                                                         fontSize:
//                                                                             '0.875rem',
//                                                                     },
//                                                                 }}
//                                                                 secondaryTypographyProps={{
//                                                                     style: {
//                                                                         fontSize:
//                                                                             '0.75rem',
//                                                                     },
//                                                                 }}
//                                                             />
//                                                             {profile.unreadMessages >
//                                                                 0 && (
//                                                                 <Badge
//                                                                     color='secondary'
//                                                                     variant='dot'
//                                                                 ></Badge>
//                                                             )}

//                                                             <span className='text-xs text-gray-600'>
//                                                                 {profile.time}
//                                                             </span>
//                                                         </ListItem>
//                                                     )
//                                                 )
//                                             ) : (
//                                                 <ListItem
//                                                     onClick={() =>
//                                                         setCurrentContact(
//                                                             DEFAULT_CONTACT
//                                                         )
//                                                     }
//                                                 >
//                                                     <ListItemIcon>
//                                                         <Avatar>
//                                                             {
//                                                                 DEFAULT_CONTACT.initials
//                                                             }
//                                                         </Avatar>
//                                                     </ListItemIcon>
//                                                     <ListItemText
//                                                         primary={
//                                                             DEFAULT_CONTACT.fullName
//                                                         }
//                                                         secondary={''}
//                                                         primaryTypographyProps={{
//                                                             style: {
//                                                                 fontSize:
//                                                                     '0.875rem',
//                                                             },
//                                                         }}
//                                                         secondaryTypographyProps={{
//                                                             style: {
//                                                                 fontSize:
//                                                                     '0.75rem',
//                                                             },
//                                                         }}
//                                                     />

//                                                     <span className='text-xs text-gray-600'>
//                                                         {/* {CUSTOMER_SERVICE_ID.time} */}
//                                                     </span>
//                                                 </ListItem>
//                                             )}
//                                         </List>
//                                     </div>
//                                     <VerticalDivider
//                                         backgroundColor='#d3d3d3'
//                                         width={'1'}
//                                     />
//                                     <div className='flex-1 flex flex-col'>
//                                         <div className='flex-none h-16 flex items-center border-b p-4 '>
//                                             {currentContact && (
//                                                 <Avatar>
//                                                     {currentContact.initials}
//                                                 </Avatar>
//                                             )}

//                                             <h2 className='text-xl font-semibold ml-4'>
//                                                 {currentContact?.fullName ??
//                                                     'Welcome to Bioverse Chat'}
//                                             </h2>
//                                         </div>
//                                         <div className='-mt-4'>
//                                             <HorizontalDivider
//                                                 backgroundColor='#E5E5E5'
//                                                 height={1}
//                                             />
//                                         </div>
//                                         <div className='flex-1 overflow-auto p-4 '>
//                                             {messages.map((message, index) => (
//                                                 <div
//                                                     key={index}
//                                                     className={`flex ${
//                                                         message.sender_id ===
//                                                         personalData?.id
//                                                             ? 'justify-end'
//                                                             : 'justify-start'
//                                                     }`}
//                                                 >
//                                                     <div
//                                                         key={index}
//                                                         className={`flex ${
//                                                             message.sender_id ===
//                                                             personalData?.id
//                                                                 ? 'justify-end'
//                                                                 : 'justify-start'
//                                                         }`}
//                                                     />
//                                                     {message.sender_id ===
//                                                         personalData?.id && (
//                                                         <span className='text-xs text-gray-500 pt-7 mr-4 '>
//                                                             {formatDate(
//                                                                 message.created_at
//                                                             )}
//                                                         </span>
//                                                     )}
//                                                     <div
//                                                         className={`flex flex-col  ${
//                                                             message.sender_id ===
//                                                             personalData?.id
//                                                                 ? 'items-end'
//                                                                 : 'items-start'
//                                                         }`}
//                                                     >
//                                                         {message.sender_id !==
//                                                             personalData?.id && (
//                                                             <span className='text-xs text-gray-500 mb-1'>
//                                                                 {
//                                                                     currentContact?.firstName
//                                                                 }
//                                                             </span>
//                                                         )}

//                                                         {message.sender_id ===
//                                                             personalData?.id && (
//                                                             <span className='text-xs text-gray-500 mt-1'>
//                                                                 {'You'}
//                                                             </span>
//                                                         )}
//                                                         <div
//                                                             className={`relative max-w-xs px-4 py-2 ${
//                                                                 message.sender_id ===
//                                                                 personalData?.id
//                                                                     ? 'bg-[#FAFAFA] rounded-l-lg rounded-b-lg bubble-grey-border'
//                                                                     : 'bg-[#64B5F6] rounded-r-lg rounded-b-lg'
//                                                             }`}
//                                                         >
//                                                             <span
//                                                                 className={`text-sm ${
//                                                                     message.sender_id ===
//                                                                     personalData?.id
//                                                                         ? 'text-[#9E9E9E]'
//                                                                         : 'text-white'
//                                                                 }`}
//                                                             >
//                                                                 {message.message ||
//                                                                     null}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                     {message.sender_id !==
//                                                         personalData?.id && (
//                                                         <span className='text-xs text-gray-500 pt-8 ml-4 items-center'>
//                                                             {formatDate(
//                                                                 message.created_at
//                                                             )}
//                                                         </span>
//                                                     )}
//                                                     <div ref={chatEndRef} />
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <div>
//                                             <VerticalDivider
//                                                 backgroundColor='#E5E5E5'
//                                                 width={'1'}
//                                             />
//                                         </div>

//                                         <div className='flex-none '>
//                                             <div className='flex items-center p-4'>
//                                                 <TextField
//                                                     fullWidth
//                                                     size='small'
//                                                     placeholder='Type a message...'
//                                                     value={newMessage}
//                                                     onChange={(e) =>
//                                                         setNewMessage(
//                                                             e.target.value
//                                                         )
//                                                     }
//                                                     onKeyPress={
//                                                         handleInputKeyPress
//                                                     }
//                                                 />
//                                                 <AttachFileIcon />
//                                                 <IconButton
//                                                     color='primary'
//                                                     onClick={handleButtonClick}
//                                                 >
//                                                     <SendIcon />
//                                                 </IconButton>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </Paper>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Chat;
// function people(value: any, index: number, array: any[]): unknown {
//     throw new Error('Function not implemented.');
// }
