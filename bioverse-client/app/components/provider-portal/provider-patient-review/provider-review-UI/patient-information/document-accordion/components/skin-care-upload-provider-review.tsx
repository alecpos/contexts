'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ImageExpandDialogModal from '@/app/components/provider-portal/intake-view/v2/components/patient-information-column/document-image-expand-modal';
import Image from 'next/image';
import { useState } from 'react';

interface SkinCareUploadProviderReviewProps {
    skinCareUrls: {
        left_side_url: string | undefined;
        right_side_url: string | undefined;
    };
}

export default function SkinCarePicturesProviderReview({
    skinCareUrls,
}: SkinCareUploadProviderReviewProps) {
    const [imageDialogLeftOpen, setImageDialogLeftOpen] = useState(false);
    const [imageDialogRightOpen, setImageDialogRightOpen] = useState(false);

    const handleClickOpenLeft = () => {
        setImageDialogLeftOpen(true);
    };
    const handleCloseLeft = () => {
        setImageDialogLeftOpen(false);
    };

    const handleClickOpenRight = () => {
        setImageDialogRightOpen(true);
    };
    const handleCloseRight = () => {
        setImageDialogRightOpen(false);
    };

    return (
        <>
            <BioType className='provider-tabs-subtitle'>Skin Care Face Uploads</BioType>

            <div className='flex flex-row w-full gap-2'>
                {skinCareUrls.left_side_url && (
                    <div className='relative w-[90%] aspect-[1.5] cursor-pointer'>
                        <>
                            <Image
                                src={skinCareUrls.left_side_url}
                                alt={''}
                                onClick={handleClickOpenLeft}
                                // width={313.5}
                                // height={196}
                                fill
                                quality={50}
                                unoptimized
                            />
                            <ImageExpandDialogModal
                                open={imageDialogLeftOpen}
                                handleClose={handleCloseLeft}
                                image_ref={skinCareUrls.left_side_url}
                            />
                        </>
                    </div>
                )}

                {skinCareUrls.right_side_url && (
                    <div className='relative w-[90%] aspect-[1.5] cursor-pointer'>
                        <>
                            <Image
                                src={skinCareUrls.right_side_url}
                                alt={''}
                                onClick={handleClickOpenRight}
                                // width={313.5}
                                // height={196}
                                fill
                                quality={50}
                                unoptimized
                            />
                            <ImageExpandDialogModal
                                open={imageDialogRightOpen}
                                handleClose={handleCloseRight}
                                image_ref={skinCareUrls.right_side_url}
                            />
                        </>
                    </div>
                )}
            </div>
        </>
    );
}
