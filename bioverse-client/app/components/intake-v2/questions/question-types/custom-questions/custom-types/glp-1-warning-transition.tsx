'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HarvardEmblem from '../assets/harvard';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import SvgImage from './components/SvgImage';
import FemaleDoctorOne from '/img/intake/glp-1-warning-transition/female_doctor_1.svg';
import FemaleDoctorTwo from '/img/intake/glp-1-warning-transition/female_doctor_2.svg';
import MaleDoctorOne from '/img/intake/glp-1-warning-transition/male_doctor_1.svg';
import Image from 'next/image';

interface GLP1WarningTransitionProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function GLP1WarningTransition({
    handleContinueButton,
    isButtonLoading,
}: GLP1WarningTransitionProps) {
    return (
        <>
            <div className='flex flex-col md:gap-8 w-full'>
                <BioType className={`itd-h1`}>
                    If you&apos;re losing anywhere from 4-8 lbs a month, we
                    <span className='text-primary'>
                        {' '}
                        recommend to stay with your current dosing.
                    </span>
                </BioType>
                <div className='flex w-full justify-start gap-4 md:gap-5 mt-8 md:mt-3'>
                    <div className='w-1/3 aspect-[0.624] md:aspect-[.759] relative'>
                        <Image
                            src='/img/intake/wl/doctor5-head.png'
                            fill
                            alt='Doctor Image 2'
                            style={{
                                objectFit: 'cover',
                            }}
                            className='md:!transform-none object-[5px_0px] md:object-[10px_0px] rounded-md'
                            unoptimized
                        />
                    </div>
                    <div className='w-1/3 aspect-[.624] md:aspect-[.759] relative'>
                        <Image
                            src='/img/intake/wl/doctor3-head.png'
                            fill
                            alt='Doctor Image 1'
                            style={{
                                objectFit: 'cover',
                                objectPosition: '0px 0px',
                                // transform: 'scale(1.3)',
                            }}
                            className='md:!transform-none rounded-md'
                            unoptimized
                        />
                    </div>
                    <div className='w-1/3 aspect-[0.624] md:aspect-[.759] relative'>
                        <Image
                            src='/img/intake/wl/doctor6.png'
                            fill
                            alt='Doctor Image 3'
                            style={{
                                objectFit: 'cover',
                                // transform: 'scale(1.3)',
                            }}
                            className='md:!transform-none object-[-10px_0px] md:object-[0px_0px] rounded-md'
                            unoptimized
                        />
                    </div>
                </div>
            </div>

            <div className='w-full mt-4 md:flex md:justify-center'>
                <ContinueButton
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </>
    );
}
