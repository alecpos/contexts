// import { useState, useEffect, useRef, Fragment } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import {
//     IconButton,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Avatar,
//     TextField,
//     Button,
//     Paper,
//     Badge,
//     Box,
//     MenuItem,
//     Select,
//     TextareaAutosize,
//     FormControl,
//     InputLabel,
// } from '@mui/material';
// import { dispatchNewMessage } from '@/app/utils/actions/message/message-actions';
// import { AvailableUser } from '@/app/types/messages/messages-types';

// interface Props {
//     open: boolean;
//     setOpen: any;
//     availableUsers: AvailableUser[];
//     userId: string;
//     loadChatData: any;
//     isProvider: boolean;
// }

// const NewMessageModal = ({
//     userId,
//     open,
//     setOpen,
//     availableUsers,
//     loadChatData,
//     isProvider,
// }: Props) => {
//     const [selectedUser, setSelectedUser] = useState('');
//     const [message, setMessage] = useState('');

//     let selectRef = useRef(null);

//     const handleSubmit = (event: any) => {
//         event.preventDefault();
//         if (!selectedUser) {
//             return;
//         }
//         dispatchNewMessage(userId, selectedUser, message);
//         setOpen(false);
//         setMessage('');
//         loadChatData();
//     };

//     return (
//         <Transition appear show={open} as={Fragment}>
//             <Dialog
//                 as="div"
//                 className="relative z-10"
//                 onClose={() => setOpen(false)}
//                 initialFocus={selectRef}
//             >
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black/25" />
//                 </Transition.Child>

//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4 text-center">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 scale-95"
//                             enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 scale-100"
//                             leaveTo="opacity-0 scale-95"
//                         >
//                             <Dialog.Panel className="w-[410px] h-[325px] transform overflow-y-scroll rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all flex justify-center">
//                                 <form
//                                     onSubmit={handleSubmit}
//                                     className="flex flex-col"
//                                 >
//                                     <Select
//                                         labelId="user-select-label"
//                                         sx={{
//                                             width: '366px',
//                                             height: '40px',
//                                         }}
//                                         ref={selectRef}
//                                         displayEmpty
//                                         value={selectedUser}
//                                         onChange={(e) =>
//                                             setSelectedUser(e.target.value)
//                                         }
//                                     >
//                                         <MenuItem value="">
//                                             Select a user
//                                         </MenuItem>
//                                         {availableUsers?.map((user, index) => (
//                                             <MenuItem
//                                                 value={user.user_id}
//                                                 key={index}
//                                             >
//                                                 {user.first_name}{' '}
//                                                 {user.last_name}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                     <TextField
//                                         multiline
//                                         minRows={8}
//                                         required
//                                         placeholder="Type your message here"
//                                         sx={{ width: '366px' }}
//                                         value={message}
//                                         onChange={(e) =>
//                                             setMessage(e.target.value)
//                                         }
//                                     />
//                                     <div className="flex justify-center mt-4">
//                                         <Button
//                                             type="submit"
//                                             variant="contained"
//                                             sx={{ width: '81px' }}
//                                         >
//                                             SEND
//                                         </Button>
//                                     </div>
//                                 </form>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// };

// export default NewMessageModal;
