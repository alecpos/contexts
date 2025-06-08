'use client';

import { useState } from 'react';
import { Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { getMacroById } from '@/app/utils/database/controller/macros/macros-api';


interface FlagPatientIDIssueModalProps {
    open: boolean;
    handleClose: () => void;
    setMessageContent: (message: string) => void;
}

export default function FlagPatientIDIssueModal({
    open,
    handleClose,
    setMessageContent,
}: FlagPatientIDIssueModalProps) {
    const [step, setStep] = useState<number>(1);

    const [selectedOptionStep1, setSelectedOptionStep1] = useState<string>('');
    const [selectedOptionStep2, setSelectedOptionStep2] = useState<string>('');


    const handleNextClick = () => {
        if (selectedOptionStep1 !== '') {
            setStep(2);
        }
    }

    const handleSendRequestClick = async () => {
        if (selectedOptionStep1 !== '' && selectedOptionStep2 !== '') {
            let macroId: number | null = null;
            if (selectedOptionStep2 === 'newID') {
                macroId = 37;
            }
            if (selectedOptionStep2 === 'newSelfie') {
                macroId = 36;
            } 
            if (selectedOptionStep2 === 'newIdAndSelfie') {
                macroId = 38;
            }
            if (!macroId) {
                console.log('Macro not found');
                alert('Macro not found');
                return;
            }
    
            const macro = await getMacroById(macroId);
            if (!macro || !macro.data) {
                console.log('Macro not found');
                alert('Macro not found');
                return;
            }

            setMessageContent(macro.data.macroHtml);
            setStep(1);
            handleClose();
        }
    }

    const handleCancelClick = () => {
        setStep(1);
        handleClose();
    }

    
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="image-dialog-title"
                aria-describedby="image-dialog-description"
                sx={{
                    backgroundColor:'transparent'
                }}
            >
                <div className='flex pl-[16px] bg-[#fff8f8]'>
                    {/* <WarningAmberIcon
                        sx={{
                            color: '#D11E66',
                            fontSize: '24px',
                            marginRight: '8px',
                        }}
                        className='my-[16px] '
                    /> */}
                    <div className='mt-[16px] mr-[12px]'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Component 1/Alert triangle">
                            <path id="Icon" d="M11.9998 9.00024V13.0002M11.9998 17.0002H12.0098M10.2898 3.8602L1.81978 18.0002C1.64514 18.3026 1.55274 18.6455 1.55177 18.9947C1.55079 19.3439 1.64127 19.6873 1.8142 19.9907C1.98714 20.2941 2.2365 20.547 2.53748 20.7241C2.83847 20.9012 3.18058 20.9964 3.52978 21.0002H20.4698C20.819 20.9964 21.1611 20.9012 21.4621 20.7241C21.7631 20.547 22.0124 20.2941 22.1854 19.9907C22.3583 19.6873 22.4488 19.3439 22.4478 18.9947C22.4468 18.6455 22.3544 18.3026 22.1798 18.0002L13.7098 3.8602C13.5315 3.56631 13.2805 3.32332 12.981 3.15469C12.6814 2.98605 12.3435 2.89746 11.9998 2.89746C11.656 2.89746 11.3181 2.98605 11.0186 3.15469C10.7191 3.32332 10.468 3.56631 10.2898 3.8602Z" stroke="#E5A7A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                        </svg>
                    </div>

                    {step === 1 && (
                        <p className='provider-intake-tab-title text-[#D11E66] my-[16px]'>
                            Patient still needs to verify their identity?
                        </p>
                    )}
                    {step === 2 && (
                        <p className='provider-intake-tab-title text-[#D11E66] my-[16px]'>
                            Confirm your request
                        </p>
                    )}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            zIndex: '20',
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                        
                    >
                        <CloseIcon style={{
                            fontSize: '26px',
                        }} />
                    </IconButton>
                </div>
         
                <div
                    style={{
                        backgroundColor:'transparent',
                        position: 'relative',
                        width: '520px',
                        height: '216px',
                        transition: 'transform 0.3s',
                    }}
                >
                    
                    {step === 1 && (
                        <div className='provider-intake-tab-title  my-[16px] pl-[16px]'>
                            <p className='mb-3 provider-dropdown-title text-strong'>Select an option *</p>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    onChange={(e) => setSelectedOptionStep1(e.target.value)}
                                >
                                    <FormControlLabel 
                                        value="newID" 
                                        control={
                                            <Radio  
                                                sx={{
                                                    color: '#BBC5CC',
                                                    '&.Mui-checked': {
                                                    color: '#BBC5CC',
                                                    },
                                                }}
                                            />
                                        } 
                                        label={<span className='provider-dropdown-title text-strong'>Yes, we need a new ID</span>}
                                    />
                                    <FormControlLabel 
                                        value="newSelfie" 
                                        control={
                                            <Radio  
                                                sx={{
                                                    color: '#BBC5CC',
                                                    '&.Mui-checked': {
                                                    color: '#BBC5CC',
                                                    },
                                                }}
                                            />
                                        } 
                                        label={<span className='provider-dropdown-title text-strong'>Yes, we need a new selfie</span>}
                                    />
                                    <FormControlLabel 
                                        value="newIdAndSelfie" 
                                        control={
                                            <Radio  
                                                sx={{
                                                    color: '#BBC5CC',
                                                    '&.Mui-checked': {
                                                    color: '#BBC5CC',
                                                    },
                                                }}
                                            />
                                        } 
                                        label={<span className='provider-dropdown-title text-strong'>Yes, we need a new ID and a new selfie</span>}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}
                    {step === 2 && (
                        <div className='provider-intake-tab-title  my-[16px] pl-[16px]'>
                            <p className='mb-3 provider-dropdown-title text-strong'>Confirm the following request. *</p>
                            <FormControl>
                            <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    onChange={(e) => setSelectedOptionStep2(e.target.value)}
                                >
                                    <FormControlLabel 
                                        value="newID" 
                                        control={
                                            <Radio  
                                                sx={{
                                                    color: '#BBC5CC',
                                                    '&.Mui-checked': {
                                                    color: '#BBC5CC',
                                                    },
                                                }}
                                            />
                                        } 
                                        label={<span className='provider-dropdown-title '>I am requesting a new ID</span>}
                                    />
                                    <FormControlLabel 
                                        value="newSelfie" 
                                        control={
                                            <Radio  
                                                sx={{
                                                    color: '#BBC5CC',
                                                    '&.Mui-checked': {
                                                    color: '#BBC5CC',
                                                    },
                                                }}
                                            />
                                        } 
                                        label={<span className='provider-dropdown-title '>I am requesting a new selfie</span>}
                                    />
                                    <FormControlLabel 
                                        value="newIdAndSelfie" 
                                        control={
                                            <Radio  
                                                sx={{
                                                    color: '#BBC5CC',
                                                    '&.Mui-checked': {
                                                    color: '#BBC5CC',
                                                    },
                                                }}
                                            />
                                        } 
                                        label={<span className='provider-dropdown-title '>I am requesting both a new ID and a new selfie</span>}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}

                </div>

                <div className='flex justify-center pl-[16px] bg-[#fff8f8] py-[16px]'>
                        <Button
                            onClick={handleCancelClick}
                            sx={{ 
                                borderRadius: '12px', 
                                paddingX: '32px',
                                paddingY: '14px',
                                ":hover": {
                                    backgroundColor: '#fff8f8',
                                }
                            }}
                        >
                                <span className='normal-case provider-bottom-button-text hover:underline text-black'>Cancel</span>
                        </Button>
                        <Button
                            onClick={step === 1 ? handleNextClick : handleSendRequestClick}
                            sx={{ 
                                borderRadius: '12px', 
                                backgroundColor: 'black',
                                paddingX: '32px',
                                paddingY: '14px',
                                ":hover": {
                                    backgroundColor: 'darkslategray',
                                }
                            }}
                        >
                                <span className='normal-case provider-bottom-button-text  text-white'>{step === 1 ? 'Next' : 'Send request'}</span>
                        </Button>
                </div>
            </Dialog>
        </>
    );
}
