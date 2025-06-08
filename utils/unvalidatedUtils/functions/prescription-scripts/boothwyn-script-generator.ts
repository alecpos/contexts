import { OrderType } from '@/app/types/orders/order-types';
import { getPatientInformationById } from '../../actions/provider/patient-overview';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import {
    BOOTHWYN_ALLOWED_PRODUCT_MAP,
    BOOTHWYN_QUARTERLY_PROGRAM_VARIANTS,
    BOOTHWYN_VARIANT_MAP,
    boothwynProviderObject,
} from '@/app/services/pharmacy-integration/boothwyn/boothwyn-variant-mapping';
import { isRenewalOrder } from '../../database/controller/renewal_orders/renewal_orders';
import { getResendCount } from '../../database/controller/order_data_audit/order_data_audit_api';

/**
 *
 * Generates Boothwyn Pharmacy script given patient ID, order ID (renewal or first time).
 * Accepts potential Override values that generates a script that is for the variant index mapped.
 *
 * @param patient_id
 * @param order_id
 * @param override
 * @param resend
 */
export async function generateBoothwynScriptAsync(
    patient_id: string,
    order_id: string,
    override?: ScriptOverrideObject,
    resend?: boolean
): Promise<BoothwynScriptPayload> {
    const { data: patient_data_any, error } = await getPatientInformationById(
        patient_id
    );

    const { type: order_type, data: order_data_any } = await fetchOrderData(
        order_id
    );

    if (!patient_data_any) {
        return {
            script_json: null,
            error: 'No patient was found with provided Patient ID',
        };
    }

    const resendCount = await getResendCount(
        parseInt(order_id),
        order_type === OrderType.Order
            ? undefined
            : order_data_any.renewal_order_id
    );

    const patient_data: DBPatientData = patient_data_any;
    const order_data: DBOrderData = order_data_any;
    const product_href: string = override
        ? override.product_href
        : order_data.product_href;
    const variant_index = override
        ? override.variant_index
        : order_data.variant_index;

    if (!BOOTHWYN_ALLOWED_PRODUCT_MAP[product_href].includes(variant_index)) {
        return {
            script_json: null,
            error: `Product - Variant Mapping is not for Boothwyn: ${variant_index} : ${product_href}`,
        };
    }

    const prescription_object =
        BOOTHWYN_VARIANT_MAP[product_href][variant_index];

    const isBoothwynQuarterly =
        BOOTHWYN_QUARTERLY_PROGRAM_VARIANTS[product_href].includes(
            variant_index
        );

    const script: BoothwynScriptJSON = {
        caseId: `BIOVERSE-${
            order_type === OrderType.RenewalOrder
                ? order_data.renewal_order_id
                : order_data.id
        }${resend ? 'R'.repeat(resendCount + 1) : ''}`,
        orderType: 2,
        shippingMethod: 26,
        ...(isBoothwynQuarterly ? { program: 'Quarterly Bulk' } : {}),
        patient: {
            firstName: patient_data.first_name,
            lastName: patient_data.last_name,
            email: patient_data.email,
            phoneNumber: patient_data.phone_number,
            dateOfBirth: patient_data.date_of_birth,
            gender: patient_data.sex_at_birth?.charAt(0) || 'U',
            address: {
                address1:
                    order_data.address_line1 ?? patient_data.address_line1,
                ...(order_data.address_line2 || patient_data.address_line2
                    ? {
                          address2:
                              order_data.address_line2 ??
                              patient_data.address_line2,
                      }
                    : {}),
                city: order_data.city ?? patient_data.city,
                state: order_data.state ?? patient_data.state,
                zipCode: order_data.zip ?? patient_data.zip,
            },
        },

        clinician: boothwynProviderObject,
        prescriptions: prescription_object,
    };

    return {
        script_json: script,
        error: null,
    };
}

export function generateBoothwynScriptWithData(
    patient_data: DBPatientData,
    order_data: DBOrderData,
    override?: ScriptOverrideObject
): BoothwynScriptPayload {
    const product_href: string = override
        ? override.product_href
        : order_data.product_href;
    const variant_index = override
        ? override.variant_index
        : order_data.variant_index;

    if (!BOOTHWYN_ALLOWED_PRODUCT_MAP[product_href].includes(variant_index)) {
        return {
            script_json: null,
            error: `Product - Variant Mapping is not for Boothwyn: ${variant_index} : ${product_href}`,
        };
    }

    const prescription_object =
        BOOTHWYN_VARIANT_MAP[product_href][variant_index];

    const isBoothwynQuarterly =
        BOOTHWYN_QUARTERLY_PROGRAM_VARIANTS[product_href].includes(
            variant_index
        );

    const order_type = order_data.renewal_order_id
        ? OrderType.RenewalOrder
        : OrderType.Order;

    const script: BoothwynScriptJSON = {
        caseId: `BIOVERSE-${
            order_type === OrderType.RenewalOrder
                ? order_data.renewal_order_id
                : order_data.id
        }`,
        orderType: 1,
        shippingMethod: 26,
        ...(isBoothwynQuarterly ? { program: 'Quarterly Bulk' } : {}),
        patient: {
            firstName: patient_data.first_name,
            lastName: patient_data.last_name,
            email: patient_data.email,
            phoneNumber: patient_data.phone_number,
            dateOfBirth: patient_data.date_of_birth,
            gender: patient_data.sex_at_birth?.charAt(0) || 'U',
            address: {
                address1:
                    order_data.address_line1 ?? patient_data.address_line1,
                ...(order_data.address_line2 || patient_data.address_line2
                    ? {
                          address2:
                              order_data.address_line2 ??
                              patient_data.address_line2,
                      }
                    : {}),
                city: order_data.city ?? patient_data.city,
                state: order_data.state ?? patient_data.state,
                zipCode: order_data.zip ?? patient_data.zip,
            },
        },

        clinician: boothwynProviderObject,
        prescriptions: prescription_object,
    };

    return {
        script_json: script,
        error: null,
    };
}
