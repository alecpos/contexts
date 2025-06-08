import { Chip } from '@mui/material';
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
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { useSearchParams } from 'next/navigation';

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
    variantPriceData: Partial<ProductVariantRecord>;
}

export default function WLProductItemDisplay({
    wl_goal,
    user_name,
    product_name,
    product_data,
    priceData,
    pricingStructure,
    variantPriceData,
}: Props) {
    const searchParams = useSearchParams();

    /* This price is rendered struck-through */
    function displayTotalPrice() {
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return variantPriceData.price_data.product_price;
        }
        if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (
                variantPriceData.cadence === 'quarterly' ||
                variantPriceData.cadence === 'biannually' ||
                variantPriceData.cadence === 'annually'
            ) {
                return variantPriceData.price_data.savings.original_price;
            } else {
                return variantPriceData.price_data.product_price;
            }
        } else {
            return pricingStructure.total_price;
        }
    }

    /* price_data.product_price is the 'discounted' price for quarterly and biannual products  
    for monthly products, the discounted price is price_data.product_price minus discount_price.discount_amount */
    function displayDiscountedPrice() {
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return (
                variantPriceData.price_data.product_price! -
                variantPriceData.price_data.discount_price.discount_amount!
            );
        }
        if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (
                variantPriceData.cadence === 'quarterly' ||
                variantPriceData.cadence === 'biannually' ||
                variantPriceData.cadence === 'annually'
            ) {
                return variantPriceData.price_data.product_price!;
            } else {
                return (
                    variantPriceData.price_data.product_price! -
                    variantPriceData.price_data.discount_price.discount_amount!
                );
            }
        } else {
            return pricingStructure.item_price;
        }
    }

    const displaySavings = () => {
        if (
            variantPriceData.cadence === 'quarterly' ||
            variantPriceData.cadence === 'biannually' ||
            variantPriceData.cadence === 'annually'
        ) {
            if (
                product_data.product_href === METFORMIN_PRODUCT_HREF ||
                product_data.product_href === PRODUCT_HREF.WL_CAPSULE
            ) {
                return variantPriceData.price_data.discount_price
                    .discount_amount;
            }
            return variantPriceData.price_data.savings.exact_total;
        } else {
            return variantPriceData.price_data.discount_price.discount_amount;
        }
    };

    function displayVialInformation() {
        const multipleVials =
            variantPriceData.price_data.vial_sizes &&
            variantPriceData.price_data.vial_sizes.length > 1;

        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return null;
        }

        if (product_data.product_href === PRODUCT_HREF.WL_CAPSULE) {
            return (
                <BioType className='flex flex-col'>
                    <span>Buproprion HCl 65 mg, Naltrexone HCl 8 mg,</span>
                    <span>
                        Topiramate 15 mg (
                        {variantPriceData.cadence === 'monthly' ? '1' : '3'}{' '}
                        bottles included in shipment)
                    </span>
                </BioType>
            );
        }

        if (
            variantPriceData.cadence === 'quarterly' ||
            variantPriceData.cadence === 'biannually' ||
            variantPriceData.cadence === 'annually'
        ) {
            const numVials =
                variantPriceData.price_data.vial_sizes?.length || 0;

            let text: any = '';

            if (multipleVials) {
                text = variantPriceData.price_data.vial_sizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index === numVials - 1 ? '' : ', '
                        }`;
                    })
                    .join('');
            }
            return `${variantPriceData.variant} ${
                multipleVials ? `(${numVials} vials included - ${text})` : ''
            }`;
        } else {
            const vialSizes = variantPriceData.price_data.vial_sizes;
            if (vialSizes && vialSizes.length > 1) {
                const text = vialSizes
                    .map((vialSize: any, index: number) => {
                        return `${vialSize} mg${
                            index === vialSizes.length - 1 ? '' : ', '
                        }`;
                    })
                    .join('');

                return `${variantPriceData.vial} vial (${vialSizes.length} vials included - ${text})`;
            }
            return `${variantPriceData.vial} vial`;
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
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return (
                <div className='flex flex-col gap-1 mt-2'>
                    <p className='text-black'>Metformin</p>
                    <p>90 day supply</p>
                </div>
            );
        } else if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            return `${product_name} Weekly Injections`;
        }

        return product_name;
    }

    const getProductTitleMargin = () => {
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return '';
        }
        return 'mt-1';
    };

    return (
        <>
            <div className='flex flex-row p-0 gap-4 w-full -mt-4 md:-mt-4'>
                {priceData && (
                    <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                        <div className='flex gap-4 w-full'>
                            <div className='flex flex-col w-full'>
                                <BioType
                                    className={`intake-v3-18px-20px-bold mt-3 `}
                                >
                                    {user_name}&apos;s Treatment:
                                </BioType>
                                <BioType
                                    className={`intake-subtitle ${getProductTitleMargin()} `}
                                >
                                    {displayProductTitle()}
                                </BioType>
                                {product_data.subscriptionType !==
                                    'one_time' && (
                                    <>
                                        <BioType
                                            className={`intake-subtitle ${getProductTitleMargin()} `}
                                        >
                                            {displayVialInformation()}
                                        </BioType>

                                        <div className='w-full h-[1px] my-2'>
                                            <HorizontalDivider
                                                backgroundColor={'#1B1B1B1F'}
                                                height={1}
                                            />
                                        </div>

                                        <p
                                            className={`intake-subtitle ${getProductTitleMargin()} `}
                                        >
                                            Supply ships every{' '}
                                            {(() => {
                                                switch (
                                                    variantPriceData.cadence
                                                ) {
                                                    case 'monthly':
                                                        return 'month';
                                                    case 'quarterly':
                                                        return '3 months';
                                                    case 'biannually':
                                                        return '3 months';
                                                    case 'annually':
                                                        return '6 months (2 shipments)';
                                                    default:
                                                        return '';
                                                }
                                            })()}
                                            . Cancel anytime.
                                        </p>

                                        {(variantPriceData.cadence ===
                                            'monthly' ||
                                            variantPriceData.cadence ===
                                                'biannually') && (
                                            <div className='w-full h-[1px] mt-3 mb-1'>
                                                <HorizontalDivider
                                                    backgroundColor={
                                                        '#1B1B1B1F'
                                                    }
                                                    height={1}
                                                />
                                            </div>
                                        )}

                                        {variantPriceData.cadence ===
                                            'quarterly' &&
                                            product_data.product_href !==
                                                METFORMIN_PRODUCT_HREF && (
                                                <div
                                                    className={`w-full h-[1px] bg-[#1B1B1B1F] my-3`}
                                                ></div>
                                            )}
                                        {product_data.product_href !==
                                            METFORMIN_PRODUCT_HREF &&
                                            product_data.product_href !==
                                                PRODUCT_HREF.WL_CAPSULE && (
                                                <BioType
                                                    className={`intake-subtitle-bold mt-2 text-black`}
                                                >
                                                    Weekly dosage
                                                </BioType>
                                            )}
                                        {(variantPriceData.cadence ===
                                            'quarterly' ||
                                            variantPriceData.cadence ===
                                                'biannually' ||
                                            variantPriceData.cadence ===
                                                'annually') && (
                                            <div
                                                className={`flex flex-col space-y-3 mt-3`}
                                            >
                                                {variantPriceData.price_data.dosage_instructions?.map(
                                                    (
                                                        item: any,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className='flex flex-col'
                                                        >
                                                            <BioType
                                                                className={`intake-subtitle text-black`}
                                                            >
                                                                {item.header}
                                                            </BioType>
                                                            <BioType
                                                                className={`intake-subtitle  text-[#666666]`}
                                                            >
                                                                {item.subtitle}
                                                            </BioType>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        {variantPriceData.cadence !==
                                            'quarterly' &&
                                            variantPriceData.cadence !==
                                                'biannually' &&
                                            variantPriceData.cadence !==
                                                'annually' && (
                                                <BioType
                                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                                >
                                                    {
                                                        variantPriceData
                                                            .price_data
                                                            ?.dosage_instructions
                                                    }
                                                </BioType>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>
                        {wl_goal !== 'Unknown' && (
                            <div className='flex justify-between items-center'>
                                <div className=' text-wrap'>
                                    <BioType
                                        className={`intake-subtitle text-black`}
                                    >
                                        Based on your goal to lose:
                                    </BioType>
                                </div>

                                <div className='rounded-lg  max-w-content border border-solid border-black text-center py-1 px-2'>
                                    <BioType
                                        className={`intake-subtitle text-black`}
                                    >
                                        {wl_goal} lbs
                                    </BioType>
                                </div>
                            </div>
                        )}

                        <div className='flex flex-col justify-center rounded-md h-[3.25rem] md:h-[52px] bg-[#d7e3eb] p-[8px] md:p-[4px] intake-v3-disclaimer-text text-center'>
                            <p className=' h-fit'>
                                *Your provider may recommend another dosing
                                protocol after reviewing your medical history &
                                weight loss goals.
                            </p>
                        </div>
                        <div className='w-full h-[1px] my-2'>
                            <HorizontalDivider
                                backgroundColor={'#1B1B1B1F'}
                                height={1}
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`intake-subtitle text-black`}
                                >
                                    Provider evaluation
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm text-[#A3CC96] font-[700]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`intake-subtitle text-black`}
                                >
                                    Free check-ins
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm  text-[#A3CC96] font-[700]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`intake-subtitle text-black`}
                                >
                                    Free shipping
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm  text-[#A3CC96] font-[700]`}
                            >
                                FREE
                            </BioType>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[50%] md:w-full text-wrap'>
                                <BioType
                                    className={`intake-subtitle text-black `}
                                >
                                    Ongoing medical support
                                </BioType>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm text-[#A3CC96] font-[700]`}
                            >
                                FREE
                            </BioType>
                        </div>

                        {product_data.product_href ===
                            METFORMIN_PRODUCT_HREF && (
                            <div className='flex justify-between items-center'>
                                <div className='w-[50%] md:w-full text-wrap'>
                                    <BioType
                                        className={`intake-subtitle text-black `}
                                    >
                                        First month (if prescribed)
                                    </BioType>
                                </div>

                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm text-[#A3CC96] font-[700]`}
                                >
                                    $5
                                </BioType>
                            </div>
                        )}

                        {displaySavings() != 0 && (
                            <div className='bg-[#ccfbb6] w-full py-2  rounded-md flex justify-center'>
                                <BioType className='text-black intake-v3-disclaimer-text '>
                                    YOU&apos;RE SAVING $
                                    {displaySavings()?.toFixed(2)} WITH THIS
                                    PLAN
                                </BioType>
                            </div>
                        )}

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
                                        className={`intake-subtitle text-black`}
                                    >
                                        Total, if prescribed
                                    </BioType>
                                </div>
                                <div className='flex flex-row gap-1'>
                                    {displaySavings() != 0 && (
                                        <BioType
                                            className={`inter-h5-regular text-sm text-[#D11E66] `}
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
                                                        100
                                                ) / 100
                                            ).toFixed(2)}
                                        </BioType>
                                    </BioType>
                                </div>
                            </div>

                            <div className='bg-[#b2e8ff]  w-full py-2 rounded-md flex justify-center'>
                                <div className=' intake-v3-disclaimer-text rounded-md '>
                                    {`REFILLS EVERY ${(() => {
                                        switch (variantPriceData.cadence) {
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
                            <BioType className={`inter-h5-bold text-sm`}>
                                DUE TODAY
                            </BioType>
                            <BioType className={`inter-h5-bold text-sm`}>
                                $00.00
                            </BioType>
                        </div>

                        <div
                            className={`w-full flex justify-start text-start text-slate-500 text-sm text-center inter`}
                        >
                            {displayQuote()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
