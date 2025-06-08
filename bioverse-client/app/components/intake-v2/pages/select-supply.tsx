'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { BaseOrder } from '@/app/types/orders/order-types';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';

interface SelectSupplyProps {
    monthlyPriceData: any;
    quarterlyPriceData: any;
    orderData: BaseOrder;
    isV2?: boolean;
    monthlyDiscount: string;
    quarterlyDiscount: string;
}

export default function SelectSupplyComponent({
    orderData,
    monthlyPriceData,
    quarterlyPriceData,
    isV2 = false,
    monthlyDiscount,
    quarterlyDiscount,
}: SelectSupplyProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const product_href = orderData.product_href;
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const bundle = quarterlyPriceData.price_data;
    const monthly = monthlyPriceData.price_data;

    const [selectedSupply, setSelectedSupply] = useState<number>(3);
    const [showMore3, setShowMore3] = useState<boolean>(false);
    const [showMore1, setShowMore1] = useState<boolean>(false);
    const [box1Checked, setBox1Checked] = useState<boolean>(true);
    const [box2Checked, setBox2Checked] = useState<boolean>(false);

    const handleBox1CheckboxClick = () => {
        setBox1Checked(!box1Checked);
    };

    const handleBox2CheckboxClick = () => {
        setBox2Checked(!box2Checked);
    };

    //Specifically for products that only have two product price variants 0- monthly and 1-quarterly
    const buildUpdateOrderPayload = () => {
        // console.log('mo and bu', monthly, 'bu ', bundle);

        if (selectedSupply === 1) {
            return {
                // It's a monthly
                price_id:
                    monthlyPriceData?.stripe_price_ids[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                price: monthly.product_price,
                variant_text: monthly?.vial_size ?? '' + 'mg',
                variant_index: 0,
                subscription_type: 'monthly',
                discount_id: monthlyDiscount ? [monthlyDiscount] : [],
            };
        } else if (selectedSupply === 3) {
            // It's a quarterly bundle
            return {
                price_id:
                    quarterlyPriceData?.stripe_price_ids[
                        process.env
                            .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
                    ],
                price: bundle.product_price,
                variant_index: 1,
                variant_text: bundle.total_mg + 'mg',
                subscription_type: 'quarterly',
                discount_id: quarterlyDiscount ? [quarterlyDiscount] : [],
            };
        } else {
            return {};
        }
    };

    const pushToNextRoute = async () => {
        setButtonLoading(true);

        const updatedPayload = buildUpdateOrderPayload();
        await updateOrder(orderData.id, updatedPayload);

        const selectedCadency = selectedSupply === 3 ? 'quarterly' : 'monthly';

        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            searchParams.toString(),
            false
        );

        const searchParamsNew = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParamsNew.delete('nu');
        searchParamsNew.set('st', selectedCadency);

        console.log(nextRoute);
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParamsNew.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
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
            case PRODUCT_HREF.B12_INJECTION:
                return (
                    <div className='w-full'>
                        <BioType
                            className={`md:itd-input it-body  md:!font-twcsemimedium md:-mt-2`}
                        >
                            {displayProductName(product_href)} Injection{' '}
                            {bundle.vial} mg vial
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
            default:
                return null;
        }
    };

    const displayProductName = (name: string) => {
        switch (name) {
            case PRODUCT_HREF.B12_INJECTION:
                return 'B12 Methylcobalamin ';

            default:
                return name;
        }
    };
    const numberToWord = (num: string) => {
        const words = [
            'Zero',
            'One',
            'Two',
            'Three',
            'Four',
            'Five',
            'Six',
            'Seven',
            'Eight',
            'Nine',
            'Ten',
        ];

        const number = parseInt(num, 10);

        if (number >= 0 && number <= 10) {
            return words[number];
        } else {
            return num; // Return the original number if it's out of range
        }
    };
    const displayBundleLearnMoreUpdated = () => {
        return (
            <div className='space-y-4'>
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
                                    {bundle?.instructions.map(
                                        (
                                            instruction: Instruction,
                                            index: number
                                        ) => {
                                            return (
                                                <li key={index}>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                                    >
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
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </BioType>
                            </li>
                        </ol>
                    </BioType>
                </div>
                {/* Injection Instructions */}
                <HorizontalDivider backgroundColor='#E4E4E4' height={1} />
                <div className='flex flex-col space-y-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6'>
                        {bundle?.instructions.map(
                            (instruction: Instruction, index: number) => {
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
            </div>
        );
    };

    const displayMonthlyLearnMoreV2 = () => {
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
                                    {numberToWord(monthly.vial_sizes.length)}{' '}
                                    {displayProductName(product_href)} vial
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
                    <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                        {monthly.instructions.map(
                            (instruction: Instruction, index: number) => {
                                return (
                                    <li className='ml-5' key={index}>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}  text-textSecondary`}
                                        >
                                            {instruction.injection_instructions}
                                        </BioType>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight`}>
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-6'>
                        <BioType
                            className={`${TRANSITION_HEADER_TAILWIND} !text-primary`}
                        >
                            Tell us how much medication you&apos;d like to
                            receive.
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            For a limited time, BIOVERSE is offering a{' '}
                            {bundle?.savings.percent}% discount on your
                            medication if you purchase a 3-month supply.
                        </BioType>

                        <div className='flex flex-col gap-[22px] sm:mb-[100px] md:mb-0'>
                            <div className='bg-[#286BA2] mb-[-22px] w-fit px-4 py-2 rounded-t-lg'>
                                <BioType className='it-body md:itd-body text-white '>
                                    Most Popular
                                </BioType>
                            </div>

                            {/* BOX 1 */}
                            <div
                                className={` box-border md:px-[30px] py-4 px-2 rounded-[4px] border-solid ${
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
                                </div>

                                <div className='flex flex-row mt-1.5 items-center w-full'>
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
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='flex flex-col space-y-2 w-full'>
                                        <div className='w-full flex justify-start mt-0'>
                                            <BioType
                                                className={`${INTAKE_INPUT_TAILWIND} !text-[1rem] md:!text-[1.25rem]`}
                                            >
                                                3-month supply
                                            </BioType>
                                        </div>
                                        <div className='w-full flex justify-between'>
                                            <div>
                                                <div className='flex flex-col md:space-x-1 md:flex-row'>
                                                    <BioType
                                                        className={`${INTAKE_INPUT_TAILWIND}`}
                                                    >
                                                        $
                                                        {
                                                            bundle?.product_price_monthly
                                                        }
                                                        /month{' '}
                                                    </BioType>
                                                    <s>
                                                        <BioType
                                                            className={`${INTAKE_INPUT_TAILWIND} text-[#FFFFF] opacity-[.38]`}
                                                        >
                                                            $
                                                            {
                                                                bundle?.savings
                                                                    .monthly
                                                            }
                                                            /month
                                                        </BioType>
                                                    </s>
                                                </div>
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
                                    </div>
                                )}
                            </div>

                            <div
                                className={`box-border md:pb-4 md:px-4 px-2 inset-[1px] rounded-[4px] ${
                                    showMore1 ? 'pb-4' : 'pb-0'
                                } border-solid ${
                                    box2Checked
                                        ? 'border-[#286BA2] border'
                                        : 'border-[#BDBDBD] border'
                                } items-center gap-2`}
                                style={
                                    box2Checked
                                        ? { boxShadow: '0 0 0 1px #286BA2' }
                                        : {}
                                }
                            >
                                <div className='flex flex-row w-full items-center'>
                                    <div className='flex pr-3'>
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
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between md:space-x-3 w-full p-4'>
                                        <div className=''>
                                            <BioType
                                                className={`${INTAKE_INPUT_TAILWIND} !text-[1rem] md:!text-[1.25rem]`}
                                            >
                                                1-month supply
                                            </BioType>
                                            <BioType
                                                className={`${INTAKE_INPUT_TAILWIND} !text-[1rem] md:!text-[1.25rem]`}
                                            >
                                                ${monthly?.product_price}
                                            </BioType>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                {displayProductName(
                                                    product_href
                                                )}{' '}
                                                Injection{' '}
                                                {monthly?.vial_sizes[0]} mg vial
                                            </BioType>{' '}
                                        </div>

                                        <div className='flex flex-1 md:justify-end'>
                                            {/* {displayMonthlyVialInformation()} */}
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full text-center'>
                                    {!showMore1 ? (
                                        <Button
                                            onClick={() =>
                                                setShowMore1(!showMore1)
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
                                                setShowMore1(!showMore1)
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
                                {showMore1 && displayMonthlyLearnMoreV2()}
                            </div>
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
