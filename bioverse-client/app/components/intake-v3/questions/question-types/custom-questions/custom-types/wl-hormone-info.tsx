import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface WLHormoneInfoProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLHormoneInfo({
    handleContinueButton,
    isButtonLoading,
}: WLHormoneInfoProps) {
    return (
        <div className="flex flex-col gap-6 md:gap-6 items-center mt-[1.25rem] md:mt-[48px] pb-16 max-w-[490px]">
            <WordByWord
                className={`inter-h5-question-header-bold text-[#6DB0CC]`}
            >
                Two hormones, cortisol and insulin, influence how our bodies
                retain weight.
            </WordByWord>

            <WordByWord className={`inter-h5-question-header`}>
                In other words, holding weight around the stomach or waist may
                be indicative of high cortisol levels or insulin resistance.
            </WordByWord>

            <div className="mt-4 flex justify-center">
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
