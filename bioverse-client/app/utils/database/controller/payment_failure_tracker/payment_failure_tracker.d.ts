import { PaymentFailureStatus } from './payment_failure_tracker_enums';

interface PaymentFailureTrackerSBR {
    id: number;
    created_at: string;
    order_id: string;
    last_attempted_payment?: string;
    status?: PaymentFailureStatus;
    patient_id: string;
    environment: string;
    invoice_id?: string;
    renewal_order_id?: string;
}
