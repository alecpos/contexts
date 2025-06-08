'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface GLP1WarningTransitionProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function EDDrugWarningComponent({
    handleContinueButton,
    isButtonLoading,
}: GLP1WarningTransitionProps) {
    return (
        <>
            <div className='flex flex-col md:gap-8 w-full mt-[1.25rem] md:mt-[48px]'>
                <BioType className={`inter-h5-constant`}>
                    Combining poppers, cocaine, methamphetamine, or cigarettes
                    with oral medications for ED can cause severe life and
                    health-threatening emergencies.
                </BioType>
                <div className='flex flex-col w-full justify-start gap-4 md:gap-5'>
                    <BioType className='intake-subtitle text-[#00000099]'>
                        Some of the emergencies that can occur when any of these
                        recreational drugs and ED medications are combined
                        include the following: priapism (an erection that
                        doesn&apos;t go away and can cause permanent damage to
                        your penis), stroke (which can cause permanent
                        disability), cardiac arrest (your heart stops beating),
                        muscle rigidity, very high fever, or death.
                    </BioType>

                    <BioType className='intake-subtitle text-[#00000099]'>
                        By selecting continue, you acknowledge that you have
                        read the provided warning about the risks of serious
                        medical harm and/or death if these recreational drugs
                        and ED medications are used together.
                    </BioType>
                </div>
            </div>

            <div className='w-full mt-4 md:flex md:justify-center'>
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </>
    );
}
