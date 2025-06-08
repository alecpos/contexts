'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import useSWR from 'swr';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dispatch, SetStateAction, useState } from 'react';
import SafetyInformationDialog from './components/SafetyInformationDialog';
import DividerHers from './components/DividerHers';
import TreatmentOptionsDialog from './components/TreatmentOptionsDialog';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { useSearchParams } from 'next/navigation';
import { USStates } from '@/app/types/enums/master-enums';

interface SemaglutideOrderSummaryProps {
    currentBMI: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
    goalBMI: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
    setPage: Dispatch<SetStateAction<PRODUCT_HREF>>;
    handleClick: () => void;
    buttonLoading: boolean;
}

export default function SemaglutideOrderSummaryV4({
    currentBMI,
    goalBMI,
    setPage,
    handleClick,
    buttonLoading,
}: SemaglutideOrderSummaryProps) {
    const [showSafetyInformation, setShowSafetyInformation] =
        useState<boolean>(false);
    const [showTreatmentOptions, setShowTreatmentOptions] =
        useState<boolean>(false);
    const searchParams = useSearchParams();

    const getPrice = () => {
        if (
            [USStates.California, USStates.Michigan].includes(
                (searchParams.get('ptst') as USStates) || ('' as USStates),
            )
        ) {
            return '$159/mo';
        }
        return '$129/mo';
    };

    const renderDivider = () => {
        return <div className="w-full h-[1px] bg-[#0011661a]"></div>;
    };

    return (
        <div className="flex flex-col items-center gap-12 self-stretch mt-8">
            <div className="flex flex-col items-center gap-[16px] md:gap-12 self-stretch">
                <div className="flex flex-col items-center gap-5 self-stretch">
                    <BioType className="intake-v3-18px-20px-bold">
                        Based on your responses you may be eligible for:
                    </BioType>
                    <div className="flex flex-col items-center gap-4 self-stretch">
                        <div className="flex flex-col self-stretch">
                            <div className="flex h-[7px] py-3 justify-center items-center gap-[10px] self-stretch rounded-t-[12px] bg-[#BBC5CC]">
                                <div className="flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="17"
                                        viewBox="0 0 17 17"
                                        fill="none"
                                    >
                                        <g clip-path="url(#clip0_1460_2605)">
                                            <path
                                                d="M15.1673 8.35805V8.97139C15.1665 10.409 14.701 11.8078 13.8402 12.9593C12.9794 14.1107 11.7695 14.953 10.3909 15.3607C9.01227 15.7683 7.53882 15.7193 6.1903 15.2211C4.84177 14.7229 3.69042 13.8021 2.90796 12.5961C2.1255 11.3901 1.75385 9.96343 1.84844 8.52893C1.94303 7.09443 2.49879 5.72894 3.43284 4.6361C4.36689 3.54327 5.62917 2.78164 7.03144 2.46482C8.43371 2.14799 9.90083 2.29294 11.214 2.87805M15.1673 3.63806L8.50065 10.3114L6.50065 8.3114"
                                                stroke="black"
                                                stroke-opacity="0.9"
                                                stroke-width="1.01733"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1460_2605">
                                                <rect
                                                    width="16"
                                                    height="16"
                                                    fill="white"
                                                    transform="translate(0.5 0.971436)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <BioType className="intake-v3-disclaimer-text">
                                        Eligible treatment match
                                    </BioType>
                                </div>
                            </div>
                            <div className="flex p-4 flex-col items-center gap-3 self-stretch border-t-0 border-x-0 rounded-b-[12px] border-[#66666633] bg-[#D7E3EB]">
                                <div className="flex flex-col gap-3 self-stretch">
                                    <div className="flex px-3 py-1 max-w-[90px] justify-center items-center rounded-[4px] bg-[#CCFBB6]">
                                        <BioType className="intake-v3-disclaimer-text">
                                            From {getPrice()}
                                        </BioType>
                                    </div>
                                    <BioType className="intake-v3-18px-20px-bold">
                                        Compunded Semaglutide
                                    </BioType>
                                </div>
                                <div className="mx-auto mt-4 relative w-[100%]  aspect-[1.23] mb-1 h-[190px] md:h-[220px] ">
                                    <Image
                                        src={
                                            '/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png'
                                        }
                                        alt={'Medicine Vial'}
                                        fill
                                        objectFit="contain"
                                        unoptimized
                                    />
                                </div>
                                <div className="h-[1px] w-full self-stretch bg-[#66666633]"></div>
                                <BioType className="intake-v3-disclaimer-text text-weak">
                                    Comes with a behavioral program tailored to
                                    your weight loss profile
                                </BioType>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6 self-stretch">
                <BioType className="intake-v3-18px-20px-bold">
                    Made with the same active ingredient as Ozempic® and Wegovy®
                </BioType>
                <BioType className="intake-v3-disclaimer-text text-weak">
                    Compounded drug products are not approved or evaluated by
                    the FDA for safety, efficacy, or quality. Ozempic® and
                    Wegovy® are compounded and FDA-approved. Prescription
                    required. FSA/HSA eligible.
                </BioType>
            </div>
            <div className="flex flex-col p-6 gap-12 self-stretch rounded-[32px] bg-white">
                <div className="flex flex-col space-y-6 self-stretch">
                    <BioType className="intake-v3-18px-20px-bold">
                        What is compounded semaglutide?
                    </BioType>
                    <BioType className="intake-v3-form-label">
                        A weekly prescription injection that contains the same
                        active ingredient found in Ozempic® and Wegovy®
                    </BioType>
                    <div className="flex self-stretch md:gap-6 justify-center">
                        <div className="flex flex-col px-4 py-6 items-center gap-6 flex-1 rounded-[12px] bg-[#D7E3EB] flex-shrink-0">
                            <BioType className="intake-v3-form-label-bold self-stretch h-5 text-center">
                                Compounded Semaglutide
                            </BioType>
                            <div className="mx-auto mt-4 relative w-[100%]  aspect-[1.23] mb-1 h-[120px] md:h-[120px] ">
                                <Image
                                    src={
                                        '/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png'
                                    }
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit="contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Starts at
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    {getPrice()}
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Dosing
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Personalized
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Availability
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    In stock
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Doctor-trusted
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Effective
                                </BioType>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 py-6 items-center gap-6 flex-1 rounded-[12px]  flex-shrink-0">
                            <BioType className="intake-v3-form-label self-stretch text-center h-5">
                                Ozempic®
                            </BioType>
                            <div className="mx-auto mt-4 relative w-[100%]  aspect-[1.23] mb-1 h-[120px] md:h-[120px] ">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}/product-images/ozempic/ozempic.png`}
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit="contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Starts at
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    $1,799/mo
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Dosing
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Fixed
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Availability
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Supply shortages
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Doctor-trusted
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Effective
                                </BioType>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 self-stretch">
                    <BioType className="intake-v3-18px-20px-bold">
                        Your treatment match is based on:
                    </BioType>
                    <div className="flex flex-col px-[24px] py-[20px] gap-[10px] self-stretch rounded-[12px] bg-white shadow-[33px_-10px_49px_0px_rgba(0,0,0,0.00),21px_110px_45px_0px_rgba(0,0,0,0.01),12px_37px_25px_0px_rgba(0,0,0,0.05),5px_2px_28px_0px_rgba(0,0,0,0.09)]">
                        <div className="flex flex-col gap-4 self-stretch items-start">
                            <div className="flex items-center gap-[10px] self-stretch">
                                <div className="w-[3px] h-5 bg-[#D4B3FF] "></div>
                                <BioType className="inter-h5-question-header-bold text-[16px] text-[#D4B3FF]">
                                    Goal to lose{' '}
                                    {currentBMI.weight_lbs - goalBMI.weight_lbs}{' '}
                                    lbs
                                </BioType>
                            </div>
                            <div className="flex items-center gap-[10px] self-stretch">
                                <div className="w-[3px] h-5 bg-[#D4B3FF] "></div>
                                <BioType className="inter-h5-question-header-bold text-[16px] text-[#D4B3FF]">
                                    BMI of {Number(goalBMI.bmi).toFixed(0)}
                                </BioType>
                            </div>
                        </div>
                    </div>
                    <BioType className="intake-v3-disclaimer-text text-weak">
                        Compounded semaglutide is not approved or evaluated for
                        safety, efficacy, or quality by the FDA. Ozempic®
                        (semaglutide) and Wegovy® (semaglutide) are not
                        compounded. Ozempic is FDA-approved for type 2 diabetes
                        treatment but may be prescribed off label for weight
                        loss at a healthcare provider&apos;s discretion. Wegovy®
                        is FDA-approved for weight loss.
                    </BioType>
                </div>
                <div className="flex flex-col gap-4 self-stretch">
                    {renderDivider()}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <BioType className="text-black intake-subtitle">
                                Why we&apos;re trusted
                            </BioType>
                        </AccordionSummary>
                        <AccordionDetails>
                            <BioType className="intake-subtitle text-weak">
                                Safe, quality care means everything to us.
                                That&apos;s why Bioverse only partners with
                                FDA-registered pharmacies using ingredients from
                                FDA-regulated suppliers—ensuring strict quality
                                and compliance standards when producing
                                compounded semaglutide. Additionally, each
                                medication batch is quality-checked by an
                                accredited third-party lab to verify its
                                consistency, potency, and sterility. The results
                                are recorded in a Certificate of Analysis that
                                you can access anytime.
                            </BioType>
                        </AccordionDetails>
                    </Accordion>
                    {renderDivider()}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <BioType className="text-black intake-subtitle">
                                What&apos;s included
                            </BioType>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <BioType className="intake-subtitle text-weak">
                                        Ongoing care & support
                                    </BioType>
                                    <ul className="ml-6 list-disc marker:text-[#333333bf]">
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Access to 24/7 provider
                                                messaging
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Dosage requirements
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Regular check-ins
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Progress tracking tools
                                            </BioType>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <BioType className="intake-subtitle text-weak">
                                        Comes with everything you need:
                                    </BioType>
                                    <ul className="ml-6 list-disc marker:text-[#333333bf]">
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Compounded semaglutide vials
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Sterile syringes and alcohol
                                                wipes
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Step-by-step dosing guide
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle text-weak">
                                                Anti-nausea medication, if
                                                eligible
                                            </BioType>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    {renderDivider()}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <BioType className="text-black intake-subtitle">
                                How semaglutide works
                            </BioType>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <BioType className="intake-subtitle-bold text-weak">
                                        Mimics gut hormones
                                    </BioType>
                                    <BioType className="intake-subtitle text-weak">
                                        Semaglutide mimics and helps amplify a
                                        natural hormone in the body called
                                        GLP-1.
                                    </BioType>
                                </div>
                                <div className="flex flex-col">
                                    <BioType className="intake-subtitle-bold text-weak">
                                        Slows digestion
                                    </BioType>
                                    <BioType className="intake-subtitle text-weak">
                                        Helps decrease blood sugar levels and
                                        slow how quickly the stomach empties,
                                        helping you feel fuller quicker and for
                                        longer.
                                    </BioType>
                                </div>
                                <div className="flex flex-col">
                                    <BioType className="intake-subtitle-bold text-weak">
                                        Suppresses hunger signals
                                    </BioType>
                                    <BioType className="intake-subtitle text-weak">
                                        Directly affects the appetite center of
                                        the brain, which can give you better
                                        control over cravings.
                                    </BioType>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    {renderDivider()}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <BioType className="text-black intake-subtitle">
                                How to take
                            </BioType>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-4">
                                <BioType className="intake-subtitle text-weak">
                                    Compounded semaglutide is injected once a
                                    week. We&apos;ll walk you through how to
                                    safely give yourself medication with
                                    step-by-step guides and video tutorials.
                                </BioType>
                                <BioType className="intake-subtitle-bold text-weak">
                                    81% of compounded GLP-1 customers say their
                                    injection experiences are less painful than
                                    expected.
                                </BioType>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    {renderDivider()}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <BioType className="text-black intake-subtitle">
                                Potential side effects
                            </BioType>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-4">
                                <BioType className="intake-subtitle text-weak">
                                    Just like any medication, there&apos;s
                                    always a potential for side effects. The
                                    most common side effects are nausea,
                                    constipation, and heartburn, which can be
                                    managed with over-the-counter treatments.
                                    Additionally, a fast-acting anti-nausea
                                    medication is included with your treatment
                                    at no extra cost, if eligible.
                                </BioType>
                                <BioType className="intake-subtitle text-weak">
                                    To minimize side effects, a provider will
                                    tailor your dosage plan to start low and
                                    gradually increase to the full steady dose
                                    over time.
                                </BioType>
                                <BioType className="intake-subtitle text-weak">
                                    If you experience worrying symptoms or want
                                    to talk with a provider, you can message
                                    your Care Team any time through the app.
                                </BioType>
                                <BioType className="intake-subtitle-bold text-weak">
                                    79% of compounded GLP-1 customers say the
                                    side effects from their weight loss
                                    treatment through Bioverse are as or better
                                    than expected.
                                </BioType>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    {renderDivider()}
                    <Accordion disableGutters>
                        <AccordionSummary
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowSafetyInformation(true);
                            }}
                            expandIcon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    className="mr-1"
                                >
                                    <path
                                        d="M12 5.31055V19.3105M5 12.3105H19"
                                        stroke="black"
                                        stroke-opacity="0.9"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            }
                        >
                            <BioType className="text-black intake-subtitle">
                                Important safety information
                            </BioType>
                        </AccordionSummary>
                    </Accordion>
                </div>
            </div>
            <div className="flex flex-col p-6 gap-12 self-stretch rounded-[32px] bg-white">
                <div className="flex flex-col space-y-6 self-stretch">
                    <BioType className="intake-v3-18px-20px-bold">
                        Compare to other options
                    </BioType>
                    <div className="flex md:gap-6 self-stretch justify-center">
                        <div className="flex flex-col px-4 py-6 items-center gap-6 flex-1 rounded-[12px] bg-[#D7E3EB] flex-shrink-0">
                            <BioType className="intake-v3-form-label-bold self-stretch h-5 text-center">
                                Compounded Semaglutide
                            </BioType>
                            <div className="mx-auto mt-4 relative w-[100%]  aspect-[1.23] mb-1 h-[120px] md:h-[120px] ">
                                <Image
                                    src={
                                        '/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png'
                                    }
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit="contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Type
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Injection
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Frequency
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Once a week
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Weight loss goal
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Greater amount of weight
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Side effects
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Fewer potential side effects
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Price
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    {getPrice()}
                                </BioType>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 py-6 items-center gap-6 flex-1 rounded-[12px] bg-white flex-shrink-0">
                            <BioType className="intake-v3-form-label self-stretch text-center h-5">
                                Metformin
                            </BioType>
                            <div className="mx-auto mt-4 relative w-[100%]  aspect-[1.23] mb-1 h-[120px] md:h-[120px] ">
                                <Image
                                    src={
                                        '/img/intake/wl/metformin/metformin_lifestyle.png'
                                    }
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit="contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Type
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Oral pills
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Frequency
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    1-2x daily
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Weight loss goal
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    Small-moderate amount of weight
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Side effects
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    More potential side effects{' '}
                                </BioType>
                            </div>
                            <div className="flex flex-col self-stretch text-center">
                                <BioType className="intake-v3-form-label">
                                    Price
                                </BioType>
                                <BioType className="intake-v3-form-label-bold">
                                    $25/mo
                                </BioType>
                            </div>
                        </div>
                    </div>
                    <BioType className="intake-v3-disclaimer-text text-weak">
                        *with a 12-month plan paid upfront
                    </BioType>
                    <div className="flex flex-col gap-4">
                        <BioType className="intake-v3-form-label-bold">
                            All treatments through BIOVERSE include ongoing care
                            at no extra cost:
                        </BioType>
                        <ul className="list-disc ml-6">
                            <li>
                                <BioType className="intake-v3-form-label">
                                    Access to 24/7 provider messaging
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-v3-form-label">
                                    Dosage adjustments
                                </BioType>
                            </li>
                            <li>
                                <BioType className="intake-v3-form-label">
                                    Regular check-ins
                                </BioType>
                            </li>
                        </ul>
                    </div>
                </div>
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        backgroundColor: 'white',
                        height: '48px',
                        borderRadius: '12px',
                        border: '1px solid black',
                        textTransform: 'none',
                    }}
                    onClick={() => setShowTreatmentOptions(true)}
                >
                    <BioType className="intake-v3-form-label-bold text-black">
                        View the other treatment options
                    </BioType>
                </Button>
            </div>
            <div className="flex p-6 flex-col gap-6 self-stretch rounded-8 bg-white">
                <div className="flex flex-col gap-6 self-stretch">
                    <BioType className="intake-v3-form-label-bold">
                        Lose weight with BIOVERSE
                    </BioType>
                </div>
                <div className="flex h-[260px] px-8 flex-col justify-center items-start gap-5 self-stretch bg-[#D7E3EB]">
                    <div className="flex justify-center items-center self-stretch">
                        <BioType className="inter-h5-question-header text-[61px] leading-[61px] font-[200]">
                            2
                        </BioType>
                        <BioType className="intake-subtitle-bold">in</BioType>
                        <BioType className="inter-h5-question-header text-[61px] leading-[61px] font-[200]">
                            3
                        </BioType>
                    </div>
                    <div className="flex justify-center items-center self-stretch">
                        <BioType className="intake-v3-form-label text-center">
                            customers say they feel more in control of their
                            weight since starting weight loss treatment through
                            BIOVERSE.
                        </BioType>
                    </div>
                </div>
                <BioType className="intake-v3-disclaimer-text text-weak">
                    Personalized treatment plans included GLP-1 injections,
                    along with a reduced calorie diet and exercise.
                </BioType>
            </div>
            <div className="flex p-6 flex-col gap-12 self-stretch rounded-[32px] bg-white shadow-[0px_13px_28px_0px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-4">
                    <BioType className="inter-h5-question-header-bold">
                        FAQ
                    </BioType>

                    <div className="flex flex-col gap-4 self-stretch">
                        <DividerHers />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    How much weight can I lose?
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        As a science-backed weight loss program
                                        that&apos;s been developed by experts,
                                        your unique treatment plan is designed
                                        to support healthy, sustainable results.
                                        Because everyone&apos;s weight loss
                                        journey is different, the timeline for
                                        results may vary from person to person.
                                        In general, it&apos;s important to
                                        incorporate healthy lifestyle and
                                        wellness changes such as:
                                    </BioType>

                                    <ul className="marker:text-[#333333bf] list-disc ml-6">
                                        <li>
                                            <BioType className="intake-subtitle">
                                                Taking your medication as
                                                directed
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle">
                                                Supporting your progress with
                                                healthy nutrition
                                            </BioType>
                                        </li>
                                        <li>
                                            <BioType className="intake-subtitle">
                                                Incorporating consistent,
                                                moderate physical activity into
                                                your routine
                                            </BioType>
                                        </li>
                                    </ul>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <DividerHers />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    When will I see results?
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        Remember, results aren&apos;t instant.
                                        Because everyone&apos;s weight loss
                                        journey is different, the timeline for
                                        results may vary from person to person.
                                        Along with medication, it&apos;s
                                        important to get proper sleep,
                                        nutrition, movement, and water for the
                                        best results.
                                    </BioType>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <DividerHers />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    How can I reimburse?
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        You can download a receipt of your
                                        eligible expenses and submit online for
                                        reimbursement through your FSA or HSA.
                                        Head to the &apos;orders&apos; tab to
                                        find your receipt. From there, you can
                                        download your receipt and follow your
                                        FSA/HSA provider&apos;s reimbursement
                                        instructions.
                                    </BioType>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <DividerHers />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    How long do I need to stay on it?
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        Medication is a long-term use weight
                                        loss treatment not meant for short-term
                                        use. When you stop taking it, the
                                        triggers that previously drove unhealthy
                                        eating behaviors may return. Always
                                        speak with a licensed medical provider
                                        before stopping treatment.
                                    </BioType>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <DividerHers />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    How is it sourced?
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        Ingredients are sourced from
                                        FDA-regulated suppliers, and the
                                        treatments are compounded in
                                        FDA-regulated facilities.
                                    </BioType>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <DividerHers />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    What is a certificate of analysis?
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        It&apos;s a document that verifies a
                                        compounded GLP-1 prescription&apos;s
                                        consistency, potency, and sterility.
                                    </BioType>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
            <Button
                variant="contained"
                fullWidth
                sx={{
                    zIndex: 30,
                    backgroundColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#666666',
                    },
                    borderRadius: '12px',
                    textTransform: 'none',
                }}
                onClick={handleClick}
                className={`h-[3rem] md:h-[48px]
                `}
            >
                {buttonLoading ? (
                    <CircularProgress sx={{ color: 'white' }} size={22} />
                ) : (
                    <BioType className="intake-v3-form-label-bold">
                        Continue
                    </BioType>
                )}
            </Button>
            <SafetyInformationDialog
                openDialog={showSafetyInformation}
                setOpenDialog={setShowSafetyInformation}
            />
            <TreatmentOptionsDialog
                openDialog={showTreatmentOptions}
                setOpenDialog={setShowTreatmentOptions}
                currentProduct={PRODUCT_HREF.SEMAGLUTIDE}
                setPage={setPage}
            />
        </div>
    );
}
