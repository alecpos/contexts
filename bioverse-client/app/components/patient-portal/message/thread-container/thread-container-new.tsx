'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    getMessagesForThread,
    postNewMessage,
} from '@/app/utils/database/controller/messaging/messages/messages';
import useSWR from 'swr';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import ThreadMessage from './thread-message/thread-message';
import PatientThreadInputBox from './input-box/thread-input-box';
import { MessagePayload } from '@/app/types/messages/messages-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { MESSAGE_REPLIED } from '@/app/services/customerio/event_names';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { getMessageSecondsDifference } from '../../../../utils/actions/message/message-util';

// Update MessagePayload interface
interface ExtendedMessagePayload extends MessagePayload {
    attachment_urls?: string;
}

interface ThreadNewContainerProps {
    thread_id: string;
    setThreadToView: (thread_id: string | null) => void;
    user_id: string;
}

export default function ThreadNewContainer({
    thread_id,
    setThreadToView,
    user_id,
}: ThreadNewContainerProps) {
    /**
     * SWR method to obtain thread message data
     */
    const {
        data: message_data,
        error: message_error,
        isLoading: messages_loading,
        mutate,
    } = useSWR(`${thread_id}-messages`, () => getMessagesForThread(thread_id), {
        refreshInterval: 10000, // Poll every 10 seconds for new messages
    });

    const [messageForSend, setMessageForSend] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [inputBoxHeight, setInputBoxHeight] = useState(0);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const inputBoxRef = useRef<HTMLDivElement>(null);

    // Effect to measure and update input box height
    useEffect(() => {
        const updateInputBoxHeight = () => {
            if (inputBoxRef.current) {
                const height =
                    inputBoxRef.current.getBoundingClientRect().height;
                setInputBoxHeight(height);
            }
        };

        // Initial measurement
        updateInputBoxHeight();

        // Set up resize observer to handle dynamic height changes
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height;
                setInputBoxHeight(height);
            }
        });

        if (inputBoxRef.current) {
            resizeObserver.observe(inputBoxRef.current);
        }

        // Also update on window resize
        window.addEventListener('resize', updateInputBoxHeight);

        // Cleanup
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateInputBoxHeight);
        };
    }, []);

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
     * Uploads a file to Supabase storage
     */
    const uploadFileToSupabase = async (file: File): Promise<string> => {
        const supabase = createSupabaseBrowserClient();
        const fileName = `${Date.now()}_${file.name.replace(
            /[^a-zA-Z0-9.]/g,
            '_'
        )}`;
        const filePath = `${thread_id}/${fileName}`;

        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            throw new Error(`File "${file.name}" exceeds 50MB limit.`);
        }

        const { data, error } = await supabase.storage
            .from('chat_attachments')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('chat_attachments').getPublicUrl(filePath);

        return publicUrl;
    };

    /**
     * Handle sending a text message
     */
    const handleSend = async () => {
        if (messageForSend) {
            setIsUploading(true);

            const newMessagePayload: ExtendedMessagePayload = {
                sender_id: user_id,
                content: messageForSend,
                thread_id: parseInt(thread_id),
                contains_phi: true,
            };

            try {
                await postNewMessage(newMessagePayload);
                triggerEvent(user_id, MESSAGE_REPLIED);
                setMessageForSend('');
                mutate();
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Failed to send message. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    /**
     * Handle sending a message with files (images or documents)
     */
    const handleSendWithFiles = async (files: File[]) => {
        if (!files.length && !messageForSend.trim()) return;

        setIsUploading(true);

        try {
            // Upload all files to Supabase
            const uploadPromises = files.map((file) =>
                uploadFileToSupabase(file)
            );
            const uploadedUrls = await Promise.all(uploadPromises);

            // Format URLs as comma-separated string
            const attachmentUrlsString = uploadedUrls.join(',');

            // Create message with attachment URLs
            const newMessagePayload: ExtendedMessagePayload = {
                sender_id: user_id,
                content: messageForSend || '',
                thread_id: parseInt(thread_id),
                contains_phi: true,
                attachment_urls: attachmentUrlsString,
            };

            await postNewMessage(newMessagePayload);
            triggerEvent(user_id, MESSAGE_REPLIED);
            setMessageForSend('');
            mutate();
        } catch (error) {
            console.error('Error sending message with files:', error);
            alert('Failed to upload one or more files. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='w-full h-[calc(100vh-var(--nav-height-mobile)-52px)] md:h-[calc(100vh-var(--nav-height)-52px)] flex flex-col relative overflow-hidden'>
            {/* Back Button - Positioned absolutely */}
            <div className='absolute top-0 left-0 z-10 p-4'>
                <IconButton
                    color='inherit'
                    className='flex'
                    aria-label='back to contacts'
                    edge='start'
                    onClick={() => setThreadToView(null)}
                >
                    <div className='bg-[#333333BF] w-[44px] h-[44px] rounded-full flex items-center justify-center'>
                        <ArrowBackIosNewIcon
                            sx={{
                                color: 'white',
                                fontSize: '26px',
                                lineHeight: '44px',
                                borderRadius: '10px',
                            }}
                        />
                    </div>
                </IconButton>
            </div>

            <div className='w-full mx-auto flex flex-col h-full'>
                {/* Message Container */}
                <div className='overflow-hidden border-0 md:border-2 md:rounded bg-white flex-shrink-0 flex-1'>
                    <div
                        ref={messageContainerRef}
                        className='h-[calc(100vh-var(--nav-height-mobile)-56px-var(--input-height))] md:h-[calc(100vh-var(--nav-height)-56px-var(--input-height))] overflow-y-auto pb-6'
                        style={
                            {
                                '--input-height': `${inputBoxHeight}px`,
                            } as React.CSSProperties
                        }
                    >
                        {message_data?.map((message, index, array) => {
                            // Determine if message starts a new group
                            const startsNewGroup =
                                index === 0 ||
                                message.sender_id !==
                                    array[index - 1].sender_id ||
                                getMessageSecondsDifference(
                                    message.created_at,
                                    array[index - 1].created_at
                                ) >= 3600;

                            // Determine if message ends its group
                            const endsGroup =
                                index === array.length - 1 ||
                                message.sender_id !==
                                    array[index + 1].sender_id ||
                                getMessageSecondsDifference(
                                    array[index + 1].created_at,
                                    message.created_at
                                ) >= 3600;

                            return (
                                <Fragment key={message.id}>
                                    <ThreadMessage
                                        user_id={user_id}
                                        message={message}
                                        startsNewGroup={startsNewGroup}
                                        endsGroup={endsGroup}
                                    />
                                </Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Input Box */}
                <div
                    ref={inputBoxRef}
                    className='w-full bg-white border-t flex-shrink-0'
                >
                    <PatientThreadInputBox
                        current_message_content={messageForSend}
                        setCurrentMessage={setMessageForSend}
                        handleSend={handleSend}
                        handleSendWithImages={handleSendWithFiles}
                        isUploading={isUploading}
                    />
                </div>
            </div>
        </div>
    );
}
