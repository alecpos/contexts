'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import DosageSubPlan from './components/dosage-sub-plan';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { useRouter } from 'next/navigation';

export default function PickDosageSubPlan({
    dosage_list,
}: {
    dosage_list: Partial<ProductVariantRecord>[];
}) {
    const router = useRouter();

    //This looks at the 'variant' field of each item from the product_variants table, filters out non-quarterly options, and sorts them by total mgs
    const quarterlyOptions = dosage_list
        .filter((item: any) => item.cadence === 'quarterly')
        .sort(
            (a: any, b: any) =>
                parseInt(b.variant.split(' ')[0]) -
                parseInt(a.variant.split(' ')[0]),
        );

    //state to hold the variant index of the quarterly product to be shown in dosage selection
    const [selectedSubPlan, setSelectedSubPlan] = useState<number | null>(null);

    //will be fed into the DosageSubPlan components
    const arr = [
        {
            title: 'Option 1',
            description:
                'Higher titration schedule ideal for patients seeking to lose more weight',
            quarterlyOptionVariantIndex:
                quarterlyOptions[0]?.variant_index ?? null,
            //monthlyOptionVariantIndex:
            //BiannualOptionVariantIndex:
            //YearlyOptionVariantIndex:
        },
        {
            title: 'Option 2',
            description:
                'Lower titration schedule ideal for patients seeking to lose more weight',
            quarterlyOptionVariantIndex:
                quarterlyOptions[1]?.variant_index ?? null,
            //monthlyOptionVariantIndex:
            //BiannualOptionVariantIndex:
            //YearlyOptionVariantIndex:
        },
        {
            title: 'Option 3',
            description:
                'Maintenance protocol ideal for who achieved their weight goal and wish to maintain weight',
            quarterlyOptionVariantIndex:
                quarterlyOptions[2]?.variant_index ?? null,
            //monthlyOptionVariantIndex:
            //BiannualOptionVariantIndex:
            //YearlyOptionVariantIndex:
        },
    ];

    const handleContinue = () => {
        if (!selectedSubPlan) {
            return;
        }
        //once they choose an option, stick the variant indices of those options in the URL, right now, just the quarterly option quvi
        router.push(
            `/dosage-selection/semaglutide?plan=1.25&quvi=${selectedSubPlan}`,
        );
    };

    return (
        <>
            <div className="flex flex-col h-full">
                <p className="inter-h5-question-header">
                    Is your goal to lose weight or have you achieved your weight
                    goal?
                </p>
                <p className="intake-subtitle mt-[12px] mb-[1.25rem] md:mb-[48px]">
                    Select your refill preference with your goal in mind
                </p>
                {arr.map((item, index) => {
                    return (
                        <div
                            className="flex flex-col mt-[0.75rem] md:mt-[12px]"
                            key={index}
                        >
                            <DosageSubPlan
                                title={item.title}
                                description={item.description}
                                quarterlyOptionVariantIndex={
                                    item.quarterlyOptionVariantIndex
                                }
                                key={index}
                                selectedSubPlan={selectedSubPlan}
                                setSelectedSubPlan={setSelectedSubPlan}
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
                    className="normal-case intake-v3-form-label-bold mt-[1.25rem] md:mt-[48px]"
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </div>
        </>
    );
}
