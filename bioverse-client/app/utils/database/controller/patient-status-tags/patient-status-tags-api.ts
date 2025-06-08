// API For Tablename: patient_status_tags
// Created on: May 28, 2024
// Created by: Kevin Castro

'use server';
import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import {
    getMonthsIntoRenewalOrderSubscription,
    isRenewalOrder,
} from '../renewal_orders/renewal_orders';
import {
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import { isEmpty } from 'lodash';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    ID_VERIFICATION_FOLLOWUP,
    MESSAGE_UNREAD,
} from '@/app/services/customerio/event_names';
import { AUTO_STATUS_CHANGER_UUID } from '@/app/services/pharmacy-integration/provider-static-information';
import { OrderType } from '@/app/types/orders/order-types';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { getOrderById } from '../orders/orders-api';

// Create
// -----------------------------

export async function createUserStatusTagWNote(
    status_tag: string,
    order_id: string,
    patient_id: string,
    note: string,
    author_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .insert({
            patient_id,
            order_id,
            status_tag,
            note,
            last_modified_by: author_id,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        })
        .select();

    if (error) {
        return { data: null, error: error };
    }
    return { data: data, error: error };
}

export async function createUserStatusTag(
    status_tag: string,
    order_id: string,
    patient_id: string,
    author_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .insert({
            patient_id,
            order_id,
            status_tag,
            last_modified_by: author_id,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        })
        .select();

    if (error) {
        return { data: null, error: error };
    }

    return { data: data, error: error };
}

export async function setStatusTagMetadata(
    tagId: number,
    metadataField: string,
    metadataValue: any
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .select('*')
        .eq('id', tagId)
        .single();

    if (error || !data) {
        console.error('error setting metatag status data', error);
    }

    const { data: updateData, error: updateError } = await supabase
        .from('patient_status_tags')
        .update({
            metadata: { ...data.metadata, [metadataField]: metadataValue },
        })
        .eq('id', tagId);
}

export async function updateStatusTagToReview(
    user_id: string,
    order_id: string
) {
    await createUserStatusTagWAction(
        StatusTag.Review,
        order_id,
        StatusTagAction.REPLACE,
        user_id,
        'Review order',
        AUTO_STATUS_CHANGER_UUID,
        [StatusTag.Review],
        false
    );
}

// shouldConvertUserInput: Added by Olivier
// Ran into issue where providers & coordinators were tagging orders as Review when it should be NoPrescribe
// In these locations, if they tag Review, I determine if it should be converted to ReviewNoPrescribe
export async function createUserStatusTagWAction(
    status_tag: string,
    order_id: string,
    action: string,
    patient_id: string,
    note: string,
    author_id: string,
    status_tags: string[],
    shouldConvertUserInput: boolean = false
) {
    const supabase = createSupabaseServiceClient();
    var newStatusTag;
    var new_status_tags;

    if (
        shouldConvertUserInput &&
        [StatusTag.Review, StatusTag.Overdue].includes(
            status_tag as StatusTag
        ) &&
        (await isRenewalOrder(order_id, 'any'))
    ) {
        const months = await getMonthsIntoRenewalOrderSubscription(order_id);

        if (months === 0) {
            newStatusTag = StatusTag.Review;
            new_status_tags = [StatusTag.Review];
        } else if (months === 1 || months === 2) {
            newStatusTag =
                status_tag === StatusTag.Review
                    ? StatusTag.ReviewNoPrescribe
                    : StatusTag.OverdueNoPrescribe;
            new_status_tags = [newStatusTag];
        } else if (months >= 3) {
            newStatusTag = StatusTag.FinalReview;
            new_status_tags = [StatusTag.FinalReview];
        } else {
            newStatusTag = StatusTag.Review;
            new_status_tags = [StatusTag.Review];
        }
    } else {
        newStatusTag = status_tag;
        new_status_tags = status_tags;
    }

    if (status_tag === StatusTag.CustomerIOFollowUp) {
        await triggerEvent(patient_id, MESSAGE_UNREAD);
    }
    if (status_tag === StatusTag.IDVerificationCustomerIOFollowUp) {
        await triggerEvent(patient_id, ID_VERIFICATION_FOLLOWUP);
    }

    if (status_tag === StatusTag.IDDocs) {
        await triggerEvent(patient_id, RudderstackEvent.NEW_MESSAGE);
    }

    const { data, error } = await supabase.from('patient_status_tags').insert({
        patient_id,
        order_id,
        status_tag: newStatusTag,
        action,
        note,
        last_modified_by: author_id,
        status_tags: new_status_tags,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    });

    if (error) {
        console.log('createUserStatusTagWAction error: ', error);
        return { data: null, error: error };
    }
    return { data: data, error: error };
}

// Place your Create functions here

// Read
// -----------------------------
// Promise<{ data: ClinicalNotesV2Supabase[] | null; error: any }>

export async function getUserStatusTags(
    patient_id: string,
    order_id: string
): Promise<{ data: PatientStatusTagsSBR; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .select('status_tag')
        .eq('patient_id', patient_id)
        .eq('order_id', order_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return { data: {}, error: error };
    }
    return { data: data, error: error };
}

export async function getStatusTagForOrder(
    order_id: string
): Promise<{ data: PatientStatusTagsSBR; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .select('status_tags')
        .eq('order_id', order_id)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        return { data: {}, error: error };
    }
    return { data: data[0], error: error };
}

export async function getUserStatusTag(
    patient_id: string,
    order_id: string
): Promise<{ data: PatientStatusTagsSBR; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .select('status_tag')
        .eq('patient_id', patient_id)
        .eq('order_id', order_id)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.log('stag - error', error);
        return { data: {}, error: error };
    }
    return { data: data[0], error: error };
}

export async function getUserStatusTagsWithNotes(
    patient_id: string,
    order_id: string
): Promise<{ data: PatientStatusTagsWithNotesSBR; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_status_tags')
        .select(
            `id, status_tags, note, last_modified_by, created_at, 
            author:profiles!last_modified_by (
                first_name,
                last_name
            )`
        )
        .eq('patient_id', patient_id)
        .eq('order_id', order_id)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        return { data: {} as PatientStatusTagsWithNotesSBR, error: error };
    }
    return { data: data[0] as PatientStatusTagsWithNotesSBR, error: error };
}

export async function getUserStatusTagNotes(
    patient_id: string
): Promise<{ data: PatientStatusTagsSBR[]; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_user_status_tag_notesv2', {
        patient_id_: patient_id,
    });
    if (error) {
        return { data: [], error: error };
    }

    return { data: data, error: error };
}

export async function getEngineerStatusTagOrders(): Promise<{
    data: PatientOrderEngineerDetails[];
    error: any;
}> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_engineer_tag_orders_v2',
        {}
    );

    if (error) {
        return { data: [], error: error };
    }
    return { data: data, error: error };
}

export async function assignEngineerToStatusTag(
    tagId: number,
    assigned_uuid: string
): Promise<{ result: Status }> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('patient_status_tags')
        .update({
            metadata: {
                assigned_engineer: assigned_uuid,
            },
        })
        .eq('id', tagId);

    if (error) {
        console.error('assignEngineerToStatusTag : ', error);
        return { result: Status.Error };
    }

    return { result: Status.Success };
}

// This function retrieves all orders with the specified array status tags
export async function getAllOrdersForStatusTags(
    status_tags: StatusTag[]
): Promise<PatientStatusTagsSBR[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_orders_for_status_tags',
        { lookup_status_tags: status_tags }
    );

    if (error) {
        console.error('Error getting all orders for status tags', status_tags);
        return [];
    }

    if (!data || isEmpty(data)) {
        return [];
    }

    return data;
}

// This function retrieves all orders with the specified array status tags within the last 24 hours
export async function getAllOrdersForStatusTagsDaily(
    status_tags: StatusTag[]
): Promise<PatientStatusTagsSBR[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_all_orders_for_status_tags_daily',
        { lookup_status_tags: status_tags }
    );

    if (error) {
        console.error('Error getting all orders for status tags', status_tags);
        return [];
    }

    if (!data || isEmpty(data)) {
        return [];
    }

    return data;
}

export async function getStatusTags(
    limit: number,
    status_tag: string,
    licensed_state_array: string[] | null,
    environment_override?: string
) {
    //get_latest_status_tags

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_latest_status_tags', {
        limit_value: limit,
        status_tag_param: status_tag,
        status_tag_environment: environment_override
            ? environment_override
            : process.env.NEXT_PUBLIC_ENVIRONMENT!,
        licensed_states_for_provider: licensed_state_array,
    });

    if (error) {
        console.error(
            'getStatusTags error - data = limit: ',
            limit,
            ' status tag: ',
            status_tag,
            ' error message: ',
            error.message
        );
        return { data: null, status: Status.Error };
    }

    return { data: data as StatusTagObject[], status: Status.Success };
}

export async function getStatusTagsInArray(
    limit: number,
    status_tags: StatusTag[],
    licensed_state_array: string[] | null,
    environment_override?: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_latest_status_tags_in_array',
        {
            limit_value: limit,
            status_tag_params: status_tags,
            licensed_states_for_provider: licensed_state_array,
            status_tag_environment: environment_override
                ? environment_override
                : process.env.NEXT_PUBLIC_ENVIRONMENT!,
        }
    );

    if (error) {
        console.error('getStatusTagsInArray error: ', error);
        return { data: null, status: Status.Error };
    }

    return { data: data as StatusTagObject, status: Status.Success };
}

export async function getCoordinatorTaskByStatusTagArray(
    status_tags: StatusTag[],
    licensed_state_array: string[] | null,
    employee_id: string,
    environment_override: boolean
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_coordinator_task_by_status_tag_array',
        {
            status_tag_params: status_tags,
            licensed_states_for_provider: licensed_state_array ?? null,
            status_tag_environment: environment_override
                ? 'dev'
                : process.env.NEXT_PUBLIC_ENVIRONMENT!,
            employee_id: employee_id,
        }
    );

    if (error) {
        console.error('getCoordinatorTaskByStatusTagArray error: ', error);
        return { data: null, status: Status.Error };
    }
    return { data: data as StatusTagObject, status: Status.Success };
}

export async function getRegisteredNurseStatusTags(
    limit: number,
    licensed_state_array: string[]
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_registered_nurse_status_tags',
        {
            limit_value: limit,
            status_tag_environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            licensed_states_for_provider: licensed_state_array,
        }
    );

    if (error) {
        console.error(
            'getRegisteredNurseStatusTags error - data = limit: ',
            limit,
            ' error message: ',
            error.message
        );
        return { data: null, status: Status.Error };
    }

    return { data: data as StatusTagObject[], status: Status.Success };
}

export async function getStatusTagTaskCount(status_tag: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('count_latest_status_tags', {
        status_tag_param: status_tag,
        status_tag_environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    });

    if (error) {
        console.error(
            'getStatusTags error - data: ',
            ' status tag: ',
            status_tag,
            ' error message: ',
            error.message
        );
        return { data: null, status: Status.Error };
    }

    return { data: data, status: Status.Success };
}

export async function getStatusTagArrayTaskCount(status_tags: StatusTag[]) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_latest_status_tag_array_count',
        {
            status_tag_param: status_tags,
            status_tag_environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        }
    );

    if (error) {
        console.error('getStatusTagArrayTaskCount error: ', error);
    }

    return data;
}

export async function forwardOrderToEngineering(
    order_id: string,
    user_id: string | null = null,
    note: string = StatusTagNotes.Engineer
) {
    let user_id_to_use = user_id;

    if (!user_id) {
        const orderIdParts = order_id.split('-');
        const cleanOrderId = orderIdParts[0];

        const { data: orderData, error: orderError } = await getOrderById(
            cleanOrderId
        );

        if (orderError) {
            console.error('forwardOrderToEngineering error: ', orderError);
        }

        user_id_to_use = orderData.customer_uid;
    }

    await createUserStatusTagWAction(
        StatusTag.Engineer,
        order_id,
        StatusTagAction.REPLACE,
        user_id_to_use ?? 'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
        note,
        'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
        [StatusTag.Engineer]
    );
}

export async function updateStatusTagToResolved(
    order_id: string,
    user_id: string,
    note: string = StatusTagNotes.AutomaticResolved
) {
    await createUserStatusTagWAction(
        StatusTag.Resolved,
        order_id,
        StatusTagAction.REPLACE,
        user_id ?? AUTO_STATUS_CHANGER_UUID,
        note,
        AUTO_STATUS_CHANGER_UUID,
        [StatusTag.Resolved]
    );
}

// Update
// -----------------------------

export async function updateStatusTagAssignedProvider(
    providerId: string,
    status_tag_id: number
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('patient_status_tags')
        .update({ assigned_provider: providerId })
        .eq('id', status_tag_id);

    if (error) {
        console.log(
            'updateStatusTagAssignedProvider: provider ID: ',
            providerId,
            ' status tag id: ',
            status_tag_id,
            ' error message: ',
            error.message
        );
        return { status: Status.Error };
    }

    return { status: Status.Success };
}

export async function updateUserOrderStatusTags(
    patient_id: string,
    conditions: string[],
    status_tag: string,
    note: string
) {
    const supabase = createSupabaseServiceClient();

    try {
        const { data, error } = await supabase.rpc(
            'update_user_status_tag_to_new_tag',
            {
                patient_id_: patient_id,
                status_tags_conditions: conditions,
                status_tag_: status_tag,
                note_: note,
            }
        );

        if (error) {
            console.error('updateUserOrderStatusTags error: ', error);
        }

        return data;
    } catch (error) {
        console.log('stag - error', error);
        console.error(error);
    }
}

export async function getStatusTagAssignmentCount(
    status_tag: StatusTag,
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    try {
        const { data, error } = await supabase.rpc(
            'get_status_tag_assignment_count',
            {
                environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
                status_tag_: status_tag,
                start_date_: start_date,
                end_date_: end_date,
            }
        );

        if (error) {
            console.error('getStatusTagAssignmentCount error: ', error);
        }

        return data;
    } catch (error) {
        console.log('stag - error', error);
        console.error(error);
    }
}

export async function getStatusTagArrayAssignmentCount(
    status_tags: StatusTag[],
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_status_tag_array_assignment_count',
        {
            environment_: process.env.NEXT_PUBLIC_ENVIRONMENT,
            status_tags_: status_tags,
            start_date_: start_date,
            end_date_: end_date,
        }
    );

    if (error) {
        console.error('getStatusTagArrayAssignmentCount error: ', error);
    }

    return data;
}

export async function getNewIntakeCountFromDateRange(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_new_intake_count_from_range',
        {
            start_date: start_date,
            end_date: end_date,
            status_tags_: ['Review'],
        }
    );

    if (error) {
        console.error('getNewIntakeCountFromDateRange error ', error);
    }

    return data;
}

export async function getNewIntakeCountWithIDDocsFromDateRange(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_new_intakes_with_id_docs_from_range',
        {
            start_date: start_date,
            end_date: end_date,
        }
    );

    if (error) {
        console.error('getNewIntakeCountWithIDDocsFromDateRange error ', error);
    }

    return data;
}

export async function getNewRenewalCountFromDateRange(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_new_renewal_count_from_range',
        {
            start_date: start_date,
            end_date: end_date,
            status_tags_: [
                'Review',
                'FinalReview',
                'ReviewNoPrescribe',
                'OverdueNoPrescribe',
            ],
        }
    );

    if (error) {
        console.error('getNewRenewalCountFromDateRange error ', error);
    }

    return data;
}

export async function getNewMessageCountFromDateRange(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_new_message_count_from_range',
        {
            start_date: start_date,
            end_date: end_date,
            status_tags_: ['ProviderMessage'],
        }
    );

    if (error) {
        console.error('getNewRenewalCountFromDateRange error ', error);
    }

    return data;
}

export async function getIDDocsTaggedNewIntakesCountFromDateRange(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase.rpc(
        'get_new_intakes_without_id_docs_from_range',
        {
            start_date: start_date,
            end_date: end_date,
        }
    );

    if (error) {
        console.error('getNewRenewalCountFromDateRange error ', error);
    }

    return data;
}

/**
 *
 * @param start_date
 * @param end_date
 * @param status_tags
 * @param orderType
 * @returns RPC returns average number of seconds before the status tag specified is removed.
 */
export async function getAverageStatusTagRemovalTime(
    start_date: Date,
    end_date: Date,
    status_tags: StatusTag[],
    orderType?: OrderType
) {
    let intake_renewal_type;
    switch (orderType) {
        case OrderType.Order:
            intake_renewal_type = 'intake';
            break;
        case OrderType.RenewalOrder:
            intake_renewal_type = 'renewal';
            break;
        default:
            intake_renewal_type = 'both';
    }

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_average_status_tag_removal_time',
        {
            start_date: start_date,
            end_date: end_date,
            search_status_tags_: status_tags,
            intake_renewal_type_: intake_renewal_type,
        }
    );

    if (error) {
        console.error('getNewRenewalCountFromDateRange error ', error);
    }

    return data;
}

/**
 * Function made for App control's intake ID Docs Counter:
 */
export async function getIntakeWithIDCount(startDate: Date, endDate: Date) {
    const supabase = createSupabaseServiceClient();

    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { count: withoutIDCount, error: noIDError } = await supabase
        .from('patient_status_tags')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('note', 'Patient submitted an order without verifying their id')
        .eq('status_tag', 'ID/Docs')
        .eq('environment', 'prod');

    const { count: withIDIntakeCount, error } = await supabase
        .from('patient_status_tags')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('note', 'New Order to review')
        .eq('status_tag', 'Review')
        .eq('environment', 'prod');

    return { with_ID_count: withIDIntakeCount, no_ID_count: withoutIDCount };
}

export async function getNextCoordinatorOrderForTaskQueue() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_next_coordinator_task_queue_item',
        {
            target_environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }
    );

    if (error) return { error: error, data: null };
    return { data: data[0] as TaskOrderObject, error: null };
}

//get_average_status_tag_removal_time
