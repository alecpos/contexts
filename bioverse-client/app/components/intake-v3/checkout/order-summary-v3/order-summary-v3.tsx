'use client';
import { Divider } from '@mui/material';

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
import { INTAKE_INPUT_TAILWIND } from '../../styles/intake-tailwind-declarations';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { BaseOrder } from '@/app/types/orders/order-types';
import { sum } from 'lodash';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';
import { continueButtonExitAnimation } from '../../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';

const scrollbarHideStyle = {
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
} as React.CSSProperties;

interface Props {
    orderData: BaseOrder;
    priceData: Partial<ProductVariantRecord>;
}

export default function OrderSummaryV2({ orderData, priceData }: Props) {
    const router = useRouter();
    const fullPath = usePathname();
    const searchParams = useSearchParams();
    const product_href = orderData.product_href;
    const lookupProductHref = orderData.metadata.selected_product
        ? PRODUCT_HREF.WEIGHT_LOSS
        : product_href;

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
                    <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                        {totalVialSize} mg {multipleVials ? '' : 'vial'}{' '}
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );

            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                        {totalVialSize} mg {multipleVials ? '' : 'vial'}
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );
            case PRODUCT_HREF.METFORMIN:
                return (
                    <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                        1,000 mg/day or as prescribed
                    </BioType>
                );
        }
    };

    const displayVialsIncluded = () => {
        if (orderData.product_href === PRODUCT_HREF.METFORMIN) {
            return (
                <BioType className={`intake-subtitle  w-fit`}>
                    <span className='text-black'>90 day supply </span>(1,000
                    mg/day or as prescribed)
                </BioType>
            );
        }

        if (orderData.product_href === PRODUCT_HREF.WL_CAPSULE) {
            return (
                <div className='flex flex-row justify-between w-full'>
                    <BioType className={`intake-v3-form-label`}>
                        <span className='text-black'>
                            Total, if prescribed:{' '}
                        </span>
                    </BioType>
                    <BioType
                        className={`intake-v3-form-label-bold text-[#000000E5]`}
                    >
                        ${displayProductPrice()?.toFixed(2)}
                    </BioType>
                </div>
            );
        }
        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually' ||
            priceData.cadence === 'annually'
        ) {
            return (
                <div className='flex flex-wrap'>
                    <BioType className={`inter-tight w-fit`}>
                        {priceData.vial}
                    </BioType>
                    &nbsp;
                    <BioType className={`inter-tight`}>
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
                return '/img/intake/wl/tirzepatide/clear-tirzepatide-syringe-cropped.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return '/img/intake/wl/wl-capsule.png';
            default:
                return '/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png';
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
            case PRODUCT_HREF.WL_CAPSULE:
                return 'Bioverse Weight Loss Capsule';
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
        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually' ||
            priceData.cadence === 'annually'
        ) {
            return priceData.price_data.product_price;
        }
        return (
            priceData.price_data.product_price! -
            priceData.price_data.discount_price.discount_amount!
        );
    };

    const displaySavings = () => {
        
            
        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually' ||
            priceData.cadence === 'annually'
        ) {
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
                product_href //passing in metformin here tells the intake-route-controller to skip the next route (wl-reviews)...
                //...only if the funnel is global-wl. For other funnels it has no effect
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

    const doctor_image_ref = localStorage
        .getItem('vwo_ids')
        ?.includes(AB_TESTS_IDS.WL_RO_TEST)
        ? 'female-doctor-ro-test.png'
        : 'aiDoctor.jpg';
    return (
        <>
            <div className='flex flex-col justify-center items-center w-screen overflow-x-hidden '>
                <div className='flex flex-col animate-slideRight mt-[2.06rem] md:mt-[33px] w-full md:max-w-[490px] mx-auto'>
                    <div className='flex flex-col items-center w-5/6 mx-auto'>
                        <p
                            className={`inter-h5-question-header mb-[1.25rem] md:mb-[20px]  `}
                        >
                            Based on your responses you may be eligible for:
                        </p>
                    </div>

                    <div className=' md:w-[447px] mx-auto w-5/6 '>
                        <div className='flex flex-col    p-[2rem] md:p-[32px] rounded-xl border-[1px] border-solid border-[#dbd1d1] bg-white'>
                            {displaySavings() !== 0 && (
                                <div className='bg-[#ccfbb6] w-full py-0.5 px-1 rounded-md flex justify-center'>
                                    <BioType className='intake-v3-form-label'>
                                        Limited time: Unlock $
                                        {displaySavings()?.toFixed(0)} today
                                    </BioType>
                                </div>
                            )}
                            <div className='mx-auto mt-4 relative w-full aspect-[1.23] mb-4 h-[190px] md:h-[250px] '>
                                <Image
                                    src={getImageHref()}
                                    alt={'Medicine Vial'}
                                    fill
                                    objectFit='contain'
                                    
                                />
                            </div>
                            <BioType
                                className={`intake-v3-form-label-bold mb-1 md:mb-0`}
                            >
                                {displayProductName()}
                            </BioType>
                            <div className='flex flex-col space-y-[9px] mt-1'>
                                <BioType className='intake-subtitle mt-2'>
                                    {/* {`${orderData.total_dosage}`}&nbsp; */}
                                    {displayVialsIncluded()}
                                </BioType>
                            </div>

                            <Divider className='w-full bg-slate-300 h-[.5px] my-3' />

                            <div className='flex flex-row justify-between items-end'>
                                <div className=''>
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
                    <div className='w-full mb-4'>
                        <div className='h-[1.25rem] md:h-[20px] flex flex-col justify-center w-fit px-3 py-1 rounded-b-lg bg-gradient-to-r from-cyan-200 to-pink-200 text-slate-600 intake-v3-disclaimer-text  mx-auto'>
                            You won&apos;t be charged until prescribed.
                        </div>
                    </div>

                    {product_href !== PRODUCT_HREF.METFORMIN &&
                        product_href !== PRODUCT_HREF.WL_CAPSULE && (
                            <p
                                className={`intake-v3-18px-20px  mt-[2rem] md:mt-[32px] w-5/6 mx-auto`}
                            >
                                Doctor-trusted ingredients, formulated with the
                                same active ingredient as Ozempic® and Wegovy®
                            </p>
                        )}

                    {product_href === PRODUCT_HREF.WL_CAPSULE && (
                        <p
                            className={`intake-v3-18px-20px  mt-[2rem] md:mt-[32px] w-5/6 mx-auto`}
                        >
                            Doctor-trusted medication and clinically-proven
                            weight loss results
                        </p>
                    )}
                </div>

                {product_href === PRODUCT_HREF.WL_CAPSULE && (
                    <div className='w-[100%] flex flex-col justify-center mt-[3rem] md:mt-[48px] pl-[3rem] md:pl-24 md:mx-auto '>
                        <div className='w-full flex justify-center items-center relative '>
                            <div className='w-full max-w-screen overflow-hidden h-[21.9rem]  md:h-[350px]  items-center'>
                                <div
                                    className='flex flex-row gap-4 overflow-x-scroll w-full h-[21.9rem] md:h-[350px] md:justify-center [&::-webkit-scrollbar]:hidden'
                                    style={scrollbarHideStyle}
                                >
                                    <div className='w-10 hidden sm:block lg:hidden'></div>

                                    <div
                                        className='border border-slate-400 rounded-xl p-4 flex-shrink-0 w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px]  md:ml-48'
                                        style={{
                                            border: '1.4px solid #dbd1d1',
                                        }}
                                    >
                                        <p className='intake-v3-18px-20px-bold'>
                                            Bupropion HCl
                                        </p>
                                        <p className='intake-subtitle mt-2'>
                                            Bupropion can help with weight loss
                                            by reducing hunger and cravings, and
                                            increasing energy levels. This
                                            medication can be combined with a
                                            reduced-calorie diet and exercise to
                                            help with weight loss and
                                            maintenance.
                                        </p>
                                    </div>
                                    <div
                                        className='border border-slate-400 rounded-xl p-4 flex-shrink-0  w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px]'
                                        style={{
                                            border: '1.4px solid #dbd1d1',
                                            maxWidth: '15rem',
                                        }}
                                    >
                                        <p className='intake-v3-18px-20px-bold'>
                                            Naltrexone HCl
                                        </p>
                                        <p className='intake-subtitle  mt-2'>
                                            Naltrexone HCl can work to suppress
                                            your appetite and break the cycle of
                                            elevated insulin and weight gain.
                                            When combined with Buproprion HCl,
                                            these medications will suppress
                                            sugar and carb cravings.
                                        </p>
                                    </div>
                                    <div
                                        className='border border-slate-400 rounded-xl p-4 flex-shrink-0 mr-10  w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px] md:mr-36'
                                        style={{
                                            border: '1.4px solid #dbd1d1',
                                            maxWidth: '15rem',
                                        }}
                                    >
                                        <p className='intake-v3-18px-20px-bold'>
                                            Topiramate
                                        </p>
                                        <p className='intake-subtitle mt-2'>
                                            Topiramate can be prescribed
                                            off-label to aid in weight loss.
                                            appetite suppression (reduced
                                            calorie intake), preventing the body
                                            from storing excess fat, and
                                            lowering some fat and cholesterol
                                            levels.
                                        </p>
                                    </div>

                                    <div className='w-10  lg:hidden'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {product_href !== PRODUCT_HREF.METFORMIN &&
                    product_href !== PRODUCT_HREF.WL_CAPSULE && (
                        <div className='w-[100%] flex flex-col justify-center mt-[3rem] md:mt-[48px] pl-[3rem] md:pl-24 md:mx-auto '>
                            <div className='w-full flex justify-center items-center relative '>
                                <div className='w-full max-w-screen overflow-hidden h-[21.9rem]  md:h-[350px]  items-center'>
                                    <div
                                        className='flex flex-row gap-4 overflow-x-scroll w-full h-[21.9rem] md:h-[350px] md:justify-center [&::-webkit-scrollbar]:hidden'
                                        style={scrollbarHideStyle}
                                    >
                                        <div className='w-10 hidden sm:block lg:hidden'></div>

                                        <div
                                            className='border border-slate-400 rounded-xl p-4 flex-shrink-0 w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px]  md:ml-48 bg-white'
                                            style={{
                                                border: '1.4px solid #dbd1d1',
                                            }}
                                        >
                                            <p className='intake-v3-18px-20px-bold'>
                                                What is it?
                                            </p>
                                            <p className='intake-subtitle mt-2'>
                                                Compounded semaglutide, or GLP-1
                                                is a prescription medication
                                                injected weekly to help people
                                                lose weight.
                                            </p>
                                            <p className='intake-subtitle mt-2'>
                                                BIOVERSE offers the base form of
                                                compounded semaglutide, not the
                                                sodium or acetate versions.
                                            </p>
                                        </div>
                                        <div
                                            className='border border-slate-400 rounded-xl p-4 flex-shrink-0  w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px] bg-white'
                                            style={{
                                                border: '1.4px solid #dbd1d1',
                                                maxWidth: '15rem',
                                            }}
                                        >
                                            <p className='intake-v3-18px-20px-bold'>
                                                How does it work?
                                            </p>
                                            <p className='intake-subtitle  mt-2'>
                                                Compounded semaglutide enhances
                                                the effects of GLP-1, a
                                                naturally occurring hormone in
                                                the body. This hormone lowers
                                                blood sugar levels and slows how
                                                quickly the stomach empties,
                                                helping you feel fuller sooner
                                                and for longer.
                                            </p>
                                        </div>
                                        <div
                                            className='border border-slate-400 rounded-xl p-4 flex-shrink-0 mr-10  w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px] md:mr-36 bg-white'
                                            style={{
                                                border: '1.4px solid #dbd1d1',
                                                maxWidth: '15rem',
                                            }}
                                        >
                                            <p className='intake-v3-18px-20px-bold'>
                                                Is it safe?
                                            </p>
                                            <p className='intake-subtitle mt-2'>
                                                Weight loss specialists
                                                frequently prescribe compounded
                                                semaglutide, which contains the
                                                same active ingredient as
                                                Ozempic® and Wegovy®.
                                            </p>
                                            <p className='intake-subtitle  mt-2'>
                                                BIOVERSE partners with licensed
                                                compounding pharmacies that are
                                                regulated by the FDA.
                                            </p>
                                        </div>

                                        <div className='w-10  lg:hidden'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                <div className='flex flex-col w-5/6 md:max-w-[490px]  md:mx-auto'>
                    <p
                        className={`intake-v3-18px-20px mt-[1rem] md:mt-[20px] mb-[1.25rem] md:mb-[20px] `}
                    >
                        We&apos;re here to help every step of the way
                    </p>
                    <div className='w-full h-[210px] flex'>
                        <div className='relative flex-1 rounded-t-lg   bg-[#F4F4F4F4] overflow-hidden'>
                            <Image
                                src={`/img/intake/wl/${doctor_image_ref}`}
                                fill
                                className='rounded-t-lg '
                                alt='Vial Image'
                                style={{ objectFit: 'cover' }}
                                unoptimized
                            />
                        </div>
                    </div>

                    <div
                        className='p-6 md:mb-[1.75rem] mb-[100px] rounded-b-lg'
                        style={{ border: '1px solid #dbd1d1' }}
                    >
                        <div className='flex flex-row gap-2 mb-[.75rem]'>
                            <div className='flex flex-col gap-[.75rem]'>
                                <img
                                    src='/img/intake/wl/phone.svg'
                                    alt='phone'
                                    className='w-6 h-6'
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
                        <div className='flex flex-row gap-2 my-[1rem]'>
                            <div className='flex flex-col gap-[.75rem]'>
                                <img
                                    src='/img/intake/wl/chatBubble.svg'
                                    alt='phone'
                                    className='w-6 h-6'
                                />

                                <BioType className={`intake-v3-18px-20px-bold`}>
                                    Unlimited messaging
                                </BioType>
                                <BioType className={`intake-v3-form-label`}>
                                    Connect with your provider and your Care
                                    Team as much as you&apos;d like - at no
                                    extra charge!
                                </BioType>
                            </div>
                        </div>
                        <Divider className='' />
                        <div className='flex flex-row gap-2 mt-[.75rem]'>
                            <div className='flex flex-col gap-[.75rem]'>
                                <img
                                    src='/img/intake/wl/box.svg'
                                    alt='phone'
                                    className='w-6 h-6 mt-1'
                                />

                                <BioType className={`intake-v3-18px-20px-bold`}>
                                    Free shipping
                                </BioType>
                                <BioType className={`intake-v3-form-label`}>
                                    Every BIOVERSE treatment arrives directly to
                                    your doorstep.
                                </BioType>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center relative w-full'>
                        <ContinueButton
                            onClick={handleContinue}
                            buttonLoading={buttonLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
