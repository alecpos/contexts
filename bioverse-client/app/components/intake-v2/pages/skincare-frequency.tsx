'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { Fragment, useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import { Button, Chip } from '@mui/material';
import {
    StripePriceId,
    VariantProductPrice,
} from '@/app/types/product-prices/product-prices-types';
import { BaseOrder } from '@/app/types/orders/order-types';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { continueButtonExitAnimation } from '../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface GoodToGoProps {
    productVariants: ProductVariantRecord[];
    orderData: BaseOrder;
}

export default function SkincareFrequencyComponent({
    productVariants,
    orderData,
}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [shippingCadencySelected, setShippingCadencySelected] =
        useState<string>('');
    const [variantIndexSelected, setVariantIndex] = useState<number>(0);

    // console log of data

    useEffect(() => {
        console.log(
            'UEff of VIS: ',
            variantIndexSelected,
            productVariants[variantIndexSelected]
        );

        console.log('product variants: ', productVariants);
    }, [variantIndexSelected]);

    useEffect(() => {
        console.log('UEff of SCS: ', shippingCadencySelected);
    }, [shippingCadencySelected]);

    //

    const buildUpdateOrderPayload = () => {
        console.log(productVariants[variantIndexSelected]);
        console.log(
            'Log of index, variant, cadence',
            variantIndexSelected,
            productVariants[variantIndexSelected].variant,
            productVariants[variantIndexSelected].cadence
        );
        if (shippingCadencySelected === 'monthly') {
            return {
                // It's a monthly
                price_id:
                    productVariants[variantIndexSelected].price_data
                        ?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                price: productVariants[variantIndexSelected].price_data
                    .product_price,
                variant_index: variantIndexSelected,
                variant_text: productVariants[variantIndexSelected].variant,
                subscription_type:
                    productVariants[variantIndexSelected].cadence,
                discount_id: [],
            };
        } else if (shippingCadencySelected === 'bimonthly') {
            // It's a bimonthly bundle
            return {
                price_id:
                    productVariants[variantIndexSelected].price_data
                        ?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                price: productVariants[variantIndexSelected].price_data
                    .product_price,
                variant_index: variantIndexSelected,
                variant_text: productVariants[variantIndexSelected].variant,
                subscription_type:
                    productVariants[variantIndexSelected].cadence,
                discount_id: [],
            };
        } else if (shippingCadencySelected === 'quarterly') {
            // It's a quarterly bundle
            return {
                price_id:
                    productVariants[variantIndexSelected].price_data
                        ?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                price: productVariants[variantIndexSelected].price_data
                    .product_price,
                variant_index: variantIndexSelected,
                variant_text: productVariants[variantIndexSelected].variant,
                subscription_type:
                    productVariants[variantIndexSelected].cadence,
                discount_id: [],
            };
        } else {
            // It's a pentamonthly bundle
            return {
                price_id:
                    productVariants[variantIndexSelected].price_data
                        ?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                price: productVariants[variantIndexSelected].price_data
                    .product_price,
                variant_index: variantIndexSelected,
                variant_text: productVariants[variantIndexSelected].variant,
                subscription_type:
                    productVariants[variantIndexSelected].cadence,
                discount_id: [],
            };
        }
    };

    const pushToNextRoute = async () => {
        const updatedPayload = buildUpdateOrderPayload();
        await updateOrder(orderData.id, updatedPayload);

        console.log('updating this');
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);

        // Remove the 'nu' parameter
        const searchParamsNew = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParamsNew.delete('nu');
        searchParamsNew.set('st', shippingCadencySelected);
        searchParamsNew.set('pvn', String(variantIndexSelected));
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParamsNew.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    const getProductVariantCadenceMonths = (cadence: string) => {
        switch (cadence) {
            case 'bimonthly':
                return 2;
            case 'quarterly':
                return 3;
            case 'pentamonthly':
                return 5;
        }
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight `}>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-6 md:gap-9'>
                        <div>
                            <BioType
                                className={`${TRANSITION_HEADER_TAILWIND} !text-primary md:mb-[14px]`}
                            >
                                How often do you want your treatment to be
                                shipped?
                            </BioType>
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                You can choose the frequency at which your
                                treatment is shipped. You can save money by
                                choosing a 3 or 5-month supply.
                            </BioType>
                        </div>

                        <div className='flex flex-col-reverse gap-[12px]'>
                            {productVariants.map(
                                (
                                    variant: ProductVariantRecord,
                                    index: number
                                ) => {
                                    if (variant.active === false) {
                                        return null;
                                    }

                                    return (
                                        <Fragment key={index}>
                                            {index ===
                                                productVariants.filter(
                                                    (
                                                        variant: ProductVariantRecord
                                                    ) =>
                                                        variant.variant_index !==
                                                        0
                                                ).length -
                                                    1 && (
                                                <div className='flex flex-wrap-reverse'>
                                                    <BioType className='it-body md:itd-body text-[#646464] whitespace-nowrap'>
                                                        Other options
                                                    </BioType>
                                                </div>
                                            )}
                                            <Button
                                                variant='outlined'
                                                sx={{
                                                    display: 'flex',
                                                    color: 'black',
                                                    position: {
                                                        md: 'relative',
                                                    },
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    minHeight: {
                                                        xs: '16.1vw',
                                                        sm: '84px',
                                                    },
                                                    border:
                                                        shippingCadencySelected ==
                                                        variant.cadence
                                                            ? '3px solid'
                                                            : '1px solid',
                                                    borderRadius: '16px',
                                                    cursor: 'pointer',
                                                    // padding: shouldApplyAcknowledge ? '1rem' : '0',

                                                    borderColor:
                                                        shippingCadencySelected ==
                                                        variant.cadence
                                                            ? 'rgba(40, 106, 162, 1)'
                                                            : '#BDBDBD',
                                                    //Nathan added textAlign setting - Apr 23, answer choices can now run over 2 lines.
                                                    textAlign: 'start',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        '@media (min-width: 2008px)':
                                                            {
                                                                // Adjust the breakpoint as needed
                                                                backgroundColor:
                                                                    shippingCadencySelected !==
                                                                    variant.cadence
                                                                        ? '#CEE1F1'
                                                                        : undefined,
                                                                borderColor:
                                                                    shippingCadencySelected !==
                                                                    variant.cadence
                                                                        ? '#286BA2'
                                                                        : undefined,
                                                            },
                                                    },
                                                    '&:active': {
                                                        backgroundColor:
                                                            shippingCadencySelected ==
                                                            variant.cadence
                                                                ? 'rgba(40, 106, 162, 0.1)'
                                                                : 'white',
                                                    },
                                                    '&:focus': {
                                                        backgroundColor:
                                                            shippingCadencySelected ==
                                                            variant.cadence
                                                                ? 'rgba(40, 106, 162, 0.1)'
                                                                : undefined,
                                                    },
                                                }}
                                                onClick={() => {
                                                    setShippingCadencySelected(
                                                        variant.cadence
                                                    );
                                                    setVariantIndex(
                                                        variant.variant_index as number
                                                    );
                                                }}
                                            >
                                                <div
                                                    className={` flex flex-col gap-2 px-[24px] py-4 flex-grow w-full`}
                                                >
                                                    {variant.cadence ===
                                                    'monthly' ? (
                                                        <div className='px-2 flex-col flex gap-2'>
                                                            <div className='flex'>
                                                                <BioType className='it-h1 md:itd-h1 text-primary'>
                                                                    Ships every
                                                                    month
                                                                </BioType>
                                                            </div>
                                                            <div className='flex flex-col gap-2'>
                                                                <div className='flex flex-row justify-between flex-grow w-full'>
                                                                    <BioType
                                                                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} `}
                                                                    >
                                                                        $
                                                                        {
                                                                            variant
                                                                                .price_data
                                                                                ?.product_price
                                                                        }
                                                                        /month
                                                                    </BioType>
                                                                    <Chip
                                                                        color='default'
                                                                        variant='outlined'
                                                                        label='Regular price'
                                                                        sx={{
                                                                            borderWidth:
                                                                                '2px',
                                                                        }}
                                                                    />
                                                                </div>
                                                                <BioType
                                                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                                >
                                                                    Supply ships
                                                                    every month.
                                                                    Cancel
                                                                    anytime.
                                                                </BioType>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='px-4 flex gap-3 flex-col'>
                                                            <div className='flex'>
                                                                <BioType className='it-h1 md:itd-h1 text-primary'>
                                                                    Ships every{' '}
                                                                    {getProductVariantCadenceMonths(
                                                                        variant.cadence
                                                                    ) + ' '}
                                                                    months
                                                                </BioType>
                                                            </div>

                                                            <div className='bg-[#A5EC84] w-full flex justify-center items-center py-1 rounded-md'>
                                                                <BioType className='text-black it-body md:itd-body'>
                                                                    Save $
                                                                    {
                                                                        variant
                                                                            .price_data
                                                                            ?.savings
                                                                            .yearly
                                                                    }
                                                                    /year
                                                                </BioType>
                                                            </div>

                                                            <div className='flex justify-between'>
                                                                <BioType className='it-subtlte md:itd-subtitle'>
                                                                    $
                                                                    {variant
                                                                        .price_data
                                                                        ?.product_price! /
                                                                        getProductVariantCadenceMonths(
                                                                            variant.cadence
                                                                        )!}
                                                                    /month{' '}
                                                                    <span className='line-through it-body md:itd-body text-[#9E9E9E]'>
                                                                        $
                                                                        {variant
                                                                            .price_data
                                                                            ?.savings
                                                                            .original_price! /
                                                                            getProductVariantCadenceMonths(
                                                                                variant.cadence
                                                                            )!}
                                                                        /month
                                                                    </span>
                                                                </BioType>
                                                                <Chip
                                                                    variant='outlined'
                                                                    label={`Save ${
                                                                        variant
                                                                            .price_data
                                                                            ?.savings
                                                                            ?.percent ??
                                                                        0
                                                                    }%`}
                                                                    sx={{
                                                                        color: 'black',
                                                                        borderWidth:
                                                                            '3px',
                                                                        borderColor:
                                                                            '#D2F5C1',
                                                                        backgroundColor:
                                                                            'transparent',
                                                                        '& .MuiChip-label':
                                                                            {
                                                                                color: 'black',
                                                                            },
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className='flex flex-col gap-2'>
                                                                <div>
                                                                    <BioType
                                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                                                    >
                                                                        Receive
                                                                        a{' '}
                                                                        {getProductVariantCadenceMonths(
                                                                            variant.cadence
                                                                        ) + ' '}
                                                                        month
                                                                        supply
                                                                        for $
                                                                        {
                                                                            variant
                                                                                .price_data
                                                                                ?.product_price
                                                                        }{' '}
                                                                        every{' '}
                                                                        {getProductVariantCadenceMonths(
                                                                            variant.cadence
                                                                        ) +
                                                                            ' '}{' '}
                                                                        months,
                                                                        cancel
                                                                        anytime.
                                                                    </BioType>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Button>
                                            {index ===
                                                productVariants.filter(
                                                    (
                                                        variant: ProductVariantRecord
                                                    ) =>
                                                        variant.variant_index !==
                                                        0
                                                ).length -
                                                    1 && (
                                                <div className='flex flex-wrap-reverse ml-4 mb-[-12px]'>
                                                    <div className='bg-primary px-2 py-[0.375rem] rounded-t-md'>
                                                        <BioType className='it-body md:itd-body text-white whitespace-nowrap'>
                                                            Most Popular
                                                        </BioType>
                                                    </div>
                                                </div>
                                            )}
                                        </Fragment>
                                    );
                                }
                            )}
                        </div>

                        <div
                            //In the class-name, mt-[100vh] is added to mobile to remove the button from view to avoid FOUC issues
                            className={`mt-4 animate-slideRight`}
                        >
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>

                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
}
