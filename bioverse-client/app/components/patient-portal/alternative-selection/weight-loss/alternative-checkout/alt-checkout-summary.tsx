'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import {
    ServerSideOrderData,
    ServerSideProfileData,
} from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import { Paper, Chip } from '@mui/material';
import Image from 'next/image';

interface AltCheckoutSummaryProps {
    order_data: ServerSideOrderData;
    profile_data: ServerSideProfileData;
}

export default function AltCheckoutSummaryComponent({
    order_data,
    profile_data,
}: AltCheckoutSummaryProps) {
    const product_href = order_data.metadata.selected_alternative_product;
    const cadence = order_data.metadata.selected_alternative_cadence;

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

    const getProductSubtext = () => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '500 mg (180 tablets)';
            case PRODUCT_HREF.WL_CAPSULE:
                if (cadence === 'monthly') {
                    return '30 day supply';
                } else {
                    return '90 day supply';
                }
        }
    };

    const getPriceData = (key: string) => {
        interface PriceStructure {
            [key: string]: {
                [key: string]: {
                    [key: string]: string;
                };
            };
        }

        const price_structure: PriceStructure = {
            metformin: {
                quarterly: {
                    savings: '20',
                    grayPrice: '75.00',
                    blackPrice: '55.00',
                },
            },
            'wl-capsule': {
                monthly: {
                    savings: '15',
                    grayPrice: '75.00',
                    blackPrice: '60.00',
                },
                quarterly: {
                    savings: '25',
                    grayPrice: '199.00',
                    blackPrice: '174.00',
                },
            },
        };

        return price_structure[product_href][cadence][key];
    };

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
                            sizes='(max-width: 1440px) calc(100vw - 2 * ((100vw - 456px) / 2)), 100vw'
                            className='z-40 border-4 border-white border-solid rounded-[28px]'
                            unoptimized
                        />

                        <div className='ml-[80px] w-[114px] z-30 absolute h-[76px] rounded-lg'>
                            <Image
                                src={'/img/patient-portal/wl-checkout2.png'}
                                fill
                                sizes='(max-width: 360px) 327px, (max-width: 1440px) 550px, (max-width: 2560px) 768px, (max-width: 3840px) 1024px, 100vw'
                                alt={`Product Image`}
                                style={{ objectFit: 'cover' }}
                                priority
                                className='border-4 border-white border-solid rounded-[28px]'
                                unoptimized
                            />
                        </div>
                        <div className='ml-[160px] w-[114px] z-20 absolute h-[76px] rounded-lg'>
                            <Image
                                src='/img/patient-portal/wl-checkout3.jpeg'
                                fill
                                alt={`Product Image`}
                                style={{
                                    objectFit: 'fill',
                                    objectPosition: '33px 0',
                                }} // Center the content of the image
                                priority
                                className='border-4 border-white border-solid rounded-[28px]'
                                unoptimized
                            />
                        </div>
                        <div className='ml-[240px] w-[114px] z-10 absolute h-[76px] rounded-lg'>
                            <Image
                                src={`${
                                    process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY
                                }${getProductImageRef()}`}
                                fill
                                sizes='(max-width: 360px) 327px, (max-width: 1440px) 550px, (max-width: 2560px) 768px, (max-width: 3840px) 1024px, 100vw'
                                alt={`Product Image: ${getProductImageRef()}`}
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

            <div>
                <Paper elevation={4} className='flex flex-col mx-[0.4px]'>
                    <div className='flex flex-col p-6 md:p-6 gap-6'>
                        {/** Product Data */}

                        <div className='flex flex-row p-0 gap-4 w-full -mt-2 md:-mt-4'>
                            <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                                <div className='flex justify-between gap-4'>
                                    <div className='flex flex-col gap-1'>
                                        <BioType
                                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                        >
                                            {profile_data.first_name}&apos;s
                                            Treatment:
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            {getProductName()}
                                        </BioType>

                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                                        >
                                            {getProductSubtext()}
                                        </BioType>
                                    </div>
                                </div>

                                <div className='w-full h-[1px] mb-1'>
                                    <HorizontalDivider
                                        backgroundColor={'#1B1B1B1F'}
                                        height={1}
                                    />
                                </div>
                                <div className='flex justify-between items-center'>
                                    <div className='w-[50%] md:w-full text-wrap'>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            Provider evaluation
                                        </BioType>
                                    </div>

                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                                    >
                                        FREE
                                    </BioType>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <div className='w-[50%] md:w-full text-wrap'>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            Free check-ins
                                        </BioType>
                                    </div>

                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                                    >
                                        FREE
                                    </BioType>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <div className='w-[50%] md:w-full text-wrap'>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            Free shipping
                                        </BioType>
                                    </div>

                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                                    >
                                        FREE
                                    </BioType>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <div className='w-[50%] md:w-full text-wrap'>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                        >
                                            Ongoing medical support
                                        </BioType>
                                    </div>

                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                                    >
                                        FREE
                                    </BioType>
                                </div>

                                <div className='bg-[#A5EC84] w-full py-0.5 rounded-md flex justify-center'>
                                    <BioType className='text-black it-body md:itd-body'>
                                        You&apos;re saving $
                                        {getPriceData('savings')} with this
                                        plan.
                                    </BioType>
                                </div>

                                <div className='w-full h-[1px] my-1'>
                                    <HorizontalDivider
                                        backgroundColor={'#1B1B1B1F'}
                                        height={1}
                                    />
                                </div>

                                <div className='w-full flex flex-col justify-center'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <div className='w-[50%] md:w-full text-wrap'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                Total
                                            </BioType>
                                        </div>
                                        <div className='flex flex-row gap-1'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#00000099] line-through decoration-[#00000099] decoration-1`}
                                            >
                                                ${getPriceData('grayPrice')}
                                            </BioType>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                ${getPriceData('blackPrice')}
                                            </BioType>
                                        </div>
                                    </div>

                                    <Chip
                                        variant='filled'
                                        size='medium'
                                        label={`Refills every ${
                                            cadence === 'monthly'
                                                ? 'month'
                                                : '3 months'
                                        }, cancel anytime`}
                                        sx={{
                                            marginX: 'auto',
                                            background:
                                                'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                            color: 'white', // Optional: Set text color to white for better visibility
                                            padding: '1.25em',
                                        }}
                                    />
                                </div>

                                <div className='w-full h-[1px] my-1'>
                                    <HorizontalDivider
                                        backgroundColor={'#1B1B1B1F'}
                                        height={1}
                                    />
                                </div>
                                <div className='flex justify-between'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-black`}
                                    >
                                        DUE TODAY
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-black`}
                                    >
                                        $00.00
                                    </BioType>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        </>
    );
}
