import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import { continueButtonExitAnimation } from '@/app/components/intake-v2/intake-animations';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    QUESTION_HEADER_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
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

export default function BmiQuestionV3({
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
        (answer && answer.formData && answer.formData[0]) || ''
    );
    const [heightInches, setHeightInches] = useState<string>(
        (answer && answer.formData && answer.formData[1]) || ''
    );
    const [weight, setWeight] = useState<string>(
        (answer && answer.formData && answer.formData[2]) || ''
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
                `/intake/prescriptions/${product_href}/unavailable-bmi-v3`
            );
        } else {
            const totalHeightInches = Math.round(
                parseFloat(heightFeet) * 12 + parseFloat(heightInches)
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
                    <BioType className={`inter-h5-constant`}>
                        Let&rsquo;s start where you are now.
                    </BioType>
                );
            default:
                return null;
        }
    };

    return (
        <div className='flex flex-col items-center justify-center w-full mt-[1.25rem] md:mt-[48px] pb-16 lg:pb-0'>
            <div className='flex flex-col w-full  rounded-md border'>
                <div className='w-full'>
                    <div className='flex justify-center items-center flex-row gap-[12px]'>
                        {question && (
                            <FormControl variant='outlined' fullWidth>
                                <div className='flex md:hidden flex-col  justify-center items-center'>
                                    <div className='flex flex-col w-full'>
                                        <p
                                            className={`inter-h5-question-header mb-[2rem] md:mb-[32px]`}
                                        >
                                            {(
                                                (product_href !== PRODUCT_HREF.B12_INJECTION) && 
                                                (product_href !== PRODUCT_HREF.NAD_INJECTION)
                                             )
                                                ? "Let's start where you are now. "
                                                : ''}
                                            What is your height?
                                        </p>
                                        <div className='flex flex-col md:flex-row gap-4 w-full'>
                                            <TextField
                                                fullWidth
                                                value={heightFeet}
                                                placeholder='Feet'
                                                className='intake-v3-question-text'
                                                sx={{
                                                    color: 'black',
                                                    '& .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor:
                                                                'rgba(102, 102, 102, 0.20)', // Set your border color here
                                                        },
                                                }}
                                                onChange={
                                                    handleHeightFeetChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        fontSize: '1.1em',
                                                        height: '4.13rem',
                                                        margin: '0px',
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                value={heightInches}
                                                placeholder='Inches'
                                                sx={{
                                                    color: 'black',
                                                    '& .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor:
                                                                'rgba(102, 102, 102, 0.20)', // Set your border color here
                                                        },
                                                }}
                                                onChange={
                                                    handleHeightInchesChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        height: '4.13rem',
                                                        margin: '0px',
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-full mt-10 md:mt-4'>
                                        <p
                                            className={`inter-h5-question-header mb-[2rem] md:mb-[32px]`}
                                        >
                                            What is your weight?
                                        </p>
                                        <TextField
                                            value={weight}
                                            placeholder='Pounds'
                                            className='text-cen inter'
                                            sx={{
                                                color: 'black',
                                                '& .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            'rgba(102, 102, 102, 0.20)', // Set your border color here
                                                    },
                                            }}
                                            size='medium'
                                            onChange={handleWeightChange}
                                            inputProps={{
                                                style: {
                                                    textAlign: 'start',
                                                    color: 'black',
                                                    height: '4.13rem',
                                                    margin: '0px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='hidden md:flex flex-col justify-center items-center'>
                                    <div className='flex flex-col w-full '>
                                        <div>
                                            {renderTitle()}
                                            <BioType
                                                className={`inter-h5-question-header mb-[2rem] md:mb-[32px]`}
                                            >
                                                {product_href !==
                                                PRODUCT_HREF.B12_INJECTION
                                                    ? "Let's start where you are now. "
                                                    : ''}
                                                What is your height?
                                            </BioType>
                                        </div>
                                        <div className='flex flex-col md:flex-row gap-4 w-full '>
                                            <TextField
                                                fullWidth
                                                value={heightFeet}
                                                placeholder='Feet'
                                                className='intake-v3-question-text'
                                                sx={{
                                                    color: 'black',
                                                    '& .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor:
                                                                'rgba(102, 102, 102, 0.20)', // Set your border color here
                                                        },
                                                }}
                                                onChange={
                                                    handleHeightFeetChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        height: '68px',
                                                        margin: '0px',
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                value={heightInches}
                                                placeholder='Inches'
                                                sx={{
                                                    color: 'black',
                                                    '& .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor:
                                                                'rgba(102, 102, 102, 0.20)', // Set your border color here
                                                        },
                                                }}
                                                onChange={
                                                    handleHeightInchesChange
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'start',
                                                        color: 'black',
                                                        height: '68px',
                                                        margin: '0px',
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-full mt-[1.25rem] mt-[48px]'>
                                        <p
                                            className={`inter-h5-question-header mb-[2rem] md:mb-[32px]`}
                                        >
                                            What is your weight?
                                        </p>
                                        <TextField
                                            value={weight}
                                            placeholder='Pounds'
                                            className='intake-v3-question-text h-[66px]'
                                            sx={{
                                                color: 'black',
                                                '& .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            'rgba(102, 102, 102, 0.20)', // Set your border color here
                                                    },
                                                height: '66px',
                                            }}
                                            onChange={handleWeightChange}
                                            inputProps={{
                                                style: {
                                                    textAlign: 'start',
                                                    color: 'black',
                                                    height: '68px',
                                                    margin: '0px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        )}
                    </div>
                </div>
                <div className='md:flex md:justify-center mb-[2rem] md:mb-[32px] mt-[48px]'>
                    <ContinueButtonV3
                        onClick={checkBMIHandleContinue}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
