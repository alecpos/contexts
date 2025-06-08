import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import HarvardEmblem from '@/app/components/intake-v2/questions/question-types/custom-questions/assets/harvard';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface WLFamilyQuestionProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLFamilyQuestionV3({
    handleContinueButton,
    isButtonLoading,
}: WLFamilyQuestionProps) {
    return (
        <div className="flex flex-col gap-6 md:gap-6 items-center mt-[1.25rem] md:mt-[48px] pb-16 max-w-[490px]">
            <BioType className="inter-h5-question-header ">
                <span className="inter-h5-question-header-bold">40% to 70%</span> of your weight
                may be generically predetermined.
            </BioType>
            <BioType className="inter-h5-question-header">
                This is likely because we inherit the genes that influence
                factors like our appetite and how quickly we burn calories.
            </BioType>

            <div className="mt-[1.25rem] md:mt-[48px]">
                <HarvardEmblem />
            </div>
            <div className="mt-4 flex justify-center">
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
