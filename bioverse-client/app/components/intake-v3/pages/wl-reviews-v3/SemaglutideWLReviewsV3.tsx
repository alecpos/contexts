import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import AnimatedContinueButtonV3 from '../../buttons/AnimatedContinueButtonV3';
import Image from 'next/image';

export default function SemaglutideWLReviewsV3() {
    return (
        <div className="flex flex-col gap-5 md:gap-8 animate-slideRight mb-[40px]">
            <BioType className={`inter-h5-question-header`}>
                With semaglutide, 1 in 3 adults lost
                <span className="inter-h5-question-header-bold">
                    {' '}
                    20% of their body weight.
                </span>
            </BioType>
            <Paper className="rounded-xl" elevation={6}>
                <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                    <div className="flex flex-row gap-3">
                        <Image
                            alt="Michael R profile pic"
                            src="/img/intake/wl/testimonial_woman2.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Crystal W.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Fort Lauderdale, FL
                            </BioType>
                        </div>
                    </div>
                    <div className={`intake-subtitle mt-4`}>
                        &quot;Semaglutide has helped me create a whole new life
                        for myself. I&apos;ve lost 38 pounds, feel healthier,
                        and feel so much more confident in my day-to-day
                        life.&quot;
                    </div>
                    <div className="relative w-[140px] h-[28px] mt-4 mb-4">
                        <Image
                            alt="rating-stars"
                            src="/img/intake/wl/yellow-ratings-stars.svg"
                            fill
                            
                        />
                    </div>
                </div>
            </Paper>

            <Paper className="rounded-xl" elevation={6}>
                <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                    <div className="flex flex-row gap-3">
                        <Image
                            alt="Michael R profile pic"
                            src="/img/intake/wl/testimonial_man.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Michael R.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Chino Hills, CA
                            </BioType>
                        </div>
                    </div>

                    <BioType className={`intake-subtitle mt-5`}>
                        &quot;Medical weight loss used to feel so far out of
                        reach for me. Now I&apos;ve lost 29 pounds (so far)!
                        Thanks for providing an easy, affordable option for
                        semaglutide.&quot;
                    </BioType>

                    <div className="relative  w-[140px] h-[28px]  mb-4 mt-4">
                        <Image
                            alt="rating-stars"
                            src="/img/intake/wl/yellow-ratings-stars.svg"
                            fill
                            
                        />
                    </div>
                </div>
            </Paper>
        </div>
    );
}
