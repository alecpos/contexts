'use client';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    CircularProgress,
    Divider,
    Paper,
} from '@mui/material';

import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import ContinueButton from '../../buttons/ContinueButtonV3';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { BaseOrder } from '@/app/types/orders/order-types';
import { sum } from 'lodash';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { Dispatch, SetStateAction, useState } from 'react';
import { continueButtonExitAnimation } from '../../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import DividerHers from './components/DividerHers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HSAInformationDialog from '../../checkout/order-summary-v3/HSADialog';
import HSAInformationDialogHardcoded from './components/HSADialogHardcoded';
import TreatmentOptionsDialog from './components/TreatmentOptionsDialog';
import ContinueButtonV3 from '../../buttons/ContinueButtonV3';
import WLCapsuleSafetyInformationDialog from './components/WLCapsuleSafetyInformation';

interface Props {
    product_href: PRODUCT_HREF;
    setPage: Dispatch<SetStateAction<PRODUCT_HREF>>;
    buttonLoading: boolean;
    handleClick: () => void;
}

export default function MetforminOrderSummary({
    product_href,
    setPage,
    buttonLoading,
    handleClick,
}: Props) {
    const params = useParams();
    const router = useRouter();
    const fullPath = usePathname();
    const searchParams = useSearchParams();
    const [showHSA, setShowHSA] = useState<boolean>(false);
    const [showTreatmentOptions, setShowTreatmentOptions] =
        useState<boolean>(false);
    const [showSafetyInfo, setShowSafetyInfo] = useState<boolean>(false);

    //const lookupProductHref = product_href;
    //getImageRefUsingProductHref
    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref(product_href),
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const mainImageRef = data?.data[0];

    const getImageHref = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '/img/intake/wl/metformin/metformin_lifestyle.png';
            case PRODUCT_HREF.TIRZEPATIDE:
                return '/img/intake/wl/tirzepatide/clear-tirzepatide-syringe-cropped.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return '/img/intake/wl/wl-capsule.png';
            default:
                return '/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png';
        }
    };

    const displayWeightlossDescription = () => {
        switch (product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <BioType className={`it-body  text-textSecondary`}>
                        Semaglutide, the same active ingredient in Ozempic® and
                        Wegovy®, is shown to promote weight loss in clinical
                        studies. It can reduce your appetite and reduce
                        cravings, contributing to overall weight loss.
                    </BioType>
                );
            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <BioType className={`it-body  text-textSecondary`}>
                        Tirzepatide, the same active ingredient in Mounjaro® and
                        Zepbound®, is shown to promote weight loss in clinical
                        studies. It can reduce your appetite and reduce
                        cravings, contributing to overall weight loss.
                    </BioType>
                );
            case PRODUCT_HREF.METFORMIN:
                return (
                    <BioType className={`it-body  text-textSecondary`}>
                        Metformin is a non-GLP-1 medication that has also been
                        proven effective when used off-label for weight loss.
                        Most patients who use Metformin will lose 2 to 5% of
                        their body weight over a year.
                    </BioType>
                );
            default:
                return null;
        }
    };

    const displayProductName = () => {
        switch (product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return 'Semaglutide';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Tirzepatide';
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin';
            case PRODUCT_HREF.WL_CAPSULE:
                return 'Bioverse Weight Loss Capsules';
            default:
                return '';
        }
    };

    const displayProductPrice = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '$55.00';
            case PRODUCT_HREF.WL_CAPSULE:
                return '$199.00';
            default:
                return '';
        }
    };

    const displayTotalPrice = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '$75.00';
            case PRODUCT_HREF.WL_CAPSULE:
                return '';
            default:
                return '';
        }
    };

    const displaySavings = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return 20;
            case PRODUCT_HREF.WL_CAPSULE:
                return 40;
            default:
                return 0;
        }
    };

    const displayProductDescription = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin is a widely prescribed medication primarily for Type 2 diabetes, known for its effectiveness in improving insulin sensitivity and reducing blood sugar levels. Additionally, metformin has shown potential in aiding weight management and improving cardiovascular health, making it a valuable tool in addressing metabolic disorders.';
            default:
                return 0;
        }
    };

    const displayDescriptionCards = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return (
                    <div className="flex justify-center gap-3 self-stretch bg-white rounded-[21.66px] border-[1px] border-solid border-[#DBD1D1]">
                        <div className="flex px-8 py-6 flex-col justify-center items-center gap-3 flex-1 self-stretch">
                            <BioType className="intake-v3-18px-20px-bold self-stretch">
                                {displayProductName()}
                            </BioType>
                            <BioType className="intake-subtitle">
                                {displayProductDescription()}
                            </BioType>
                        </div>
                    </div>
                );
            case PRODUCT_HREF.WL_CAPSULE:
                return (
                    <div className="flex justify-center gap-3 w-screen overflow-x-auto  flex-nowrap">
                        <div className="flex flex-col min-w-[287px] items-center px-8 py-6 gap-3 self-stretch rounded-[21.66px] border-[1px] border-solid border-[#DBD1D1] bg-white">
                            <BioType className="intake-v3-18px-20px-bold self-start">
                                Bupropion HCl
                            </BioType>
                            <BioType className="intake-subtitle text-black">
                                Bupropion can help with weight loss by reducing
                                hunger and cravings, and increasing energy
                                levels. This medication can be combined with a
                                reduced-calorie diet and exercise to help with
                                weight loss and maintenance.
                            </BioType>
                        </div>
                        <div className="flex flex-col min-w-[287px] items-center px-8 py-6 gap-3 self-stretch rounded-[21.66px] border-[1px] border-solid border-[#DBD1D1] bg-white">
                            <BioType className="intake-v3-18px-20px-bold self-start">
                                Naltrexone HCl
                            </BioType>
                            <BioType className="intake-subtitle text-black">
                                Naltrexone HCl can work to suppress your
                                appetite and break the cycle of elevated insulin
                                and weight gain. When combined with Buproprion
                                HCl, these medications will suppress sugar and
                                carb cravings.
                            </BioType>
                        </div>
                        <div className="flex flex-col min-w-[287px] items-center px-8 py-6 gap-3 self-stretch rounded-[21.66px] border-[1px] border-solid border-[#DBD1D1] bg-white">
                            <BioType className="intake-v3-18px-20px-bold self-start">
                                Topirmate
                            </BioType>
                            <BioType className="intake-subtitle text-black">
                                Topiramate can be prescribed off-label to aid in
                                weight loss. appetite suppression (reduced
                                calorie intake), preventing the body from
                                storing excess fat, and lowering some fat and
                                cholesterol levels.
                            </BioType>
                        </div>
                    </div>
                );
        }
    };

    const displayHowItWorks = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return (
                    <div className="flex flex-col gap-6">
                        <BioType className="intake-subtitle text-weak">
                            Metformin works by decreasing hepatic glucose
                            production and increasing insulin sensitivity,
                            thereby reducing blood sugar levels. This action not
                            only assists in managing existing diabetes but also
                            in preventing the onset of Type 2 diabetes.
                        </BioType>
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle text-weak">
                                Most Common Side Effects:
                            </BioType>
                            <ul className="ml-6 list-disc marker:text-[#333333bf]">
                                <li>
                                    <BioType className="intake-subtitle text-weak">
                                        Gastrointestinal discomfort (diarrhea,
                                        nausea, bloating)
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle text-weak">
                                        Reduction of Vitamin B12 levels
                                    </BioType>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case PRODUCT_HREF.WL_CAPSULE:
                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle">
                                Bioverse Weight Loss Capsules are a specially
                                formulated weight loss medication that combines
                                three key ingredients: Bupropion HCl, Naltrexone
                                HCl, and Topiramate. Each plays a unique role in
                                helping you manage your weight:
                            </BioType>
                            <ul className="marker:text-[#333333bf] list-disc ml-6">
                                <li>
                                    <BioType className="intake-subtitle">
                                        Bupropion HCl (65 mg): Helps reduce
                                        appetite and cravings by acting on
                                        neurotransmitters in the brain.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Naltrexone HCl (8 mg): Reduces the
                                        reward response to food, making it
                                        easier to manage cravings.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Topiramate (15 mg): Promotes feelings of
                                        fullness, alters taste perception, and
                                        may help increase calorie burning.
                                    </BioType>
                                </li>
                            </ul>
                            <BioType className="intake-subtitle">
                                By working together, these ingredients support
                                weight loss by reducing hunger and cravings,
                                helping you make healthier choices.
                            </BioType>
                        </div>
                        <BioType className="intake-subtitle">
                            While Bioverse Weight Loss Capsules can be an
                            effective tool for weight management, they contain
                            prescription-strength ingredients that may cause
                            side effects. It&apos;s important to be aware of
                            potential risks and consult your Bioverse healthcare
                            provider before starting treatment.
                        </BioType>
                        <div className="flex flex-col">
                            <BioType className="intake-subtitle">
                                Common Side Effects
                            </BioType>
                            <ul className="marker:text-[#333333bf] list-disc ml-6">
                                <li>
                                    <BioType className="intake-subtitle">
                                        Bupropion HCl: May cause insomnia,
                                        restlessness, anxiety, dry mouth,
                                        dizziness, increased heart rate, nausea,
                                        and headaches. In some cases, it may
                                        increase the risk of seizures,
                                        especially in individuals with a history
                                        of epilepsy or eating disorders.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Naltrexone HCl: Can cause nausea,
                                        vomiting, dizziness, headaches, fatigue,
                                        trouble sleeping, and gastrointestinal
                                        discomfort such as diarrhea or
                                        constipation. It may also increase liver
                                        enzyme levels, so patients with liver
                                        conditions should use it cautiously.
                                    </BioType>
                                </li>
                                <li>
                                    <BioType className="intake-subtitle">
                                        Topiramate: May lead to drowsiness,
                                        dizziness, cognitive impairment
                                        (difficulty with memory or
                                        concentration), numbness or tingling in
                                        the hands and feet, and changes in taste
                                        perception. In rare cases, it can
                                        contribute to metabolic acidosis, kidney
                                        stones, or vision problems such as acute
                                        myopia and secondary angle-closure
                                        glaucoma.
                                    </BioType>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center md:w-[447px] gap-[50px] p-[20px] md:p-0 overflow-x-visible">
                <div className="flex flex-col animate-slideRight mt-[2.06rem] md:mt-[33px] w-full md:max-w-[490px] ">
                    <div className="flex flex-col items-center">
                        <p
                            className={`inter-h5-question-header mb-[1.25rem] md:mb-[20px] self-start`}
                        >
                            Based on your responses you may be eligible for:
                        </p>
                    </div>

                    <div className=" md:w-[447px] ">
                        <div className="flex flex-col  p-[2rem]  md:p-[32px] rounded-xl border-[1px] border-solid border-[#dbd1d1] bg-white">
                            {product_href === PRODUCT_HREF.METFORMIN && (
                                <div className="bg-[#ccfbb6] w-full py-0.5 px-1 rounded-md flex justify-center">
                                    <BioType className="intake-v3-form-label">
                                        Limited time: Unlock $
                                        {displaySavings()?.toFixed(0)} today
                                    </BioType>
                                </div>
                            )}
                            <BioType
                                className={`intake-v3-form-label-bold mb-1 md:mb-0 mt-2`}
                            >
                                {displayProductName()}
                            </BioType>

                            <div className="mx-auto mt-4 relative w-full aspect-[1.23] h-[190px] md:h-[250px] ">
                                <Image
                                    src={getImageHref()}
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit="contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <BioType className="intake-v3-form-label">
                                    Total, if prescribed:
                                </BioType>
                                <div className="flex gap-1">
                                    <BioType className="intake-v3-form-label text-weak">
                                        <s>{displayTotalPrice()}</s>
                                    </BioType>
                                    <BioType className="intake-v3-form-label-bold">
                                        {displayProductPrice()}
                                    </BioType>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-[9px] mt-1">
                                {/* <div className='w-full flex justify-between'>
                            <BioType className={`intake-v3-form-label`}>
                                Total, if prescribed:
                            </BioType>


                            <div className='flex flex-row gap-2'>
                            {priceData.cadence === 'monthly' && (
                                <s className='intake-v3-form-label'>{priceData.price_data.product_price.toFixed(2)}</s>
                                
                            )}
                            <BioType className={`intake-v3-form-label-bold`}>
                                ${displayProductPrice()?.toFixed(2)}
                            </BioType>
                            </div>
                        </div> */}
                            </div>

                            <Divider className="w-full bg-slate-300 h-[.5px] my-3" />

                            <div className="flex flex-row justify-between items-end">
                                <div className="">
                                    <p
                                        className={`intake-v3-disclaimer-text text-weak`}
                                    >
                                        Comes with medical support tailored to
                                        your weight loss profile
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mb-4">
                        <div className="h-[1.25rem] md:h-[20px] flex flex-col justify-center w-fit px-3 py-1 rounded-b-lg bg-gradient-to-r from-cyan-200 to-pink-200 text-slate-600 intake-v3-disclaimer-text  mx-auto">
                            You won&apos;t be charged until prescribed.
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[22px] self-stretch">
                    <BioType className="intake-v3-18px-20px">
                        Doctor-trusted medication and clinically-proven weight
                        loss results
                    </BioType>
                    {displayDescriptionCards()}
                </div>

                <div className="flex flex-col gap-4">
                    <DividerHers />
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <BioType className="text-black intake-subtitle">
                                How it works & side effects
                            </BioType>
                        </AccordionSummary>
                        <AccordionDetails>
                            {displayHowItWorks()}
                        </AccordionDetails>
                    </Accordion>
                    {product_href === PRODUCT_HREF.METFORMIN && <DividerHers />}
                    {product_href === PRODUCT_HREF.METFORMIN && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BioType className="text-black intake-subtitle">
                                    Important safety information{' '}
                                </BioType>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="flex flex-col gap-4">
                                    <BioType className="intake-subtitle text-weak">
                                        Most people start with a small dose to
                                        avoid stomach discomfort (1/2 or 1
                                        tablet per day with food, slowly
                                        increasing to what has been prescribed).
                                        Bioverse prescribes the Extended Release
                                        (ER) version to reduce stomach
                                        discomfort.
                                    </BioType>

                                    <BioType className="intake-subtitle text-weak">
                                        Please Note: Metformin is commonly
                                        stopped a week before any surgical
                                        procedure or medical diagnostic
                                        requiring contrast, such as a CT scan.
                                        If you are unsure, please ask your
                                        doctor.
                                    </BioType>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    <DividerHers />
                    <Accordion disableGutters>
                        <AccordionSummary
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowHSA(true);
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
                                FSA/HSA reimbursement
                            </BioType>
                        </AccordionSummary>
                    </Accordion>
                    {product_href === PRODUCT_HREF.WL_CAPSULE && (
                        <>
                            <DividerHers />
                            <Accordion disableGutters>
                                <AccordionSummary
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowSafetyInfo(true);
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
                        </>
                    )}
                </div>
                <div className="flex gap-3 self-stretch">
                    <div className="flex flex-col px-8 py-6 gap-3 self-stretch flex-1 rounded-[21.66px] border-[1px] border-solid border-[#DBD1D1] bg-white">
                        <BioType className="intake-subtitle text-black">
                            All weight loss medications
                        </BioType>
                        <Button
                            variant="outlined"
                            sx={{
                                backgroundColor: 'white',
                                height: '36px',
                                borderRadius: '12px',
                                border: '1px solid black',
                                textTransform: 'none',
                                maxWidth: '108px',
                            }}
                            onClick={() => setShowTreatmentOptions(true)}
                        >
                            <BioType className="intake-v3-disclaimer-text-bold text-black">
                                Explore
                            </BioType>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <BioType
                        className={`intake-v3-18px-20px mt-[1rem] mb-[1.25rem] md:mb-[20px] `}
                    >
                        We&apos;re here to help every step of the way
                    </BioType>
                    <div className="w-full h-[210px] flex">
                        <div className="relative flex-1 rounded-t-lg   bg-[#F4F4F4F4] overflow-hidden">
                            <Image
                                src="/img/intake/wl/aiDoctor.jpg"
                                fill
                                className="rounded-t-lg "
                                alt="Vial Image"
                                style={{ objectFit: 'cover' }}
                                unoptimized
                            />
                        </div>
                    </div>

                    <div
                        className="p-6 md:mb-[1.75rem] mb-[60px] rounded-b-lg bg-white"
                        style={{ border: '1px solid #dbd1d1' }}
                    >
                        <div className="flex flex-row gap-2 mb-[.75rem] bg-white">
                            <div className="flex flex-col gap-[.75rem] bg-white">
                                <img
                                    src="/img/intake/wl/phone.svg"
                                    alt="phone"
                                    className="w-6 h-6"
                                />
                                <BioType
                                    className={`intake-v3-18px-20px-bold `}
                                >
                                    Ongoing check-ins
                                </BioType>
                                <BioType className={`intake-v3-form-label`}>
                                    We&apos;ll follow up regularly to see how
                                    you&apos;re doing and progressing towards
                                    your goals.
                                </BioType>
                            </div>
                        </div>
                        <Divider />
                        <div className="flex flex-row gap-2 my-[1rem] bg-white">
                            <div className="flex flex-col gap-[.75rem]">
                                <img
                                    src="/img/intake/wl/chatBubble.svg"
                                    alt="phone"
                                    className="w-6 h-6"
                                />

                                <BioType className={`intake-v3-18px-20px-bold`}>
                                    Unlimited messaging
                                </BioType>
                                <BioType className={`intake-v3-form-label`}>
                                    Message your care team at any time at no
                                    extra cost.
                                </BioType>
                            </div>
                        </div>
                        <Divider className="" />
                        <div className="flex flex-row gap-2 mt-[.75rem]">
                            <div className="flex flex-col gap-[.75rem] bg-white">
                                <img
                                    src="/img/intake/wl/box.svg"
                                    alt="phone"
                                    className="w-6 h-6 mt-1"
                                />

                                <BioType className={`intake-v3-18px-20px-bold`}>
                                    Free shipping
                                </BioType>
                                <BioType className={`intake-v3-form-label`}>
                                    We&apos;ll deliver every shipment right to
                                    your door.
                                </BioType>
                            </div>
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
                <HSAInformationDialogHardcoded
                    openHSADialog={showHSA}
                    setOpenHSADialog={setShowHSA}
                    product_href={product_href}
                />
                <TreatmentOptionsDialog
                    currentProduct={product_href}
                    openDialog={showTreatmentOptions}
                    setOpenDialog={setShowTreatmentOptions}
                    setPage={setPage}
                />
                <WLCapsuleSafetyInformationDialog
                    openDialog={showSafetyInfo}
                    setOpenDialog={setShowSafetyInfo}
                />
            </div>
        </>
    );
}
