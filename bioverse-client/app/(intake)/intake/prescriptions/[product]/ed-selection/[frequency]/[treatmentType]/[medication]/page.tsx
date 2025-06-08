'use server';

import MedicationDetailsComponent from '@/app/components/intake-v2/ed/medication/medication-details-component';

interface PageProps {
    params: {
        frequency: string;
        treatmentType: string;
        medication: string;
    };
}

export default async function EDMedicationInformationPage({
    params,
}: PageProps) {
    return (
        <MedicationDetailsComponent
            product_href={params.medication}
            treatment_type={params.treatmentType}
            frequency={params.frequency}
        />
    );
}
