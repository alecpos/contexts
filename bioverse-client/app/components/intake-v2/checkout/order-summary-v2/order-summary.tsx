'use client';
import { Divider, Paper } from '@mui/material';

import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import ContinueButton from '../../buttons/ContinueButton';
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
import { useState } from 'react';
import { continueButtonExitAnimation } from '../../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface Props {
    orderData: BaseOrder;
    priceData: Partial<ProductVariantRecord>;
}

export default function OrderSummaryV2({ orderData, priceData }: Props) {
    const params = useParams();
    const router = useRouter();
    const fullPath = usePathname();
    const searchParams = useSearchParams();
    const product_href = orderData.product_href;
    const lookupProductHref = orderData.metadata.selected_product
        ? PRODUCT_HREF.WEIGHT_LOSS
        : product_href;


    console.log("orderData", orderData);
    console.log("priceData", priceData);

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    //getImageRefUsingProductHref
    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref(product_href)
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

    const displayMonthlyVialInformation = () => {
        const multipleVials =
            priceData.price_data.vial_sizes &&
            priceData.price_data.vial_sizes.length > 1;
        const numVials = priceData.price_data.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text =
                priceData.price_data.vial_sizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index ===
                            priceData!.price_data.vial_sizes!.length - 1
                                ? ''
                                : ', '
                        }`;
                    })
                    .join('') || '';
        }

        const totalVialSize = sum(priceData.price_data.vial_sizes);

        switch (product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        {totalVialSize} mg {multipleVials ? '' : 'vial'}{' '}
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );

            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        {totalVialSize} mg {multipleVials ? '' : 'vial'}
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );
            case PRODUCT_HREF.METFORMIN:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        1,000mg/day or as prescribed
                    </BioType>
                );
        }
    };

    const displayVialsIncluded = () => {
        if (orderData.product_href === PRODUCT_HREF.METFORMIN) {
            return (
                <BioType
                    className={`md:itd-input it-body  md:!font-twcsemimedium`}
                >
                    90 day supply <span className='text-weak'>(1,000mg/day or as prescribed)</span>
                </BioType>
            );
        }
        if (priceData.cadence === 'quarterly') {
            return (
                <div className='flex flex-nowrap'>
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        {priceData.vial}
                    </BioType>
                    &nbsp;
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium flex-1`}
                    >
                        {' '}
                        ({priceData.price_data.vial_sizes.length} vials included
                        -{' '}
                        {priceData?.price_data.vial_sizes.map(
                            (vialSize: any, index: number) => {
                                return `${vialSize} mg${
                                    index ===
                                    (priceData?.price_data.vial_sizes.length ||
                                        0) -
                                        1
                                        ? ')'
                                        : ', '
                                }`;
                            }
                        )}
                    </BioType>
                </div>
            );
        }

        return displayMonthlyVialInformation();
    };

    const getImageHref = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '/img/intake/wl/metformin/metformin_lifestyle.png';
            case PRODUCT_HREF.TIRZEPATIDE:
                return '/img/intake/wl/tirzepatide/tirzepatide_lifestyle.png';
            default:
                return '/img/checkout/semaglutide-summary.png';
        }
    };

    const displayWeightlossDescription = () => {
        switch (orderData.product_href) {
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
        switch (orderData.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return 'Semaglutide';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Tirzepatide';
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin';
            default:
                return '';
        }
    };

    const displayProductPrice = () => {
        if (product_href === PRODUCT_HREF.METFORMIN) {
            return (
                priceData.price_data.product_price! -
                priceData.price_data.discount_price.discount_amount!
            );
        }
        if (priceData.cadence === 'quarterly') {
            return priceData.price_data.product_price;
        }
        return (
            priceData.price_data.product_price! -
            priceData.price_data.discount_price.discount_amount!
        );
    };

    const displaySavings = () => {
        if (priceData.cadence === 'quarterly' || priceData.cadence === 'biannually') {
            if (orderData.product_href === PRODUCT_HREF.METFORMIN) {
                return priceData.price_data.discount_price.discount_amount;
            }
            return priceData.price_data.savings.exact_total;
        } else {
            return priceData.price_data.discount_price.discount_amount;
        }
    };

    const handleContinue = async () => {
        setButtonLoading(true);
        try {
            const nextRoute = getNextIntakeRoute(
                fullPath,
                lookupProductHref,
                searchParams.toString(),
                false,
                'latest',
                PRODUCT_HREF.METFORMIN
            );

            const search = searchParams.toString();
            const searchParamsNew = new URLSearchParams(search);
            await continueButtonExitAnimation(150);
            router.push(
                `/intake/prescriptions/${lookupProductHref}/${nextRoute}?${searchParamsNew}`
            );
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div className='flex flex-col mt-2 animate-slideRight'>
                <BioType
                    className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary mb-2`}
                >
                    Based on your responses you may be eligible for:
                </BioType>

                <Paper elevation={4} className='flex flex-col mx-[0.4px] p-4'>
                    <BioType
                        className={`it-h1 !font-twcsemimedium text-[1.5rem] mb-1 md:mb-0`}
                    >
                        {displayProductName()}
                    </BioType>
                    <div className='flex flex-col space-y-[9px] mt-1'>
                        <BioType className='it-body md:itd-body flex mt-2'>
                            {/* {`${orderData.total_dosage}`}&nbsp; */}
                            {displayVialsIncluded()}
                        </BioType>
                        {displaySavings() !== 0 && (
                            <div className='bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center'>
                                <BioType className='text-black it-body md:itd-body'>
                                    You&apos;re saving $
                                    {displaySavings()?.toFixed(2)} with this
                                    plan.
                                </BioType>
                            </div>
                        )}
                        {/* <div className='w-full flex justify-between'>
                            <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                                Total, if prescribed:
                            </BioType>
                            <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                                ${displayProductPrice()?.toFixed(2)}
                            </BioType>
                        </div> */}
                    </div>
                    <div className='mx-auto mt-3 md:mt-4 relative w-[100%] md:w-[55%] aspect-[1.23] mb-1 md:mb-0'>
                        <Image
                            src={getImageHref()}
                            alt={'Semaglutide'}
                            fill
                            objectFit='cover'
                            unoptimized
                        />
                    </div>
                    <div className='flex flex-row justify-between items-end'>
                        <div className='md:w-[80%] w-[70%] '>
                            <div className='mb-1'>
                                <img
                                    className='h-5 w-5'
                                    alt={'Add circle'}
                                    src={`/img/intake/svg/add-circle.svg`}
                                />
                            </div>
                            <BioType className={`it-body !text-[1rem]`}>
                                Comes with medical support tailored to your
                                weight loss profile
                            </BioType>
                        </div>
                        <div className=' h-full relative flex items-end'>
                            <div className='bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-0'>
                                <img
                                    className='h-5 w-5'
                                    alt={'Stethoscope'}
                                    src={`/img/intake/svg/stethescope.svg`}
                                />
                            </div>

                            <div className='bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-2'>
                                <img
                                    className='h-5 w-5'
                                    alt={'Stethoscope'}
                                    src={`/img/intake/svg/stethescope.svg`}
                                />
                            </div>
                            <div className='bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-4'>
                                <img
                                    className='h-5 w-5'
                                    alt={'Stethoscope'}
                                    src={`/img/intake/svg/stethescope.svg`}
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
                <div className='bg-primary text-white  mx-auto text-center rounded-b-lg p-4 mb-6'>
                    <BioType className={`it-body`}>
                        You won&apos;t be charged until prescribed.
                    </BioType>
                </div>

                <BioType
                    className={`!text-primary it-subtitle !font-twcsemimedium mb-2`}
                >
                    Doctor-trusted ingredients, formulated to promote weight
                    loss
                </BioType>
                <Paper elevation={4} className='flex flex-col p-4 mb-6'>
                    <BioType
                        className={`it-subtitle !font-twcsemimedium text-primary mb-1`}
                    >
                        {displayProductName()}
                    </BioType>
                    <BioType className={`it-input !font-twcsemimedium mb-1`}>
                        Facilitates weight loss
                    </BioType>
                    <BioType className={`it-body  text-textSecondary`}>
                        {displayWeightlossDescription()}
                    </BioType>
                </Paper>
                <BioType
                    className={`!text-primary it-subtitle !font-twcsemimedium mb-2`}
                >
                    We&apos;re here to help every step of the way
                </BioType>
                <div className='w-full h-[140px] flex'>
                    <div className='relative flex-1 border-l-4 border-t-4 border-b-4 border-r-0 border-white border-solid rounded-sm bg-[#F4F4F4F4] overflow-hidden'>
                        <Image
                            src='/img/intake/doctor2.jpg'
                            fill
                            alt='Vial Image'
                            style={{
                                objectFit: 'cover',
                                objectPosition: '0px 0px',
                            }}
                            unoptimized
                        />
                    </div>
                    <div className='relative flex-1 border-4 border-white border-solid rounded-sm bg-[#F4F4F4F4] overflow-hidden'>
                        <Image
                            src='/img/intake/doctor.jpeg'
                            fill
                            alt='Vial Image'
                            style={{ objectFit: 'cover' }}
                            unoptimized
                        />
                    </div>
                </div>

                <Paper className='p-4 md:mb-[1.75rem] mb-[100px] mt-6'>
                    <div className='flex flex-row gap-2 mb-[.75rem]'>
                        <img
                            className='h-6 w-6'
                            alt={'Iphone icon'}
                            src={`/img/intake/svg/iphone.svg`}
                        />

                        <div className='flex flex-col gap-[.75rem]'>
                            <BioType
                                className={`text-primary it-subtitle !font-twcsemimedium`}
                            >
                                Ongoing check-ins
                            </BioType>
                            <BioType className={`text-textSecondary it-body`}>
                                We&apos;ll follow up regularly to see how
                                you&apos;re doing and progressing towards your
                                goals.
                            </BioType>
                        </div>
                    </div>
                    <Divider />
                    <div className='flex flex-row gap-2 my-[.75rem]'>
                        <img
                            className='h-6 w-6'
                            alt={'Chat bubble icon'}
                            src={`/img/intake/svg/chat-bubble.svg`}
                        />
                        <div className='flex flex-col gap-[.75rem]'>
                            <BioType
                                className={`text-primary it-subtitle !font-twcsemimedium`}
                            >
                                Unlimited messaging
                            </BioType>
                            <BioType className={`text-textSecondary it-body`}>
                                Message your care team at any time at no extra
                                cost.
                            </BioType>
                        </div>
                    </div>
                    <Divider className='' />
                    <div className='flex flex-row gap-2 mt-[.75rem]'>
                        <img
                            className='h-6 w-6'
                            alt={'Favorite icon'}
                            src={`/img/intake/svg/favorite.svg`}
                        />
                        <div className='flex flex-col gap-[.75rem]'>
                            <BioType
                                className={`text-primary it-subtitle !font-twcsemimedium`}
                            >
                                Free shipping
                            </BioType>
                            <BioType className={`text-textSecondary it-body`}>
                                We&apos;ll deliver every shipment right to your
                                door.
                            </BioType>
                        </div>
                    </div>
                </Paper>
                <div className=''>
                    <ContinueButton
                        onClick={handleContinue}
                        buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </>
    );
}
