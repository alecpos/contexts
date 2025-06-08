interface CoordinatorTaskSupabaseRecord {
    id: number;
    created_at: string;
    original_created_at: string;
    order_id: number;
    renewal_order_id?: string;
    completion_status: CoordinatorTaskStatus;
    assigned_coordinator: string;
    type: string;
    environment: string;
}

interface CoordinatorTaskStatusMap {
    pending: 'pending';
    forwarded: 'forwarded';
    completed: 'completed';
}

type CoordinatorTaskStatus = keyof CoordinatorTaskStatusMap;
