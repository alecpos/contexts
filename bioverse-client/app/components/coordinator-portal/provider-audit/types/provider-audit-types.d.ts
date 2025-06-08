interface ProviderOption {
    id: string;
    name: string;
}

interface ProviderActivityAuditData {
    intakes_to_complete: number;
    avg_turnaround: number;
    intakes_overdue: number;
    timestamp: number;
}
