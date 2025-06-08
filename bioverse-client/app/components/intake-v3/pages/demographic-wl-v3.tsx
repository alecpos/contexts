'use client';

import { useState } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import {
    checkAndCreateIndividualWLOrder,
    updateOrderDiscount,
    checkAndCreateCombinedWeightLossOrder,
    updateOrder,
    addMetadataToOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { WEIGHT_LOSS_PRODUCT_HREF } from '../../intake-v2/constants/constants';
import { continueButtonExitAnimation } from '../../intake-v2/intake-animations';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import IntakeLoadingComponent from '../../intake-v2/loading/intake-loading';
import DataCollectionInputWLV4 from '../data-collection/data-collection-wl-input-v4';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS } from '../../intake-v2/constants/route-constants';
import { AB_TESTS_IDS } from '../types/intake-enumerators';
import {
    getAllPreQuestions,
    writeMultipleQuestionnaireAnswersWithVersion,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import { updateProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { writeQuestionnaireAnswer } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getQuestionnaireVersion } from '@/app/utils/actions/questionnaires/questionnaire-actions';
import { sendEventDataToBMG } from '@/app/services/bmg/bmg_functions';

interface AccountScreenProps {
    sessionId: string;
    fetchedUserProfileData: ProfileDataIntakeFlow;
    product_data: {
        product_href: string;
        variant: any;
        subscriptionType: any;
    };
    priceData: any[] | null;
    couponParam: string;
}

/**
 *
 * This component asks for the name of who will be receiving the product
 * THIS IS WHERE THE ORDER GETS CREATED
 * This is also where the question set version may be adjusted in local storage for VWO tests
 *
 */
export default function DemographicIntakeWLV3({
    fetchedUserProfileData,
    sessionId,
    product_data,
    priceData,
    couponParam,
}: AccountScreenProps) {
    const router = useRouter();
    const fullPath = usePathname();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [stateSelectionSession, setStateSelectionSession] = useSessionStorage(
        'state-selection',
        ''
    );
    const [dobSession, setDobSession] = useSessionStorage('dob', '');
    const [questionSetVersion, setQuestionSetVersion] = useLocalStorage(
        'question_set_version',
        0
    );
    const [bmi, setBmi] = useSessionStorage('wl-bmi', {
        question: 'What is your current height and weight',
        answer: '',
        formData: ['', '', ''],
    });

    const [userProfileData, setUserProfileData] =
        useState<ProfileDataIntakeFlow>(fetchedUserProfileData);

    const pushToNext = async () => {
        //Check database for existing order
        const vwo_test_ids: string[] = JSON.parse(
            localStorage.getItem('vwo_ids') || '[]'
        );

        /*
         * THE 14-NEW-SCREENS (personlized dosing flow) TEST!!! These tests have a different question set versions for each product than what is set
         * as the current_question_set_version in the products table.
         * We add the question set version override to the local storage so that the useLocalStorage hook can access it...
         * ...particularly in the question-id-v3.tsx file.
         */
        if (vwo_test_ids.includes(AB_TESTS_IDS.WL_NEW_SCREEN_TEST)) {
            switch (product_href) {
                case PRODUCT_HREF.WEIGHT_LOSS:
                    localStorage.setItem('question_set_version', '3');
                    break;
                case PRODUCT_HREF.SEMAGLUTIDE:
                    localStorage.setItem('question_set_version', '6');
                    break;
                case PRODUCT_HREF.TIRZEPATIDE:
                    localStorage.setItem('question_set_version', '5');
                    break;
                default:
                    break;
            }
        }

        /*
         * THE COMP-COMPARE TEST!!!
         */
        if (vwo_test_ids.includes(AB_TESTS_IDS.COMP_COMPARE)) {
            switch (product_href) {
                // case PRODUCT_HREF.WEIGHT_LOSS:
                //     localStorage.setItem('question_set_version', '3');
                //     break;
                case PRODUCT_HREF.SEMAGLUTIDE:
                    localStorage.setItem('question_set_version', '7');
                    break;
                // case PRODUCT_HREF.TIRZEPATIDE:
                //     localStorage.setItem('question_set_version', '5');
                //     break;
                default:
                    break;
            }
        }

        let order_id = '';

        let order_check_result = null;
        if (fullPath.includes('weight-loss')) {
            order_check_result = await checkAndCreateCombinedWeightLossOrder(
                sessionId,
                product_data,
                priceData ?? undefined
            );
        } else {
            order_check_result = await checkAndCreateIndividualWLOrder(
                sessionId,
                product_data,
                priceData ?? undefined
            );
            if (order_check_result) {
                let overwrittenQuestionSetVersion: number = parseInt(
                    localStorage.getItem('question_set_version') ?? '0'
                );
                if (
                    !overwrittenQuestionSetVersion ||
                    overwrittenQuestionSetVersion === 0
                ) {
                    overwrittenQuestionSetVersion =
                        await getQuestionnaireVersion(product_href);
                }
                //the indiviual wl funnels have the bmi question prior to signup, so we need to write the answer to the questionnaire
                //here, since after order creation is when the questionnaire session id is created
                await writeQuestionnaireAnswer(
                    sessionId,
                    166, //bmi question id
                    bmi,
                    overwrittenQuestionSetVersion,
                    order_check_result.order.questionnaire_session_id //this is why we need to write this answer here after order creation
                );

                //update the order with the overwritten question set version
                await updateOrder(parseInt(order_check_result?.order?.orderId || order_check_result?.order?.id), { //the function returns an obj with orderId if it's newly created, and id if it's an existing order
                    question_set_version: overwrittenQuestionSetVersion,
                });
            }
        }

        if (!order_check_result) {
            router.push('/portal/order-history');
            return;
        } else {
            order_id = order_check_result.order.orderId;

            if (
                couponParam === '23c' ||
                WEIGHT_LOSS_PRODUCT_HREF.includes(product_href)
            ) {
                await updateOrderDiscount(parseInt(order_id));
            }
        }

        // Filter test IDs that exist in the mapping for the given product
        const matchedTestIds = vwo_test_ids.filter(
            (test_id) =>
                VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[
                    product_href as PRODUCT_HREF
                ]?.[test_id as AB_TESTS_IDS] !== undefined
        );

        // To attach all the answers previously answered by the patient when they weren't signed in
        if (matchedTestIds.length === 1) {
            const preQuestionIdsList = await getAllPreQuestions(
                product_href as PRODUCT_HREF,
                matchedTestIds[0] as AB_TESTS_IDS
            );

            const answers = await Promise.all(
                preQuestionIdsList.map(async (item: any) => {
                    const storedValue = sessionStorage.getItem(
                        `question-${item.question_id}`
                    );
                    const parsedValue = storedValue
                        ? JSON.parse(storedValue)
                        : null;

                    return parsedValue
                        ? { ...parsedValue, question_id: item.question_id }
                        : { question_id: item.question_id };
                })
            );

            const version =
                VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[
                    product_href as PRODUCT_HREF
                ]?.[matchedTestIds[0] as AB_TESTS_IDS];

            if (version) {
                const mappedAnswers = answers
                    .filter((answer) => answer && answer.answer != null)
                    .map((answer: any) => {
                        return {
                            user_id: sessionId,
                            question_id: answer.question_id,
                            answer: answer.answer,
                            answer_set_version: version,
                        };
                    });

                await writeMultipleQuestionnaireAnswersWithVersion(
                    mappedAnswers
                );

                await updateOrder(Number(order_id), {
                    state: stateSelectionSession,
                    question_set_version: version,
                    metadata: {
                        vwo_test: matchedTestIds[0],
                    },
                });

                await updateProfileData(
                    { state: stateSelectionSession, date_of_birth: dobSession },
                    sessionId
                );

                setQuestionSetVersion(version);
            } else {
                setQuestionSetVersion(0);
            }
        }

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);

        /**
         * If there is a utm_source url parameter for BMG (radio), we want to update the order's metadata with the utm_source...
         * ...we'll use this at checkout to determine whether to send conversion data to BMG after the ORDER_RECEIVED event is triggered.
         * Send a lead event to BMG here also
         */
        if (searchParams.get('utm_source') === 'bmg') {
            await addMetadataToOrder(order_id, {
                metadata: {
                    utm_source: 'bmg',
                    utm_campaign: searchParams.get('utm_campaign') || '',
                    utm_medium: searchParams.get('utm_medium') || '',
                    utm_content: searchParams.get('utm_content') || '',
                    utm_term: searchParams.get('utm_term') || '',
                },
            });
            await sendEventDataToBMG(
                Number(order_id),
                stateSelectionSession,
                'lead',
                '',
                new Date().toISOString(),
                '',
                'bmg',
                product_href,
                product_href,
                searchParams.get('utm_campaign') || '',
                searchParams.get('utm_medium') || '',
                searchParams.get('utm_content') || '',
                searchParams.get('utm_term') || '',
                sessionId
            );
        }

        // Remove the 'nu' parameter
        searchParams.delete('nu');

        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    return (
        /**
         * This below is the default data collection code.
         */
        <div className='mt-[1.25rem] md:mt-[48px] w-full md:w-[490px] pb-16 lg:pb-0'>
            {userProfileData ? (
                <DataCollectionInputWLV4
                    setUserProfileData={setUserProfileData}
                    userProfileData={userProfileData}
                    session_id={sessionId}
                    pushToNext={pushToNext}
                />
            ) : (
                <>
                    <IntakeLoadingComponent />
                </>
            )}
        </div>
    );
}

export function validateProfileData(
    profileData: ProfileDataIntakeFlow
): boolean {
    // Check if every property is not null

    if (!profileData) {
        return false;
    }

    return (
        profileData.first_name !== null &&
        profileData.last_name !== null &&
        profileData.sex_at_birth !== null &&
        profileData.phone_number !== null
    );
}

export function getValidProfileDataFields(
    profileData: ProfileDataIntakeFlow
): string[] | null {
    if (!profileData) {
        return null;
    }

    const nullFields: string[] = [];

    // Check each property and add the field name to nullFields if it's null
    if (profileData.first_name === null) {
        nullFields.push('first_name');
    }

    if (profileData.last_name === null) {
        nullFields.push('last_name');
    }

    if (profileData.phone_number === null) {
        nullFields.push('phone_number');
    }

    // If nullFields is empty, all fields are not null; otherwise, return the array
    return nullFields.length === 0 ? null : nullFields;
}
