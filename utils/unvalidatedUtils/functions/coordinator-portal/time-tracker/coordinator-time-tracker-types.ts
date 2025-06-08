export interface SessionLogCTT {
    start_session_timestamp: string;
    end_session_timestamp: string;
    session_time: number;
}

export interface WeeklySummaryRowCTT {
    id: string;
    employeeName: string;
    hoursM: string;
    hoursT: string;
    hoursW: string;
    hoursTh: string;
    hoursF: string;
    hoursSa: string;
    hoursSu: string;
    weeklyTotal: string;
    weeklyEarnings: string;
}

export interface CoordinatorTimeTrackerArrayItem {
    id: string;
    name: string;
    role: 'provider' | 'coordinator' | 'admin';
}

export interface FetchCoordinatorAutomaticSessionLogParams {
    selectedCoordinatorIds: string[];
    selectedDateSessionsHoursTab: string | null;
    selectedTab: number;
    array: CoordinatorTimeTrackerArrayItem[];
    timeZone: string;
}

export interface FetchCoordinatorActivityAuditCountsParams {
    selectedCoordinatorIds: string[];
    selectedStartDatePerformanceTab: string | null;
    selectedEndDatePerformanceTab: string | null;
    selectedTab: number;
    array: CoordinatorTimeTrackerArrayItem[];
    timeZone: string;
}

export interface FetchCoordinatorWeeklySummaryRowsParams {
    selectedCoordinatorIds: string[];
    selectedStartDateWeeklySummaryTab: string | null;
    selectedEndDateWeeklySummaryTab: string | null;
    selectedTab: number;
    array: CoordinatorTimeTrackerArrayItem[];
    timeZone: string;
}
