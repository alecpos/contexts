import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import AllPatientsMessageInputTiptap from './message-tiptap';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface MessageTextEditor {
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    sendNewMessageToThread: () => void;
    containsPHI: boolean;
    setContainsPHI: React.Dispatch<React.SetStateAction<boolean>>;
    responseRequired: boolean;
    setResponseRequired: React.Dispatch<React.SetStateAction<boolean>>;
    requiresCoordinator: boolean;
    setRequiresCoordinator: React.Dispatch<React.SetStateAction<boolean>>;
    access_type: BV_AUTH_TYPE | null;
}

export default function AllPatientsMessageTextEditor({
    messageContent,
    setMessageContent,
    sendNewMessageToThread,
    containsPHI,
    setContainsPHI,
    responseRequired,
    setResponseRequired,
    requiresCoordinator,
    setRequiresCoordinator,
    access_type,
}: MessageTextEditor) {
    return (
        <div className='flex flex-col gap-2'>
            <div id='text-field' className='itd-body'>
                <AllPatientsMessageInputTiptap
                    // content={replacePlaceholdersWithJSX(trialcontent, replacements)}
                    content={messageContent}
                    onContentChange={setMessageContent}
                    containsPHI={containsPHI}
                    setContainsPHI={setContainsPHI}
                    responseRequired={responseRequired}
                    setResponseRequired={setResponseRequired}
                    requiresCoordinator={requiresCoordinator}
                    setRequiresCoordinator={setRequiresCoordinator}
                    access_type={access_type}
                />
            </div>

            <div id='info-line' className='flex flex-col justify-end'>
                <BioType className='itd-body text-[#9E9E9E] text-end'>
                    Enter to add new line
                </BioType>{' '}
                <div className='flex justify-end'>
                    <Button
                        variant='contained'
                        sx={{ width: '160px' }}
                        onClick={sendNewMessageToThread}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}
