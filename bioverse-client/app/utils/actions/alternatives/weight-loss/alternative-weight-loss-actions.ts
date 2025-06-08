'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { readUserSession } from '../../auth/session-reader';
import { Status } from '@/app/types/global/global-enumerators';
import {
    ServerSideOrderData,
    ServerSideProfileData,
    ServerSideStripeData,
    VERIFY_ORDER_DATA_CODES,
} from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { isEmpty } from 'lodash';
import {
    fetchDefaultCardForCustomer,
    listCustomerPaymentMethods,
} from '@/app/services/stripe/customer';
import {
    fetchOrderData,
    insertNewManualOrder,
    updateOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getPatientInformationById } from '../../provider/patient-overview';
import { generateEmpowerScript } from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';
import processEmpowerScript from '@/app/services/pharmacy-integration/empower/provider-script-feedback';

export async function verifyAlternativeRequiredOrderData(
    orderId: string | number
): Promise<{
    status: Status;
    data: {
        code: VERIFY_ORDER_DATA_CODES;
        order_data: ServerSideOrderData | null;
    };
}> {
    const supabase = createSupabaseServiceClient();
    const userId = (await readUserSession()).data.session?.user.id;

    const { data: order_data, error } = await supabase
        .from('orders')
        .select(
            'id, customer_uid, order_status, product_href, assigned_provider, metadata'
        )
        .eq('id', orderId)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'verifyOrderData issue, orderId - ',
            orderId,
            ' user ID - ',
            userId,
            'error message - ',
            error
        );

        return {
            status: Status.Error,
            data: {
                code: VERIFY_ORDER_DATA_CODES.NO_ORDER,
                order_data: null,
            },
        };
    }

    if (!order_data) {
        return {
            status: Status.Failure,
            data: { code: VERIFY_ORDER_DATA_CODES.NO_ORDER, order_data: null },
        };
    }

    if (order_data.customer_uid != userId) {
        return {
            status: Status.Failure,
            data: { code: VERIFY_ORDER_DATA_CODES.NO_ORDER, order_data: null },
        };
    }

    const alternative_options = order_data.metadata?.alternative_options ?? [];

    //We need the status to be Denied-CardDown to make sure this order went through the recommendation flow.
    if (
        order_data.order_status !== 'Denied-CardDown' ||
        isEmpty(alternative_options)
    ) {
        return {
            status: Status.Failure,
            data: {
                code: VERIFY_ORDER_DATA_CODES.NOT_ELIGIBLE,
                order_data: null,
            },
        };
    }

    return {
        status: Status.Success,
        data: {
            code: VERIFY_ORDER_DATA_CODES.SUCCESS,
            order_data: order_data as ServerSideOrderData,
        },
    };
}

interface AlternativeProductPriceMap {
    //product href : Object
    [key: string]: {
        //cadence : price ID
        [key: string]: {
            [key: string]: string;
        };
    };
}

const ALTERNATIVE_PRODUCT_PRICE_MAPPING: AlternativeProductPriceMap = {
    metformin: {
        quarterly: {
            dev: 'price_1OpOdEDyFtOu3ZuTLLJw84kc',
            prod: '',
        },
    },
    'wl-capsule': {
        monthly: {
            dev: 'price_1Pn6QfDyFtOu3ZuTimKDfyXP',
            prod: 'price_1Q0rIqDyFtOu3ZuTYGdCFJGS',
        },
        quarterly: {
            dev: 'price_1Pn6QsDyFtOu3ZuTnsVelapz',
            prod: 'price_1Pn6RbDyFtOu3ZuTtHibjApC',
        },
    },
};

const ALTERNATIVE_PRODUCT_DISCOUNT_MAPPING: AlternativeProductPriceMap = {
    metformin: {
        quarterly: {
            dev: 'price_1Of4BfDyFtOu3ZuTq2yPrZAi',
            prod: 'price_1OpOdEDyFtOu3ZuTLLJw84kc',
        },
    },
    'wl-capsule': {
        monthly: {
            dev: 'price_1Pn6QfDyFtOu3ZuTimKDfyXP',
            prod: 'price_1Q0rIqDyFtOu3ZuTYGdCFJGS',
        },
        quarterly: {
            dev: 'price_1Pn6QsDyFtOu3ZuTnsVelapz',
            prod: 'price_1Pn6RbDyFtOu3ZuTtHibjApC',
        },
    },
};

export async function collectInformationToCreateAlternativeOrder(
    order_data: ServerSideOrderData
) {
    const supabase = createSupabaseServiceClient();

    const price_ID =
        ALTERNATIVE_PRODUCT_PRICE_MAPPING[
            order_data.metadata.selected_alternative_product
        ][order_data.metadata.selected_alternative_cadence][
            process.env.NEXT_PUBLIC_ENVIRONMENT!
        ];
    const coupon_ID =
        ALTERNATIVE_PRODUCT_DISCOUNT_MAPPING[
            order_data.metadata.selected_alternative_product
        ][order_data.metadata.selected_alternative_cadence][
            process.env.NEXT_PUBLIC_ENVIRONMENT!
        ];

    const { data: profile_data, error: profile_table_error } = await supabase
        .from('profiles')
        .select(
            'first_name, last_name, stripe_customer_id, address_line1, address_line2, city, state, zip'
        )
        .eq('id', order_data.customer_uid)
        .limit(1)
        .single();

    if (profile_table_error) {
        console.error(
            'collectInformationToCreateAlternativeOrder error ',
            profile_table_error
        );
        return;
    }

    const stripePaymentMethodData = await fetchDefaultCardForCustomer(
        order_data.customer_uid
    );

    return {
        profileData: profile_data as ServerSideProfileData,

        stripeData: {
            priceId: price_ID,
            couponId: coupon_ID,
            customerDefaultPaymentMethodId:
                stripePaymentMethodData.defaultPaymentMethodId,
        } as ServerSideStripeData,
    };
}

export async function confirmAlternativeOrder(
    profile_data: ServerSideProfileData,
    order_data: ServerSideOrderData,
    stripe_data: ServerSideStripeData
) {
    if (order_data.order_status !== 'Denied-CardDown') {
        console.error(
            'collectInformationToCreateAlternativeOrder was given an order - ',
            order_data.id,
            'which was in a status - ',
            order_data.order_status
        );
        return Status.Failure;
    }

    const product_href = order_data.metadata.selected_alternative_product;
    const cadence = order_data.metadata.selected_alternative_cadence;
    let pharmacy: string;
    if ((product_href as PRODUCT_HREF) === PRODUCT_HREF.WL_CAPSULE) {
        pharmacy = 'empower';
    } else pharmacy = 'curexa';

    const getVariant = (): number => {
        if (product_href === 'metformin') {
            return 0;
        } else {
            if (cadence === 'monthly') {
                return 0;
            } else return 1;
        }
    };

    const getVariantText = (): string => {
        if (product_href === 'metformin') {
            return '90 doses';
        } else {
            if (cadence === 'monthly') {
                return '30 capsules';
            } else {
                return '90 capsules';
            }
        }
    };

    const newOrder: OrdersSBR = {
        customer_uid: order_data.customer_uid,
        variant_index: getVariant(),
        variant_text: getVariantText(),
        subscription_type: order_data.metadata.selected_alternative_cadence,
        stripe_metadata: {
            clientSecret: '',
            setupIntentId: '',
            paymentMethodId: stripe_data.customerDefaultPaymentMethodId,
        },
        order_status: 'Unapproved-CardDown',
        product_href: order_data.metadata.selected_alternative_product,
        price_id: stripe_data.priceId,
        // discount_id: [stripe_data.couponId],
        // price_id: 'price_1Pn6QsDyFtOu3ZuTnsVelapz', not correct.
        discount_id: [],
        assigned_pharmacy: pharmacy,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        address_line1: profile_data.address_line1,
        address_line2: profile_data.address_line2,
        city: profile_data.city,
        state: profile_data.state,
        zip: profile_data.zip,
        source: 'alternative',
    };

    const new_order_data = await insertNewManualOrder(newOrder);

    if (product_href === PRODUCT_HREF.METFORMIN) {
        await createUserStatusTagWAction(
            StatusTag.Review,
            String(new_order_data.id),
            StatusTagAction.REPLACE,
            order_data.customer_uid,
            'Sending metformin order to review from alternative product flow.',
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            [StatusTag.Review]
        );

        await updateOrder(order_data.id, {
            order_status: 'Alternative-Confirmed',
        });

        return Status.Success;
    }

    if (product_href === PRODUCT_HREF.WL_CAPSULE) {
        try {
            const { type: orderType, data: fetchedOrderData } =
                await fetchOrderData(String(new_order_data.id));

            const { data: patientData, error: patientDataError } =
                await getPatientInformationById(order_data.customer_uid);

            const empowerScriptData = generateEmpowerScript(
                patientData!,
                fetchedOrderData,
                orderType,
                {
                    height_feet: 0,
                    height_inches: 0,
                    weight_lbs: 0,
                    bmi: 0,
                },
                fetchedOrderData.variant_index ??
                    fetchedOrderData.order.variant_index
            );

            const resp = await processEmpowerScript(
                fetchedOrderData.id,
                fetchedOrderData.order_status,
                fetchedOrderData.assigned_provider,
                empowerScriptData.script,
                orderType,
                fetchedOrderData.subscription_id
                    ? fetchedOrderData.subscription_id
                    : '',
                fetchedOrderData,
                fetchedOrderData.variant_index
            );

            await updateOrder(order_data.id, {
                order_status: 'Alternative-Confirmed',
            });
        } catch (error: any) {
            console.error(
                'try-catch error within confirmAlternativeOrder for WL Capsule Script processing. Order ID - ',
                new_order_data.id,
                'error message ',
                error
            );
        } finally {
            return Status.Success;
        }
    }

    return Status.Failure;
}
