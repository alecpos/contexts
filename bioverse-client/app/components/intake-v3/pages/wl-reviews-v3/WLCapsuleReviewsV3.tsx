import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import Image from 'next/image';

export default function WLCapsuleReviewsV3() {
    return (
        <div className='flex flex-col gap-5 md:gap-8 animate-slideRight mb-[40px]'>
            <BioType className={`inter-h5-question-header`}>
                Hear from our satisfied
                <span className='inter-h5-question-header-bold'>
                    {' '}
                    satisfied patients
                </span>
            </BioType>
            <Paper className='rounded-xl' elevation={6}>
                <div className='px-4 md:px-6 pb-4 pt-[22px] '>
                    <div className='flex flex-row gap-3'>
                        <Image
                            alt='ReviewPFP1'
                            src='/img/intake/wl/wlcapreviewwoman1.png'
                            width={56}
                            height={56}
                            
                        />
                        <div className='flex flex-col '>
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Sarah R.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Redding, CA
                            </BioType>
                        </div>
                    </div>
                    <div className={`intake-subtitle mt-4`}>
                        &quot;I lost over 8 pounds in two months with Bioverse,
                        and it&apos;s so much easier than injections. Affordable
                        and simple to use—highly recommend!&quot;
                    </div>
                    <div className='relative w-[140px] h-[28px] mt-4 mb-4'>
                        <Image
                            alt='rating-stars'
                            src='/img/intake/wl/yellow-ratings-stars.svg'
                            fill
                            
                        />
                    </div>
                </div>
            </Paper>

            <Paper className='rounded-xl' elevation={6}>
                <div className='px-4 md:px-6 pb-4 pt-[22px] '>
                    <div className='flex flex-row gap-3'>
                        <Image
                            alt='ReviewPFP2'
                            src='/img/intake/wl/wlcapsulereviewman1.png'
                            width={56}
                            height={56}
                            
                        />
                        <div className='flex flex-col '>
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                John S.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Chicago, IL
                            </BioType>
                        </div>
                    </div>

                    <BioType className={`intake-subtitle mt-5`}>
                        &quot;Bioverse helped me lose 10 pounds in a month
                        without breaking the bank. It&apos;s a great option
                        instead of injections!&quot;
                    </BioType>

                    <div className='relative  w-[140px] h-[28px]  mb-4 mt-4'>
                        <Image
                            alt='rating-stars'
                            src='/img/intake/wl/yellow-ratings-stars.svg'
                            fill
                            
                        />
                    </div>
                </div>
            </Paper>
        </div>
    );
}
