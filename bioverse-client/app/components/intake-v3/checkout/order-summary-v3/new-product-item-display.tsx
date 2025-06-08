import { Chip } from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import {
    BundleProductPrice,
    MonthlyProductPrice,
    VariantProductPrice,
} from '@/app/types/product-prices/product-prices-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface Props {
    product_information: any;
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
    // variantPriceData: VariantProductPrice;
}

export default function NewProductItemDisplay({
    product_information,
    user_name,
    product_name,
    product_data,
    priceData,
    pricingStructure,
}: // variantPriceData,
Props) {

    // function displayTotalPrice() {
    //     if (
    //         product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
    //         product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
    //     ) {
    //         if (variantPriceData.isBundle) {
    //             return variantPriceData.quarterly?.savings.original_price;
    //         } else {
    //             return variantPriceData.monthly?.product_price;
    //         }
    //     } else {
    //         return pricingStructure.total_price;
    //     }
    // }

    // function displayDiscountedPrice() {
    //     if (
    //         product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
    //         product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
    //     ) {
    //         if (variantPriceData.isBundle) {
    //             return variantPriceData.quarterly?.product_price!;
    //         } else {
    //             return (
    //                 variantPriceData.monthly?.product_price! -
    //                 variantPriceData.monthly?.discount_price.discount_amount!
    //             );
    //         }
    //     } else {
    //         return pricingStructure.item_price;
    //     }
    // }
    // function displayVialInformation() {
    //     const multipleVials =
    //         variantPriceData.quarterly?.vial_sizes &&
    //         variantPriceData.quarterly?.vial_sizes.length > 1;

    //     if (variantPriceData.isBundle) {
    //         const numVials = variantPriceData.quarterly?.vial_sizes.length || 0;

    //         let text: any = '';

    //         if (multipleVials) {
    //             text = variantPriceData.quarterly?.vial_sizes
    //                 .map((vialSize: any, index: number) => {
    //                     return `${vialSize} mg${
    //                         index === numVials - 1 ? '' : ', '
    //                     }`;
    //                 })
    //                 .join('');
    //         }
    //         return `${variantPriceData.variant} ${
    //             multipleVials ? `(${numVials} vials included - ${text})` : ''
    //         }`;
    //     } else {
    //         const vialSizes = variantPriceData.monthly?.vial_sizes;
    //         if (vialSizes && vialSizes.length > 1) {
    //             const text = vialSizes
    //                 .map((vialSize: any, index: number) => {
    //                     return `${vialSize} mg${
    //                         index === vialSizes.length - 1 ? '' : ', '
    //                     }`;
    //                 })
    //                 .join('');

    //             return `${variantPriceData.vial} vial (${vialSizes.length} vials included - ${text})`;
    //         }
    //         return `${variantPriceData.vial} vial`;
    //     }
    // }

    const renderShippingSupply = (subscription_type: string) => {
        switch (subscription_type) {
            case 'monthly':
                return '1-month supply';
            case 'quarterly':
                return '3-month supply';
            case 'pentamonthly':
                return '5-month supply';
        }
    };

    const renderShippingCadence = (subscription_type: string) => {
        switch (subscription_type) {
            case 'pentamonthly':
                return 'every 5 months';
            default:
                return subscription_type;
        }
    };


    const displayTotalPrice = () => {
        const isSermorelin = product_data.product_href === PRODUCT_HREF.SERMORELIN;
        const isMonthly = product_data.subscriptionType === 'monthly';
    
        if (isSermorelin && isMonthly) {
            const matchedVariant = priceData?.find(
                (p: any) => p.variant_index === product_data.variant
            );
    
            const productPrice = matchedVariant?.price_data?.product_price || 0;
            const discountAmount = matchedVariant?.price_data?.discount_price?.discount_amount || 0;
    
            const finalPrice = productPrice - discountAmount;
            console.log('[Sermorelin Monthly] price:', productPrice, 'discount:', discountAmount, 'final:', finalPrice);
            return finalPrice.toFixed(2);
        }
    
        // Default fallback
        return (pricingStructure?.total_price || 0).toFixed(2);
    };
    
    return (
        <>
            <div className='flex flex-row p-0 gap-4 w-full -mt-2 md:-mt-4'>
                {priceData && (
                    <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col'>
                                <BioType
                                    className={`inter_body_large_bold my-[1rem] md:my-[16px]`}
                                >
                                    {user_name}&apos;s Treatment
                                </BioType>
                                <BioType
                                    className={`inter_body_regular my-[0.25rem] md:my-[4px]`}
                                >
                                    {product_name}
                                </BioType>
                                {product_data.subscriptionType !==
                                    'one_time' && (
                                    <BioType
                                        className={`inter_body_regular text-weak`}
                                    >
                                        {renderShippingSupply(
                                            product_data.subscriptionType
                                        )}
                                    </BioType>
                                )}
                            </div>
                        </div>

                        <div className='w-full h-[1px] mb-1'>
                            <HorizontalDivider
                                backgroundColor={'#1B1B1B1F'}
                                height={1}
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`inter_body_regular`}
                                >
                                    Provider evaluation
                                </BioType>
                            </div>

                            <BioType
                                className={`inter_body_regular text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`inter_body_regular`}
                                >
                                    Free check-ins
                                </BioType>
                            </div>

                            <BioType
                                className={`inter_body_regular text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`inter_body_regular`}
                                >
                                    Free shipping
                                </BioType>
                            </div>

                            <BioType
                                className={`inter_body_regular text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`inter_body_regular`}
                                >
                                    Ongoing medical support
                                </BioType>
                            </div>

                            <BioType
                                className={`inter_body_regular text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>

                        <div className='w-full h-[1px] my-1'>
                            <HorizontalDivider
                                backgroundColor={'#1B1B1B1F'}
                                height={1}
                            />
                        </div>

                        <div className='w-full flex flex-col justify-center'>
                            <div className='flex justify-between items-center mb-4'>
                                <div className='w-[50%] md:w-full text-wrap'>
                                    <BioType
                                        className={`inter_body_regular`}
                                    >
                                        Total if prescribed
                                    </BioType>
                                </div>
                                {product_data.product_href === PRODUCT_HREF.SERMORELIN &&
                                product_data.subscriptionType === 'monthly' ? (
                                    <BioType className={`inter_body_regular`}>
                                        ${displayTotalPrice()}
                                    </BioType>
                                ) : (
                                    <BioType className={`inter_body_regular`}>
                                        ${pricingStructure?.total_price}
                                    </BioType>
                                )}
                                {/* <div className='flex flex-row gap-1'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                    >
                                        <s>
                                            $
                                            {(
                                                Math.round(
                                                    displayTotalPrice() * 100
                                                ) / 100
                                            ).toFixed(2)}
                                        </s>
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
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
                                    </BioType>
                                </div> */}
                            </div>

                        

                            <div className='bg-[#b2e8ff]  w-full py-2 rounded-md flex justify-center'>
                                <div className=' intake-v3-disclaimer-text rounded-md '>
                                    {`REFILLS EVERY ${(() => {
                                        switch (product_data.subscriptionType) {
                                            case 'monthly':
                                                return 'MONTH';
                                            case 'biannually':
                                                return '6 MONTHS';
                                            case 'quarterly':
                                                return 'QUARTER';
                                            default:
                                                return '';
                                        }
                                    })()}, CANCEL ANYTIME`}
                                </div>
                            </div>
                        </div>

                        <div className='w-full h-[1px] my-1'>
                            <HorizontalDivider
                                backgroundColor={'#1B1B1B1F'}
                                height={1}
                            />
                        </div>
                        <div className='flex justify-between'>
                            <BioType
                                className={`inter_body_bold`}
                            >
                                DUE TODAY
                            </BioType>
                            <BioType
                                className={`inter_body_bold`}
                            >
                                $00.00
                            </BioType>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
