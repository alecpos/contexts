'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    QUESTION_HEADER_TAILWIND,
    QUESTION_SUBTITLE_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
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
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col w-full gap-[16px] rounded-md border">
                <div className="w-full">
                    <div className="flex justify-center items-center flex-row gap-[12px]">
                        {question && (
                            <FormControl variant="outlined" fullWidth>
                                <div className="flex flex-col gap-4 justify-center items-center">
                                    <div className="flex flex-col w-full gap-4">
                                        <BioType
                                            className={`${QUESTION_HEADER_TAILWIND}`}
                                        >
                                            You&apos;re almost there! To submit
                                            your treatment request, please
                                            confirm that you&apos;ve read the
                                            below.
                                        </BioType>
                                        <div
                                            className={`${QUESTION_SUBTITLE_TAILWIND} flex w-full`}
                                        >
                                            Medical weight loss is a supplement
                                            to a healthy diet and exercise
                                            program.
                                        </div>
                                        <a
                                            href="https://www.gobioverse.com/florida-weight-loss-consumer-bill-of-rights"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-2 pb-8"
                                        >
                                            <div className="underline text-primary body1">
                                                READ MEDICAL WEIGHT LOSS BILL OF
                                                RIGHTS
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
                                                        marginTop: '-22px',
                                                    }}
                                                />
                                            }
                                            label={
                                                <>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
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
                    <div className="md:mt-4">
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
