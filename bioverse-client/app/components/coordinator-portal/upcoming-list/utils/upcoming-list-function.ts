'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import Stripe from 'stripe';

type UpcomingRenewalStripeData = {
    stripe_id: string;
    renewal_date: Date;
};

/**
 * returns an array of subscription ID's
 * @param daysUntilRenewal number of days until renewal for subscriptions
 * @returns
 */
export async function getUpcomingListFromStripe(
    daysUntilRenewal: number
): Promise<UpcomingRenewalStripeData[]> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const currentDate = new Date();
    const targetDate = new Date(
        currentDate.getTime() + daysUntilRenewal * 24 * 60 * 60 * 1000
    );

    // Convert targetDate to Unix timestamp in seconds
    const targetTimestamp = Math.floor(targetDate.getTime() / 1000);

    try {
        let allSubscriptionStripeData: UpcomingRenewalStripeData[] = [];
        let hasMore = true;
        let startingAfter: string | undefined;

        while (hasMore) {
            const subscriptions = await stripe.subscriptions.list({
                status: 'active',
                expand: ['data.customer'],
                limit: 100,
                current_period_end: {
                    lte: targetTimestamp,
                },
                starting_after: startingAfter,
            });

            allSubscriptionStripeData = allSubscriptionStripeData.concat(
                subscriptions.data.map((sub) => {
                    const renewalDate = new Date(sub.current_period_end * 1000);

                    return {
                        stripe_id: sub.id,
                        renewal_date: renewalDate,
                    };
                })
            );
            hasMore = subscriptions.has_more;

            if (hasMore && subscriptions.data.length > 0) {
                startingAfter =
                    subscriptions.data[subscriptions.data.length - 1].id;
            }
        }

        return allSubscriptionStripeData;
    } catch (error) {
        console.error('Error fetching upcoming renewals:', error);
        throw error;
    }
}

export async function getUpcomingSubscriptionDataFromSupabase() {
    const supabase = createSupabaseServiceClient();

    const stripeData = await getUpcomingListFromStripe(10);

    const { data } = await supabase.rpc('get_upcoming_renewals', {
        stripe_data: stripeData,
    });

    return data;
}
