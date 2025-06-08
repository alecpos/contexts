"use client";

import { Button } from '@mui/material';
import { useState } from 'react';
import DosagePlan from './components/dosage-plan';
import { DoubleDosageSelectionType } from './utils/refill-preference-screen-data-fetch';
import {useRouter} from 'next/navigation';
import { DOSAGE_TO_TRIGGER_CHOOSE_PLAN_FLOW } from '@/app/(patient-portal)/dosage-selection/[product]/constants';


export default function PickDosagePlan({price_data}: {price_data: DoubleDosageSelectionType}) {

    const [selectedPlan, setSelectedPlan ] = useState('')
    const [selectedDosage, setSelectedDosage ] = useState<number | null>(null)

    const router = useRouter();

    //holds the two dosage plans (higher and lower)
    const arr = [
        {
            title: 'Dosage Plan 1',
            plan: 'higher',
            dosage: price_data.higher_dosages.dosage, 
            subtitle: 'Recommended for patients seeking to lose more weight',
            extraText: `Start Injecting ${price_data.higher_dosages.dosage} mg weekly`
        },
        {
            title: 'Dosage Plan 2',
            plan: 'lower',
            dosage: price_data.lower_dosages.dosage,
            subtitle: 'Recommended for patients seeking to lose more weight gradually at lower dosing',
            extraText: `Start Injecting ${price_data.lower_dosages.dosage} mg weekly`
        }
    ];

    const handleContinue = () => {
        if (!selectedDosage) {
            return;
        }

        if (selectedDosage === DOSAGE_TO_TRIGGER_CHOOSE_PLAN_FLOW) {
            // redirect to the sub-plan page to further filter the options
            router.push(`/dosage-selection/semaglutide/choose-sub-plan?dosage=${selectedDosage}`)
        } else {
            // if this starting dosage doesn't have multiple product variant options, we can go straight to the plan selection page
            router.push(`/dosage-selection/semaglutide?plan=${selectedDosage?.toString()}`)
        }
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <p className="inter-h5-question-header">Confirm Your Preferred Dosage</p>
                {arr.map((item, index) => {
                    return (
                        <div className='flex flex-col mt-[1.38rem] md:mt-[22px]' key={index}>
                            <DosagePlan
                                plan={item}
                                selectedPlan={selectedPlan}
                                setSelectedPlan={setSelectedPlan}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                             />
                        </div>
                    );
                })}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        height: '52px',
                        zIndex: 30,
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                        borderRadius: '12px',
                    }}
                    className='normal-case intake-v3-form-label-bold mt-[34px]'
                    onClick={handleContinue}
                >
                        Continue
                </Button>
            </div>
        </>
    )


}



