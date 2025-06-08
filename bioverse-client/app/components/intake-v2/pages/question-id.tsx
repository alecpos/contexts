'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import QuestionRenderComponent from '../questions/question-render/question-rendering';
import { getIntakeURLParams } from '../intake-functions';
import {
    getQuestionInformation_with_version,
    getQuestionsForProduct_with_Version,
    writeQuestionnaireAnswer,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import {
    QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_POST,
    QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_PRE,
} from '../constants/question-constants';
import {
    determineNextQuesitonIDForCustomPost,
    determineSkippingQuestionForCustomPre,
} from '../questions/functions/questions-functions';
import useSWR, { useSWRConfig } from 'swr';
import { useCallback, useEffect, useState } from 'react';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { COMBINED_WEIGHTLOSS_PRODUCT_HREF } from '@/app/services/tracking/constants';
import { continueButtonExitAnimation } from '../intake-animations';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { getCombinedOrderV2 } from '@/app/utils/database/controller/orders/orders-api';

interface QuestionIDProps {
    current_question: number;
    user_id: string;
    userProfileData: any;
}

const useEventTracking = (user_id: string, product_href: string) => {
    return useCallback(
        async (dateNow: number) => {
            try {
                await Promise.all([
                    trackRudderstackEvent(
                        user_id,
                        RudderstackEvent.INTAKE_COMPLETED,
                        {
                            product_name: product_href,
                        }
                    ),
                ]);
            } catch (error) {
                console.error('Error tracking completion events:', error);
            }
        },
        [user_id, product_href]
    );
};

export default function QuestionIDComponent({
    current_question,
    user_id,
    userProfileData,
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
                0
            ),
        swrConfig
    );

    const {
        data: bmi_data,
        error: bmi_error,
        isLoading: bmi_isLoading,
    } = useSWR(
        current_question == 164 ? bmiKey : null,
        () =>
            getQuestionInformation_with_version(
                user_id,
                url.product as string,
                166,
                0
            ),
        swrConfig
    );

    const productKey = url.product ? `${url.product}-question-set` : null;

    const {
        data: swr_question_set,
        error: swr_question_set_error,
        isLoading: swr_question_set_isLoading,
    } = useSWR(
        productKey,
        () => getQuestionsForProduct_with_Version(url.product as string, 0),
        swrConfig
    );

    useEffect(() => {
        console.log('SWR key:', productKey);
    }, [productKey]);

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

    useEffect(() => {
        if (
            current_question == 164 &&
            product_href !== COMBINED_WEIGHTLOSS_PRODUCT_HREF &&
            bmi_data &&
            bmi_data.data[0] &&
            !bmi_data.data[0].answer
        ) {
            router.push(
                `/intake/prescriptions/${
                    url.product
                }/questions/166?${new URLSearchParams(searchParams).toString()}`
            );
        }
    }, [
        current_question,
        bmi_data,
        router,
        searchParams,
        url.product,
        product_href,
    ]);

    const trackCompletionEvents = useEventTracking(user_id, product_href);

    /**
     * question={data[0].question}
            answer={data[0].answer}
     */

    if (swr_isLoading || bmi_isLoading || swr_question_set_isLoading) {
        return <LoadingScreen />;
    }

    if (swr_error || bmi_error || swr_question_set_error) {
        return <>{/* <BioType>Error</BioType> */}</>;
    }

    if (
        current_question == 164 &&
        bmi_data &&
        product_href !== COMBINED_WEIGHTLOSS_PRODUCT_HREF &&
        bmi_data.data[0] &&
        !bmi_data.data[0].answer
    ) {
        return <LoadingScreen />; // Render nothing until the redirection is done
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
                await writeQuestionnaireAnswer(
                    user_id,
                    current_question,
                    answer,
                    swr_data?.version ?? 0
                );
            } catch (error) {
                console.error('Error writing the question', error, user_id);
            }
        }

        if (next_index_question_index == swr_question_set.length) {
            const dateNow = Date.now();
            await trackCompletionEvents(dateNow);

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
            //Checking for whether the current question needs to custom route based on its current answer.
            if (
                QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_POST.includes(
                    String(current_question)
                ) &&
                //This skip was written in order to provide this question [166] to NAD injections.
                //The point of this line below is to prevent custom skip logic from happening for NAD injection regarding weight selection and pass to next question ID.
                product_href !== PRODUCT_HREF.NAD_INJECTION
            ) {
                const { next_question_id, skip_set } =
                    await determineNextQuesitonIDForCustomPost(
                        String(current_question),
                        answer,
                        product_href,
                        user_id,
                        userProfileData,
                        search
                    );
                if (skip_set) {
                    const index_of_what_to_skip_to = swr_question_set.findIndex(
                        (item: { question_id: number }) =>
                            item.question_id === parseInt(next_question_id)
                    );
                    continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/questions/${
                            swr_question_set[index_of_what_to_skip_to + 1]
                                .question_id
                        }?${search}`
                    );
                } else {
                    continueButtonExitAnimation(150);
                    if (next_question_id === 'unavailable_bmi_v2') {
                        router.push(
                            `/intake/prescriptions/${product_href}/unavailable-bmi-v2?${search}`
                        );
                    } else if (next_question_id === 'unavailable-bmi') {
                        router.push(
                            `/intake/prescriptions/${product_href}/unavailable-bmi?${search}`
                        );
                    } else {
                        router.push(
                            `/intake/prescriptions/${product_href}/questions/${next_question_id}?${search}`
                        );
                    }
                }
            } else if (
                QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_PRE.includes(
                    String(
                        swr_question_set[next_index_question_index].question_id
                    )
                )
            ) {
                const { next_question_id, skip_set, end_questions } =
                    await determineSkippingQuestionForCustomPre(
                        String(
                            swr_question_set[next_index_question_index]
                                .question_id
                        ),
                        {
                            sex_at_birth: userProfileData.sex_at_birth,
                            state_of_residence: userProfileData.state,
                            user_id: user_id,
                        },
                        search
                    );
                if (skip_set) {
                    const index_of_what_to_skip_to = swr_question_set.findIndex(
                        (item: { question_id: number }) =>
                            item.question_id === parseInt(next_question_id)
                    );
                    if (end_questions) {
                        const dateNow = Date.now();
                        await trackCompletionEvents(dateNow);

                        //if we're at the end of the questions for weightloss and metformin was chosen, gotta pass selectedProduct into getNextIntakeRoute so it knows to skip the calc and graph screens
                        let selectedProduct = '';
                        if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                            const order_data = await getCombinedOrderV2(
                                user_id
                            );
                            if (
                                order_data?.metadata?.selected_product ===
                                'metformin'
                            ) {
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
                        continueButtonExitAnimation(150);
                        router.push(
                            `/intake/prescriptions/${product_href}/questions/${
                                swr_question_set[index_of_what_to_skip_to + 1]
                                    .question_id
                            }?${search}`
                        );
                    }
                } else {
                    continueButtonExitAnimation(150);
                    router.push(
                        `/intake/prescriptions/${product_href}/questions/${next_question_id}?${search}`
                    );
                }
            } else {
                continueButtonExitAnimation(150);
                router.push(
                    `/intake/prescriptions/${product_href}/questions/${swr_question_set[next_index_question_index].question_id}?${search}`
                );
            }
        }
    };

    return (
        <div className='flex flex-col w-full items-center animate-slideRight'>
            {swr_question_set && (
                <QuestionRenderComponent
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
