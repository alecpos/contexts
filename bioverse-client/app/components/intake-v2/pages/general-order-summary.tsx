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
import ContinueButton from '../buttons/ContinueButton';
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
                    <BioType className={`it-body  text-textSecondary`}>
                        B12 injections are used to rapidly increase B12 levels
                        in the body, essential for energy production, nerve
                        health, and cognitive function. They are particularly
                        beneficial in conditions of B12 deficiency and certain
                        anemias.
                    </BioType>
                );
            case PRODUCT_HREF.GLUTATIONE_INJECTION:
                return (
                    <BioType className={`it-body  text-textSecondary`}>
                        Glutathione injections are known for their powerful
                        antioxidant properties, playing a key role in
                        detoxification and immune system support. They are also
                        beneficial for skin health and may contribute to
                        enhanced energy and overall well-being.
                    </BioType>
                );
            case PRODUCT_HREF.METFORMIN:
                return (
                    <BioType className={`it-body  text-textSecondary`}>
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
            <div className="flex flex-col -mt-2 mb-6 animate-slideRight">
                <BioType
                    className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary mb-2`}
                >
                    Based on your responses you may be eligible for:
                </BioType>

                <Paper elevation={4} className="flex flex-col mx-[0.4px] p-4">
                    <BioType
                        className={`it-h1 !font-twcsemimedium text-[1.5rem] mb-1 md:mb-0`}
                    >
                        {displayProductName()}
                    </BioType>
                    <BioType className="it-body md:itd-body flex">
                        {renderProductSupply()}
                    </BioType>
                    <div className="flex flex-col space-y-[9px] mt-1">
                        {displaySavings() !== 0 && (
                            <div className="bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center">
                                <BioType className="text-black it-body md:itd-body">
                                    You&apos;re saving $
                                    {displaySavings()?.toFixed(2)} with this
                                    plan.
                                </BioType>
                            </div>
                        )}
                        <div className="w-full flex justify-between">
                            <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                                Total, if prescribed:
                            </BioType>
                            <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                                ${Number(displayProductPrice()).toFixed(2)}
                            </BioType>
                        </div>
                    </div>
                    <div className="mx-auto my-2  relative w-[100%] md:w-[75%] md:aspect-[1.7]">
                        <Image
                            src={getImageHref()}
                            alt={'Product Image'}
                            fill
                            objectFit="cover"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-row justify-between items-end">
                        <div className="md:w-[80%] w-[70%] ">
                            <div className="mb-1">
                                <img
                                    className="h-5 w-5"
                                    alt={'Add circle'}
                                    src={`/img/intake/svg/add-circle.svg`}
                                />
                            </div>
                            <BioType className={`it-body !text-[1rem]`}>
                                Comes with medical support tailored to your
                                health needs and concerns
                            </BioType>
                        </div>
                        <div className=" h-full relative flex items-end">
                            <div className="bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-0">
                                <img
                                    className="h-5 w-5"
                                    alt={'Stethoscope'}
                                    src={`/img/intake/svg/stethescope.svg`}
                                />
                            </div>

                            <div className="bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-2">
                                <img
                                    className="h-5 w-5"
                                    alt={'Stethoscope'}
                                    src={`/img/intake/svg/stethescope.svg`}
                                />
                            </div>
                            <div className="bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-4">
                                <img
                                    className="h-5 w-5"
                                    alt={'Stethoscope'}
                                    src={`/img/intake/svg/stethescope.svg`}
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
                <div className="bg-primary text-white  mx-auto text-center rounded-b-lg p-4 mb-6">
                    <BioType className={`it-body`}>
                        You won&apos;t be charged until prescribed.
                    </BioType>
                </div>

                <BioType
                    className={`!text-primary it-subtitle !font-twcsemimedium mb-2`}
                >
                    {displaySecondSectionTitle()}
                </BioType>
                <Paper elevation={4} className="flex flex-col p-4 mb-6">
                    <BioType
                        className={`it-subtitle !font-twcsemimedium text-primary mb-1`}
                    >
                        {displayProductName()}
                    </BioType>
                    <BioType className={`it-input !font-twcsemimedium mb-1`}>
                        {displayProductSubtitle()}
                    </BioType>
                    <BioType className={`it-body  text-textSecondary`}>
                        {displayProductDescription()}
                    </BioType>
                </Paper>
                <BioType
                    className={`!text-primary it-subtitle !font-twcsemimedium mb-2`}
                >
                    We&apos;re here to help every step of the way
                </BioType>
                <div className="w-full h-[140px] flex">
                    <div className="relative flex-1 border-l-4 border-t-4 border-b-4 border-r-0 border-white border-solid rounded-sm bg-[#F4F4F4F4] overflow-hidden">
                        <Image
                            src="/img/intake/doctor2.jpg"
                            fill
                            alt="Vial Image"
                            style={{
                                objectFit: 'cover',
                                objectPosition: '0px 0px',
                            }}
                            unoptimized
                        />
                    </div>
                    <div className="relative flex-1 border-4 border-white border-solid rounded-sm bg-[#F4F4F4F4] overflow-hidden">
                        <Image
                            src="/img/intake/doctor.jpeg"
                            fill
                            alt="Vial Image"
                            style={{ objectFit: 'cover' }}
                            unoptimized
                        />
                    </div>
                </div>

                <Paper className="p-4 md:mb-[1.75rem] mb-8 mt-6">
                    <div className="flex flex-row gap-2 mb-[.75rem]">
                        <img
                            className="h-6 w-6"
                            alt={'Iphone icon'}
                            src={`/img/intake/svg/iphone.svg`}
                        />

                        <div className="flex flex-col gap-[.75rem]">
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
                    <div className="flex flex-row gap-2 my-[.75rem]">
                        <img
                            className="h-6 w-6"
                            alt={'Chat bubble icon'}
                            src={`/img/intake/svg/chat-bubble.svg`}
                        />
                        <div className="flex flex-col gap-[.75rem]">
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
                    <Divider className="" />
                    <div className="flex flex-row gap-2 mt-[.75rem]">
                        <img
                            className="h-6 w-6"
                            alt={'Favorite icon'}
                            src={`/img/intake/svg/favorite.svg`}
                        />
                        <div className="flex flex-col gap-[.75rem]">
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
