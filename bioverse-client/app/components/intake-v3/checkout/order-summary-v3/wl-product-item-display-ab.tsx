import { Chip, Dialog, DialogTitle } from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import {
    METFORMIN_PRODUCT_HREF,
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import SelectShippingFrequency from './components/select-shipping-frequency';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import Image from 'next/image';
import { useState } from 'react';
import HSAInformationDialog from './HSADialog';

interface Props {
    wl_goal: any;
    user_name: string;
    product_name: string;
    variantNumber: number;
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    priceData: any;
    pricingStructure?: any;
    selectedPriceIndex: number;
    setSelectedPriceIndex: React.Dispatch<React.SetStateAction<number>>;
    recommendedPrices: (Partial<ProductVariantRecord> | null)[];
}

export default function WLProductItemDisplayAB({
    wl_goal,
    user_name,
    product_name,
    product_data,
    priceData,
    pricingStructure,
    selectedPriceIndex,
    setSelectedPriceIndex,
    recommendedPrices,
}: Props) {
    const [openHSADialog, setOpenHSADialog] = useState<boolean>(false);
    /* This price is rendered struck-through */
    function displayTotalPrice() {
        if (
            product_data.product_href === METFORMIN_PRODUCT_HREF ||
            product_data.product_href === PRODUCT_HREF.WL_CAPSULE
        ) {
            return recommendedPrices[selectedPriceIndex]?.price_data
                .product_price;
        }
        if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (
                recommendedPrices[selectedPriceIndex]?.cadence ===
                    'quarterly' ||
                recommendedPrices[selectedPriceIndex]?.cadence === 'biannually'
            ) {
                return recommendedPrices[selectedPriceIndex]?.price_data.savings
                    .original_price;
            } else {
                return recommendedPrices[selectedPriceIndex]?.price_data
                    .product_price;
            }
        } else {
            return pricingStructure.total_price;
        }
    }

    /* price_data.product_price is the 'discounted' price for quarterly and biannual products  
    for monthly products, the discounted price is price_data.product_price minus discount_price.discount_amount */
    function displayDiscountedPrice() {
        if (
            product_data.product_href === METFORMIN_PRODUCT_HREF ||
            product_data.product_href === PRODUCT_HREF.WL_CAPSULE
        ) {
            return (
                recommendedPrices[selectedPriceIndex]?.price_data
                    .product_price! -
                recommendedPrices[selectedPriceIndex]?.price_data.discount_price
                    .discount_amount!
            );
        }
        if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (
                recommendedPrices[selectedPriceIndex]?.cadence ===
                    'quarterly' ||
                recommendedPrices[selectedPriceIndex]?.cadence === 'biannually'
            ) {
                return recommendedPrices[selectedPriceIndex]?.price_data
                    .product_price!;
            } else {
                return (
                    recommendedPrices[selectedPriceIndex]?.price_data
                        .product_price! -
                    recommendedPrices[selectedPriceIndex]?.price_data
                        .discount_price.discount_amount!
                );
            }
        } else {
            return pricingStructure.item_price;
        }
    }

    const displaySavings = () => {
        if (
            recommendedPrices[selectedPriceIndex]?.cadence === 'quarterly' ||
            recommendedPrices[selectedPriceIndex]?.cadence === 'biannually'
        ) {
            if (
                product_data.product_href === METFORMIN_PRODUCT_HREF ||
                product_data.product_href === PRODUCT_HREF.WL_CAPSULE
            ) {
                return recommendedPrices[selectedPriceIndex]?.price_data
                    .discount_price.discount_amount;
            }
            return recommendedPrices[selectedPriceIndex]?.price_data.savings
                .exact_total;
        } else {
            return recommendedPrices[selectedPriceIndex]?.price_data
                .discount_price.discount_amount;
        }
    };

    function displayVialInformation() {
        return null;
        const multipleVials =
            recommendedPrices[selectedPriceIndex]?.price_data.vial_sizes &&
            recommendedPrices[selectedPriceIndex]?.price_data.vial_sizes
                .length > 1;

        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return null;
        }

        if (
            recommendedPrices[selectedPriceIndex]?.cadence === 'quarterly' ||
            recommendedPrices[selectedPriceIndex]?.cadence === 'biannually'
        ) {
            const numVials =
                recommendedPrices[selectedPriceIndex]?.price_data.vial_sizes
                    ?.length || 0;

            let text: any = '';

            if (multipleVials) {
                text = recommendedPrices[
                    selectedPriceIndex
                ]?.price_data.vial_sizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index === numVials - 1 ? '' : ', '
                        }`;
                    })
                    .join('');
            }
            return `${recommendedPrices[selectedPriceIndex]?.variant} ${
                multipleVials ? `(${numVials} vials included - ${text})` : ''
            }`;
        } else {
            const vialSizes =
                recommendedPrices[selectedPriceIndex]?.price_data.vial_sizes;
            if (vialSizes && vialSizes.length > 1) {
                const text = vialSizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index === vialSizes.length - 1 ? '' : ', '
                        }`;
                    })
                    .join('');

                return `${recommendedPrices[selectedPriceIndex]?.vial} vial (${vialSizes.length} vials included - ${text})`;
            }
            return `${recommendedPrices[selectedPriceIndex]?.vial} vial`;
        }
    }

    function displayQuote() {
        if (product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF) {
            if (product_data.subscriptionType === 'monthly') {
                return 'About 1 in 3 adults lost 20% of their body weight with semaglutide*';
            }
            return 'On average, people lose 6.9% of their weight in their first three months with semaglutide*';
        } else if (product_data.product_href === TIRZEPATIDE_PRODUCT_HREF) {
            return 'On average people lose 7% of their body weight in their first 3 months of using tirzepatide*';
        }
    }

    function displayProductTitle() {
        if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            return `${product_name} Weekly Injections`;
        }

        return '';
    }

    const getProductTitleMargin = () => {
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return '';
        }
        return 'mt-1';
    };

    const renderCheckMark = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
            >
                <path
                    d="M20 6.46875L9 17.4688L4 12.4688"
                    stroke="#4D4D4D"
                    stroke-opacity="0.45"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        );
    };

    return (
        <>
            <div className="flex flex-row gap-4 w-full -mt-4 pr-0">
                {priceData && (
                    <div className="flex flex-col w-full gap-y-2 md:gap-y-4">
                        <div className="flex gap-4 w-full">
                            <div className="flex flex-col w-full space-y-2 mt-4">
                                <BioType className="intake-subtitle text-black">
                                    {displayProductTitle()}
                                </BioType>
                                {wl_goal !== 'Unknown' && (
                                    <div className="flex justify-between items-center">
                                        <div className=" text-wrap">
                                            <BioType
                                                className={`intake-subtitle text-black`}
                                            >
                                                Based on your goal to lose:
                                            </BioType>
                                        </div>

                                        <div className="rounded-lg  max-w-content border border-solid border-black text-center py-1 px-2">
                                            <BioType
                                                className={`intake-subtitle text-black`}
                                            >
                                                {wl_goal} lbs
                                            </BioType>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <BioType
                                        className={`intake-subtitle text-black`}
                                    >
                                        Includes {product_name} and:
                                    </BioType>
                                    <div className="flex flex-col space-y-[6px] mt-[6px]">
                                        <div className="flex items-center space-x-1">
                                            {renderCheckMark()}
                                            <BioType className="intake-subtitle">
                                                Free provider evaluation, 100%
                                                online
                                            </BioType>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {renderCheckMark()}
                                            <BioType className="intake-subtitle">
                                                Check-ins and messaging with a
                                                provider
                                            </BioType>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {renderCheckMark()}
                                            <BioType className="intake-subtitle">
                                                Free expedited shipping
                                            </BioType>
                                        </div>
                                    </div>
                                    <div className="w-full h-[1px] mt-4">
                                        <HorizontalDivider
                                            backgroundColor={'#1B1B1B1F'}
                                            height={1}
                                        />
                                    </div>
                                </div>
                                {product_data.subscriptionType !==
                                    'one_time' && (
                                    <div className="">
                                        {/* SELECT SHIPPING FREQUENCY */}
                                        <SelectShippingFrequency
                                            recommendedPrices={
                                                recommendedPrices
                                            }
                                            selectedPriceIndex={
                                                selectedPriceIndex
                                            }
                                            setSelectedPriceIndex={
                                                setSelectedPriceIndex
                                            }
                                            product_href={
                                                product_data.product_href
                                            }
                                            setOpenHSADialog={setOpenHSADialog}
                                        />

                                        <div className="w-full h-[1px] mt-3 mb-1">
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-[50%] md:w-full text-wrap">
                                    <BioType
                                        className={`intake-subtitle text-black`}
                                    >
                                        Total, if prescribed
                                    </BioType>
                                </div>
                                <div className="flex flex-row gap-1">
                                    {displaySavings() != 0 && (
                                        <BioType
                                            className={`inter-h5-regular text-sm text-[#D11E66] `}
                                        >
                                            <s>
                                                $
                                                {(
                                                    Math.round(
                                                        displayTotalPrice() *
                                                            100,
                                                    ) / 100
                                                ).toFixed(2)}
                                            </s>
                                        </BioType>
                                    )}
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        <BioType
                                            className={`inter-h5-regular text-sm `}
                                        >
                                            $
                                            {(
                                                Math.round(
                                                    displayDiscountedPrice() *
                                                        100,
                                                ) / 100
                                            ).toFixed(2)}
                                        </BioType>
                                    </BioType>
                                </div>
                            </div>
                            <div className="w-full h-[1px] mb-3">
                                <HorizontalDivider
                                    backgroundColor={'#1B1B1B1F'}
                                    height={1}
                                />
                            </div>
                            <div className="flex flex-row justify-between">
                                <BioType className={`inter-h5-bold text-sm`}>
                                    DUE TODAY
                                </BioType>
                                <BioType className={`inter-h5-bold text-sm`}>
                                    $00.00
                                </BioType>
                            </div>
                            <div className="flex justify-end mt-4 sm:mt-0">
                                <BioType
                                    className="intake-subtitle text-weak underline underline-weak hover:cursor-pointer"
                                    onClick={() => setOpenHSADialog(true)}
                                >
                                    FSA/HSA eligible for reimbursement
                                </BioType>
                            </div>
                            <div className="w-full h-[1px] mb-3 mt-4">
                                <HorizontalDivider
                                    backgroundColor={'#1B1B1B1F'}
                                    height={1}
                                />
                            </div>
                            {displaySavings() != 0 && (
                                <div className="bg-[#ccfbb6] w-full py-2  rounded-md flex justify-center">
                                    <BioType className="text-black intake-v3-disclaimer-text ">
                                        You&apos;re saving $
                                        {displaySavings()?.toFixed(2)} with this
                                        plan. Nice pick!
                                    </BioType>
                                </div>
                            )}
                        </div>
                        <div className={`w-full flex justify-start`}>
                            <BioType className="intake-subtitle text-weak">
                                After this a provider will review your
                                information to determine if the treatment is
                                right for you
                            </BioType>
                        </div>
                        <HSAInformationDialog
                            openHSADialog={openHSADialog}
                            setOpenHSADialog={setOpenHSADialog}
                            recommendedPrices={recommendedPrices}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
