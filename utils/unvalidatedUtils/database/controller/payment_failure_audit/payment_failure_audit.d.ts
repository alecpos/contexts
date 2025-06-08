//SBR stands for Supa-Base Record
interface PaymentFailureAuditSBR {
    id?: string;
    created_at?: string;
    patient_id?: string;
    order_id?: string;
    payment_method_id?: string;
    metadata?: {
        reason: string;
    };
}
