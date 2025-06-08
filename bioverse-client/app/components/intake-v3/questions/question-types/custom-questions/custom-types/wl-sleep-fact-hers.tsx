import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface WLSleepFactProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLSleepFact({
    handleContinueButton,
    isButtonLoading,
}: WLSleepFactProps) {
    return (
        <div className="flex flex-col gap-6 md:gap-6 items-center mt-[1.25rem] md:mt-[48px] pb-16 max-w-[490px]">
            <BioType className="inter-h5-question-header">
                Did you know that adequate sleep is a key factor in losing
                weight?
            </BioType>
            <BioType className="inter-h5-question-header-bold">
                A study over 16 years revealed that{' '}
                <span className="text-[#6DB0CC]">
                    sleeping less than 7 hours
                </span>{' '}
                a night can lead to a{' '}
                <span className="text-[#6DB0CC]">
                    15% increased risk of weight gain
                </span>
                .
            </BioType>

            <div className="mt-4 flex justify-center">
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
