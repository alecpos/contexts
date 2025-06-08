interface CoordinatorActivityAuditRecord {
    id: number;
    created_at: string;
    coordinator_id: string;
    action: string;
    timestamp: number;
    order_id?: number;
    renewal_order_id?: string;
    metadata?: any;
    environment: string;
}


interface CoordinatorActivityAuditCreateObject {
    coordinator_id: string;
    action: string;
    timestamp: number;
    order_id?: number;
    renewal_order_id?: string;
    metadata?: any;
    environment: string;
}
