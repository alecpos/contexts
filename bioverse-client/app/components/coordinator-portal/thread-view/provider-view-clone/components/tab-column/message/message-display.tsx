'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    formatChatTimestamp,
    getMessageSecondsDifference,
} from '@/app/utils/actions/message/message-util';
import {
    Avatar,
    FormControl,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

import React, {
    Dispatch,
    SetStateAction,
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import MessageTextEditor from './text-editor/message-text-editor';
import { loadPatientThreadData } from '@/app/utils/actions/message/message-v2-actions';
import useSWR from 'swr';
import { postNewMessage } from '@/app/utils/database/controller/messaging/messages/messages';
import MessageBubble from './message-bubble/message-bubble';
import { displayUserTitle } from '../../../utils/messages/utils';
import {
    InitialMessageV2,
    MessagePayload,
} from '@/app/types/messages/messages-types';
import { replaceCoordinatorParameters } from '@/app/utils/database/controller/macros/macros';
import { createNewCoordinatorActivityAudit } from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';
import { getPatientAndOrderDataWithThreadId } from '../../../utils/data-fetching/coordinator-thread-data-fetch';
import { Status } from '@/app/types/global/global-enumerators';

interface MessageDisplayProps {
    patient_data: DBPatientData;
    providerId: string;
    userFirstName: string;
    userLastName: string;
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    setMacroDestination: Dispatch<SetStateAction<string>>;
}
const MessageDisplay = ({
    patient_data,
    providerId,
    userFirstName,
    userLastName,
    setTabSelected,
    messageContent,
    setMessageContent,
    setMacroDestination,
}: MessageDisplayProps) => {
    const [currentThreadIndex, setCurrentThreadIndex] = useState<number>(0);
    const [containsPHI, setContainsPHI] = useState<boolean>(true);
    const [requiresCoordinator, setRequiresCoordinator] =
        useState<boolean>(false);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const [parameterReplaceMessageContent, setParameterReplaceMessageContent] =
        useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string>('');
    const handleIndexChange = (event: SelectChangeEvent) => {
        setCurrentThreadIndex(parseInt(event.target.value));
    };
    const [messageData, setMessageData] = useState<{
        id: string;
        product: string;
        messages: any[];
    }>();

    const handledViewedThreadActivity = useRef(false);

    const { data, error, isLoading, mutate } = useSWR(
        `${patient_data.id}-all-message-data`,
        () => loadPatientThreadData(patient_data.id)
    );

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    const handleCoordinatorAudit = async (action: string) => {
        if (!messageData?.id) {
            console.error('Message data not available');
            return;
        }

        const time = new Date().getTime();

        const patientAndOrderData = await getPatientAndOrderDataWithThreadId(
            messageData.id as unknown as number
        );

        const new_audit: CoordinatorActivityAuditCreateObject = {
            coordinator_id: (await readUserSession()).data.session?.user.id!,
            action:
                action === 'sent-message' ? 'message_thread' : 'view_thread',
            timestamp: time,
            metadata: {
                content:
                    action === 'sent-message'
                        ? parameterReplaceMessageContent
                        : '',
                threadId: messageData.id,
                last_message_sender:
                    messageData && messageData?.messages?.length
                        ? messageData.messages[messageData.messages.length - 1]
                              .sender_id
                        : 'No messages',
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            order_id: patientAndOrderData.order_data.id,
            //coordinator_role: (await readUserSession()).data.session?.user.role!
        };

        const status = await createNewCoordinatorActivityAudit(new_audit);
        if (status === Status.Error) {
            console.error('Error creating coordinator activity audit');
        } else {
            console.log('audit inserted');
        }
    };

    useEffect(() => {
        setParameterReplaceMessageContent(
            replaceCoordinatorParameters(
                patient_data,
                userFirstName,
                userLastName,
                messageContent
            )
        );
    }, [messageContent]);
    useEffect(() => {
        if (!isLoading) {
            if (data) {
                setMessageData(data[currentThreadIndex]);
            }
        }
    }, [data, currentThreadIndex, isLoading]);

    useEffect(() => {
        const handleViewedThread = async () => {
            if (!handledViewedThreadActivity.current && messageData?.id) {
                await handleCoordinatorAudit('viewed_thread');
                handledViewedThreadActivity.current = true;
            }
        };
        handleViewedThread();
    }, [messageData]);

    // Brute-force scroll to bottom
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = 9999999;
            setTimeout(() => {
                if (messageContainerRef.current) {
                    messageContainerRef.current.scrollTop = 9999999;
                }
            }, 50);
            requestAnimationFrame(() => {
                if (messageContainerRef.current) {
                    messageContainerRef.current.scrollTop = 9999999;
                }
            });
        }
    }, [messageData]);

    if (isLoading) {
        return (
            <>
                <BioType className='flex p-4 itd-input'>Loading..</BioType>
            </>
        );
    }

    if (error || !data) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const sendNewMessageToThread = async () => {
        const current_user_id = (await readUserSession()).data.session?.user.id;

        if (
            parameterReplaceMessageContent.includes('***') ||
            parameterReplaceMessageContent.includes('{{')
        ) {
            setErrorMessage(
                'The message contains parameters that need to be replaced. Please check the message content'
            );
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        } else {
            const new_message_payload: MessagePayload = {
                sender_id: current_user_id!,
                content: parameterReplaceMessageContent,
                thread_id: parseInt(messageData!.id),
                contains_phi: containsPHI,
                ...(requiresCoordinator
                    ? { requires_coordinator: requiresCoordinator }
                    : {}),
            };

            await postNewMessage(new_message_payload);
            await handleCoordinatorAudit('sent-message');
            setMessageContent('');
            mutate();
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='flex flex-col px-6 py-2'>
                <div className='flex flex-row justify-between'>
                    <FormControl
                        sx={{ minWidth: 120, border: 'none', width: '100%' }}
                    >
                        <Select
                            id='product-select-menu'
                            value={currentThreadIndex.toString()}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={handleIndexChange}
                            className='text-black mx-[8px] inter-basic text-[14px] rounded-lg h-10'
                            sx={{ borderRadius: '12px', padding: 0 }}
                        >
                            {data.map((message_data, index) => (
                                <MenuItem
                                    key={index}
                                    value={index}
                                    sx={{ borderRadius: '3px', padding: 0 }}
                                >
                                    <span className='inter-basic text-[14px] px-3'>
                                        {message_data.product}
                                    </span>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div
                ref={messageContainerRef}
                className='flex overflow-y-auto px-6 h-full items-start flex-col gap-[24px] min-h-[500px]'
            >
                {messageData &&
                    messageData.messages.map(
                        (message: InitialMessageV2, index: number) => {
                            const showHeader =
                                index === 0 ||
                                message.sender_id !==
                                    messageData.messages[index - 1].sender_id ||
                                getMessageSecondsDifference(
                                    message.created_at,
                                    messageData.messages[index - 1].created_at
                                ) >= 3600;

                            return (
                                <React.Fragment
                                    key={message.message_id_ || index}
                                >
                                    <div className='flex flex-col w-full'>
                                        {showHeader && (
                                            <MessageHeader
                                                sender={message.sender}
                                                timestamp={message.created_at}
                                            />
                                        )}
                                        <div
                                            className={`flex w-full ${
                                                message.sender_id === providerId
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`flex flex-col ${
                                                    message.sender_id ===
                                                    providerId
                                                        ? 'items-end'
                                                        : 'items-start'
                                                }`}
                                            >
                                                <div
                                                    className={`relative max-w-xs px-[22px] py-4 ${
                                                        message.sender_id ===
                                                        providerId
                                                            ? 'bg-[#64B5F6] rounded-[12px]'
                                                            : message.sender_id ===
                                                              patient_data.id
                                                            ? 'bg-[#e0f6ff] rounded-[12px]'
                                                            : 'bg-[#fafafa] rounded-[12px]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`itd-body text-sm text-${
                                                            message.sender_id ===
                                                            providerId
                                                                ? 'white'
                                                                : 'black'
                                                        }`}
                                                    >
                                                        <MessageBubble
                                                            content={
                                                                message.content
                                                            }
                                                            attachment_urls={
                                                                message.attachment_urls
                                                            }
                                                            created_at={
                                                                message.created_at
                                                            }
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        }
                    )}
                <div className='flex flex-col h-full flex-grow'></div>
            </div>

            <div
                className='px-6 py-2 sticky top-0 bg-white z-10'
                id='message-text-editor'
            >
                <MessageTextEditor
                    setTabSelected={setTabSelected}
                    messageContent={parameterReplaceMessageContent}
                    setMessageContent={setMessageContent}
                    patient_id={patient_data.id}
                    setMacroDestination={setMacroDestination}
                    sendNewMessageToThread={sendNewMessageToThread}
                    containsPHI={containsPHI}
                    setContainsPHI={setContainsPHI}
                    requiresCoordinator={requiresCoordinator}
                    setRequiresCoordinator={setRequiresCoordinator}
                    errorMessage={errorMessage}
                    currentMessageData={messageData}
                    providerId={providerId}
                />
            </div>
            {errorMessage && (
                <BioType className='body1 text-red-400 ml-2'>
                    {errorMessage}
                </BioType>
            )}
        </div>
    );
};

export default MessageDisplay;

const MessageHeader = React.memo(
    ({ sender, timestamp }: { sender: any; timestamp: Date }) => {
        // Default values for when sender is undefined or missing properties
        const firstName = sender?.first_name || 'U';
        const lastName = sender?.last_name || '';
        const initials = `${firstName.charAt(0)}${lastName.charAt(0) || ''}`;

        return (
            <div className='flex w-full justify-between'>
                <div className='flex my-2'>
                    <ListItemIcon>
                        {sender?.provider_data?.profile_picture_url ? (
                            <Avatar
                                alt={initials}
                                src={sender.provider_data.profile_picture_url}
                            />
                        ) : (
                            <Avatar sx={{ bgcolor: '#D9D9D9' }}>
                                {initials || 'U'}
                            </Avatar>
                        )}
                    </ListItemIcon>
                    <div>
                        <BioType className='provider-message-tab-sender-name'>
                            {sender
                                ? `${firstName} ${lastName}`
                                : 'Unknown User'}
                        </BioType>
                        <BioType className='provider-message-tab-sender-title'>
                            {displayUserTitle(sender?.provider_data?.role) ||
                                'User'}
                        </BioType>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <BioType className='provider-message-tab-message-timestamp'>
                        {formatChatTimestamp(timestamp)}
                    </BioType>
                </div>
            </div>
        );
    }
);

MessageHeader.displayName = 'MessageHeader';
