import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import AnimatedContinueButtonV3 from '../../buttons/AnimatedContinueButtonV3';
import Image from 'next/image';

export default function TirzepatideWLReviewsV3() {
    return (
        <div className="flex flex-col gap-5 md:gap-8 animate-slideRight mb-[40px]">
            <BioType className={`inter-h5-question-header`}>
                With tirzepatide, you can lose up to
                <span className="inter-h5-question-header-bold">
                    {' '}
                    20% of your body weight.
                </span>
            </BioType>
            <Paper className="rounded-xl" elevation={6}>
                <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                    <div className="flex flex-row gap-3">
                        <Image
                            alt="Michael R profile pic"
                            src="/img/intake/wl/isabella_headshot.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Isabella R.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Orlando, FL
                            </BioType>
                        </div>
                    </div>
                    <div className={`intake-subtitle mt-4`}>
                        &quot;Tirzepatide has surpassed my expectations.
                        It&apos;s not just weight loss; I feel healthier and
                        more energetic. And it&apos;s more affordable than brand
                        names.&quot;
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
                            src="/img/intake/wl/james_headshot.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                James S.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Houston, TX
                            </BioType>
                        </div>
                    </div>

                    <BioType className={`intake-subtitle mt-5`}>
                        &quot;Honestly, SO happy that I started with
                        tirzepatide. The weight has been coming off, and
                        I&apos;m experiencing fewer blood sugar spikes.&quot;
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
