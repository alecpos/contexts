'use client';

import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { Button } from '@mui/material';

interface WL_Capsule_Cadence_Selection_Props {
    order_id: number;
}

export default function WL_Capsule_Cadence_Selection_Component({
    order_id,
}: WL_Capsule_Cadence_Selection_Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(1);
    const [selectedCadence, setSelectedCadence] = useState<string>('quarterly');
    const searchParams = useSearchParams();
    const search = searchParams.toString();

    const router = useRouter();

    if (order_id === 0) {
        return (
            <div>
                <h1>There was an issue, please refresh the page.</h1>
            </div>
        );
    }

    const updateOrderCadenceAndVariantIndex = async (
        cadence: string,
        variant_index: number
    ) => {
        await updateOrder(order_id, {
            subscription_type: cadence,
            variant_index: variant_index,
        });
    };

    const handleContinueButton = async () => {
        setLoading(true);

        await updateOrderCadenceAndVariantIndex(
            selectedCadence,
            selectedVariantIndex
        );

        const searchParamsNew = new URLSearchParams(search);

        searchParamsNew.delete('nu');
        searchParamsNew.set('st', selectedCadence);
        searchParamsNew.set('pvn', String(selectedVariantIndex));
        searchParamsNew.set('bvrt_wlcap_cad', selectedCadence);

        const newSearch = searchParamsNew.toString();

        router.push(
            `/intake/prescriptions/weight-loss/order-summary-v3?${newSearch}`
        );

        setLoading(false);
    };

    const renderOfferSentence = () => {
        return 'For a limited time, BIOVERSE is offering a 11.5% discount on your medication if you purchase a 12-week supply.';
    };

    const renderMostPopularBanner = () => {
        return (
            <div className='w-full mb-[-22px] max-w-[160px]'>
                <div className='  h-[0.75rem] md:h-[18px]  py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 mx-4 flex flex-col justify-center'>
                    <BioType className='intake-v3-disclaimer-text text-center'>
                        <div className=' flex flex-row justify-center gap-1'>
                            <span className='my-auto'>Most Popular</span>
                        </div>
                    </BioType>
                </div>
            </div>
        );
    };

    const renderQuarterlyCard = () => {
        return (
            <>
                {renderMostPopularBanner()}

                <Button
                    className={`flex flex-col  py-3 px-[1.1rem] md:px-[17px] rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case ${
                        selectedCadence === 'quarterly'
                            ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                            : 'border-[#BDBDBD] border-2'
                    } items-center gap-2`}
                    onClick={() => {
                        setSelectedCadence('quarterly');
                        setSelectedVariantIndex(1);
                    }}
                >
                    <div className='flex w-full'>
                        <div className='bg-[#A5EC84] w-full flex justify-center items-center  rounded-md'>
                            <BioType
                                className={`inter text-[#000000e6] text-center text-[14px] font-normal leading-[18px] [font-feature-settings:'liga'_off,'clig'_off]`}
                            >
                                For a limited time, save 11.5%.
                            </BioType>
                        </div>
                    </div>

                    <div className='flex items-center'>
                        <div className='flex flex-col  '>
                            <div className='flex justify-left mt-1 normal-case'>
                                <BioType
                                    className={`inter text-[16px] leading-[20px] text-[#000000E5] font-[400]`}
                                >
                                    Supply ships every three months. Cancel
                                    anytime.
                                </BioType>
                            </div>

                            <div className='w-full flex justify-between'>
                                <div>
                                    <div className='flex flex-col'>
                                        <BioType
                                            className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                        >
                                            12-week supply
                                        </BioType>
                                        <BioType
                                            className={`intake-subtitle-bold `}
                                        >
                                            $ 66.33/month{' '}
                                        </BioType>
                                    </div>
                                </div>
                                <div
                                    className='flex flex-col justify-center items-center rounded-md py-1 px-2 max-h-[24px] mt-[0.82rem] md:mt-[14px] '
                                    style={{ border: '1.5px solid #000000' }}
                                >
                                    <BioType className='text-black inter-h5-regular text-sm'>
                                        save $26
                                    </BioType>
                                </div>
                            </div>

                            <div className='mt-[0.62rem] md:mt-[10px]'>
                                <BioType className='inter font-normal text-[16px] leading-[20px] text-[rgba(0,0,0,0.90)]'>
                                    Buproprion HCl 65 mg, Naltrexone HCl 8 mg,
                                    Topiramate 15 mg
                                </BioType>
                                <BioType className='inter font-normal text-[16px] leading-[20px] text-[#333333bf]'>
                                    (3 bottles included in shipment)
                                </BioType>
                            </div>
                        </div>
                    </div>
                </Button>
            </>
        );
    };

    const renderMonthlyCard = () => {
        return (
            <>
                <Button
                    className={`flex flex-col  py-3 px-[1.1rem] md:px-[17px] rounded-lg border-solid text-start mx-auto w-full md:max-w-[447px] text-black normal-case ${
                        selectedCadence === 'monthly'
                            ? 'border-[#98d2ea] border-4 bg-[#f5fafc]'
                            : 'border-[#BDBDBD] border-2'
                    } items-center gap-2`}
                    onClick={() => {
                        setSelectedCadence('monthly');
                        setSelectedVariantIndex(0);
                    }}
                >
                    <div className='flex items-center'>
                        <div className='flex flex-col  '>
                            <div className='flex justify-center mt-1 normal-case'>
                                <BioType
                                    className={`intake-subtitle break-words w-full text-center`}
                                >
                                    Supply ships every three months. Cancel
                                    anytime.
                                </BioType>
                            </div>

                            <div className='w-full flex justify-between'>
                                <div>
                                    <div className='flex flex-col'>
                                        <BioType
                                            className={`intake-subtitle-bold mt-[0.62rem] md:mt-[10px]`}
                                        >
                                            4-week supply
                                        </BioType>
                                        <BioType
                                            className={`intake-subtitle-bold `}
                                        >
                                            $ 75/month{' '}
                                        </BioType>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-[0.62rem] md:mt-[10px]'>
                                <BioType className='inter font-normal text-[16px] leading-[20px] text-[rgba(0,0,0,0.90)]'>
                                    Buproprion HCl 65 mg, Naltrexone HCl 8 mg,
                                    Topiramate 15 mg
                                </BioType>
                                <BioType className='inter font-normal text-[16px] leading-[20px] text-[#333333bf]'>
                                    (1 bottle included in shipment)
                                </BioType>
                            </div>
                        </div>
                    </div>
                </Button>
            </>
        );
    };

    return (
        <div
            className={`justify-center flex animate-slideRight pb-20 lg:pb-0 `}
        >
            <div className='flex flex-col  md:max-w-[447px]'>
                <div className='flex flex-col w-full  mt-[1.15rem] md:mt-[28px]'>
                    <div className='md:max-w-[447px] mx-auto flex flex-col '>
                        <p className={`inter-h5-question-header `}>
                            How much medication would you like to receive?
                        </p>

                        <BioType
                            className={`intake-subtitle mt-[0.75rem] md:mt-[12px]`}
                        >
                            {renderOfferSentence()}
                        </BioType>
                    </div>

                    <div className='flex flex-col gap-[22px] md:mb-[48px] pt-[1.61rem] md:pt-[29px]'>
                        {renderQuarterlyCard()}

                        {renderMonthlyCard()}
                    </div>
                    <div className='mt-[66px] sm:mt-0 '>
                        <div className='flex flex-col items-center justify-center relative max-w-[447px]'>
                            <ContinueButtonV3
                                onClick={handleContinueButton}
                                buttonLoading={loading}
                                fullWidth={true}
                                widthOverride={'447px'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
