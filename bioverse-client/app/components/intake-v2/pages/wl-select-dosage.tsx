'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import DosageCard from '../semaglutide/dosage-card';
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item';
import {
    DosageInfo,
    MedicationDictionary,
} from '@/app/types/questionnaires/questionnaire-types';
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

    const handleClick = async (answer: string) => {
        // Update ORDER: variant, price_id, and discount_id & variant in URL

        const dosage = answer.split(' ')[0];

        const info =
            MEDICATION_DICTIONARY[product_href as keyof MedicationDictionary][
                dosage
            ];

        // Update variant in URL only
        const params = new URLSearchParams(searchParams.toString());
        params.set('pvn', String(dosage));

        const WL_SUPPLY_ROUTE =
            lookupProductHref === PRODUCT_HREF.WEIGHT_LOSS
                ? 'wl-supply-v2'
                : 'wl-supply';

        router.push(
            `/intake/prescriptions/${lookupProductHref}/${WL_SUPPLY_ROUTE}?${params.toString()}`,
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
            <div className={`justify-center flex animate-slideRight`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <BioType
                            className={`${TRANSITION_HEADER_TAILWIND} !text-primary`}
                        >
                            Please confirm the weekly dosing protocol you&apos;d
                            like to request.
                        </BioType>

                        <div className="flex flex-col gap-[22px] mb-[100px] md:mb-0">
                            {sortedKeys.map((key: string, index: number) => {
                                return (
                                    <MultiSelectItem
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
