'use client';

import { useEffect, useState } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import IntakeLoadingComponent from '../loading/intake-loading';
import { getIntakeURLParams } from '../intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import {
    checkAndCreateCombinedWeightLossOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { WEIGHT_LOSS_PRODUCT_HREF } from '../constants/constants';
import WLDataCollectionV4 from '../account/data-collection/wl-data-collection';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import { insertNewWlAnswer } from '@/app/utils/database/controller/patient_combined_wl_answers_temp/patient_combined_wl_answers_temp_api';
import { continueButtonExitAnimation } from '../intake-animations';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface AccountScreenProps {
    sessionId: string;
    fetchedUserProfileData: ProfileDataIntakeFlow;
    product_data: {
        product_href: string;
        variant: any;
        subscriptionType: any;
    };
    priceData: ProductVariantRecord[] | null;
    couponParam: string;
}

export default function CombinedWLDemographicComponent({
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

    const [userProfileData, setUserProfileData] =
        useState<ProfileDataIntakeFlow>(fetchedUserProfileData);

    const [wlAnswer1, setWlAnswer1] = useSessionStorage('wl-intro-q1', {
        question:
            'How would you describe the level of stress you experience in your daily life?',
        answer: '',
    });
    const [wlAnswer2, setWlAnswer2] = useSessionStorage('wl-intro-q2', {
        question: 'On average, how much sleep do you get a night?',
        answer: '',
    });
    const [wlAnswer3, setWlAnswer3] = useSessionStorage('wl-intro-q3', {
        question: 'Where do you hold most of your weight?',
        answer: '',
    });
    const [wlAnswer4, setWlAnswer4] = useSessionStorage('wl-intro-q4', {
        question:
            'When it comes to cravings, what type of food do you usually go for?',
        answer: '',
    });

    const pushToNext = async () => {
        //Check database for existing order
        let order_id = '';

        const wl_intro_answers = {
            question_1: wlAnswer1,
            quesiton_2: wlAnswer2,
            question_3: wlAnswer3,
            question_4: wlAnswer4,
        };

        await insertNewWlAnswer(sessionId, wl_intro_answers);

        const order_check_result = await checkAndCreateCombinedWeightLossOrder(
            sessionId,
            product_data,
            priceData!,
        );

        console.log('OCR~', order_check_result);

        if (!order_check_result || !order_check_result.order) {
            router.push('/portal/order-history');
            return;
        } else {
            order_id = order_check_result.order!.orderId;

            if (
                couponParam === '23c' ||
                WEIGHT_LOSS_PRODUCT_HREF.includes(product_href)
            ) {
                await updateOrderDiscount(parseInt(order_id));
            }
        }

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);

        // Remove the 'nu' parameter
        searchParams.delete('nu');

        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    const pushToQuestions = () => {
        // router.push(
        //     `/intake/prescriptions/${product_href}/questions?${search}`
        // );

        router.push(
            `/intake/prescriptions/${product_href}/questions?${search}`,
        );
    };

    return (
        /**
         * This below is the default data collection code.
         */
        <div className="">
            <div className="flex flex-row gap-10 ">
                <div className="flex">
                    {userProfileData ? (
                        <WLDataCollectionV4
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
            </div>
        </div>
    );
}

export function validateProfileData(
    profileData: ProfileDataIntakeFlow,
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
    profileData: ProfileDataIntakeFlow,
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
