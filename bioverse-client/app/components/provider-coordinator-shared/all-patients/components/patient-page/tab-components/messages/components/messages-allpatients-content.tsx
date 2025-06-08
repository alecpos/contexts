'use client';

import { displayUserTitle } from '@/app/components/coordinator-portal/thread-view/provider-view-clone/utils/messages/utils';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import MessageBubble from '@/app/components/provider-portal/intake-view/v2/components/tab-column/message/message-components/message-bubble';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import {
    InitialMessageV2,
    MessagePayload,
} from '@/app/types/messages/messages-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    formatChatTimestamp,
    getMessageSecondsDifference,
} from '@/app/utils/actions/message/message-util';
import { loadPatientThreadData } from '@/app/utils/actions/message/message-v2-actions';
import { postNewMessage } from '@/app/utils/database/controller/messaging/messages/messages';
import {
    Avatar,
    FormControl,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import AllPatientsMessageTextEditor from './message-text-editor-allpatients';

interface MessagesAPProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

export default function MessagesAllPatientsContent({
    access_type,
    profile_data,
}: MessagesAPProps) {
    const { data, error, isLoading, mutate } = useSWR(
        `${profile_data.id}-all-message-data`,
        () => loadPatientThreadData(profile_data.id)
    );

    const {
        data: session_data,
        error: id_error,
        isLoading: id_loading,
    } = useSWR(`seassion_data`, () => readUserSession());

    const [providerId, setProviderId] = useState<string>('');
    const [messageContent, setMessageContent] = useState<string>('');
    const [currentThreadIndex, setCurrentThreadIndex] = useState<number>(0);
    const [containsPHI, setContainsPHI] = useState<boolean>(true);
    const [responseRequired, setResponseRequired] = useState<boolean>(true);
    const [coordinatorRequired, setCoordinatorRequired] =
        useState<boolean>(false);

    const handleIndexChange = (event: SelectChangeEvent) => {
        setCurrentThreadIndex(parseInt(event.target.value));
    };

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageData, setMessageData] = useState<
        { id: string; product: string; messages: any }[]
    >([]);

    const [parameterReplaceMessageContent, setParameterReplaceMessageContent] =
        useState<string>('');

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
        if (session_data?.data.session) {
            setProviderId(session_data.data.session.user.id);
        }
    }, [session_data]);

    useEffect(() => {
        if (data) {
            setMessageData(data);
        }
    }, [data]);

    if (isLoading) {
        return (
            <>
                <LoadingScreen />
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
                sender_id:
                    current_user_id ?? '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                content: parameterReplaceMessageContent,
                thread_id: parseInt(messageData[currentThreadIndex].id),
                contains_phi: containsPHI,
                ...(responseRequired
                    ? { requires_provider: responseRequired }
                    : {}),
                ...(coordinatorRequired
                    ? { requires_coordinator: coordinatorRequired }
                    : {}),
            };

            await postNewMessage(new_message_payload);

            // markAsRead();

            /**
             * Not auditing from within this message window since there is no order to be handled on yet.
             */
            // await handleProviderAudit();

            setMessageContent('');
            mutate();
        }
    };

    return (
        <div className='w-[70%]'>
            <div className='flex flex-col border-solid border-b-2 border-b-[#E5E5E5] border-0 px-6 py-2'>
                <BioType className='itd-input'>
                    {profile_data.first_name} {profile_data.last_name}
                </BioType>
                <div className='flex flex-row justify-between'>
                    <FormControl
                        variant='standard'
                        sx={{ m: 1, minWidth: 120 }}
                    >
                        <InputLabel id='product-select-menu-label'>
                            Chat Group
                        </InputLabel>
                        <Select
                            labelId='product-select-menu-label'
                            id='product-select-menu'
                            value={currentThreadIndex.toString()}
                            onChange={handleIndexChange}
                            label='Age'
                        >
                            {data.map((message_data, index) => (
                                <MenuItem key={index} value={index}>
                                    {index + 1}: {message_data.product}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className='flex overflow-y-auto px-6 max-h-[40vh] flex-col-reverse'>
                <div>
                    {messageData &&
                        messageData.length > 0 &&
                        messageData[currentThreadIndex].messages.map(
                            (message: InitialMessageV2, index: number) => (
                                <div key={index}>
                                    <div
                                        className={`flex w-full justify-start`}
                                    >
                                        <div className='w-full text-gray-500 my-1'>
                                            {index === 0 ||
                                            message.sender_id !=
                                                messageData[currentThreadIndex]
                                                    .messages[index - 1]
                                                    .sender_id ||
                                            getMessageSecondsDifference(
                                                message.created_at,
                                                messageData[currentThreadIndex]
                                                    .messages[index - 1]
                                                    .created_at
                                            ) >= 3600 ? (
                                                <>
                                                    {message.sender ? (
                                                        <div className='flex w-full justify-between'>
                                                            <div className='flex my-2'>
                                                                <ListItemIcon>
                                                                    {message
                                                                        .sender
                                                                        .provider_data
                                                                        ?.profile_picture_url ? (
                                                                        <Avatar
                                                                            alt={
                                                                                message.sender.first_name.charAt(
                                                                                    0
                                                                                ) +
                                                                                message.sender.last_name.charAt(
                                                                                    0
                                                                                )
                                                                            }
                                                                            src={
                                                                                message
                                                                                    .sender
                                                                                    .provider_data
                                                                                    ?.profile_picture_url
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Avatar>
                                                                            {message.sender.first_name.charAt(
                                                                                0
                                                                            ) +
                                                                                message.sender.last_name.charAt(
                                                                                    0
                                                                                )}
                                                                        </Avatar>
                                                                    )}
                                                                </ListItemIcon>
                                                                <div>
                                                                    <BioType className='it-input text-black'>
                                                                        {`${message.sender.first_name} ${message.sender.last_name}`}
                                                                    </BioType>
                                                                    <BioType className='it-body text-black'>
                                                                        {displayUserTitle(
                                                                            message
                                                                                .sender
                                                                                ?.provider_data
                                                                                ?.role
                                                                        )}
                                                                    </BioType>
                                                                </div>
                                                            </div>
                                                            <div className='flex justify-center items-center'>
                                                                <BioType className='it-body '>
                                                                    {formatChatTimestamp(
                                                                        message.created_at
                                                                    )}
                                                                </BioType>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        'Messages'
                                                    )}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div
                                        className={`flex w-full ${
                                            message.sender_id === providerId
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        {/* Time stamp for other user */}
                                        <div
                                            className={`flex flex-col ${
                                                message.sender_id === providerId
                                                    ? 'items-end'
                                                    : 'items-start'
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
                                                            ? 'bg-[#64B5F6] rounded-lg'
                                                            : 'bg-[#FFF] rounded-lg bubble-grey-border'
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
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                </div>
            </div>

            <div
                className='px-6 sticky top-0 bg-white z-10'
                id='message-text-editor'
            >
                <AllPatientsMessageTextEditor
                    messageContent={parameterReplaceMessageContent}
                    setMessageContent={setMessageContent}
                    sendNewMessageToThread={sendNewMessageToThread}
                    containsPHI={containsPHI}
                    setContainsPHI={setContainsPHI}
                    responseRequired={responseRequired}
                    setResponseRequired={setResponseRequired}
                    requiresCoordinator={coordinatorRequired}
                    setRequiresCoordinator={setCoordinatorRequired}
                    access_type={access_type}
                />
            </div>
            {errorMessage && (
                <BioType className='body1 text-red-400 ml-2'>
                    {errorMessage}
                </BioType>
            )}
        </div>
    );
}
