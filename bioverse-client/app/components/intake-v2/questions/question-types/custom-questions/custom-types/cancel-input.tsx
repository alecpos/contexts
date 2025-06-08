import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

import React, { SetStateAction } from 'react';
import {
    Button,
    CircularProgress,
    FormControl,
    OutlinedInput,
    useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/navigation';
interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;

    formInformation: string[];
    handleContinueButton: any;
    isButtonLoading: boolean;
}
const CancelInputQuestion = ({
    question,
    formInformation,
    setFormInformation,
    setResponse,
    setAnswered,
    handleContinueButton,
    isButtonLoading,
}: Props) => {
    const router = useRouter();
    const isNotMobile = useMediaQuery('(min-width:640px)');

    const DESKTOP_ROWS = 5;
    const MOBILE_ROWS = 2;

    const numRows = isNotMobile ? DESKTOP_ROWS : MOBILE_ROWS;

    const handleInputResponseChange = (value: string) => {
        setFormInformation([value]);
        setResponse(value);
        setAnswered(true);
    };

    return (
        <div className='flex flex-col items-center w-full gap-[2.5vw]'>
            <div className='flex flex-col rounded-md border'>
                <BioType className='hquestion  leading-8 mb-[14px]'>
                    {question.question}
                </BioType>
                <BioType className='body1 mb-3'>
                    If you&apos;d like, could you tell us more about why
                    you&apos;re canceling.
                </BioType>

                <div>
                    <FormControl variant='outlined' fullWidth>
                        <OutlinedInput
                            value={formInformation[0] || ''}
                            id={`outlined-adornment-weight-${0}`}
                            placeholder='What can we do to improve?'
                            minRows={numRows}
                            multiline={true}
                            onChange={(e) =>
                                handleInputResponseChange(e.target.value)
                            }
                        />
                    </FormControl>
                </div>
                <div className='flex justify-center mt-6 md:mt-9'>
                    <Button
                        variant='contained'
                        className='w-full md:w-auto'
                        sx={{
                            height: '52px',
                        }}
                        onClick={handleContinueButton}
                    >
                        {isButtonLoading ? (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={22}
                            />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
                <div className='mt-4 md:mt-9 flex flex-col md:flex-row justify-center items-center w-full gap-6 md:gap-9'>
                    <Button
                        variant='contained'
                        color='inherit'
                        className='w-full md:w-auto'
                        sx={{
                            height: '52px',
                        }}
                        onClick={() => {
                            router.push('/portal/subscriptions/');
                        }}
                    >
                        <BioType className='body1 text-black'>
                            Go to subscriptions
                        </BioType>
                    </Button>

                    <Button
                        variant='text'
                        color='inherit'
                        className='w-full md:w-auto'
                        onClick={() => {
                            router.push('/');
                        }}
                        sx={{
                            height: '52px',
                        }}
                    >
                        <BioType className='body1 text-black'>Go home</BioType>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CancelInputQuestion;
