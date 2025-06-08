'use server';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function POST(request: NextRequest) {
    const params = await request.json();
    const user_id = params.user_id;
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(
            'first_name, last_name, date_of_birth, sex_at_birth, address_line1, address_line2, city, state, zip, phone_number, stripe_customer_id, email, text_opt_in'
        )
        .eq('id', user_id)
        .single();

    if (profilesError) {
        console.error('user-profile/user-data error');
        console.error(profilesError, profilesError.message);
    }

    if (!profilesData) {
        return NextResponse.error();
    }

    const personalData = {
        first_name: profilesData.first_name,
        last_name: profilesData.last_name,
        date_of_birth: profilesData.date_of_birth,
        sex_at_birth: profilesData.sex_at_birth,
        address_line1: profilesData.address_line1,
        address_line2: profilesData.address_line2,
        city: profilesData.city,
        state: profilesData.state,
        zip: profilesData.zip,
        phone_number: profilesData.phone_number,
        stripe_customer_id: profilesData.stripe_customer_id,
        email: profilesData.email,
        text_opt_in: profilesData.text_opt_in,
    };

    return NextResponse.json(personalData);
}
