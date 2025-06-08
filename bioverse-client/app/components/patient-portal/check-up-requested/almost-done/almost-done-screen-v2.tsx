'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import { onAlmostDoneScreenSubmit } from '@/app/services/pharmacy-integration/util/utils';
import {
    METFORMIN_PRODUCT_HREF,
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { getProductName } from '@/app/utils/functions/formatting';
import { Button, Chip, CircularProgress, Paper } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AlmostDoneScreenProps {
    priceData: Partial<ProductVariantRecord>;
    profileData: any;
    renewalOrder: DBOrderData;
    subscriptionRenewalDate: string;
    selectedVariantIndex: string;
    patientData: DBPatientData;
}

export default function AlmostDoneScreenV2({
    priceData,
    profileData,
    renewalOrder,
    subscriptionRenewalDate,
    selectedVariantIndex,
    patientData,
}: AlmostDoneScreenProps) {
    const router = useRouter();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    //need to make sure priceData is accurate for biannual
    function displayTotalPrice() {
        if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
            return priceData.price_data.product_price!;
        }
        if (
            renewalOrder.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            renewalOrder.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (
                priceData.cadence === 'quarterly' ||
                priceData.cadence === 'biannually' ||
                priceData.cadence === 'annually'
            ) {
                return priceData.price_data.savings.original_price!;
            } else {
                return priceData.price_data.product_price!;
            }
        }
        return 0;
    }

    //need to make sure priceData is accurate for biannual
    function displayDiscountedPrice() {
        if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
            return (
                priceData.price_data.product_price! -
                priceData.price_data.discount_price.discount_amount!
            );
        }
        if (
            renewalOrder.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            renewalOrder.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (
                priceData.cadence === 'quarterly' ||
                priceData.cadence === 'biannually' ||
                priceData.cadence === 'annually'
            ) {
                return priceData.price_data.product_price!;
            } else {
                return (
                    priceData.price_data.product_price! -
                    priceData.price_data.discount_price.discount_amount!
                );
            }
        }
        return 0;
    }

    function displayVialInformation() {
        const multipleVials =
            priceData.price_data.vial_sizes &&
            priceData.price_data.vial_sizes.length > 1;

        if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
            return null;
        }

        const numVials = priceData.price_data.vial_sizes?.length || 0;
        let text: any = '';
        if (multipleVials) {
            text = priceData.price_data.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === numVials - 1 ? '' : ', '
                    }`;
                })
                .join('');
            return ` ${
                //if there are multiple vials included
                multipleVials ? `(${numVials} vials included - ${text})` : ''
            }`;
        } else {
            //if there's only one vial included
            return `One ${priceData.vial} vial included`;
        }
    }

    function displayProductTitle() {
        if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
            return 'Metformin';
        } else if (
            renewalOrder.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            renewalOrder.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            return `${getProductName(renewalOrder.product_href)} ${
                priceData.vial
            }`;
        }

        return renewalOrder.product_href;
    }

    const displaySavings = () => {
        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually' ||
            priceData.cadence === 'annually'
        ) {
            if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
                return (
                    priceData.price_data?.discount_price?.discount_amount ?? 0
                );
            }
            return priceData.price_data?.savings?.exact_total ?? 0;
        } else {
            return priceData.price_data?.discount_price?.discount_amount ?? 0;
        }
    };

    const onSubmit = async () => {
        setButtonLoading(true);

        try {
            await onAlmostDoneScreenSubmit(
                renewalOrder,
                Number(selectedVariantIndex),
                patientData,
                priceData,
                'patient'
            );
        } catch (error) {
            console.error('Something wrong happened', error);
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id ?? renewalOrder.id,
                patientData.id,
                `Error on almost done screen submit ${error}`
            );
        } finally {
            router.push(
                `/dosage-selection/${renewalOrder.product_href}/confirmed`
            );
            setButtonLoading(false);
        }
    };

    const css_class_names = {
        main_container: 'flex flex-col gap-[28px] w-[90vw]  items-center mt-10',
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
                        <div id='header-text'>
                            <BioType className='inter-h5-question-header'>
                                Monthly Check-in
                            </BioType>
                        </div>
                        <div
                            id='bv-images'
                            className={css_class_names.bv_images}
                        >
                            <div className='relative w-full h-[10rem] md:h-[180px]'>
                                <Image
                                    src='/img/intake/wl/aiDoctor.jpg'
                                    alt='doctors'
                                    layout='fill'
                                    objectFit='cover'
                                    className='mx-auto rounded-xl'
                                    unoptimized
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: '-0px -30px',
                                    }}
                                />
                            </div>
                        </div>
                        <div id='almost-done-text'>
                            <BioType className='intake-v3-18px-20px'>
                                You are almost done
                            </BioType>
                        </div>
                        <div id='treatment-details'>
                            <Paper
                                elevation={4}
                                className='flex flex-col mx-[0.4px] w-full rounded-lg'
                            >
                                <div className='flex flex-col px-4 py-6 '>
                                    <div className='flex flex-col w-full '>
                                        <div className='flex w-full flex-col'>
                                            <div className='flex flex-col w-full text-center bg-[#d7e3eb] text-center intake-v3-disclaimer-text py-2 rounded-md'>
                                                You won&apos;t be charged until
                                                prescribed
                                            </div>

                                            <div className='flex flex-col w-full mt-5'>
                                                <BioType
                                                    className={`intake-subtitle-bold `}
                                                >
                                                    {profileData.first_name}
                                                    &apos;s Treatment
                                                </BioType>
                                                <BioType
                                                    className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                                ></BioType>
                                            </div>
                                        </div>

                                        <div className='my-3'>
                                            <p
                                                className={`inter text-sm text-[#0000000]`}
                                            >
                                                {displayProductTitle()}
                                            </p>
                                            <p
                                                className={`inter text-sm text-[#666666]`}
                                            >
                                                {displayVialInformation()}
                                            </p>
                                        </div>

                                        <div className='w-full h-[1px] my-1'>
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>

                                        <BioType
                                            className={`inter-h5-regular text-sm my-4 text-center`}
                                        >
                                            {(() => {
                                                switch (priceData.cadence) {
                                                    case 'quarterly':
                                                        return 'Supply ships every 3 months';
                                                    case 'biannually':
                                                        return 'Supply ships every 6 months';
                                                    case 'monthly':
                                                        return 'Supply ships every month';
                                                    case 'annually':
                                                        return 'Supply ships every 6 months';
                                                    default:
                                                        return 'Supply ships at regular intervals';
                                                }
                                            })()}
                                            . Cancel anytime.
                                        </BioType>

                                        <div className='w-full h-[1px] mt-1 mb-4'>
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>

                                        {(priceData.cadence === 'quarterly' ||
                                            priceData.cadence ===
                                                'biannually' ||
                                            priceData.cadence === 'annually') &&
                                            displaySavings() != 0 && (
                                                <div className='bg-[#ccfbb6] w-full  rounded-md flex justify-center '>
                                                    <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md'>
                                                        You&apos;re saving $
                                                        {displaySavings()?.toFixed(
                                                            2
                                                        )}{' '}
                                                        with this plan
                                                    </BioType>
                                                </div>
                                            )}

                                        <div className='flex justify-between items-center mb-4 mt-3'>
                                            <div className='w-[50%] md:w-full text-wrap'>
                                                <BioType
                                                    className={`inter-h5-bold text-sm`}
                                                >
                                                    Total
                                                </BioType>
                                            </div>
                                            <div className='flex flex-row gap-1'>
                                                {(priceData.cadence ===
                                                    'quarterly' ||
                                                    priceData.cadence ===
                                                        'biannually' ||
                                                    priceData.cadence ===
                                                        'annually') && (
                                                    <BioType
                                                        className={`inter-h5-bold text-[#666666] text-sm`}
                                                    >
                                                        <s>
                                                            $
                                                            {(
                                                                Math.round(
                                                                    displayTotalPrice() *
                                                                        100
                                                                ) / 100
                                                            ).toFixed(2)}
                                                        </s>
                                                    </BioType>
                                                )}

                                                {(priceData.cadence ===
                                                    'quarterly' ||
                                                    priceData.cadence ===
                                                        'biannually' ||
                                                    priceData.cadence ===
                                                        'annually') && (
                                                    <BioType
                                                        className={`inter-h5-bold text-sm text-[#a3cc96]`}
                                                    >
                                                        $
                                                        {(
                                                            Math.round(
                                                                displayDiscountedPrice() *
                                                                    100
                                                            ) / 100
                                                        ).toFixed(2)}
                                                    </BioType>
                                                )}
                                                {priceData.cadence !==
                                                    'quarterly' &&
                                                    priceData.cadence !==
                                                        'biannually' &&
                                                    priceData.cadence !==
                                                        'annually' && (
                                                        <BioType
                                                            className={`inter-h5-bold text-sm text-[#a3cc96]`}
                                                        >
                                                            $
                                                            {(
                                                                Math.round(
                                                                    displayTotalPrice() *
                                                                        100
                                                                ) / 100
                                                            ).toFixed(2)}
                                                        </BioType>
                                                    )}
                                            </div>
                                        </div>

                                        <div className='bg-[#d7e3eb] w-full  rounded-md flex justify-center'>
                                            {priceData.cadence ===
                                                'annually' && (
                                                <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md '>
                                                    Refills every 6 months,
                                                    cancel anytime
                                                </BioType>
                                            )}

                                            {priceData.cadence ===
                                                'quarterly' && (
                                                <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md '>
                                                    Refills every 3 months,
                                                    cancel anytime
                                                </BioType>
                                            )}

                                            {priceData.cadence ===
                                                'biannually' && (
                                                <BioType className='text-center intake-v3-disclaimer-text py-1 rounded-md '>
                                                    Refills every 6 months,
                                                    cancel anytime
                                                </BioType>
                                            )}

                                            {priceData.cadence ===
                                                'monthly' && (
                                                <BioType className='text-center intake-v3-disclaimer-text py-1  rounded-md '>
                                                    Refills every month, cancel
                                                    anytime
                                                </BioType>
                                            )}
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
                                            Due on {subscriptionRenewalDate}
                                        </BioType>
                                        <BioType
                                            className={`inter-h5-bold text-sm text-black`}
                                        >
                                            $
                                            {(priceData.cadence ===
                                                'quarterly' ||
                                                priceData.cadence ===
                                                    'biannually' ||
                                                priceData.cadence ===
                                                    'annually') &&
                                                (
                                                    Math.round(
                                                        displayDiscountedPrice() *
                                                            100
                                                    ) / 100
                                                ).toFixed(2)}
                                            {priceData.cadence !==
                                                'quarterly' &&
                                                priceData.cadence !==
                                                    'biannually' &&
                                                priceData.cadence !==
                                                    'annually' &&
                                                (
                                                    Math.round(
                                                        displayTotalPrice() *
                                                            100
                                                    ) / 100
                                                ).toFixed(2)}
                                        </BioType>
                                    </div>

                                    <div className=' w-full flex justify-center mt-6'>
                                        <BioType className='text-center inter-h5-regular text-sm text-[#666666]  '>
                                            You&apos;ll only be charged if
                                            prescribed
                                        </BioType>
                                    </div>
                                </div>
                            </Paper>
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
                            onClick={onSubmit}
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
                </div>
            </div>
        </>
    );
}
