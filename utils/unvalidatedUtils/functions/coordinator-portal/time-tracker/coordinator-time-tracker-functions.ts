'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import {
    endSession,
    getCoordinatorActivityAuditCountsBetweenDates,
    getCoordinatorAutomaticSessionTimes,
    getCoordinatorSessionRecord,
} from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';
import {
    CoordinatorTimeTrackerArrayItem,
    FetchCoordinatorActivityAuditCountsParams,
    FetchCoordinatorAutomaticSessionLogParams,
    FetchCoordinatorWeeklySummaryRowsParams,
    SessionLogCTT,
    WeeklySummaryRowCTT,
} from './coordinator-time-tracker-types';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Returns true if the coordinator has a session currently active that is valid.
 * Returns false if the coordinator will not have a session after this function resolves.
 * @param coordinator_id
 * @returns
 */
export async function checkCoordinatorSessionStatus(
    coordinator_id: string
): Promise<boolean> {
    const coordinator_activity_stream = await getCoordinatorSessionRecord(
        coordinator_id
    );

    try {
        if (!coordinator_activity_stream) {
            //if there is no activity stream that indicates there is no start_session event for the current coordinator.
            //In that event, return false to allow coordinator to start a session.
            return false;
        }

        if (coordinator_activity_stream[0]?.action === 'end_session') {
            return false;
        } else {
            const lastActivityTime = coordinator_activity_stream[0]!.timestamp;
            const currentTime = Date.now();
            const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

            if (currentTime - lastActivityTime > tenMinutesInMs) {
                console.warn(
                    'Coordinator: ',
                    coordinator_id,
                    ' invoked automated session end at their last completed activity.'
                );

                await endSession(coordinator_id, lastActivityTime);

                return false;
            } else {
                return true;
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getCoordinatorArray(): Promise<
    CoordinatorTimeTrackerArrayItem[]
> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('name, id, role')
        .in('role', [BV_AUTH_TYPE.COORDINATOR, BV_AUTH_TYPE.LEAD_COORDINATOR]);

    if (error) {
        console.log(error);
        return [];
    }

    const filteredData = data.filter(
        (coordinator) =>
            !DUMMY_COORDINATOR_ARRAY_FILTER.includes(coordinator.id)
    );

    return filteredData as CoordinatorTimeTrackerArrayItem[];
}

/**
 * Add UUID's to this list of providers that are not supposed to be shown
 */
const DUMMY_COORDINATOR_ARRAY_FILTER = [''];

export async function fetchCoordinatorAutomaticSessionLogData({
    selectedCoordinatorIds,
    selectedDateSessionsHoursTab,
    selectedTab,
    array,
    timeZone,
}: FetchCoordinatorAutomaticSessionLogParams) {
    if (selectedTab !== 0) {
        return null;
    }

    if (!selectedDateSessionsHoursTab) {
        return null;
    }

    const date = dayjs(selectedDateSessionsHoursTab).tz(timeZone);
    const startOfDay = date.startOf('day');
    const endOfDay = date.endOf('day');

    if (selectedCoordinatorIds.length > 0) {
        const sessionLogs = await Promise.all(
            selectedCoordinatorIds.map(async (coordinatorId) => {
                const logs = await getCoordinatorAutomaticSessionTimes(
                    coordinatorId,
                    startOfDay.toDate(),
                    endOfDay.toDate()
                );
                return { [coordinatorId]: logs };
            })
        );
        const combinedLogs = Object.assign({}, ...sessionLogs);
        const newRows = Object.entries(combinedLogs).flatMap(
            ([coordinatorId, sessions]) => {
                if (!Array.isArray(sessions)) return [];
                return sessions.map(
                    (session: SessionLogCTT, sessionIndex: number) => ({
                        id: coordinatorId + '_' + sessionIndex,
                        employeeName:
                            array.find(
                                (coordinator) =>
                                    coordinator.id === coordinatorId
                            )?.name || 'Unknown',
                        startTime: new Date(
                            session.start_session_timestamp
                        ).toLocaleString('en-US', { timeZone }),
                        endTime: new Date(
                            session.end_session_timestamp
                        ).toLocaleString('en-US', { timeZone }),
                        sessionsDuration: calculateDuration(
                            Number(session.start_session_timestamp),
                            Number(session.end_session_timestamp)
                        ),
                        totalHoursDaily: calculateTotalHours(sessions),
                    })
                );
            }
        );
        newRows.sort(
            (a, b) =>
                new Date(b.startTime).getTime() -
                new Date(a.startTime).getTime()
        );
        return newRows;
    }
    return null;
}

export async function fetchCoordinatorActivityAuditCountsData({
    selectedCoordinatorIds,
    selectedStartDatePerformanceTab,
    selectedEndDatePerformanceTab,
    selectedTab,
    array,
    timeZone,
}: FetchCoordinatorActivityAuditCountsParams): Promise<Record<
    string,
    any
> | null> {
    if (selectedTab !== 1) {
        return null;
    }

    if (!selectedStartDatePerformanceTab || !selectedEndDatePerformanceTab) {
        return null;
    }

    const startDate = dayjs(selectedStartDatePerformanceTab).tz(timeZone);
    const endDate = dayjs(selectedEndDatePerformanceTab).tz(timeZone);
    const startOfDay = startDate.startOf('day');
    const endOfDay = endDate.endOf('day');

    if (selectedCoordinatorIds.length > 0) {
        const actionCounts = await Promise.all(
            selectedCoordinatorIds.map(async (coordinatorId) => {
                const logs =
                    await getCoordinatorActivityAuditCountsBetweenDates(
                        coordinatorId,
                        startOfDay.valueOf(),
                        endOfDay.valueOf()
                    );
                return { [coordinatorId]: logs };
            })
        );
        const sessions = await Promise.all(
            selectedCoordinatorIds.map(async (coordinatorId) => {
                const sessions = await getCoordinatorAutomaticSessionTimes(
                    coordinatorId,
                    startOfDay.toDate(),
                    endOfDay.toDate()
                );
                return { [coordinatorId]: sessions };
            })
        );
        const combinedLogs: Record<string, any> = Object.assign(
            {},
            ...actionCounts
        );
        let newRows = Object.entries(combinedLogs).map(
            ([providerId, actionCounts]) => ({
                id: providerId + '_',
                employeeName:
                    array.find((provider) => provider.id === providerId)
                        ?.name || 'Unknown',
                hoursLogged: 'n/a',
                messagesAnswered:
                    actionCounts?.coordinatorMessagesAnswered || 0,
                fwdPercentage: actionCounts?.forwardPercentage || 'n/a',
            })
        );

        newRows.forEach((row, index) => {
            const coordinatorId = selectedCoordinatorIds[index];
            const coordinatorSessions = sessions.find(
                (s) => Object.keys(s)[0] === coordinatorId
            )?.[coordinatorId];
            row.hoursLogged = calculateTotalHours(coordinatorSessions);
        });

        return newRows;
    }
    return null;
}

export async function fetchCoordinatorWeeklySummaryRowsData({
    selectedCoordinatorIds,
    selectedStartDateWeeklySummaryTab,
    selectedEndDateWeeklySummaryTab,
    selectedTab,
    array,
    timeZone,
}: FetchCoordinatorWeeklySummaryRowsParams) {
    if (selectedTab !== 2) {
        return null;
    }

    if (
        !selectedStartDateWeeklySummaryTab ||
        !selectedEndDateWeeklySummaryTab
    ) {
        return null;
    }

    const startDate = dayjs(selectedStartDateWeeklySummaryTab).tz(timeZone);
    const endDate = dayjs(selectedEndDateWeeklySummaryTab).tz(timeZone);
    const startOfDay = startDate.startOf('day');
    const endOfDay = endDate.endOf('day');

    if (selectedCoordinatorIds.length > 0) {
        const sessionLogs = await Promise.all(
            selectedCoordinatorIds.map(async (coordinatorId) => {
                const logs = await getCoordinatorAutomaticSessionTimes(
                    coordinatorId,
                    startOfDay.toDate(),
                    endOfDay.toDate()
                );
                return { [coordinatorId]: logs };
            })
        );
        const combinedLogs = Object.assign({}, ...sessionLogs);
        const newRows = Object.entries(combinedLogs)
            .map(([coordinatorId, sessions]) => {
                if (!Array.isArray(sessions)) return null;
                const {
                    totalHoursMonday,
                    totalHoursTuesday,
                    totalHoursWednesday,
                    totalHoursThursday,
                    totalHoursFriday,
                    totalHoursSaturday,
                    totalHoursSunday,
                } = calculateTotalHoursMondayThroughFriday(sessions, timeZone);
                return {
                    id: coordinatorId,
                    employeeName:
                        array.find(
                            (coordinator) => coordinator.id === coordinatorId
                        )?.name || 'Unknown',
                    hoursM: totalHoursMonday,
                    hoursT: totalHoursTuesday,
                    hoursW: totalHoursWednesday,
                    hoursTh: totalHoursThursday,
                    hoursF: totalHoursFriday,
                    hoursSa: totalHoursSaturday,
                    hoursSu: totalHoursSunday,
                    weeklyTotal: calculateTotalHours(sessions),
                    weeklyEarnings: 'n/a',
                };
            })
            .filter((row): row is WeeklySummaryRowCTT => row !== null);
        return newRows;
    }
    return null;
}

function getDayOfWeek(unixTimestamp: number, timeZone: string): string {
    const date = new Date(unixTimestamp);
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: timeZone,
    });
    // console.log('formatter.format(date)', formatter.format(date));
    return formatter.format(date);
}

function calculateTotalHoursMondayThroughFriday(sessions: SessionLogCTT[], timeZone: string) {
    let totalMillisecondsMonday = 0;
    let totalMillisecondsTuesday = 0;
    let totalMillisecondsWednesday = 0;
    let totalMillisecondsThursday = 0;
    let totalMillisecondsFriday = 0;
    let totalMillisecondsSaturday = 0;
    let totalMillisecondsSunday = 0;

    for (const entry of sessions) {
        const dayOfWeek = getDayOfWeek(Number(entry.start_session_timestamp), timeZone);
        switch (dayOfWeek) {
            case 'Monday':
                totalMillisecondsMonday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
            case 'Tuesday':
                totalMillisecondsTuesday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
            case 'Wednesday':
                totalMillisecondsWednesday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
            case 'Thursday':
                totalMillisecondsThursday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
            case 'Friday':
                totalMillisecondsFriday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
            case 'Saturday':
                totalMillisecondsSaturday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
            case 'Sunday':
                totalMillisecondsSunday +=
                    Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp);
                break;
        }
    }

    return {
        totalHoursMonday: formatDuration(totalMillisecondsMonday),
        totalHoursTuesday: formatDuration(totalMillisecondsTuesday),
        totalHoursWednesday: formatDuration(totalMillisecondsWednesday),
        totalHoursThursday: formatDuration(totalMillisecondsThursday),
        totalHoursFriday: formatDuration(totalMillisecondsFriday),
        totalHoursSaturday: formatDuration(totalMillisecondsSaturday),
        totalHoursSunday: formatDuration(totalMillisecondsSunday),
    };
}

function formatDuration(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursPart = hours > 0 ? `${hours}h` : '';
    const minutesPart = minutes > 0 ? `${minutes}m` : '';

    return `${hoursPart} ${minutesPart}`.trim();
}

function calculateDuration(start: number, end: number): string {
    const durationMs = end - start;
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

function calculateTotalHours(data: SessionLogCTT[]): string {
    if (!data || data.length === 0) return '0h 0m';

    const totalMilliseconds = data.reduce(
        (total: number, entry: SessionLogCTT) => {
            return (
                total +
                (Number(entry.end_session_timestamp) -
                    Number(entry.start_session_timestamp))
            );
        },
        0
    );

    const totalHours = Math.floor(totalMilliseconds / 3600000);
    const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000);

    return `${totalHours}h ${totalMinutes}m`;
}
