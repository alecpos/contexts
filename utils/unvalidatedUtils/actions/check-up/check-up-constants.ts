import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';

export const INVALID_RENEWAL_ORDER_STATSUES_FOR_CHECKUP_COMPLETE = [
    RenewalOrderStatus.Administrative_Canceled,
    RenewalOrderStatus.Canceled,
    RenewalOrderStatus.Denied_Paid,
    RenewalOrderStatus.Denied_Unpaid,
    RenewalOrderStatus.Scheduled_Admin_Cancel,
    RenewalOrderStatus.Scheduled_Cancel,
    RenewalOrderStatus.PharmacyProcessing,
    RenewalOrderStatus.Unknown,
];
