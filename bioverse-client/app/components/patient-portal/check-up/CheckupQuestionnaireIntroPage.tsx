'use client';

import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContinueButton from '../../intake-v2/buttons/ContinueButton';
import ContinueButtonV3 from '../../intake-v3/buttons/ContinueButtonV3';
import CheckupProgressBar from './question/CheckupProgressBar';

interface CheckupQuestionnaireIntroPageProps {
    nextQuestionId: number;
    productHref: string;
    questionnaireSessionId?: number;
}

export default function CheckupQuestionnaireIntroPage({
    nextQuestionId,
    productHref,
}: CheckupQuestionnaireIntroPageProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    // Take them to the first question after this

    const handleClick = () => {
        try {
            setLoading(true);

            router.push(`/check-up/${productHref}/question/${nextQuestionId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full flex flex-col mt-4 flex-grow items-center max-w-[490px]'>
            <CheckupProgressBar
                quesionnaire_junction={[]}
                current_question_id={0}
            />
            <div className='flex flex-col gap-2 my-6'>
                <BioType className='inter_h5_regular !font-interbold'>
                    Monthly Check-in
                </BioType>
                <BioType className='inter_h5_regular'>
                    It&apos;s time to check-in and let your provider know how
                    you&apos;re doing.
                </BioType>
            </div>
            <ContinueButtonV3
                buttonLoading={loading}
                onClick={handleClick}
                isCheckup={true}
            />
        </div>
    );
}
