'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import Image from 'next/image';

interface SkincareSeeOthersDesktopProps {}

const scrollbarHideStyle = {
    msOverflowStyle: 'none', // IE and Edge
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': {
        display: 'none', // Chrome, Safari and Opera
    },
} as React.CSSProperties;

export default function SkincareSeeOthersDekstopComponent({}: SkincareSeeOthersDesktopProps) {
    return (
        <div
            className='flex flex-row md:justify-center md:relative md:w-screen my-4 overflow-x-auto py-2'
            style={scrollbarHideStyle}
        >
            <div className='flex flex-row gap-8 md:items-center md:justify-center'>
                <Paper className='flex flex-grow h-[382px] w-[264px]'>
                    <div className='h-full flex flex-col flex-grow'>
                        <div className='px-4 pt-4'>
                            <Image
                                alt=''
                                src={
                                    '/img/intake/skincare/skin-care-see-others-1.png'
                                }
                                width={216}
                                height={144}
                                unoptimized
                            />
                        </div>
                        <div className='flex flex-col justify-between h-full px-4 pb-4 pt-1'>
                            <BioType className='it-body'>
                                “My skin used to get so dry and cracked that it
                                hurt. Since using this anti-aging cream, my skin
                                looks and feels 100x better.”
                            </BioType>
                            <div className='flex flex-col gap-0'>
                                <BioType className='it-body'>David L.</BioType>
                                <BioType className='it-body text-[#666666]'>
                                    Los Angeles, CA
                                </BioType>
                            </div>
                        </div>
                    </div>
                </Paper>
                <Paper className='flex flex-grow h-[382px] w-[264px]'>
                    {' '}
                    <div className='h-full flex flex-col flex-grow'>
                        <div className='px-4 pt-4'>
                            <Image
                                alt=''
                                src={
                                    '/img/intake/skincare/skin-care-see-others-2.png'
                                }
                                width={216}
                                height={144}
                                unoptimized
                            />
                        </div>
                        <div className='flex flex-col justify-between h-full px-4 pb-4 pt-1'>
                            <BioType className='it-body'>
                                “Breakouts had been a major source of
                                embarrassment since high school. Now I
                                don&apos;t have to worry about them and my skin
                                glows!”
                            </BioType>
                            <div className='flex flex-col gap-0'>
                                <BioType className='it-body'>Summer J.</BioType>
                                <BioType className='it-body text-[#666666]'>
                                    Fort Lauderdale, FL
                                </BioType>
                            </div>
                        </div>
                    </div>
                </Paper>
                <Paper className='flex flex-grow h-[382px] w-[264px]'>
                    {' '}
                    <div className='h-full flex flex-col flex-grow'>
                        <div className='px-4 pt-4'>
                            <Image
                                alt=''
                                src={
                                    '/img/intake/skincare/skin-care-see-others-3.png'
                                }
                                width={216}
                                height={144}
                                unoptimized
                            />
                        </div>
                        <div className='flex flex-col justify-between h-full px-4 pb-4 pt-1'>
                            <BioType className='it-body'>
                                “Very happy my dark spots have started to go
                                away. Good product. Good price.”
                            </BioType>
                            <div className='flex flex-col gap-0'>
                                <BioType className='it-body'>Lucy N.</BioType>
                                <BioType className='it-body text-[#666666]'>
                                    Los Angeles, CA
                                </BioType>
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    );
}
