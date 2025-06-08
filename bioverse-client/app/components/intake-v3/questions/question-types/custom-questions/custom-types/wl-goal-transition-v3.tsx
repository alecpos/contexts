'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getWLGoalAnswer } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getProductName } from '@/app/utils/database/controller/products/products';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

const SEMAGLUTIDE_PRODUCTS = [
    'ozempic',
    'ozempic-test',
    'semaglutide',
    'wegovy',
];
const TIRZEPATIDE_PRODUCTS = ['zepbound', 'mounjaro', 'tirzepatide'];

interface Props {
    // continueButton: () => React.ReactElement;
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLGoalTransitionV3({
    // continueButton,
    handleContinueButton,
    isButtonLoading,
}: Props) {
    const [answerType, setAnswerType] = useState<number>();
    const [compoundType, setCompoundType] = useState<number>(); //0 == semaglutide, 1 == tirzepatide
    const [wlAnswer, setWlAnswer] = useState<string>();
    const [productName, setProductName] = useState<string>();

    const params = useParams();
    const searchParams = useSearchParams();
    const { product_href } = getIntakeURLParams(params, searchParams);

    useEffect(() => {
        (async () => {
            const user_id = (await readUserSession()).data.session?.user.id;

            const { name } = await getProductName(product_href as string);
            setProductName(name);

            const { answer, error } = await getWLGoalAnswer(
                user_id!,
                product_href
            );

            if (error || answer.answer === 'no-answer') {
                return (
                    <>
                        <IntakeErrorComponent />
                    </>
                );
            }

            if (SEMAGLUTIDE_PRODUCTS.includes(product_href as string)) {
                setCompoundType(0);
            }
            if (TIRZEPATIDE_PRODUCTS.includes(product_href as string)) {
                setCompoundType(1);
            }

            if (
                answer.answer.answer == 'Not sure, I just need to lose weight'
            ) {
                setAnswerType(1); //1 for second screen ambiguous
            } else {
                setWlAnswer(convertWlAnswer(answer.answer.answer));
                setAnswerType(2); //0 for initial screen with %'s and product name
            }
        })();
    }, []);

    const convertWlAnswer = (answerText: string) => {
        switch (answerText) {
            case 'Losing 1-15 pounds':
                return '1-15 pounds';
            case 'Losing 16-50 pounds':
                return '16-50 pounds';
            case 'Losing 51+ pounds':
                return '51+ pounds';
            default:
                return '';
        }
    };

    return (
        <div
            className={`flex flex-col items-center w-full h-full gap-[2.5vw] p-0 animate-slideRight mt-[1.25rem] md:mt-[48px]`}
        >
            <div className='flex flex-col items-center gap-[24px] rounded-md border h-full'>
                {answerType && (
                    <>
                        {answerType === 2 ? (
                            <WordByWord className='inter-h5-question-header'>
                                Your goal to lose
                                <span className='bg-clip-text inter-h5-question-header-bold '>
                                    {wlAnswer}
                                </span>
                                is within reach and it doesn&apos;t involve
                                restrictive dieting.
                            </WordByWord>
                        ) : (
                            <WordByWord className='inter-h5-question-header  '>
                                Your goal to lose
                                <span className='bg-clip-text inter-h5-question-header  font-bold'>
                                    weight
                                </span>
                                is within reach and it doesn&apos;t involve
                                restrictive dieting.
                            </WordByWord>
                        )}
                    </>
                )}

                {answerType && (
                    <WordByWord className='inter-h5-question-header'>
                        We&apos;ll help you build your personalized plan for
                        lasting weight loss success.
                    </WordByWord>
                )}
                {answerType && (
                    <div className='w-full mt-4 md:flex md:justify-center'>
                        <ContinueButtonV3
                            onClick={handleContinueButton}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
