'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';

interface SkinCareUploadComponentProps {
    skinCareURLs: {
        left_side_url: string | undefined;
        right_side_url: string | undefined;
    };
}

export default function SkinCareUploadComponent({
    skinCareURLs,
}: SkinCareUploadComponentProps) {
    return (
        <div>
            {(skinCareURLs.left_side_url || skinCareURLs.right_side_url) && (
                <>
                    {' '}
                    <BioType className='itd-subtitle'>
                        Skin-Care Face Pictures
                    </BioType>
                    <div className='flex flex-row'>
                        {skinCareURLs.left_side_url && (
                            <div className='flex flex-col w-[300px]'>
                                <BioType>Left Side</BioType>
                                <div className='relative w-[90%] aspect-[1.5]'>
                                    <>
                                        <Image
                                            src={skinCareURLs.left_side_url}
                                            alt={''}
                                            fill
                                            quality={50}
                                            unoptimized
                                        />
                                    </>
                                </div>
                            </div>
                        )}
                        {skinCareURLs.right_side_url && (
                            <div className='flex flex-col w-[300px]'>
                                <BioType>Right Side</BioType>
                                <div className='relative w-[90%] aspect-[1.5]'>
                                    <>
                                        <Image
                                            src={skinCareURLs.right_side_url}
                                            alt={''}
                                            fill
                                            quality={50}
                                            unoptimized
                                        />
                                    </>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
