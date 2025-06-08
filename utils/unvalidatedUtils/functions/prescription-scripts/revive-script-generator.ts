'use server';
import {
    REVIVE_ALLOWED_PRODUCT_MAP,
    REVIVE_PRODUCT_VARIANT_MAP,
} from '@/app/services/pharmacy-integration/revive/revive-variant-mappings';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import { retrieveOrCreateAndRetrieveRevivePatientData } from '@/app/services/pharmacy-integration/revive/revive-patient-api';
import { v4 as uuidv4 } from 'uuid';

/**
 * The medication_order_identifier prop within the script is necessary to keep record of.
 *
 * @param patientId
 * @param orderId
 * @param override
 * @returns
 */
export async function generateReviveScript(
    patientId: string,
    orderId: string,
    override?: ScriptOverrideObject,
    resend?: boolean
) {
    /**
     * Order:
     *
     * Get patient information
     *
     * Use order ID to find order information renewal vs first time
     *
     * Find the medication data on map
     * - Populate the most recent written date.
     *
     * Put it all together
     *
     * Return script JSON.
     *
     */

    //Order data will either be a renewal or first time order & we need the type.
    const { type: order_type, data: order_data_any } = await fetchOrderData(
        orderId
    );

    //Interfacing the data for ease of code writing & type safety
    const order_data: DBOrderData = order_data_any;
    const product_href: string = override
        ? override.product_href
        : order_data.product_href;
    const variant_index = override
        ? override.variant_index
        : order_data.variant_index;

    if (!REVIVE_ALLOWED_PRODUCT_MAP[product_href]?.includes(variant_index)) {
        console.error('Product - Variant Mapping is not for Revive');
        return {
            script_json: null,
            error: 'Product - Variant Mapping is not for Revive',
        };
    }

    try {
        const reviveGeneratedPatientData =
            await retrieveOrCreateAndRetrieveRevivePatientData(patientId);

        const reviveMedicationMapping =
            REVIVE_PRODUCT_VARIANT_MAP[product_href][variant_index];

        // Format the current date in the specified format
        const currentDate = new Date();
        const formattedDate = currentDate
            .toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short',
                hour12: false,
            })
            .replace(
                /(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)\s(.+)/,
                '$3-$1-$2T$4:$5:$6$7'
            );

        // Process each item in the mapping array
        const processedMedicationMapping = reviveMedicationMapping.map(
            (item) => ({
                ...item,
                date_issued: formattedDate,
                medication_order_entry_identifier: uuidv4(),
            })
        );

        const reviveGeneratedScript: ReviveScriptJSON = {
            medication_requests: processedMedicationMapping,
            patient: reviveGeneratedPatientData,
            clinic_identifier: 'bed973e6-444a-4098-a881-b1990f6ce5c7',
            practitioner_identifier: 'ee6bc798-fb24-40e6-a2bc-267eb7a2e878',
            medication_order_identifier: uuidv4(),
        };

        return {
            script_json: reviveGeneratedScript,
            error: null,
        };
    } catch (error) {
        console.error('ERROR in genrating revive script: ', error);
        return {
            script_json: null,
            error: 'Error in generating script: ' + JSON.stringify(error),
        };
    }
}
