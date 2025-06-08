'use server';

import { StatusTag } from '@/app/types/status-tags/status-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getAllTaskQueueTotaOrderCount } from '@/app/utils/database/controller/orders/orders-api';
import { getStatusTagTaskCount } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    getProviderIntakeRenewalCompletionCountBetweenDates,
    getProviderEstimatedPaymentBetweenDatesV2Verbose,
    getRenewalCheckInCompletionCount,
} from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { getAllTaskQueueTotaRenewalOrderCount } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getMessagingTaskCompletionCount } from '@/app/utils/database/controller/tasks/task-api';
import { getProviderAutomaticSessionLog } from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-functions';

export async function getTaskActionMenuData() {
    //acquire logged in provider ID in server.
    const providerId = (await readUserSession()).data.session?.user.id;

    //get start / end dates -> returns 1st day of month we are in, and current date (end).
    const { start_date, end_date } = getStartAndEndDate();
    const { start_date: start_timestamp, end_date: end_timestamp } =
        getStartAndEndDateTimestamps();

    //obtain the number of prescripibe intake audit records we find for provider in btwn start - end dates
    const intakes_completed =
        await getProviderIntakeRenewalCompletionCountBetweenDates(
            providerId!,
            start_date,
            end_date
        );

    let estimated_payment = (
        await getProviderEstimatedPaymentBetweenDatesV2Verbose(
            providerId!,
            start_timestamp,
            end_timestamp
        )
    ).totalPayInPeriod;

    //obtain count of how many check-ins they completed
    // # of status tag changes that go from 'ReviewNoPrescribe' | 'OverdueNoPrescribe' ->> 'Resolved'
    const renewal_check_ins_completed = await getRenewalCheckInCompletionCount(
        providerId!,
        start_date,
        end_date
    );

    const { start_date: weekly_start_date, end_date: weekly_end_date } =
        getWeeklyTimePeriod();
    const logs = await getProviderAutomaticSessionLog(
        providerId!,
        weekly_start_date.getTime(),
        weekly_end_date.getTime()
    );

    let total_hours_worked_this_week_unix = 0;
    for (const log of logs) {
        total_hours_worked_this_week_unix +=
            log.end_session_timestamp - log.start_session_timestamp;
    }
    const total_hours_worked_this_week =
        total_hours_worked_this_week_unix / 1000 / 60 / 60;

    const { data: intake_count, error: intake_count_error } =
        await getAllTaskQueueTotaOrderCount();

    const { data: renewal_count, error: renewal_count_error } =
        await getAllTaskQueueTotaRenewalOrderCount();

    const message_task_completion_count =
        await getMessagingTaskCompletionCount();

    const { data: messageCount, status: messageStatus } =
        await getStatusTagTaskCount(StatusTag.ProviderMessage);

    const total_intakes_remaining = intake_count + renewal_count + messageCount;

    return {
        intakes_completed: intakes_completed + renewal_check_ins_completed,
        total_intakes_remaining: total_intakes_remaining,
        estimated_payment: estimated_payment,
        message_task_completion_count: message_task_completion_count,
        total_hours_this_week: total_hours_worked_this_week,
        intake_count: intake_count,
        renewal_count: renewal_count,
        message_count: messageCount,
    };
}

export async function getTaskActionMenuDataForProvider(providerId: string) {
    //get start / end dates -> returns 1st day of month we are in, and current date (end).
    const { start_date, end_date } = getStartAndEndDateForMonth(8);

    //obtain the number of prescripibe intake audit records we find for provider in btwn start - end dates
    const intakes_completed =
        await getProviderIntakeRenewalCompletionCountBetweenDates(
            providerId!,
            start_date,
            end_date
        );

    //obtain count of how many check-ins they completed
    // # of status tag changes that go from 'ReviewNoPrescribe' | 'OverdueNoPrescribe' ->> 'Resolved'
    const renewal_check_ins_completed = await getRenewalCheckInCompletionCount(
        providerId!,
        start_date,
        end_date
    );

    const { data: intake_count, error: intake_count_error } =
        await getAllTaskQueueTotaOrderCount();

    const { data: renewal_count, error: renewal_count_error } =
        await getAllTaskQueueTotaRenewalOrderCount();

    const message_task_completion_count =
        await getMessagingTaskCompletionCount();

    const { data: messageCount, status: messageStatus } =
        await getStatusTagTaskCount(StatusTag.ProviderMessage);

    const total_intakes_remaining = intake_count + renewal_count + messageCount;

    return {
        intakes_completed: intakes_completed + renewal_check_ins_completed,
        total_intakes_remaining: total_intakes_remaining,
        message_task_completion_count: message_task_completion_count,
    };
}

function getFormattedDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}

function getStartAndEndDate(): { start_date: string; end_date: string } {
    const now = new Date();
    const start_date = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
    const end_date = now; // Current date

    return {
        start_date: getFormattedDate(start_date),
        end_date: getFormattedDate(end_date),
    };
}

function getStartAndEndDateTimestamps(): {
    start_date: number;
    end_date: number;
} {
    const now = new Date();
    const start_date = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
    const end_date = now; // Current date

    return {
        start_date: start_date.getTime(),
        end_date: end_date.getTime(),
    };
}

function getStartAndEndDateForMonth(monthNumber: number): {
    start_date: string;
    end_date: string;
} {
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error('Month number must be between 1 and 12');
    }

    const currentYear = new Date().getFullYear();
    const start_date = new Date(currentYear, monthNumber - 1, 1); // First day of the specified month
    const end_date = new Date(currentYear, monthNumber, 0); // Last day of the specified month

    return {
        start_date: getFormattedDate(start_date),
        end_date: getFormattedDate(end_date),
    };
}

function getWeeklyTimePeriod(): { start_date: Date; end_date: Date } {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Subtract the number of days since the last Sunday
    const start_date = new Date(today);
    start_date.setDate(today.getDate() - dayOfWeek);

    // Add 7 days to get the end date
    const end_date = new Date(start_date);
    end_date.setDate(start_date.getDate() + 7);

    return { start_date, end_date };
}
