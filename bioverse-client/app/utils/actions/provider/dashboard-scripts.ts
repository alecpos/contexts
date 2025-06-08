'use server';

import { concat } from 'lodash';
import {
    getAllOrdersForProviderOrderTablev2,
    getAllOrdersForTaskQueue,
} from '../../database/controller/orders/orders-api';
import {
    getAllRenewalOrdersForProviderOrderTablev2,
    getAllRenewalOrdersForTaskQueue,
} from '../../database/controller/renewal_orders/renewal_orders';
import {
    prescriptionRequestToProviderDashboardv2,
    renewalOrderToProviderDashboard,
} from './parsers';
import { USStates } from '@/app/types/enums/master-enums';
import { getStatusTags } from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { StatusTag } from '@/app/types/status-tags/status-types';
import {
    getProviderLicensedStatesWithID,
    getProviderLicensedStates,
} from '../../database/controller/providers/providers-api';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';

export async function getProviderDashboardTasks(user_id: string) {
    const licensed_states = await getProviderLicensedStatesWithID(user_id);

    const { data: orders, error: orders_error } =
        await getAllOrdersForTaskQueue(licensed_states ?? []);

    const { data: renewalOrders, error: renewalOrdersError } =
        await getAllRenewalOrdersForTaskQueue(licensed_states ?? []);

    const provider_messages = await getProviderMessageStatusTags(
        licensed_states ?? []
    );

    const ordersMapped = mapOriginalOrdersToPatientDetails(orders);
    const renewalOrdersMapped = mapRenewalOrdersToPatientDetails(renewalOrders);

    return {
        orders: ordersMapped,
        renewalOrders: renewalOrdersMapped,
        combined: concat(provider_messages, renewalOrdersMapped, ordersMapped),
        provider_messages: provider_messages,
    };
}

function mapOriginalOrdersToPatientDetails(
    originalOrders: any[]
): PatientOrderProviderDetails[] {
    return originalOrders.map((order) => ({
        id: String(order.id),
        patientId: order.customer_uid,
        patientName: `${order.first_name} ${order.last_name}`,
        requestSubmissionTime: order.created_at ?? undefined,
        deliveryState: order.state,
        prescription: order.variant_text,
        approvalStatus: order.order_status,
        statusTag: order.status_tag ?? undefined,
        productName: order.name,
        vial_dosages: order.vial_dosages ?? null,
        subscriptionType: order.subscription_type,
        variant: order.variant,
        status_tag_id: order.status_tag_id,
    }));
}

function mapRenewalOrdersToPatientDetails(
    renewalOrders: any[]
): PatientOrderProviderDetails[] {
    return renewalOrders.map((order) => ({
        id: String(order.renewal_order_id),
        patientId: order.customer_uid,
        patientName: `${order.first_name} ${order.last_name}`,
        requestSubmissionTime: order.submission_time ?? undefined,
        deliveryState: order.state,
        prescription: order.variant_text,
        approvalStatus: order.order_status,
        statusTag: order.status_tag ?? undefined,
        productName: order.product_name,
        vial_dosages: order.vial_dosages ?? null,
        subscriptionType: order.subscription_type,
        variant: order.variant,
        status_tag_id: order.status_tag_id,
    }));
}

async function getProviderMessageStatusTags(licensed_states: USStates[]) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_provider_dashboard_table_message_status_tags_v2',
        {
            status_tag_environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
            licensed_states_for_provider: licensed_states,
        }
    );

    if (error) {
        console.error('Error fetching provider message status tags:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        patientId: item.patientid,
        patientName: item.patientname,
        requestSubmissionTime: item.requestsubmissiontime,
        deliveryState: item.deliverystate,
        prescription: item.prescription,
        approvalStatus: item.approvalstatus,
        statusTag: item.statustag,
        productName: item.productname,
        subscriptionType: item.subscriptiontype,
        variant: item.variant,
        vial_dosages: undefined,
    }));
}

export async function ProviderDashboardFetchV1() {
    const { data: completeOrderData, error: orderError } =
        await getAllOrdersForProviderOrderTablev2();

    // const { data: leadProviderOrderData, error: leadProviderError } =
    //     await getLeadProviderOrders();

    const renewalOrderData = await getAllRenewalOrdersForProviderOrderTablev2();

    if (!completeOrderData && orderError) {
        console.error(
            'Order Fetching for general orders failed. error message: ',
            orderError.message
        );
    }
    const generalOrders = prescriptionRequestToProviderDashboardv2(
        completeOrderData ?? []
    );

    // const leadProviderOrders = prescriptionRequestToProviderDashboardv2(
    //     leadProviderOrderData ?? []
    // );

    const renewalOrders = renewalOrderToProviderDashboard(renewalOrderData);

    const mergedOrders = concat(renewalOrders, generalOrders);

    const licensed_states = await getProviderLicensedStates();

    const stateFilteredOrders = mergedOrders.filter((order) => {
        if (!order.deliveryState) {
            return true;
        }
        return licensed_states?.includes(order.deliveryState as USStates);
    });

    return {
        generalOrders: stateFilteredOrders,
        // leadProviderOrders: leadProviderOrders,
    };
}

export async function getLeadProviderOrderStatusTags() {
    const { data, status } = await getStatusTags(
        100,
        StatusTag.LeadProvider,
        null,
        'prod'
    );

    return data;
}
