'use client';

import { useState } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import IntakeLoadingComponent from '../loading/intake-loading';
import { getIntakeURLParams } from '../intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import DataCollectionInputWLV3 from '../account/data-collection/data-collection-wl';
import {
    checkAndCreateIndividualWLOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { WEIGHT_LOSS_PRODUCT_HREF } from '../constants/constants';
import { continueButtonExitAnimation } from '../intake-animations';

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

export default function DemographicIntakeWL({
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

    const pushToNext = async () => {
        //Check database for existing order
        let order_id = '';

        const order_check_result = await checkAndCreateIndividualWLOrder(
            sessionId,
            product_data,
            priceData ?? undefined
        );

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

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);

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
        <div className=''>
            <div className='flex flex-row gap-10 '>
                <div className='flex'>
                    {userProfileData ? (
                        <DataCollectionInputWLV3
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
