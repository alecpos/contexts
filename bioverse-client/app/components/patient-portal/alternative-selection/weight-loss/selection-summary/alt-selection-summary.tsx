'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_INPUT_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { ServerSideOrderData } from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { Divider, Paper } from '@mui/material';
import Image from 'next/image';
import AltSummaryCarouselComponent from './summary-carousel/alt-summary-carousel';
import AltContinueButton from '../continue-button/alt-continue-button';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface AltSelectionSummaryProps {
    order_data: ServerSideOrderData;
}

export default function AltSelectionSummaryComponent({
    order_data,
}: AltSelectionSummaryProps) {
    const product_href = order_data.metadata.selected_alternative_product;
    const cadence = order_data.metadata.selected_alternative_cadence;

    const [continueButtonLoading, setContinueButtonloading] =
        useState<boolean>(false);

    const router = useRouter();
    const path = usePathname();

    const handleContinueClick = () => {
        setContinueButtonloading(true);

        const newPath = path.replace(/\/summary$/, '/checkout');
        router.push(newPath);
    };

    const getProductImageRef = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return 'product-images/metformin/metformin-mar-15-full.png';
            case PRODUCT_HREF.WL_CAPSULE:
                return 'product-images/wl-capsule/weight loss capsules_no bg.png';
        }
    };

    const getProductRenderData = (key: string) => {
        interface ProductRenderData {
            [key: string]: {
                [key: string]: string | undefined;
            };
        }

        const productRenderMapping: ProductRenderData = {
            metformin: {
                productName: 'Metformin',
                productDose: '[500 mg tablets or as prescribed]',
                totalIfPrescribed: '75.00',
                savings: '20',
                productSubtitle: 'Improve insulin sensitivity and heart health',
                productDescription:
                    'Metformin is a widely prescribed medication primarily for Type 2 diabetes, known for its effectiveness in improving insulin sensitivity and reducing blood sugar levels. Additionally, metformin has shown potential in aiding weight management and improving cardiovascular health, making it a valuable tool in addressing metabolic disorders.',
            },
            'wl-capsule': {
                productName: 'BIOVERSE Weight Loss Capsules',
                productDose:
                    cadence === 'quarterly' ? '90 day supply' : '30 day supply',
                savings: '26',
                totalIfPrescribed: cadence === 'quarterly' ? '174.00' : '60.00',
                productSubtitle: 'N/A',
                productDescription: 'N/A',
            },
        };

        return productRenderMapping[product_href][key];
    };

    return (
        <>
            <div className='flex w-[90vw] md:w-full justify-center mt-28 sm:mt-16 sm:px-0'>
                <div
                    id='main-container'
                    className='flex flex-col gap-[28px] w-full sm:w-[520px]'
                >
                    <div className='flex flex-col gap-2 mb-8'>
                        <div className='flex flex-col items-start justify-start w-full'>
                            <div className='flex md:hidden'>
                                <Image
                                    src={'/img/bioverse-logo-full.png'}
                                    alt={'logo'}
                                    width={216}
                                    height={52}
                                    unoptimized
                                />
                            </div>
                            <div className='hidden md:flex'>
                                <Image
                                    src={'/img/bioverse-logo-full.png'}
                                    alt={'logo'}
                                    width={170}
                                    height={41}
                                    unoptimized
                                />
                            </div>
                        </div>

                        <div
                            id='header-text'
                            className='flex flex-col gap-4 w-full items-start mt-0'
                        >
                            <BioType className='text-[28px] font-twcsemimedium text-primary my-1'>
                                Your order summary
                            </BioType>
                        </div>

                        <>
                            <Paper
                                elevation={4}
                                className='flex flex-col mx-[0.4px] p-4'
                            >
                                <BioType
                                    className={`it-h1 !font-twcsemimedium text-[1.5rem] `}
                                >
                                    {getProductRenderData('productName')}
                                </BioType>
                                <div className='flex flex-col space-y-[9px]'>
                                    <BioType className='it-body md:itd-body flex mt-2'>
                                        {getProductRenderData('productDose')}
                                    </BioType>
                                    {getProductRenderData('savings') && (
                                        <div className='bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center'>
                                            <BioType className='text-black it-body md:itd-body'>
                                                You&apos;re saving $
                                                {getProductRenderData(
                                                    'savings'
                                                )}{' '}
                                                with this plan.
                                            </BioType>
                                        </div>
                                    )}
                                    <div className='w-full flex justify-between'>
                                        <BioType
                                            className={`${INTAKE_INPUT_TAILWIND}`}
                                        >
                                            Total, if prescribed:
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_INPUT_TAILWIND}`}
                                        >
                                            $
                                            {getProductRenderData(
                                                'totalIfPrescribed'
                                            )}
                                        </BioType>
                                    </div>
                                </div>
                                <div className='mx-auto my-2 relative w-[100%] md:w-[75%] aspect-[1.7]'>
                                    <Image
                                        src={`${
                                            process.env
                                                .NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY
                                        }${getProductImageRef()}`}
                                        alt={'Product Image'}
                                        fill
                                        objectFit='cover'
                                        unoptimized
                                    />
                                </div>
                                <div className='flex flex-row justify-between items-end'>
                                    <div className='md:w-[80%] w-[70%] '>
                                        <div className='mb-1'>
                                            <img
                                                className='h-5 w-5'
                                                alt={'Add circle'}
                                                src={`/img/intake/svg/add-circle.svg`}
                                            />
                                        </div>
                                        <BioType
                                            className={`it-body !text-[1rem]`}
                                        >
                                            Comes with medical support tailored
                                            to your health needs and concerns
                                        </BioType>
                                    </div>
                                    <div className=' h-full relative flex items-end'>
                                        <div className='bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-0'>
                                            <img
                                                className='h-5 w-5'
                                                alt={'Stethoscope'}
                                                src={`/img/intake/svg/stethescope.svg`}
                                            />
                                        </div>

                                        <div className='bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-2'>
                                            <img
                                                className='h-5 w-5'
                                                alt={'Stethoscope'}
                                                src={`/img/intake/svg/stethescope.svg`}
                                            />
                                        </div>
                                        <div className='bg-[#E5EDF4] rounded-md border-primary border-[1.5px] border-solid h-16 px-4 flex items-center absolute right-4'>
                                            <img
                                                className='h-5 w-5'
                                                alt={'Stethoscope'}
                                                src={`/img/intake/svg/stethescope.svg`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                            <div className='bg-primary text-white mx-auto text-center rounded-b-lg p-4 mb-6'>
                                <BioType className={`it-body`}>
                                    You won&apos;t be charged until prescribed.
                                </BioType>
                            </div>

                            <BioType
                                className={`!text-primary it-subtitle md:itd-subtitle !font-twcsemimedium mb-2`}
                            >
                                Doctor-trusted ingredients, formulated to
                                provide results.
                            </BioType>
                            {product_href === PRODUCT_HREF.METFORMIN ? (
                                <Paper
                                    elevation={4}
                                    className='flex flex-col p-4 mb-6'
                                >
                                    <BioType
                                        className={`it-subtitle !font-twcsemimedium text-primary mb-1`}
                                    >
                                        {getProductRenderData('productName')}
                                    </BioType>
                                    <BioType
                                        className={`it-input !font-twcsemimedium mb-1`}
                                    >
                                        {getProductRenderData(
                                            'productSubtitle'
                                        )}
                                    </BioType>
                                    <BioType
                                        className={`it-body  text-textSecondary`}
                                    >
                                        {getProductRenderData(
                                            'productDescription'
                                        )}
                                    </BioType>
                                </Paper>
                            ) : (
                                <div className='flex flex-row w-full mb-4'>
                                    <AltSummaryCarouselComponent
                                        product={product_href}
                                    />
                                </div>
                            )}
                            <BioType
                                className={`!text-primary it-subtitle !font-twcsemimedium mb-2`}
                            >
                                We&apos;re here to help every step of the way
                            </BioType>
                            <div className='w-full h-[140px] flex '>
                                <div className='relative flex-1 border-r-4 border-white rounded-r-lg bg-[#F4F4F4F4] overflow-hidden'>
                                    <Image
                                        src='/img/intake/doctor2.jpg'
                                        fill
                                        alt='Doctor Image'
                                        unoptimized
                                        sizes='100%'
                                        className='object-cover object-[0px_0px]'
                                    />
                                </div>
                                <div className='relative flex-1 border-4  rounded-md bg-[#F4F4F4F4] overflow-hidden'>
                                    <Image
                                        src='/img/intake/doctor.jpeg'
                                        fill
                                        unoptimized
                                        alt='Vial Image'
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>

                            <Paper className='p-4 md:mb-[1.75rem] mb-[100px] mt-6'>
                                <div className='flex flex-row gap-2 mb-[.75rem]'>
                                    <img
                                        className='h-6 w-6'
                                        alt={'Iphone icon'}
                                        src={`/img/intake/svg/iphone.svg`}
                                    />

                                    <div className='flex flex-col gap-[.75rem]'>
                                        <BioType
                                            className={`text-primary it-subtitle !font-twcsemimedium`}
                                        >
                                            Ongoing check-ins
                                        </BioType>
                                        <BioType
                                            className={`text-textSecondary it-body`}
                                        >
                                            We&apos;ll follow up regularly to
                                            see how you&apos;re doing and
                                            progressing towards your goals.
                                        </BioType>
                                    </div>
                                </div>
                                <Divider />
                                <div className='flex flex-row gap-2 my-[.75rem]'>
                                    <img
                                        className='h-6 w-6'
                                        alt={'Chat bubble icon'}
                                        src={`/img/intake/svg/chat-bubble.svg`}
                                    />
                                    <div className='flex flex-col gap-[.75rem]'>
                                        <BioType
                                            className={`text-primary it-subtitle !font-twcsemimedium`}
                                        >
                                            Unlimited messaging
                                        </BioType>
                                        <BioType
                                            className={`text-textSecondary it-body`}
                                        >
                                            Message your care team at any time
                                            at no extra cost.
                                        </BioType>
                                    </div>
                                </div>
                                <Divider className='' />
                                <div className='flex flex-row gap-2 mt-[.75rem]'>
                                    <img
                                        className='h-6 w-6'
                                        alt={'Favorite icon'}
                                        src={`/img/intake/svg/favorite.svg`}
                                    />
                                    <div className='flex flex-col gap-[.75rem]'>
                                        <BioType
                                            className={`text-primary it-subtitle !font-twcsemimedium`}
                                        >
                                            Free shipping
                                        </BioType>
                                        <BioType
                                            className={`text-textSecondary it-body`}
                                        >
                                            We&apos;ll deliver every shipment
                                            right to your door.
                                        </BioType>
                                    </div>
                                </div>
                            </Paper>
                        </>
                        <div className=''>
                            <AltContinueButton
                                onClick={() => {
                                    handleContinueClick();
                                }}
                                buttonLoading={continueButtonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
