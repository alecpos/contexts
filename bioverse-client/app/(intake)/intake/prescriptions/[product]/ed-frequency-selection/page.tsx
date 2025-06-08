'use server';

import EDIndividualFrequencySelectionComponent from '@/app/components/intake-v2/ed/ed-ind-frequency-selection/indvidualEDFrequencySelectionParent';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface Props {
    params: {
        product: string;
    };
}

export default async function EDIndProductDisplayPage({ params }: Props) {
    return (
        <>
            <EDIndividualFrequencySelectionComponent
                product={params.product as PRODUCT_HREF}
            />
        </>
    );
}
