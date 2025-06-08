'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
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

export default function AlmostDoneScreen({
    priceData,
    profileData,
    renewalOrder,
    subscriptionRenewalDate,
    selectedVariantIndex,
    patientData,
}: AlmostDoneScreenProps) {
    const router = useRouter();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    function displayTotalPrice() {
        if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
            return priceData.price_data.product_price!;
        }
        if (
            renewalOrder.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            renewalOrder.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (priceData.cadence === 'quarterly') {
                return priceData.price_data.savings.original_price!;
            } else {
                return priceData.price_data.product_price!;
            }
        }
        return 0;
    }

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
            if (priceData.cadence === 'quarterly') {
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

        if (priceData.cadence === 'quarterly') {
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
            }
            return `${priceData.variant} ${
                multipleVials ? `(${numVials} vials included - ${text})` : ''
            }`;
        } else {
            const vialSizes = priceData.price_data.vial_sizes;
            if (vialSizes && vialSizes.length > 1) {
                const text = vialSizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index === vialSizes.length - 1 ? '' : ', '
                        }`;
                    })
                    .join('');

                return `${priceData.vial} vial (${vialSizes.length} vials included - ${text})`;
            }
            return `${priceData.vial} vial`;
        }
    }
    function displayProductTitle() {
        if (renewalOrder.product_href === METFORMIN_PRODUCT_HREF) {
            return 'Metformin';
        } else if (
            renewalOrder.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            renewalOrder.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            return `${getProductName(
                renewalOrder.product_href
            )} Weekly Injections`;
        }

        return renewalOrder.product_href;
    }

    const displaySavings = () => {
        if (priceData.cadence === 'quarterly') {
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
        main_container:
            'flex flex-col gap-[28px] w-[90vw] md:w-[500px] items-center mt-10',
        content_container: 'flex flex-col gap-[16px] mb-10',
        information_container: 'flex flex-col gap-[16px]',

        bv_images: 'h-full max-w-[90vw]',

        continue_button_container:
            'md:static bottom-[25px] flex w-[90vw] mt-1 md:w-full',

        button_sx: {
            height: '52px',
            backgroundColor: '#000000',
            '&:hover': {
                backgroundColor: '#666666',
            },
        },
    };

    return (
        <>
            <div id='main-container' className={css_class_names.main_container}>
                <div className='flex flex-col items-start justify-start w-full'>
                    <Image
                        src={'/img/bioverse-logo-full.png'}
                        alt={'logo'}
                        width={170}
                        height={41}
                        unoptimized
                    />
                </div>

                <div
                    id='content-container'
                    className={css_class_names.content_container}
                >
                    <div
                        id='information-container'
                        className={css_class_names.information_container}
                    >
                        <div id='header-text'>
                            <BioType className='itd-subtitle text-[#00000099]'>
                                Monthly Check-in
                            </BioType>
                        </div>
                        <div
                            id='bv-images'
                            className={css_class_names.bv_images}
                        >
                            <div
                                className={`w-[35vw] md:w-[150px] z-10 relative aspect-[3/2] rounded-lg`}
                            >
                                <Image
                                    src={
                                        '/img/intake/up-next/female-doctor-head-cropped.png'
                                    }
                                    alt={'Scientist Image'}
                                    fill
                                    sizes='(max-width: 1440px) calc(100vw - 2 * ((100vw - 456px) / 2)), 100vw'
                                    className='z-40 border-4 border-white border-solid rounded-[28px]'
                                    unoptimized
                                />

                                <div className='ml-[18.6vw] md:ml-[100px] w-[35vw] md:w-[150px] z-30 absolute aspect-[3/2] rounded-lg'>
                                    <Image
                                        src={
                                            '/img/patient-portal/wl-checkout2.png'
                                        }
                                        fill
                                        sizes='(max-width: 360px) 327px, (max-width: 1440px) 550px, (max-width: 2560px) 768px, (max-width: 3840px) 1024px, 100vw'
                                        alt={`Product Image:`}
                                        style={{ objectFit: 'cover' }}
                                        priority
                                        className='border-4 border-white border-solid rounded-[28px]'
                                        unoptimized
                                    />
                                </div>
                                <div className='ml-[37.2vw] md:ml-[195px] w-[35vw] md:w-[150px] z-20 absolute aspect-[3/2] rounded-lg'>
                                    <Image
                                        src='/img/patient-portal/wl-checkout3.jpeg'
                                        fill
                                        alt={`Product Image`}
                                        style={{
                                            objectFit: 'fill',
                                            objectPosition: '30px 0',
                                        }} // Center the content of the image
                                        priority
                                        className='border-4 border-white border-solid rounded-[28px]'
                                        unoptimized
                                    />
                                </div>
                                <div className='ml-[55.8vw] md:ml-[275px] w-[35vw] md:w-[150px] z-10 absolute aspect-[3/2] rounded-lg'>
                                    <Image
                                        src={`https://pplhazgfonbrptwkzfbe.supabase.co/storage/v1/object/public/bioverse-images/product-images/semiglutide/semaglutide-review-mar-13.png`}
                                        fill
                                        sizes='(max-width: 360px) 327px, (max-width: 1440px) 550px, (max-width: 2560px) 768px, (max-width: 3840px) 1024px, 100vw'
                                        alt={`Product Image: semaglutide`}
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: '10px 0',
                                        }}
                                        priority
                                        unoptimized
                                        className='border-4 border-white border-solid rounded-[28px]'
                                    />
                                </div>
                            </div>
                        </div>
                        <div id='almost-done-text'>
                            <BioType className='itd-h1 text-primary'>
                                You&apos;re almost done
                            </BioType>
                        </div>
                        <div id='treatment-details'>
                            <Paper
                                elevation={4}
                                className='flex flex-col mx-[0.4px] w-full'
                            >
                                <div className='flex flex-col p-6 md:p-6 gap-6'>
                                    <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                                        <div className='flex gap-4 w-full flex-col'>
                                            <div className='flex flex-col w-full'>
                                                <Chip
                                                    variant='filled'
                                                    size='medium'
                                                    label={`You won’t be charged until prescribed`}
                                                    sx={{
                                                        marginX: 'auto',
                                                        background:
                                                            'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                                        color: 'white', // Optional: Set text color to white for better visibility
                                                    }}
                                                />
                                            </div>

                                            <div className='flex flex-col w-full'>
                                                <BioType
                                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                                >
                                                    {profileData.first_name}
                                                    &apos;s Treatment
                                                </BioType>
                                                <BioType
                                                    className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                                ></BioType>
                                            </div>
                                        </div>

                                        <div>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#0000000]`}
                                            >
                                                {displayProductTitle()}
                                            </BioType>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                            >
                                                {displayVialInformation()}
                                            </BioType>
                                        </div>

                                        <div className='w-full h-[1px] my-1'>
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>

                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            {priceData.cadence === 'quarterly'
                                                ? 'Supply ships every 3 months'
                                                : 'Supply ships every month'}
                                            . Cancel anytime.
                                        </BioType>

                                        <div className='w-full h-[1px] my-1'>
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>

                                        {priceData.cadence === 'quarterly' &&
                                            displaySavings() != 0 && (
                                                <div className='bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center'>
                                                    <BioType className='text-black it-body md:itd-body'>
                                                        You&apos;re saving $
                                                        {displaySavings()?.toFixed(
                                                            2
                                                        )}{' '}
                                                        with this plan.
                                                    </BioType>
                                                </div>
                                            )}

                                        <div className='flex justify-between items-center mb-4'>
                                            <div className='w-[50%] md:w-full text-wrap'>
                                                <BioType
                                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                >
                                                    Total
                                                </BioType>
                                            </div>
                                            <div className='flex flex-row gap-1'>
                                                {priceData.cadence ===
                                                    'quarterly' && (
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#00000099]`}
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

                                                {priceData.cadence ===
                                                    'quarterly' && (
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
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
                                                    'quarterly' && (
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
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

                                        <Chip
                                            variant='filled'
                                            size='medium'
                                            label={`Refills every month, cancel anytime`}
                                            sx={{
                                                marginX: 'auto',
                                                background:
                                                    'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                                color: 'white', // Optional: Set text color to white for better visibility
                                            }}
                                        />
                                    </div>

                                    <div className='w-full h-[1px] my-1'>
                                        <HorizontalDivider
                                            backgroundColor={'#1B1B1B1F'}
                                            height={1}
                                        />
                                    </div>
                                    <div className='flex justify-between'>
                                        <BioType
                                            className={`itd-body font-[16px] text-black`}
                                        >
                                            DUE ON {subscriptionRenewalDate}
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-black`}
                                        >
                                            $
                                            {priceData.cadence ===
                                                'quarterly' &&
                                                (
                                                    Math.round(
                                                        displayDiscountedPrice() *
                                                            100
                                                    ) / 100
                                                ).toFixed(2)}
                                            {priceData.cadence !==
                                                'quarterly' &&
                                                (
                                                    Math.round(
                                                        displayTotalPrice() *
                                                            100
                                                    ) / 100
                                                ).toFixed(2)}
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
