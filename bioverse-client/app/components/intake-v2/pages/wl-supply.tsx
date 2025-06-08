'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';

import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button, Checkbox } from '@mui/material';
import {
    DosageInstructions,
    Instruction,
    StripePriceId,
} from '@/app/types/product-prices/product-prices-types';
import {
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import {
    updateOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { BaseOrder } from '@/app/types/orders/order-types';
import { set, sum } from 'lodash';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { continueButtonExitAnimation } from '../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface WeightlossSupplyProps {
    monthlyPrice: Partial<ProductVariantRecord>;
    bundlePrice: Partial<ProductVariantRecord>;
    biannualPrice: Partial<ProductVariantRecord> | null;
    orderData: BaseOrder;
    allowModifyPlan: boolean;
    isV2?: boolean;
}

export default function WeightlossSupplyComponent({
    monthlyPrice,
    bundlePrice,
    biannualPrice,
    orderData,
    allowModifyPlan,
    isV2 = false,
}: WeightlossSupplyProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const product_href = orderData.product_href;
    const lookupProductHref = orderData.metadata.selected_product
        ? PRODUCT_HREF.WEIGHT_LOSS
        : orderData.product_href;
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const bundle = bundlePrice.price_data;
    const monthly = monthlyPrice.price_data;
    const biannual = biannualPrice?.price_data || null;


    const [selectedSupply, setSelectedSupply] = useState<number>(4);
    const [showMore3, setShowMore3] = useState<boolean>(false);
    const [showMore2, setShowMore2] = useState<boolean>(false); //for biannual
    const [showMore1, setShowMore1] = useState<boolean>(false);
    const [box1Checked, setBox1Checked] = useState<boolean>(false);
    const [box2Checked, setBox2Checked] = useState<boolean>(false);
    const [biannualBoxChecked, setBiannualBoxChecked] = useState<boolean>(true);


    const handleBox1CheckboxClick = () => {
        setBox1Checked(!box1Checked);
    };

    const handleBox2CheckboxClick = () => {
        setBox2Checked(!box2Checked);
    };


    const handleBiannualBoxCheckboxClick = () => {
        setBiannualBoxChecked(!biannualBoxChecked);
    };


    const buildUpdateOrderPayload = () => {

        if (selectedSupply === 4 && biannualPrice?.stripe_price_ids) {
            // It's a biannual

            return {
                price_id:
                    biannualPrice.stripe_price_ids[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: biannualPrice.variant_index,
                variant_text: biannualPrice.variant,
                subscription_type: 'biannually',
                discount_id: [],
            };
        }

        if (selectedSupply === 3) {
            // It's a bundle
            return {
                price_id:
                    bundlePrice.price_data?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: bundlePrice.variant_index,
                variant_text: bundlePrice.variant,
                subscription_type: 'quarterly',
                discount_id: [],
            };
        } else {
            // It's a monthly
            return {
                price_id:
                    monthly?.stripe_price_id[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                variant_index: monthlyPrice.variant_index,
                variant_text: monthlyPrice.variant,
                subscription_type: 'monthly',
                discount_id: [],
            };
        }
    };

    const pushToNextRoute = async () => {
        setButtonLoading(true);

        // Update order's price id, variant_index, variant_text, discount
        const updatedPayload = buildUpdateOrderPayload();
        await updateOrder(orderData.id, updatedPayload);
        if (searchParams.get('sd') === '23c') {
            await updateOrderDiscount(orderData.id);
        }

        let selectedCadency;
        switch (selectedSupply) {
            case 3:
                selectedCadency = 'quarterly';
                break;
            case 4:
                selectedCadency = 'biannually';
                break;
            default:
                selectedCadency = 'monthly';
                break;
        }

        const nextRoute = getNextIntakeRoute(
            fullPath,
            lookupProductHref,
            search,
            false,
            'latest',
            selectedCadency
        );

        const searchParamsNew = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParamsNew.delete('nu');
        searchParamsNew.set('st', selectedCadency);

        if (selectedSupply === 3) {
            searchParamsNew.set('pvn', String(bundlePrice.variant_index));
        } else if (selectedSupply === 4 && biannualPrice) {
            searchParamsNew.set('pvn', String(biannualPrice.variant_index));
        } else {
            searchParamsNew.set('pvn', String(monthlyPrice.variant_index));
        }
        // if (product_href === SEMAGLUTIDE_PRODUCT_HREF) {
        //     if (searchParams.get('pvn') == '0') {
        //         if (selectedSupply === 3) {
        //             searchParamsNew.set('pvn', '6');
        //         } else {
        //             searchParamsNew.set('pvn', '2');
        //         }
        //     } else if (selectedSupply === 3) {
        //         searchParamsNew.set('pvn', String(bundlePrice.variant_index));
        //     }
        // } else if (product_href === TIRZEPATIDE_PRODUCT_HREF) {
        //     if (searchParams.get('pvn') == '0') {
        //         if (selectedSupply === 3) {
        //             searchParamsNew.set('pvn', '6');
        //         } else {
        //             searchParamsNew.set('pvn', '3');
        //         }
        //     } else if (selectedSupply === 3) {
        //         searchParamsNew.set('pvn', String(bundlePrice.variant_index));
        //     }
        // }

        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParamsNew.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${lookupProductHref}/${nextRoute}?${newSearch}`
        );
    };

    const pushToModifyPlan = () => {
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${lookupProductHref}/wl-dosage?${newSearch}`
        );
    };

    const displayCopy = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 5% of their body weight when taking semaglutide for 3 months.';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average people lose 7% of their body weight in their first 3 months of using tirzepatide';
            default:
                return '';
        }
    };

    const displaySource = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2022 study published the American Medical Association titled "Weight Loss Outcomes Associated With Semaglutide Treatment for Patients With Overweight or Obesity".';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2022 study published in the New England Journal of Medicine titled "Tirzepatide Once Weekly for the Treatment of Obesity".';
            default:
                return '';
        }
    };

    const displaySourceBiannual = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2021 study published the New New England Journal of Medicine “Once-Weekly Semaglutide in Adults with Overweight or Obesity”.';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2024 study published in the JAMA Internal Medicine Journal titled "Semaglutide vs Tirzepatide for Weight Loss in Adults With Overweight or Obesity".';
            default:
                return '';
        }
    };
    const displayIncludesMessagingBundle = () => {
        const multipleVials =
            bundle?.vial_sizes && bundle?.vial_sizes.length > 1;
        const numVials = bundle?.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text = bundle?.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === bundle.vial_sizes.length - 1 ? '' : ', '
                    }`;
                })
                .join('');
        }

        const totalVialSize = sum(bundle?.vial_sizes);

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <ul className='ml-4'>
                        <li>
                            {numVials} Semaglutide vials in 1 package ({text}){' '}
                        </li>
                        <li>Injection needles</li>
                        <li>Alcohol pads</li>
                        <li>
                            Consistent support from your care team to ensure
                            you&apos;re achieving your weight loss goals
                        </li>
                    </ul>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <ul className='ml-4'>
                        <li>
                            {numVials} Tirzepatide vials in 1 package ({text}){' '}
                        </li>
                        <li>Injection needles</li>
                        <li>Alcohol pads</li>
                        <li>
                            Consistent support from your care team to ensure
                            you&apos;re achieving your weight loss goals
                        </li>
                    </ul>
                );
            default:
                return '';
        }
    };

    const displayBundleVialInformation = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium md:-mt-2`}
                        >
                            Semaglutide {bundlePrice.vial}
                        </BioType>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-60`}
                        >
                            ({bundle?.vial_sizes.length} vials included -{' '}
                            {bundle?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index === bundle.vial_sizes.length - 1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType>
                    </div>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium`}
                        >
                            Tirzepatide {bundlePrice.vial}
                        </BioType>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-60`}
                        >
                            ({bundle?.vial_sizes.length}{' '}
                            {bundle?.vial_sizes && bundle?.vial_sizes.length > 1
                                ? 'vials'
                                : 'vial'}{' '}
                            included -{' '}
                            {bundle?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index === bundle.vial_sizes.length - 1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType>
                    </div>
                );
            default:
                return null;
        }
    };

    const displayBiannualVialInformation = () => {
        if (biannualPrice === null) {
            return null;
        }

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium md:-mt-2`}
                            >
                            Semaglutide {biannualPrice.vial}
                        </BioType>
                        {/* <BioType
                            className={`inter text-sm text-black opacity-60`}
                        >
                            ({biannual?.vial_sizes.length} vials included -{' '}
                            {biannual?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index === biannual.vial_sizes.length - 1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType> */}
                    </div>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium`}
                            >
                            Tirzepatide {biannualPrice.vial}
                        </BioType>
                        {/* <BioType
                            className={`inter text-sm text-black opacity-60`}
                        >
                            ({biannual?.vial_sizes.length}{' '}
                            {biannual?.vial_sizes && biannual?.vial_sizes.length > 1
                                ? 'vials'
                                : 'vial'}{' '}
                            included -{' '}
                            {biannual?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index === biannual.vial_sizes.length - 1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType> */}
                    </div>
                );
            default:
                return null;
        }
    };

    const displayBiannualStartingDoseMessage = () => {
        return (
            <p               className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
>
                You&apos;ll start by injecting{' '}
                {biannualPrice?.dosages?.split(',')[0].substring(1)} weekly
            </p>
        );
    };

    const displayMonthlyVialsIncluded = () => {
        const multipleVials =
            monthly?.vial_sizes && monthly?.vial_sizes.length > 1;
        const numVials = monthly?.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text = monthly?.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === monthly.vial_sizes.length - 1 ? '' : ', '
                    }`;
                })
                .join('');
        }

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
                    >
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );

            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
                    >
                        {multipleVials
                            ? `(${numVials} vials included - ${text})`
                            : ''}
                    </BioType>
                );
        }
    };

    const displayMonthlyVialInformation = () => {
        const totalVialSize = sum(monthly?.vial_sizes);

        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        Semaglutide {totalVialSize} mg{' '}
                    </BioType>
                );

            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        Tirzepatide {totalVialSize} mg{' '}
                    </BioType>
                );
        }
    };

    const displayIncludesMessagingMonthly = () => {
        const multipleVials =
            monthly?.vial_sizes && monthly?.vial_sizes.length > 1;
        const numVials = monthly?.vial_sizes.length;

        let text = '';

        if (multipleVials) {
            text = monthly?.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === monthly.vial_sizes.length - 1 ? '' : ', '
                    }`;
                })
                .join('');
        }

        const totalVialSize = sum(monthly?.vial_sizes);
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <ul className='ml-4'>
                        <li>
                            {multipleVials
                                ? `${numVials} Semaglutide vials in 1 package (${text})`
                                : '1 Semaglutide vial'}
                        </li>
                        <li>Injection needles</li>
                        <li>Alcohol pads</li>
                        <li>
                            Consistent support from your care team to ensure
                            you&apos;re achieving your weight loss goals
                        </li>
                    </ul>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <ul className='ml-4'>
                        <li>
                            {multipleVials
                                ? `${numVials} Tirzepatide vials in 1 package (${text})`
                                : '1 Tirzepatide vial'}
                        </li>
                        <li>Injection needles</li>
                        <li>Alcohol pads</li>
                        <li>
                            Consistent support from your care team to ensure
                            you&apos;re achieving your weight loss goals
                        </li>
                    </ul>
                );
            default:
                return null;
        }
    };

    const displayProductName = (name: string) => {
        switch (name) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return 'Semaglutide';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Tirzepatide';
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin';
            default:
                return name;
        }
    };

    const displayBundleLearnMoreUpdated = () => {
        return (
            <div className='flex flex-col space-y-4'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        Includes:
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5`}
                                >
                                    {bundle?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials in
                                    1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4'>
                                    {bundle?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                bundle.instructions.length
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                        >
                                                            One{' '}
                                                            {
                                                                bundle
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    bundle
                                                                        .instructions[0]
                                                                        .description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                            return (
                                                <li key={index}>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                    >
                                                        One{' '}
                                                        {
                                                            bundle.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {displayProductName(
                                                            product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary'>
                                                            {
                                                                bundle
                                                                    .instructions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    </BioType>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </BioType>
                            </li>
                        </ol>
                    </BioType>
                </div>
                {/* Injection Instructions */}
                <div className='flex flex-col space-y-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6'>
                        {bundle?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 2) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            {instruction.header}:{' '}
                                            <span className='text-textSecondary'>
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </span>
                                        </BioType>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
                {/* Source */}
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary ml-1`}
                >
                    {displaySource()}
                </BioType>
            </div>
        );
    };

    const displayBiannualLearnMoreUpdated = () => {
        return (
            <div className='flex flex-col space-y-4'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        Includes:
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5`}
                                >
                                    {biannual?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials in
                                    1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4'>
                                    {biannual?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                biannual.instructions.length
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                        >
                                                            One{' '}
                                                            {
                                                                biannual
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    biannual
                                                                        .instructions[0]
                                                                        .description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                            return (
                                                <li key={index}>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                    >
                                                        One{' '}
                                                        {
                                                            biannual.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {displayProductName(
                                                            product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary'>
                                                            {
                                                                biannual
                                                                    .instructions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    </BioType>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </BioType>
                            </li>
                        </ol>
                    </BioType>
                </div>
                {/* Injection Instructions */}
                <div className='flex flex-col space-y-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6'>
                        {biannual?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 5) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            {instruction.header}:{' '}
                                            <span className='text-textSecondary'>
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </span>
                                        </BioType>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
                {/* Source */}
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary ml-1`}
                >
                    {displaySourceBiannual()}
                </BioType>
            </div>
        );
    };

    const displayMonthlyLearnMoreV2 = () => {
        if (monthly?.vial_sizes.length === 1) {
            return (
                <div className='flex flex-col space-y-4'>
                    {/* Includes Section */}
                    <div className='flex flex-col space-y-6'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Includes:
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            <ol className='ml-4 flex flex-col space-y-2'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        One {monthly?.vial_sizes[0]} mg{' '}
                                        {displayProductName(product_href)} vial.{' '}
                                        <span className='text-textSecondary'>
                                            {
                                                monthly.instructions[0]
                                                    .description
                                            }
                                        </span>
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Injection needles
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Alcohol pads
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Consistent support from your care team
                                        to ensure you&apos;re achieving your
                                        weight loss goals
                                    </BioType>
                                </li>
                            </ol>
                        </BioType>
                    </div>
                    {/* Injection Instructions */}
                    <div className='flex flex-col space-y-3'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Injection instructions once prescribed:
                        </BioType>
                        <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                            <li className='ml-5'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}  text-textSecondary`}
                                >
                                    {
                                        monthly?.instructions[0]
                                            .injection_instructions
                                    }
                                </BioType>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }
        if (monthly?.vial_sizes && monthly?.vial_sizes.length >= 1) {
            return (
                <div className='flex flex-col space-y-4'>
                    {/* Includes Section */}
                    <div className='flex flex-col space-y-6'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Includes:
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            <ol className='ml-4 flex flex-col space-y-2'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        {monthly.vial_sizes.length}{' '}
                                        {displayProductName(product_href)} vials
                                        in 1 package
                                    </BioType>

                                    <ul className='list-disc ml-4'>
                                        {monthly.instructions.map(
                                            (
                                                instruction: Instruction,
                                                index: number
                                            ) => {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                        >
                                                            One{' '}
                                                            {
                                                                monthly
                                                                    .vial_sizes[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {displayProductName(
                                                                product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    instruction.description
                                                                }
                                                            </span>
                                                        </BioType>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Injection needles
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Alcohol pads
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Consistent support from your care team
                                        to ensure you&apos;re achieving your
                                        weight loss goals
                                    </BioType>
                                </li>
                            </ol>
                        </BioType>
                    </div>
                    {/* Injection Instructions */}
                    <div className='flex flex-col space-y-3'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Injection instructions once prescribed:
                        </BioType>
                        <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                            {monthly.instructions.map(
                                (instruction: Instruction, index: number) => {
                                    if (!instruction.injection_instructions) {
                                        return null;
                                    }
                                    return (
                                        <li className='ml-5' key={index}>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}  text-textSecondary`}
                                            >
                                                {
                                                    instruction.injection_instructions
                                                }
                                            </BioType>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                </div>
            );
        }
    };

    const displayMonthlyCardV1 = () => {
        return (
            <div
                className={`flex flex-col box-border md:py-6 md:px-[30px] py-4 px-2 inset-[1px] rounded-[4px] border-solid ${
                    box2Checked
                        ? 'border-[#286BA2] border'
                        : 'border-[#BDBDBD] border'
                } items-center gap-2`}
                style={box2Checked ? { boxShadow: '0 0 0 1px #286BA2' } : {}}
            >
                <div className='flex flex-row w-full items-center'>
                    <div className='flex pt-[2.375rem] pr-3'>
                        <Checkbox
                            size='medium'
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            sx={{
                                height: '36px',
                                width: '36px',
                                bottom: 0,
                            }}
                            checked={selectedSupply == 1}
                            onChange={() => {
                                if (selectedSupply !== 1) {
                                    setSelectedSupply(1);
                                    handleBox2CheckboxClick();
                                    setBox1Checked(false);
                                }
                            }}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div className='w-full'>
                            <BioType
                                className={`itd-subtitle !text-[1rem] md:!text-[1.25rem] mb-1`}
                            >
                                1-month supply
                            </BioType>
                            <BioType
                                className={`${INTAKE_INPUT_TAILWIND} !text-[1rem] md:!text-[1.25rem] mb-1`}
                            >
                                ${monthly?.product_price}
                            </BioType>
                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} !font-twcsemimedium`}
                            >
                                {/* $
                                                    {monthly?.product_price! -
                                                        monthly?.discount_price
                                                            ?.discount_amount!}{' '}
                                                    for your next month of
                                                    semaglutide <br /> */}
                                {/* <span className="text-[#FFFFF] opacity-[.38]">
                                                        
                                                            $
                                                            {
                                                                monthly?.product_price
                                                            }
                                                            /month
                                                        
                                                    </span> */}
                            </BioType>
                            {/* <BioType
                                                    className={`${INTAKE_INPUT_TAILWIND} !font-twcsemimedium`}
                                                >
                                                    From $
                                                    {monthly?.daily_price.toFixed(
                                                        2,
                                                    )}
                                                    /day
                                                </BioType> */}
                            {displayMonthlyVialInformation()}
                        </div>
                        {/* IMAGE */}
                        {/* <div
                                                className="flex md:items-center"
                                                style={{ position: 'relative' }}
                                            >
                                                <div className="w-[24px] h-[60px] ml-3 md:w-[76px] aspect-[4/3] relative">
                                                    <Image
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            left: '0',
                                                        }}
                                                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${productData?.image_ref_transparent[0]}`}
                                                        alt={'Semaglutide'}
                                                        fill
                                                        objectFit="cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div> */}
                    </div>
                </div>
                <div className='w-full text-center'>
                    {!showMore1 ? (
                        <Button
                            onClick={() => setShowMore1(!showMore1)}
                            className='relative'
                            endIcon={<ExpandMore />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem]'>
                                Learn More
                            </BioType>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowMore1(!showMore1)}
                            endIcon={<ExpandLessIcon />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem]'>
                                See Less
                            </BioType>
                        </Button>
                    )}
                </div>
                {isV2 && showMore1 && displayMonthlyLearnMoreV2()}
                {!isV2 && showMore1 && (
                    <div
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary w-full`}
                    >
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Includes:
                        </BioType>{' '}
                        {displayIncludesMessagingMonthly()}
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} mt-4`}
                        >
                            Injection instructions prescribed:
                        </BioType>{' '}
                        <ul className='ml-4 '>
                            <li>{monthly?.dosage_instructions}</li>
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const displayMonthlyCardV2 = () => {
        return (
            <div
                className={`flex flex-col box-border md:py-1 md:px-4 px-2 inset-[1px] rounded-[4px] ${
                    showMore1 ? 'pb-4' : 'pb-0'
                } border-solid ${
                    box2Checked
                        ? 'border-[#286BA2] border'
                        : 'border-[#BDBDBD] border'
                } items-center gap-2`}
                style={box2Checked ? { boxShadow: '0 0 0 1px #286BA2' } : {}}
            >
                <div className='flex flex-row w-full items-center'>
                    <div className='flex pr-3'>
                        <Checkbox
                            size='medium'
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            sx={{
                                height: '36px',
                                width: '36px',
                                bottom: 0,
                            }}
                            checked={selectedSupply == 1}
                            onChange={() => {
                                if (selectedSupply !== 1) {
                                    setSelectedSupply(1);
                                    handleBox2CheckboxClick();
                                    setBox1Checked(false);
                                    setBiannualBoxChecked(false);
                                }
                            }}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between md:space-x-3 w-full'>
                        <div className='flex items-center space-x-1'>
                            <div className='flex flex-col'>
                                <BioType
                                    className={`${INTAKE_INPUT_TAILWIND} !text-[1rem] md:!text-[1.25rem]`}
                                >
                                    ${monthly?.product_price}
                                </BioType>
                            </div>
                            <BioType
                                className={`itd-subtitle !text-[1rem] md:!text-[1.25rem]`}
                            >
                                for 1-month supply
                            </BioType>
                        </div>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} !font-twcsemimedium`}
                        >
                            {/* $
                                                        {monthly?.product_price! -
                                                            monthly?.discount_price
                                                                ?.discount_amount!}{' '}
                                                        for your next month of
                                                        semaglutide <br /> */}
                            {/* <span className="text-[#FFFFF] opacity-[.38]">
                                                            
                                                                $
                                                                {
                                                                    monthly?.product_price
                                                                }
                                                                /month
                                                            
                                                        </span> */}
                        </BioType>
                        {/* <BioType
                                                        className={`${INTAKE_INPUT_TAILWIND} !font-twcsemimedium`}
                                                    >
                                                        From $
                                                        {monthly?.daily_price.toFixed(
                                                            2,
                                                        )}
                                                        /day
                                                    </BioType> */}

                        <div className='flex flex-1 md:justify-end'>
                            {displayMonthlyVialInformation()}
                        </div>
                    </div>
                    {/* IMAGE */}
                    {/* <div
                                                    className="flex md:items-center"
                                                    style={{ position: 'relative' }}
                                                >
                                                    <div className="w-[24px] h-[60px] ml-3 md:w-[76px] aspect-[4/3] relative">
                                                        <Image
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                left: '0',
                                                            }}
                                                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${productData?.image_ref_transparent[0]}`}
                                                            alt={'Semaglutide'}
                                                            fill
                                                            objectFit="cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                </div> */}
                </div>
                <div className='flex w-full ml-[100px]'>
                    {displayMonthlyVialsIncluded()}
                </div>

                <div className='w-full text-center'>
                    {!showMore1 ? (
                        <Button
                            onClick={() => setShowMore1(!showMore1)}
                            className='relative'
                            endIcon={<ExpandMore />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem]'>
                                Learn More
                            </BioType>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowMore1(!showMore1)}
                            endIcon={<ExpandLessIcon />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem]'>
                                See Less
                            </BioType>
                        </Button>
                    )}
                </div>
                {isV2 && showMore1 && displayMonthlyLearnMoreV2()}
                {!isV2 && showMore1 && (
                    <div
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary w-full`}
                    >
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Includes:
                        </BioType>{' '}
                        {displayIncludesMessagingMonthly()}
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} mt-4`}
                        >
                            Injection instructions prescribed:
                        </BioType>{' '}
                        <ul className='ml-4 '>
                            <li>{monthly?.dosage_instructions}</li>
                        </ul>
                    </div>
                )}
            </div>
        );
    };



    const displayBiannualCard = () => {
        if (biannualPrice === null) {
            return null;
        }

        return (
            <div
            className={`flex flex-col box-border md:py-6 md:px-[30px] py-4 px-2 rounded-[4px] border-solid ${
                biannualBoxChecked
                    ? 'border-[#286BA2] border'
                    : 'border-[#BDBDBD] border'
            } items-center gap-2`}
            style={
                biannualBoxChecked
                    ? { boxShadow: '0 0 0 1px #286BA2' }
                    : {}
            }
        >
            <div className='flex gap-4 w-full'>
                {/* <Chip
                    size="medium"
                    label="Selected Supply"
                    color="primary"
                /> */}

                <div className='bg-[#A5EC84] w-full flex justify-center items-center py-1 rounded-md'>
                    <BioType className='text-black it-body md:itd-body'>
                        Lock in your 6 month plan with no price increases!

                    </BioType>
                </div>

                {/* <Chip
                    variant="filled"
                    size="medium"
                    label={`For a limited time, save $${bundle?.savings.total}!`}
                    sx={{
                        background:
                            'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                        color: 'white', // Optional: Set text color to white for better visibility
                    }}
                /> */}
            </div>

            <div className='flex mt-1.5 items-center'>
                <div className='flex flex-col pt-[2.375rem] pr-3 justify-start'>
                    <Checkbox
                        size='medium'
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={
                            <RadioButtonCheckedIcon />
                        }
                        sx={{
                            height: '36px',
                            width: '36px',
                            bottom: 0,
                        }}
                        checked={selectedSupply === 4}
                        onChange={() => {
                            if (selectedSupply !== 4) {
                                setSelectedSupply(4);
                                handleBiannualBoxCheckboxClick();
                                setBox2Checked(false);
                                setBox1Checked(false);
                            }
                        }}
                    />
                </div>
                <div className='flex flex-col space-y-2'>
                    <div className='flex justify-center mt-1'>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-primary `}
                        >
                            {displayCopyBiannual()}
                        </BioType>
                    </div>
                    <div className='w-full flex justify-between'>
                        <div>
                            <div className='flex flex-col md:space-x-1 md:flex-row'>
                                <s>
                                    <BioType
                                        className={`${INTAKE_INPUT_TAILWIND} text-[#FFFFF] opacity-[.38]`}
                                    >
                                        $
                                        {parseInt(
                                            String(
                                                biannual
                                                    ?.savings
                                                    .monthly
                                            ) || '0'
                                        )}
                                        /month
                                    </BioType>
                                </s>
                                <BioType
                                    className={`${INTAKE_INPUT_TAILWIND}`}
                                >
                                    $
                                    {parseInt(
                                        String(
                                            biannual?.product_price_monthly
                                        )
                                    )}
                                    /month{' '}
                                </BioType>
                            </div>

                            {/* <BioType
                                className={`${INTAKE_INPUT_TAILWIND}`}
                            >
                                From $
                                {bundle?.savings.daily.toFixed(
                                    2,
                                )}
                                /day
                            </BioType> */}
                        </div>
                        <div className='bg-[#A5EC84] rounded-md py-1 px-3 max-h-[24px]'>
                            <BioType className='text-black it-body md:itd-body'>
                                save $
                                {biannual?.savings.total}
                            </BioType>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        {displayBiannualVialInformation()}
                        {displayBiannualStartingDoseMessage()}
                    </div>
                </div>
            </div>

            <div className='flex flex-row w-full'>
                <div className='w-full'>
                    <div className='flex flex-row'>
                        <div className='flex flex-row '>
                            <div className='flex flex-col space-y-2'>
                          
                            </div>
                        
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full text-center'>
                {!showMore2 ? (
                    <Button
                        onClick={() =>
                            setShowMore2(!showMore2)
                        }
                        className='relative'
                        endIcon={<ExpandMore />}
                        size='large'
                    >
                        <BioType className='text-[.8125rem]'>
                            Learn More
                        </BioType>
                    </Button>
                ) : (
                    <Button
                        onClick={() =>
                            setShowMore2(!showMore2)
                        }
                        endIcon={<ExpandLessIcon />}
                        size='large'
                    >
                        <BioType className='text-[.8125rem]'>
                            See Less
                        </BioType>
                    </Button>
                )}
            </div>
            {isV2 &&
                showMore2 &&
                displayBiannualLearnMoreUpdated()}
            {!isV2 && showMore3 && (
                <div
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary w-full`}
                >
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                    >
                        Includes:
                    </BioType>{' '}
                    {displayIncludesMessagingBundle()}
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} mt-4`}
                    >
                        Injection instructions prescribed:
                    </BioType>{' '}
                    <ul className='ml-4 '>
                        {biannual?.dosage_instructions.map(
                            (
                                item: DosageInstructions,
                                index: number
                            ) => {
                                return (
                                    <li key={index}>
                                        {item.header}:{' '}
                                        {item.subtitle}
                                    </li>
                                );
                            }
                        )}
                    </ul>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} mt-4`}
                    >
                        {displaySourceBiannual()}
                    </BioType>{' '}
                </div>
            )}
        </div>
        );
    };
    const displayCopyBiannual = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 13.8% of their body weight when taking semaglutide for 6 months*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average, people lose 10.1% of their body weight when taking tirzepatide for 6 months*';
            default:
                return '';
        }
    };

    //end of display functions, start of main return

    return (
        <>
            <div className={`justify-center flex animate-slideRight sm:pb-10`}>
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-6'>
                        <BioType
                            className={`${TRANSITION_HEADER_TAILWIND} !text-primary`}
                        >
                            Tell us how much medication you&apos;d like to
                            receive.
                        </BioType>

                        {biannual ? (
                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            For a limited time, BIOVERSE is offering a{' '}
                            {biannual?.savings.percent}% discount on your
                            medication if you purchase a 6-month supply.
                            </BioType>
                        ) : (
                        
                            <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                                For a limited time, BIOVERSE is offering a{' '}
                                {bundle?.savings.percent}% discount on your
                                medication if you purchase a 3-month supply.
                            </BioType>
                        )}
                        
                        <div className='flex flex-col gap-[22px] sm:mb-[100px] md:mb-0 ' >

                            {biannual && (
                                <div className='bg-[#286BA2] mb-[-22px] w-fit px-4 py-2 rounded-t-lg'>
                                    <BioType className='it-body md:itd-body text-white '>
                                    Max Savings
                                    </BioType>
                                </div>
                            )}
                            
                            {displayBiannualCard()}


                            {biannual ? (
                                   <div className='bg-[#286BA2] mb-[-22px] w-fit px-4 py-2 rounded-t-lg'>
                                   <BioType className='it-body md:itd-body text-white '>
                                       Popular Offer
                                   </BioType>
                               </div>
                            ) : (
                                <div className='bg-[#286BA2] mb-[-22px] w-fit px-4 py-2 rounded-t-lg'>
                                    <BioType className='it-body md:itd-body text-white '>
                                        Most Popular: 3-month supply
                                    </BioType>
                                </div>
                            )}

                            {/* BOX 1 */}
                            <div
                                className={`flex flex-col box-border md:py-6 md:px-[30px] py-4 px-2 rounded-[4px] border-solid  ${
                                    box1Checked
                                        ? 'border-[#286BA2] border'
                                        : 'border-[#BDBDBD] border'
                                } items-center gap-2`}
                                style={
                                    box1Checked
                                        ? { boxShadow: '0 0 0 1px #286BA2' }
                                        : {}
                                }
                            >
                                <div className='flex gap-4 w-full'>
                                    {/* <Chip
                                        size="medium"
                                        label="Selected Supply"
                                        color="primary"
                                    /> */}

                                    <div className='bg-[#A5EC84] w-full flex justify-center items-center py-1 rounded-md'>
                                        <BioType className='text-black it-body md:itd-body'>
                                            For a limited time, save{' '}
                                            {bundle?.savings.percent}%
                                        </BioType>
                                    </div>

                                    {/* <Chip
                                        variant="filled"
                                        size="medium"
                                        label={`For a limited time, save $${bundle?.savings.total}!`}
                                        sx={{
                                            background:
                                                'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                            color: 'white', // Optional: Set text color to white for better visibility
                                        }}
                                    /> */}
                                </div>

                                <div className='flex mt-1.5 items-center'>
                                    <div className='flex flex-col pt-[2.375rem] pr-3 justify-start'>
                                        <Checkbox
                                            size='medium'
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={
                                                <RadioButtonCheckedIcon />
                                            }
                                            sx={{
                                                height: '36px',
                                                width: '36px',
                                                bottom: 0,
                                            }}
                                            checked={selectedSupply === 3}
                                            onChange={() => {
                                                if (selectedSupply !== 3) {
                                                    setSelectedSupply(3);
                                                    handleBox1CheckboxClick();
                                                    setBox2Checked(false);
                                                    setBiannualBoxChecked(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-center mt-1'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} !text-primary `}
                                            >
                                                {displayCopy()}
                                            </BioType>
                                        </div>
                                        <div className='w-full flex justify-between'>
                                            <div>
                                                <div className='flex flex-col md:space-x-1 md:flex-row'>
                                                    <s>
                                                        <BioType
                                                            className={`${INTAKE_INPUT_TAILWIND} text-[#FFFFF] opacity-[.38]`}
                                                        >
                                                            $
                                                            {parseInt(
                                                                String(
                                                                    bundle
                                                                        ?.savings
                                                                        .monthly
                                                                ) || '0'
                                                            )}
                                                            /month
                                                        </BioType>
                                                    </s>
                                                    <BioType
                                                        className={`${INTAKE_INPUT_TAILWIND}`}
                                                    >
                                                        $
                                                        {parseInt(
                                                            String(
                                                                bundle?.product_price_monthly
                                                            )
                                                        )}
                                                        /month{' '}
                                                    </BioType>
                                                </div>

                                                {/* <BioType
                                                    className={`${INTAKE_INPUT_TAILWIND}`}
                                                >
                                                    From $
                                                    {bundle?.savings.daily.toFixed(
                                                        2,
                                                    )}
                                                    /day
                                                </BioType> */}
                                            </div>
                                            <div className='bg-[#A5EC84] rounded-md py-1 px-3 max-h-[24px]'>
                                                <BioType className='text-black it-body md:itd-body'>
                                                    save $
                                                    {bundle?.savings.total}
                                                </BioType>
                                            </div>
                                        </div>
                                        {displayBundleVialInformation()}
                                    </div>
                                </div>

                                <div className='flex flex-row w-full'>
                                    <div className='w-full'>
                                        <div className='flex flex-row'>
                                            <div className='flex flex-row '>
                                                <div className='flex flex-col space-y-2'>
                                                    {/* <BioType
                                                        className={`${INTAKE_INPUT_TAILWIND} !text-[1rem] md:!text-[1.25rem] mb-1`}
                                                    >
                                                        {
                                                            bundle?.savings
                                                                .percent
                                                        }
                                                        % off a 3-month supply
                                                        of medication
                                                    </BioType> */}
                                                </div>
                                                {/* IMAGES */}
                                                {/* <div
                                                    className="flex"
                                                    style={{
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <div
                                                        className="w-[48px] md:w-[76px] aspect-square relative"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            left: '0',
                                                        }}
                                                    >
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${productData?.image_ref_transparent[0]}`}
                                                            alt={'Semaglutide'}
                                                            fill
                                                            objectFit="cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div
                                                        className="w-[48px] md:w-[76px] aspect-square relative"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            left: '10px',
                                                        }}
                                                    >
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${productData?.image_ref_transparent[0]}`}
                                                            alt={'Semaglutide '}
                                                            fill
                                                            objectFit="cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div
                                                        className="w-[48px] md:w-[76px] aspect-square relative"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            left: '20px',
                                                        }}
                                                    >
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${productData?.image_ref_transparent[0]}`}
                                                            alt={'Semaglutide '}
                                                            fill
                                                            objectFit="cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full text-center'>
                                    {!showMore3 ? (
                                        <Button
                                            onClick={() =>
                                                setShowMore3(!showMore3)
                                            }
                                            className='relative'
                                            endIcon={<ExpandMore />}
                                            size='large'
                                        >
                                            <BioType className='text-[.8125rem]'>
                                                Learn More
                                            </BioType>
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                setShowMore3(!showMore3)
                                            }
                                            endIcon={<ExpandLessIcon />}
                                            size='large'
                                        >
                                            <BioType className='text-[.8125rem]'>
                                                See Less
                                            </BioType>
                                        </Button>
                                    )}
                                </div>
                                {isV2 &&
                                    showMore3 &&
                                    displayBundleLearnMoreUpdated()}
                                {!isV2 && showMore3 && (
                                    <div
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary w-full`}
                                    >
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            Includes:
                                        </BioType>{' '}
                                        {displayIncludesMessagingBundle()}
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} mt-4`}
                                        >
                                            Injection instructions prescribed:
                                        </BioType>{' '}
                                        <ul className='ml-4 '>
                                            {bundle?.dosage_instructions.map(
                                                (
                                                    item: DosageInstructions,
                                                    index: number
                                                ) => {
                                                    return (
                                                        <li key={index}>
                                                            {item.header}:{' '}
                                                            {item.subtitle}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} mt-4`}
                                        >
                                            {displaySource()}
                                        </BioType>{' '}
                                    </div>
                                )}
                            </div>

                            {/* BOX 2 */}
                            {isV2 && displayMonthlyCardV2()}
                            {!isV2 && displayMonthlyCardV1()}
                            {allowModifyPlan && (
                                <Button
                                    variant='outlined'
                                    fullWidth
                                    sx={{
                                        height: 52,
                                    }}
                                    onClick={pushToModifyPlan}
                                >
                                    Modify My Plan
                                </Button>
                            )}
                        </div>
                        <div className='mt-[66px] sm:mt-0'>
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
