'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button, Chip, Paper } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Instruction } from '@/app/types/product-prices/product-prices-types';
import { INTAKE_PAGE_BODY_TAILWIND } from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getProductName } from '@/app/utils/functions/formatting';
import { sum } from 'lodash';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface DosageOptionProps {
    priceData: Partial<ProductVariantRecord> | null;
    dosage: string | undefined;
    selectedDosagePlan: number | undefined;
    setSelectedDosagePlan: Dispatch<SetStateAction<number>>;
    product_href: string;
    index: number;
}

export default function FirstTimeDosingOption({
    priceData,
    dosage,
    selectedDosagePlan,
    setSelectedDosagePlan,
    product_href,
    index,
}: DosageOptionProps) {
    const [learnMoreExpanded, setLearnMoreExpanded] = useState<boolean>(false);

    if (!priceData || !dosage) {
        return null;
    }

    if (priceData.cadence === 'annually') {
        return null;
    }

    // if (bivi && priceData.cadence === 'biannually' && Number(bivi) !== priceData.variant_index) {
    //     return null;
    // }
    // if (yrvi && priceData.cadence === 'yearly' && Number(yrvi) !== priceData.variant_index) {
    //     return null;
    // }
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
                                        mg {getProductName(product_href)} vial.{' '}
                                        <span className='text-textSecondary'>
                                            {
                                                priceData?.price_data
                                                    ?.instructions?.[0]
                                                    ?.description
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
                                        {getProductName(product_href)} vials in
                                        1 package
                                    </BioType>

                                    <ul className='list-disc ml-4'>
                                        {priceData?.price_data?.instructions?.map(
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
                            {priceData?.price_data?.instructions?.map(
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
                                    {getProductName(product_href)} vials in 1
                                    package
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
                                                                product_href
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
                                                            product_href
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
                        {priceData?.price_data?.instructions?.map(
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
                                    {getProductName(product_href)} vials in 1
                                    package
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
                                                                product_href
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
                                                            product_href
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

        switch (product_href) {
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

        switch (product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div className='w-full text-start'>
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
                    <div className='w-full text-start'>
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
        switch (product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div className='w-full text-start'>
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
                    <div className='w-full text-start'>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Tirzepatide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle  text-black opacity-60 text-start`}
                        >
                            ({priceData?.price_data?.vial_sizes.length}
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

    const displayBundleVialInformation = () => {
        switch (product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div className='w-full text-start'>
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
                    <div className='w-full text-start'>
                        <BioType
                            className={`intake-subtitle text-black w-full text-start`}
                        >
                            Tirzepatide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`intake-subtitle text-black opacity-60 text-start`}
                        >
                            ({priceData?.price_data?.vial_sizes.length}
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

    //end of all sub-components, now returning main component:

    return (
        <div className='px-3'>
            {priceData.cadence === SubscriptionCadency.Biannually && (
                <div className=' w-fit h-[0.75rem] md:h-[18px] px-3 py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 ml-3 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text'>
                        Max Savings
                    </BioType>
                </div>
            )}
            {priceData.cadence === SubscriptionCadency.Quarterly && (
                <div className=' w-fit h-[0.75rem] md:h-[18px] px-3 py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 ml-3 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text'>
                        Most Popular
                    </BioType>
                </div>
            )}

            <div
                className={`w-fit md:w-[447px] rounded-lg items-start hover:cursor-pointer flex flex-col border-solid text-black normal-case   ${
                    selectedDosagePlan === index
                        ? 'border-[#98d2ea] border border-4 bg-[#f5fafc] p-[0.9rem] md:p-[14px]'
                        : 'border-[#e0e0e0] border border-2 bg-white p-[1rem] md:p-[16px]'
                }`}
            >
                <Button
                    className={` flex flex-col normal-case text-black text-start w-full  pb-2`}
                    onClick={() => {
                        setSelectedDosagePlan(index);
                    }}
                >
                    {priceData?.cadence === 'quarterly' && (
                        <BioType className=' intake-v3-18px-20px-bold w-full text-center'>
                            3-month supply,{' '}
                            <span className='intake-v3-18px-20px text-[#00000099]'>
                                ships every 3 months
                            </span>
                        </BioType>
                    )}

                    {priceData?.cadence === 'monthly' && (
                        <BioType className=' intake-v3-18px-20px-bold w-full text-center'>
                            1-month supply,{' '}
                            <span className='intake-v3-18px-20px text-[#00000099]'>
                                ships every month
                            </span>
                        </BioType>
                    )}

                    {priceData?.cadence === 'biannually' && (
                        <BioType className='intake-v3-18px-20px-bold w-full text-center'>
                            6-month supply,{' '}
                            <span className='intake-v3-18px-20px text-[#00000099]'>
                                ships every 6 months
                            </span>
                        </BioType>
                    )}

                    {(priceData.cadence === 'quarterly' ||
                        priceData.cadence === 'biannually') && (
                        <div className='bg-[#ccfbb6] w-full flex justify-center items-center  rounded-md mt-[0.62rem] mt-[10px] '>
                            <BioType className={`intake-v3-disclaimer-text `}>
                                For a limited time, save{' '}
                                {priceData.price_data?.savings?.percent}%
                            </BioType>
                        </div>
                    )}

                    {/* multi-month offers will display a monthly price and a total price */}
                    {(priceData.cadence === 'quarterly' ||
                        priceData.cadence === 'biannually') && (
                        <div className='flex justify-between w-full '>
                            <div className='flex flex-col'>
                                {/* These dosages represent either the starting dose (for multi-month offers) or just the dose for monthly offer */}
                                <div className='flex flex-col space-y-2 w-full text-start mt-[1rem] mt-[16px]'>
                                    {priceData.cadence === 'quarterly' && (
                                        <BioType
                                            className={` intake-subtitle text-strong`}
                                        >
                                            You&apos;ll start injecting {dosage}{' '}
                                            weekly
                                        </BioType>
                                    )}

                                    {priceData.cadence === 'biannually' && (
                                        <BioType
                                            className={`intake-subtitle text-strong`}
                                        >
                                            You&apos;ll start injecting {dosage}{' '}
                                            weekly
                                        </BioType>
                                    )}
                                </div>
                                <div className='flex space-x-1'>
                                    <BioType
                                        className={` intake-subtitle-bold `}
                                    >
                                        $
                                        {parseInt(
                                            String(
                                                priceData?.price_data
                                                    ?.product_price_monthly
                                            )
                                        )}
                                        /month{' '}
                                    </BioType>
                                    <BioType
                                        className={`intake-subtitle-bold text-weak `}
                                    >
                                        ($
                                        {parseInt(
                                            String(
                                                priceData?.price_data
                                                    ?.product_price
                                            ) || '0'
                                        )}{' '}
                                        total)
                                    </BioType>
                                </div>
                            </div>

                            <div
                                className='rounded-md py-1 px-2 mt-4 max-h-[24px] flex flex-col justify-center'
                                style={{ border: '1.5px solid #000000' }}
                            >
                                <BioType className='text-black inter-h5-regular text-sm min-w-[5rem] text-center'>
                                    save $
                                    {priceData.price_data?.savings?.total ?? 0}
                                </BioType>
                            </div>
                        </div>
                    )}

                    {/* monthly offers will only display a monthly price */}
                    {priceData.cadence !== 'quarterly' &&
                        priceData.cadence !== 'biannually' && (
                            <div className='w-full text-start'>
                                {priceData.cadence === 'monthly' && (
                                    <BioType
                                        className={`intake-subtitle text-strong mt-[1rem] md:mt-[16px]`}
                                    >
                                        {dosage} weekly
                                    </BioType>
                                )}
                                <BioType className={`intake-subtitle-bold`}>
                                    ${priceData.price_data?.product_price}/month
                                </BioType>
                            </div>
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
                </Button>
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
                    </div>
                )}
            </div>
        </div>
    );
}
