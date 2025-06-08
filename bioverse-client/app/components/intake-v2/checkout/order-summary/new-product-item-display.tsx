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

    return (
        <>
            <div className='flex flex-row p-0 gap-4 w-full -mt-2 md:-mt-4'>
                {priceData && (
                    <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col'>
                                <BioType
                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                >
                                    {user_name}&apos;s Treatment
                                </BioType>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    {product_name}
                                </BioType>
                                {product_data.subscriptionType !==
                                    'one_time' && (
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
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
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Provider evaluation
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Free check-ins
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Free shipping
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Ongoing medical support
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
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
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Total
                                    </BioType>
                                </div>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    ${pricingStructure.total_price}
                                </BioType>
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

                            <Chip
                                variant='filled'
                                size='medium'
                                label={`Refills every ${renderShippingCadence(
                                    product_data.subscriptionType
                                )}, cancel anytime`}
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
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-black`}
                            >
                                DUE TODAY
                            </BioType>
                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-black`}
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
