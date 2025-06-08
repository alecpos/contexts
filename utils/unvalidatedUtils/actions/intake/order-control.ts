'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';
import { createSetupIntentServer } from '../../../services/stripe/setupIntent';
import { isEmpty } from 'lodash';

export async function createNewOrder(
    sessionData: any,
    productData: any,
    priceData: any
) {
    const setupIntent = JSON.parse(await createSetupIntentServer());

    if (!setupIntent) {
        console.log('error in creating setup intent');
        return { order: null, error: 'error in creating setup intent.' };
    }

    const order: Order = {
        customer_uid: sessionData?.user.id,
        product_href: productData.productName,
        variant_index: productData.variant,
        variant_text: productData.variantText,
        subscription_type: productData.subscriptionType,
        price: priceData[productData.variant][productData.subscriptionType]
            .product_price,
        price_id:
            priceData[productData.variant][productData.subscriptionType]
                .stripe_price_id,
        order_status: 'Incomplete',
        stripe_metadata: {
            setupIntentId: setupIntent.id,
            clientSecret: setupIntent.client_secret!,
            paymentMethodId: '',
        },
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'dev',
    };

    const supabase = await createSupabaseServerComponentClient();

    const { data: newlyCreatedOrder, error } = await supabase
        .from('orders')
        .insert([
            {
                customer_uid: order.customer_uid,
                product_href: order.product_href,
                variant_index: order.variant_index,
                variant_text: order.variant_text,
                subscription_type: order.subscription_type,
                price: order.price,
                order_status: order.order_status,
                rx_questionnaire_answers: order.rxQuestionnaireAnswers,
                stripe_metadata: order.stripe_metadata,
                price_id: order.price_id,
                environment: order.environment,
            },
        ])
        .select('id');

    if (error) return { order: null, error: error };

    const updatedOrder = {
        ...order,
        orderId: newlyCreatedOrder[0].id,
    };

    return { order: updatedOrder, error: null };
}

export async function getUserIDForOrder(orderID: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('customer_uid')
        .eq('id', orderID)
        .maybeSingle();
    if (error) {
        console.error(
            'Error fetching product from orders with order id',
            error,
            orderID
        );
    }

    if (!isEmpty(data)) {
        // Order is valid
        return data.customer_uid;
    }

    const { data: renewalOrders, error: renewalOrdersError } = await supabase
        .from('renewal_orders')
        .select('customer_uuid')
        .eq('renewal_order_id', orderID)
        .maybeSingle();

    if (renewalOrdersError) {
        console.error(
            'Error fetching customer_id from renewal_orders with order id',
            error,
            orderID
        );
    }
    if (!isEmpty(renewalOrders)) {
        return renewalOrders.customer_uuid;
    }
    console.error('Unknown customer_id for order_id', orderID);
    return null;
}

export async function updateExistingOrderStatus(
    orderId: string | number,
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
            'order-control.ts | updateExistingOrderStatus: There was an error in fetching data from the server' +
                error.message
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function setOrderProvider(orderId: number, providerId: string) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .update({
            assigned_provider: providerId,
        })
        .eq('id', Number(orderId));

    if (error) {
        console.log(
            'order-control.ts | updateExistingOrderStatus: There was an error in fetching data from the server' +
                error.message
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function checkForExistingOrder(
    userUid: string,
    productHref: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: fetchedData, error } = await supabase
        .from('orders')
        .select(
            'id, stripe_metadata, order_status, variant_index, subscription_type'
        )
        .eq('customer_uid', userUid)
        .eq('product_href', productHref)
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

export async function getAllOrderDataById(orderId: string | number) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `*,
        product:products!product_href(
            name
        ), 
        customer:profiles!customer_uid (
            first_name,
            last_name,
            stripe_customer_id,
            address_line1,
            address_line2,
            city,
            state,
            zip,
            phone_number
        )
      `
        )
        .eq('id', orderId as string)
        .single();

    if (error) return { data: null, error: error };

    return { data: data, error: null };
}
