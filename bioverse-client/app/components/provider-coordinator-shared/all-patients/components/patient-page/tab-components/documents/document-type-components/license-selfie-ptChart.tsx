'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';

interface LicenseSelfieDocumentsInterface {
    licenseURLString: string | undefined;
    selfieURLString: string | undefined;
}

export default function LicenseSelfieDocuments({
    licenseURLString,
    selfieURLString,
}: LicenseSelfieDocumentsInterface) {
    return (
        <div>
            <BioType className='itd-subtitle'>License and Selfie</BioType>

            <div className='flex flex-row'>
                <div className='flex flex-col w-[300px]'>
                    <BioType className='it-subtitle'>License:</BioType>
                    {licenseURLString && (
                        <div className='relative w-[90%] aspect-[1.5]'>
                            <>
                                <Image
                                    src={licenseURLString}
                                    alt={''}
                                    fill
                                    quality={50}
                                    unoptimized
                                />
                            </>
                        </div>
                    )}
                </div>
                <div className='flex flex-col w-[300px]'>
                    <BioType className='it-subtitle'>Selfie:</BioType>
                    {selfieURLString && (
                        <div className='relative w-[90%] aspect-[1.5]'>
                            <>
                                <Image
                                    src={selfieURLString}
                                    alt={''}
                                    fill
                                    quality={50}
                                    unoptimized
                                />
                            </>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
