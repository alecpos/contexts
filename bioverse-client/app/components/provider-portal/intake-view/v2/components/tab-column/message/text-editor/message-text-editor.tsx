import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import MessageInputTiptap from './message-tiptap';
import AIResponseComponent from '../ai-response-helper/provider-ai-response-component';

interface MessageTextEditor {
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    patient_id: string;
    sendNewMessageToThread: () => void;
    containsPHI: boolean;
    setContainsPHI: React.Dispatch<React.SetStateAction<boolean>>;
    responseRequired: boolean;
    setResponseRequired: React.Dispatch<React.SetStateAction<boolean>>;
    requiresCoordinator: boolean;
    setRequiresCoordinator: React.Dispatch<React.SetStateAction<boolean>>;
    currentMessageData: any;
    providerId: string;
}

const MessageTextEditor = ({
    setTabSelected,
    messageContent,
    setMessageContent,
    sendNewMessageToThread,
    containsPHI,
    setContainsPHI,
    responseRequired,
    setResponseRequired,
    requiresCoordinator,
    setRequiresCoordinator,
    currentMessageData,
    patient_id,
    providerId,
}: MessageTextEditor) => {
    const [isUsingAi, setIsUsingAi] = useState<boolean>(false);

    const toggleAIUse = () => {
        setIsUsingAi((prev) => !prev);
    };

    return (
        <div className='flex flex-col gap-2'>
            <div
                id='text-field'
                className='provider-message-tab-input-bar-text'
            >
                <MessageInputTiptap
                    content={messageContent}
                    onContentChange={setMessageContent}
                    containsPHI={containsPHI}
                    setContainsPHI={setContainsPHI}
                    responseRequired={responseRequired}
                    setResponseRequired={setResponseRequired}
                    requiresCoordinator={requiresCoordinator}
                    setRequiresCoordinator={setRequiresCoordinator}
                />
            </div>

            <div id='info-line' className='flex flex-col justify-end'>
                <BioType className='provider-message-tab-input-bar-text text-weak text-end'>
                    Enter to add new line
                </BioType>{' '}
                {currentMessageData && (
                    <AIResponseComponent
                        toggleAIUse={toggleAIUse}
                        isUsingAi={isUsingAi}
                        setIsUsingAi={setIsUsingAi}
                        setMessageContent={setMessageContent}
                        currentMessageData={currentMessageData}
                        patient_id={patient_id}
                        provider_id={providerId}
                        employee_type='provider'
                    />
                )}
                {!isUsingAi && (
                    <div className='flex justify-center gap-2 mb-1'>
                        {/**LEGITSCRIPTCODETOREMOVE */}
                        {providerId !==
                            'bb22b7f2-cd8e-4b08-85c8-04f482d52cd5' && (
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    setTabSelected('macros');
                                }}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: 'white',
                                    paddingX: '32px',
                                    paddingY: '14px',
                                    ':hover': {
                                        backgroundColor: 'lightgray',
                                    },
                                    borderColor: 'black',
                                }}
                            >
                                <span className='provider-bottom-button-text normal-case text-black'>
                                    Macros
                                </span>
                            </Button>
                        )}
                        <Button
                            variant='contained'
                            onClick={sendNewMessageToThread}
                            sx={{
                                width: '160px',
                                borderRadius: '12px',
                                backgroundColor: 'black',
                                paddingX: '32px',
                                paddingY: '14px',
                                ':hover': {
                                    backgroundColor: 'lightgray',
                                },
                                borderColor: 'black',
                            }}
                        >
                            <span className='provider-bottom-button-text normal-case text-white'>
                                Send
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageTextEditor;
