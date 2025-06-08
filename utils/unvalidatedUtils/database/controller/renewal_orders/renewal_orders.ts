'use server';

import {
    Months,
    RenewalOrder,
    RenewalOrderCoordinatorOverview,
    RenewalOrderProviderOverview,
    RenewalOrderStatus,
    RenewalOrderTabs,
    SubmissionTimes,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { OrderItem } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import {
    getBaseOrderById,
    getFirstCompletedOrderCreatedDate,
    getOrderById,
    getOrderIdByPatientIdAndProductHref,
} from '../orders/orders-api';
import { insertAuditIntoAdministrativeCancelTable } from '../admin_order_cancel_audit/admin-order-cancel-audit';
import {
    getStripeSubscription,
    safeCancelSubscription,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { ORDER_CANCELED } from '@/app/services/customerio/event_names';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { Status } from '@/app/types/global/global-enumerators';
import { getFinalReviewStartsDate } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { getDaysBetweenDates } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/intake-helpers';
import { forwardOrderToEngineering } from '../patient-status-tags/patient-status-tags-api';
import { USStates } from '@/app/types/enums/master-enums';
import { isGLP1Product } from '@/app/utils/functions/pricing';
import {
    BaseOrderInterface,
    OrderStatus,
    OrderType,
} from '@/app/types/orders/order-types';
import { extractRenewalOrderId } from '@/app/utils/functions/client-utils';
import { getPriceDataRecordWithVariant } from '../product_variants/product_variants';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';

export default async function createNewRenewalOrder(
    new_order_id: string,
    order_data: any,
    subscription_data: any,
    prescription_json: any,
    tracking_metadata: any,
    shipping_data: any
) {
    const supabase = createSupabaseServiceClient();

    const renewal_order_values = {
        renewal_order_id: new_order_id,
        original_order_id: subscription_data.order_id,
        customer_uuid: order_data.customer_uid,
        prescription_json: prescription_json,
        assigned_pharmacy: subscription_data.assigned_pharmacy,
        external_tracking_metadata: tracking_metadata,
        subscription_type: order_data.subscription_type,
        product_href: order_data.product_href,
        address_line1: shipping_data.address_line1,
        address_line2: shipping_data.address_line2 ?? '',
        city: shipping_data.city,
        state: shipping_data.state,
        zip: shipping_data.zip,
        subscription_id: subscription_data.id,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        order_status: RenewalOrderStatus.PharmacyProcessing,
    };

    const { error } = await supabase
        .from('renewal_orders')
        .insert(renewal_order_values);

    return;
}

//HEADSUP Olivier I commented this because it wasn't written and throwing build errors.
// export async function createRenewalOrderForSubscriptionUpdate(baseOrder: any, userId: string) {
//     const supabase = createSupabaseServiceClient();

//     const payload = {
//         renewal_order_id: `${baseOrder.id}-1`,
//         original_order_id: baseOrder.id,
//         customer_uuid: userId,
//         subscription_type: baseOrder.subscription_type,
//         product_href: baseOrder.product_href,
//         subscription_id:
//     }
// }

export async function createRenewalOrderWithPayload(
    renewalOrderPayload: Partial<RenewalOrder>
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .insert(renewalOrderPayload)
        .select();

    if (error) {
        console.error(
            'Error inserting new renewal order with payload',
            renewalOrderPayload
        );
        return null;
    }

    return data[0] as RenewalOrder;
}

// Gets the latest renewal order for a subscription
export async function getRenewalOrderBySubscriptionId(
    subscription_id: number
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('subscription_id', subscription_id)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error getting renewal order by subscription_id',
            subscription_id
        );
        return null;
    }

    return data as RenewalOrder;
}

export async function getRenewalOrdersForTab(
    customer_id: string
): Promise<RenewalOrderTabs[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_renewal_orders_for_tab_v5',
        {
            _customer_id: customer_id,
        }
    );

    if (error) {
        console.error(
            'Error getting renewal orders for tab',
            error,
            customer_id
        );
        return [];
    }

    return data as RenewalOrderTabs[];
}

export async function createUpcomingRenewalOrderWithRenewalOrderId(
    renewal_order_id: string
) {
    const latestRenewalOrder = await getRenewalOrder(renewal_order_id);

    if (latestRenewalOrder) {
        await createUpcomingRenewalOrder(latestRenewalOrder);
    }
}

// Create next renewal order when prescription is sent to the pharmacy
export async function createUpcomingRenewalOrder(
    oldRenewalOrder: RenewalOrder
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    // Build new renewal_order_id
    const splitted_renewal_order_count = parseInt(
        oldRenewalOrder.renewal_order_id.split('-').at(-1) || '0'
    );

    if (splitted_renewal_order_count === 0) {
        console.error(
            'Error ocurred creating new renewal order',
            oldRenewalOrder
        );
    }

    const new_renewal_order_id = `${oldRenewalOrder.original_order_id}-${
        splitted_renewal_order_count + 1
    }`;

    const { data: originalOrder } = await getOrderById(
        String(oldRenewalOrder.original_order_id)
    );

    const payload = {
        product_href: oldRenewalOrder.product_href,
        original_order_id: oldRenewalOrder.original_order_id,
        renewal_order_id: new_renewal_order_id,
        subscription_id: oldRenewalOrder.subscription_id,
        customer_uuid: oldRenewalOrder.customer_uuid,
        address_line1: originalOrder.address_line1,
        address_line2: originalOrder.address_line2,
        state: originalOrder.state,
        zip: originalOrder.zip,
        city: originalOrder.city,
        subscription_type: oldRenewalOrder.subscription_type,
        environment: originalOrder.environment,
        assigned_pharmacy: oldRenewalOrder.assigned_pharmacy,
        variant_index: oldRenewalOrder.variant_index,
        ...(oldRenewalOrder.subscription_type ===
            SubscriptionCadency.Quarterly && {
            final_review_starts: getFinalReviewStartsDate(),
        }),
    };

    const { data: createdRenewal, error } = await supabase
        .from('renewal_orders')
        .insert(payload)
        .select();

    if (error) {
        console.error(error);
        console.error('Error creating upcoming renewal order', error);
        return null;
    }
    console.log('Successfully created new renewal order');

    return createdRenewal[0];
}

export async function createFirstTimeRenewalOrder(
    order_id: string,
    setRenewalCount: boolean = true
) {
    const supabase = createSupabaseServiceClient();
    const { data: orderData, error } = await getOrderById(order_id);

    if (error) {
        console.error(
            'Error: Fetching order for creating first time renewal order',
            order_id
        );
        await forwardOrderToEngineering(
            order_id,
            null,
            'Fwd to Engineering: function createFirstTimeRenewalOrder, error: ' +
                error.message
        );
        return null;
    }

    const payload = {
        product_href: orderData.product_href,
        original_order_id: orderData.id,
        renewal_order_id: `${orderData.id}-1`,
        subscription_id: orderData.subscription_id,
        customer_uuid: orderData.customer_uid,
        address_line1: orderData.address_line1,
        address_line2: orderData.address_line2,
        state: orderData.state,
        zip: orderData.zip,
        city: orderData.city,
        subscription_type: orderData.subscription_type,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        assigned_pharmacy: orderData.assigned_pharmacy,
        variant_index: orderData.variant_index,
        ...(orderData.subscription_type === SubscriptionCadency.Quarterly && {
            final_review_starts: getFinalReviewStartsDate(),
        }),
    };

    const { data: renewalOrder, error: renewalOrderError } = await supabase
        .from('renewal_orders')
        .insert(payload)
        .select()
        .single();

    if (setRenewalCount) {
        await supabase
            .from('prescription_subscriptions')
            .update({ renewal_count: 1 })
            .eq('id', orderData.subscription_id);
    }

    return renewalOrder;
}

export async function dateDiffInMonths(date1: Date, date2: Date) {
    var diffMillis = Math.abs(date2.getTime() - date1.getTime());

    var diffDays = diffMillis / (1000 * 60 * 60 * 24);

    // Note: This is a simplification and may not perfectly align with real-world calendars
    return Math.round(diffDays / 30.44);
}

export async function getRenewalOrdersForPatient(
    patient_id: string
): Promise<OrderItem[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_renewal_orders_for_patient',
        { customer_id: patient_id }
    );

    if (error) {
        console.error('Error getting renewal orders for patient', error);
        return [];
    }

    return data as OrderItem[];
}

export async function getLatestRenewalOrderByCustomerAndProduct(
    user_id: string,
    product_href: string
): Promise<RenewalOrder | null> {
    const orderId = await getOrderIdByPatientIdAndProductHref(
        user_id,
        product_href
    );

    if (!orderId) {
        console.log("no order id found for user's product");
        return null;
    }

    console.log('order id', orderId);
    const renewalOrder = await getLatestRenewalOrderForOriginalOrderId(orderId);

    return renewalOrder;
}

export async function getLatestRenewalOrderForOriginalOrderId(
    original_order_id: string
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('original_order_id', original_order_id)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error getting latest renewal orders for subscription',
            original_order_id,
            error
        );
        return null;
    }

    return data as RenewalOrder;
}
export async function getAllRenewalOrdersForOriginalOrderId(
    original_order_id: string
): Promise<RenewalOrder[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('original_order_id', original_order_id)
        .order('id', { ascending: true });

    if (error) {
        console.error(
            'Error getting latest renewal orders for subscription',
            original_order_id,
            error
        );
        return [];
    }

    return data as RenewalOrder[];
}

export async function getLatestRenewalOrderWithVariant(
    original_order_id: string
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('original_order_id', original_order_id)
        .not('variant_index', 'is', null) // Filter where variant_index is not null
        .not('variant_index', 'eq', -1) // Filter where variant_index is not -1
        .order('created_at', { ascending: false }) // Order by most recent
        .limit(1); // We only need the latest order

    if (error) {
        console.error(
            'Error getting latest renewal order with variant for original_order_id',
            original_order_id,
            error
        );
        return null;
    }

    // If no matching data found, return null
    if (!data || data.length === 0) {
        return null;
    }

    // Return the latest renewal order with a valid variant_index
    return data[0] as RenewalOrder;
}

export async function getLatestRenewalOrderForSubscription(
    subscription_id: number
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('subscription_id', subscription_id)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error getting latest renewal orders for subscription',
            subscription_id,
            error
        );
        return null;
    }

    return data as RenewalOrder;
}

export async function getLatestRenewalOrderForSubscriptionThatWasSent(
    subscription_id: number
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('subscription_id', subscription_id)
        .eq('order_status', RenewalOrderStatus.PharmacyProcessing)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error getting latest renewal orders for subscription',
            subscription_id,
            error
        );
        return null;
    }

    return data as RenewalOrder;
}

// Use this one
export async function getLatestProcessedOrderGeneral(
    renewal_order_id: string | undefined
) {
    console.log('renewal', renewal_order_id);
    if (!renewal_order_id) {
        return { lastOrderSent: null, lastOrderSentType: OrderType.Order };
    }

    const [baseOrderId, renewalOrderLevel] =
        extractRenewalOrderId(renewal_order_id);

    console.log(renewalOrderLevel);

    let lastOrderSent: BaseOrderInterface | RenewalOrder | null;
    let lastOrderSentType: OrderType;

    if (renewalOrderLevel === 1) {
        lastOrderSent = await getBaseOrderById(baseOrderId);
        lastOrderSentType = OrderType.Order;
    }

    lastOrderSent = await getLatestProcessedRenewalOrder(baseOrderId);
    lastOrderSentType = lastOrderSent
        ? OrderType.RenewalOrder
        : OrderType.Order;

    if (!lastOrderSent) {
        lastOrderSent = await getBaseOrderById(baseOrderId);
    }

    return { lastOrderSent, lastOrderSentType };
}

export async function getLatestProcessedRenewalOrder(
    original_order_id: number
): Promise<RenewalOrder> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_last_processed_renewal_order',
        {
            original_order_id_: original_order_id,
        }
    );

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Couldn't find data");
    }

    return data[0] as RenewalOrder;
}

export async function getLatestOrderForSubscriptionThatWasSent(
    subscription_id: number
) {
    const latestRenewalOrder =
        await getLatestRenewalOrderForSubscriptionThatWasSent(subscription_id);
    if (latestRenewalOrder) {
        return latestRenewalOrder;
    }

    const subscription = await getPrescriptionSubscription(subscription_id);
    if (!subscription) {
        return null;
    }
    const order = await getBaseOrderById(subscription.order_id);
    if (order?.order_status !== OrderStatus.ApprovedCardDownFinalized) {
        return null;
    }
    return order;
}

export async function updateRenewalOrderStatus(
    renewal_order_id: number,
    new_order_status: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .update({ order_status: new_order_status })
        .eq('id', renewal_order_id);

    if (error) {
        console.error(
            'Error updating renewal order order_status',
            error,
            renewal_order_id
        );
    }
}

export async function updateRenewalOrderFromRenewalOrderId(
    renewal_order_id: string,
    updated_payload: Partial<RenewalOrder>
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .update(updated_payload)
        .eq('renewal_order_id', renewal_order_id);

    if (error) {
        console.error(
            'Error updating renewal order order_status',
            error,
            renewal_order_id
        );
    }
}

export async function updateRenewalOrder(
    id: number,
    updated_payload: Partial<RenewalOrder>
): Promise<Status> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .update(updated_payload)
        .eq('id', id);

    if (error) {
        console.error('Error updating renewal order order_status', error, id);
        return Status.Failure;
    }
    return Status.Success;
}

export async function updateRenewalOrderByRenewalOrderId(
    renewal_order_id: string,
    updated_payload: Partial<RenewalOrder | any>
): Promise<{ status: Status; data: RenewalOrder | null }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .update(updated_payload)
        .eq('renewal_order_id', renewal_order_id)
        .select();

    if (error) {
        console.error(
            'Error updating renewal order order_status',
            error,
            renewal_order_id
        );
        return { status: Status.Failure, data: null };
    }

    if (!data || !data[0]) {
        return { status: Status.Failure, data: null };
    }
    return { status: Status.Success, data: data[0] };
}

export async function getAllRenewalOrdersForProviderOrderTable(): Promise<
    RenewalOrderProviderOverview[]
> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_renewal_orders_for_provider_overview',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) {
        console.error(
            'Error retreiving renewal orders for provider overview table',
            error
        );
        return [];
    }
    return data as RenewalOrderProviderOverview[];
}

export async function getAllRenewalOrdersForProviderOrderTablev2(): Promise<
    RenewalOrderProviderOverview[]
> {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase.rpc(
        'get_all_renewal_orders_for_provider_overview_v2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );
    if (error) {
        console.error(
            'Error retreiving renewal orders for provider overview table',
            error
        );
        return [];
    }

    return data as RenewalOrderProviderOverview[];
}

export async function getNextRenewalOrderForTaskQueue(
    licensed_states: USStates[],
    environment_override: boolean = false,
    assigned_provider: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_next_renewal_for_task_queue_and_assign',
        {
            environment_: environment_override
                ? 'dev'
                : process.env.NEXT_PUBLIC_ENVIRONMENT,
            licensed_states_: licensed_states,
            provider_id_: assigned_provider,
        }
    );

    if (error) return { error: error, data: null };

    return { data: data[0] as TaskRenewalObject, error: null };
}

export async function getAllRenewalOrdersForTaskQueue(
    licensed_states: USStates[]
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_renewal_orders_for_task_queue_v2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
            licensed_states_: licensed_states,
        }
    );

    if (error) {
        console.error('Error retreiving renewal orders for task queue', error);
        return { error: error, data: null };
    }

    return { data: data, error: null };
}

export async function getAllTaskQueueTotaRenewalOrderCount() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_renewal_orders_count_for_task_queue',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) return { error: error, data: null };

    return { data: data, error: null };
}

export async function getAssignedRenewalOrdersForProviderOrderTable(
    user_id: string
): Promise<RenewalOrderProviderOverview[]> {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase.rpc(
        'get_assigned_renewal_orders_for_provider_overview',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
            provider_id_: user_id,
        }
    );
    if (error) {
        console.error(
            'Error retreiving renewal orders for provider overview table',
            error
        );
        return [];
    }

    return data as RenewalOrderProviderOverview[];
}

export async function getAllRenewalOrdersForCoordinatorOrderTable(): Promise<
    RenewalOrderCoordinatorOverview[]
> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_renewal_orders_for_coordinator_dashboardv2',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) {
        console.error(
            'Error retreiving renewal orders for coordinator dashboard table',
            error
        );
        return [];
    }

    return data as RenewalOrderCoordinatorOverview[];
}

export async function getLastCompleteOrderForOriginalOrderId(
    original_order_id: number
) {
    const renewalOrders = await getAllRenewalOrdersForOriginalOrderId(
        String(original_order_id)
    );

    if (renewalOrders.length <= 1) {
        const orderData = await getBaseOrderById(original_order_id);

        if (!orderData) {
            return { orderData: null, orderType: null };
        }

        return { orderData, orderType: OrderType.Order };
    }
    return {
        orderData: renewalOrders[renewalOrders.length - 2] as RenewalOrder,
        orderType: OrderType.RenewalOrder,
    };
}

export async function getAllRenewalOrdersForAdminOrderTable(): Promise<
    RenewalOrderProviderOverview[]
> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'getallrenewalordersadmintable',
        { environment_: process.env.NEXT_PUBLIC_ENVIRONMENT }
    );

    if (error) {
        console.error(
            'Error retreiving renewal orders for admin overview table',
            error
        );
        return [];
    }

    return data as RenewalOrderProviderOverview[];
}

export async function getRenewalOrderForPatientIntake(
    orderId: string
): Promise<Partial<RenewalOrder>> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select(
            `
          *,
          patient:profiles!customer_uuid (
            first_name,
            last_name
          ),
          product:products!product_href (
            name
          ),
          order:orders!original_order_id (
            assigned_provider,
            address_line1,
            address_line2,
            state,
            zip,
            city,
            question_set_version,
            variant_text,
            variant_index
          ),
          subscription:prescription_subscriptions!subscription_id (
            stripe_subscription_id
          )
      `
        )
        .eq('renewal_order_id', orderId)
        .single();

    if (error) {
        console.log(
            'Controller Error. tablename: orders, method: getOrderById, error: ',
            error
        );
        return {};
    }

    return data;
}

export async function getRenewalOrder(
    renewal_order_id: string
): Promise<RenewalOrder | null> {
    const supabase = createSupabaseServiceClient();

    if (!renewal_order_id) {
        return null;
    }

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('renewal_order_id', renewal_order_id)
        .maybeSingle();

    if (error) {
        console.error('Could not retrieve renewal order for', renewal_order_id);
        return null;
    }
    return data;
}

export async function getRenewalSubmissionTimes(
    user_id: string,
    product_href: string
): Promise<SubmissionTimes> {
    const supabase = createSupabaseServiceClient();

    async function transformArrayToObject(
        arr: any[]
    ): Promise<SubmissionTimes> {
        const result: SubmissionTimes = {};

        arr.forEach(async (item: any) => {
            if (!item.order_label.includes('checkup')) {
                const createdAt = await getFirstCompletedOrderCreatedDate(
                    user_id,
                    product_href
                );
                result[item.order_label] = createdAt;
            } else {
                result[item.order_label] = item.submission_time;
            }
        });
        return result;
    }

    const { data, error } = await supabase.rpc(
        'get_renewal_submission_times_v2',
        {
            user_id_: user_id,
            product_href_: product_href,
        }
    );

    if (error) {
        console.error('Error retrieving renewal submission times', error);
        return {};
    }
    return await transformArrayToObject(data);
}

export async function administrativeCancelRenewalOrder(
    renewal_order_id: string,
    reason: string,
    subscription_id: number,
    stripe_subscription_id: string,
    userId: string
): Promise<Status> {
    await updateRenewalOrderFromRenewalOrderId(renewal_order_id, {
        order_status: RenewalOrderStatus.Administrative_Canceled,
    });

    await insertAuditIntoAdministrativeCancelTable(renewal_order_id, reason);

    const subscription = await getStripeSubscription(stripe_subscription_id);

    const { success } = await safeCancelSubscription(
        subscription,
        subscription_id,
        true
    );

    if (success) {
        await triggerEvent(userId, ORDER_CANCELED, {
            order_id: renewal_order_id,
        });
    }

    if (!success) {
        console.error(
            'Error: Failed to administratively cancel subscription for order',
            renewal_order_id,
            reason,
            subscription_id
        );
        return Status.Failure;
    }
    return Status.Success;
}

function countHyphens(str: string | number) {
    const stringified = String(str);
    const matches = stringified.match(/-/g);
    return matches ? matches.length : 0;
}

export async function isRenewalOrder(order_id: string, pharmacy: string) {
    // Is a renewal order if it contains a hyphen in the order_id (applies to all BUT gogomeds)

    const numHyphens = countHyphens(order_id as string);

    if (pharmacy === EASYPOST_PHARMACIES.GOGO_MEDS) {
        return numHyphens >= 2;
    }

    return numHyphens >= 1;
}

export async function getRenewalListForIntakesTabAllPatients(
    patient_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select(
            `
            id,
            created_at,
            customer_uuid,
            order_status,
            product_href,
            original_order_id,
            renewal_order_id,
            submission_time,
            approval_denial_timestamp,
            *,
            action_item:action_items!checkup_action_item_id(type)
            `
        )
        .eq('customer_uuid', patient_id);

    return data;
}

/**
 * Returns the number of months into the user's subscription for the current billing cycle.
 * If the subscription type is Quarterly, calculates the number of months based on the current period start date.
 * Returns a number indicating the number of months into the subscription.
 * @param order The RenewalOrder object containing subscription details
 */
export async function getMonthsIntoRenewalOrderSubscription(
    renewal_order_id: string
): Promise<Months> {
    const renewalOrder = await getRenewalOrder(renewal_order_id);

    if (!renewalOrder) {
        return 0;
    }
    if (renewalOrder.subscription_type === SubscriptionCadency.Quarterly) {
        const subscription = await getPrescriptionSubscription(
            renewalOrder.subscription_id
        );

        if (
            !subscription ||
            !isGLP1Product(subscription.product_href) ||
            subscription.subscription_type === SubscriptionCadency.Monthly
        ) {
            return 0;
        }

        const stripeSubscription = await getStripeSubscription(
            subscription.stripe_subscription_id
        );

        const date = convertEpochToDate(stripeSubscription.current_period_end);

        const daysBetween = await getDaysBetweenDates(new Date(), date);

        // CURRENTLY THIS ONLY WORKS FOR GLP-1 BIANNUALLY & QUARTERLY & MONTHLY SUBSCRIPTIONS
        // Anything of a different cadency will need this function to have special cases for each product as we count backwards

        if (renewalOrder.subscription_type === SubscriptionCadency.Quarterly) {
            if (daysBetween >= 60) {
                return 1;
            } else if (daysBetween >= 30) {
                return 2;
            } else {
                return 3;
            }
        } else if (
            renewalOrder.subscription_type === SubscriptionCadency.Biannually
        ) {
            if (daysBetween >= 150) {
                return 1;
            } else if (daysBetween >= 120) {
                return 2;
            } else if (daysBetween >= 90) {
                return 3;
            } else if (daysBetween >= 60) {
                return 4;
            } else if (daysBetween >= 30) {
                return 5;
            } else {
                return 6;
            }
        } else if (
            renewalOrder.subscription_type === SubscriptionCadency.Annually
        ) {
            if (daysBetween >= 330) {
                return 1;
            } else if (daysBetween >= 300) {
                return 2;
            } else if (daysBetween >= 270) {
                return 3;
            } else if (daysBetween >= 240) {
                return 4;
            } else if (daysBetween >= 210) {
                return 5;
            } else if (daysBetween >= 180) {
                return 6;
            } else if (daysBetween >= 150) {
                return 7;
            } else if (daysBetween >= 120) {
                return 8;
            } else if (daysBetween >= 90) {
                return 9;
            } else if (daysBetween >= 60) {
                return 10;
            } else if (daysBetween >= 30) {
                return 11;
            } else {
                return 12;
            }
        }
    }
    return 0;
}

export async function getPriceForRenewalOrder(renewal_order_id: string) {
    const renewalOrder = await getRenewalOrder(renewal_order_id);

    if (!renewalOrder) {
        return 0;
    }

    if (renewalOrder.price) {
        return Number(renewalOrder.price);
    }

    const { data: order, error } = await getOrderById(
        String(renewalOrder.original_order_id)
    );

    if (!order || error) {
        return 0;
    }

    const variantIndex = order.variant_index;

    const productPrice = await getPriceDataRecordWithVariant(
        renewalOrder.product_href,
        variantIndex
    );

    return productPrice?.price_data.product_price || 0;
}

/** @author Nathan Cho
 * @param orderId - order Id
 * @param providerId - provider profile uuid
 * @returns
 */
export async function assignProviderToOrderUsingRenewalOrderId(
    renewal_order_id: string,
    providerId: string
) {
    const supabase = await createSupabaseServiceClient();

    const current_time = new Date();

    const { data: fetchedData, error } = await supabase
        .from('renewal_orders')
        .update({
            assigned_provider: providerId,
            assigned_provider_timestamp: current_time,
        })
        .eq('renewal_order_id', renewal_order_id)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: renewal_orders, method: assignProviderToOrderUsingRenewalOrderId, error: ',
            error
        );

        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function updateRenewalOrderExternalTrackingMetadata(
    renewal_order_id: string,
    external_metadata: any
) {
    const supabase = await createSupabaseServiceClient();

    const { data: originalMetadata, error: originalError } = await supabase
        .from('renewal_orders')
        .select('external_tracking_metadata')
        .eq('renewal_order_id', renewal_order_id)
        .limit(1)
        .maybeSingle();

    if (originalError) {
        console.log(
            'Controller Error. tablename: renewal_orders, method: updateRenewalOrderExternalTrackingMetadata, error: ',
            originalError
        );
        return { data: null, error: originalError };
    }

    const updatePayload = originalMetadata
        ? {
              ...originalMetadata.external_tracking_metadata,
              ...external_metadata,
          }
        : { ...external_metadata };

    if (updatePayload.external_tracking_metadata === null) {
        delete updatePayload.external_tracking_metadata;
    }

    const { data: fetchedData, error } = await supabase
        .from('renewal_orders')
        .update({ external_tracking_metadata: updatePayload })
        .eq('renewal_order_id', renewal_order_id)
        .select();

    if (error) {
        console.log(
            'Controller Error. tablename: renewal_orders, method: updateRenewalOrderExternalTrackingMetadata, error: ',
            error
        );
        return { data: null, error: error };
    }

    return { data: fetchedData, error: null };
}

export async function updateRenewalOrderMetadataSafely(
    new_metadata: any,
    renewal_order_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: current_metadata, error: current_error } = await supabase
        .from('renewal_orders')
        .select('metadata')
        .eq('renewal_order_id', renewal_order_id)
        .limit(1)
        .maybeSingle();

    if (current_error) {
        console.log('Error in updating order metadata. ', current_error);
    }

    const { error } = await supabase
        .from('renewal_orders')
        .update({
            metadata: { ...current_metadata?.metadata, ...new_metadata },
        })
        .eq('renewal_order_id', renewal_order_id);

    console.log('update metadata error ', error);
}

export async function addCheckInCompletionToRenewalOrder(
    action_item_id: number,
    completion_time: string,
    renewal_order_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: current_check_ins, error: current_error } = await supabase
        .from('renewal_orders')
        .select('check_ins')
        .eq('renewal_order_id', renewal_order_id)
        .limit(1)
        .maybeSingle();

    if (current_error) {
        console.log(
            'Error in updating order check in completion for renewal order. ',
            current_error
        );
        return Status.Error;
    }

    const { error } = await supabase
        .from('renewal_orders')
        .update({
            check_ins: {
                ...current_check_ins?.check_ins,
                [action_item_id]: completion_time,
            },
        })
        .eq('renewal_order_id', renewal_order_id);

    if (error) {
        console.log(
            'Error in updating order check in completion for renewal order. ',
            error
        );
        return Status.Error;
    }

    return Status.Success;
}
