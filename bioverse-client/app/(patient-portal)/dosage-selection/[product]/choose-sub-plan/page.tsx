'use server';
import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getLatestRenewalOrderByCustomerAndProduct } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { isEmpty } from 'lodash';
import { refillPreferenceScreenDoubleDosageDataFetch } from '@/app/components/patient-portal/check-up-requested/refill-preference/utils/refill-preference-screen-data-fetch';
import { DosageSelectionVariantIndexToDosage } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import PickDosageSubPlan from '@/app/components/patient-portal/check-up-requested/refill-preference/pick-dosage-subplan';

interface DosageSubPlanSelectionPageProps {
    params: {
        product: string;
    };
    searchParams: {
        dosage: any
    }
}

export default async function DosageSubPlanSelectionPage({
    params,
    searchParams,
}: DosageSubPlanSelectionPageProps) {

    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e' 
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession?.session?.user.id;
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const latestRenewalOrder = await getLatestRenewalOrderByCustomerAndProduct(
        user_id,
        params.product,
    );

    console.log("LATEST RENEWAL ORDER: " , latestRenewalOrder)
    
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
        
        //get rid of the object that doesn't have the dosage field === searchParams.dosage
        const filteredPriceData = Object.entries(priceData).reduce((acc: { [key: string]: any }, [key, value]) => {
            if (value.dosage.toString() === searchParams.dosage) {
              acc[key] = value;
            }
            return acc;
          }, {});

        const dosage_list = filteredPriceData[Object.keys(filteredPriceData)[0]].dosage_list
        
        return (
            <div className="flex flex-col w-11/12 md:w-[490px] justify-center  mt-[3rem] md:mt-[48px] sm:px-0 mx-auto">
                <PickDosageSubPlan 
                    dosage_list={dosage_list}
                />
            </div>
        )
    } else {
        //redirect to the collection page if they shouldn't be on this screen in the first place
        return redirect('/collections');
    }
}