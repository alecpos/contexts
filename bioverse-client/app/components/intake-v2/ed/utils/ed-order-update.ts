'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function setOrderProductHrefForED(
    selectedProductHref: string,
    frequency: string,
    quantity?: number,
) {
    const currentUserId = (await readUserSession()).data.session?.user.id;

    if (!currentUserId) {
        return Status.Failure;
    }

    const individual_product_array = [
        PRODUCT_HREF.X_CHEWS,
        PRODUCT_HREF.X_MELTS,
        PRODUCT_HREF.PEAK_CHEWS,
        PRODUCT_HREF.RUSH_CHEWS,
        PRODUCT_HREF.RUSH_MELTS,
    ];

    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('orders')
        .update({
            product_href: selectedProductHref,
            metadata: {
                edSelectionData: getMetadataValues(
                    selectedProductHref as PRODUCT_HREF,
                    frequency,
                    quantity,
                ),
            },
        })
        .eq('customer_uid', currentUserId)
        .in('product_href', individual_product_array);

    return Status.Success;
}

function getMetadataValues(
    product_href: PRODUCT_HREF,
    frequency: string,
    quantity?: number,
) {
    let dosage;

    if (product_href === PRODUCT_HREF.PEAK_CHEWS) {
        dosage = '8.5 mg';
    } else if (
        product_href === PRODUCT_HREF.X_CHEWS ||
        product_href === PRODUCT_HREF.X_MELTS
    ) {
        dosage = '100iu/5mg';
    } else {
        console.log(2222);
        dosage = '81mg/12mg';
    }

    console.log({
        frequency: frequency,
        treatmentType: 'fast-acting',
        productHref: product_href,
        dosage,
        quantity: quantity ?? 30,
    });

    return {
        frequency: frequency,
        treatmentType: 'fast-acting',
        productHref: product_href,
        dosage,
        quantity: quantity ?? 30,
    };
}
