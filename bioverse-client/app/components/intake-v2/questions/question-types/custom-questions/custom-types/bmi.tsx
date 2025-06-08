import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import { continueButtonExitAnimation } from '@/app/components/intake-v2/intake-animations';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    QUESTION_HEADER_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { createCurrentPatientWeightAudit } from '@/app/utils/database/controller/patient_weight_audit/patient-weight-audit-api';
import { updateCurrentProfileHeight } from '@/app/utils/database/controller/profiles/profiles';
import { isGLP1Product } from '@/app/utils/functions/pricing';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    answer: Answer;
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function BmiQuestion({
    question,
    setFormInformation,
    setResponse,
    handleContinueButton,
    isButtonLoading,
    answer,
}: Props) {
    const router = useRouter();
    const params = useParams();
    const product_href = params.product;

    const [heightFeet, setHeightFeet] = useState<string>(
        (answer && answer.formData && answer.formData[0]) || '',
    );
    const [heightInches, setHeightInches] = useState<string>(
        (answer && answer.formData && answer.formData[1]) || '',
    );
    const [weight, setWeight] = useState<string>(
        (answer && answer.formData && answer.formData[2]) || '',
    );

    useEffect(() => {
        if (weight && heightFeet && heightInches) {
            setFormInformation((prevFormInformation) => {
                const updatedFormInformation = [...prevFormInformation];

                updatedFormInformation[0] = heightFeet;

                updatedFormInformation[1] = heightInches;

                updatedFormInformation[2] = weight;

                // Calculate combinedResponse based on updatedFormInformation
                const bmiResponse = `height: ${heightFeet ?? ''} ft. , ${
                    heightInches ?? ''
                } in. , weight: ${weight ?? ''}lbs , BMI: ${
                    calculateBMI() ?? 'calculation issue'
                }`;

                // Update response with the combinedResponse
                setResponse(bmiResponse);

                return updatedFormInformation;
            });
        } else {
            setFormInformation([]);
        }
    }, [weight, heightFeet, heightInches]);

    const calculateBMI = (): string => {
        if (weight === '' || heightFeet === '' || heightInches === '') {
            return '';
        }

        const weightKg = parseFloat(weight) * 0.453592;

        const totalHeightInches =
            parseFloat(heightFeet) * 12 + parseFloat(heightInches);
        const heightMeters = totalHeightInches * 0.0254;

        const bmi = weightKg / heightMeters ** 2;

        return bmi.toFixed(2);
    };

    const checkBMIHandleContinue = async () => {
        if (
            parseInt(calculateBMI()) < 25 &&
            isGLP1Product(params.product as string)
        ) {
            await continueButtonExitAnimation(150);
            router.push(
                `/intake/prescriptions/${product_href}/unavailable-bmi`,
            );
        } else {
            const totalHeightInches = Math.round(
                parseFloat(heightFeet) * 12 + parseFloat(heightInches),
            );

            await updateCurrentProfileHeight(totalHeightInches);

            await createCurrentPatientWeightAudit(parseFloat(weight), 'intake');

            handleContinueButton();
        }
    };

    const handleWeightChange = (event: any) => {
        if (!isNaN(event.target.value)) {
            setWeight(event.target.value);
        }
    };

    const handleHeightFeetChange = (event: any) => {
        if (!isNaN(event.target.value)) {
            setHeightFeet(event.target.value);
        }
    };

    const handleHeightInchesChange = (event: any) => {
        if (!isNaN(event.target.value)) {
            setHeightInches(event.target.value);
        }
    };

    const renderTitle = () => {
        switch (product_href) {
            case PRODUCT_HREF.GLUTATIONE_INJECTION:
                return (
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Let&rsquo;s start where you are now.
                    </BioType>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col w-full gap-[16px] rounded-md border">
                <div className="w-full">
                    <div className="flex justify-center items-center flex-row gap-[12px]">
                        {question && (
                            <FormControl variant="outlined" fullWidth>
                                <div className="flex md:hidden flex-col gap-4 justify-center items-center">
                                    <div className="flex flex-col w-full gap-4">
                                        <BioType
                                            className={`${INTAKE_PAGE_HEADER_TAILWIND}`}
                                        >
                                            What is your height?
                                        </BioType>
                                        <div className="flex flex-col md:flex-row gap-4 w-full">
                                            <TextField
                                                fullWidth
                                                value={heightFeet}
                                                placeholder="Feet"
                                                sx={{
                                                    color: 'black',
                                                }}
                                                onChange={
                                                    handleHeightFeetChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        fontSize: '1.1em',
                                                        height: '8.33vw',
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            ft
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                value={heightInches}
                                                placeholder="Inches"
                                                sx={{
                                                    color: 'black',
                                                }}
                                                onChange={
                                                    handleHeightInchesChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        fontSize: '1.1em',
                                                        height: '8.33vw',
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            in
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full gap-4 mt-4">
                                        <BioType
                                            className={`${INTAKE_PAGE_HEADER_TAILWIND}`}
                                        >
                                            What is your weight?
                                        </BioType>
                                        <TextField
                                            value={weight}
                                            placeholder="Pounds"
                                            className="text-cen"
                                            sx={{
                                                color: 'black',
                                            }}
                                            size="medium"
                                            onChange={handleWeightChange}
                                            inputProps={{
                                                style: {
                                                    textAlign: 'start',
                                                    color: 'black',
                                                    fontSize: '1.1em',
                                                    height: '8.33vw',
                                                },
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        lbs.
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col gap-4 justify-center items-center">
                                    <div className="flex flex-col w-full gap-4">
                                        <div>
                                            {renderTitle()}
                                            <BioType
                                                className={`${INTAKE_PAGE_HEADER_TAILWIND}`}
                                            >
                                                What is your height?
                                            </BioType>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 w-full">
                                            <TextField
                                                fullWidth
                                                value={heightFeet}
                                                placeholder="Feet"
                                                sx={{
                                                    color: 'black',
                                                }}
                                                onChange={
                                                    handleHeightFeetChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        fontSize: '1.1em',
                                                        height: '42px',
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            ft
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                value={heightInches}
                                                placeholder="Inches"
                                                sx={{
                                                    color: 'black',
                                                }}
                                                onChange={
                                                    handleHeightInchesChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        fontSize: '1.1em',
                                                        height: '42px',
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            in
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full gap-4 mt-4">
                                        <BioType
                                            className={`${INTAKE_PAGE_HEADER_TAILWIND}`}
                                        >
                                            What is your weight?
                                        </BioType>
                                        <TextField
                                            value={weight}
                                            placeholder="Pounds"
                                            className="text-cen"
                                            sx={{
                                                color: 'black',
                                            }}
                                            size="medium"
                                            onChange={handleWeightChange}
                                            inputProps={{
                                                style: {
                                                    textAlign: 'start',
                                                    color: 'black',
                                                    fontSize: '1.1em',
                                                    height: '42px',
                                                },
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        lbs.
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        )}
                    </div>
                </div>
                <div className="md:mt-4">
                    <ContinueButton
                        onClick={checkBMIHandleContinue}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
