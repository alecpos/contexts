import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    CHECKIN_NEEDED,
    WL_CHECKIN,
} from '@/app/services/customerio/event_names';
import { logPatientAction } from '../../database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '../../database/controller/patient_action_history/patient-action-history-types';

export async function sendCheckInCustomerIOEvent(
    patient_id: string,
    stripe_subscription_id: string,
    product_href: string,
) {
    const subscription = await getStripeSubscription(stripe_subscription_id);

    const renewalDate = new Date(subscription.current_period_end * 1000);

    const formattedRenewalDate = `${(renewalDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${renewalDate
        .getDate()
        .toString()
        .padStart(2, '0')}/${renewalDate.getFullYear()}`;

    await logPatientAction(patient_id, PatientActionTask.CHECKIN_FORM_SENT, {
        product_href,
    });

    await triggerEvent(patient_id, WL_CHECKIN, {
        checkin_url: `https://app.gobioverse.com/check-up/${product_href}`,
        order_date: formattedRenewalDate,
    });
}
