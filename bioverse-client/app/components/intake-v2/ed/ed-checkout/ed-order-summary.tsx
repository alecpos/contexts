import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import Image from 'next/image';
import {
    ED_HREF_NAME_MAP,
    ED_PRODUCT_IMAGE_RED_MAP,
    EDCadenceData,
    EDSelectionMetadata,
} from '../utils/ed-selection-index';
import EDProductItemDisplay from './ed-product-item-display';

interface Props {
    cadenceData: {
        variant: any;
        price_data: any;
        variant_index: any;
        cadence: any;
        stripe_price_ids: any;
        product_href: any;
    };
    priceData: {
        variant: any;
        price_data: any;
        variant_index: any;
        cadence: any;
        stripe_price_ids: any;
        product_href: any;
    }[];
    edSelectionData: EDSelectionMetadata;
    userProfileData: ProfileDataIntakeFlowCheckout;
    changeSelectedCadence: (newCadenceData: EDCadenceData) => void;
}

export default function EDOrderSummary({
    cadenceData,
    priceData,
    userProfileData,
    changeSelectedCadence,
    edSelectionData,
}: Props) {
    const product_name = ED_HREF_NAME_MAP[cadenceData.product_href];
    const mainImageRef = ED_PRODUCT_IMAGE_RED_MAP[cadenceData.product_href];

    return (
        <>
            <div>
                <div className='flex'>
                    <div className='w-[114px] z-10 relative h-[76px] rounded-lg'>
                        <Image
                            src={
                                '/img/intake/up-next/male-doctor-head-cropped-ed-flow.png'
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
                                src={`${mainImageRef}`}
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

            <Paper elevation={4} className='flex flex-col mx-[0.8px]'>
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

                    <EDProductItemDisplay
                        product_name={product_name}
                        cadenceData={cadenceData}
                        userProfileData={userProfileData}
                        priceData={priceData}
                        changeSelectedCadence={changeSelectedCadence}
                        edSelectionData={edSelectionData}
                    />
                </div>
            </Paper>
            <div className='bg-primary text-white w-[75%] mx-auto text-center rounded-b-lg pt-4 pb-3 px-1 mt-[-17px]'>
                <BioType className={`it-body md:itd-body`}>
                    You won&apos;t be charged until prescribed.
                </BioType>
            </div>
        </>
    );
}
