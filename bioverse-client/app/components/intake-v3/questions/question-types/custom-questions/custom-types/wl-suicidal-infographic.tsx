import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface WLHormoneInfoProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLSuicidalInfographic({
    handleContinueButton,
    isButtonLoading,
}: WLHormoneInfoProps) {
    return (
        <div className="flex flex-col gap-6 md:gap-6  mt-[1.25rem] md:mt-[48px] pb-16 max-w-[490px]">
            <BioType className={`inter-h5-question-header`}>
                If you are experiencing suicideal thoughts and need to speak to
                someone, please reach out to individuals in your current
                environment or use the resources below for immediate assistance:
            </BioType>

            <BioType className={`inter-h5-question-header`}>
                24/7 National Suicide Prevention Lifeline: 988 (call or text) En
                Español: 1-888-628-9454
            </BioType>

            <BioType className={`inter-h5-question-header`}>
                24/7 Crisis Text Line: Text “HOME” to 741-741
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
