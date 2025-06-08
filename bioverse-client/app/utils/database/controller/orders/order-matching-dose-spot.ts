import {
    DOSE_SPOT_COMPOUND_PAIRS,
    DOSE_SPOT_DISPENSABLE_DRUG_ID_PAIRS,
    DOSE_SPOT_DISPLAY_NAME_PAIRS,
    DOSE_SPOT_GENERIC_DRUG_NAME_PAIRS,
    DOSE_SPOT_LEXICOMP_DRUG_ID_PAIRS,
    DOSE_SPOT_NDC_PAIRS,
} from '@/app/api/dosespot/_event-actions/dose-spot/order-match-drug-pairings';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function getBestOrderMatchesFromDatabase(
    userId: string,
    pharmacy: string,
    doseSpotPrescriptionData: any
) {
    //matchBasedOnDrugDisplayName

    const { data: displayNameNameMatchedOrder } =
        await matchBasedOnDrugDisplayName(
            userId,
            doseSpotPrescriptionData.DisplayName,
            pharmacy
        );
    if (displayNameNameMatchedOrder) {
        console.log(
            `Server: Order Match system: matched with Generic Drug Name: ${doseSpotPrescriptionData.DisplayName}`,
            displayNameNameMatchedOrder
        );
        return displayNameNameMatchedOrder;
    }

    const { data: genericNameMatchedOrder } =
        await matchBasedOnDispensableDrugId(
            userId,
            doseSpotPrescriptionData.DispensableDrugId,
            pharmacy
        );
    if (genericNameMatchedOrder) {
        console.log(
            `Server: Order Match system: matched with Generic Drug Name: ${doseSpotPrescriptionData.GenericDrugName}`,
            genericNameMatchedOrder
        );
        return genericNameMatchedOrder;
    }

    const { data: lexicompMatchedOrder } = await matchBasedOnLexicompId(
        userId,
        doseSpotPrescriptionData.LexiGenDrugId,
        pharmacy
    );
    if (lexicompMatchedOrder) {
        console.log(
            `Server: Order Match system: matched with LexiGen Drug ID: ${doseSpotPrescriptionData.LexiGenDrugId}`,
            lexicompMatchedOrder
        );
        return lexicompMatchedOrder;
    }

    const { data: compound_id_matched_order } =
        await matchBasedOnCompoundNumber(
            userId,
            doseSpotPrescriptionData.CompoundId,
            pharmacy
        );
    if (compound_id_matched_order) {
        console.log(
            `Server: Order Match system: matched with Compound ID: ${doseSpotPrescriptionData.CompoundId}`,
            compound_id_matched_order
        );
        return compound_id_matched_order;
    }

    const { data: first_empty_order } =
        await matchOrderAnyEmptyMatchingPharmacy(userId, pharmacy);
    if (first_empty_order) {
        console.log(
            `Server: Order Match system: matched with first open order`,
            first_empty_order
        );
        return first_empty_order;
    }

    return null;
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns returns orders from curexa or gogomeds that are approved with card down and also does not have any tracking data associated.
 *  It is ordered such that latest is first.
 */
async function matchOrderAnyEmptyMatchingPharmacy(
    patientId: string,
    pharmacy: string
) {
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('assigned_pharmacy', pharmacy)
        .in('order_status', ['Approved-CardDown', 'Payment-Completed'])
        .is('external_tracking_metadata', null)
        .order('last_updated', { ascending: false });

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data[0], error: null };
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns returns orders from curexa and gogomeds that are approved with card down and also does not have any tracking data associated.
 *  It is ordered such that latest is first.
 */
export async function matchBasedOnGenericDrugName(
    patientId: string,
    generic_drug_name: string,
    pharmacy: string
) {
    const matched_product_href =
        DOSE_SPOT_GENERIC_DRUG_NAME_PAIRS[generic_drug_name] || null;

    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('product_href', matched_product_href)
        .eq('assigned_pharmacy', pharmacy)
        .maybeSingle();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns returns orders from curexa and gogomeds that are approved with card down and also does not have any tracking data associated.
 *  It is ordered such that latest is first.
 */
export async function matchBasedOnDrugDisplayName(
    patientId: string,
    drug_display_name: string,
    pharmacy: string
) {
    const matched_product_href =
        DOSE_SPOT_DISPLAY_NAME_PAIRS[drug_display_name] || null;

    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('product_href', matched_product_href)
        .eq('assigned_pharmacy', pharmacy)
        .maybeSingle();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

export async function matchBasedOnDispensableDrugId(
    patientId: string,
    dispensable_drug_id: number,
    pharmacy: string
) {
    const matched_product_href =
        DOSE_SPOT_DISPENSABLE_DRUG_ID_PAIRS[dispensable_drug_id] || null;

    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('product_href', matched_product_href)
        .eq('assigned_pharmacy', pharmacy)
        .maybeSingle();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns returns orders from curexa and gogomeds that are approved with card down and also does not have any tracking data associated.
 *  It is ordered such that latest is first.
 */
export async function matchBasedOnNDCNumber(
    patientId: string,
    ndc_number: string,
    pharmacy: string
) {
    const matched_product_href = DOSE_SPOT_NDC_PAIRS[ndc_number] || null;

    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('product_href', matched_product_href)
        .eq('assigned_pharmacy', pharmacy)
        .order('last_updated', { ascending: false })
        .maybeSingle();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns returns orders from curexa and gogomeds that are approved with card down and also does not have any tracking data associated.
 *  It is ordered such that latest is first.
 */
export async function matchBasedOnCompoundNumber(
    patientId: string,
    compound_id: string,
    pharmacy: string
) {
    const matched_product_href = DOSE_SPOT_COMPOUND_PAIRS[compound_id] || null;

    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('product_href', matched_product_href)
        .eq('assigned_pharmacy', pharmacy)
        .order('last_updated', { ascending: false })
        .maybeSingle();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns returns orders from curexa and gogomeds that are approved with card down and also does not have any tracking data associated.
 *  It is ordered such that latest is first.
 */
export async function matchBasedOnLexicompId(
    patientId: string,
    lexicomp_id: string,
    pharmacy: string
) {
    const matched_product_href =
        DOSE_SPOT_LEXICOMP_DRUG_ID_PAIRS[lexicomp_id] || null;

    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        external_tracking_metadata,
        order_status,
        product_href,
        assigned_pharmacy,
        subscription_type,
        price_id,
        customer_uid,
        assigned_provider,
        address_line1,
        address_line2,
        state,
        zip,
        city,
        subscription_id
      `
        )
        .eq('customer_uid', patientId) //return only records for this patient.
        .eq('product_href', matched_product_href)
        .eq('assigned_pharmacy', pharmacy)
        .order('last_updated', { ascending: false })
        .maybeSingle();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getBestOrderMatchFromDatabase, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}
