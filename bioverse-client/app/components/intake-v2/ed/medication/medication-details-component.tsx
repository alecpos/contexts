'use client';

import AdditionalOptions from '../components/additional-options';
import MedicationInfo from '../components/medication-info';
import DetailsAccordion from '../components/treatment-details-accordion';
import TreatmentSpotlight from '../components/treatment-spotlight';
import WhyTable from '../components/why-daily-table';
import useSWR from 'swr';
import { getProductMetadata } from '@/app/utils/database/controller/products/products';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface MedicationDetailsProps {
    product_href: string;
    treatment_type: string;
    frequency: string;
}

export default function MedicationDetailsComponent({
    product_href,
    treatment_type,
    frequency,
}: MedicationDetailsProps) {
    const { data, isLoading } = useSWR(`${product_href}-data`, () =>
        getProductMetadata(product_href)
    );

    const [mediactionDetails, setMedicationDetails] = useState<any>(null);

    useEffect(() => {
        if (data) {
            setMedicationDetails(data.intakeData);
        }
    }, [data]);

    if (!mediactionDetails) {
        return (
            <div>
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div className='flex flex-col max-w-[100vw] justify-center'>
            <TreatmentSpotlight
                treatmentName={mediactionDetails.productName}
                imageSrc={mediactionDetails.imageSrc}
                tags={mediactionDetails.tags}
                frequency={frequency}
            />

            <div className='mt-8' />
            <DetailsAccordion
                treatmentDetails={
                    mediactionDetails.medicationInformation.treatmentDetails
                }
                quickInfo={mediactionDetails.medicationInformation.quickInfo}
                activeIngredients={
                    mediactionDetails.medicationInformation.activeIngredients
                }
                potentialSideEffects={
                    mediactionDetails.medicationInformation.potentialSideEffects
                }
                importantSafetyInformation={
                    mediactionDetails.medicationInformation
                        .importantSafetyInformation
                }
                frequency={frequency}
            />

            <div className='mt-8' />
            <MedicationInfo
                howDoesMedicationWork={mediactionDetails.howDoesMedicationWork}
            />

            <div className='mt-8' />
            <WhyTable frequency={frequency} />

            <div className='mt-8' />
            <AdditionalOptions
                currentProductHref={product_href}
                treatment_type={treatment_type}
                frequency={frequency}
            />

            <div className='mt-20' />
        </div>
    );
}
