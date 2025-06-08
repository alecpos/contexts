import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HarvardEmblem from '../assets/harvard';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';

interface WLFamilyQuestionProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLFamilyQuestion({
    handleContinueButton,
    isButtonLoading,
}: WLFamilyQuestionProps) {
    return (
        <div className='flex flex-col gap-10 md:gap-12 items-center'>
            <BioType className='h5medium md:h3medium'>
                <span className='text-primary'>40% to 70%</span> of your weight
                may be generically predetermined.
            </BioType>
            <BioType className='h5medium md:h3medium'>
                This is likely because we inherit the genes that influence
                factors like our appetite and how quickly we burn calories.
            </BioType>

            <HarvardEmblem />
            <div className='w-full mt-4 md:flex md:justify-center'>
                <ContinueButton
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
