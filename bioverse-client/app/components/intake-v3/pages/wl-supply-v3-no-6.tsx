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
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { INTAKE_PAGE_BODY_TAILWIND } from '../styles/intake-tailwind-declarations';

import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button } from '@mui/material';
import {
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
import { sum } from 'lodash';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { continueButtonExitAnimation } from '../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import Image from 'next/image';

interface WeightlossSupplyProps {
    monthlyPrice: Partial<ProductVariantRecord>;
    bundlePrice: Partial<ProductVariantRecord>;
    biannualPrice: Partial<ProductVariantRecord> | null;
    orderData: BaseOrder;
    allowModifyPlan: boolean;
}

export default function WeightlossSupplyComponentNo6({
    monthlyPrice,
    bundlePrice,
    biannualPrice,
    orderData,
    allowModifyPlan,
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

    const bundle = bundlePrice.price_data; // (quarterly)
    const monthly = monthlyPrice.price_data;
    const biannual = biannualPrice?.price_data || null;

    const [selectedSupply, setSelectedSupply] = useState<number>(4);
    const [showMore1, setShowMore1] = useState<boolean>(false); //for monthly
    const [showMore2, setShowMore2] = useState<boolean>(false); //for biannual
    const [showMore3, setShowMore3] = useState<boolean>(false); //for bundle (quarterly)
    const [box1Checked, setBox1Checked] = useState<boolean>(false);
    const [box2Checked, setBox2Checked] = useState<boolean>(false);
    const [biannualBoxChecked, setBiannualBoxChecked] = useState<boolean>(true);

    //box 1 is quarterly
    const handleBox1CheckboxClick = () => {
        setBox1Checked(!box1Checked);
    };

    //box 2 is monthly
    const handleBox2CheckboxClick = () => {
        setBox2Checked(!box2Checked);
    };

    // 6 month
    const handleBiannualBoxCheckboxClick = () => {
        setBiannualBoxChecked(!biannualBoxChecked);
    };

    //*** need to handle biannual orders ***
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
            `/intake/prescriptions/${lookupProductHref}/wl-dosage-v3?${newSearch}`
        );
    };

    const displayCopy = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 5% of their body weight when taking semaglutide for 3 months*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average people lose 7% of their body weight in their first 3 months of using tirzepatide*';
            default:
                return '';
        }
    };
    const displayCopyMonthly = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return 'On average, people lose 2% of their weight after 1 month on semaglutide*';
            case TIRZEPATIDE_PRODUCT_HREF:
                return 'On average, people lose 2% of their weight after 1 month on tirzepatide*';
            default:
                return '';
        }
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
    const displaySourceMonthly = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return '* This is based on data from a 2022 study published the American Medical Association titled “Weight Loss Outcomes Associated With Semaglutide Treatment for Patients With Overweight or Obesity”';
            case TIRZEPATIDE_PRODUCT_HREF:
                return '* This is based on data from a 2023 study published in the Journal of the Endocrine Society titled "Adipose Tissue, Appetite, & Obesity".';
            default:
                return '';
        }
    };

    const displayBiannualStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                You&apos;ll start by injecting{' '}
                {biannualPrice?.dosages?.split(',')[0].substring(1)} weekly
            </p>
        );
    };
    const displayBundleStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                You&apos;ll start by injecting{' '}
                {bundlePrice.dosages?.split(',')[0].substring(1)} weekly
            </p>
        );
    };
    const displayMonthlyStartingDoseMessage = () => {
        return (
            <p className='intake-subtitle text-weak'>
                {monthlyPrice.price_data.dosage_instructions}
            </p>
        );
    };

    const displayBundleVialInformation = () => {
        switch (product_href) {
            case SEMAGLUTIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Semaglutide {bundlePrice.vial}
                        </BioType>
                        {/* <BioType
                            className={`inter text-sm text-black opacity-60`}
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
                        </BioType> */}
                    </div>
                );
            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`inter-h5-regular text-sm text-black `}
                        >
                            Tirzepatide {bundlePrice.vial}
                        </BioType>
                        {/* <BioType
                            className={`inter text-sm text-black opacity-60`}
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
                        </BioType> */}
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
                            className={`inter-h5-regular text-sm text-black `}
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
                            className={`inter-h5-regular text-sm text-black `}
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
                    <BioType className={`inter-h5-regular text-sm text-black `}>
                        Semaglutide {totalVialSize} mg{' '}
                    </BioType>
                );

            case TIRZEPATIDE_PRODUCT_HREF:
                return (
                    <BioType className={`inter-h5-regular text-sm text-black `}>
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
                <div className='flex flex-col space-y-2'>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        Includes:
                    </BioType>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {bundle?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials in
                                    1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {bundle?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                bundle.instructions.length
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm `}
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
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
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
                                                        <span className='text-textSecondary text-sm'>
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
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
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
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-sm'>
                        {bundle?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 2) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
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
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    {displaySource()}
                </BioType>
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure that you check in with your
                    medical provider at least once a month to adjust your dosing
                    as needed.
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
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                        >
                            Includes:
                        </BioType>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                        >
                            <ol className='ml-4 flex flex-col space-y-2'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
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
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                    >
                                        Injection needles
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                    >
                                        Alcohol pads
                                    </BioType>
                                </li>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
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
                    <div className='flex flex-col space-y-3 pb-3'>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                        >
                            Injection instructions once prescribed:
                        </BioType>
                        <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                            <li className='ml-5'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                                >
                                    {
                                        monthly?.instructions[0]
                                            .injection_instructions
                                    }
                                </BioType>
                            </li>
                        </ul>
                    </div>
                    <p className={`intake-v3-disclaimer-text text-weak`}>
                        {displaySourceMonthly()}
                    </p>
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

    const displayBiannualLearnMore = () => {
        if (biannualPrice === null || biannual === null) {
            return null;
        }
        return (
            <div className='flex flex-col space-y-4'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-2'>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        Includes:
                    </BioType>
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm normal-case text-black`}
                    >
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {biannual?.vial_sizes.length}{' '}
                                    {displayProductName(product_href)} vials in
                                    1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
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
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
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
                                                        <span className='text-textSecondary text-sm'>
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
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
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
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-sm'>
                        {biannual?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 5) {
                                    return;
                                }
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
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
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    {displaySourceBiannual()}
                </BioType>
                <BioType className={`intake-v3-disclaimer-text text-weak`}>
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure that you check in with your
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayMonthlyCardV2 = () => {
        return (
            <Button
                className={`flex flex-col px-[1.1rem] md:px-[17px]  py-3 rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case ${
                    box2Checked
                        ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                        : 'border-[#BDBDBD] border-2'
                } items-center gap-2`}
                onClick={() => {
                    if (selectedSupply !== 1) {
                        setSelectedSupply(1);
                        handleBox2CheckboxClick();
                        setBox1Checked(false);
                        setBiannualBoxChecked(false);
                    }
                }}
            >
                <div className='flex flex-row w-full items-center'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between md:space-x-3 w-full'>
                        <div className='flex flex-col '>
                            <BioType className={`intake-subtitle mb-1`}>
                                {displayCopyMonthly()}
                            </BioType>

                            <p className={`intake-subtitle-bold`}>
                                1 month supply
                            </p>

                            <BioType className={`intake-subtitle-bold`}>
                                $
                                {parseInt(
                                    String(monthly.product_price!) || '0'
                                )}
                                /month
                            </BioType>
                            {/* {monthly.discount_price.discount_amount! > 0 && (
                            <s>
                                <p
                                    className={`intake-subtitle text-strong `} style={{fontWeight: 400}}
                                    >
                                        ${monthly?.product_price}/month
                                </p>
                            </s>
                            )} */}

                            <div className='flex flex-row gap-1 inter-h5-regular text-sm text-black mt-[0.62rem] md:mt-[10px]'>
                                {displayMonthlyVialInformation()} vial
                            </div>
                            <div className='flex flex-row gap-1 intake-subtitle '>
                                {displayMonthlyStartingDoseMessage()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full text-center text-start'>
                    {!showMore1 ? (
                        <Button
                            onClick={() => setShowMore1(!showMore1)}
                            className='relative underline  p-0'
                            endIcon={<ExpandMore />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold p-0 '>
                                Learn More
                            </BioType>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowMore1(!showMore1)}
                            endIcon={<ExpandLessIcon />}
                            className='px-0 py-0'
                            size='large'
                        >
                            <p className='text-[.8125rem] text-black normal-case inter-h5-bold '>
                                See Less
                            </p>
                        </Button>
                    )}
                </div>
                {showMore1 && displayMonthlyLearnMoreV2()}
            </Button>
        );
    };

    const displayQuarterlyCard = () => {
        return (
            <Button
                className={`flex flex-col  py-3 px-[1.1rem] md:px-[17px] rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case ${
                    box1Checked
                        ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                        : 'border-[#BDBDBD] border-2'
                } items-center gap-2`}
                onClick={() => {
                    if (selectedSupply !== 3) {
                        setSelectedSupply(3);
                        handleBox1CheckboxClick();
                        setBox2Checked(false);
                        setBiannualBoxChecked(false);
                    }
                }}
            >
                <div className='flex w-full  '>
                    <div className='bg-[#A5EC84] w-full flex justify-center items-center  rounded-md'>
                        <BioType className={`intake-v3-disclaimer-text `}>
                            For a limited time, save {bundle?.savings.percent}%
                        </BioType>
                    </div>
                </div>

                <div className='flex items-center'>
                    <div className='flex flex-col  '>
                        <div className='flex justify-center mt-1 normal-case'>
                            <BioType className={`intake-subtitle `}>
                                {displayCopy()}
                            </BioType>
                        </div>

                        <div className='w-full flex justify-between'>
                            <div>
                                <div className='flex flex-col  '>
                                    <BioType
                                        className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                    >
                                        {bundle.cadence === 'quarterly' ? (
                                            <>3 month supply</>
                                        ) : null}
                                    </BioType>
                                    <BioType
                                        className={`intake-subtitle-bold `}
                                    >
                                        $
                                        {parseInt(
                                            String(
                                                bundle?.product_price_monthly
                                            )
                                        )}
                                        /month{' '}
                                    </BioType>
                                    <s>
                                        <p
                                            className={`intake-subtitle text-strong `}
                                            style={{ fontWeight: 400 }}
                                        >
                                            $
                                            {parseInt(
                                                String(
                                                    bundle?.savings.monthly
                                                ) || '0'
                                            )}
                                            /month
                                        </p>
                                    </s>
                                </div>
                            </div>
                            <div
                                className='flex flex-col justify-center items-center rounded-md py-1 px-2 max-h-[24px] mt-[0.82rem] md:mt-[14px] '
                                style={{ border: '1.5px solid #000000' }}
                            >
                                <BioType className='text-black inter-h5-regular text-sm'>
                                    save ${bundle?.savings.total}
                                </BioType>
                            </div>
                        </div>

                        <div className='mt-[0.62rem] md:mt-[10px]'>
                            {displayBundleVialInformation()}
                            {displayBundleStartingDoseMessage()}
                        </div>
                    </div>
                </div>

                <div className='w-full text-start'>
                    {!showMore3 ? (
                        <Button
                            onClick={() => setShowMore3(!showMore3)}
                            className='relative text-black underline px-0 py-0'
                            endIcon={<ExpandMore />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold p-0 '>
                                Learn More
                            </BioType>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowMore3(!showMore3)}
                            endIcon={<ExpandLessIcon />}
                            className='relative text-black underline px-0 py-0'
                            size='large'
                        >
                            <p className='text-[.8125rem] text-black normal-case inter-h5-bold'>
                                See Less
                            </p>
                        </Button>
                    )}
                </div>

                {showMore3 && displayBundleLearnMoreUpdated()}
            </Button>
        );
    };

    const displayBiannualCard = () => {
        if (biannualPrice === null) {
            return null;
        }

        return (
            <Button
                className={`flex flex-col  py-3 px-[1.1rem] md:px-[17px] rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case ${
                    biannualBoxChecked
                        ? 'border-[#98d2ea] border border-4 bg-[#f5fafc]'
                        : 'border-[#BDBDBD] border border-2'
                } items-center gap-2`}
                onClick={() => {
                    if (selectedSupply !== 4) {
                        setSelectedSupply(4);
                        handleBiannualBoxCheckboxClick();
                        setBox2Checked(false);
                        setBox1Checked(false);
                    }
                }}
            >
                <div className='flex w-full  '>
                    <div className='bg-[#A5EC84] w-full flex justify-center items-center  rounded-md'>
                        <BioType className={`intake-v3-disclaimer-text`}>
                            Lock in your 6 month plan with no price increases!
                        </BioType>
                    </div>
                </div>

                <div className='flex items-center'>
                    <div className='flex flex-col  '>
                        <div className='flex justify-center mt-1 normal-case'>
                            <BioType className={`intake-subtitle`}>
                                {displayCopyBiannual()}
                            </BioType>
                        </div>

                        <div className='w-full flex justify-between'>
                            <div>
                                <div className='flex flex-col '>
                                    <div
                                        className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                    >
                                        {biannual.cadence === 'biannually' ? (
                                            <>6 month supply</>
                                        ) : null}
                                    </div>
                                    <div className={`intake-subtitle-bold`}>
                                        $
                                        {parseInt(
                                            String(
                                                biannual?.product_price_monthly
                                            )
                                        )}
                                        /month{' '}
                                    </div>
                                    <s>
                                        <div
                                            className={`intake-subtitle text-strong `}
                                            style={{ fontWeight: 400 }}
                                        >
                                            $
                                            {parseInt(
                                                String(
                                                    biannual?.savings.monthly
                                                ) || '0'
                                            )}
                                            /month
                                        </div>
                                    </s>
                                </div>
                            </div>
                            <div
                                className='flex flex-col justify-center rounded-md py-1 px-2 max-h-[24px] mt-[0.82rem] md:mt-[14px]'
                                style={{ border: '1.5px solid #000000' }}
                            >
                                <BioType className='text-black inter-h5-regular text-sm'>
                                    save ${biannual?.savings.total}
                                </BioType>
                            </div>
                        </div>

                        <div className='mt-[0.62rem] md:mt-[10px]'>
                            {displayBiannualVialInformation()}
                            {displayBiannualStartingDoseMessage()}
                        </div>
                    </div>
                </div>

                <div className='w-full text-start'>
                    {!showMore2 ? (
                        <Button
                            onClick={() => setShowMore2(!showMore2)}
                            className='relative text-black underline px-0 py-0'
                            endIcon={<ExpandMore />}
                            size='large'
                        >
                            <BioType className='text-[.8125rem] text-black normal-case inter-h5-regular font-bold p-0 '>
                                Learn More
                            </BioType>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowMore2(!showMore2)}
                            endIcon={<ExpandLessIcon />}
                            className='relative text-black underline px-0 py-0'
                            size='large'
                        >
                            <p className='text-[.8125rem] text-black normal-case inter-h5-bold'>
                                See Less
                            </p>
                        </Button>
                    )}
                </div>

                {showMore2 && displayBiannualLearnMore()}
            </Button>
        );
    };

    //end of display functions, start of main return:

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight pb-20 lg:pb-0 `}
            >
                <div className='flex flex-col  md:max-w-[447px]'>
                    <div className='relative w-full h-[4.5rem] md:h-[110px] mt-2'>
                        <Image
                            src='/img/intake/wl/purple_banner.png'
                            alt='product'
                            layout='fill'
                            objectFit='contain'
                            className='mx-auto'
                            
                        />
                    </div>
                    <div className='flex flex-col w-full  mt-[1.15rem] md:mt-[28px]'>
                        <div className='md:max-w-[447px] mx-auto flex flex-col '>
                            <p className={`inter-h5-question-header `}>
                                How much medication would you like to receive?
                            </p>
                            <BioType
                                className={`intake-subtitle mt-[0.75rem] md:mt-[12px]`}
                            >
                                For a limited time, BIOVERSE is offering a{' '}
                                {bundle?.savings.percent}% discount on your
                                medication if you purchase a 3-month supply.
                            </BioType>
                        </div>

                        <div className='flex flex-col gap-[22px] md:mb-[48px] pt-[1.61rem] md:pt-[29px]'>
                            {/** This is commented as the 6 month offer is not being shown in this A-B test route. */}
                            {/* {biannual && (
                                <div className='w-full mb-[-22px] max-w-[520px] mx-auto'>
                                    <div className=' w-fit h-[0.75rem] md:h-[18px] px-3 py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 ml-3 flex flex-col justify-center'>
                                        <BioType className='intake-v3-disclaimer-text'>
                                            Max Savings
                                        </BioType>
                                    </div>
                                </div>
                            )}
                            {displayBiannualCard()} */}
                            {/* BOX 1 */}
                            <div className='w-full mb-[-22px] max-w-[520px] mx-auto'>
                                <div className=' w-fit h-[0.75rem] md:h-[18px] px-3 py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 ml-3 flex flex-col justify-center'>
                                    <BioType className='intake-v3-disclaimer-text'>
                                        {biannual
                                            ? 'Popular Offer'
                                            : 'Max Savings'}
                                    </BioType>
                                </div>
                            </div>
                            {displayQuarterlyCard()}
                            {/* BOX 2 */}
                            {displayMonthlyCardV2()}
                        </div>
                        <div className='mt-[66px] sm:mt-0 '>
                            {allowModifyPlan && (
                                <div className='flex flex-col items-center justify-center relative'>
                                    <div
                                        className={`fixed bottom-20 md:static z-30 md:mb-3 `}
                                    >
                                        <Button
                                            variant='contained'
                                            fullWidth
                                            sx={{
                                                width: {
                                                    xs: 'calc(100vw - 44px)',
                                                    md: '490px',
                                                },
                                                height: '52px',
                                                zIndex: 30,
                                                backgroundColor: 'white',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'lightgray',
                                                },
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                color: 'black',
                                                border: '1px solid #000000',
                                            }}
                                            onClick={pushToModifyPlan}
                                            className=' h-[3rem] md:h-[48px] w-[20rem] md:w-[490px] intake-v3-form-label-bold'
                                        >
                                            Modify my plan
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className='flex flex-col items-center justify-center relative '>
                                <ContinueButtonV3
                                    onClick={pushToNextRoute}
                                    buttonLoading={buttonLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
