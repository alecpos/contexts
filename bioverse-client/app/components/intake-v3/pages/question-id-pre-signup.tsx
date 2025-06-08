'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { trackMixpanelEvent } from '@/app/services/mixpanel/mixpanel-utils';
import { INTAKE_COMPLETED } from '@/app/services/mixpanel/mixpanel-constants';
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
import {
    determineNextQuesitonIDForCustomPost,
    determineSkippingQuestionForCustomPre,
} from '../../intake-v2/questions/functions/questions-functions';
import QuestionRenderComponent from '../../intake-v2/questions/question-render/question-rendering';
import QuestionRenderComponentV3 from '../questions/question-render/question-rendering-v3';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';

interface QuestionIDProps {
    current_question: any;
    session_storage_key: string;
    user_id: string;
}

const useEventTracking = (user_id: string, product_href: string) => {
    return useCallback(
        async (dateNow: number) => {
            const insertId = generateUUIDFromStringAndNumber(
                user_id,
                INTAKE_COMPLETED,
                dateNow
            );

            const mixpanel_payload = {
                event: INTAKE_COMPLETED,
                properties: {
                    distinct_id: user_id,
                    time: dateNow,
                    $insert_id: insertId,
                    product_name: product_href,
                },
            };

            try {
                await Promise.all([
                    trackRudderstackEvent(
                        user_id,
                        RudderstackEvent.INTAKE_COMPLETED
                    ),
                    trackMixpanelEvent(INTAKE_COMPLETED, mixpanel_payload),
                    createMixpanelEventAudit(
                        user_id,
                        INTAKE_COMPLETED,
                        product_href
                    ),
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

export default function QuestionIDComponentPreSignupV3({
    current_question,
    session_storage_key,
    user_id,
}: QuestionIDProps) {
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [cl_answer, setClAnswer] = useState<any>();

    const [answer, setAnswer] = useSessionStorage(session_storage_key, {
        question: current_question.question,
        answer: '',
    });

    const productKey = url.product ? `${url.product}-question-set` : null;

    useEffect(() => {
        console.log('SWR key:', productKey);
    }, [productKey]);

    const trackCompletionEvents = useEventTracking(user_id, product_href);

    /**
     * question={data[0].question}
            answer={data[0].answer}
     */

    const handleContinueToNextQuestion = async (
        answer: Answer,
        isTransitionScreen: boolean
    ) => {
        console.log(answer);
        if (!isTransitionScreen) {
            try {
                setAnswer(() => {
                    return answer;
                });
                const nextRoute = getNextIntakeRoute(
                    fullPath,
                    product_href,
                    search
                );

                const searchParams = new URLSearchParams(search);
                // Remove the 'nu' parameter
                searchParams.delete('nu');
                // Construct the new search string without the 'nu' parameter
                const newSearch = searchParams.toString();
                console.log(newSearch);
                router.push(
                    `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
                );
            } catch (error) {
                console.error('Error writing the question', error, user_id);
            }
        }
    };

    return (
        <div className='flex flex-col w-full items-center animate-slideRight'>
            <QuestionRenderComponentV3
                question={current_question}
                currentQuestionNumber={0}
                answer={cl_answer}
                user_id={user_id}
                handleContinueToNextQuestion={handleContinueToNextQuestion}
                router={router}
                question_array={[]}
                isCheckup={false}
            />
        </div>
    );
}
