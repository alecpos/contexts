'use client';
import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import {
    useParams,
    useSearchParams,
    usePathname,
    useRouter,
} from 'next/navigation';
import { useState } from 'react';
import { getIntakeURLParams } from '../intake-functions';

interface Props {}

export default function WLGoalTransitionHersV3({}: Props) {
    const [answerType, setAnswerType] = useState<number>();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const [answer, setAnswer] = useSessionStorage('wl-goal-hers', {
        question: "What's your weight loss goal?",
        answer: '',
    });

    const convertWlAnswer = (answerText: string) => {
        switch (answerText) {
            case 'Losing 1-15 pounds':
                return '1-15 lbs';
            case 'Losing 16-50 pounds':
                return '16-50 lbs';
            case 'Losing 51+ pounds':
                return '51+ lbs';
            default:
                return 'weight';
        }
    };

    const handleContinue = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <div
            className={`flex flex-col items-center w-full h-full gap-[2.5vw] p-0 animate-slideRight mt-[1.25rem] md:mt-[48px]`}
        >
            <div className="flex flex-col items-center gap-[24px] rounded-md border h-full">
                <WordByWord className="inter-h5-question-header-bold  ">
                    Your goal to lose
                    <span className="text-[#6DB0CC] ">
                        {convertWlAnswer(answer.answer)}
                    </span>
                    is within reach - and it doesn&apos;t involve restrictive
                    diets. Start your weight loss journey.
                </WordByWord>

                <WordByWord className="inter-h5-question-header">
                    To build a custom plan for you, we need to build your Weight
                    Loss Profile first.
                </WordByWord>
                <div className="flex w-full">
                    <WordByWord className="inter-h5-question-header justify-start items-start">
                        Ready?
                    </WordByWord>
                </div>
                <div className="w-full mt-4 md:flex md:justify-center">
                    <ContinueButtonV3
                        onClick={handleContinue}
                        buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
