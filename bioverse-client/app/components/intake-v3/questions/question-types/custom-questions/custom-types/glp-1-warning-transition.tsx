'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
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
            <div className='flex flex-col  w-full mt-[1.25rem] md:mt-[48px]'>
                <BioType className={`inter-h5-question-header `}>
                    If you&apos;re losing anywhere from 4-8 lbs a month, we
                    <span className='inter-h5-question-header-bold'>
                        {' '}
                        recommend to stay with your current dosing.
                    </span>
                </BioType>
                <div className='w-full h-[210px] flex mt-[20px] sm:mt-[48px]'>
                    <div className='relative flex-1 rounded-t-lg   bg-[#F4F4F4F4] overflow-hidden'>
                        <Image
                            src='/img/intake/wl/aiDoctor.jpg'
                            fill
                            className='rounded-lg '
                            alt='Vial Image'
                            style={{ objectFit: 'cover' }}
                            unoptimized
                        />
                    </div>
                </div>
            </div>

            <div className='w-full mt-[1.25rem]  md:flex md:justify-center  md:mt-[48px]'>
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </>
    );
}
