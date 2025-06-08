import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import MessageInputTiptap from './message-tiptap';
import AIResponseComponent from '@/app/components/provider-portal/intake-view/v2/components/tab-column/message/ai-response-helper/provider-ai-response-component';

interface MessageTextEditorProps {
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    patient_id: string;
    setMacroDestination: Dispatch<SetStateAction<string>>;
    sendNewMessageToThread: () => void;
    containsPHI: boolean;
    setContainsPHI: React.Dispatch<React.SetStateAction<boolean>>;
    requiresCoordinator: boolean;
    setRequiresCoordinator: React.Dispatch<React.SetStateAction<boolean>>;
    errorMessage: string;
    currentMessageData: any;
    providerId: string;
}

const CoordinatorMessageTextEditor = ({
    setTabSelected,
    messageContent,
    setMessageContent,
    setMacroDestination,
    sendNewMessageToThread,
    containsPHI,
    setContainsPHI,
    requiresCoordinator,
    setRequiresCoordinator,
    errorMessage,
    patient_id,
    currentMessageData,
    providerId,
}: MessageTextEditorProps) => {
    const [isUsingAi, setIsUsingAi] = useState<boolean>(false);

    const toggleAIUse = () => {
        setIsUsingAi((prev) => !prev);
    };

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-grow overflow-y-auto'>
                <div id='text-field' className='itd-body'>
                    <MessageInputTiptap
                        content={messageContent}
                        onContentChange={setMessageContent}
                        containsPHI={containsPHI}
                        setContainsPHI={setContainsPHI}
                        setRequiresCoordinator={setRequiresCoordinator}
                        requiresCoordinator={requiresCoordinator}
                    />
                    <BioType className='provider-message-tab-input-bar-text text-weak text-end'>
                        Enter to add new line
                    </BioType>
                </div>
                {errorMessage && (
                    <BioType className='body1 text-red-400 ml-2'>
                        {errorMessage}
                    </BioType>
                )}
                {currentMessageData && (
                    <AIResponseComponent
                        toggleAIUse={toggleAIUse}
                        isUsingAi={isUsingAi}
                        setIsUsingAi={setIsUsingAi}
                        setMessageContent={setMessageContent}
                        currentMessageData={currentMessageData}
                        patient_id={patient_id}
                        provider_id={providerId}
                        employee_type='coordinator'
                    />
                )}
            </div>

            <div className='sticky bottom-0 bg-white pt-2 pb-2'>
                <div className='flex justify-center gap-2'>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            setMacroDestination('messages');
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
            </div>
        </div>
    );
};

export default CoordinatorMessageTextEditor;
