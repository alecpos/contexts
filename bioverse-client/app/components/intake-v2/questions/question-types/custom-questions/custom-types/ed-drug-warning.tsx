'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';

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
            <div className='flex flex-col md:gap-8 w-full'>
                <BioType className={`it-h1 md:itd-h1`}>
                    Combining poppers, cocaine, methamphetamine, or cigarettes
                    with oral medications for ED can cause severe life and
                    health-threatening emergencies.
                </BioType>
                <div className='flex flex-col w-full justify-start gap-4 md:gap-5'>
                    <BioType className='it-body md:itd-body text-[#00000099]'>
                        Some of the emergencies that can occur when any of these
                        recreational drugs and ED medications are combined
                        include the following: priapism (an erection that
                        doesn&apos;t go away and can cause permanent damage to
                        your penis), stroke (which can cause permanent
                        disability), cardiac arrest (your heart stops beating),
                        muscle rigidity, very high fever, or death.
                    </BioType>

                    <BioType className='it-body md:itd-body text-[#00000099]'>
                        By selecting continue, you acknowledge that you have
                        read the provided warning about the risks of serious
                        medical harm and/or death if these recreational drugs
                        and ED medications are used together.
                    </BioType>
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
