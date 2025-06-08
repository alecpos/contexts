import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import WLProductItemDisplay from './wl-product-item-display';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface Props {
    wl_goal: any;
    user_name: string;
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
    selectedDose: string;
    variantPriceData: Partial<ProductVariantRecord>;
}

export default function WLOrderSummary({
    wl_goal,
    user_name,
    product_name,
    variantNumber,
    product_data,
    priceData,
    pricingStructure,
    selectedDose,
    variantPriceData,
}: Props) {
    const params = useParams();
    const product_href = product_data.product_href;

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
                            sizes='(max-width: 1440px) calc(100vw - 2 * ((100vw - 456px) / 2)), 100vw'
                            className='z-40 border-4 border-white border-solid rounded-[28px]'
                            unoptimized
                        />

                        <div className='ml-[80px] w-[114px] z-30 absolute h-[76px] rounded-lg'>
                            <Image
                                src={'/img/patient-portal/wl-checkout2.png'}
                                fill
                                sizes='(max-width: 360px) 327px, (max-width: 1440px) 550px, (max-width: 2560px) 768px, (max-width: 3840px) 1024px, 100vw'
                                alt={`Product Image: ${mainImageRef}`}
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
                                alt={`Product Image: ${mainImageRef}`}
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
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${mainImageRef}`}
                                fill
                                sizes='(max-width: 360px) 327px, (max-width: 1440px) 550px, (max-width: 2560px) 768px, (max-width: 3840px) 1024px, 100vw'
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

            <div>
                <Paper elevation={4} className='flex flex-col mx-[0.4px]'>
                    <div className='flex flex-col p-6 md:p-6 gap-6'>
                        <div className='w-auto mx-auto mb-2'>
                            <Chip
                                variant='filled'
                                size='medium'
                                label="You won't be charged until prescribed"
                                sx={{
                                    background:
                                        'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                    color: 'white', // Optional: Set text color to white for better visibility
                                }}
                            />
                        </div>

                        {/** Product Data */}

                        <WLProductItemDisplay
                            user_name={user_name}
                            wl_goal={wl_goal}
                            product_name={product_name}
                            variantNumber={variantNumber}
                            product_data={product_data}
                            priceData={priceData}
                            pricingStructure={pricingStructure}
                            variantPriceData={variantPriceData}
                        />
                    </div>
                </Paper>
                <div className='bg-primary text-white w-[75%] mx-auto text-center rounded-b-lg pt-4 pb-3'>
                    <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                        You won&apos;t be charged until prescribed.
                    </BioType>
                </div>
            </div>
        </>
    );
}
