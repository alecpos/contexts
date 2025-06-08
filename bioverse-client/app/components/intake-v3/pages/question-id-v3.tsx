'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import {
    getQuestionInformation_with_version,
    getQuestionsForProduct_with_Version,
    writeQuestionnaireAnswer,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

import useSWR, { useSWRConfig } from 'swr';
import { useCallback, useEffect, useState } from 'react';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { COMBINED_WEIGHTLOSS_PRODUCT_HREF } from '@/app/services/tracking/constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import {
    QUESTION_ID_WITH_JUMP,
    QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_POST,
    QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_PRE,
} from '../../intake-v2/constants/question-constants';
import { continueButtonExitAnimation } from '../../intake-v2/intake-animations';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import {
    determineNextQuesitonIDForCustomPost,
    determineSkippingQuestionForCustomPre,
} from '../../intake-v2/questions/functions/questions-functions';
import QuestionRenderComponentV3 from '../questions/question-render/question-rendering-v3';

import { getCombinedOrderV2 } from '@/app/utils/database/controller/orders/orders-api';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import { updateSessionCompletion } from '@/app/utils/database/controller/questionnaires/questionnaire_sessions';

interface QuestionIDProps {
    current_question: number;
    user_id: string;
    userProfileData: any;
    session_id?: number;
}

const useEventTracking = (user_id: string, product_href: string) => {
    return useCallback(
        async (dateNow: number) => {
            try {
                await Promise.all([
                    trackRudderstackEvent(
                        user_id,
                        RudderstackEvent.INTAKE_COMPLETED,
                        { product_name: product_href }
                    ),
                ]);
            } catch (error) {
                console.error('Error tracking completion events:', error);
            }
        },
        [user_id, product_href]
    );
};

const handlePreRoutingCheck = async (
    nextQuestionId: string,
    swr_question_set: any[],
    next_index_question_index: number,
    bmi: any,
    userProfileData: any,
    user_id: string,
    search: string,
    vwo_test_ids: string[],
    product_href: string
) => {
    // Special case for BMI check
    if (bmi.answer && nextQuestionId === '166') {
        return {
            next_question_id:
                swr_question_set[next_index_question_index + 1].question_id,
            skip_set: false,
            end_questions: false,
        };
    }

    // Check if the next question needs PRE routing check
    if (
        QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_PRE.includes(String(nextQuestionId))
    ) {
        console.log('question routing check hit ', nextQuestionId, bmi.answer);

        const result = await determineSkippingQuestionForCustomPre(
            String(nextQuestionId),
            {
                sex_at_birth: userProfileData.sex_at_birth,
                state_of_residence: userProfileData.state,
                user_id: user_id,
            },
            search,
            vwo_test_ids,
            product_href
        );

        return {
            next_question_id: result.next_question_id,
            skip_set: result.skip_set || false,
            end_questions: result.end_questions || false,
        };
    }

    return {
        next_question_id: nextQuestionId,
        skip_set: false,
        end_questions: false,
    };
};

export default function QuestionIDComponentV3({
    current_question,
    user_id,
    userProfileData,
    session_id,
}: QuestionIDProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [cl_question, setQuestion] = useState<any>();
    const [cl_answer, setAnswer] = useState<any>();
    const [questionSetVersion, setQuestionSetVersion] = useLocalStorage(
        'question_set_version',
        0
    );
    const [bmi, setBmi] = useSessionStorage('wl-bmi', {
        question: 'What is your current height and weight',
        answer: '',
        formData: ['', '', ''],
    });

    // console.log('bmi: ', bmi.answer);
    // console.log("inside QuestionIDComponentV3");
    // console.log("current_question: ", current_question);
    // console.log("user_id: ", user_id);
    // console.log("userProfileData: ", userProfileData);

    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    const bmiKey = `${user_id}-bmi`;
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
            getQuestionInformation_with_version(
                user_id,
                url.product as string,
                parseInt(url.question_id as string),
                questionSetVersion
            ),
        swrConfig
    );

    // const {
    //     data: bmi_data,
    //     error: bmi_error,
    //     isLoading: bmi_isLoading,
    // } = useSWR(
    //     current_question == 164 ? bmiKey : null,
    //     () =>
    //         getQuestionInformation_with_version(
    //             user_id,
    //             url.product as string,
    //             166,
    //             questionSetVersion
    //         ),
    //     swrConfig
    // );

    const productKey = url.product ? `${url.product}-question-set-x` : null;

    const {
        data: swr_question_set,
        error: swr_question_set_error,
        isLoading: swr_question_set_isLoading,
    } = useSWR(
        productKey,
        () =>
            getQuestionsForProduct_with_Version(
                url.product as string,
                questionSetVersion
            ),
        swrConfig
    );

    useEffect(() => {
        console.log('bugfix console log: ', swr_data);

        if (swr_data) {
            if (swr_data?.data[0].question) {
                setQuestion(swr_data.data[0].question);
            }
            if (swr_data?.data[0].answer) {
                setAnswer(swr_data.data[0].answer);
            }
        }
    }, [swr_data]);

    const trackCompletionEvents = useEventTracking(user_id, product_href);

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

    // if (
    //     current_question == 164 &&
    //     bmi_data &&
    //     product_href !== COMBINED_WEIGHTLOSS_PRODUCT_HREF &&
    //     bmi_data.data[0] &&
    //     !bmi_data.data[0].answer
    // ) {
    //     return <LoadingScreen />; // Render nothing until the redirection is done
    // }

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
                await writeQuestionnaireAnswer(
                    user_id,
                    current_question,
                    answer,
                    swr_data?.version ?? 0,
                    session_id
                );
            } catch (error) {
                console.error('Error writing the question', error, user_id);
            }
        }

        //check if the next question is the length of the set which means that this question is the last one.
        if (next_index_question_index == swr_question_set.length) {
            const dateNow = Date.now();
            await trackCompletionEvents(dateNow);
            if (session_id) {
                await updateSessionCompletion(session_id);
            }

            if (
                product_href === PRODUCT_HREF.WEIGHT_LOSS &&
                vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES)
            ) {
                //go to the select-wl-treatment question instead of finishing up the question set
                router.push(
                    `/intake/prescriptions/${product_href}/questions-v3/800?${search}`
                );
                return;
            }

            //if we're at the end of the questions for weightloss and metformin was chosen, gotta pass selectedProduct into getNextIntakeRoute so it knows to skip the calc and graph screens
            let selectedProduct = '';
            if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                const order_data = await getCombinedOrderV2(user_id);
                if (order_data?.metadata?.selected_product === 'metformin') {
                    selectedProduct = 'metformin';
                }
            }
            const nextRoute = getNextIntakeRoute(
                fullPath,
                product_href,
                search,
                false,
                'none',
                selectedProduct
            );

            continueButtonExitAnimation(150);
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
            );
        } else {
            let nextQuestionId: number =
                swr_question_set[next_index_question_index].question_id;
            let skipSet = false;
            let endQuestions = false;

            console.log(
                'Before POST routing - current_question:',
                current_question,
                'nextQuestionId:',
                nextQuestionId
            );

            // First check POST routing
            if (
                QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_POST.includes(
                    String(current_question)
                ) &&
                product_href !== PRODUCT_HREF.NAD_INJECTION
            ) {
                const postResult = await determineNextQuesitonIDForCustomPost(
                    String(current_question),
                    answer,
                    product_href,
                    user_id,
                    userProfileData,
                    search,
                    vwo_test_ids
                );

                if (
                    postResult.next_question_id === 'unavailable_bmi_v2' ||
                    postResult.next_question_id === 'unavailable-bmi'
                ) {
                    router.push(
                        `/intake/prescriptions/${product_href}/unavailable-bmi-v3?${search}`
                    );
                    return;
                }

                nextQuestionId = parseInt(postResult.next_question_id);
                skipSet = postResult.skip_set;
                console.log('POST routing skipSet:', postResult.skip_set);
            } else {
                nextQuestionId =
                    swr_question_set[next_index_question_index].question_id;
            }

            // Then check PRE routing on the resulting next question
            const preResult = await handlePreRoutingCheck(
                String(nextQuestionId),
                swr_question_set,
                next_index_question_index,
                bmi,
                userProfileData,
                user_id,
                search,
                vwo_test_ids,
                product_href
            );

            if (
                preResult.next_question_id === 'unavailable_bmi_v2' ||
                preResult.next_question_id === 'unavailable-bmi'
            ) {
                router.push(
                    `/intake/prescriptions/${product_href}/unavailable-bmi-v3?${search}`
                );
                return;
            }

            nextQuestionId = parseInt(preResult.next_question_id);
            console.log('PRE routing skipSet:', preResult.skip_set);
            // Preserve skip_set if either function returned true
            skipSet = preResult.skip_set;
            endQuestions = preResult.end_questions;

            console.log(
                'After PRE routing - nextQuestionId:',
                nextQuestionId,
                'skipSet:',
                skipSet,
                'endQuestions:',
                endQuestions
            );

            // Handle skipping questions when skipSet is true and question is in QUESTION_ID_WITH_JUMP
            if (
                skipSet &&
                QUESTION_ID_WITH_JUMP.includes(String(nextQuestionId))
            ) {
                const currentIndex = swr_question_set.findIndex(
                    (q: { question_id: number }) =>
                        q.question_id === nextQuestionId
                );
                nextQuestionId = swr_question_set[currentIndex + 1].question_id;
                console.log('nextQuestionId after skippp', nextQuestionId);
            }

            if (endQuestions) {
                const dateNow = Date.now();
                await trackCompletionEvents(dateNow);

                let selectedProduct = '';
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                    const order_data = await getCombinedOrderV2(user_id);
                    if (order_data?.metadata?.selected_product) {
                        selectedProduct =
                            order_data?.metadata?.selected_product;
                    }
                }
                const nextRoute = getNextIntakeRoute(
                    fullPath,
                    product_href,
                    search,
                    false,
                    'none',
                    selectedProduct
                );

                continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
                );
            } else {
                continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/questions-v3/${nextQuestionId}?${search}`
                );
            }
        }
    };

    return (
        <div className='flex flex-col w-full items-center animate-slideRight'>
            {swr_question_set && (
                <QuestionRenderComponentV3
                    question={cl_question}
                    currentQuestionNumber={current_question}
                    answer={cl_answer}
                    user_id={user_id}
                    handleContinueToNextQuestion={handleContinueToNextQuestion}
                    router={router}
                    question_array={swr_question_set}
                    isCheckup={false}
                />
            )}
        </div>
    );
}
