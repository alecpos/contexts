import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface WLHormoneInfoProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLNicotineInfo({
    handleContinueButton,
    isButtonLoading,
}: WLHormoneInfoProps) {
    return (
        <div className="flex flex-col gap-6 md:gap-6  mt-[1.25rem] md:mt-[48px] pb-16 max-w-[490px]">
            <BioType className={`inter-h5-question-header`}>
                Using nicotine replacement products while taking bupropion may
                cause episodes of elevated blood pressure without prior
                hypertension. Please inform your primary care provider so that
                monitoring of blood pressure can be done.
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
