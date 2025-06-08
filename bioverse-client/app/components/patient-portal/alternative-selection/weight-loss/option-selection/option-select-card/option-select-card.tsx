'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_INPUT_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { Chip, Paper } from '@mui/material';
import Image from 'next/image';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';

interface OptionSelectCardProps {
    product_href: string;
    selectedProduct: string;
    most_popular: boolean;
    handleProductCardClick: (product_href: string) => void;
}

export default function OptionSelectCard({
    product_href,
    selectedProduct,
    most_popular,
    handleProductCardClick,
}: OptionSelectCardProps) {
    const renderDescription = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return 'Metformin is a widely prescribed medication primarily for Type 2 diabetes, known for its effectiveness in improving insulin sensitivity and reducing blood sugar levels.';

            case PRODUCT_HREF.WL_CAPSULE:
                return 'When medically appropriate, the BIOVERSE weight loss capsules is prescribed to help patients achieve their weight loss goals.';

            default:
                return 'Placeholder Description';
        }
    };

    const renderBottomText = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return (
                    <div className='flex flex-col'>
                        <BioType className='it-body md:itd-body text-[#00000099]'>
                            Metformin
                        </BioType>
                        <BioType className='it-body md:itd-body text-[#00000099]'>
                            (500 mg or as prescribed)
                        </BioType>
                    </div>
                );

            case PRODUCT_HREF.WL_CAPSULE:
                return (
                    <div className='flex flex-col'>
                        <BioType className='it-body md:itd-body text-[#00000099]'>
                            Buproprion HCl/Naltrexone HCl/Topiramate
                        </BioType>
                        <BioType className='it-body md:itd-body text-[#00000099]'>
                            (65 mg/8 mg/15 mg)
                        </BioType>
                    </div>
                );

            default:
                return 'Placeholder Description';
        }
    };

    const getProductPriceNumber = (field: string) => {
        interface ProductPriceVariable {
            [key: string]: {
                [key: string]: string;
            };
        }

        const mapping: ProductPriceVariable = {
            metformin: {
                greenBanner: '26',
                priceText: '18.33',
                grayPriceText: '25',
                saveChipText: '20',
            },
            'wl-capsule': {
                greenBanner: '12',
                priceText: '58',
                grayPriceText: '66.33',
                saveChipText: '25',
            },
        };

        return mapping[product_href][field];
    };

    const getProductImageRef = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return 'product-images/metformin/metformin-mar-15-full.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return 'product-images/wl-capsule/weight loss capsules_no bg.png';
        }
    };

    const getProductName = () => {
        return PRODUCT_NAME_HREF_MAP[product_href];
    };

    return (
        <div>
            {most_popular && (
                <div className='inline-flex ml-4'>
                    <div className='bg-primary px-2 py-[0.375rem] rounded-t-md'>
                        <BioType className='it-body md:itd-body text-white whitespace-nowrap'>
                            Most Popular
                        </BioType>
                    </div>
                </div>
            )}
            <Paper
                className={`flex flex-col hover:cursor-pointer p-8 gap-2 ${
                    selectedProduct === product_href &&
                    'border-solid border-primary border-[3px]'
                }`}
                onClick={() => handleProductCardClick(product_href)}
            >
                <div className='flex flex-row gap-3 items-center'>
                    <Image
                        src={`${
                            process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY
                        }${getProductImageRef()}`}
                        alt='temp'
                        width={64}
                        height={64}
                        unoptimized
                    />
                    <BioType className='it-subtitle md:itd-subtitle text-primary'>
                        {getProductName()}
                    </BioType>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='bg-[#A5EC84] w-full py-0.5 rounded-2xl flex justify-center'>
                        <BioType className='text-black it-body md:itd-body'>
                            For a limited time, save up to{' '}
                            {getProductPriceNumber('greenBanner')}%
                        </BioType>
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='flex space-x-1'>
                            <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                                ${getProductPriceNumber('priceText')}/month{' '}
                            </BioType>
                            <BioType
                                className={`${INTAKE_INPUT_TAILWIND} text-[#FFFFF] opacity-[.38] line-through`}
                            >
                                ${getProductPriceNumber('grayPriceText')}/month
                            </BioType>
                        </div>
                        <Chip
                            variant='filled'
                            size='medium'
                            label={`Save $${getProductPriceNumber(
                                'saveChipText'
                            )}`}
                            sx={{
                                background: 'white',
                                border: '2px solid #A5EC84',
                            }}
                        />
                    </div>

                    <div>
                        <BioType className='it-body md:itd-body'>
                            {renderDescription()}
                        </BioType>
                    </div>
                </div>

                <div className='w-full h-[1px] my-1'>
                    <HorizontalDivider
                        backgroundColor={'#1B1B1B1F'}
                        height={1}
                    />
                </div>

                <div>{renderBottomText()}</div>
            </Paper>
        </div>
    );
}
