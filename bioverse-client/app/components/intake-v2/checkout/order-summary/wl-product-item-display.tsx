import { Chip } from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import {
    METFORMIN_PRODUCT_HREF,
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

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
    function displayTotalPrice() {
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return variantPriceData.price_data.product_price;
        }
        if (
            product_data.product_href === SEMAGLUTIDE_PRODUCT_HREF ||
            product_data.product_href === TIRZEPATIDE_PRODUCT_HREF
        ) {
            if (variantPriceData.cadence === 'quarterly' || variantPriceData.cadence === 'biannually') {
                return variantPriceData.price_data.savings.original_price;
            } else {
                return variantPriceData.price_data.product_price;
            }
        } else {
            return pricingStructure.total_price;
        }
    }

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
            if (variantPriceData.cadence === 'quarterly' || variantPriceData.cadence === 'biannually') {
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
        if (variantPriceData.cadence === 'quarterly'  || variantPriceData.cadence === 'biannually') {
            if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
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

        if (variantPriceData.cadence === 'quarterly'  || variantPriceData.cadence === 'biannually') {
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
            if (product_data.subscriptionType === 'quarterly') {
            return 'On average, people lose 6.9% of their weight in their first three months with semaglutide*';
            }
            if (product_data.subscriptionType === 'biannually') {
                return 'On average, people lose 13.8% of their body weight when taking semaglutide for 6 months*';
            }
        } else if (product_data.product_href === TIRZEPATIDE_PRODUCT_HREF) {

            if (product_data.subscriptionType === 'monthly') {
                return 'On average, people lose 2% of their weight after 1 month on tirzepatide*';
            }
            if (product_data.subscriptionType === 'quarterly') {
            return 'On average people lose 7% of their body weight in their first 3 months of using tirzepatide*';
            }
            if (product_data.subscriptionType === 'biannually') {
                return 'On average, people lose 10.1% of their body weight when taking tirzepatide for 6 months*';
            }
        }
    }

    function displayProductTitle() {
        if (product_data.product_href === METFORMIN_PRODUCT_HREF) {
            return <>
                    <p>
                        Metformin
                    </p>
                    <p>
                        90 day supply
                    </p>
                    </>;
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
        if (variantPriceData.cadence === 'quarterly'  || variantPriceData.cadence === 'biannually') {
            return 'mt-1';
        }
        return 'mt-1';
    };

    return (
        <>
            <div className='flex flex-row p-0 gap-4 w-full -mt-2 md:-mt-4'>
                {priceData && (
                    <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                        <div className='flex gap-4 w-full'>
                            <div className='flex flex-col w-full'>
                                <BioType
                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                >
                                    {user_name}&apos;s Treatment
                                </BioType>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} ${getProductTitleMargin()} `}
                                >
                                    {displayProductTitle()}
                                </BioType>
                                {product_data.subscriptionType !==
                                    'one_time' && (
                                    <>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                        >
                                            {displayVialInformation()}
                                        </BioType>
                                        {variantPriceData.cadence ===
                                            'quarterly' &&
                                            product_data.product_href !==
                                                METFORMIN_PRODUCT_HREF && (
                                                <div
                                                    className={`w-full h-[1px] bg-[#1B1B1B1F] my-3`}
                                                ></div>
                                            )}
                                        {product_data.product_href !==
                                            METFORMIN_PRODUCT_HREF && (
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} mt-1 text-black`}
                                            >
                                                Weekly dosage
                                            </BioType>
                                        )}
                                        {(variantPriceData.cadence === 'quarterly' ||
                                        variantPriceData.cadence === 'biannually')
                                        && (
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
                                                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-black`}
                                                            >
                                                                {item.header}
                                                            </BioType>
                                                            <BioType
                                                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                                            >
                                                                {item.subtitle}
                                                            </BioType>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        {(variantPriceData.cadence !==
                                            'quarterly' &&
                                            variantPriceData.cadence !== 'biannually'
                                        ) && (
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                            >
                                                {
                                                    variantPriceData.price_data
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
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Based on your goal to lose:
                                    </BioType>
                                </div>

                                <div className='rounded-lg  max-w-content border-2 border-solid border-primary text-center py-1 px-2'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} w-full`}
                                    >
                                        {wl_goal} lbs
                                    </BioType>
                                </div>
                            </div>
                        )}

                        {/* <div className='flex justify-between'>
                            <BioType className='subtitle2 text-primary !font-[600]'>
                                You’ll only be charged if prescribed
                            </BioType>
                        </div> */}
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
                        {product_data.product_href === METFORMIN_PRODUCT_HREF && (
                            <div className='flex justify-between items-center'>
                                <div className='w-[50%] md:w-full text-wrap'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        First month (if prescribed)
                                    </BioType>
                                </div>

                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                                >
                                    $5
                                </BioType>
                            </div>
                        )}

                        {displaySavings() != 0 && (
                            <div className='bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center'>
                                <BioType className='text-black it-body md:itd-body'>
                                    You&apos;re saving $
                                    {displaySavings()?.toFixed(2)} with this
                                    plan.
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
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Total if prescribed
                                    </BioType>
                                </div>
                                <div className='flex flex-row gap-1'>
                                    {displaySavings() != 0 && (
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
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
                                </div>
                            </div>

                            <Chip
                                variant='filled'
                                size='medium'
                                label={`Refills every ${
                                    variantPriceData.cadence === 'monthly'
                                        ? 'month'
                                        : variantPriceData.cadence === 'quarterly'
                                        ? 'quarter'
                                        : '6 months'
                                }, cancel anytime`}
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

                        <div
                            className={`w-full flex justify-center text-primary text-center mt-2 ${INTAKE_PAGE_BODY_TAILWIND}`}
                        >
                            {displayQuote()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
