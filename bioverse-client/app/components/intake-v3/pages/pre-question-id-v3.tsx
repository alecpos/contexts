'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import {
    getPreQuestionInformationWithVersion,
    getPreQuestionsForProduct_with_Version,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

import useSWR, { useSWRConfig } from 'swr';
import { useCallback, useEffect, useState } from 'react';
import { generateUUIDFromStringAndNumber } from '@/app/utils/functions/generateUUIDFromStringAndNumber';
import {
    checkMixpanelEventFired,
    createMixpanelEventAudit,
} from '@/app/utils/database/controller/mixpanel/mixpanel';
import { isAdvertisedProduct } from '@/app/utils/functions/pricing';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { COMBINED_WEIGHTLOSS_PRODUCT_HREF } from '@/app/services/tracking/constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import {
    QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_POST,
    QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_PRE,
} from '../../intake-v2/constants/question-constants';
import { continueButtonExitAnimation } from '../../intake-v2/intake-animations';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import QuestionRenderComponent from '../../intake-v2/questions/question-render/question-rendering';
import QuestionRenderComponentV3 from '../questions/question-render/question-rendering-v3';
import {
    getCombinedOrder,
    getCombinedOrderV2,
} from '@/app/utils/database/controller/orders/orders-api';
import { AB_TESTS_IDS } from '../../intake-v2/types/intake-enumerators';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';

interface QuestionIDProps {
    current_question: number;
}

export default function PreQuestionIDComponentV3({
    current_question,
}: QuestionIDProps) {
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [cl_question, setQuestion] = useState<any>();
    const [cl_answer, setAnswer] = useState<any>();
    const [sessionStorageAnswer, setSessionStorageAnswer] = useSessionStorage(
        `question-${current_question}`,
        {
            question: '',
            answer: '',
        }
    );

    const vwoTestParam = searchParams.get('vwo_test_param') ?? '';

    const questionKey = `${url.question_id}-question-data`;

    const swrConfig = {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 5000,
    };

    const {
        data: swr_data,
        error: swr_error,
        isLoading: swr_isLoading,
    } = useSWR(
        questionKey,
        () =>
            getPreQuestionInformationWithVersion(
                url.product as PRODUCT_HREF,
                parseInt(url.question_id as string),
                vwoTestParam as AB_TESTS_IDS
            ),
        swrConfig
    );

    const productKey = url.product ? `${url.product}-pre-question-set` : null;

    const {
        data: swr_question_set,
        error: swr_question_set_error,
        isLoading: swr_question_set_isLoading,
    } = useSWR(
        productKey,
        () =>
            getPreQuestionsForProduct_with_Version(
                url.product as PRODUCT_HREF,
                vwoTestParam as AB_TESTS_IDS
            ),
        swrConfig
    );

    console.log('SWR QUESITONS ET', swr_question_set);

    useEffect(() => {
        console.log('bugfix console log: ', swr_data);

        if (swr_data) {
            if (swr_data.data[0].question) {
                setQuestion(swr_data.data[0].question);
            }
            if (swr_data.data[0].answer) {
                setAnswer(swr_data.data[0].answer);
            }
        }
    }, [swr_data]);

    /**
     * question={data[0].question}
            answer={data[0].answer}
     */

    if (swr_isLoading || swr_question_set_isLoading) {
        return <LoadingScreen />;
    }

    if (swr_error || swr_question_set_error) {
        return <>{/* <BioType>Error</BioType> */}</>;
    }

    const next_index_question_index =
        swr_question_set.findIndex(
            (q: { question_id: number }) => q.question_id == current_question
        ) + 1;

    const handleContinueToNextQuestion = async (
        answer: Answer,
        isTransitionScreen: boolean
    ) => {
        if (!isTransitionScreen) {
            try {
                if (swr_data && swr_data.data && swr_data.data[0]) {
                    setSessionStorageAnswer({
                        question: swr_data.data[0].question,
                        answer: answer,
                    });
                }
            } catch (error) {
                console.error('Error writing the question', error);
            }
        }
        //check if the next question is the last question in the set
        if (
            swr_data &&
            swr_data.data &&
            swr_data.data[0] &&
            swr_data.data[0].question.finalPreQuestion
        ) {
            const nextRoute = getNextIntakeRoute(
                fullPath,
                product_href,
                search,
                false,
                'none',
                ''
            );

            continueButtonExitAnimation(150);
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
            );
        } else {
            continueButtonExitAnimation(150);
            router.push(
                `/intake/prescriptions/${product_href}/pre-questions/${swr_question_set[next_index_question_index].question_id}?${search}`
            );
        }
    };

    return (
        <div className='flex flex-col w-full items-center animate-slideRight'>
            {swr_question_set && (
                <QuestionRenderComponentV3
                    question={cl_question}
                    currentQuestionNumber={current_question}
                    answer={cl_answer}
                    user_id={''}
                    handleContinueToNextQuestion={handleContinueToNextQuestion}
                    router={router}
                    question_array={swr_question_set}
                    isCheckup={false}
                />
            )}
        </div>
    );
}
