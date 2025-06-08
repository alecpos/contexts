'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import DrawIcon from '@mui/icons-material/Draw';
import { Button, CircularProgress } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import ReplayIcon from '@mui/icons-material/Replay';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AiResopnseAdjustmentMenu from './ai-response-adjustment-menu';
import CloseIcon from '@mui/icons-material/Close';
import {
    getAIInitialResponse,
    getRecreateResponse,
    getRetryResponse,
} from './utils/ai-response-controller';

interface ProviderAIComponentProps {
    toggleAIUse: () => void;
    isUsingAi: boolean;
    setIsUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
    setMessageContent: React.Dispatch<React.SetStateAction<string>>;
    currentMessageData: any;
    patient_id: string;
    provider_id: string;
    employee_type: 'coordinator' | 'provider';
}

export default function AIResponseComponent({
    toggleAIUse,
    isUsingAi,
    setIsUsingAi,
    setMessageContent,
    currentMessageData,
    patient_id,
    provider_id,
    employee_type,
}: ProviderAIComponentProps) {
    const [aiLoading, setAILoading] = useState<boolean>(false);
    const [generatedText, setGeneratedText] = useState<string | undefined>(
        undefined
    );
    const [revisionMenuOpen, setRevisionMenuOpen] = useState<boolean>(false);

    const toggleRevisionMenu = () => {
        setRevisionMenuOpen((prev) => !prev);
    };

    // console.log('msmsm', currentMessageData.messages);

    const initialMessageArray: string[] = currentMessageData.messages
        // .slice(-6) // Get up to the last 6 messages (may be fewer if less messages exist)
        .map((messageRecord: any) => {
            const prefix =
                messageRecord.sender_id === patient_id
                    ? 'patient: '
                    : 'provider: ';
            // Create a temporary div to parse HTML and get text content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = messageRecord.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            return `${prefix}${plainText}`;
        });

    // console.log('initial array: ', initialMessageArray);

    const generateInitialResponse = async () => {
        setAILoading(true);
        //call

        toggleAIUse();

        const initialResult = await getAIInitialResponse(
            initialMessageArray,
            provider_id,
            employee_type
        );

        setGeneratedText(initialResult.choices[0].message.content);

        setAILoading(false);
        return;
    };

    const retryGenerativeAi = async () => {
        const previousResponse = generatedText;

        setGeneratedText(undefined);
        setAILoading(true);

        // await new Promise((resolve) => setTimeout(resolve, 3000));
        // setGeneratedText(
        //     'Dear Andrew, \n I’m sorry you’re having side effects from your GLP-1 medication. It’s important that you feel as comfortable as possible while we manage your health. Best regards, Dr. Jones'
        // );

        const retryResponse = await getRetryResponse(
            initialMessageArray,
            previousResponse ?? '',
            provider_id,
            employee_type
        );

        console.log('RETRY RESPONSE: ', retryResponse);

        setGeneratedText(retryResponse.choices[0].message.content);

        setAILoading(false);
    };

    const insertAiGeneratedText = () => {
        // Convert line breaks to HTML breaks and preserve paragraphs
        const formattedText = generatedText!
            .split('\n\n') // Split into paragraphs (double line breaks)
            .map(
                (paragraph) =>
                    paragraph
                        .split('\n') // Split into lines
                        .join('<br />') // Join lines with HTML break
            )
            .join('<br /><br />'); // Join paragraphs with double breaks

        setMessageContent(formattedText);
        setGeneratedText(undefined);
        toggleAIUse();
    };

    const handleRevsion = async (type: string, customString?: string) => {
        toggleRevisionMenu();

        setGeneratedText(undefined);
        setAILoading(true);

        await new Promise((resolve) => setTimeout(resolve, 3000)); //remove later
        const previousResponse = generatedText;

        switch (type) {
            case 'empathetic':
                setGeneratedText(undefined);
                setAILoading(true);
                const empatheticResponse = await getRecreateResponse(
                    initialMessageArray,
                    type,
                    provider_id,
                    employee_type
                );

                console.log('EMPATHETIC RESPONSE: ', empatheticResponse);

                setGeneratedText(empatheticResponse.choices[0].message.content);
                break;
            case 'detailed':
                setGeneratedText(undefined);
                setAILoading(true);
                const detailedResponse = await getRecreateResponse(
                    initialMessageArray,
                    type,
                    provider_id,
                    employee_type
                );

                // console.log('DETAILED RESPONSE: ', detailedResponse);

                setGeneratedText(detailedResponse.choices[0].message.content);
                break;
            case 'simplify':
                setGeneratedText(undefined);
                setAILoading(true);
                const simplifiedResponse = await getRecreateResponse(
                    initialMessageArray,
                    type,
                    provider_id,
                    employee_type
                );

                // console.log('SIMPLIFIED RESPONSE: ', simplifiedResponse);

                setGeneratedText(simplifiedResponse.choices[0].message.content);
                break;
            case 'custom':
                setGeneratedText(undefined);
                setAILoading(true);
                const customResponse = await getRecreateResponse(
                    initialMessageArray,
                    type,
                    provider_id,
                    employee_type,
                    customString
                );

                // console.log('CUSTOM RESPONSE: ', customResponse);

                setGeneratedText(customResponse.choices[0].message.content);
                break;
        }

        setAILoading(false);
    };

    const formatAIResponse = (text: string) => {
        return text.split('\n').map((line, index) => (
            <Fragment key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
            </Fragment>
        ));
    };

    return (
        <>
            <div>
                <div className='bg-[#EEF3F8] rounded-3xl py-3 px-3 my-2 items-center gap-2'>
                    {!aiLoading ? (
                        <div
                            className='flex flex-row gap-2 justify-between flex-grow hover:cursor-pointer w-full'
                            onClick={() => {
                                if (!isUsingAi) {
                                    generateInitialResponse();
                                }
                            }}
                        >
                            <div className='flex flex-row gap-2 items-center'>
                                <DrawIcon sx={{ color: '#A6A8AB' }} />
                                <BioType className='provider-message-tab-input-bar-text '>
                                    Draft a response to the patient
                                </BioType>
                            </div>

                            {generatedText && (
                                <Button
                                    onClick={() => {
                                        setGeneratedText(undefined);
                                        setIsUsingAi(false);
                                    }}
                                    className=''
                                >
                                    <CloseIcon
                                        sx={{
                                            color: '#626364',
                                            fontSize: '27px',
                                        }}
                                    />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className='flex flex-row gap-2 items-center flex-grow'>
                            <CircularProgress
                                size={22}
                                sx={{ color: '#A6A8AB' }}
                            />
                            <BioType className='provider-message-tab-input-bar-text'>
                                Working on it...
                            </BioType>
                        </div>
                    )}

                    {generatedText && (
                        <BioType className='provider-message-tab-input-bar-text text-strong mt-1'>
                            {formatAIResponse(generatedText)}
                        </BioType>
                    )}
                </div>

                {isUsingAi && (
                    <div className='flex flex-row gap-2 justify-between  py-2 items-center flex-grow'>
                        <div
                            className='flex flex-row items-center gap-2 hover:cursor-pointer hover:bg-[#EBEBEB] py-3 rounded-3xl'
                            onClick={retryGenerativeAi}
                        >
                            <ReplayIcon
                                sx={{ color: '#A6A8AB', fontSize: '28px' }}
                            />
                            <BioType className='provider-bottom-button-text'>
                                Retry
                            </BioType>
                        </div>
                        <div>
                            <div
                                id='recreate-menu-button'
                                className='flex flex-row items-center gap-2 hover:bg-[#EBEBEB] hover:cursor-pointer py-3 rounded-3xl'
                                onClick={toggleRevisionMenu}
                            >
                                <FilterListIcon
                                    sx={{ color: '#A6A8AB', fontSize: '28px' }}
                                />
                                <BioType className='provider-bottom-button-text'>
                                    Recreate
                                </BioType>
                                {!revisionMenuOpen ? (
                                    <ArrowDropDownIcon />
                                ) : (
                                    <ArrowDropUpIcon />
                                )}
                            </div>
                            <AiResopnseAdjustmentMenu
                                open={revisionMenuOpen}
                                handleClose={toggleRevisionMenu}
                                anchorEl='#recreate-menu-button'
                                handleRevsion={handleRevsion}
                            />
                        </div>
                        <div>
                            <Button
                                variant='contained'
                                size='large'
                                disabled={!generatedText}
                                onClick={insertAiGeneratedText}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: 'black',
                                    paddingX: '32px',
                                    paddingY: '14px',
                                    ':hover': {
                                        backgroundColor: 'darkslategray',
                                    },
                                }}
                            >
                                <span className='normal-case provider-bottom-button-text  text-white'>
                                    Insert
                                </span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
