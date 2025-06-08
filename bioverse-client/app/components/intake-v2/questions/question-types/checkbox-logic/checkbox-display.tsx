import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { SetStateAction } from 'react';

interface Props {
    question: any;
    setAnswered: (value: SetStateAction<boolean>) => void;
}

export default function CheckboxDisplayStep({ question, setAnswered }: Props) {
    setAnswered(true);
    return (
        <>
            <div
                id='checkbox-display'
                className='flex min-w-[30vw] justify-center items-center flex-row gap-[12px]'
            >
                <BioType className='label1'>
                    {question.logicDetails.displayMessage}
                </BioType>
            </div>
        </>
    );
}
