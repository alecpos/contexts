'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import OptionSelectCard from './option-select-card/option-select-card';
import { useState } from 'react';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { updateOrderMetadata } from '@/app/utils/database/controller/orders/orders-api';
import { ServerSideOrderData } from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { usePathname, useRouter } from 'next/navigation';
import AltContinueButton from '../continue-button/alt-continue-button';
import React from 'react';

interface AltOptionSelectionProps {
    order_data: ServerSideOrderData;
}

const MOST_POPULAR_PRODUCT_HREF = PRODUCT_HREF.WL_CAPSULE;

export default function AltOptionSelectionComponent({
    order_data,
}: AltOptionSelectionProps) {
    const [selectedProduct, setSelectedProduct] = useState<string>(
        order_data.metadata.alternative_options.includes(PRODUCT_HREF.METFORMIN)
            ? 'metformin'
            : 'wl-capsule'
    );
    const [continueButtonLoading, setContinueButtonloading] =
        useState<boolean>(false);

    const router = useRouter();
    const path = usePathname();

    const handleProductCardClick = (product_href: string) => {
        setSelectedProduct(product_href);
    };

    const handleContinueButton = async () => {
        setContinueButtonloading(true);

        const newMetadata = {
            selected_alternative_product: selectedProduct,
        };

        await updateOrderMetadata(newMetadata, order_data.id);

        router.push(path + `/cadence`);

        setContinueButtonloading(false);
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
                                Which medication would you like to receive?
                            </BioType>
                            <BioType className='it-subtitle md:itd-subtitle'>
                                Select an option.
                            </BioType>
                        </div>

                        <div className='flex flex-col gap-6 mb-2'>
                            {order_data.metadata.alternative_options.map(
                                (option: string) => {
                                    return (
                                        <OptionSelectCard
                                            product_href={option}
                                            selectedProduct={selectedProduct}
                                            most_popular={
                                                option ===
                                                MOST_POPULAR_PRODUCT_HREF
                                            }
                                            handleProductCardClick={
                                                handleProductCardClick
                                            }
                                            key={option}
                                        />
                                    );
                                }
                            )}
                        </div>

                        <div className=''>
                            <AltContinueButton
                                onClick={() => {
                                    handleContinueButton();
                                }}
                                buttonLoading={continueButtonLoading}
                                disabled={!selectedProduct}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
