export interface SessionLog {
    start_session_timestamp: string;
    end_session_timestamp: string;
    session_time: number;
}

export interface WeeklySummaryRow {
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

export interface ProviderArrayItem {
    id: string;
    name: string;
    role: 'provider' | 'coordinator' | 'admin';
}

export interface FetchProviderAutomaticSessionLogParams {
    selectedProviderIds: string[];
    selectedDateSessionsHoursTab: string | null;
    selectedTab: number;
    array: ProviderArrayItem[] | CoordinatorArrayItem[];
    timeZone: string;
}

export interface FetchProviderActivityAuditCountsParams {
    selectedProviderIds: string[];
    selectedStartDatePerformanceTab: string | null;
    selectedEndDatePerformanceTab: string | null;
    selectedTab: number;
    array: ProviderArrayItem[] | CoordinatorArrayItem[];
    timeZone: string;
}

export interface FetchProviderWeeklySummaryRowsParams {
    selectedProviderIds: string[];
    selectedStartDateWeeklySummaryTab: string | null;
    selectedEndDateWeeklySummaryTab: string | null;
    selectedTab: number;
    array: ProviderArrayItem[] | CoordinatorArrayItem[];
    timeZone: string;
}

export interface FetchProviderEarningsBreakdownRowsParams {
    selectedProviderIds: string[];
    selectedStartDateEarningsBreakdownTab: string | null;
    selectedEndDateEarningsBreakdownTab: string | null;
    selectedTab: number;
    array: ProviderArrayItem[] | CoordinatorArrayItem[];
    timeZone: string;
}

export interface CoordinatorArrayItem {
    id: string;
    name: string;
    role: 'coordinator' | 'lead-coordinator' | 'admin';
}
