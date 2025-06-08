'use server';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

/**
 * @author Nathan Cho
 * @returns The orders that are needed for the provider order table. Will only return records where assigned_provider are 'null' or equal to the provider's Id.
 */
export async function getAdminOrderManagementData(
    startDate?: Date,
    endDate?: Date,
) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
      *,
      product:products!product_href (
        name
      ),
      patient:profiles!customer_uid (
        first_name,
        last_name,
        date_of_birth,
        address_line1,
        address_line2,
        city,
        zip,
        state,
        phone_number,
        email,
        license_photo_url,
        selfie_photo_url,
        sex_at_birth,
        stripe_customer_id
      )
      `,
        )
        .in('order_status', [
            // 'Unapproved-NoCard', //this and the two below are disabled for early stages until more is added on payment failure paths.
            'Unapproved-CardDown',
            // 'Approved-NoCard',
            'Approved-CardDown',
            'Pending-Customer-Response',
            'Denied-CardDown',
            // 'Denied-NoCard',
            'Approved-NoCard',
            'Payment-Completed',
            'Payment-Declined',
            'Canceled',
            'Incomplete',
            'Approved-NoCard-Finalized',
            'Approved-CardDown-Finalized',
            'Order-Processing',
            'Administrative-Cancel',
        ])
        .eq('environment', process.env.NEXT_PUBLIC_ENVIRONMENT)
        // .or(`assigned_provider.eq.${providerId}, assigned_provider.is.${null}`) //temporarily disabled because maylin cannot see.
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error);
        return { error: error, data: null };
    }

    let filteredData = data;

    if (startDate && endDate) {
        filteredData = data.filter((order) => {
            const orderDate = new Date(order.created_at);
            const isWithinRange =
                orderDate >= (startDate ?? new Date('01-01-2024')) &&
                orderDate <= (endDate ?? new Date());
            return isWithinRange;
        });
    }

    return { data: filteredData, error: null };
}
