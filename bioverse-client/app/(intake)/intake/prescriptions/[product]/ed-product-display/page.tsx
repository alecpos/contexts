'use server';

import MedicationDetailsComponent from '@/app/components/intake-v2/ed/medication/medication-details-component';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface Props {
    params: {
        product: string;
    };
    searchParams: {
        [key: string]: string;
    };
}

export default async function EDProductDisplayPage({
    params,
    searchParams,
}: Props) {
    const buildData = buildTreatmentAndFrequencyForIndependentRoute(
        params.product,
        searchParams.freqSelec,
    );

    return (
        <MedicationDetailsComponent
            product_href={params.product}
            treatment_type={buildData.treatment_type}
            frequency={buildData.frequency}
        />
    );
}

const buildTreatmentAndFrequencyForIndependentRoute = (
    productHref: string,
    manualFrequency?: string,
) => {
    console.log('LOG on pchew: ', productHref, ' freq man: ', manualFrequency);

    switch (productHref as PRODUCT_HREF) {
        case PRODUCT_HREF.PEAK_CHEWS:
            return {
                treatment_type: 'fast-acting',
                frequency: manualFrequency ? manualFrequency : 'daily',
            };
        case PRODUCT_HREF.RUSH_MELTS:
            return {
                treatment_type: 'fast-acting',
                frequency: 'as-needed',
            };
        case PRODUCT_HREF.X_CHEWS:
        case PRODUCT_HREF.X_MELTS:
            return { treatment_type: 'fast-acting', frequency: 'as-needed' };

        default:
            return { treatment_type: '', frequency: '' };
    }
};
