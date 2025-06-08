'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { ServerSideOrderData } from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import Image from 'next/image';
import CadenceOptionComponent from './cadence-option/alt-cadence-option';
import { useState } from 'react';
import AltContinueButton from '../continue-button/alt-continue-button';
import { updateOrderMetadata } from '@/app/utils/database/controller/orders/orders-api';
import { usePathname, useRouter } from 'next/navigation';

interface AltCadenceSelection {
    order_data: ServerSideOrderData;
}

export default function AltCadenceSelectionComponent({
    order_data,
}: AltCadenceSelection) {
    const product_href = order_data.metadata.selected_alternative_product;

    const [selectedCadence, setSelectedCadence] = useState<string>(
        product_href === PRODUCT_HREF.METFORMIN ? 'quarterly' : 'monthly'
    );

    const [continueButtonLoading, setContinueButtonloading] =
        useState<boolean>(false);

    const router = useRouter();
    const path = usePathname();

    const handleCadenceOptionSelection = (cadence: string) => {
        setSelectedCadence(cadence);
    };

    const handleContinueButton = async () => {
        setContinueButtonloading(true);

        const newMetadata = {
            selected_alternative_cadence: selectedCadence,
        };

        await updateOrderMetadata(newMetadata, order_data.id);

        const newPath = path.replace(/\/cadence$/, '/summary');
        router.push(newPath);

        setContinueButtonloading(false);
    };

    const getCadenceOptions = (): string[] => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return ['quarterly'];

            case PRODUCT_HREF.WL_CAPSULE:
                return ['monthly', 'quarterly'];

            default:
                return [];
        }
    };

    const getPriceOption = (cadence: string): string => {
        switch (product_href) {
            case PRODUCT_HREF.METFORMIN:
                return '$75';
            case PRODUCT_HREF.WL_CAPSULE:
                if (cadence === 'monthly') {
                    return '$75';
                } else {
                    return '$63.33';
                }
            default:
                return 'N/A';
        }
    };

    return (
        <>
            <div className='flex w-[90vw] md:w-full justify-center mt-28 sm:mt-16 sm:px-0'>
                <div
                    id='main-container'
                    className='flex flex-col gap-[28px] w-full sm:w-[520px]'
                >
                    <div className='flex flex-col gap-4 mb-8'>
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
                            <BioType className='text-[34px] font-twcsemimedium text-primary leading-[px]'>
                                How often would you like to receive your
                                medication?
                            </BioType>
                        </div>

                        <div className='flex flex-col gap-4'>
                            {getCadenceOptions().map((option) => {
                                return (
                                    <CadenceOptionComponent
                                        cadence={option}
                                        priceDisplay={getPriceOption(option)}
                                        selectedCadence={selectedCadence}
                                        handleCadenceOptionSelection={
                                            handleCadenceOptionSelection
                                        }
                                        key={option}
                                    />
                                );
                            })}
                        </div>

                        <div className=''>
                            <AltContinueButton
                                onClick={() => {
                                    handleContinueButton();
                                }}
                                buttonLoading={continueButtonLoading}
                                disabled={!selectedCadence}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
