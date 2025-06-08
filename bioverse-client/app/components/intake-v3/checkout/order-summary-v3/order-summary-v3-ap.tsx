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
import styles from './order-summary.module.css';
const scrollbarHideStyle = {
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
} as React.CSSProperties;

interface Props {
    orderData: BaseOrder;
    priceData: Partial<ProductVariantRecord>;
}

export default function OrderSummaryV2({ orderData, priceData }: Props) {
    console.log('[OrderSummaryV3-AP] orderData:', orderData);
    console.log('[OrderSummaryV3-AP] priceData:', priceData);
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
        // Special handling for NAD injection
        if (product_href === PRODUCT_HREF.NAD_INJECTION) {
            return (
                <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                    500mg vial
                </BioType>
            );
        }

        // Special handling for sermorelin
        if (product_href === 'sermorelin') {
            return null;
        }

        // Add null check for vial_sizes
        if (!priceData?.price_data?.vial_sizes) {
            return null;
        }

        const multipleVials = priceData.price_data.vial_sizes.length > 1;
        const numVials = priceData.price_data.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text = priceData.price_data.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === priceData.price_data.vial_sizes.length - 1
                            ? ''
                            : ', '
                    }`;
                })
                .join('');
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
            default:
                return null;
        }
    };

    const displayVialsIncluded = () => {
        const supplyText = (() => {
          if (product_href === 'sermorelin') {
            const st = searchParams.get('st');
            if (st === 'quarterly') return '3 month supply. Shipped quarterly';
            if (st === 'semi-annually') return '6 month supply. Shipped semi-annually';
            return '1 month supply. Shipped monthly';
          }
      
          if (orderData.product_href === PRODUCT_HREF.METFORMIN) {
            return '90 day supply (1,000 mg/day or as prescribed)';
          }
      
          if (
            orderData.product_href === PRODUCT_HREF.WL_CAPSULE ||
            orderData.product_href === PRODUCT_HREF.NAD_INJECTION
          ) {
            return sermorelinSupplyText; // fallback text set higher up
          }
      
          if (
            priceData?.cadence === 'quarterly' ||
            priceData?.cadence === 'biannually' ||
            priceData?.cadence === 'annually'
          ) {
            const sizes = priceData.price_data?.vial_sizes || [];
            return `${sizes.length} vials included - ${sizes.join(', ')} mg`;
          }
      
          return null;
        })();
      
        const show = !!supplyText;
      
        return show ? (
          <div className="flex flex-col items-start gap-[0.75rem] w-full">
            {/* Product Name */}
            <span className="inter_body_medium_bold text-black text-[1rem] leading-[1.25rem]">
              {displayProductName()}
            </span>
      
            {/* Supply Description */}
            <span className="inter_body_regular text-[rgba(51,51,51,0.75)] text-[0.875rem] leading-[1.125rem]">
              {supplyText}
            </span>
      
            {/* Price Row */}
            <div className="flex flex-row justify-between items-center w-full">
              <span className="inter_body_medium_regular text-black text-[1rem] leading-[1.25rem]">
                Total, if prescribed:
              </span>
              <span className="inter_body_medium_bold text-black text-[1rem] leading-[1.25rem]">
                ${displayProductPrice()?.toFixed(2)}
              </span>
            </div>
          </div>
        ) : null;
      };
      
    const getImageHref = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '/img/intake/wl/metformin/metformin_lifestyle.png';
            case PRODUCT_HREF.TIRZEPATIDE:
                return '/img/intake/wl/tirzepatide/clear-tirzepatide-syringe-cropped.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return '/img/intake/wl/wl-capsule.png';
            case PRODUCT_HREF.NAD_INJECTION:
                return '/img/product-images/prescriptions/nad-injection2.png';
            case 'sermorelin':
                return '/img/product-images/prescriptions/sermorelin.png';
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
                case PRODUCT_HREF.NAD_INJECTION:
                    return (
                        <BioType className={`it-body  text-textSecondary`}>
                            NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every cell of the body that plays a critical role in energy production, metabolism, and cellular repair. 
                            It naturally declines with age, which has been linked to fatigue, cognitive decline, and other signs of aging.
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
            case PRODUCT_HREF.NAD_INJECTION:
                return 'NAD+ Injection';
            case 'sermorelin':
                return 'Sermorelin';
            default:
                return '';
        }
    };

    const displayProductPrice = () => {
        // Special handling for NAD injection
        if (product_href === PRODUCT_HREF.NAD_INJECTION) {
            return priceData?.price_data?.product_price || 0;
        }

    // Special handling for Sermorelin
    if (product_href === 'sermorelin') {
        const cadence = searchParams.get('st');
        const fullPrice = priceData?.price_data?.product_price || 0;
        const discount = priceData?.price_data?.discount_price?.discount_amount || 0;

        // Show discounted first-month price ONLY for monthly subscriptions
        if (cadence === 'monthly') {
            return fullPrice - discount;
        }

        // Quarterly/semi-annual: show total pre-discount
        return fullPrice;
    }

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
        const isSermorelin = product_href === PRODUCT_HREF.SERMORELIN;
    
        // Sermorelin: always use discount_price.discount_amount
        if (isSermorelin) {
            return priceData?.price_data?.discount_price?.discount_amount || 0;
        }
    

        // Special handling for NAD injection
        if (product_href === PRODUCT_HREF.NAD_INJECTION) {
            return priceData?.price_data?.discount_price?.discount_amount || 0;
        }

        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually' ||
            priceData.cadence === 'annually'
        ) {
            if (orderData.product_href === PRODUCT_HREF.METFORMIN) {
                return priceData.price_data.discount_price.discount_amount;
            }
            // Add null check for savings object
            return priceData?.price_data?.savings?.exact_total || 0;
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
                lookupProductHref // Using lookupProductHref instead of undefined product_href
            );

            const search = searchParams.toString();
            const searchParamsNew = new URLSearchParams(search);
            await continueButtonExitAnimation(150);
            
            const finalUrl = `/intake/prescriptions/${lookupProductHref}/${nextRoute}?${searchParamsNew}`;
            
            router.push(finalUrl);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const doctor_image_ref = localStorage
    .getItem('vwo_ids')
    ?.includes(AB_TESTS_IDS.WL_RO_TEST)
    ? 'female-doctor-ro-test.png'
    : 'aidoctor2.png';
    
    let sermorelinSupplyText = '';
    if (product_href === 'sermorelin') {
        const subscriptionType = searchParams.get('st');
        switch (subscriptionType) {
            case 'monthly':
                sermorelinSupplyText = '1 month supply. Shipped monthly';
                break;
            case 'quarterly':
                sermorelinSupplyText = '3 month supply. Shipped quarterly';
                break;
            case 'semi-annually':
                sermorelinSupplyText = '6 month supply. Shipped semi-annually';
                break;
            default:
                sermorelinSupplyText = '1 month supply. Shipped monthly';
        }
    }
    
    return (
        <div className='flex flex-col justify-center items-center w-screen overflow-x-hidden bg-[#FAFAFA] px-[1.25rem] md:px-0'>
            <div className='flex flex-col animate-slideRight mt-[2.06rem] md:mt-[33px] w-full md:max-w-[447px] mx-auto md:px-[1.25rem]'>
                <div className='flex flex-col w-full'>
                    <p className={`inter_h5_regular mb-[1.25rem] md:mb-[20px]`}>
                        Based on your responses you may be eligible for:
                    </p>
                </div>

                <div className='w-full'>
                    <div className="flex flex-col items-center p-[2rem] md:p-[32px] w-full bg-[#FFFFFF] border-[1px] border-solid border-[#DBD1D1] rounded-[1.35375rem] box-border">
                        {displaySavings() !== 0 && (
                            <div className='bg-[#ccfbb6] w-full py-0.5 px-1 rounded-md flex justify-center'>
                                <BioType className='intake-v3-form-label'>
                                    Limited time: Unlock ${displaySavings()?.toFixed(0)} today
                                </BioType>
                            </div>
                        )}

                        <div className='w-full flex justify-center items-center px-4 pt-4'>
                            <div className='relative w-full aspect-square max-w-[200px] sm:max-w-[240px] md:max-w-[280px]'>
                                <Image
                                    src={getImageHref()}
                                    alt='Medicine Vial'
                                    fill
                                    className='object-contain'
                                    style={{ borderTopLeftRadius: '10.66px', borderTopRightRadius: '10.66px' }}
                                    unoptimized
                                />
                            </div>
                        </div>

                        <div className='flex flex-col space-y-[0.5625rem] mt-[0.25rem] w-full'>
                            <BioType className='inter_body_regular'>
                                {displayVialsIncluded()}
                            </BioType>
                        </div>

                        <Divider className='w-full bg-slate-300 h-[0.03125rem] my-[0.75rem]' />

                        <div className='flex flex-row justify-between items-end'>
                            <p className='intake-v3-disclaimer-text text-weak'>
                                {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "Comes with medical support tailored to your health profile and goals"
                                    : "Comes with medical support tailored to your weight loss profile"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='w-full mb-4'>
                    <div className="flex justify-center items-center w-fit px-4 py-1 rounded-b-[0.75rem] bg-gradient-to-r from-cyan-200 to-pink-200 mx-auto">
                        <span className="text-[0.75rem] leading-[1rem] text-slate-700 text-center font-normal">
                            You won&apos;t be charged until prescribed.
                        </span>
                    </div>
                </div>

                {product_href === 'sermorelin' && (
                    <div className="flex flex-col w-full">
                        <p className="inter_h5_regular mb-[1.25rem]">
                            Doctor-trusted ingredients, formulated to deliver results.
                        </p>

                        <div className="w-full flex justify-center"><div className="bg-white border-[1px] border-solid border-[#DBD1D1] rounded-[1.35375rem] w-full max-w-[447px] p-[2rem] md:p-[32px] flex flex-col items-start gap-3 mx-auto">
                            <h3 className="inter_body_large_bold">
                                Sermorelin
                            </h3>
                            <p className="inter_body_regular">
                                Sermorelin is a synthetic form of growth hormone-releasing hormone (GHRH), used as a medication for low hGH levels. As an anti-aging therapy, injectable sermorelin can restore your body&apos;s natural production of hGH. Research suggests that sermorelin may improve general well-being, muscle mass, insulin sensitivity, libido, and sleep patterns.
                            </p>
                        </div></div>
                    </div>
                )}

                {product_href === PRODUCT_HREF.NAD_INJECTION && (
                    <div className="flex flex-col w-full">
                        <p className="inter_h5_regular mb-[1.25rem]">
                            We&apos;re here to help every step of the way
                        </p>
                    </div>
                )}

                {product_href === PRODUCT_HREF.WL_CAPSULE && (
                    <p className="inter_h5_regular mb-[1.25rem]">
                        Doctor-trusted medication and clinically-proven weight loss results
                    </p>
                )}

                {product_href === PRODUCT_HREF.WL_CAPSULE && (
                    <div className='w-full flex flex-col justify-center mt-[3rem] md:mt-[48px]'>
                        <div className='w-full flex justify-center items-center relative'>
                            <div className='w-full max-w-screen overflow-hidden h-[21.9rem] md:h-[350px] items-center'>
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


            </div>
            <div className='flex flex-col justify-center items-center w-screen overflow-x-hidden'>


                {product_href === PRODUCT_HREF.NAD_INJECTION && (
                    <div className='w-full flex flex-col justify-center mt-[3rem] md:mt-[48px]'>
                        <div className='w-full flex justify-center items-center relative'>
                            <div className='w-full max-w-screen overflow-hidden h-[21.9rem] md:h-[350px] items-center'>
                                <div
                                    className='flex flex-row gap-2 overflow-x-scroll w-full h-[21.9rem] md:h-[350px] md:justify-center [&::-webkit-scrollbar]:hidden'
                                    style={scrollbarHideStyle}
                                >
                                    <div className='w-10 hidden sm:block lg:hidden'></div>

                                    <div
                                        className='border border-slate-400 rounded-xl p-4 flex-shrink-0 w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px] md:mx-2 bg-white'
                                        style={{
                                            border: '1.4px solid #dbd1d1',
                                        }}
                                    >
                                        <p className='intake-v3-18px-20px-bold'>
                                            What is NAD+?
                                        </p>
                                        <p className="intake-subtitle mt-2">
                                            NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every cell of the body that plays a critical role in energy production, metabolism, and cellular repair.
                                        </p>
                                        <p className="intake-subtitle mt-2">
                                            It naturally declines with age, which has been linked to fatigue, cognitive decline, and other signs of aging.
                                        </p>
                                    </div>

                                    <div
                                        className='border border-slate-400 rounded-xl p-4 flex-shrink-0 w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px] md:mx-2 bg-white'
                                        style={{
                                            border: '1.4px solid #dbd1d1',
                                            maxWidth: '15rem',
                                        }}
                                    >
                                        <p className='intake-v3-18px-20px-bold'>
                                            How does it work?
                                        </p>
                                        <p className="intake-subtitle mt-2">
                                            NAD+ fuels essential biological processes by helping convert nutrients into energy and activating enzymes that regulate cellular repair and stress responses.
                                        </p>
                                        <p className="intake-subtitle mt-2">
                                            Supplementing with NAD+ precursors can help restore these functions and support healthy aging.
                                        </p>
                                    </div>

                                    <div
                                        className='border border-slate-400 rounded-xl p-4 flex-shrink-0 w-[15.6rem] md:w-[250px] h-[16.8rem] md:h-[268px] md:mx-2 bg-white'
                                        style={{
                                            border: '1.4px solid #dbd1d1',
                                            maxWidth: '15rem',
                                        }}
                                    >
                                        <p className='intake-v3-18px-20px-bold'>
                                            Is it safe?
                                        </p>
                                        <p className='intake-subtitle mt-2'>
                                            NAD+ precursors like NMN and NR are generally considered safe and well-tolerated in clinical studies, with mild side effects such as nausea or flushing in rare cases.
                                        </p>
                                        <p className='intake-subtitle mt-2'>
                                            Bioverse partners with licensed compounding pharmacies that are regulated by the FDA.
                                        </p>
                                    </div>

                                    <div className='w-10 lg:hidden'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}




                <div className='w-full flex flex-col justify-center max-w-[447px] mx-auto'>


                <div className="flex flex-col w-full pt-[3.12rem] pb-[1.25rem]">
                    <h2 className="inter_h5_regular px-[1.25rem] md:px-0">
                        We&apos;re here to help every step of the way
                    </h2>
                </div>

                <div className='flex flex-col w-full'>
                    <div className="w-full flex justify-center ">
                    <div className="w-full max-w-[27.9375rem] px-[1.25rem] md:px-0">
                        <div className="w-full h-[12.315rem] relative rounded-t-[1.35375rem] bg-[#F4F4F4] overflow-hidden">
                            <Image
                                src={`/img/intake/wl/${doctor_image_ref}`}
                                alt="Vial Image"
                                fill
                                className="object-cover rounded-t-[1.35375rem]"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>

                <div className='p-6 md:mb-[1.75rem] mb-[4rem] rounded-b-[1.35375rem] border-[1px] border-solid border-[#DBD1D1] bg-[#FFFFFF] box-border mx-[1.25rem] md:mx-0'>
                    <div className='flex flex-row gap-2 mb-[.75rem] '>
                        <div className='flex flex-col gap-[.75rem]'>
                            <img
                                src='/img/intake/wl/phone.svg'
                                alt='phone'
                                className='w-6 h-6'
                            />
                            <BioType className={`inter_body_large_bold`}>
                                {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "Professional administration"
                                    : "Ongoing check-ins"}
                            </BioType>
                            <BioType className={`inter_body_medium_regular`}>
                                {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "Our healthcare providers will guide you through the process and answer any questions about NAD+ therapy."
                                    : "Connect with your provider and your Care Team as much as you'd like - at no extra charge!"}
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
                            <BioType className={`inter_body_large_bold`}>
                            {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "Expert guidance"
                                    : "Unlimited messaging"}
                            </BioType>
                            <BioType className={`inter_body_medium_regular`}>
                                {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "Our healthcare providers will guide you through the process and answer any questions about NAD+ therapy."
                                    : "Connect with your provider and your Care Team as much as you'd like - at no extra charge!"}
                            </BioType>
                        </div>
                    </div>
                    <Divider />
                    <div className='flex flex-row gap-2 mt-[.75rem]'>
                        <div className='flex flex-col gap-[.75rem]'>
                            <img
                                src='/img/intake/wl/box.svg'
                                alt='phone'
                                className='w-6 h-6 mt-1'
                            />
                            <BioType className={`inter_body_large_bold`}>
                                {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "Quality assurance"
                                    : "Free shipping"}
                            </BioType>
                            <BioType className={`inter_body_medium_regular`}>
                                {product_href === PRODUCT_HREF.NAD_INJECTION
                                    ? "All our NAD+ treatments are sourced from FDA-regulated facilities, ensuring the highest quality standards."
                                    : "Every BIOVERSE treatment arrives directly to your doorstep."}
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
            </div>
        </div>
    );
}