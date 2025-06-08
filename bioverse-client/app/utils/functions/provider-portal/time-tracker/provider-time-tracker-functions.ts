'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import {
    endSession,
    getProviderActivityAuditCountsBetweenDates,
    getProviderEstimatedPaymentBetweenDatesV2Verbose,
} from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import {
    ProviderArrayItem,
    FetchProviderAutomaticSessionLogParams,
    SessionLog,
    FetchProviderActivityAuditCountsParams,
    FetchProviderWeeklySummaryRowsParams,
    WeeklySummaryRow,
    FetchProviderEarningsBreakdownRowsParams,
} from './provider-time-tracker-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export async function endSessionAndSignOutUser(provider_id: string) {
    await endSession(provider_id);
    await signOutUser();
}

/**
 * Looks at the 'logged_in' and 'logged_out' actions in the provider_activity_audit table
 */
export async function getProviderAutomaticSessionLog(
    provider_id: string,
    start_time: number,
    end_time: number
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_provider_automatic_session_times_v2',
        {
            provider_id_: provider_id,
            start_date: start_time,
            end_date: end_time,
        }
    );

    const filteredData = data?.filter((item: any) => item.session_time > 0.05); //only sessions that are more than 5 seconds long

    if (error) {
        console.log('Error fetching provider automatic session log', error);
        return [];
    }

    return filteredData;
}

export async function getRegisteredNurseArray() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('name, id, role')
        .in('role', [BV_AUTH_TYPE.REGISTERED_NURSE]);

    if (error) {
        console.log(error);
        return [];
    }

    const filteredData = data.filter(
        (provider) => !DUMMY_PROVIDER_ARRAY_FILTER.includes(provider.id)
    );

    return filteredData as ProviderArrayItem[];
}

/**
 *
 * Returns the list of active providers that are either lead or normal provider.
 *
 * @param auth_type authorization level used to filter
 * @returns
 */
export async function getProviderArray() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('providers')
        .select('name, id, role')
        .in('role', [BV_AUTH_TYPE.LEAD_PROVIDER, BV_AUTH_TYPE.PROVIDER]);

    if (error) {
        console.log(error);
        return [];
    }

    const filteredData = data.filter(
        (provider) => !DUMMY_PROVIDER_ARRAY_FILTER.includes(provider.id)
    );

    return filteredData as ProviderArrayItem[];
}

/**
 * Add UUID's to this list of providers that are not supposed to be shown
 */
const DUMMY_PROVIDER_ARRAY_FILTER = [
    '51da5013-ff39-4714-937b-c6c36dbf0c15', //Bobby Desai
    '2325cc51-8e98-4aff-9a16-0cd81096a5df', //German Excheverry
    '8e8041bb-cdbc-4a7a-ab96-39bd76fd9583', //Autoship
    '6b9465fe-442d-4c71-bd9e-2a515c8e1d59', //Alice Greene
];

export async function fetchProviderAutomaticSessionLogData({
    selectedProviderIds,
    selectedDateSessionsHoursTab,
    selectedTab,
    array,
    timeZone,
}: FetchProviderAutomaticSessionLogParams) {
    if (selectedTab !== 0) {
        return null;
    }

    if (!selectedDateSessionsHoursTab) {
        return null;
    }

    const date = dayjs(selectedDateSessionsHoursTab).tz(timeZone); //make sure any date created in a server function is aware of the client's timezone
    const startOfDay = date.startOf('day');
    const endOfDay = date.endOf('day');

    // console.log('selectedDateSessionsHoursTab', selectedDateSessionsHoursTab);
    // console.log('startOfDay', startOfDay);
    // console.log('endOfDay', endOfDay);
    // console.log('startOfDay value', startOfDay.valueOf());
    // console.log('endOfDay value', endOfDay.valueOf());

    if (selectedProviderIds.length > 0) {
        const sessionLogs = await Promise.all(
            selectedProviderIds.map(async (providerId) => {
                const logs = await getProviderAutomaticSessionLog(
                    providerId,
                    startOfDay.valueOf(),
                    endOfDay.valueOf()
                );
                return { [providerId]: logs };
            })
        );
        const combinedLogs = Object.assign({}, ...sessionLogs);
        const newRows = Object.entries(combinedLogs).flatMap(
            ([providerId, sessions]) => {
                if (!Array.isArray(sessions)) return [];
                return sessions.map(
                    (session: SessionLog, sessionIndex: number) => ({
                        id: providerId + '_' + sessionIndex,
                        employeeName:
                            array.find((provider) => provider.id === providerId)
                                ?.name || 'Unknown',
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

export async function fetchProviderActivityAuditCountsData({
    selectedProviderIds,
    selectedStartDatePerformanceTab,
    selectedEndDatePerformanceTab,
    selectedTab,
    array,
    timeZone,
}: FetchProviderActivityAuditCountsParams): Promise<Record<
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

    if (selectedProviderIds.length > 0) {
        const actionCounts = await Promise.all(
            selectedProviderIds.map(async (providerId) => {
                const logs = await getProviderActivityAuditCountsBetweenDates(
                    providerId,
                    startOfDay.valueOf(),
                    endOfDay.valueOf()
                );
                return { [providerId]: logs };
            })
        );
        const sessions = await Promise.all(
            selectedProviderIds.map(async (providerId) => {
                const sessions = await getProviderAutomaticSessionLog(
                    providerId,
                    startOfDay.valueOf(),
                    endOfDay.valueOf()
                );
                return { [providerId]: sessions };
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
                messagesAnswered: actionCounts?.providerMessages || 0,
                intakesCompleted:
                    (actionCounts?.providerIntakesHandled || 0) +
                    (actionCounts?.providerRenewalsHandled || 0) +
                    (actionCounts?.providerCheckinsHandled || 0),
                fwdPercentage: 'n/a',
            })
        );

        newRows.forEach((row, index) => {
            const providerId = selectedProviderIds[index];
            const providerSessions = sessions.find(
                (s) => Object.keys(s)[0] === providerId
            )?.[providerId];
            row.hoursLogged = calculateTotalHours(providerSessions);
        });

        return newRows;
    }
    return null;
}

export async function fetchProviderWeeklySummaryRowsData({
    selectedProviderIds,
    selectedStartDateWeeklySummaryTab,
    selectedEndDateWeeklySummaryTab,
    selectedTab,
    array,
    timeZone,
}: FetchProviderWeeklySummaryRowsParams) {
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

    if (selectedProviderIds.length > 0) {
        const sessionLogs = await Promise.all(
            selectedProviderIds.map(async (providerId) => {
                const logs = await getProviderAutomaticSessionLog(
                    providerId,
                    startOfDay.valueOf(),
                    endOfDay.valueOf()
                );
                return { [providerId]: logs };
            })
        );

        const providerEarningsBreakdownArray = await Promise.all(
            selectedProviderIds.map(async (providerId) => {
                const logs =
                    await getProviderEstimatedPaymentBetweenDatesV2Verbose(
                        providerId,
                        startOfDay.valueOf(),
                        endOfDay.valueOf()
                    );
                return { [providerId]: logs };
            })
        );
        // console.log("providerEarningsBreakdown inside weekly summary: ", providerEarningsBreakdownArray)

        const combinedLogs = Object.assign({}, ...sessionLogs);
        const newRows = Object.entries(combinedLogs)
            .map(([providerId, sessions]) => {
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
                    id: providerId,
                    employeeName:
                        array.find((provider) => provider.id === providerId)
                            ?.name || 'Unknown',
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
            .filter((row): row is WeeklySummaryRow => row !== null);

        //loop through the providerEarningsBreakdown and add the totalPayinPeriod to that provider's .weeklyEarnings property
        newRows.forEach((row, index) => {
            const providerId = selectedProviderIds[index]; //there will always be as many rows as there are selected providers (other than the totals row)
            const providerEarningsBreakdown = providerEarningsBreakdownArray.find(
                (s: any) => Object.keys(s)[0] === providerId
            )?.[providerId];
            row.weeklyEarnings = `$${providerEarningsBreakdown?.totalPayInPeriod.toFixed(2) || 'n/a'}`;
        });


        const totalHoursMonday = newRows.reduce((acc, row) => acc + parseTime(row.hoursM), 0);
        const totalHoursTuesday = newRows.reduce((acc, row) => acc + parseTime(row.hoursT), 0);
        const totalHoursWednesday = newRows.reduce((acc, row) => acc + parseTime(row.hoursW), 0);
        const totalHoursThursday = newRows.reduce((acc, row) => acc + parseTime(row.hoursTh), 0);
        const totalHoursFriday = newRows.reduce((acc, row) => acc + parseTime(row.hoursF), 0);
        const totalHoursSaturday = newRows.reduce((acc, row) => acc + parseTime(row.hoursSa), 0);
        const totalHoursSunday = newRows.reduce((acc, row) => acc + parseTime(row.hoursSu), 0);
        
        const totalsRow = {
            id: 'totals',
            employeeName: 'Totals',
            hoursM: formatMinutesToHM(totalHoursMonday),
            hoursT: formatMinutesToHM(totalHoursTuesday),
            hoursW: formatMinutesToHM(totalHoursWednesday),
            hoursTh: formatMinutesToHM(totalHoursThursday),
            hoursF: formatMinutesToHM(totalHoursFriday),
            hoursSa: formatMinutesToHM(totalHoursSaturday),
            hoursSu: formatMinutesToHM(totalHoursSunday),
            weeklyTotal: formatMinutesToHM(totalHoursMonday + totalHoursTuesday + totalHoursWednesday + totalHoursThursday + totalHoursFriday + totalHoursSaturday + totalHoursSunday),
            weeklyEarnings: 'n/a'
          }
        newRows.push(totalsRow);
        return newRows;
    }
    return null;
}

function parseTime(str: string): number {
    const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?/;
    const match = str.match(regex);
  
    if (!match) return 0;
  
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    return hours * 60 + minutes;
  }
  
  function formatMinutesToHM(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }

export async function fetchProviderEarningsBreakdownRowsData({
    selectedProviderIds,
    selectedStartDateEarningsBreakdownTab,
    selectedEndDateEarningsBreakdownTab,
    selectedTab,
    array,
    timeZone,
}: FetchProviderEarningsBreakdownRowsParams) {
    if (selectedTab !== 3) {
        return null;
    }

    if (
        !selectedStartDateEarningsBreakdownTab ||
        !selectedEndDateEarningsBreakdownTab
    ) {
        return null;
    }

    const startDate = dayjs(selectedStartDateEarningsBreakdownTab).tz(timeZone);
    const endDate = dayjs(selectedEndDateEarningsBreakdownTab).tz(timeZone);
    const startOfDay = startDate.startOf('day');
    const endOfDay = endDate.endOf('day');

    if (selectedProviderIds.length > 0) {
        const providerEarningsBreakdown = await Promise.all(
            selectedProviderIds.map(async (providerId) => {
                const logs =
                    await getProviderEstimatedPaymentBetweenDatesV2Verbose(
                        providerId,
                        startOfDay.valueOf(),
                        endOfDay.valueOf()
                    );
                return { [providerId]: logs };
            })
        );
        const combinedLogs: Record<string, any> = Object.assign(
            {},
            ...providerEarningsBreakdown
        );
        const newRows = Object.entries(combinedLogs).map(
            ([providerId, providerEarningsBreakdown]) => ({
                id: providerId + '_',
                employeeName:
                    array.find((provider) => provider.id === providerId)
                        ?.name || 'Unknown',
                newIntakes:
                    '$' +
                    (providerEarningsBreakdown?.intakesHandled.toFixed(2) || 0),
                renewals:
                    '$' +
                    (providerEarningsBreakdown?.renewalsHandled.toFixed(2) ||
                        0),
                checkins:
                    '$' +
                    (providerEarningsBreakdown?.checkinsHandled.toFixed(2) ||
                        0),
                providerMessages:
                    '$' +
                    (providerEarningsBreakdown?.messagesAnswered.toFixed(2) ||
                        0),
                totalPayForPeriod:
                    '$' +
                    (providerEarningsBreakdown?.totalPayInPeriod.toFixed(2) ||
                        0),
                details: 'n/a',
            })
        );
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
function calculateTotalHoursMondayThroughFriday(
    sessions: SessionLog[],
    timeZone: string
) {
    let totalMillisecondsMonday = 0;
    let totalMillisecondsTuesday = 0;
    let totalMillisecondsWednesday = 0;
    let totalMillisecondsThursday = 0;
    let totalMillisecondsFriday = 0;
    let totalMillisecondsSaturday = 0;
    let totalMillisecondsSunday = 0;

    for (const entry of sessions) {
        const dayOfWeek = getDayOfWeek(
            Number(entry.start_session_timestamp),
            timeZone
        );
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

function calculateTotalHours(data: SessionLog[]): string {
    if (!data || data.length === 0) return '0h 0m';

    const totalMilliseconds = data.reduce(
        (total: number, entry: SessionLog) => {
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
