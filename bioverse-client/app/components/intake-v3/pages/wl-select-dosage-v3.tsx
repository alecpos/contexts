'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import MultiSelectItemV3 from '../questions/question-types/multi-select/multi-select-item-v3';
import { MedicationDictionary } from '@/app/types/questionnaires/questionnaire-types';
import { MEDICATION_DICTIONARY } from '@/app/utils/constants/intake';
import { BaseOrder } from '@/app/types/orders/order-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface WeightlossDosageProps {
    orderData: BaseOrder;
}

export default function WeightlossSelectDosageComponent({
    orderData,
}: WeightlossDosageProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = orderData;
    const lookupProductHref = orderData.metadata.selected_product
        ? PRODUCT_HREF.WEIGHT_LOSS
        : orderData.product_href;
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const [selectedDosage, setSelectedDosage] = useState<number>(0.25);


    /**
     * Updates the pvn search parameter to the selected dosage 
     * (e.g., 0.25 - a key of MEDICATION_DICTIONARY_V3), 
     * then redirects back to wl-supply-v3.
     */
    const handleClick = async (answer: string) => {

        //get rid of the 'mg' at the end of the string
        const dosage = answer.split(' ')[0];

        const params = new URLSearchParams(searchParams.toString());

        params.set('pvn', String(dosage));

        router.push(
            `/intake/prescriptions/${lookupProductHref}/wl-supply-v3?${params.toString()}`,
        );
    };

    // Dosages sorted and filtered out for lowest_dosage
    const sortedKeys = Object.keys(
        MEDICATION_DICTIONARY[product_href as keyof MedicationDictionary],
    )
        .filter((key) => key !== 'lowest_dosage')
        .map((key) => parseFloat(key))
        .sort((a, b) => a - b)
        .map((key) => key.toString());

    return (
        <>
            <div className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}>
                <div className="flex flex-col ">
                    <div className="flex flex-col ">
                        <p
                            className={`inter-h5-question-header mb-[20px] sm:mb-[40px]`}
                        >
                            Please confirm the weekly dosing protocol you&apos;d
                            like to request.
                        </p>

                        <div className="flex flex-col  mb-[100px] md:mb-0">
                            {sortedKeys.map((key: string, index: number) => {
                                return (
                                    <MultiSelectItemV3
                                        option={`${key} mg`}
                                        key={index}
                                        selected={false}
                                        handleCheckboxChange={handleClick}
                                        intake
                                        showCheck
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
