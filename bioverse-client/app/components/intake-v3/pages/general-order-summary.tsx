'use client';
import { Divider, Paper } from '@mui/material';
import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import {
    B12_INJECTION_PRODUCT_HREF,
    GLUTATHIONE_INJECTION_PRODUCT_HREF,
    METFORMIN_PRODUCT_HREF,
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { VariantProductPrice } from '@/app/types/product-prices/product-prices-types';
import { sum } from 'lodash';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import ContinueButton from '../buttons/ContinueButtonV3';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface Props {
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    priceRecord: ProductVariantRecord;
}

export default function GeneralOrderSummary({
    product_data,
    priceRecord,
}: Props) {
    const router = useRouter();
    const fullPath = usePathname();
    const searchParams = useSearchParams();

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    //getImageRefUsingProductHref
    const {
        data: image_ref,
        error,
        isLoading,
    } = useSWR(`${product_data.product_href}-image`, () =>
        getImageRefUsingProductHref(product_data.product_href),
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

    const displayMonthlyVialInformation = () => {
        const multipleVials = priceRecord.price_data.vial_sizes.length > 1;
        const numVials = priceRecord.price_data.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text =
                priceRecord.price_data.vial_sizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index ===
                            priceRecord.price_data.vial_sizes.length - 1
                                ? ''
                                : ', '
                        }`;
                    })
                    .join('') || '';
        }

        const totalVialSize = sum(priceRecord.price_data.vial_sizes);

        switch (product_data.product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
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

            case TIRZEPATIDE_PRODUCT_HREF:
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
            case METFORMIN_PRODUCT_HREF:
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
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return (
                <BioType
                    className={`md:itd-input it-body  md:!font-twcsemimedium`}
                >
                    1,000mg/day or as prescribed
                </BioType>
            );
        }
        if (priceRecord.cadence === 'quarterly') {
            return (
                <div className="flex flex-nowrap">
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        {priceRecord.vial}
                    </BioType>
                    &nbsp;
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium flex-1`}
                    >
                        {' '}
                        ({priceRecord.price_data.vial_sizes.length} vials
                        included -{' '}
                        {priceRecord.price_data.vial_sizes.map(
                            (vialSize: any, index: number) => {
                                return `${vialSize} mg${
                                    index ===
                                    (priceRecord.price_data.vial_sizes.length ||
                                        0) -
                                        1
                                        ? ')'
                                        : ', '
                                }`;
                            },
                        )}
                    </BioType>
                </div>
            );
        }

        return displayMonthlyVialInformation();
    };

    const getImageHref = () => {
        switch (product_data.product_href) {
            case METFORMIN_PRODUCT_HREF:
                return '/img/intake/wl/metformin/metformin_lifestyle.png';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '/img/intake/wl/tirzepatide/tirzepatide_lifestyle.png';
            case B12_INJECTION_PRODUCT_HREF:
                return '/img/intake/b12/b12-summary.png';
            case GLUTATHIONE_INJECTION_PRODUCT_HREF:
                return '/img/intake/glutathione/glutathione-summary.png';
            case PRODUCT_HREF.TRETINOIN:
                return '/img/intake/skincare/skin-care-gos.png';
            default:
                return '/img/checkout/semaglutide-summary.png';
        }
    };

    const displayProductDescription = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.B12_INJECTION:
                return (
                    <BioType className={`inter_body_regular`}>
                        B12 injections are used to rapidly increase B12 levels
                        in the body, essential for energy production, nerve
                        health, and cognitive function. They are particularly
                        beneficial in conditions of B12 deficiency and certain
                        anemias.
                    </BioType>
                );
            case PRODUCT_HREF.GLUTATIONE_INJECTION:
                return (
                    <BioType className={`inter_body_regular`}>
                        Glutathione injections are known for their powerful
                        antioxidant properties, playing a key role in
                        detoxification and immune system support. They are also
                        beneficial for skin health and may contribute to
                        enhanced energy and overall well-being.
                    </BioType>
                );
            case PRODUCT_HREF.METFORMIN:
                return (
                    <BioType className={`inter_body_regular`}>
                        Metformin is a widely prescribed medication primarily
                        for Type 2 diabetes, known for its effectiveness in
                        improving insulin sensitivity and reducing blood sugar
                        levels. Additionally, metformin has shown potential in
                        aiding weight management and improving cardiovascular
                        health, making it a valuable tool in addressing
                        metabolic disorders.
                    </BioType>
                );
            case PRODUCT_HREF.TRETINOIN:
                return (
                    <div className="flex flex-col gap-2">
                        <BioType className={`it-subtitle text-black`}>
                            What it is
                        </BioType>
                        <BioType className={`it-body  text-textSecondary`}>
                            This customizable prescription cream mixed with .
                            three clinical ingredients – tretinoin, niacinamide,
                            and azelaic acid – and available in three strengths.
                        </BioType>
                        <BioType className={`it-subtitle text-black`}>
                            What it does
                        </BioType>
                        <BioType className={`it-body  text-textSecondary`}>
                            These prescription-strength ingredients speed cell
                            turnovers to smooth wrinkles and fine lines, improve
                            texture and brightness, lighten dark spots, and keep
                            skin moisturized.
                        </BioType>
                    </div>
                );
            default:
                return null;
        }
    };

    const displayProductName = () => {
        switch (product_data.product_href) {
            case B12_INJECTION_PRODUCT_HREF:
                return 'B12 Injections';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'Tirzepatide';
            case METFORMIN_PRODUCT_HREF:
                return 'Metformin';
            case GLUTATHIONE_INJECTION_PRODUCT_HREF:
                return 'Glutathione';
            case PRODUCT_HREF.TRETINOIN:
                return 'Custom Anti-Aging Cream';
            default:
                return '';
        }
    };

    const renderProductSupply = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.TRETINOIN:
                return '30-day supply';
            default:
                return '';
        }
    };

    const displayProductSubtitle = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.B12_INJECTION:
                return 'Improves energy levels and cognitive function';
            case PRODUCT_HREF.GLUTATIONE_INJECTION:
                return 'Boost immune function and antioxidants';
            case PRODUCT_HREF.METFORMIN:
                return 'Improve insulin sensitivity and heart health';

            default:
                return '';
        }
    };

    const displaySecondSectionTitle = () => {
        switch (product_data.product_href) {
            case PRODUCT_HREF.TRETINOIN:
                return 'This routine uses dermatologist-trusted ingredients to target your skin goals';
            default:
                return 'Doctor-trusted ingredients, formulated to promote weight loss';
        }
    };

    const displayProductPrice = () => {
        return priceRecord.price_data.product_price;
    };

    const displaySavings = () => {
        return priceRecord.price_data.discount_price.discount_amount;
    };

    const handleContinue = () => {
        setButtonLoading(true);
        try {
            const nextRoute = getNextIntakeRoute(
                fullPath,
                product_data.product_href,
                searchParams.toString(),
                false,
                'latest',
                PRODUCT_HREF.METFORMIN,
            );

            const search = searchParams.toString();
            const searchParamsNew = new URLSearchParams(search);

            router.push(
                `/intake/prescriptions/${product_data.product_href}/${nextRoute}?${searchParamsNew}`,
            );
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div className="flex flex-col -mt-2 mb-6 animate-slideRight mt-[1.25rem] md:mt-[48px]">
                <BioType
                    className={`inter_h5_regular`}
                >
                    Based on your responses you may be eligible for:
                </BioType>

                <div className="flex flex-col p-4 mt-[1.25rem] md:mt-[20px] rounded-[12px] border-[1px] border-solid border-[#dbd1d1]">
                
                    <BioType className="it-body md:itd-body flex">
                        {renderProductSupply()}
                    </BioType>
                    <div className="flex flex-col space-y-[9px] mt-1">
                        {displaySavings() !== 0 && (
                            <div className="bg-[#CCFBB6] w-full py-0.5 rounded-md flex justify-center">
                                <BioType className="inter_body_small_regular">
                                    Limited time: Unlock $
                                    {displaySavings()?.toFixed(2)} Today
                                </BioType>
                            </div>
                        )}
    
                    </div>
                    <div className="mx-auto   relative w-[100%]  h-[14rem] md:h-[320px] ">
                        <Image
                            src={getImageHref()}
                            alt={'Product Image'}
                            fill
                            objectFit="contain"
                        />
                    </div>
                    <BioType
                        className={`inter_body_bold`}
                    >
                        {displayProductName()}
                    </BioType>
                    <div className="w-full flex justify-between mt-[1.501rem] md:mt-[24px]">
                        <BioType className={`inter_body_regular`}>
                            Total, if prescribed:
                        </BioType>
                        <BioType className={`inter_body_bold text-strong`}>
                            ${Number(displayProductPrice()).toFixed(2)}
                        </BioType>
                    </div>
                    <Divider className="my-[0.75rem] md:my-[12px]"/>
                    <div className="flex flex-row justify-between items-end">
                        <div className=" ">
                        
                            <BioType className={`inter_body_small_regular text-weak`}>
                                Comes with medical support tailored to your
                                health needs and concerns
                            </BioType>
                        </div>
                    
                    </div>
                </div>
                <div className='w-full'>
                    <div className='h-[1.25rem] md:h-[20px] flex flex-col justify-center w-fit px-3 py-1 rounded-b-lg bg-gradient-to-r from-cyan-200 to-pink-200 text-strong inter_body_small_regular mx-auto'>
                        You won&apos;t be charged until prescribed.
                    </div>
                </div>

                {/* <BioType
                    className={`!text-primary it-subtitle !font-twcsemimedium mb-2`}
                >
                    {displaySecondSectionTitle()}
                </BioType> */}
                <div className="flex flex-col p-[2rem] md:p-[32px] border-[1px] border-solid border-[#dbd1d1] rounded-[12px] bg-white my-[1.5rem] md:my-[48px]">
                    <BioType
                        className={`inter_body_large_bold mb-1`}
                    >
                        {displayProductName()}
                    </BioType>
                    <BioType className={`inter_body_medium_bold text-weak mb-1`}>
                        {displayProductSubtitle()}
                    </BioType>
                    <BioType className={`inter_body_regular mb-1`}>
                        {displayProductDescription()}
                    </BioType>
                </div>
                <BioType
                    className={`inter_h5_regular `}
                >
                    We&apos;re here to help every step of the way
                </BioType>
                <div className='w-full h-[210px] flex mt-[1.25rem] md:mt-[48px]'>
                    <div className='relative flex-1 rounded-t-[9px]  bg-[#F4F4F4F4] overflow-hidden'>
                        <Image
                            src={`/img/intake/wl/aiDoctor.jpg`}
                            fill
                            className='rounded-t-lg '
                            alt='Vial Image'
                            style={{ objectFit: 'cover' }}
                            unoptimized
                        />
                    </div>
                </div>

                    <div
                        className='p-6 mb-[1.25rem] md:mb-[48px] rounded-b-lg'
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
            

            
                <div className="">
                    <ContinueButton
                        onClick={handleContinue}
                        buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </>
    );
}
