'use server';

import { generateEmpowerScript } from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';
import { generateHallandaleScript } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { OrderType } from '@/app/types/orders/order-types';
import { convertBundleVariantToSingleVariant } from './bundle-variant-index-mapping';
import { getQuestionAnswersForBMI } from '../../database/controller/clinical_notes/clinical_notes_v2';
import { getEligiblePharmacy } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { convertHallandaleOrderToBase64 } from '@/app/components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/hallandale/utils/hallandale-base64-pdf';
import { getPatientInformationById } from '../../actions/provider/patient-overview';
import { getPatientAllergyData } from '../../database/controller/clinical_notes/clinical-notes';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import { updateRenewalOrderFromRenewalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { HALLANDALE_EMPOWER_CONVERSION_MAP } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/pharmacy-variant-index-conversion/empower-hallandale-variant-converter';

//TODO add to this list of empower variant indices
const empower_variant_indices: number[] = [];
const hallanda_variant_indices: number[] = [];

/**
 * Consumes DBOrderData and DBPatientData to create and return a new script json for the right pharmacy.
 */
export async function convertBundleVariantToSingleVialScript(
    order_data: DBOrderData,
    patient_data: DBPatientData,
    order_type: OrderType,
    variant_index: number
) {
    const new_variant_index = convertBundleVariantToSingleVariant(
        order_data.product_href,
        variant_index
    );

    const pharmacy = getEligiblePharmacy(
        order_data.product_href,
        new_variant_index
    );

    if (pharmacy === PHARMACY.EMPOWER) {
        const bmi_answers = await getQuestionAnswersForBMI(patient_data.id);

        const result = generateEmpowerScript(
            patient_data,
            order_data,
            order_type,
            bmi_answers,
            new_variant_index
        );
        if (result) {
            const { script, sigs, displayName } = result;

            return script;
        }
    }

    if (pharmacy === PHARMACY.HALLANDALE) {
        const addressData: AddressInterface = {
            address_line1:
                order_type === OrderType.Order
                    ? order_data.address_line1
                    : order_data.order.address_line1,
            address_line2:
                order_type === OrderType.Order
                    ? order_data.address_line2
                    : order_data.order.address_line2,
            city:
                order_type === OrderType.Order
                    ? order_data.city
                    : order_data.order.city,
            state:
                order_type === OrderType.Order
                    ? order_data.state
                    : order_data.order.state,
            zip:
                order_type === OrderType.Order
                    ? order_data.zip
                    : order_data.order.zip,
        };

        const result = generateHallandaleScript(
            patient_data,
            order_data,
            addressData,
            order_type,
            new_variant_index
        );
        if (result) {
            const { script, sigs, displayName } = result;

            return script;
        }
    }
}

// should technically only be ran for renewal orders, but just in case something happens

export async function getScriptForVariantIndex(
    order_data: DBOrderData,
    patient_data: DBPatientData,
    orderType: OrderType,
    incoming_variant_index: number
) {
    let pharmacy = getEligiblePharmacy(
        order_data.product_href,
        incoming_variant_index
    );
    let variant_index = incoming_variant_index;

    if (order_data.product_href === PRODUCT_HREF.TIRZEPATIDE) {
        const mappedIndex =
            HALLANDALE_EMPOWER_CONVERSION_MAP['tirzepatide'][
                incoming_variant_index as keyof (typeof HALLANDALE_EMPOWER_CONVERSION_MAP)['tirzepatide']
            ];
        if (mappedIndex !== variant_index) {
            variant_index = mappedIndex;
            order_data.assigned_pharmacy = 'empower';
            pharmacy = 'empower';
            order_data.variant_index = mappedIndex;
        }
    }

    if (pharmacy === PHARMACY.EMPOWER) {
        const bmi_answers = await getQuestionAnswersForBMI(patient_data.id);

        const result = generateEmpowerScript(
            patient_data,
            order_data,
            orderType,
            bmi_answers,
            variant_index
        );
        if (result) {
            const { script, sigs, displayName } = result;

            return { script, pharmacy };
        }
    } else if (pharmacy === PHARMACY.HALLANDALE) {
        const result = await generateHallandaleScriptWithPDF(
            patient_data.id,
            orderType === OrderType.Order
                ? order_data.id
                : order_data.renewal_order_id,
            variant_index,
            patient_data
        );
        return { script: result, pharmacy };
    }
    return { script: null, pharmacy: null };
}

export async function generateHallandaleScriptWithPDF(
    user_id: string,
    renewal_order_id: string,
    variant_index: number,
    patientData: DBPatientData
) {
    const { data: allergyData, error: allergyError } =
        await getPatientAllergyData(user_id, 'deprecated');

    const { data: renewalOrder, type: orderType } = await fetchOrderData(
        renewal_order_id
    );

    if (patientData && renewalOrder && allergyData) {
        const addressData: AddressInterface = {
            address_line1: renewalOrder.address_line1,
            address_line2: renewalOrder.address_line2,
            city: renewalOrder.city,
            state: renewalOrder.state,
            zip: renewalOrder.zip,
        };
        const scriptMetadata = generateHallandaleScript(
            patientData,
            renewalOrder,
            addressData,
            OrderType.RenewalOrder,
            variant_index
        );

        if (scriptMetadata) {
            const base64pdf = convertHallandaleOrderToBase64(
                scriptMetadata.script,
                allergyData && allergyData.length > 0
                    ? allergyData[0].allergies
                    : 'nkda'
            );

            const orderWithPdf: HallandaleOrderObject = {
                ...scriptMetadata.script,
                document: { pdfBase64: base64pdf },
            };

            const body_json: HallandaleScriptJSON = {
                message: {
                    id: renewalOrder.id,
                    sentTime: new Date().toISOString(),
                },
                order: orderWithPdf,
            };
            return body_json;
        }
    }
    return null;
}
