'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getLatestRenewalOrderByCustomerAndProduct } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { isEmpty } from 'lodash';
import RefillPreferenceScreen from '@/app/components/patient-portal/check-up-requested/refill-preference/refill-preference-screen';
import { DosageSelectionVariantIndexToDosage } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import RefillPreferenceScreenV2 from '@/app/components/patient-portal/check-up-requested/refill-preference/refill-preference-screen-v2';
import {
    refillPreferenceScreenDoubleDosageDataFetch,
    refillPreferenceScreenSingleDosageDataFetch,
} from '@/app/components/patient-portal/check-up-requested/refill-preference/utils/refill-preference-screen-data-fetch';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

import RefillPreferenceScreenSingleDosage from '@/app/components/patient-portal/check-up-requested/refill-preference/refill-preference-screen-single-dosage';
import {
    DOSAGE_TO_TRIGGER_CHOOSE_PLAN_FLOW,
    PRODUCT_TO_TRIGGER_CHOOSE_PLAN_FLOW,
} from './constants';

interface DosageSelectionPageProps {
    params: {
        product: string;
    };
    searchParams: {
        plan: any;
        quvi: any; //this is the 'Quarterly Variant index'. If supplied, only that quarterly option will be diplayed as an option
        // bivi: any
        // yrvi: any
    };
}

export default async function DosageSelectionPage({
    params,
    searchParams,
}: DosageSelectionPageProps) {
    const { data: activeSession } = await readUserSession();
    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e'
    const user_id = activeSession?.session?.user.id;
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const latestRenewalOrder = await getLatestRenewalOrderByCustomerAndProduct(
        user_id,
        params.product
    );

    // console.log("LATEST RENEWAL ORDER: " , latestRenewalOrder)

    if (!latestRenewalOrder) {
        console.error('Could not get latest renewal order');
        return redirect('/collections');
    }

    if (
        isEmpty(latestRenewalOrder?.dosage_suggestion_variant_indexes) ||
        latestRenewalOrder.dosage_suggestion_variant_indexes.length === 0
    ) {
        console.error('Empty variant indexes');
        return redirect('/collections');
    }

    //find out how many unique dosages are included in all the offers suggested
    const dosages = latestRenewalOrder.dosage_suggestion_variant_indexes.map(
        (index) => {
            return DosageSelectionVariantIndexToDosage[
                latestRenewalOrder.product_href
            ][index];
        }
    );
    const uniqueDosages = Array.from(new Set(dosages)).sort((a, b) => a - b);

    if (uniqueDosages.length === 2) {
        const priceData = await refillPreferenceScreenDoubleDosageDataFetch(
            latestRenewalOrder
        );

        //check 1. if the user has been suggested multiple offers that have the same starting dosage and 2. if the product/dosage is activated for the choose-plan flow
        if (
            (priceData.higher_dosages.dosage ===
                DOSAGE_TO_TRIGGER_CHOOSE_PLAN_FLOW ||
                priceData.lower_dosages.dosage ===
                    DOSAGE_TO_TRIGGER_CHOOSE_PLAN_FLOW) &&
            params.product === PRODUCT_TO_TRIGGER_CHOOSE_PLAN_FLOW
        ) {
            if (searchParams.plan !== undefined) {
                //if there are search params, that means they are returning from the choose-plan flow, so pass those params to RefillPreferenceScreen
                return (
                    <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                        <RefillPreferenceScreen
                            patient_id={user_id}
                            renewalOrder={latestRenewalOrder}
                            price_data={priceData}
                            plan={searchParams.plan}
                            quvi={searchParams.quvi}
                        />
                    </div>
                );
            }

            //if there are no query params, just redirect to the choose-plan flow
            redirect(`/dosage-selection/${params.product}/choose-plan`);
        }

        //if the dosage/product is not activated for the choose-plan flow, render the RefillPreferenceScreen without query param props
        return (
            <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                <RefillPreferenceScreen
                    patient_id={user_id}
                    renewalOrder={latestRenewalOrder}
                    price_data={priceData}
                />
            </div>
        );
    }

    if (uniqueDosages.length === 1) {
        const priceData = await refillPreferenceScreenSingleDosageDataFetch(
            latestRenewalOrder
        );

        return (
            <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                <RefillPreferenceScreenSingleDosage
                    patient_id={user_id}
                    renewalOrder={latestRenewalOrder}
                    price_data={priceData}
                />
            </div>
        );
    } else {
        console.error('Incorrect number of unique dosages');

        await forwardOrderToEngineering(
            latestRenewalOrder.renewal_order_id,
            user_id,
            'Incorrect number of dosages in dosage_suggestion_variant_indexes'
        );

        return (
            <div className='text-center mt-36 flex flex-col gap-4 px-8'>
                <p className='inter-h5-question-header'>
                    Whoops! We&apos;ve encountered an issue with your dosage
                    selection form.
                </p>
                <p className='intake-subtitle'>
                    Our team has been alerted and we are working to fix the
                    issue.
                </p>
                <p className='inter-h5-question-header'>
                    Please check back later.
                </p>
            </div>
        );
    }
}
