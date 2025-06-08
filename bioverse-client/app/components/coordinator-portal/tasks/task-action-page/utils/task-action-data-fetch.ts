'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import {
    getCompletedCoordinatorTasksCount,
    getCompletedForwardedTasksCount,
    getCoordinatorAutomaticSessionTimes,
} from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import { getStatusTagArrayTaskCount } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

export async function getTaskActionMenuData(user_id: string) {
    const employeeAuthorization = await getEmployeeAuthorization(user_id);

    const currentDate = new Date();
    const this_month_start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const this_month_end = currentDate;

    const [
        pendingCount,
        completedCount,
        forwardedCount,
        messagesOverdueCount,
        hoursLogged,
    ] = await Promise.all([
        getStatusTagArrayTaskCount([
            ...(employeeAuthorization === BV_AUTH_TYPE.LEAD_COORDINATOR
                ? [StatusTag.LeadCoordinator]
                : []),
            StatusTag.AwaitingResponse,
            StatusTag.FollowUp,
            StatusTag.IDDocs,
            StatusTag.Coordinator,
            StatusTag.DoctorLetterRequired,
            // StatusTag.CancelOrderOrSubscription,
        ]),
        getCompletedCoordinatorTasksCount(
            user_id,
            this_month_start,
            this_month_end
        ),
        getCompletedForwardedTasksCount(
            user_id,
            this_month_start,
            this_month_end
        ),
        getStatusTagArrayTaskCount([StatusTag.ReadPatientMessage]),
        getCoordinatorAutomaticSessionTimes(
            user_id,
            this_month_start,
            this_month_end
        ), //uses the times established above.
    ]);

    const totalHoursLogged = hoursLogged.reduce(
        (
            total: number,
            session: {
                end_session_timestamp: number;
                start_session_timestamp: number;
            }
        ) => {
            const sessionDurationSeconds =
                (session.end_session_timestamp -
                    session.start_session_timestamp) /
                1000; // Convert ms to seconds
            const sessionHours = sessionDurationSeconds / 3600; // Convert seconds to hours
            return total + sessionHours;
        },
        0
    );

    console.log('CC and FC', completedCount, forwardedCount);

    // Convert to hours (since session_time appears to be in hours)
    const formattedHoursLogged = totalHoursLogged.toFixed(2);

    return {
        pendingCount,
        completedCount,
        hoursLogged: formattedHoursLogged,
        forwardedCount,
        messagesOverdueCount,
    };
}
