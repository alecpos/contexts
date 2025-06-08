'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button, Chip, Paper } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Instruction } from '@/app/types/product-prices/product-prices-types';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getProductName } from '@/app/utils/functions/formatting';
import { sum } from 'lodash';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface DosageOptionProps {
    priceData: Partial<ProductVariantRecord> | null;
    dosage: string | undefined;
    renewalOrder: RenewalOrder;
    selectedDosagePlan: number | undefined;
    setSelectedDosagePlan: Dispatch<SetStateAction<number>>;
}

export default function DosageOption({
    priceData,
    dosage,
    renewalOrder,
    selectedDosagePlan,
    setSelectedDosagePlan,
}: DosageOptionProps) {
    const [learnMoreExpanded, setLearnMoreExpanded] = useState<boolean>(false);

    if (!priceData || !dosage) {
        return null;
    }

    const displayMonthlyLearnMore = () => {
        if (priceData?.price_data?.vial_sizes.length === 1) {
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
                                    {priceData?.price_data?.vial_sizes?.length}{' '}
                                    {getProductName(renewalOrder.product_href)}{' '}
                                    vials in 1 package
                                </BioType>
                                <ul className='flex flex-col space-y-3 list-disc pl-4'>
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
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
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
                                                        <span className='text-textSecondary'>
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
                        {priceData?.price_data?.instructions.map(
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
                <BioType
                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
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

        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
                    >
                        Semaglutide {totalVialSize} mg{' '}
                    </BioType>
                );

            case PRODUCT_HREF.TIRZEPATIDE:
                return (
                    <BioType
                        className={`md:itd-input it-body  md:!font-twcsemimedium`}
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
                            className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
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
                            className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-80`}
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

    const displayBundleVialInformation = () => {
        switch (renewalOrder.product_href) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <div>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium md:-mt-2`}
                        >
                            Semaglutide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-60`}
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
                            className={`md:itd-input it-body  md:!font-twcsemimedium`}
                        >
                            Tirzepatide {priceData.vial}
                        </BioType>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium text-black opacity-60`}
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

    return (
        <>
            <Paper
                className={`max-w-[95vw] md:w-[550px] hover:cursor-pointer flex flex-col p-[24px] gap-4 ${
                    selectedDosagePlan === priceData.variant_index &&
                    'border-t-[3px] border-[#286BA2] border-solid'
                }`}
                onClick={() => {
                    setSelectedDosagePlan(Number(priceData.variant_index) || 0);
                }}
            >
                {priceData.cadence === 'quarterly' ? (
                    <BioType className='it-h1 md:itd-h1 text-primary'>
                        {dosage} weekly
                    </BioType>
                ) : (
                    <BioType className='it-h1 md:itd-h1 text-primary'>
                        {dosage} weekly
                    </BioType>
                )}

                {priceData?.cadence === 'quarterly' ? (
                    <BioType className='it-subtitle md:itd-subtitle'>
                        3-month supply,{' '}
                        <span className='text-[#00000099]'>
                            ships every 3 months
                        </span>
                    </BioType>
                ) : (
                    <BioType className='it-subtitle md:itd-subtitle'>
                        1-month supply,{' '}
                        <span className='text-[#00000099]'>
                            ships every month
                        </span>
                    </BioType>
                )}

                {priceData.cadence === 'quarterly' && (
                    <div className='bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center'>
                        <BioType className='text-black it-body md:itd-body'>
                            For a limited time, save{' '}
                            {priceData.price_data?.savings?.percent ?? 0}%
                        </BioType>
                    </div>
                )}

                {priceData.cadence === 'quarterly' && (
                    <div className='flex justify-between'>
                        <div className='flex space-x-1'>
                            <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
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
                                className={`${INTAKE_INPUT_TAILWIND} text-[#FFFFF] opacity-[.38]`}
                            >
                                ($
                                {parseInt(
                                    String(
                                        priceData?.price_data?.product_price
                                    ) || '0'
                                )}{' '}
                                total)
                            </BioType>
                        </div>
                        <Chip
                            variant='filled'
                            size='medium'
                            label={`Save $${priceData.price_data?.savings?.total}`}
                            sx={{
                                background: 'white',
                                border: '2px solid #A5EC84',
                            }}
                        />
                    </div>
                )}
                {priceData.cadence !== 'quarterly' && (
                    <BioType className={`${INTAKE_INPUT_TAILWIND} `}>
                        ${priceData.price_data?.product_price}/month
                    </BioType>
                )}

                <div className='w-full h-[1px] my-1'>
                    <HorizontalDivider
                        backgroundColor={'#1B1B1B1F'}
                        height={1}
                    />
                </div>

                {priceData.cadence === 'quarterly' &&
                    displayBundleVialInformation()}
                {priceData.cadence !== 'quarterly' &&
                    displayMonthlyVialsIncluded()}

                <div className='w-full text-center'>
                    {!learnMoreExpanded ? (
                        <Button
                            onClick={() =>
                                setLearnMoreExpanded(!learnMoreExpanded)
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
                                setLearnMoreExpanded(!learnMoreExpanded)
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
                {learnMoreExpanded && (
                    <div className='flex'>
                        {priceData.cadence === 'quarterly'
                            ? displayBundleLearnMoreUpdated()
                            : displayMonthlyLearnMore()}
                    </div>
                )}
            </Paper>
        </>
    );
}
