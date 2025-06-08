'use client';
import { useState, useRef, useEffect } from 'react';
import { Button, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import ProductPurchaseMobileDrawerMenuNew from './productPurchaseMobileDrawerMenu/productPurchaseMobileDrawerMenu';
import Paper from '@mui/material/Paper';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    data: any;
    priceData: ProductPriceRecord[];
    productHref: string;
}

export default function MobileDrawerButton({
    data,
    priceData,
    productHref,
}: Props) {
    const [drawerHeight, setDrawerHeight] = useState(85);
    //   const [open, setOpen] = useState<boolean>(true);
    const [isOpen, setOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const referenceButton = document.getElementById(
                'startButtonContainer'
            );

            if (referenceButton) {
                const divPosition = referenceButton.getBoundingClientRect();

                // Set the condition to check if the div is fully above the viewport
                const isDivAboveViewport = divPosition.bottom <= 50;

                // Update the state
                setShowDrawer(isDivAboveViewport);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (showDrawer) {
        return (
            <div className='overflow-auto'>
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${isDrawerOpen ? '330' : '95'}px`,
                        zIndex: 30,
                    }}
                    elevation={1}
                    onClick={() => {
                        if (!isDrawerOpen) {
                            setIsDrawerOpen(true);
                        }
                    }}
                >
                    <div className='flex justify-end'></div>
                    {isDrawerOpen && (
                        <ProductPurchaseMobileDrawerMenuNew
                            priceData={priceData}
                            productHref={productHref}
                            data={data}
                            setIsDrawerOpen={setIsDrawerOpen}
                        />
                    )}
                    {!isDrawerOpen && (
                        <>
                            <div className='w-full flex justify-center align-bottom space-x-4 mt-5 items-center md:w-[18.3vw]'>
                                <div
                                    className={`relative w-full aspect-square`}
                                    style={{
                                        position: 'relative',
                                        width: '40px',
                                        height: '40px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${data.image_ref[0]}`}
                                        fill
                                        objectFit='cover'
                                        alt={`Product Image ${data.image_ref}`}
                                        quality={100}
                                        priority
                                        unoptimized
                                    />
                                </div>
                                <Button
                                    variant='contained'
                                    className='h-[40px] w-[70%]'
                                >
                                    START YOUR FREE VISIT
                                </Button>
                            </div>
                        </>
                    )}
                </Paper>
                <div
                    style={{
                        width: '100%',
                        height: `${isOpen ? '300' : '95'}px`,
                    }}
                ></div>
            </div>
        );
    }
}
