'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button, Chip, Paper } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Instruction } from '@/app/types/product-prices/product-prices-types';
import { INTAKE_PAGE_BODY_TAILWIND } from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getProductName } from '@/app/utils/functions/formatting';
import { sum } from 'lodash';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { USStates } from '@/app/types/enums/master-enums';

interface DosageOptionProps {
    priceData: Partial<ProductVariantRecord> | null;
    dosage: string | undefined;
    renewalOrder: RenewalOrder;
    selectedDosagePlan: number | undefined;
    setSelectedDosagePlan: Dispatch<SetStateAction<number>>;
    quvi?: string | undefined;
}

export default function DosageOptionV2({
    priceData,
    dosage,
    renewalOrder,
    selectedDosagePlan,
    setSelectedDosagePlan,
    quvi, //quarterly variant index
}: DosageOptionProps) {
    const [learnMoreExpanded, setLearnMoreExpanded] = useState<boolean>(false);

    if (!priceData || !dosage) {
        return null;
    }

    /*
     * if the quvi (quarterly variant index url param) is supplied, that means that the patient came back from the choose-plan flow.
     * The quvi variant index is the quarterly variant index that they narrowed down to in the choose-plan flow...
     * ...so if the quvi is specified, and the variant index of the quarterly option being rendered here does not match, then don't render the component
     * the choose plan flow is to deal with situations where there are multiple quarterly options available, and the patient needs to narrow down to one.
     */
    if (
        quvi &&
        priceData.cadence === 'quarterly' &&
        Number(quvi) !== priceData.variant_index
    ) {
        return null;
    }

    if (
        renewalOrder.state === USStates.California &&
        (renewalOrder.product_href === PRODUCT_HREF.TIRZEPATIDE ||
            renewalOrder.product_href === PRODUCT_HREF.SEMAGLUTIDE) &&
        priceData.cadence !== 'monthly'
    ) {
        return null;
    }
    // if (bivi && priceData.cadence === 'biannually' && Number(bivi) !== priceData.variant_index) {
    //     return null;
    // }
    // if (yrvi && priceData.cadence === 'yearly' && Number(yrvi) !== priceData.variant_index) {
    //     return null;
    // }

    //this is a temporary fix to hide the annually option
    //since some people were already suggested the annually option
    //and this is quicker than writing a script to remove them from the database
    if (priceData.cadence === 'annually') {
        return null;
    }

    const displayMonthlyLearnMore = () => {
        if (priceData?.price_data?.vial_sizes.length === 1) {
            return (
                <div className='flex flex-col space-y-4 text-start mt-4 '>
                    {/* Includes Section */}
                    <div className='flex flex-col space-y-6'>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                        >
                            Includes:
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            <ol className='ml-4 flex flex-col space-y-2 text-sm'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                    >
                                        One{' '}
                                        {priceData?.price_data?.vial_sizes[0]}{' '}
                                        mg{' '}
                                        {getProductName(
                                            renewalOrder.product_href
                                        )}{' '}
                                        vial.{' '}
                                        <span className='text-textSecondary'>
                                            {
                                                priceData?.price_data
                                                    ?.instructions[0]
                                                    .description
                                            }
                                        </span>
                                    </BioType>
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
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                        >
                            Injection instructions once prescribed:
                        </BioType>
                        <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                            <li className='ml-5'>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                >
                                    {
                                        priceData?.price_data?.instructions[0]
                                            .injection_instructions
                                    }
                                </BioType>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }
        if (
            priceData?.price_data?.vial_sizes &&
            priceData?.price_data?.vial_sizes.length >= 1
        ) {
            return (
                <div className='flex flex-col space-y-4 mt-4'>
                    {/* Includes Section */}
                    <div className='flex flex-col space-y-6 text-start'>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                        >
                            Includes:
                        </BioType>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                        >
                            <ol className='ml-4 flex flex-col space-y-2'>
                                <li>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        {
                                            priceData?.price_data.vial_sizes
                                                .length
                                        }{' '}
                                        {getProductName(
                                            renewalOrder.product_href
                                        )}{' '}
                                        vials in 1 package
                                    </BioType>

                                    <ul className='list-disc ml-4'>
                                        {priceData?.price_data?.instructions.map(
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
                                                                priceData
                                                                    ?.price_data
                                                                    ?.vial_sizes?.[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {getProductName(
                                                                renewalOrder.product_href
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
                            {priceData?.price_data?.instructions.map(
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
                    <BioType
                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                    >
                        Do not increase your dose without consulting with your
                        provider. After your first four weeks of treatment,
                        please complete a dosage update request via your secure
                        BIOVERSE portal. Please also ensure you check in with
                        your BIOVERSE medical provider at least once a month to
                        adjust your dosing as needed.
                    </BioType>
                </div>
            );
        }
    };

    const displayBundleLearnMoreUpdated = () => {
        return (
            <div className='flex flex-col space-y-4 mt-4'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6 text-start'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Includes:
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        <ol className='ml-4 flex flex-col space-y-2 text-sm'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {priceData?.price_data?.vial_sizes?.length}{' '}
                                    {getProductName(renewalOrder.product_href)}{' '}
                                    vials in 1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {priceData?.price_data?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                (priceData?.price_data
                                                    ?.instructions?.length ?? 0)
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                                        >
                                                            One{' '}
                                                            {
                                                                priceData
                                                                    ?.price_data
                                                                    ?.vial_sizes?.[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {getProductName(
                                                                renewalOrder.product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    priceData
                                                                        ?.price_data
                                                                        ?.instructions?.[0]
                                                                        ?.description
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
                                                            priceData
                                                                ?.price_data
                                                                ?.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {getProductName(
                                                            renewalOrder.product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary text-sm'>
                                                            {
                                                                priceData
                                                                    ?.price_data
                                                                    ?.instructions[
                                                                    index
                                                                ]?.description
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
                <div className='flex flex-col space-y-3 text-start text-sm'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-start'>
                        {priceData?.price_data?.instructions.map(
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
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary text-sm text-start`}
                >
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure you check in with your BIOVERSE
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayBiannualLearnMore = () => {
        return (
            <div className='flex flex-col space-y-4 mt-4'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6 text-start'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Includes:
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        <ol className='ml-4 flex flex-col space-y-2 text-sm'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {priceData?.price_data?.vial_sizes?.length}{' '}
                                    {getProductName(renewalOrder.product_href)}{' '}
                                    vials in 1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {priceData?.price_data?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                (priceData?.price_data
                                                    ?.instructions?.length ?? 0)
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                                        >
                                                            One{' '}
                                                            {
                                                                priceData
                                                                    ?.price_data
                                                                    ?.vial_sizes?.[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {getProductName(
                                                                renewalOrder.product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    priceData
                                                                        ?.price_data
                                                                        ?.instructions?.[0]
                                                                        ?.description
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
                                                            priceData
                                                                ?.price_data
                                                                ?.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {getProductName(
                                                            renewalOrder.product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary text-sm'>
                                                            {
                                                                priceData
                                                                    ?.price_data
                                                                    ?.instructions[
                                                                    index
                                                                ]?.description
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
                <div className='flex flex-col space-y-3 text-start text-sm'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-start'>
                        {priceData?.price_data?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 11) {
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
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary text-sm text-start`}
                >
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure you check in with your BIOVERSE
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayAnnualLearnMore = () => {
        return (
            <div className='flex flex-col space-y-4 mt-4'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6 text-start'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Includes:
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        <ol className='ml-4 flex flex-col space-y-2 text-sm'>
                            <li>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mb-1.5 text-sm`}
                                >
                                    {priceData?.price_data?.vial_sizes?.length}{' '}
                                    {getProductName(renewalOrder.product_href)}{' '}
                                    vials in 2 packages (shipped every 6 months)
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4 text-sm'>
                                    {priceData?.price_data?.vial_sizes.map(
                                        (vial_size: number, index: number) => {
                                            if (
                                                index >=
                                                (priceData?.price_data
                                                    ?.instructions?.length ?? 0)
                                            ) {
                                                return (
                                                    <li key={index}>
                                                        <BioType
                                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}
                                                        >
                                                            One{' '}
                                                            {
                                                                priceData
                                                                    ?.price_data
                                                                    ?.vial_sizes?.[
                                                                    index
                                                                ]
                                                            }{' '}
                                                            mg{' '}
                                                            {getProductName(
                                                                renewalOrder.product_href
                                                            )}{' '}
                                                            vial.{' '}
                                                            <span className='text-textSecondary'>
                                                                {
                                                                    priceData
                                                                        ?.price_data
                                                                        ?.instructions?.[0]
                                                                        ?.description
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
                                                            priceData
                                                                ?.price_data
                                                                ?.vial_sizes[
                                                                index
                                                            ]
                                                        }{' '}
                                                        mg{' '}
                                                        {getProductName(
                                                            renewalOrder.product_href
                                                        )}{' '}
                                                        vial.{' '}
                                                        <span className='text-textSecondary text-sm'>
                                                            {
                                                                priceData
                                                                    ?.price_data
                                                                    ?.instructions[
                                                                    index
                                                                ]?.description
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
                <div className='flex flex-col space-y-3 text-start text-sm'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND} text-sm`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6 text-start'>
                        {priceData?.price_data?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                if (index > 11) {
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
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary text-sm text-start`}
                >
                    Do not increase your dose without consulting with your
                    provider. After your first four weeks of treatment, please
                    complete a dosage update request via your secure BIOVERSE
                    portal. Please also ensure you check in with your BIOVERSE
                    medical provider at least once a month to adjust your dosing
                    as needed.
                </BioType>
            </div>
        );
    };

    const displayMonthlyVialInformation = () => {
        const totalVialSize = sum(priceData?.price_data?.vial_sizes);
        const multipleVials =
            priceData?.price_data?.vial_sizes &&
            priceData?.price_data?.vial_sizes.length > 1;

        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <BioType
                        className={`intake-subtitle text-black w-full text-star mt-1`}
                    >
                        {multipleVials
                            ? `Semaglutide ${totalVialSize} mg`
                            : `1 vial of Semaglutide ${totalVialSize} mg`}
                    </BioType>
                );

            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <BioType
                        className={`intake-subtitle text-black w-full text-start mt-1`}
                    >
                        Tirzepatide {totalVialSize} mg{' '}
                    </BioType>
                );
        }
    };

    const displayMonthlyVialsIncluded = () => {
        const multipleVials =
            priceData?.price_data?.vial_sizes &&
            priceData?.price_data?.vial_sizes.length > 1;
        const numVials = priceData?.price_data?.vial_sizes.length;

        let text = '';

        if (
            multipleVials &&
            priceData?.price_data &&
            Array.isArray(priceData.price_data.vial_sizes)
        ) {
            text = priceData.price_data.vial_sizes
                .map((vialSize: any, index: number) => {
                    return `${vialSize} mg${
                        index === priceData.price_data!.vial_sizes.length - 1
                            ? ''
                            : ', '
                    }`;
                })
                .join('');
        }

        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div>
                        {displayMonthlyVialInformation()}
                        <BioType
                            className={`intake-subtitle text-black opacity-60`}
                        >
                            {multipleVials
                                ? `(${numVials} ${
                                      numVials == '1' ? 'vial' : 'vials'
                                  } included - ${text})`
                                : ''}
                        </BioType>
                    </div>
                );

            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <div>
                        {displayMonthlyVialInformation()}{' '}
                        <BioType
                            className={`intake-subtitle text-black opacity-60`}
                        >
                            {multipleVials
                                ? `(${numVials} ${
                                      numVials == '1' ? 'vial' : 'vials'
                                  } included - ${text})`
                                : ''}
                        </BioType>
                    </div>
                );
        }
    };

    const displayBiannualVialInformation = () => {
        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Semaglutide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-black opacity-60 text-start`}
                        >
                            ({priceData?.price_data?.vial_sizes.length}
                            {priceData?.price_data?.vial_sizes.length == '1'
                                ? ' vial '
                                : ' vials '}
                            included -{' '}
                            {priceData?.price_data?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index ===
                                        priceData.price_data!.vial_sizes
                                            .length -
                                            1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType>
                    </div>
                );
            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <div>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Tirzepatide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle  text-black opacity-60 text-start`}
                        >
                            (
                            {priceData.price_data?.vial_sizes.length > 1
                                ? ' vials '
                                : ' vial '}{' '}
                            included -{' '}
                            {priceData?.price_data?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index ===
                                        priceData?.price_data.vial_sizes
                                            .length -
                                            1
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

    const displayAnnualVialInformation = () => {
        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Semaglutide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-black opacity-60 text-start`}
                        >
                            ({priceData?.price_data?.vial_sizes.length}
                            {priceData?.price_data?.vial_sizes.length == '1'
                                ? ' vial '
                                : ' vials '}
                            included -{' '}
                            {priceData?.price_data?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index ===
                                        priceData.price_data!.vial_sizes
                                            .length -
                                            1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-weak   text-start`}
                        >
                            Ships every 6 months
                        </BioType>
                    </div>
                );
            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <div>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Tirzepatide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle  text-black opacity-60 text-start`}
                        >
                            (
                            {priceData.price_data?.vial_sizes.length > 1
                                ? ' vials '
                                : ' vial '}{' '}
                            included -{' '}
                            {priceData?.price_data?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index ===
                                        priceData?.price_data.vial_sizes
                                            .length -
                                            1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-weak   text-start`}
                        >
                            Ships every 6 months
                        </BioType>
                    </div>
                );
            default:
                return null;
        }
    };

    const displayBundleVialInformation = () => {
        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Semaglutide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-black opacity-60 text-start`}
                        >
                            ({priceData?.price_data?.vial_sizes.length}
                            {priceData?.price_data?.vial_sizes.length == '1'
                                ? ' vial '
                                : ' vials '}
                            included -{' '}
                            {priceData?.price_data?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index ===
                                        priceData.price_data!.vial_sizes
                                            .length -
                                            1
                                            ? ')'
                                            : ', '
                                    }`;
                                }
                            )}
                        </BioType>
                    </div>
                );
            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <div>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Tirzepatide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-black opacity-60 text-start`}
                        >
                            (
                            {priceData.price_data?.vial_sizes.length > 1
                                ? ' vials '
                                : ' vial '}{' '}
                            included -{' '}
                            {priceData?.price_data?.vial_sizes.map(
                                (vialSize: any, index: number) => {
                                    return `${vialSize} mg${
                                        index ===
                                        priceData?.price_data.vial_sizes
                                            .length -
                                            1
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

    const displayMostPopularCardTopBanner = () => {
        return (
            <div className='w-full  max-w-[520px] mx-auto'>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 mx-4 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text text-center'>
                        <div className=' flex flex-row justify-center gap-1'>
                            <StarBorderIcon className='text-[1.2rem] md:text-[20px]' />
                            <span className='my-auto'>Most Popular</span>
                        </div>
                    </BioType>
                </div>
            </div>
        );
    };
    const displayNewOfferCardTopBanner = () => {
        return (
            <div className='w-full  max-w-[520px] mx-auto'>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 mx-4 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text text-center'>
                        <div className=' flex flex-row justify-center gap-1'>
                            <StarBorderIcon className='text-[1.2rem] md:text-[20px]' />
                            <span className='my-auto'>Most Popular</span>
                        </div>
                    </BioType>
                </div>
            </div>
        );
    };
    //end of all sub-components, now returning main component:

    return (
        <div>
            {priceData.cadence === 'biannually' && (
                <>{displayMostPopularCardTopBanner()}</>
            )}
            {/* {priceData.cadence === 'annually' && (
                <>{displayNewOfferCardTopBanner()}</>
            )} */}
            <Button
                className={`w-full md:w-[447px] rounded-lg items-start hover:cursor-pointer flex flex-col border-solid text-black normal-case   ${
                    selectedDosagePlan === priceData.variant_index
                        ? 'border-[#98d2ea] border border-4 bg-[#f5fafc] p-[0.9rem] md:p-[14px]'
                        : 'border-[#e0e0e0] border border-2 bg-white p-[1rem] md:p-[16px]'
                }`}
                onClick={() => {
                    setSelectedDosagePlan(Number(priceData.variant_index) || 0);
                }}
                sx={{
                    margin: 0,
                }}
            >
                {(priceData.cadence === 'quarterly' ||
                    priceData.cadence === 'biannually') && (
                    <div className='bg-[#ccfbb6] w-full flex justify-center items-center  rounded-md '>
                        <BioType className={`intake-subtitle text-strong`}>
                            For a limited time, save{' '}
                            {priceData.price_data?.savings?.percent}%
                        </BioType>
                    </div>
                )}

                {/* {priceData.cadence === 'annually' && (
                    <div className='bg-[#ccfbb6] w-full flex justify-center items-center rounded-md '>
                        <BioType className={`intake-subtitle text-strong`}>
                            Maximize savings with our new 12-month plan!
                        </BioType>
                    </div>
                )} */}

                {/* multi-month offers will display a monthly price and a total price */}
                {(priceData.cadence === 'quarterly' ||
                    priceData.cadence === 'biannually') && (
                    <div className='flex justify-between w-full '>
                        <div className='flex flex-col'>
                            {/* These dosages represent either the starting dose (for multi-month offers) or just the dose for monthly offer */}
                            <div className='flex flex-col space-y-2 w-full text-start mt-[1rem] mt-[16px]'>
                                {priceData?.cadence === 'quarterly' && (
                                    <BioType className=' intake-subtitle-bold'>
                                        3-month supply
                                    </BioType>
                                )}

                                {priceData?.cadence === 'biannually' && (
                                    <BioType className='intake-subtitle-bold'>
                                        6-month supply
                                    </BioType>
                                )}

                                {/* {priceData?.cadence === 'annually' && (
                                    <BioType className='intake-subtitle-bold'>
                                        12-month supply
                                    </BioType>
                                )} */}
                            </div>
                            <div className='flex space-x-1'>
                                <BioType className={` intake-subtitle-bold `}>
                                    $
                                    {parseInt(
                                        String(
                                            priceData?.price_data
                                                ?.product_price_monthly
                                        )
                                    )}
                                    /month{' '}
                                </BioType>
                                {/* <BioType
                                    className={`intake-subtitle-bold text-weak `}
                                >
                                    ($
                                    {parseInt(
                                        String(
                                            priceData?.price_data?.product_price
                                        ) || '0'
                                    )}{' '}
                                    total)
                                </BioType> */}
                            </div>

                            {/* Show crossed out non-discounted price per month */}
                            <div className='flex space-x-1'>
                                <BioType
                                    className={` intake-subtitle  text-[#D11E66]`}
                                >
                                    <s>
                                        $
                                        {parseInt(
                                            String(
                                                priceData?.price_data?.savings
                                                    ?.monthly
                                            )
                                        )}
                                        /month{' '}
                                    </s>
                                </BioType>
                            </div>

                            <div className='flex flex-col space-y-2 w-full text-start '>
                                {priceData.cadence === 'quarterly' && (
                                    <BioType
                                        className={` intake-subtitle text-strong`}
                                    >
                                        You&apos;ll start injecting {dosage} mg
                                        weekly
                                    </BioType>
                                )}

                                {priceData.cadence === 'biannually' && (
                                    <BioType
                                        className={`intake-subtitle text-strong`}
                                    >
                                        You&apos;ll start injecting {dosage} mg
                                        weekly
                                    </BioType>
                                )}

                                {/* {priceData.cadence === 'annually' && (
                                    <BioType
                                        className={`intake-subtitle text-strong`}
                                    >
                                        You&apos;ll start injecting {dosage} mg
                                        weekly
                                    </BioType>
                                )} */}
                            </div>
                        </div>

                        <div className='rounded-md py-1 px-2 mt-4 max-h-[24px] flex flex-col justify-center bg-[#ccfbb6] min-w-[5rem]'>
                            <BioType className='text-black intake-subtitle'>
                                save ${priceData.price_data?.savings.total}
                            </BioType>
                        </div>
                    </div>
                )}

                {/* monthly offers will only display a monthly price */}
                {priceData.cadence !== 'quarterly' &&
                    priceData.cadence !== 'biannually' && (
                        <>
                            <p className='intake-v3-disclaimer-text'>
                                Supply ships every month. Cancel anytime.
                            </p>
                            {priceData.cadence === 'monthly' && (
                                <>
                                    <BioType className='intake-subtitle-bold mt-[0.2rem] md:mt-[4px]'>
                                        1-month supply
                                    </BioType>
                                    <BioType className={`intake-subtitle-bold`}>
                                        ${priceData.price_data?.product_price}
                                        /month
                                    </BioType>
                                    <BioType
                                        className={`intake-subtitle text-strong `}
                                    >
                                        {dosage} mg weekly
                                    </BioType>
                                </>
                            )}
                        </>
                    )}

                <div className='w-full h-[1px] my-[.62rem] md:my-[16px]'>
                    <HorizontalDivider
                        backgroundColor={'#1B1B1B1F'}
                        height={1}
                    />
                </div>

                {priceData.cadence === 'quarterly' &&
                    displayBundleVialInformation()}
                {priceData.cadence === 'monthly' &&
                    displayMonthlyVialsIncluded()}
                {priceData.cadence === 'biannually' &&
                    displayBiannualVialInformation()}
                {/* {priceData.cadence === 'annually' &&
                    displayAnnualVialInformation()} */}

                <div className='w-full text-start mt-2'>
                    {!learnMoreExpanded ? (
                        <Button
                            onClick={() =>
                                setLearnMoreExpanded(!learnMoreExpanded)
                            }
                            className='relative px-0 py-0 underline text-black'
                            endIcon={<ExpandMore />}
                            size='large'
                        >
                            <BioType className=' text-black normal-case underline-1 inter  text-[.75rem] md:text-[12px] p-0 font-[600]'>
                                Learn More
                            </BioType>
                        </Button>
                    ) : (
                        <Button
                            onClick={() =>
                                setLearnMoreExpanded(!learnMoreExpanded)
                            }
                            endIcon={<ExpandLessIcon />}
                            size='large'
                            className='relative text-black underline px-0 py-0'
                        >
                            <BioType className='text-[.75rem] text-black normal-case inter-basic md:text-[12px] p-0  font-[600]'>
                                See Less
                            </BioType>
                        </Button>
                    )}
                </div>
                {learnMoreExpanded && (
                    <div className='flex'>
                        {priceData.cadence === 'quarterly' &&
                            displayBundleLearnMoreUpdated()}

                        {priceData.cadence === 'monthly' &&
                            displayMonthlyLearnMore()}

                        {priceData.cadence === 'biannually' &&
                            displayBiannualLearnMore()}

                        {/* {priceData.cadence === 'annually' &&
                            displayAnnualLearnMore()} */}
                    </div>
                )}
            </Button>
        </div>
    );
}
