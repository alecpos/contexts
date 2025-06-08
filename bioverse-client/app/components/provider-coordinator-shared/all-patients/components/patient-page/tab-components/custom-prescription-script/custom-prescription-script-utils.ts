'use server';

import { getEligiblePharmacy } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { getOrderByCustomerIdAndProductHref } from '@/app/utils/database/controller/orders/orders-api';
import { generateCustomEmpowerScript } from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';

export async function generateCustomScript(
    profile_data: APProfileData,
    product_href: string,
    variant_index: number,
) {
    const pharmacy = getEligiblePharmacy(product_href, variant_index);

    if (pharmacy === PHARMACY.EMPOWER) {
        return handleGenerateInitialCustomEmpowerScript(
            profile_data,
            product_href,
            variant_index,
        );
    } else if (pharmacy === PHARMACY.HALLANDALE) {
    }
}

// This puts temp values for order_id as we'll reset those right before we fire the script for data consistency
async function handleGenerateInitialCustomEmpowerScript(
    profile_data: APProfileData,
    product_href: string,
    variant_index: number,
) {
    const bmiData = await getQuestionAnswersForBMI(profile_data.id);

    const order = await getOrderByCustomerIdAndProductHref(
        profile_data.id,
        product_href,
    );

    if (!order) {
        throw new Error('Could not find order for user');
    }

    const shipping_information: AddressInterface = {
        address_line1: order.address_line1,
        address_line2: order.address_line2,
        city: order.city,
        state: order.state,
        zip: order.zip,
    };

    const script = generateCustomEmpowerScript(
        profile_data,
        'TEMP_ORDER_ID',
        product_href,
        variant_index,
        shipping_information,
        bmiData,
    );

    return script;
}
