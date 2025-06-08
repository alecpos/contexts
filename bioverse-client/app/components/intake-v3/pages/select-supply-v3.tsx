'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButtonV3';
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
import Image from 'next/image';

interface SelectSupplyProps {
    monthlyPriceData: any;
    quarterlyPriceData: any;
    orderData: BaseOrder;
    monthlyDiscount: string;
    quarterlyDiscount: string;
    sexAtBirth: string;
}

export default function SelectSupplyComponent({
    orderData,
    monthlyPriceData,
    quarterlyPriceData,
    monthlyDiscount,
    quarterlyDiscount,
    sexAtBirth,
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

    const bannerRef =
    sexAtBirth === 'Male'
        ? 'yellow_male_banner.png'
        : 'purple_banner.png';

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
                    <div className='w-full mt-[0.75rem] md:mt-[12px]'>
                        <BioType
                            className={`inter_body_regular`}
                        >
                            {displayProductName(product_href)} Injection{' '}
                            {bundle.vial} mg vial
                        </BioType>
                        <BioType
                            className={`inter_body_regular text-textSecondary`}
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
            <div className='space-y-4  px-[1rem] md:px-[16px] pb-[1rem] md:pb-[16px]'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6  '>
                    <BioType className={`inter_body_regular`}>
                        Includes:
                    </BioType>
                    <BioType className={`inter_body_regular`}>
                        <ol className='flex flex-col space-y-2 pl-5'>
                            <li>
                                <BioType
                                    className={`inter_body_regular mb-1.5`}
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
                                                        className={`inter_body_regular mb-1.5`}
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
                                    className={`inter_body_regular mb-1.5`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`inter_body_regular mb-1.5`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`inter_body_regular mb-1.5`}
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
                    <BioType className={`inter_body_regular`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul className='list-disc flex flex-col space-y-3 ml-6'>
                        {bundle?.instructions.map(
                            (instruction: Instruction, index: number) => {
                                return (
                                    <li key={index}>
                                        <BioType
                                            className={`inter_body_regular`}
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
            <div className='flex flex-col space-y-4 px-[1rem] md:px-[16px] pb-[1rem] md:pb-[16px] mt-[0.5rem] md:mt-[8px]'>
                {/* Includes Section */}
                <div className='flex flex-col space-y-6'>
                    <BioType className={`inter_body_regular`}>
                        Includes:
                    </BioType>
                    <BioType className={`inter_body_regular`}>
                        <ol className='ml-4 flex flex-col space-y-2'>
                            <li>
                                <BioType
                                    className={`inter_body_regular`}
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
                                                        className={`inter_body_regular`}
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
                                    className={`inter_body_regular`}
                                >
                                    Injection needles
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`inter_body_regular`}
                                >
                                    Alcohol pads
                                </BioType>
                            </li>
                            <li>
                                <BioType
                                    className={`inter_body_regular`}
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
                    <BioType className={`inter_body_regular`}>
                        Injection instructions once prescribed:
                    </BioType>
                    <ul style={{ color: 'rgba(27, 27, 27, 0.6)' }}>
                        {monthly.instructions.map(
                            (instruction: Instruction, index: number) => {
                                return (
                                    <li className='ml-5' key={index}>
                                        <BioType
                                            className={`inter_body_regular  text-textSecondary`}
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
            <div className={`justify-center flex animate-slideRight `}>
                <div className='flex flex-col gap-8'>
                <div className='relative w-full h-[4.5rem] md:h-[110px] mt-2'>
                        <Image
                            src={`/img/intake/wl/${bannerRef}`}
                            alt='product'
                            layout='fill'
                            objectFit='contain'
                            className='mx-auto'
                            
                        />
                    </div>
                    <div className='flex flex-col gap-6'>
                        <BioType
                            className={`inter_h5_regular`}
                        >
                            Tell us how much medication you&apos;d like to
                            receive.
                        </BioType>
                        <BioType className={`inter_body_regular`}>
                            For a limited time, BIOVERSE is offering a{' '}
                            {bundle?.savings.percent}% discount on your
                            medication if you purchase a 3-month supply.
                        </BioType>

                        <div className='flex flex-col gap-[22px] sm:mb-[100px] md:mb-0'>
                        <div className='w-full mb-[-22px] max-w-[500px] mx-auto'>
                            <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-[#ffbbbb] to-[#ffdeb3] mx-4 flex flex-col justify-center'>
                                <BioType className='intake-v3-disclaimer-text text-center'>
                                    <span className='text-[0.9rem] md:text-[16px]'>$</span>{' '}
                                    Max Savings
                                </BioType>
                            </div>
                        </div>

                            {/* BOX 1 */}
                            <div
                                className={` flex flex-col rounded-lg border-solid text-start mx-auto w-full text-black normal-case ${
                                    box1Checked
                                        ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                                        : 'border-[#BDBDBD] border-2'
                                } items-center `}
                            >
                                <Button
                                    className={` flex flex-col normal-case text-black text-start w-full px-[1rem] md:px-[16px]  pt-[1rem] md:pt-[16px]  `}
                                    onClick={() => {
                                        if (selectedSupply !== 3) {
                                            setSelectedSupply(3);
                                            handleBox1CheckboxClick();
                                            setBox2Checked(false);
                                        }
                                    }}
                                >
                                    <div className='flex gap-4 w-full'>

                                        <div className='bg-[#CCFBB6] w-full flex justify-center items-center py-1 rounded-md'>
                                            <BioType className='inter_body_small_regular'>
                                                For a limited time, save{' '}
                                                {bundle?.savings.percent}%
                                            </BioType>
                                        </div>
                                    </div>

                                    <div className='flex flex-row items-center w-full'>
                                        
                                        <div className='flex flex-col  w-full'>
                                            <div className='w-full flex justify-start mt-[0.75rem] md:mt-[12px]'>
                                                <BioType
                                                    className={`inter_body_bold`}
                                                >
                                                    3-month supply
                                                </BioType>
                                            </div>
                                            <div className='w-full flex justify-between'>
                                                <div>
                                                    <div className='flex flex-col'>
                                                        <BioType
                                                            className={`inter_body_bold`}
                                                        >
                                                            $
                                                            {
                                                                bundle?.product_price_monthly
                                                            }
                                                            /month{' '}
                                                        </BioType>
                                                        <s>
                                                            <BioType
                                                                className={`inter_body_regular`}
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
                                                <div className='bg-[#CCFBB6] rounded-md py-1 px-3 max-h-[24px] flex flex-col justify-center'>
                                                    <BioType className='inter_body_regular'>
                                                        save $
                                                        {bundle?.savings.total}
                                                    </BioType>
                                                </div>
                                            </div>
                                            
                                            {displayBundleVialInformation()}
                                        </div>
                                    </div>
                                </Button>
                                <div className='w-full text-start pb-[0.4rem] md:pb-[6px]'>
                                    {!showMore3 ? (
                                        <Button
                                            onClick={() =>
                                                setShowMore3(!showMore3)
                                            }
                                            className='relative text-black underline px-0 py-0 w-full'
                                            size='large'
                                        >
                                            <div className='text-[0.75rem] md:text-[12px] text-black normal-case inter-h5-regular font-bold p-0 w-full flex flex-row px-[1.1rem] md:px-[17px] '>
                                                <p>Learn More</p>
                                                <ExpandMore />
                                            </div>
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                setShowMore3(!showMore3)
                                            }
                                            className='relative text-black underline px-0 py-0 w-full'
                                            size='large'
                                        >
                                            <div className='text-[0.75rem] md:text-[12px] text-black normal-case inter-h5-regular font-bold p-0 w-full flex flex-row px-[1.1rem] md:px-[17px] '>
                                                <p>See Less</p>
                                                <ExpandLessIcon />
                                            </div>
                                        </Button>
                                    )}
                                </div>
                                {showMore3 && displayBundleLearnMoreUpdated()}
                            </div>
                        

                            {/* BOX 2 */}
                            <div
                                className={` flex flex-col rounded-lg border-solid text-start mx-auto w-full text-black normal-case ${
                                    box2Checked
                                        ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                                        : 'border-[#BDBDBD] border-2'
                                } items-center `}
                            >
                                <Button
                                    onClick={() => {
                                        if (selectedSupply !== 1) {
                                            setSelectedSupply(1);
                                            handleBox2CheckboxClick();
                                            setBox1Checked(false);
                                        }
                                    }}
                                    className={` flex flex-col normal-case text-black text-start w-full px-[1rem] md:px-[16px]  pt-[1rem] md:pt-[16px]  `}
                                >
                                    <div className='flex flex-row w-full items-center'>
                                    
                                        <div className='flex flex-col md:flex-row md:items-center md:justify-between md:space-x-3 w-full '>
                                            <div className=''>
                                                <BioType
                                                    className={`inter_body_bold`}
                                                >
                                                    1-month supply
                                                </BioType>
                                                <BioType
                                                    className={`inter_body_bold`}
                                                >
                                                    ${monthly?.product_price}/month
                                                </BioType>
                                                <BioType
                                                    className={`inter_body_regular mt-[0.5rem] md:mt-[8px]`}
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
                                </Button>
                                <div className='w-full text-center'>
                                    {!showMore1 ? (
                                        <Button
                                            onClick={() =>
                                                setShowMore1(!showMore1)
                                            }
                                            className='relative text-black underline px-0 py-0 w-full'
                                            size='large'
                                        >
                                            <div className='text-[0.75rem] md:text-[12px] text-black normal-case inter-h5-regular font-bold p-0 w-full flex flex-row px-[1.1rem] md:px-[17px] '>
                                                <p>Learn More</p>
                                                <ExpandMore />
                                            </div>
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                setShowMore1(!showMore1)
                                            }
                                            className='relative text-black underline px-0 py-0 w-full'
                                            size='large'
                                        >
                                                <div className='text-[0.75rem] md:text-[12px] text-black normal-case inter-h5-regular font-bold p-0 w-full flex flex-row px-[1.1rem] md:px-[17px] '>
                                                <p>See Less</p>
                                                <ExpandLessIcon />
                                            </div>
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
