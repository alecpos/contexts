'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getLatestRenewalOrderByCustomerAndProduct } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { isEmpty } from 'lodash';
import { refillPreferenceScreenDoubleDosageDataFetch } from '@/app/components/patient-portal/check-up-requested/refill-preference/utils/refill-preference-screen-data-fetch';
import PickDosagePlan from '@/app/components/patient-portal/check-up-requested/refill-preference/pick-dosage-plan';
import { DosageSelectionVariantIndexToDosage } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';



interface DosagePlanSelectionPageProps {
    params: {
        product: string;
    };
}

export default async function DosagePlanSelectionPage({
    params,
}: DosagePlanSelectionPageProps) {

    const { data: activeSession } = await readUserSession();
    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e' 
    const user_id = activeSession?.session?.user.id;
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const latestRenewalOrder = await getLatestRenewalOrderByCustomerAndProduct(
        user_id,
        params.product,
    );

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
    const dosages = latestRenewalOrder.dosage_suggestion_variant_indexes.map((index) => {
        return DosageSelectionVariantIndexToDosage[latestRenewalOrder.product_href][index];
    });
    const uniqueDosages = Array.from(new Set(dosages)).sort((a, b) => a - b);

    if (uniqueDosages.length > 1) {
        const priceData = await refillPreferenceScreenDoubleDosageDataFetch(
            latestRenewalOrder,
        );

        return (

            <div className="flex flex-col w-11/12 md:w-[447px] justify-center  mt-[3rem] md:mt-[48px] sm:px-0 mx-auto">
    
                <PickDosagePlan 
                    price_data={priceData} 
                />
    
            </div>
            
        );

    } else {

        return redirect('/collections');

    }

}

