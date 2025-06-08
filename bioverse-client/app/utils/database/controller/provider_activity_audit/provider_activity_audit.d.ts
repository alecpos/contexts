interface ProviderActivityAuditSBR {
    id?: number;
    created_at?: string;
    provider_id?: string;
    action?: string;
    timestamp?: number;
    order_id?: number;
    renewal_order_id?: string;
    metadata?: any;
    environment?: 'prod' | 'dev';
}

interface ProviderActivityAuditRecord {
    id: number;
    created_at: string;
    provider_id: string;
    action: string;
    timestamp: number;
    order_id: number;
    renewal_order_id: string;
    metadata: any;
    environment: 'prod' | 'dev';
}

interface ProviderActivityAuditCreateObject {
    provider_id: string;
    action: string;
    timestamp: number;
    order_id: number;
    renewal_order_id?: string;
    metadata?: any;
    environment: string;
}
