import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import AnimatedContinueButtonV3 from '../../buttons/AnimatedContinueButtonV3';
import Image from 'next/image';

export default function MetforminWLReviewsV3() {
    return (
        <div className="flex flex-col gap-5 md:gap-8 animate-slideRight mb-[40px]">
            <BioType className={`inter-h5-question-header`}>
                Hear from our
                <span className="inter-h5-question-header-bold">
                    {' '}
                    satisfied patients
                </span>
            </BioType>
            <Paper className="rounded-xl" elevation={6}>
                <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                    <div className="flex flex-row gap-3">
                        <Image
                            alt="Emily profile pic"
                            src="/img/intake/wl/metformin/EmilyB.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Emily B.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Palm Beach, FL
                            </BioType>
                        </div>
                    </div>
                    <div className={`intake-subtitle mt-4`}>
                        &quot;Metformin has effectively maintained my blood sugar levels and improved my overall health since I started using. A total game changer!&quot;
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
                            alt="John S profile pic"
                            src="/img/intake/wl/metformin/JohnS.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
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
                        &quot;Metformin&apos;s impact on my life has been profound. Not only does it help with my blood sugar, but I&apos;ve also noticed a positive change in my weight management efforts.&quot;
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
