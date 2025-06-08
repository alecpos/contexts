'use server';

import IndividualEDQuantitySelectionParent from '@/app/components/intake-v2/ed/ed-ind-quantity-selection/IndividualEDQuantitySelecionParent';

interface Props {
    params: {
        product: string;
    };
}

export default async function EDIndProductDisplayPage({ params }: Props) {
    return (
        <>
            <IndividualEDQuantitySelectionParent productHref={params.product} />
        </>
    );
}
