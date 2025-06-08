'use server';

import { StatusTag } from '@/app/types/status-tags/status-types';
import {
    getMonthsIntoRenewalOrderSubscription,
    getRenewalOrder,
} from '../../database/controller/renewal_orders/renewal_orders';
import { getPrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';

export async function getReviewStatusTagForRenewalOrder(
    renewal_order_id: string,
): Promise<StatusTag> {
    const months = await getMonthsIntoRenewalOrderSubscription(
        renewal_order_id,
    );

    if (!months) {
        return StatusTag.Review;
    } else if (months === 1 || months === 2) {
        return StatusTag.ReviewNoPrescribe;
    } else if (months >= 3) {
        return StatusTag.FinalReview;
    }
    return StatusTag.Review;
}
