'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    getMessagesForThread,
    postNewMessage,
} from '@/app/utils/database/controller/messaging/messages/messages';
import useSWR from 'swr';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Paper, IconButton } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import ThreadMessage from './thread-message/thread-message';
import PatientThreadInputBox from './input-box/thread-input-box';
import { MessagePayload } from '@/app/types/messages/messages-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface ThreadContainerProps {
    thread_id: string;
    setThreadToView: (thread_id: string | null) => void;
    user_id: string;
}

export default function ThreadContainer({
    thread_id,
    setThreadToView,
    user_id,
}: ThreadContainerProps) {
    /**
     * SWR method to obtain thread message data
     */
    const {
        data: message_data,
        error: message_error,
        isLoading: messages_loading,
        mutate,
    } = useSWR(`${thread_id}-messages`, () => getMessagesForThread(thread_id));

    const [messageForSend, setMessageForSend] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null); // Ref for the message container

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, [message_data, messages_loading]);

    if (messages_loading) {
        return <LoadingScreen />;
    }

    if (message_error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    /**
     * 
     *  interface MessagePayload {
                sender_id: string;
                content: string;
                thread_id: number;
                contains_phi?: boolean;
            }
     * 
     */

    const handleSend = () => {
        if (messageForSend) {
            const newMessagePayload: MessagePayload = {
                sender_id: user_id,
                content: messageForSend,
                thread_id: parseInt(thread_id),
                contains_phi: true,
            };

            postNewMessage(newMessagePayload);
            setMessageForSend('');
            mutate();
        }
    };

    return (
        <>
            <Paper
                component='main'
                className='flex flex-col items-center'
                sx={{
                    flexGrow: 1,
                    // p: 3,
                    marginTop: '20px',
                    marginBottom: '40px',
                    minHeight: '50vh',
                    width: '100%',
                }}
            >
                <div className='flex flex-col w-full items-center'>
                    <div className='flex items-start justify-start w-full py-2 border-b-2 border-[#9A9A9A] border-solid border-0 md:border-1 rounded'>
                        <IconButton
                            color='inherit'
                            className='flex ml-2'
                            aria-label='back to contacts'
                            edge='start'
                            onClick={() => setThreadToView(null)}
                        >
                            <ArrowBackIcon
                                sx={{
                                    color: 'grey',
                                    fontSize: '24px',
                                    lineHeight: '24px',
                                }}
                            />
                            <BioType className='ml-2 it-body md:itd-body text-gray-400 '>
                                {' '}
                                Back to messages
                            </BioType>
                        </IconButton>
                    </div>
                    <div
                        ref={messageContainerRef}
                        className='w-full h-[55vh] md:h-[600px] md:w-[500px] flex flex-col p-6 overflow-y-auto mt-1'
                    >
                        {message_data?.map((message, index, array) => {
                            return (
                                <Fragment key={message.id}>
                                    <ThreadMessage
                                        user_id={user_id}
                                        message={message}
                                    />
                                </Fragment>
                            );
                        })}
                    </div>
                    <PatientThreadInputBox
                        current_message_content={messageForSend}
                        setCurrentMessage={setMessageForSend}
                        handleSend={handleSend}
                    />
                </div>
            </Paper>
        </>
    );
}
