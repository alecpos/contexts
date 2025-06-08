'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_INPUT_TAILWIND,
} from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import { BaseOrderInterface } from '@/app/types/orders/order-types';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { formatDateFullMonth } from '@/app/utils/functions/formatting';
import { Button, CircularProgress, Paper } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
    displayDiscountedPriceFirstTimeDosage,
    displayProductTitleFirstTimeDosage,
    displaySavingsFirstTimeDosageFirstTimeDosage,
    displaySupplyTotalFirstTimeDosage,
    displayTotalPriceFirstTimeDosage,
    displayVialDescriptions,
} from './utils';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { DosageInstructions } from '@/app/types/product-prices/product-prices-types';
import Link from 'next/link';
import { processDosageSelectionFirstTimeRequest } from '@/app/utils/actions/intake/order-util';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';

interface FirstTimeAlmostDoneScreenProps {
    priceData: Partial<ProductVariantRecord>;
    order: BaseOrderInterface;
    product_href: string;
    patientData: DBPatientData;
}

export default function FirstTimeAlmostDoneScreen({
    priceData,
    order,
    patientData,
}: FirstTimeAlmostDoneScreenProps) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const router = useRouter();
    const [showLearnMore, setShowLearnMore] = useState<boolean>(false);

    const { product_href } = order;

    //need to make sure priceData is accurate for biannual

    const css_class_names = {
        main_container: 'flex flex-col gap-[28px] px-10 items-center mt-10',
        content_container: 'flex flex-col gap-[16px] mb-10 md:w-[460px]',
        information_container: 'flex flex-col gap-[16px]',

        bv_images: 'h-full max-w-[90vw]',

        continue_button_container:
            'md:static bottom-[25px] flex w-[90vw] mt-1 sm:w-full',

        button_sx: {
            height: '52px',
            backgroundColor: '#000000',
            '&:hover': {
                backgroundColor: '#666666',
            },
            borderRadius: '12px',
        },
    };

    function displayDosageInstructionsFirstTimeDosage(
        priceData: Partial<ProductVariantRecord>
    ) {
        if (priceData.cadence === SubscriptionCadency.Biannually) {
            if (showLearnMore) {
                return (
                    <div className='flex flex-col space-y-4'>
                        {priceData.price_data.dosage_instructions.map(
                            (item: DosageInstructions, index: number) => {
                                return (
                                    <div
                                        className='flex flex-col space-y-1'
                                        key={index}
                                    >
                                        <BioType className='intake-subtitle text-black'>
                                            {item.header}
                                        </BioType>
                                        <BioType className='intake-subtitle text-weak'>
                                            {item.subtitle}
                                        </BioType>
                                    </div>
                                );
                            }
                        )}
                    </div>
                );
            } else {
                const spliced_dosage_instructions = (
                    priceData.price_data.dosage_instructions || []
                ).slice(0, 3);

                return (
                    <div className='flex flex-col space-y-4'>
                        {spliced_dosage_instructions.map(
                            (item: DosageInstructions, index: number) => {
                                return (
                                    <div
                                        className='flex flex-col space-y-1'
                                        key={index}
                                    >
                                        <BioType className='intake-subtitle text-black'>
                                            {item.header}
                                        </BioType>
                                        <BioType className='intake-subtitle text-weak'>
                                            {item.subtitle}
                                        </BioType>
                                    </div>
                                );
                            }
                        )}
                    </div>
                );
            }
        } else if (priceData.cadence === SubscriptionCadency.Quarterly) {
            return (
                <div className='flex flex-col space-y-4'>
                    {priceData.price_data.dosage_instructions.map(
                        (item: DosageInstructions, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className='flex flex-col space-y-1'
                                >
                                    <BioType className='intake-subtitle text-black'>
                                        {item.header}
                                    </BioType>
                                    <BioType className='intake-subtitle text-weak'>
                                        {item.subtitle}
                                    </BioType>
                                </div>
                            );
                        }
                    )}
                </div>
            );
        } else {
            return (
                <div className='flex flex-col space-y-1'>
                    <BioType className='intake-subtitle text-black'>
                        Month 1 (Weeks 1 - 4)
                    </BioType>
                    <BioType className='intake-subtitle'>
                        {priceData.price_data.dosage_instructions}
                    </BioType>
                </div>
            );
        }

        return null; // Default return if condition isn't met
    }

    function displayLearnMoreBiannual(
        priceData: Partial<ProductVariantRecord>
    ) {
        if (priceData.cadence !== SubscriptionCadency.Biannually) {
            return;
        }

        return (
            <div
                className='flex items-center hover:cursor-pointer'
                onClick={() => setShowLearnMore((prev) => !prev)}
            >
                <BioType className='intake-subtitle text-black underline '>
                    {showLearnMore ? 'See less' : 'Learn more'}
                </BioType>
                {showLearnMore ? (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='25'
                        height='25'
                        viewBox='0 0 25 25'
                        fill='none'
                    >
                        <path
                            d='M18.5 15.4717L12.5 9.47168L6.5 15.4717'
                            stroke='#191919'
                            stroke-width='1.08919'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='25'
                        height='25'
                        viewBox='0 0 25 25'
                        fill='none'
                    >
                        <path
                            d='M6.5 9.47168L12.5 15.4717L18.5 9.47168'
                            stroke='#191919'
                            stroke-width='1.08919'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        />
                    </svg>
                )}
            </div>
        );
    }

    const renderTermsAndConditions = (
        priceData: Partial<ProductVariantRecord>
    ) => {
        const priceToPay = (
            Math.round(
                displayDiscountedPriceFirstTimeDosage(
                    priceData,
                    product_href as PRODUCT_HREF
                ) * 100
            ) / 100
        ).toFixed(2);

        const getDays = () => {
            if (priceData.cadence === SubscriptionCadency.Biannually) {
                return '180';
            } else if (priceData.cadence === SubscriptionCadency.Quarterly) {
                return '90';
            } else {
                return '30';
            }
        };

        const getPriceAfterFirstTime = () => {
            if (priceData.cadence === SubscriptionCadency.Monthly) {
                return displayTotalPriceFirstTimeDosage(
                    priceData,
                    order.product_href as PRODUCT_HREF
                );
            } else {
                return priceToPay;
            }
        };

        return (
            <div className='flex flex-col space-y-3'>
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} text-xs pt-2 !text-[#00000099]`}
                >
                    Prescription products require an evaluation with a licensed
                    medical professional who will determine if a prescription is
                    appropriate. By clicking confirm your request, you agree to
                    the{' '}
                    <Link
                        href='https://www.gobioverse.com/privacy-policy'
                        className='!text-[#286BA2] no-underline hover:underline'
                    >
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        href='https://www.gobioverse.com/privacy-policy'
                        className='!text-[#286BA2] no-underline hover:underline'
                    >
                        Privacy Policy
                    </Link>
                    . You also agree that, if prescribed, you will be charged $
                    {priceToPay} for your first {getDays()} days supply and $
                    {getPriceAfterFirstTime()} every {getDays()} days thereafter
                    until you cancel.
                </BioType>
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} text-xs  text-[#00000099]`}
                >
                    Ongoing shipments may be charged and shipped up to 2 days
                    early to accommodate holidays or other operational reasons
                    to support treatment continuity.
                </BioType>

                <BioType
                    className={`${INTAKE_INPUT_TAILWIND}  text-xs text-[#00000099]`}
                >
                    Your provider may recommend a different dosage amount, which
                    would chance the price. You will not be responsible for any
                    portion of this amount if you&apos;re not prescribed or if
                    you do not authorize it.
                </BioType>

                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} text-xs text-[#00000099]`}
                >
                    Your subscription will renew unless you cancel at least 2
                    days before the next processing date. You can view your
                    processing date and cancel your subscription(s) through your
                    online account or by contacting customer support at
                    support@gobioverse.com.
                </BioType>
            </div>
        );
    };

    const handleContinue = async () => {
        setButtonLoading(true);
        try {
            await processDosageSelectionFirstTimeRequest(order, priceData);
            router.push(`/dosage/first-time/confirmed`);
            setButtonLoading(false);
        } catch (error) {
            await logPatientAction(
                order.customer_uid,
                PatientActionTask.FIRST_TIME_DOSAGE_SELECTION_REQUESTED,
                { failure: 'On checkout' }
            );
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <>
            <div id='main-container' className={css_class_names.main_container}>
                <div
                    id='content-container'
                    className={css_class_names.content_container}
                >
                    <div
                        id='information-container'
                        className={css_class_names.information_container}
                    >
                        <div id='almost-done-text'>
                            <BioType className='intake-v3-18px-20px'>
                                You are almost done
                            </BioType>
                        </div>
                        <div
                            id='bv-images'
                            className='relative w-full h-[154px] md:h-[154px]'
                        >
                            <Image
                                src='/img/dosage-first-time/fem-headshot-background.png'
                                alt='doctors'
                                layout='fill'
                                objectFit='cover'
                                className='mx-auto'
                                unoptimized
                            />
                        </div>

                        <div>
                            <div className='h-[35px] sm:h-[31px] bg-[#FAFFB3] flex justify-center items-center rounded-t-xl rounded-b-none '>
                                <div className='flex items-center space-x-2 sm:space-x-3'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='w-[16px] h-[16px]'
                                        viewBox='0 0 25 25'
                                        fill='none'
                                    >
                                        <path
                                            d='M22.5 11.5467V12.4667C22.4988 14.6231 21.8005 16.7213 20.5093 18.4485C19.2182 20.1756 17.4033 21.4391 15.3354 22.0506C13.2674 22.662 11.0573 22.5886 9.03447 21.8412C7.01168 21.0939 5.28465 19.7128 4.11096 17.9037C2.93727 16.0947 2.37979 13.9547 2.52168 11.803C2.66356 9.65123 3.49721 7.60299 4.89828 5.96373C6.29935 4.32448 8.19279 3.18204 10.2962 2.70681C12.3996 2.23157 14.6003 2.449 16.57 3.32666M22.5 4.46667L12.5 14.4767L9.5 11.4767'
                                            stroke='black'
                                            stroke-opacity='1'
                                            stroke-width='1.01733'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                        />
                                    </svg>
                                    <BioType className='intake-v3-disclaimer-text text-[14px]'>
                                        FSA/HSA eligible for reimbursement
                                    </BioType>
                                </div>
                            </div>
                            <div id='treatment-details'>
                                <Paper
                                    elevation={4}
                                    className='flex flex-col mx-[0.4px] w-full rounded-lg'
                                >
                                    <div className='flex flex-col px-4 py-6 '>
                                        <div className='flex flex-col w-full '>
                                            <div className='flex w-full flex-col'>
                                                <div className='flex flex-col w-full'>
                                                    <BioType
                                                        className={`intake-subtitle-bold md:text-[20px] text-[16px]`}
                                                    >
                                                        {/* {profileData.first_name} */}
                                                        {patientData.first_name}
                                                        &apos;s treatment
                                                        details:
                                                    </BioType>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                                    ></BioType>
                                                </div>
                                            </div>

                                            <div
                                                className={`flex flex-col space-y-4 ${
                                                    priceData.cadence ===
                                                    SubscriptionCadency.Monthly
                                                        ? 'mt-3'
                                                        : 'my-3'
                                                }`}
                                            >
                                                <BioType
                                                    className={`inter text-sm text-[#0000000]`}
                                                >
                                                    {displayProductTitleFirstTimeDosage(
                                                        priceData,
                                                        product_href as PRODUCT_HREF
                                                    )}
                                                </BioType>

                                                {priceData.cadence !==
                                                    SubscriptionCadency.Monthly && (
                                                    <BioType
                                                        className={`inter text-sm text-weak`}
                                                    >
                                                        {displaySupplyTotalFirstTimeDosage(
                                                            priceData.cadence as SubscriptionCadency
                                                        )}
                                                    </BioType>
                                                )}
                                                <BioType
                                                    className={`inter text-sm text-weak`}
                                                >
                                                    {displayVialDescriptions(
                                                        priceData
                                                    )}
                                                </BioType>
                                                <BioType className='intake-subtitle-bold text-black'>
                                                    Weekly Dosage*
                                                </BioType>
                                                <BioType
                                                    className={`inter text-sm text-[#666666]`}
                                                >
                                                    {displayDosageInstructionsFirstTimeDosage(
                                                        priceData
                                                    )}
                                                </BioType>
                                            </div>

                                            {displayLearnMoreBiannual(
                                                priceData
                                            )}

                                            <div className='w-full h-[1px] my-[23px]'>
                                                <HorizontalDivider
                                                    backgroundColor={
                                                        '#1B1B1B1F'
                                                    }
                                                    height={1}
                                                />
                                            </div>

                                            {displaySavingsFirstTimeDosageFirstTimeDosage(
                                                priceData,
                                                product_href as PRODUCT_HREF
                                            ) != 0 && (
                                                <div className='bg-[#ccfbb6] w-full  rounded-md flex justify-center '>
                                                    <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md'>
                                                        You are saving $
                                                        {displaySavingsFirstTimeDosageFirstTimeDosage(
                                                            priceData,
                                                            product_href as PRODUCT_HREF
                                                        ).toFixed(2)}{' '}
                                                        with this plan
                                                    </BioType>
                                                </div>
                                            )}

                                            <div
                                                className={`flex justify-between items-center ${
                                                    priceData.cadence ===
                                                    SubscriptionCadency.Monthly
                                                        ? ''
                                                        : 'mb-4'
                                                } mt-3`}
                                            >
                                                <div className='w-[50%] md:w-full text-wrap'>
                                                    <BioType
                                                        className={`inter-h5-bold text-sm`}
                                                    >
                                                        Total
                                                    </BioType>
                                                </div>
                                                <div className='flex flex-row gap-1'>
                                                    <BioType
                                                        className={`inter-h5 text-[#D11E66] text-sm`}
                                                    >
                                                        <s>
                                                            $
                                                            {(
                                                                Math.round(
                                                                    displayTotalPriceFirstTimeDosage(
                                                                        priceData,
                                                                        product_href as PRODUCT_HREF
                                                                    ) * 100
                                                                ) / 100
                                                            ).toFixed(2)}
                                                        </s>
                                                    </BioType>

                                                    <BioType
                                                        className={`inter-h5-bold text-sm text-black`}
                                                    >
                                                        $
                                                        {displayDiscountedPriceFirstTimeDosage(
                                                            priceData,
                                                            product_href as PRODUCT_HREF
                                                        ).toFixed(2)}
                                                    </BioType>

                                                    {/* {priceData.cadence !==
                                                    'quarterly' &&
                                                    priceData.cadence !==
                                                        'biannually' && (
                                                        <BioType
                                                            className={`inter-h5-bold text-sm text-[#a3cc96]`}
                                                        >
                                                            $
                                                            {(
                                                                Math.round(
                                                                    displayTotalPrice() *
                                                                        100,
                                                                ) / 100
                                                            ).toFixed(2)}
                                                        </BioType>
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='w-full h-[1px] mt-5'>
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>
                                        <div className='flex justify-between mt-6'>
                                            <BioType
                                                className={`inter-h5-bold text-sm text-black`}
                                            >
                                                Due on{' '}
                                                {formatDateFullMonth(
                                                    new Date()
                                                )}
                                            </BioType>
                                            <BioType
                                                className={`inter-h5-bold text-sm text-black`}
                                            >
                                                ${' '}
                                                {displayDiscountedPriceFirstTimeDosage(
                                                    priceData,
                                                    product_href as PRODUCT_HREF
                                                ).toFixed(2)}
                                            </BioType>
                                        </div>
                                    </div>
                                </Paper>
                                <div className='bg-[#d7e3eb] w-full  rounded-md flex justify-center mt-6'>
                                    {priceData.cadence === 'quarterly' && (
                                        <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md '>
                                            Refills every 3 months, cancel
                                            anytime
                                        </BioType>
                                    )}

                                    {priceData.cadence === 'biannually' && (
                                        <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md '>
                                            Refills every 6 months, cancel
                                            anytime
                                        </BioType>
                                    )}

                                    {priceData.cadence === 'monthly' && (
                                        <BioType className='text-center intake-v3-disclaimer-text py-1  rounded-md '>
                                            Refills every month, cancel anytime
                                        </BioType>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        id='continue-button-container'
                        className={css_class_names.continue_button_container}
                    >
                        <Button
                            fullWidth
                            variant='contained'
                            sx={css_class_names.button_sx}
                            onClick={handleContinue}
                            className='normal-case inter-h5-bold text-sm'
                        >
                            {buttonLoading ? (
                                <CircularProgress
                                    size={22}
                                    sx={{ color: 'white' }}
                                />
                            ) : (
                                'Confirm Request'
                            )}
                        </Button>
                    </div>
                    {renderTermsAndConditions(priceData)}
                </div>
            </div>
        </>
    );
}
