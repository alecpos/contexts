'use server';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { OrderItem } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { auditShippingTrackingFailed } from '../shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import {
    BaseOrder,
    BaseOrderInterface,
    EasyPostTrackerIDResponse,
    OrderData,
    OrderStatus,
    OrderType,
    ShippingStatus,
    ShippoTrackerIDResponse,
} from '@/app/types/orders/order-types';
import { getOrderType } from '@/app/utils/actions/intake/order-util';
import {
    getLatestRenewalOrderForOriginalOrderId,
    getRenewalOrderForPatientIntake,
    updateRenewalOrder,
} from '../renewal_orders/renewal_orders';
import { Status } from '@/app/types/global/global-enumerators';
import {
    RenewalOrder,
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { concat, isEmpty } from 'lodash';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { USStates } from '@/app/types/enums/master-enums';
import { providerInfoMeylinC } from '@/app/services/pharmacy-integration/provider-static-information';
import { changePatientAddressInReviveIfNecessary } from '@/app/services/pharmacy-integration/revive/revive-patient-api';

import _ from 'lodash';
import {
    getPriceVariantTableData,
    ProductVariantRecord,
} from '../product_variants/product_variants';
import { createQuestionnaireSessionForOrder } from '../questionnaires/questionnaire_sessions';

export async function getQuestionSetVersionForLastCompleteOrder(
    user_id: string,
    product_href: PRODUCT_HREF
): Promise<number> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('question_set_version')
        .eq('customer_uid', user_id)
        .eq('product_href', product_href)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    if (error || !data.question_set_version) {
        return 1;
    }

    return data.question_set_version as number;
}

export async function getFirstCompletedOrderCreatedDate(
    user_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('created_at')
        .eq('customer_uid', user_id)
        .eq('product_href', product_href)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    if (error || !data) {
        return new Date();
    }

    return data.created_at;
}

export async function getFirstCompletedOrder(
    user_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_uid', user_id)
        .eq('product_href', product_href)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    if (error || !data) {
        return null;
    }

    return data as BaseOrderInterface;
}

export async function deleteOrderById(order_id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('id', order_id);

    if (error) {
        console.error('Error getting base order by order id', order_id);
        return null;
    }
}

/**
 * @author Nathan Cho
 * @param orderId - order Id
 * @param providerId - provider profile uuid
 * @returns
 */
export async function assignProviderToOrderUsingOrderId(
    orderId: number,
    providerId: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const current_time = new Date();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            assigned_provider: providerId,
            assigned_provider_timestamp: current_time,
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: assignProviderToOrderUsingOrderId, error: ',
            error
        );

        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function getBaseOrderById(order_id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order_id)
        .maybeSingle();

    if (error) {
        console.error('Error getting base order by order id', order_id);
        return null;
    }

    return data as BaseOrderInterface;
}

/**
 *
 * @param customer_id profiles table uuid
 * @param product_href products table product href
 * @returns latest orders table record matching product_href and customer_id
 *
 */
export async function getOrderForProduct(
    product_href: string,
    customer_id: string
): Promise<BaseOrder | null> {
    const supabase = createSupabaseServiceClient();

    if (
        [
            PRODUCT_HREF.METFORMIN,
            PRODUCT_HREF.SEMAGLUTIDE,
            PRODUCT_HREF.TIRZEPATIDE,
            PRODUCT_HREF.OZEMPIC,
            PRODUCT_HREF.MOUNJARO,
            PRODUCT_HREF.WEGOVY,
            PRODUCT_HREF.ZEPBOUND,
            PRODUCT_HREF.WL_CAPSULE,
        ].includes(product_href as PRODUCT_HREF)
    ) {
        console.log('Fetching individual wl order');
        return await getOrderForIndividualWLProduct(product_href, customer_id);
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', product_href)
        .eq('customer_uid', customer_id)
        .limit(1)
        .order('created_at', { ascending: false })
        .maybeSingle();

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            product_href,
            customer_id
        );
        return null;
    }

    return data as BaseOrder;
}

/**
 * getOrderForIndividualWLProduct
 * @param product_href
 * @param customer_id
 * a more restrictive version of getOrderForProduct that only returns orders which are weren't global wl orders
 */
export async function getOrderForIndividualWLProduct(
    product_href: string,
    customer_id: string
): Promise<BaseOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', product_href)
        .eq('customer_uid', customer_id)
        .is('metadata->selected_product', null) //make sure it's not a global wl order by checking if selected_product metadata exists
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            product_href,
            customer_id
        );
        return null;
    }

    return data as BaseOrder;
}

/**
 *
 * The difference between this and the v1 version is that this returns an array which may have multiple orders for the same product
 * This would only happen if a patient does not complete a sem intake for example, then goes into a global wl flow and selects semaglutide
 *
 */
export async function getOrderForProductV2(
    product_href: string,
    customer_id: string
): Promise<BaseOrder[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', product_href)
        .eq('customer_uid', customer_id);

    if (error) {
        console.error(
            'Error getOrderForProduct',
            error,
            product_href,
            customer_id
        );
        return null;
    }

    return data?.length ? (data as BaseOrder[]) : null;
}

export async function checkAndCreateOrder(
    user_id: string,
    productData: {
        product_href: string;
        variant: number;
        subscriptionType: string;
    },
    priceData?: ProductVariantRecord[]
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', productData.product_href)
        .eq('customer_uid', user_id)
        .eq('source', 'intake')
        .limit(1)
        .maybeSingle();

    //to be deleted (those product hrefs will be handled by checkAndCreateIndividualWLOrder():
    if (['tirzepatide', 'semaglutide'].includes(productData.product_href)) {
        const { data: glp1data, error: glp1error } = await supabase
            .from('orders')
            .select('*')
            .in('product_href', ['semaglutide', 'tirzepatide'])
            .eq('customer_uid', user_id)
            .eq('source', 'intake');

        // return null if the patient has a semaglutide or tirzepatide order that was completed (not incomplete/canceled)
        const shouldReturnNull = glp1data?.some(
            (order) =>
                order &&
                ![
                    OrderStatus.Incomplete,
                    OrderStatus.AdministrativeCancel,
                    OrderStatus.Canceled,
                ].includes(order.order_status)
        );

        if (shouldReturnNull) {
            return null;
        }
    }

    // if they do have an incomplete order for the chosen product, use that order in the flow
    if (data && data.order_status === OrderStatus.Incomplete) {
        console.log(
            'returning an existing order to be used for the current flow'
        );
        return { order: data, error: null };
    }

    if (data && data.order_status !== OrderStatus.Incomplete) {
        return null;
    }

    if (!data) {
        //create a new order since no orders with the intake's product_href exist
        console.log('creating a new order for the current flow');
        return await createNewOrderV2(
            user_id,
            productData,
            priceData ?? undefined
        );
    }
}

/**
 * checkAndCreateIndividualWLOrder
 * @param user_id
 * @param productData
 * @param priceData
 * Same as checkAndCreateOrder but it checks the metadata as well to make sure it's not a global wl order
 */
export async function checkAndCreateIndividualWLOrder(
    user_id: string,
    productData: {
        product_href: string;
        variant: number;
        subscriptionType: string;
    },
    priceData?: ProductVariantRecord[]
) {
    const supabase = createSupabaseServiceClient();

    //'individual' as opposed to global weight-loss order
    const { data: individualWLProductOrder, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', productData.product_href)
        .eq('customer_uid', user_id)
        .eq('source', 'intake')
        .is('metadata->selected_product', null) //make sure it's not a global wl order by checking if selected_product metadata exists
        .limit(1)
        .maybeSingle();

    // if this is a semaglutide or tirzepatide order, check if the user has an existing completed order and if they do, return null
    if (['tirzepatide', 'semaglutide'].includes(productData.product_href)) {
        const { data: glp1data, error: glp1error } = await supabase
            .from('orders')
            .select('*')
            .in('product_href', ['semaglutide', 'tirzepatide'])
            .eq('customer_uid', user_id)
            .eq('source', 'intake');

        // return null if the patient has a semaglutide or tirzepatide order that was completed (not incomplete/canceled)
        const shouldReturnNull = glp1data?.some(
            (order) =>
                order &&
                ![
                    OrderStatus.Incomplete,
                    OrderStatus.AdministrativeCancel,
                    OrderStatus.Canceled,
                ].includes(order.order_status)
        );

        if (shouldReturnNull) {
            console.log('Patient has already completed a glp-1 intake');
            return null;
        }
    }

    // if they do have an incomplete order for the chosen product, use that order in the flow
    if (
        individualWLProductOrder &&
        individualWLProductOrder.order_status === OrderStatus.Incomplete
    ) {
        console.log(
            'returning an existing order to be used for the current flow'
        );
        return { order: individualWLProductOrder, error: null };
    }

    if (!individualWLProductOrder) {
        //create a new order since no orders with the intake's product_href exist
        console.log('creating a new order for the current flow');
        return await createNewOrderV2(
            user_id,
            productData,
            priceData ?? undefined
        );
    }
}

/**
 * @author Nathan Cho
 * Devised to kick users out if there is another glp-1 or metformin order that is relevant.
 * @param user_id
 * @param productData
 * @param priceData
 * @returns
 */
export async function checkAndCreateCombinedWeightLossOrder(
    user_id: string,
    productData: {
        product_href: string;
        variant: number;
        subscriptionType: string;
    },
    priceData?: ProductVariantRecord[]
) {
    const supabase = createSupabaseServiceClient();

    const { data: existingWeightLossProductOrders, error } = await supabase
        .from('orders')
        .select('*')
        .in('product_href', [
            PRODUCT_HREF.WEIGHT_LOSS,
            PRODUCT_HREF.METFORMIN,
            PRODUCT_HREF.SEMAGLUTIDE,
            PRODUCT_HREF.TIRZEPATIDE,
            PRODUCT_HREF.OZEMPIC,
            PRODUCT_HREF.MOUNJARO,
            PRODUCT_HREF.WEGOVY,
            PRODUCT_HREF.ZEPBOUND,
        ])
        .eq('customer_uid', user_id)
        .eq('source', 'intake');

    let existingGlobalWLOrder = null;
    let completedWLProductOrder = false;
    existingWeightLossProductOrders?.forEach((order) => {
        if (
            order.metadata.selected_product &&
            order.order_status === OrderStatus.Incomplete
        ) {
            existingGlobalWLOrder = order;
            return { order: order, error: null };
        } else {
            if (
                ![
                    OrderStatus.Incomplete,
                    OrderStatus.Canceled,
                    OrderStatus.AdministrativeCancel,
                ].includes(order.order_status)
            ) {
                console.log(
                    'Patient has already completed a weight loss product intake'
                );
                completedWLProductOrder = true;
                return null;
            }
        }
    });

    if (completedWLProductOrder) {
        return null;
    }

    if (existingGlobalWLOrder) {
        console.log(
            'Returning existing global wl order to be used for the current flow'
        );
        return { order: existingGlobalWLOrder, error: null };
    }

    let price_data_empty: boolean = false;
    if (isEmpty(priceData)) {
        price_data_empty = true;
    }

    //since the user doens't have a weight-loss order, and since none of their other wl orders (if any) are complete/active --> create a new order
    return await createNewOrderV2(
        user_id,
        productData,
        price_data_empty ? undefined : priceData,
        { selected_product: 'no selection yet' } //make sure to add the metadata here so it will always be known as global wl order
    );
}

export async function createNewOrderV2(
    user_id: string,
    productData: {
        product_href: string;
        variant: number;
        subscriptionType: string;
    },
    priceData?: ProductVariantRecord[],
    metadata?: { [key: string]: any }
) {
    const variantPriceData = priceData?.find(
        (variant) => variant.variant_index == productData.variant
    );

    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

    const order: Order = {
        customer_uid: user_id,
        product_href: productData.product_href,
        variant_index: productData.variant,
        subscription_type: productData.subscriptionType,
        price: priceData
            ? variantPriceData?.price_data.product_price
            : undefined, //undefined because with combined weight loss, this may not be determinant for a bit.
        price_id: priceData
            ? variantPriceData?.stripe_price_ids[environment! as 'dev' | 'prod']
            : undefined, //undefined because with combined weight loss, this may not be determinant for a bit.
        order_status: 'Incomplete',
        stripe_metadata: {
            setupIntentId: '',
            clientSecret: '',
            paymentMethodId: '',
        },
        environment: environment ?? 'dev',
        metadata: metadata ?? {},
        ...(metadata?.source !== undefined ? { source: metadata.source } : {}), //only add source if it exists. This was added as a part of subscription reactivation 5/12/25
    };

    const supabase = createSupabaseServiceClient();
    const { data: product_q_version_data, error: q_version_error } =
        await supabase
            .from('products')
            .select('current_question_set_version')
            .eq('href', order.product_href)
            .limit(1)
            .single();

    const current_question_set_version =
        product_q_version_data?.current_question_set_version;

    const { data: newlyCreatedOrder, error } = await supabase
        .from('orders')
        .insert([
            {
                customer_uid: order.customer_uid,
                product_href: order.product_href,
                variant_index: order.variant_index,
                subscription_type: order.subscription_type,
                price: order.price,
                order_status: order.order_status,
                rx_questionnaire_answers: order.rxQuestionnaireAnswers,
                stripe_metadata: order.stripe_metadata,
                price_id: order.price_id,
                environment: order.environment,
                metadata: order.metadata,
                ...(current_question_set_version
                    ? { question_set_version: current_question_set_version }
                    : {}),
            },
        ])
        .select('id');

    if (error) return { order: null, error: 'creation error' + error.message };

    const questionnaire_session_id = await createQuestionnaireSessionForOrder(
        order.customer_uid,
        newlyCreatedOrder[0].id
    );

    const updatedOrder = {
        ...order,
        orderId: newlyCreatedOrder[0].id,
        questionnaire_session_id: questionnaire_session_id,
    };

    return { order: updatedOrder, error: null };
}

export async function insertNewManualOrder(
    order_data: OrdersSBR,
    getLatestVersion: boolean = true
) {
    const supabase = createSupabaseServiceClient();

    if (getLatestVersion) {
        const { data: product_q_version_data, error: q_version_error } =
            await supabase
                .from('products')
                .select('current_question_set_version')
                .eq('href', order_data.product_href)
                .single();

        const current_question_set_version =
            product_q_version_data?.current_question_set_version;

        order_data.question_set_version = current_question_set_version;
    }

    const { data, error } = await supabase
        .from('orders')
        .insert(order_data)
        .select();

    if (error) {
        throw error;
    }

    return data[0] as BaseOrderInterface;
}

export async function insertNewFirstTimeOrder(
    order_data: Partial<BaseOrderInterface>
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .insert(order_data)
        .select();

    if (error) {
        console.error(error);
        throw error;
    }

    return data[0] as BaseOrderInterface;
}

// -----------------------------
// END CREATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Read
// -----------------------------

export async function getBaseOrderByProduct(
    user_id: string,
    product_href: PRODUCT_HREF
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', product_href)
        .eq('customer_uid', user_id)
        .maybeSingle();

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            product_href,
            user_id
        );
        return null;
    }

    return data as BaseOrderInterface;
}

/**
 * @author Nathan Cho
 * @param patientId - patient ID in the profiles table
 * @returns an array object of the orders that are for the patient Id.
 */
export async function getAllOrdersByPatientId(patientId: string) {
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id,
        created_at,
        variant_text,
        product_href,
        product:products!product_href (
          name
        )
      `
        )
        .eq('customer_uid', patientId);

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getAllOrdersByPatientId, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

export async function getCombinedOrderForBanner(user_id: string) {
    const combinedOrder = await getCombinedOrder(user_id);
}

export async function getCombinedOrder(
    user_id: string | false | undefined
): Promise<BaseOrder | null> {
    if (!user_id) {
        return null;
    }

    var finalOrder;

    const orderData = await getOrderForProduct(
        PRODUCT_HREF.WEIGHT_LOSS,
        user_id
    );

    if (!orderData) {
        const combinedOrder = await getCombinedWeightlossOrderForUser(user_id);
        if (!combinedOrder) {
            console.error('Could not get combined order for user', user_id);
        }
        finalOrder = combinedOrder;
    } else {
        finalOrder = orderData;
    }

    return finalOrder;
}

/**
 * getCombinedOrderV2
 * @param user_id
 * Checks for an order with product_href 'weight-loss', if it doesn't exist
 * it will use check again for orders where the product_href has been swapped
 *      from 'weight-loss' to -  'semaglutide' | 'tirzepatide' | 'metformin'
 */
export async function getCombinedOrderV2(
    user_id: string | false | undefined
): Promise<BaseOrder | null> {
    if (!user_id) {
        return null;
    }

    var finalOrder;

    const orderData = await getOrderForProduct(
        PRODUCT_HREF.WEIGHT_LOSS,
        user_id
    );

    if (!orderData) {
        const combinedOrder = await getIncompleteGlobalWLOrderPostHrefSwap(
            user_id
        );
        if (!combinedOrder) {
            console.error('Could not get combined order for user', user_id);
        }
        finalOrder = combinedOrder;
    } else {
        finalOrder = orderData;
    }

    return finalOrder;
}

/**
 * @author Nathan Cho
 * @param patientId - patient uuid in profiles
 * @returns an order ID which have no specified pharmacy. [TMC and Empower will be specified when the provider approves of the request]
 */
export async function getPossibleDoseSpotMatchOrdersUsingPatientId(
    patientId: string
) {
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('orders')
        .select(
            `
          id,
          created_at,
          variant_text,
          product_href,
          assigned_pharmacy,
          external_tracking_metadata,
          stripe_metadata,
          price_id
        `
        )
        .is('assigned_pharmacy', null)
        .eq('customer_uid', patientId);

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getPossibleDoseSpotMatchOrdersUsingPatientId, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
}

export async function getOrdersForCustomer(
    customer_id: string
): Promise<OrderItem[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_orders_for_patientv2', {
        customer_id,
    });

    if (error) {
        console.error('Error retreiving orders for customer', error);
        return [];
    }

    console.log('order data', data);

    return data as OrderItem[];
}

export async function getOrderIdByPatientIdAndProductHref(
    patient_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_uid', patient_id)
        .eq('product_href', product_href)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.log(error);
    }

    return data?.id;
}

export async function getCombinedWeightlossOrderForUser(
    user_id: string
): Promise<BaseOrder | null> {
    const productHrefs = [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
        PRODUCT_HREF.METFORMIN,
    ];

    const orders = await Promise.all(
        productHrefs.map((href) => getOrderForProduct(href, user_id))
    );

    const validOrders = orders.filter((order) => order !== null);

    if (validOrders.length !== 1) {
        console.error('Fetched more than 1 glp1 order', user_id);
        return null;
    }

    return validOrders[0];
}

/**
 * @author Ben Hebert
 * This will will look for incomplete orders:
 *     WITH product_href = 'semaglutide' | 'tirzepatide' | 'metformin'
 *     AND the selected_product metadata (which indicates that it is a global wl order)
 */
export async function getIncompleteGlobalWLOrderPostHrefSwap(
    user_id: string
): Promise<BaseOrder | null> {
    const productHrefs = [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
        PRODUCT_HREF.METFORMIN,
        PRODUCT_HREF.WL_CAPSULE,
    ];

    const ordersArray = await Promise.all(
        productHrefs.map((href) => getOrderForProductV2(href, user_id))
    );

    // Flatten the array and filter out null values
    const orders = ordersArray.flat().filter(Boolean);

    const validOrders = orders.filter(
        (order) =>
            order !== null &&
            order.order_status === OrderStatus.Incomplete &&
            order.metadata?.['selected_product']
    );

    if (validOrders.length !== 1) {
        //if there are multiple orders just get the most recently created one
        const orderWithSelectedProduct = validOrders
            .filter((order) => order?.metadata?.['selected_product'])
            .sort(
                (a, b) =>
                    new Date(b?.created_at ?? 0).getTime() -
                    new Date(a?.created_at ?? 0).getTime()
            )[0];

        if (orderWithSelectedProduct) {
            return orderWithSelectedProduct;
        }

        console.error(
            'Fetched more than 1 weight loss order and none had selected_product metadata',
            user_id
        );
        return null;
    }

    return validOrders[0];
}

export async function getAllOrdersForProduct(
    user_id: string,
    product_href: string
): Promise<CustomPrescriptionOrder[]> {
    const supabase = createSupabaseServiceClient();
    //ASSIGNED PROVIDER
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_href', product_href)
        .eq('customer_uid', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getAllOrdersForProduct', error, user_id);
        return [];
    }

    const { data: renewalOrders, error: renewalsError } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('product_href', product_href)
        .eq('customer_uuid', user_id)
        .order('created_at', { ascending: false });

    if (renewalsError) {
        console.error('Error getAllOrdersForProduct', error, user_id);
        return [];
    }

    const mergedOrders = concat(orders, renewalOrders);

    return mergedOrders.map((order: any) => {
        return {
            order_id: order.renewal_order_id
                ? order.renewal_order_id
                : String(order.id),
            product_href: order.product_href,
            created_at: order.created_at,
            assigned_provider:
                order.assigned_provider ?? providerInfoMeylinC.uuid,
        };
    });
}

export async function getAllGLP1RenewalOrdersForProduct(
    customer_id: string
): Promise<RenewalOrder[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .in('product_href', [PRODUCT_HREF.WEIGHT_LOSS])
        .eq('customer_uuid', customer_id);

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            customer_id
        );
        return null;
    }

    return data as RenewalOrder[];
}

export async function getAllGLP1OrdersForProduct(
    customer_id: string
): Promise<BaseOrder[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('product_href', [PRODUCT_HREF.WEIGHT_LOSS])
        .eq('customer_uid', customer_id);

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            customer_id
        );
        return null;
    }

    return data as BaseOrder[];
}

export async function getAllOrdersWithStatusArray(
    statuses: string[],
    afterDate: Date
) {
    const supabase = createSupabaseServerComponentClient();

    const { data: order_array, error: error } = await supabase
        .from('orders')
        .select('id, last_updated')
        .in('order_status', statuses)
        .eq('environment', 'prod');

    if (error) {
        console.log('admin error check progress: ', error);
    }

    const filtered_array = order_array!.filter(
        (order) => new Date(order.last_updated) > afterDate
    );

    return filtered_array;
}

export async function doesOrderExistWithTrackingNumber(
    trackingNumber: string,
    orderId: string,
    isRenewalOrder: boolean
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    if (isRenewalOrder) {
        const { data: renewalOrderData, error: renewalOrdersError } =
            await supabase
                .from('renewal_orders')
                .select('tracking_number')
                .eq('renewal_order_id', orderId)
                .maybeSingle();

        if (renewalOrdersError) {
            console.error(
                'Error checking if there is an order with this tracking number',
                trackingNumber,
                renewalOrdersError
            );
        }

        if (renewalOrderData?.tracking_number === trackingNumber) {
            return true;
        }
    } else {
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('tracking_number')
            .eq('id', orderId)
            .maybeSingle();

        if (orderError) {
            console.error(
                'Error checking if there is an order with this tracking number',
                trackingNumber,
                orderError
            );
        }

        if (orderData?.tracking_number === trackingNumber) {
            return true;
        }
    }

    return false;
}

export async function doesOrderExistWithEasypostTrackingId(
    trackingNumber: string,
    orderId: string,
    isRenewalOrder: boolean
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    if (isRenewalOrder) {
        const { data: renewalOrderData, error: renewalOrdersError } =
            await supabase
                .from('renewal_orders')
                .select('easypost_tracking_id')
                .eq('renewal_order_id', orderId)
                .maybeSingle();

        if (renewalOrdersError) {
            console.error(
                'Error checking if there is an order with this tracking number',
                trackingNumber,
                renewalOrdersError
            );
        }

        if (renewalOrderData?.easypost_tracking_id) {
            return true;
        }
        return false;
    } else {
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('easypost_tracking_id')
            .eq('id', orderId)
            .maybeSingle();

        if (orderError) {
            console.error(
                'Error checking if there is an order with this tracking number',
                trackingNumber,
                orderError
            );
        }

        if (orderData?.easypost_tracking_id) {
            return true;
        }
        return false;
    }

    return false;
}

export async function getOrderIdUsingHallandaleOrderId(
    hallandale_order_id: string
): Promise<string | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq(
            'external_tracking_metadata -> hallandaleOrderId',
            hallandale_order_id
        )
        .limit(1)
        .maybeSingle();

    if (!data || isEmpty(data)) {
        const { data: renewalData, error: renewalError } = await supabase
            .from('renewal_orders')
            .select('renewal_order_id')
            .eq(
                'external_tracking_metadata -> hallandaleOrderId',
                hallandale_order_id
            )
            .limit(1)
            .maybeSingle();

        if (!renewalData || isEmpty(renewalData)) {
            console.error(
                'Could not find order for hallandale order id',
                hallandale_order_id
            );
            return null;
        }

        return renewalData.renewal_order_id;
    }

    if (data.id) {
        return data.id;
    }
    return null;
}

export async function getPriceForProduct(order_id: number) {
    const calculateDiscountPrice = (
        product_href: string,
        priceJson: any,
        subscription_type: string,
        discount_id: string[]
    ) => {
        const product_price = parseFloat(priceJson['product_price']);
        // If weightloss product, always give discount
        if (isWeightlossProduct(product_href)) {
            if (priceJson.discount_price.discount_type === 'fixed') {
                const discounted_price =
                    product_price -
                    priceJson['discount_price']['discount_amount'];
                return discounted_price;
            }

            const discounted_price =
                product_price -
                (product_price *
                    priceJson['discount_price']['discount_amount']) /
                    100;
            return discounted_price;
        }

        // Never give discount for non-weightloss one-time purchase products
        if (subscription_type === 'one_time') {
            return product_price;
        }

        // Only give discount to people who had discount_id populated
        if (!discount_id || discount_id.length === 0) {
            return product_price;
        }

        if (priceJson.discount_price.discount_type === 'percent') {
            const discounted_price =
                product_price -
                (product_price *
                    priceJson['discount_price']['discount_amount']) /
                    100;
            return discounted_price;
        }

        if (priceJson.discount_price.discount_type === 'fixed') {
            const discounted_price =
                product_price - priceJson['discount_price']['discount_amount'];
            return discounted_price;
        }
        return 0;
    };

    const isWeightlossProduct = (product_href: string) => {
        if (
            product_href === 'ozempic' ||
            product_href === 'metformin' ||
            product_href === 'semaglutide' ||
            product_href === 'wegovy' ||
            product_href === 'tirzepatide' ||
            product_href === 'mounjaro'
        ) {
            return true;
        }
        return false;
    };

    const supabase = await createSupabaseServerComponentClient();

    try {
        console.log('ORDER ID', order_id);
        const { data, error } = await supabase
            .from('orders')
            .select(
                'product_href, variant_index, subscription_type, discount_id'
            )
            .eq('id', order_id)
            .single();

        if (error) {
            console.log(error, error.message);
            return;
        }
        const { data: priceDataArray, error: productError } =
            await getPriceVariantTableData(data?.product_href);

        if (productError) {
            console.log(productError, productError.message);
            return;
        }

        const cadenceMatchedRecord = priceDataArray?.find(
            (record) => record.variant_index == data.variant_index
        );

        const priceJson = cadenceMatchedRecord?.price_data;

        const discountedPrice = calculateDiscountPrice(
            data?.product_href,
            priceJson,
            data?.subscription_type,
            data?.discount_id
        );
        return discountedPrice;
    } catch (error: any) {
        console.error(error, error.message);
    }
}

export async function getProductFromOrderId(order_id: string) {
    const supabase = createSupabaseServiceClient();

    // Check orders first
    const { data, error } = await supabase
        .from('orders')
        .select('product_href')
        .eq('id', order_id)
        .maybeSingle();
    if (error) {
        console.error(
            'Error fetching product from orders with order id',
            error,
            order_id
        );
    }

    if (data) {
        // Order is valid
        return data.product_href;
    }
    // Check renewal_orders now
    const { data: renewalOrders, error: renewalOrdersError } = await supabase
        .from('renewal_orders')
        .select('product_href')
        .eq('renewal_order_id', order_id)
        .maybeSingle();

    if (renewalOrdersError) {
        console.error(
            'Error fetching product from order_renewals with order id',
            error,
            order_id
        );
    }
    if (renewalOrders) {
        return renewalOrders.product_href;
    }
    console.error('Unknown product_href for order_id', order_id);
    return 'unknown';
}

export async function checkForExistingOrderV2(
    userUid: string,
    productHref: string
) {
    const supabase = createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .select(
            'id, stripe_metadata, order_status, variant_index, subscription_type, address_line1, address_line2, city, state, zip, product_href'
        )
        .eq('customer_uid', userUid)
        .eq('product_href', productHref)
        .eq('source', 'intake')
        .limit(1)
        .maybeSingle();

    if (error) {
        console.log(
            'order-control.ts | checkForExistingOrder: There was an error in fetching data from the server',
            error.message
        );
        return { data: null, error: error };
    }

    return { data: fetchedData ?? null, error: null };
}

export async function checkForExistingOrderWeightLoss(userUid: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .select(
            'id, stripe_metadata, order_status, variant_index, subscription_type, address_line1, address_line2, city, state, zip, product_href'
        )
        .eq('customer_uid', userUid)
        .in('product_href', ['semaglutide', 'tirzepatide', 'metformin'])
        .eq('source', 'intake')
        .limit(1)
        .maybeSingle();

    if (error) {
        console.log(
            'order-control.ts | checkForExistingOrder: There was an error in fetching data from the server',
            error.message
        );
        return { data: null, error: error };
    }

    return { data: fetchedData ?? null, error: null };
}

/**
 *
 * Functions regarding Admin and Provider All Patient View
 * Displays order information data accordingly
 *
 */
export async function getPatientOrderTabData(customer_uid: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `id, 
            external_tracking_metadata, 
            order_status, 
            approval_denial_timestamp, 
            assigned_pharmacy, 
            shipping_status, 
            tracking_number, 
            product_href,
            variant_index,
            variant_text,
            discount_id,
            assigned_provider, 
            created_at, 
            subscription_type,
            submission_time,
            customer_uid,
            address_line1,
            address_line2,
            state,
            zip,
            city,
            question_set_version,
            pharmacy_script,
            product:products!product_href (
                name
            ),
            provider:providers!assigned_provider (
                id,
                name
            ),
            subscription:prescription_subscriptions!subscription_id (
                last_used_script,
                stripe_subscription_id,
                id,
                status
            ),
            payment_failure:payment_failure_tracker!id (
                status,
                created_at
            )
            `
        )
        .eq('customer_uid', customer_uid)
        .order('id', { ascending: true });

    if (error) {
        console.error(error);
    }

    return { data: data, error: error };
}

export async function getCustomerIDFromEasyPostTrackingID(
    easypost_tracking_id: string
): Promise<EasyPostTrackerIDResponse> {
    const supabase = createSupabaseServiceClient();

    try {
        const [resultOrders, resultOrderRenewals, resultCustomOrder] =
            await Promise.all([
                supabase
                    .from('orders')
                    .select('customer_uid, id, product_href, subscription_type')
                    .eq('easypost_tracking_id', easypost_tracking_id)
                    .maybeSingle(),
                supabase
                    .from('renewal_orders')
                    .select(
                        'customer_uuid, renewal_order_id, product_href, subscription_type'
                    )
                    .eq('easypost_tracking_id', easypost_tracking_id)
                    .maybeSingle(),
                supabase
                    .from('custom_orders')
                    .select('patient_id, custom_order_id, product_href')
                    .eq('easypost_tracking_id', easypost_tracking_id)
                    .maybeSingle(),
            ]);

        if (
            resultOrders &&
            resultOrders.data &&
            resultOrderRenewals &&
            resultOrderRenewals.data
        ) {
            // This shouldn't happen, use order renewal's customer id
            console.error(
                'Two orders found for easypost tracking id',
                easypost_tracking_id
            );
            return {
                success: true,
                id: resultOrderRenewals.data.customer_uuid,
                order_id: resultOrderRenewals.data.renewal_order_id,
                product_href: resultOrderRenewals.data.product_href,
                subscription_type: resultOrderRenewals.data.subscription_type,
                type: OrderType.RenewalOrder,
            };
        } else if (resultOrders && resultOrders.data) {
            // Order exists
            return {
                success: true,
                id: resultOrders.data.customer_uid,
                order_id: resultOrders.data.id,
                product_href: resultOrders.data.product_href,
                subscription_type: resultOrders.data.subscription_type,
                type: OrderType.Order,
            };
        } else if (resultOrderRenewals && resultOrderRenewals.data) {
            // Renewal order exists
            return {
                success: true,
                id: resultOrderRenewals.data.customer_uuid,
                order_id: resultOrderRenewals.data.renewal_order_id,
                product_href: resultOrderRenewals.data.product_href,
                subscription_type: resultOrderRenewals.data.subscription_type,
                type: OrderType.RenewalOrder,
            };
        } else if (resultCustomOrder && resultCustomOrder.data) {
            return {
                success: true,
                id: resultCustomOrder.data.patient_id,
                order_id: resultCustomOrder.data.custom_order_id,
                product_href: resultCustomOrder.data.product_href,
                subscription_type: SubscriptionCadency.Monthly, // not needed
                type: OrderType.CustomOrder,
            };
        } else {
            // Neither
            return {
                success: false,
                id: null,
                type: OrderType.Order,
                subscription_type: SubscriptionCadency.Monthly,
            };
        }
    } catch (error) {
        console.error(
            'Controller Error. tablename: orders, method: getCustomerIDFromEasyPostTrackingID, error: ',
            error,
            easypost_tracking_id
        );
    }
    return {
        success: false,
        id: null,
        type: OrderType.Order,
        subscription_type: SubscriptionCadency.Monthly,
    };
}

export async function getCustomerIDFromTrackingNumber(tracking_number: string) {
    const supabase = createSupabaseServiceClient();

    const { data: fetchedData, error } = await supabase
        .rpc('get_customer_from_tracking_number', {
            tracking_number_: tracking_number,
        })
        .single();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getCustomerIDFromTrackingNumber, error: ',
            error,
            tracking_number
        );
        return {
            success: false,
            order_id: null,
            id: null,
        } as ShippoTrackerIDResponse;
    }
    return {
        ...(fetchedData as object),
        success: true,
    } as ShippoTrackerIDResponse;
}

export async function getAllOrdersForProviderOrderTableV2() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_orders_for_provider_overview_v2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) {
        console.log('error', error);
        return null;
    }

    // console.log('DATA', data);

    return data;
}

export async function fetchMostRecentBaseOrder(
    user_id: string,
    product_href: PRODUCT_HREF
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_uid', user_id)
        .eq('product_href', product_href)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        return null;
    }

    return data as BaseOrderInterface;
}

/**
 * @author Nathan Cho
 * @returns The orders that are needed for the provider order table. Will only return records where assigned_provider are 'null' or equal to the provider's Id.
 */
export async function getAllOrdersForProviderOrderTable(providerId?: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
            *,
            product:products!product_href (
                name
            ),
            patient:profiles!customer_uid (
                first_name,
                last_name,
                state,
                license_photo_url,
                selfie_photo_url
            )
            `
        )
        .in('order_status', [
            // 'Unapproved-NoCard', //this and the two below are disabled for early stages until more is added on payment failure paths.
            'Unapproved-CardDown',
            // 'Approved-NoCard',
            'Approved-CardDown',
            'Pending-Customer-Response',
            'Denied-CardDown',
            // 'Denied-NoCard',

            'Approved-NoCard',

            'Payment-Completed',
            'Payment-Declined',

            'Canceled',
            'Incomplete',

            'Approved-NoCard-Finalized',
            'Approved-CardDown-Finalized',

            'Order-Processing',
            'Administrative-Cancel',
        ])
        .eq('environment', process.env.NEXT_PUBLIC_ENVIRONMENT)
        // .or(`assigned_provider.eq.${providerId}, assigned_provider.is.${null}`) //temporarily disabled because maylin cannot see.
        .order('created_at', { ascending: false });

    if (error) return { error: error, data: null };

    return { data: data, error: null };
}

export async function getAllOrdersForProviderOrderTablev2() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        // 'get_all_orders_for_provider_dashboard',
        'get_all_orders_for_provider_overview_v2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) return { error: error, data: null };

    if (error) return { error: error, data: null };
    return { data: data, error: null };
}

export async function getLeadProviderOrders() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_lead_provider_orders', {
        environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });

    if (error) return { error: error, data: null };

    if (error) return { error: error, data: null };
    return { data: data, error: null };
}

export async function getNextOrderForTaskQueue(
    licensed_states: USStates[],
    environment_override: boolean = false,
    assigned_provider: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_next_intake_for_task_queue_and_assign',
        {
            environment_: environment_override
                ? 'dev'
                : process.env.NEXT_PUBLIC_ENVIRONMENT,
            licensed_states_: licensed_states,
            provider_id_: assigned_provider,
        }
    );

    if (error) {
        console.error(
            'Controller Error. tablename: orders, method: getNextOrderForTaskQueue, error: ',
            error
        );
    }

    return { data: data[0] as TaskOrderObject, error: null };
}

export async function getAllOrdersForTaskQueue(licensed_states: USStates[]) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_orders_for_task_queue_v2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
            licensed_states_: licensed_states,
        }
    );

    if (error) return { error: error, data: null };

    if (error) return { error: error, data: null };
    return { data: data, error: null };
}

export async function getAllTaskQueueTotaOrderCount() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('count_orders_for_task_queue', {
        environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        licensed_states_: [
            'AL',
            'AK',
            'AZ',
            'AR',
            'CA',
            'CO',
            'CT',
            'DE',
            'FL',
            'GA',
            'HI',
            'ID',
            'IL',
            'IN',
            'IA',
            'KS',
            'KY',
            'LA',
            'ME',
            'MD',
            'MA',
            'MI',
            'MN',
            'MS',
            'MO',
            'MT',
            'NE',
            'NV',
            'NH',
            'NJ',
            'NM',
            'NY',
            'NC',
            'ND',
            'OH',
            'OK',
            'OR',
            'PA',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VT',
            'VA',
            'WA',
            'WV',
            'WI',
            'WY',
        ],
    });

    if (error) return { error: error, data: null };

    if (error) return { error: error, data: null };
    return { data: data, error: null };
}

export async function getCurrentAssignedDosageForOrder(
    order_id: number
): Promise<string> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('assigned_dosage')
        .eq('id', order_id)
        .limit(1)
        .maybeSingle();

    if (data?.assigned_dosage) {
        return data?.assigned_dosage;
    }

    return '';
}

export async function getSafeGuardProviderId(original_order_id: string) {
    const order = await getBaseOrderById(Number(original_order_id));

    if (!order || (order && !order.assigned_provider)) {
        return providerInfoMeylinC.uuid;
    }

    return order.assigned_provider;
}

export async function getAssignedOrdersForProviderOrderTable(
    providerId: string
) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase.rpc(
        'get_assigned_orders_for_provider_overview',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
            provider_id_: providerId,
        }
    );

    if (error) {
        console.error('error', error);
        return { error: error, data: null };
    }

    return { data: data, error: null };
}

export async function fetchOrderDataByTaskId(
    taskId: string
): Promise<OrderData> {
    const supabase = createSupabaseServiceClient();

    let { data: coordinator_task, error } = await supabase
        .from('coordinator_tasks')
        .select('*')
        .eq('id', Number(taskId))
        .limit(1)
        .single();

    if (error) {
        return {
            type: OrderType.Invalid,
            data: {},
        };
    }

    const orderId = coordinator_task.order_id;

    const orderType = await getOrderType(orderId);

    switch (orderType) {
        case OrderType.Order:
            const order = await getOrderById(orderId);
            return {
                type: OrderType.Order,
                data: order.data,
            };
        case OrderType.RenewalOrder:
            return {
                type: OrderType.RenewalOrder,
                data: await getRenewalOrderForPatientIntake(orderId),
            };
        default:
            return {
                type: OrderType.Invalid,
                data: {},
            };
    }
}

export async function fetchOrderData(orderId: string): Promise<OrderData> {
    const orderType = await getOrderType(orderId);

    switch (orderType) {
        case OrderType.Order:
            const order = await getOrderById(orderId);
            return {
                type: OrderType.Order,
                data: order.data,
            };
        case OrderType.RenewalOrder:
            return {
                type: OrderType.RenewalOrder,
                data: await getRenewalOrderForPatientIntake(orderId),
            };
        default:
            return {
                type: OrderType.Invalid,
                data: {},
            };
    }
}

export async function getOrdersWithAssignedProvider(provider_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            '*, patient:profiles!customer_uid(first_name, last_name, date_of_birth)'
        )
        .eq('assigned_provider', provider_id);

    if (error) {
        console.log(error);
        return null;
    }

    return data;
}

export async function getAllOrdersForPatient(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('product_href, question_set_version, created_at')
        .eq('customer_uid', patient_id);

    if (error) {
        console.error(
            'getAllOrdersForPatient error for patient ID: ',
            patient_id,
            'error: ',
            error
        );
    }

    const uniqueArray = _.uniqBy(data, 'product_href');

    return uniqueArray;
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @returns - a single record matching the order ID, with all columns and the patient's information and product's name.
 */
export const getOrderById = async (orderId: string) => {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
          *,
          patient:profiles!customer_uid (
            first_name,
            last_name
          ),
          product:products!product_href (
            name
          ),
          provider:providers!assigned_provider (
            name
          ),
          subscription:prescription_subscriptions!subscription_id (
            status,
            stripe_subscription_id
          )`
        )
        .eq('id', orderId)
        .single();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getOrderById, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
};

export const getOrderDetailsById = async (orderId: number) => {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getOrderDetailsById, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: data, error: null };
};

export const checkIsRenewalOrder = async (orderId: number) => {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('original_order_id', orderId)
        .single();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getOrderDetailsById, error: ',
            error
        );
        return { data: null, error: error };
    }
    if (data) {
        return { data: true, error: error };
    }
    return { data: null, error: error };
};

// -----------------------------
// END READ FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Update
// -----------------------------

/**
 *
 * @author Nathan Cho
 * Best order update function for use.
 * @param orderId
 * @param updatedPayload
 * @returns
 */
export async function updateOrder(
    orderId: number,
    updatedPayload: Partial<OrdersSBR | any>
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .update(updatedPayload)
        .eq('id', orderId);

    if (error) {
        console.log('Error updating order', error, orderId, updatedPayload);
        return Status.Failure;
    }
    return Status.Success;
}

export async function updateOrderSubscriptionID(
    order_id: number | undefined,
    subscription_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { error: updateError } = await supabase
        .from('orders')
        .update({ subscription_id: subscription_id })
        .eq('id', order_id);

    if (updateError) {
        console.log(
            'Update order with subscription ID error: could not update. reason: ',
            updateError.message
        );
    }
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param updated_pharmacy - new pharmacy to assign. must be all lower case without spaces
 */
export async function updateAssignedPharmacyWithOrderId(
    orderId: string,
    updated_pharmacy: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const { error: updateError } = await supabase
        .from('orders')
        .update({ assigned_pharmacy: updated_pharmacy })
        .eq('id', orderId);

    if (updateError) {
        console.log(
            'Controller Error. tablename: orders, method: updateAssignedPharmacyWithOrderId, error: ',
            updateError
        );
    }
}

/**
 *
 * @author Nathan Cho
 * @param orderId - order ID
 * @param orderUpdateMetadata - stripe metadata to update the order with.
 * @returns
 */
export async function updateOrderAfterCardDown(
    orderId: number,
    orderUpdateData: any,
    otherFields?: any
) {
    const supabase = await createSupabaseServerComponentClient();

    console.log('ORDER UPDATE DATA', orderUpdateData);
    console.log('OTHER FIELDS', otherFields);

    console.log('ALL UPDATED', {
        stripe_metadata: orderUpdateData,
        order_status: 'Unapproved-CardDown',
        submission_time: new Date(),
        ...(otherFields ? { ...otherFields } : {}),
    });

    const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({
            stripe_metadata: orderUpdateData,
            order_status: 'Unapproved-CardDown',
            submission_time: new Date(),
            ...(otherFields ? { ...otherFields } : {}),
        })
        .eq('id', orderId);

    if (updateError) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderAfterCardDown, error: ',
            updateError
        );
        return 'error';
    } else {
        return 'success';
    }
}

export async function addMetadataToRenewalOrder(
    renewalOrderId: string,
    updatedPayload: Partial<OrdersSBR | any>
) {
    const supabase = createSupabaseServiceClient();

    const { data: existingData, error: fetchError } = await supabase
        .from('renewal_orders')
        .select('metadata')
        .eq('renewal_order_id', renewalOrderId)
        .single();

    if (fetchError) {
        console.log(
            'Error fetching existing metadata',
            fetchError,
            renewalOrderId
        );
        return Status.Failure;
    }

    const existingMetadata = existingData?.metadata || {};

    // Merge new metadata with the existing one
    const mergedMetadata = { ...existingMetadata, ...updatedPayload.metadata };

    const { data, error } = await supabase
        .from('renewal_orders')
        .update({ metadata: mergedMetadata })
        .eq('id', renewalOrderId);

    if (error) {
        console.log(
            'Error updating order',
            error,
            renewalOrderId,
            updatedPayload
        );
        return Status.Failure;
    }
    return Status.Success;
}

export async function addMetadataToOrder(
    orderId: string,
    updatedPayload: Partial<OrdersSBR | any>
) {
    const supabase = createSupabaseServiceClient();

    const { data: existingData, error: fetchError } = await supabase
        .from('orders')
        .select('metadata')
        .eq('id', orderId)
        .single();

    if (fetchError) {
        console.log('Error fetching existing metadata', fetchError, orderId);
        return Status.Failure;
    }

    const existingMetadata = existingData?.metadata || {};

    // Merge new metadata with the existing one
    const mergedMetadata = { ...existingMetadata, ...updatedPayload.metadata };

    const { data, error } = await supabase
        .from('orders')
        .update({ metadata: mergedMetadata })
        .eq('id', orderId);

    if (error) {
        console.log('Error updating order', error, orderId, updatedPayload);
        return Status.Failure;
    }
    return Status.Success;
}

export async function updateOrderAssignedDosage(
    order_id: string | number,
    new_dosage: string
) {
    if (typeof order_id === 'string' && order_id.includes('-')) {
        order_id = order_id.split('-')[0];
    }

    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('orders')
        .update({ assigned_dosage: new_dosage })
        .eq('id', order_id);

    if (error) {
        console.error('updateOrderAssignedDosage, error: ', error);
    }

    return;
}

export async function updateShippingStatusByEasyPostTrackingID(
    easypost_tracking_id: string,
    shippingStatus: ShippingStatus
) {
    const supabase = createSupabaseServiceClient();

    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('easypost_tracking_id', easypost_tracking_id)
        .maybeSingle();

    if (orderError) {
        console.error(
            'Error retreiving order by easypost tracking id',
            orderError
        );
        return;
    }

    if (!orderData || orderData == null) {
        // That means the order is in renewal_orders
        const { data: orderRenewalData, error: orderRenewalError } =
            await supabase
                .from('renewal_orders')
                .select('id')
                .eq('easypost_tracking_id', easypost_tracking_id)
                .maybeSingle();

        if (orderRenewalError) {
            console.error(
                'Error retreiving order renewal by easypost tracking id',
                orderError,
                easypost_tracking_id
            );
            return;
        }

        // If unable to find here, we have an issue
        if (!orderRenewalData || orderRenewalData == null) {
            console.error(
                'Could not find order from easypost tracking id',
                easypost_tracking_id,
                orderError
            );
            auditShippingTrackingFailed(
                easypost_tracking_id,
                'Could not find order from easypost tracking id',
                JSON.stringify({ orderError, orderRenewalError }),
                ''
            );
            return;
        }

        updateShippingStatusForOrder(
            'renewal_orders',
            orderRenewalData.id,
            shippingStatus
        );
    } else {
        updateShippingStatusForOrder('orders', orderData.id, shippingStatus);
    }
}

export async function updateShippingStatusForOrder(
    table: string,
    id: string,
    shippingStatus: string
) {
    const supabase = createSupabaseServiceClient();

    const order_status =
        table === 'orders'
            ? OrderStatus.ApprovedCardDownFinalized
            : RenewalOrderStatus.PharmacyProcessing;

    const { data, error } = await supabase
        .from(table)
        .update({ shipping_status: shippingStatus, order_status })
        .eq('id', id);

    if (error) {
        console.error(
            'Error updating shipping status for',
            table,
            id,
            shippingStatus,
            error
        );
        throw new Error('Could not update shipping status for order');
    }
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param shippingStatus - status to update.
 * @returns
 */

// TODO: Deprecate all of this. No need to update shipping status nor we do need external tracking metadata with easypost now
export async function updateOrderShippingStatusAndExternalMetadata(
    orderId: number | string,
    shippingStatus: string,
    externalMetadata: any,
    renewal: boolean = false
) {
    const supabase = createSupabaseServiceClient();

    const { data: originalMetadata, error: originalError } = await supabase
        .from(renewal ? 'renewal_orders' : 'orders')
        .select('external_tracking_metadata')
        .eq(renewal ? 'renewal_order_id' : 'id', orderId)
        .single();

    if (originalError) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderShippingStatusAndExternalMetadata, error: ',
            originalError
        );
        return { data: null, error: originalError };
    }

    const { data: fetchedData, error } = await supabase
        .from(renewal ? 'renewal_orders' : 'orders')
        .update({
            // shipping_status: shippingStatus,
            external_tracking_metadata: originalMetadata
                ? {
                      ...originalMetadata.external_tracking_metadata,
                      ...externalMetadata,
                  }
                : externalMetadata,
        })
        .eq(renewal ? 'renewal_order_id' : 'id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderShippingStatusAndExternalMetadata, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param shippingStatus - status to update.
 * @returns
 */
export async function updateOrderExternalMetadata(
    orderId: number,
    externalMetadata: any
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: originalMetadata, error: originalError } = await supabase
        .from('orders')
        .select('external_tracking_metadata')
        .eq('id', orderId)
        .limit(1)
        .maybeSingle();

    if (originalError) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderExternalMetadata, error: ',
            originalError
        );
        return { data: null, error: originalError };
    }

    const updatePayload = originalMetadata
        ? {
              ...originalMetadata.external_tracking_metadata,
              ...externalMetadata,
          }
        : { ...externalMetadata };

    if (updatePayload.external_tracking_metadata === null) {
        delete updatePayload.external_tracking_metadata;
    }

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({ external_tracking_metadata: updatePayload })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderExternalMetadata, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param trackingNumber - tracking #
 * @param renewal boolean value if this is a renewal or not. Normally set to false. Accesses a different table if renewal is true.
 * @returns
 */
export async function updateOrderTrackingNumber(
    orderId: string | number,
    trackingNumber: string,
    renewal: boolean = false
) {
    const supabase = createSupabaseServiceClient();

    const { data: fetchedData, error } = await supabase
        .from(renewal ? 'renewal_orders' : 'orders')
        .update({
            tracking_number: trackingNumber,
        })
        .eq(renewal ? 'renewal_order_id' : 'id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderTrackingNumber, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param shippingStatus - status to update.
 * @returns
 */
export async function updateTMCOrderMetadata(
    orderId: number,
    TMCOrderId: number
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            external_tracking_metadata: { tmc_order_id: TMCOrderId },
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateTMCOrderMetadata, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function updateGGMOrderMetadata(
    orderId: number,
    GGMOrderId: number
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            external_tracking_metadata: { ggm_order_id: GGMOrderId },
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateTMCOrderMetadata, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId - order ID int
 * @param updateStatus - status to update to. Must match enumeration in DB
 * @param pharmacy - text for pharmacy to update to. Must be a pharmacy we have partnership with. [curexa, ggm, tmc, empower]
 * @returns data after updating.
 * @description This function is used when confirming the order as a provider to bind a pharmacy to the order.
 */
export async function updateExistingOrderStatusAndPharmacyUsingId(
    orderId: number | string,
    updateStatus: string,
    pharmacy: string,
    orderType: OrderType
) {
    const supabase = await createSupabaseServiceClient();

    if (orderType === OrderType.Order) {
        const { data: fetchedData, error } = await supabase
            .from('orders')
            .update({
                order_status: updateStatus,
                assigned_pharmacy: pharmacy,
                approval_denial_timestamp: new Date(),
            })
            .eq('id', orderId)
            .select();

        if (error) {
            console.log(
                'Controller Error. tablename: orders, method: updateExistingOrderStatusAndPharmacyUsingId, error: ',
                error
            );

            return { data: null, error: error };
        }

        return { data: fetchedData, error: null };
    } else if (orderType === OrderType.RenewalOrder) {
        const { data: fetchedData, error } = await supabase
            .from('renewal_orders')
            .update({
                order_status: updateStatus,
                assigned_pharmacy: pharmacy,
                approval_denial_timestamp: new Date(),
            })
            .eq('renewal_order_id', orderId)
            .select();

        if (error) {
            console.log(
                'Controller Error. tablename: orders, method: updateExistingOrderStatusAndPharmacyUsingId, error: (Renewal Order)',
                error
            );

            return { data: null, error: error };
        }

        return { data: fetchedData, error: null };
    }
}

export async function updateExistingOrderPharmacyUsingId(
    orderId: number | string,
    pharmacy: string
) {
    const supabase = await createSupabaseServiceClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            assigned_pharmacy: pharmacy,
            approval_denial_timestamp: new Date(),
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateExistingOrderStatusAndPharmacyUsingId, error: ',
            error
        );

        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function updateExistingOrderPharmacyAndVariantIndexUsingId(
    orderId: number | string,
    pharmacy: string,
    variant_index: number
) {
    const supabase = await createSupabaseServiceClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            assigned_pharmacy: pharmacy,
            approval_denial_timestamp: new Date(),
            variant_index: variant_index,
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateExistingOrderStatusAndPharmacyUsingId, error: ',
            error
        );

        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function getAllOrdersForCoordinatorOrderTable() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_orders_for_coordinator_dashboardv2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) return { error: error, data: null };

    return { data: data, error: null };
}

export async function getAllLeadCoordinatorOrders() {
    const supabase = createSupabaseServiceClient();

    const { data: lead_coordinator_orders, error: lead_errors } =
        await supabase.rpc('get_all_orders_for_status_tag_v2', {
            lookup_status_tag: 'LeadCoordinator',
        });

    const { data: coordinator_new_order_tag_orders, error: new_order_errors } =
        await supabase.rpc('get_all_orders_for_status_tag_v2', {
            lookup_status_tag: 'CoordinatorCreateOrder',
        });

    if (lead_errors || new_order_errors) {
        console.error(
            'getAllLeadCoordinatorOrders',
            lead_errors ?? new_order_errors
        );
        return null;
    }

    const list = concat(
        lead_coordinator_orders,
        coordinator_new_order_tag_orders
    );

    return list;
}

export async function removeAssignedProviderForProviderAssignedQueue(
    provider_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.rpc('unassign_provider_orders', {
        p_environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        p_uuid: provider_id,
    });

    if (error) {
        console.error(
            'removeAssignedProviderForProviderAssignedQueue: ',
            error
        );
    }

    return { error: null };
}

export async function getAllOrdersForCoordinatorOrderTablev2() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_orders_for_coordinator_dashboardv2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) return { error: error, data: null };

    return { data: data, error: null };
}

export async function getAllOrdersForAdminTable(
    startDate?: Date,
    endDate?: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('getallordersadmintable', {
        environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });

    if (error) {
        console.log(error);
        return { error: error, data: null };
    }

    let filteredData = data;

    if (startDate && endDate) {
        filteredData = data.filter((order: any) => {
            const orderDate = new Date(order.created_at);
            const isWithinRange =
                orderDate >= (startDate ?? new Date('01-01-2024')) &&
                orderDate <= (endDate ?? new Date());
            return isWithinRange;
        });
    }

    return { data: filteredData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId
 * @description adds the discount to the order using the orderID
 * Fetches the variant index and href and finds the appropriate coupon and applies it.
 */

export async function updateOrderDiscount(orderId: number) {
    const supabase = createSupabaseServerComponentClient();

    const { data: fetchedOrderData, error: orderError } = await supabase
        .from('orders')
        .select('variant_index, subscription_type, discount_id, product_href')
        .eq('id', orderId)
        .single();

    if (orderError) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderDiscount, cause: order fetch error: ',
            orderError
        );
        console.log(orderId);
        return;
    }

    const couponTable =
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
            ? 'stripe_product_coupon_pairs'
            : 'stripe_product_coupon_pairs_production';

    const { data: couponId, error: couponFetchError } = await supabase
        .from(couponTable)
        .select('coupon_id')
        .eq('product_href', fetchedOrderData.product_href)
        .eq('variant_index', fetchedOrderData.variant_index)
        .eq('cadence', fetchedOrderData.subscription_type)
        .maybeSingle();

    if (couponFetchError || !couponId) {
        const { error } = await supabase
            .from('orders')
            .update({ discount_id: [] })
            .eq('id', orderId);
        return;
    }

    const { error } = await supabase
        .from('orders')
        .update({ discount_id: [couponId.coupon_id] })
        .eq('id', orderId);
    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderDiscount, cause: update failure, error: ',
            error
        );
        return;
    }
    return;
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param updateStatus - status to update. Must match enum in supabase.
 * @returns
 */
export async function updateExistingOrderStatusUsingId(
    orderId: number,
    updateStatus: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            order_status: updateStatus,
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateExistingOrderStatusUsingId, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * This function is poorly named but I'm so tired please let me be :(
 * AfterPaymentFailure is supposed to mean "AfterPaymentFailureLoopSuccessfulExecution." So this function executes after the failure loop resolves a patient.
 * @param orderId - order ID
 * @param updateStatus - status to update. Must match enum in supabase.
 * @returns
 */
export async function updateExistingOrderStatusUsingIdAfterPaymentFailure(
    orderId: number,
    updateStatus: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            order_status: updateStatus,
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateExistingOrderStatusUsingId, error: ',
            error
        );
        return { data: null, error: error };
    }

    const { error: updateError } = await supabase
        .from('payment_failure_tracker')
        .update({ status: 'resolved' })
        .eq('order_id', orderId);

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param updateStatus - status to update. Must match enum in supabase.
 * @returns
 */
export async function updateExistingOrderStatusAndExternalMetadataUsingId(
    orderId: number,
    updateStatus: string,
    externalMetadata: any
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: originalMetadata, error: originalError } = await supabase
        .from('orders')
        .select('external_tracking_metadata')
        .eq('id', orderId)
        .single();

    if (originalError) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderShippingStatusAndExternalMetadata, error: ',
            originalError
        );
        return { data: null, error: originalError };
    }

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            order_status: updateStatus,
            external_tracking_metadata: originalMetadata
                ? { ...originalMetadata, ...externalMetadata }
                : externalMetadata,
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateExistingOrderStatusUsingId, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

/**
 * @author Nathan Cho
 * @param orderId - order ID
 * @param shippingStatus - status to update.
 * @returns
 */
export async function updateOrderShippingStatus(
    orderId: number,
    shippingStatus: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            shipping_status: shippingStatus,
        })
        .eq('id', orderId)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: updateOrderShippingStatus, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function updateStripeMetadataForOrder(
    order_id: string,
    stripe_metadata: any
) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('orders')
        .update({ stripe_metadata: stripe_metadata })
        .eq('id', order_id);
}

export async function addEasyPostTrackingIDToOrder(
    order_id: string,
    tracking_id: string,
    pharmacy: string
) {
    function countHyphens(str: string) {
        const matches = str.match(/-/g);
        return matches ? matches.length : 0;
    }
    const supabase = createSupabaseServiceClient();

    const numHyphens = countHyphens(order_id);

    // No hyphen - update in orders table
    // 1 hyphen and gogo - update in orders table
    if (
        numHyphens === 0 ||
        (numHyphens === 1 && pharmacy === EASYPOST_PHARMACIES.GOGO_MEDS)
    ) {
        const { data, error } = await supabase
            .from('orders')
            .update({
                easypost_tracking_id: tracking_id,
                shipping_status: ShippingStatus.Shipped,
            })
            .eq('id', order_id)
            .select()
            .maybeSingle();

        if (error) {
            console.error(error, error.message);
            console.log('TRIGGERED???');
            console.error(
                `Failed to add easypost tracking id for order ${order_id}`,
                data
            );
            auditShippingTrackingFailed(
                order_id,
                `Failed to add easypost tracking id for order ${order_id}`,
                error,
                pharmacy
            );
            throw error;
        }
        return { success: Status.Success, data };
        // Contains 1 hypen and not gogo: order_renewals)
        // Contains 2 hyphens: order_renewals
    } else if (
        (numHyphens === 1 && pharmacy !== EASYPOST_PHARMACIES.GOGO_MEDS) ||
        numHyphens === 2
    ) {
        const { data, error } = await supabase
            .from('renewal_orders')
            .update({
                easypost_tracking_id: tracking_id,
                shipping_status: ShippingStatus.Shipped,
            })
            .eq('renewal_order_id', order_id)
            .select()
            .maybeSingle();

        if (error) {
            console.error(error, error.message);
            console.error(
                `Failed to add easypost tracking id for order ${order_id}`,
                data
            );
            auditShippingTrackingFailed(
                order_id,
                `Failed to add easypost tracking id for order ${order_id}`,
                error,
                pharmacy
            );

            throw error;
        }
        return { success: Status.Success, data };
    } else {
        auditShippingTrackingFailed(
            order_id,
            `Failed to add easypost tracking id for order ${order_id}`,
            'Something weird happened',
            pharmacy
        );
        return { success: Status.Failure, data: {} };
    }
}

export async function updateOrderShippingInformation(
    data: ShippingInformation,
    order_id: number,
    userId: string
) {
    if (order_id === -1) {
        console.error(
            'Could not update order shipping information - no order id found'
        );
        return false;
    }
    const supabase = createSupabaseServiceClient();

    const { data: orderUpdateData, error: orderUpdateError } = await supabase
        .from('orders')
        .update({
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city: data.city,
            state: data.state,
            zip: data.zip,
        })
        .eq('id', order_id);

    const latestRenewalOrder = await getLatestRenewalOrderForOriginalOrderId(
        String(order_id)
    );

    if (!latestRenewalOrder) {
        return true;
    }

    await updateRenewalOrder(latestRenewalOrder.id, {
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        zip: data.zip,
    });

    //check if we need to update the address in Revive as well, then do so if necessary
    await changePatientAddressInReviveIfNecessary(
        userId,
        {
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city: data.city,
            state: data.state,
            zip: data.zip,
        },
        order_id.toString()
    );

    if (orderUpdateError) {
        console.log(
            'Controller tablename: orders, method: updateOrderShippingInformation, Error: ',
            orderUpdateError
        );
        return false;
    }

    return true;
}

/**
 * @author Nathan Cho
 * @param pharmacy_script IMPORTANT: Must be JSON, not stringified.
 * @param order_id
 * @returns
 */
export async function updateOrderPharmacyScript(
    pharmacy_script: any,
    order_id: string | number
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .update({ pharmacy_script: pharmacy_script })
        .eq('id', order_id)
        .select();

    if (error) {
        console.error(
            'updateOrderPharmacyScript ',
            `pharmacy_script: ${pharmacy_script}`,
            `order_id: ${order_id}`,
            error,
            error.message
        );
        return null;
    }

    return data;
}

export async function updateOrderPharmacyDisplayName(
    pharmacy_script: any,
    order_id: string | number
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .update({ pharmacy_display_name: pharmacy_script['DisplayName'] })
        .eq('id', order_id)
        .select();

    if (error) {
        console.error(
            'updateOrderPharmacyDisplayName ',
            `pharmacy_script: ${pharmacy_script}`,
            `order_id: ${order_id}`,
            error,
            error.message
        );
        return null;
    }

    return data;
}

/**
 * Fetches the most recent single order for a product & patient
 * @param patient_id
 * @param product_href
 * @returns
 */
export async function getOrderByCustomerIdAndProductHref(
    patient_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_uid', patient_id)
        .eq('product_href', product_href)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.log(error);
        return null;
    }

    return data as BaseOrderInterface;
}

/**
 * Takes in an object and spreads it into the metadata
 * @param new_metadata
 * @param order_id
 */
export async function updateOrderMetadata(
    new_metadata: any,
    order_id: number | string
) {
    const supabase = createSupabaseServiceClient();

    const { data: current_metadata, error: current_error } = await supabase
        .from('orders')
        .select('metadata')
        .eq('id', order_id)
        .limit(1)
        .maybeSingle();

    if (current_error) {
        console.log('Error in updating order metadata. ', current_error);
    }

    const { error } = await supabase
        .from('orders')
        .update({
            metadata: { ...current_metadata?.metadata, ...new_metadata },
        })
        .eq('id', order_id);

    console.log('update metadata error ', error);
}

// -----------------------------
// END UPDATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Delete
// -----------------------------

// -----------------------------
// END DELETE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
