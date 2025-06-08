import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    UserMessage,
    ThreadMember,
    GroupedMessages,
    Message,
} from '@/app/types/provider-portal/messages/message-types';
import {
    getThreadRecepientNames,
    getUserThreads,
    groupMessagesByThreadId,
} from '@/app/utils/functions/provider-portal/messages/admin-message-center';
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

interface UserDetailsProps {
    selectedUser: UserMessage;
}

const defaultGroupedMessage = {};

function formatDate(isoDateString: string | Date) {
    const date = new Date(isoDateString);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${monthNames[monthIndex]} ${day} at ${formattedHours}:${formattedMinutes}${ampm}`;
}

export default function UserDetails({ selectedUser }: UserDetailsProps) {
    const [threadMembers, setThreadMembers] = useState<ThreadMember[]>([]);
    const [groupedMessages, setGroupedMessages] = useState<GroupedMessages>(
        defaultGroupedMessage
    );
    const [activeThread, setActiveThread] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [currentMessage, setCurrentMessage] = useState<string>('');

    // Purpose: Load up all messages data for the user
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedUser.user_id) {
                return;
            }
            const { messageData, threadMembers, success } =
                await getUserThreads(selectedUser.user_id);
            if (!success) {
                return;
            }
            const filtered = await groupMessagesByThreadId(messageData);
            // setThreadMembers([
            //     {
            //         thread_id: 217,
            //         first_name: 'Amanda',
            //         last_name: 'Little',
            //     },
            // ]);
            setThreadMembers(threadMembers);
            setGroupedMessages(filtered);
            // setGroupedMessages({
            //     '217': [
            //         {
            //             created_at: '2024-04-06T00:32:13.255908+00:00',
            //             sender_id: 'da5b213d-7676-4792-bc73-11151d0da4e6',
            //             first_name: 'Amanda',
            //             last_name: 'Little',
            //             email: 'amanda.little@getzealthy.com',
            //             content:
            //                 'My name is Amanda and I am one of the providers here at Bioverse. Your requested prescription is approved and submitted. You will receive an email when your medication is shipped. Please review the links in that email as it contains important medication information. Lastly, please let your in-person provider know that you’re on a new medication.  Let us know here if you have any questions! - Amanda, CNP',
            //             thread_id: 217,
            //         },
            //         {
            //             created_at: '2024-04-08T12:30:47.41059+00:00',
            //             sender_id: 'aaf15ec2-b5af-456c-8751-b7ea78238aa8',
            //             first_name: 'Rose',
            //             last_name: 'Adams',
            //             email: 'rcsmith_rn@hotmail.com',
            //             content: 'Thank you ',
            //             thread_id: 217,
            //         },
            //         {
            //             created_at: '2024-04-10T18:04:20.938301+00:00',
            //             sender_id: 'aaf15ec2-b5af-456c-8751-b7ea78238aa8',
            //             first_name: 'Rose',
            //             last_name: 'Adams',
            //             email: 'rcsmith_rn@hotmail.com',
            //             content: 'do you know how long it takes to ship? ',
            //             thread_id: 217,
            //         },
            //         {
            //             created_at: '2024-04-10T19:16:16.625868+00:00',
            //             sender_id: 'da5b213d-7676-4792-bc73-11151d0da4e6',
            //             first_name: 'Amanda',
            //             last_name: 'Little',
            //             email: 'amanda.little@getzealthy.com',
            //             content: 'Usually within a week',
            //             thread_id: 217,
            //         },
            //         {
            //             created_at: '2024-04-10T19:18:04.1684+00:00',
            //             sender_id: 'aaf15ec2-b5af-456c-8751-b7ea78238aa8',
            //             first_name: 'Rose',
            //             last_name: 'Adams',
            //             email: 'rcsmith_rn@hotmail.com',
            //             content: 'Thank you!',
            //             thread_id: 217,
            //         },
            //     ],
            // });
            setLoading(false);
        };
        if (selectedUser.user_id) {
            setLoading(true);
            fetchData();
        }
    }, [selectedUser]);

    const handleChange = (event: SelectChangeEvent) => {
        setActiveThread(parseInt(event.target.value));
    };

    const handleSend = async () => {};

    if (loading) {
        return (
            <div className='w-full h-full flex justify-center items-center'>
                <CircularProgress size={30} />
            </div>
        );
    }

    return (
        <div className='w-full'>
            <div className='flex justify-center items-center w-full h-[72px] border-b border-solid border-black border-t-0 border-l-0 border-r-0'>
                <BioType className='body1bold text-[24px]'>
                    {selectedUser.first_name} {selectedUser.last_name}{' '}
                    {selectedUser.user_id && '•'}{' '}
                    <span className='body1 italic text-gray-400'>
                        {selectedUser.email}
                    </span>
                </BioType>
            </div>
            <div className='w-full flex justify-center'>
                <div className='w-[80%] mt-4'>
                    <FormControl fullWidth>
                        <InputLabel>Select Group</InputLabel>
                        <Select
                            value={String(activeThread)}
                            label='Group'
                            onChange={handleChange}
                            fullWidth
                        >
                            {threadMembers.map(
                                (threadMember: ThreadMember, index: number) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={threadMember.thread_id}
                                        >
                                            {threadMember.first_name}{' '}
                                            {threadMember.last_name}
                                        </MenuItem>
                                    );
                                }
                            )}
                            {threadMembers.length === 0 && (
                                <MenuItem disabled value='0'>
                                    No Active Chats
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    {/* Message Chat */}
                    <ScrollToBottom className='w-full mt-4 h-[600px] overflow-y-scroll border border-black border-solid flex flex-col items-center space-y-2'>
                        {!isEmpty(groupedMessages[activeThread]) &&
                            groupedMessages[activeThread].map(
                                (message: Message, index: number) => {
                                    return (
                                        <div
                                            className='w-full ml-5'
                                            key={index}
                                        >
                                            <BioType
                                                className={`body1 ${
                                                    index === 0 ? 'mt-4' : ''
                                                }`}
                                            >
                                                {message.first_name}{' '}
                                                {message.last_name}{' '}
                                                {formatDate(message.created_at)}
                                            </BioType>
                                            <div
                                                className={`max-w-[400px] w-fit mt-0.5 bg-[#64B5F6] p-4 rounded-md rounded-bl-none ${
                                                    index ===
                                                    groupedMessages[
                                                        activeThread
                                                    ].length -
                                                        1
                                                        ? 'mb-4'
                                                        : 'mb-4'
                                                }`}
                                            >
                                                <BioType className='body1 text-white'>
                                                    {message.content}
                                                </BioType>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                    </ScrollToBottom>
                    {/* Input Box */}
                    {/* <div className="w-full h-[60px] flex justify-between">
                        <TextField
                            fullWidth
                            // size="small"
                            placeholder="Type a message..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && handleSend()
                            }
                        />
                        <Button
                            variant="contained"
                            sx={{ width: 100, height: '70%' }}
                        >
                            <BioType className="text-white body1">Send</BioType>
                        </Button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
