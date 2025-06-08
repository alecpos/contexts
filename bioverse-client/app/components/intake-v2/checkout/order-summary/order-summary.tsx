import ProductItemDisplay from './product-item-display';
import { useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface Props {
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
    userProfileData: any;
}

export default function OrderSummary({
    product_name,
    variantNumber,
    product_data,
    priceData,
    pricingStructure,
    userProfileData,
}: Props) {
    const params = useParams();
    const product_href = params.product as string;

    //getImageRefUsingProductHref
    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref(product_href)
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const mainImageRef = data?.data[0];

    return (
        <>
            <div>
                <div className='flex'>
                    <div className='w-[114px] z-10 relative h-[76px] rounded-lg'>
                        <Image
                            src={
                                '/img/intake/up-next/female-doctor-head-cropped.png'
                            }
                            alt={'Scientist Image'}
                            fill
                            sizes='(max-width:  1440px) calc(100vw -  2 * ((100vw -  456px) /  2)),  100vw'
                            className='z-10 border-4 border-white border-solid rounded-[28px]'
                            unoptimized
                        />
                        <div className='ml-[80px] w-[114px] z-00 relative h-[76px] rounded-lg'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${mainImageRef}`}
                                fill
                                sizes='(max-width:  360px)  327px, (max-width:  1440px)  550px, (max-width:  2560px)  768px, (max-width:  3840px)  1024px,  100vw'
                                alt={`Product Image: ${mainImageRef}`}
                                style={{ objectFit: 'cover' }}
                                priority
                                className='border-4 border-white border-solid rounded-[28px]'
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>
            <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                Save your payment details
            </BioType>

            <Paper elevation={4} className='flex flex-col mx-[0.4px]'>
                <div className='flex flex-col p-6 md:p-6 gap-6'>
                    <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                        You won&apos;t be charged until prescribed
                    </BioType>
                    {/** Product Data */}

                    <ProductItemDisplay
                        product_name={product_name}
                        product_data={product_data}
                        priceData={priceData}
                        pricingStructure={pricingStructure}
                    />
                </div>
            </Paper>
        </>
    );
}
