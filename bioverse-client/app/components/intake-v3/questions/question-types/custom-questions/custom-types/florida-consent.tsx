'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    QUESTION_HEADER_TAILWIND,
    QUESTION_SUBTITLE_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND
} from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function FloridaConsentQuestion({
    question,
    // arrowBack,
    // continueButton,
    setFormInformation,
    setResponse,
    handleContinueButton,
    isButtonLoading,
}: Props) {
    const [boxChecked, setBoxChecked] = useState<boolean>(false);

    useEffect(() => {
        if (boxChecked) {
            setResponse(`Florida Consent Provided: True`);
            setFormInformation(['consent given']);
        } else {
            setResponse(``);
            setFormInformation([]);
        }
    }, [boxChecked]);

    return (
        <div className="flex flex-col items-center justify-center w-full mt-[1.25rem] md:mt-[48px]">
            <div className="flex flex-col w-full gap-[16px] rounded-md border">
                <div className="w-full">
                    <div className="flex justify-center items-center flex-row gap-[12px]">
                        {question && (
                            <FormControl variant="outlined" fullWidth>
                                <div className="flex flex-col  justify-center items-center">
                                    <div className="flex flex-col w-full ">
                                        <BioType
                                            className={`inter-h5-question-header`}
                                        >
                                            You&apos;re almost there! To submit
                                            your treatment request, please
                                            confirm that you&apos;ve read the
                                            below.
                                        </BioType>
                                        <div
                                            className={`intake-subtitle  flex w-full text-[#656565] mt-[1rem] md:mt-[16px]`}
                                        >
                                            Medical weight loss is a supplement
                                            to a healthy diet and exercise
                                            program.
                                        </div>
                                        <a
                                            href="https://www.gobioverse.com/florida-weight-loss-consumer-bill-of-rights"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className=" no-underline"
                                        >
                                            <div className={`intake-subtitle text-[#1e9cd1] underline mt-[1rem] md:mt-[16px]`}>
                                                Read medical weight loss bill of rights
                                            </div>
                                        </a>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={boxChecked}
                                               
                                                    onChange={(event) => {
                                                        setBoxChecked(
                                                            event.target
                                                                .checked,
                                                        );
                                                    }}
                                                    sx={{
                                                        marginTop: '-1px',
                                                        color: '#bbc5cc',
                                                        '&.Mui-checked': {
                                                          color: '#bbc5cc',
                                                        },
                                                   
                                                    }}
                                                    className='mt-[1.25rem] md:mt-[44px]'
                                                />
                                            }
                                            label={
                                                <>
                                                    <BioType
                                                        className={`intake-subtitle mt-[1.25rem] md:mt-[44px]`}
                                                    >
                                                        I have read and
                                                        understood the
                                                        above-linked
                                                        information.
                                                    </BioType>
                                                </>
                                            }
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        )}
                    </div>
                </div>
                {boxChecked && (
                    <div className="md:flex md:justify-center md:mt-8">
                        <ContinueButton
                            onClick={handleContinueButton}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
