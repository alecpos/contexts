// 'use client';

// import {
//     AccessLevel,
//     UserMessage,
// } from '@/app/types/provider-portal/messages/message-types';
// import { Box, Tab, Tabs } from '@mui/material';
// import { useState } from 'react';
// import SearchUsers from './components/SearchUsers';
// import UserDetails from './components/UserDetails';
// // import ChatUI from '@/app/(patient-portal)/portal/message/_deprecated/components/chatUI-old';

// interface AdminMessageCenterProps {
//     availableUsers: UserMessage[];
//     accessLevel: AccessLevel;
//     authLevel: any;
//     userId: string;
//     threads_data: any;
// }

// const defaultSelectedUser: UserMessage = {
//     first_name: '',
//     last_name: '',
//     user_id: '',
//     email: '',
// };

// export default function AdminMessageCenter({
//     availableUsers,
//     accessLevel,
//     authLevel,
//     userId,
//     threads_data,
// }: AdminMessageCenterProps) {
//     const [selectedUser, setSelectedUser] =
//         useState<UserMessage>(defaultSelectedUser);
//     const [activeTab, setActiveTab] = useState(0);

//     const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     console.log(threads_data);

//     return (
//         <div className='w-full'>
//             <Box
//                 sx={{
//                     borderBottom: 1,
//                     borderColor: 'divider',
//                     width: '100%',
//                 }}
//             >
//                 <Tabs
//                     value={activeTab}
//                     onChange={handleChange}
//                     aria-label='basic tabs example'
//                 >
//                     <Tab label='Send Messages' />
//                     <Tab label='View Messages' />
//                 </Tabs>
//             </Box>
//             <CustomTabPanel value={activeTab} index={0} />
//             <CustomTabPanel value={activeTab} index={1} />
//             <CustomTabPanel value={activeTab} index={2} />
//         </div>
//         // <div className="w-full flex">
//         //     <div className="w-[25%] h-screen border-r border-t-0 border-b-0 border-l-0 border-solid border-black overflow-y-scroll">
//         //         <SearchUsers
//         //             availableUsers={availableUsers}
//         //             setSelectedUser={setSelectedUser}
//         //             selectedUser={selectedUser}
//         //         />
//         //     </div>
//         //     <div className="w-full h-screen">
//         //         <UserDetails selectedUser={selectedUser} />
//         //     </div>
//         // </div>
//     );

//     interface TabPanelProps {
//         index: number;
//         value: number;
//     }
//     function CustomTabPanel({ index, value }: TabPanelProps) {
//         let content;
//         switch (value) {
//             case 0:
//                 content = (
//                     // <ChatUI
//                     //     authLevel={authLevel}
//                     //     userId={userId}
//                     //     isProvider={true}
//                     // />
//                     <></>
//                 );
//                 break;
//             case 1:
//                 content = (
//                     <div className='w-full flex'>
//                         <div className='w-[25%] h-screen border-r border-t-0 border-b-0 border-l-0 border-solid border-black overflow-y-scroll'>
//                             <SearchUsers
//                                 availableUsers={availableUsers}
//                                 setSelectedUser={setSelectedUser}
//                                 selectedUser={selectedUser}
//                             />
//                         </div>
//                         <div className='w-full h-screen'>
//                             <UserDetails selectedUser={selectedUser} />
//                         </div>
//                     </div>
//                 );
//                 break;
//             default:
//                 content = null;
//         }

//         return (
//             <div
//                 role='tabpanel'
//                 hidden={value !== index}
//                 id={`simple-tabpanel-${index}`}
//                 aria-labelledby={`simple-tab-${index}`}
//                 className='flex justify-center w-full'
//             >
//                 {value === index && <>{content}</>}
//             </div>
//         );
//     }
// }
