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
    useMemo,
    useRef,
} from 'react';
import MessageTextEditor from './text-editor/message-text-editor';
import { loadPatientThreadData } from '@/app/utils/actions/message/message-v2-actions';
import useSWR from 'swr';
import { postNewMessage } from '@/app/utils/database/controller/messaging/messages/messages';
import MessageBubble from './message-components/message-bubble';
import {
    InitialMessageV2,
    MessagePayload,
} from '@/app/types/messages/messages-types';
import { displayUserTitle } from '@/app/components/coordinator-portal/thread-view/provider-view-clone/utils/messages/utils';
import { replaceParameters } from '@/app/utils/database/controller/macros/macros';
import { OrderType } from '@/app/types/orders/order-types';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { updateRenewalOrderFromRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import MessageItem from './message-components/message-item';
import { auditErrorToSupabase } from '@/app/utils/database/controller/site-error-audit/site_error_audit';
import { SITE_ERROR_IDENTIFIER } from '@/app/utils/database/controller/site-error-audit/site_error_identifiers';

interface MessageDisplayProps {
    patient_data: DBPatientData;
    providerId: string;
    providerName: string;
    credentials: string;
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    order_data: DBOrderData;
    orderType: OrderType;
    responseRequired: boolean;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
    statusTag: string | undefined;
}
const MessageDisplay: React.FC<MessageDisplayProps> = ({
    patient_data,
    providerId,
    providerName,
    credentials,
    setTabSelected,
    messageContent,
    setMessageContent,
    orderType,
    order_data,
    responseRequired,
    setResponseRequired,
    statusTag,
}: MessageDisplayProps) => {
    const [currentThreadIndex, setCurrentThreadIndex] = useState<number>(0);
    const [containsPHI, setContainsPHI] = useState<boolean>(true);
    const [coordinatorRequired, setCoordinatorRequired] =
        useState<boolean>(false);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState(0);

    const handleIndexChange = (event: SelectChangeEvent) => {
        setCurrentThreadIndex(parseInt(event.target.value));
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    const [parameterReplaceMessageContent, setParameterReplaceMessageContent] =
        useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageData, setMessageData] = useState<
        { id: string; product: string; messages: any }[]
    >([]);

    const { data, error, isLoading, mutate } = useSWR(
        `${patient_data.id}-all-message-data`,
        () => loadPatientThreadData(patient_data.id),
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
            shouldRetryOnError: false,
            revalidateOnReconnect: false,
        }
    );

    const messageList = useMemo(() => {
        if (!messageData || !messageData[currentThreadIndex]) return null;

        return messageData[currentThreadIndex].messages.map(
            (message: InitialMessageV2, index: number) => {
                const showHeader =
                    index === 0 ||
                    message.sender_id !==
                        messageData[currentThreadIndex].messages[index - 1]
                            .sender_id ||
                    getMessageSecondsDifference(
                        message.created_at,
                        messageData[currentThreadIndex].messages[index - 1]
                            .created_at
                    ) >= 3600;

                const isLast =
                    index ===
                    messageData[currentThreadIndex].messages.length - 1;

                return (
                    <React.Fragment key={message.message_id_ || index}>
                        <div className='flex flex-col w-full'>
                            {showHeader && (
                                <MessageHeader
                                    sender={message.sender}
                                    timestamp={message.created_at}
                                />
                            )}
                            <MessageItem
                                message={message}
                                providerId={providerId}
                                isCurrentUser={message.sender_id === providerId}
                                patientId={patient_data.id}
                            />
                        </div>
                    </React.Fragment>
                );
            }
        );
    }, [messageData, currentThreadIndex, providerId, patient_data.id]);

    useEffect(() => {
        if (coordinatorRequired) {
            setResponseRequired(false);
        }
    }, [coordinatorRequired]);

    useEffect(() => {
        if (responseRequired) {
            setCoordinatorRequired(false);
        }
    }, [responseRequired]);

    useEffect(() => {
        setParameterReplaceMessageContent(
            replaceParameters(
                patient_data,
                providerName,
                messageContent,
                credentials
            )
        );
    }, [messageContent]);

    useEffect(() => {
        if (data) {
            setMessageData(data);
            const dataIndex = data.findIndex(
                (item) => item.product === order_data.product_href
            );
            // Check if a matching index was found
            if (dataIndex !== -1) {
                setCurrentThreadIndex(dataIndex);
            }
        }
    }, [data, order_data.product_href]);

    // Track editor height
    useEffect(() => {
        if (editorRef.current) {
            setEditorHeight(editorRef.current.offsetHeight);
        }
    }, [parameterReplaceMessageContent]);

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
    }, [messageData, currentThreadIndex]);

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
        try {
            // Early validation of message content
            if (
                parameterReplaceMessageContent.includes('***') ||
                parameterReplaceMessageContent.includes('{{')
            ) {
                setErrorMessage(
                    'The message contains parameters that need to be replaced. Please check the message content'
                );
                setTimeout(() => setErrorMessage(''), 5000);
                return;
            }

            // Get user session and validate in parallel with other operations
            const userSessionPromise = readUserSession();

            // Prepare message payload while waiting for session
            const thread_id = parseInt(messageData[currentThreadIndex].id);

            // Wait for user session
            const {
                data: { session },
            } = await userSessionPromise;

            const current_user_id = session?.user.id;

            if (!current_user_id) {
                setErrorMessage(
                    'There was an issue with the Provider Session. Please refresh the page.'
                );
                setTimeout(() => setErrorMessage(''), 5000);
                return;
            }

            const new_message_payload: MessagePayload = {
                sender_id: current_user_id,
                content: parameterReplaceMessageContent,
                thread_id,
                contains_phi: containsPHI,
                ...(responseRequired
                    ? { requires_provider: responseRequired }
                    : {}),
                ...(coordinatorRequired
                    ? { requires_coordinator: coordinatorRequired }
                    : {}),
            };

            // Run all async operations in parallel
            await Promise.all([
                postNewMessage(new_message_payload),

                // orderType === OrderType.RenewalOrder && // commented out by Ben on 4/2/2025
                // order_data.renewal_order_id
                //     ? updateRenewalOrderFromRenewalOrderId(
                //           order_data.renewal_order_id,
                //           { autoshipped: false } //what's the point of setting autoshipped to false?
                //       )
                //     : Promise.resolve(),

                handleProviderAudit(),
            ]);

            // Update UI state after all operations are complete
            setMessageContent('');
            mutate();
        } catch (error: any) {
            console.error('Error sending message:', error);
            await auditErrorToSupabase(
                SITE_ERROR_IDENTIFIER.message_failure,
                `ISSUE IN SENDING MESSAGE TO PAITENT FROM PROVIDER INTAKE. PATIENT_ID=${
                    patient_data.id
                }, ORDER_ID=${
                    orderType === OrderType.RenewalOrder
                        ? order_data.renewal_order_id
                        : order_data.id
                }`,
                error
            );
            setErrorMessage(
                'An error occurred while sending the message. Please try again.'
            );
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    const handleProviderAudit = async () => {
        const time = new Date().getTime(); // Record start time

        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: 'message_intake',
            timestamp: time,
            metadata: {
                message_contents: messageContent,
                current_status_tag: statusTag ? statusTag : 'No status tag',
                last_message_sender:
                    messageList &&
                    messageData?.[currentThreadIndex]?.messages?.length
                        ? messageData[currentThreadIndex].messages[
                              messageData[currentThreadIndex].messages.length -
                                  1
                          ].sender_id
                        : 'No messages',
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            ...(orderType === OrderType.RenewalOrder
                ? {
                      renewal_order_id: order_data.renewal_order_id,
                      order_id: order_data.original_order_id!,
                  }
                : { order_id: order_data.id }),
        };

        await createNewProviderActivityAudit(new_audit);
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='flex flex-col  px-6 py-2'>
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
                className='flex-1 overflow-y-auto px-6 items-start flex-col gap-[24px] h-full'
            >
                {messageList}
                <div className='flex flex-col h-full flex-grow max-h-[1px]'></div>
                <div ref={bottomRef} />
            </div>
            <div
                className='px-6 py-2 sticky top-0 bg-white z-10'
                id='message-text-editor'
                ref={editorRef}
            >
                <MessageTextEditor
                    setTabSelected={setTabSelected}
                    messageContent={parameterReplaceMessageContent}
                    setMessageContent={setMessageContent}
                    patient_id={patient_data.id}
                    sendNewMessageToThread={sendNewMessageToThread}
                    containsPHI={containsPHI}
                    setContainsPHI={setContainsPHI}
                    responseRequired={responseRequired}
                    setResponseRequired={setResponseRequired}
                    requiresCoordinator={coordinatorRequired}
                    setRequiresCoordinator={setCoordinatorRequired}
                    currentMessageData={messageData[currentThreadIndex]}
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

                            {/**LEGITSCRIPTCODETOREMOVE */}
                            {firstName === 'Bobby' &&
                                lastName === 'Desai' &&
                                ' M.D.'}
                        </BioType>
                        <BioType className='provider-message-tab-sender-title'>
                            {sender?.last_name === 'Support Team' 
                                ? 'Coordinator' 
                                : displayUserTitle(sender?.provider_data?.role) || 'User'}
                        </BioType>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <BioType className='provider-message-tab-message-timestamp '>
                        {formatChatTimestamp(timestamp)}
                    </BioType>
                </div>
            </div>
        );
    }
);

MessageHeader.displayName = 'MessageHeader';
