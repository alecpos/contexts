'use server';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    checkForExistingOrderV2,
    getIncompleteGlobalWLOrderPostHrefSwap,
} from '../orders/orders-api';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { OrderType } from '@/app/types/orders/order-types';
import {
    getLatestRenewalOrderForOriginalOrderId,
    updateRenewalOrder,
} from '../renewal_orders/renewal_orders';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';

export async function getIntakeProfileData(id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(
            'first_name, last_name, sex_at_birth, phone_number, stripe_customer_id, intake_completed, text_opt_in, email'
        )
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { data: null, error: profilesError };
    }

    return { data: profilesData, error: null };
}

export async function getProfileIDFromEmail(email: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getProfileIDFromEmail, Error: ',
            profilesError
        );
        return { data: null, error: profilesError };
    }

    return profilesData.id;
}

export async function getUserFromEmail(email: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .limit(1)
        .single();

    if (!data || error) {
        console.error('could not fetch profile for', email);
        return null;
    }

    return data;
}

export async function getFullIntakeProfileData(id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(
            'first_name, last_name, date_of_birth, sex_at_birth, address_line1, address_line2, city, state, zip, phone_number, stripe_customer_id, intake_completed, text_opt_in'
        )
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { data: null, error: profilesError };
    }

    return { data: profilesData, error: null };
}

export async function getProfileDataForProviderLookup(id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(
            'id, first_name, last_name, date_of_birth, sex_at_birth, address_line1, address_line2, city, state, zip, phone_number, stripe_customer_id, intake_completed, text_opt_in, email, license_photo_url, selfie_photo_url'
        )
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { data: null, error: profilesError };
    }

    return { data: profilesData as APProfileData, error: null };
}

export async function updateIntakeCompletedForPatient(customer_id: string) {
    const supabase = createSupabaseServerComponentClient();

    const { error } = await supabase
        .from('profiles')
        .update({ intake_completed: true, intake_completion_time: new Date() })
        .eq('id', customer_id);
}

/**
 * @author Nathan Cho
 * @param id user uuid
 * @returns Object with state and error
 */
export async function getUserState(id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('state')
        .eq('id', id)
        .limit(1)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { state: null, error: profilesError };
    }

    return { state: profilesData.state, error: null };
}

export async function getCurrentUserState() {
    const supabase = createSupabaseServiceClient();

    const id = (await readUserSession()).data.session?.user.id;

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('state')
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { state: null, error: profilesError };
    }

    return { state: profilesData.state, error: null };
}

export async function getCurrentUserSexAtBirth() {
    const supabase = createSupabaseServiceClient();

    const id = (await readUserSession()).data.session?.user.id;

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('sex_at_birth')
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { sex_at_birth: null, error: profilesError };
    }

    return { sex_at_birth: profilesData.sex_at_birth, error: null };
}

export async function getUserName(id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('first_name,last_name')
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { first_name: null, last_name: null, error: profilesError };
    }

    return {
        first_name: profilesData.first_name,
        last_name: profilesData.last_name,
        error: null,
    };
}

export async function updateUserState(id: string, state_of_residence: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .update({ state: state_of_residence })
        .eq('id', id);

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { error: profilesError };
    }

    // Update state in orders
    const shippingInformation: ShippingInformation = {
        address_line1: '',
        address_line2: '',
        city: '',
        zip: '',
        state: state_of_residence,
    };

    return { error: null };
}

export async function updateCurrentUserSexAtBirth(sex_at_birth: string) {
    const supabase = createSupabaseServiceClient();

    const id = (await readUserSession()).data.session?.user.id;

    const { error: profilesError } = await supabase
        .from('profiles')
        .update({ sex_at_birth: sex_at_birth })
        .eq('id', id);

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { error: profilesError };
    }

    return { error: null };
}

/**
 * @author Nathan Cho
 * @param id user uuid
 * @returns Object with dob and error
 */
export async function getUserDateOfBirth(id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('date_of_birth')
        .eq('id', id)
        .single();

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { dob: null, error: profilesError };
    }

    return { dob: profilesData.date_of_birth, error: null };
}

export async function updateUserDateOfBirth(id: string, dob: string) {
    const supabase = createSupabaseServiceClient();

    const date = new Date(dob);
    const isoString = date.toISOString();

    const { error: profilesError } = await supabase
        .from('profiles')
        .update({ date_of_birth: isoString })
        .eq('id', id);

    if (profilesError) {
        console.log(
            'Controller tablename: profiles, method: getIntakeProfileData, Error: ',
            profilesError
        );
        return { error: profilesError };
    }

    return { error: null };
}

/**
 * @author Nathan Cho
 * @description Returns singular user Id value string or null if no user id was found using that
 */
export async function getUserIdFromDoseSpotId(
    doseSpotId: string
): Promise<{ id: string | null; error: any | null }> {
    //This method is accessed in a database controller from server.
    const supabase = createSupabaseServiceClient();

    const { data: userIdData, error: userIdFetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('dose_spot_id', doseSpotId)
        .single();

    if (userIdFetchError) {
        console.log(
            'Controller tablename: profiles, method: getUserIdFromDoseSpotId, Error: ',
            userIdFetchError
        );
        return { id: null, error: userIdFetchError };
    }

    return { id: userIdData.id, error: null };
}

export async function getPatientHeightColumnValue(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('height')
        .eq('id', patient_id)
        .limit(1)
        .single();

    if (error) {
        return null;
    }

    return data.height;
}

/**
 * @author Nathan Cho
 * @param stripeId - stripe ID for customer
 * @param uuid - customer uuid
 * @returns message indicating success or failure
 */
export async function updateStripeCustomerId(stripeId: string, uuid: string) {
    const supabase = createSupabaseServiceClient();

    const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeId })
        .eq('id', uuid);

    if (updateError) {
        console.log(updateError.message);
        return 'error';
    } else {
        return 'success';
    }
}

/**
 * @author Nathan Cho
 * @param uuid - user uuid
 * @returns data containing stripe Id for customer uuid.
 */
export async function getCustomerStripeId(uuid: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', uuid)
        .single();

    if (error) {
        console.log(
            'Controller tablename: profiles, method: getCustomerStripeId, Error: ',
            error
        );
        return { data: null, error: error };
    } else {
        return { data: data, error: null };
    }
}

export async function getUserProfile(uuid: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uuid)
        .single();

    if (error) {
        console.log(
            'Controller tablename: profiles, method: getCustomerStripeId, Error: ',
            error
        );
        return null;
    } else {
        return data as ProfilesSBR;
    }
}

export async function getCustomerIdWithStripeId(stripe_customer_id: string) {
    //Method accessed by api route
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', stripe_customer_id)
        .maybeSingle();

    if (error || !data || !data.id) {
        console.log(
            'Controller tablename: profiles, method: getCustomerStripeId, Error: ',
            error
        );
        return { user_id: null, error: error };
    } else {
        return { user_id: data.id, error: null };
    }
}

/**
 * @author Nathan Cho
 * @param uuid - customer uuid
 * @returns the demographic information of the customer. (name, dob, sex, address, phone number, email)
 */
export async function getCustomerDemographicInformationById(uuid: string) {
    //method accessed inside API route for Curexa / GGM
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select(
            `
            id,
            first_name, 
            last_name, 
            date_of_birth, 
            sex_at_birth, 
            address_line1, 
            address_line2,
            city,
            state,
            zip,
            phone_number,
            email
            `
        )
        .eq('id', uuid)
        .maybeSingle();

    if (error) {
        console.log(
            'Controller tablename: profiles, method: getCustomerDemographicInformationById, Error: ',
            error
        );
        return { data: null, error: error };
    } else {
        return { data: data, error: null };
    }
}

export async function getCustomerFirstNameById(uuid: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', uuid)
        .maybeSingle();

    if (!data || error) {
        console.log(
            'Controller tablename: profiles, method: getCustomerFirstNameById, Error: ',
            error
        );
        return { first_name: null, error: error };
    } else {
        return { first_name: data?.first_name, error: null };
    }
}

/**
 * @author Nathan Cho
 * @param uuid - user id
 * @returns
 */
export async function getAccountProfileData(uuid: string) {
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('profiles')
        .select(
            'first_name, last_name, license_photo_url, selfie_photo_url, address_line1, address_line2, city, state, zip, phone_number, sex_at_birth, date_of_birth'
        )
        .eq('id', uuid)
        .single();

    if (error) {
        console.log(
            'Controller tablename: profiles, method: getAccountProfileData, Error: ',
            error
        );
    } else {
        return data;
    }
}

/**
 * @author Nathan Cho
 * @param data - data to update with (first_name, last_name, phone_number)
 * @param uuid - uuid of customer to update.
 * @returns
 */
export async function updateProfileData(
    data: AccountNameEmailPhoneData,
    uuid: string
) {
    const supabase = createSupabaseServerComponentClient();
    // Create an object to hold the fields to update

    const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', uuid);

    if (updateError) {
        console.log(
            'Controller tablename: profiles, method: updateProfileData, Error: ',
            updateError
        );
        return 'error';
    } else {
        return 'success';
    }
}

/**
 * @author Nathan Cho
 * @param data
 * @param uuid
 * @returns
 */
export async function updateShippingInformation(
    data: ShippingInformation,
    uuid: string | undefined
) {
    if (!uuid) {
        console.error(
            'Could not update shipping information - no user id found'
        );
        return 'error';
    }
    const supabase = createSupabaseServerComponentClient();
    const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city: data.city,
            state: data.state,
            zip: data.zip,
            personal_data_recently_changed: true,
        })
        .eq('id', uuid);

    if (updateError) {
        console.log(
            'Controller tablename: profiles, method: updateShippingInformation, Error: ',
            updateError
        );
        return 'error';
    }

    let order_id: number;

    if (data.product_href === 'weight-loss') {
        const existing_order_data =
            await getIncompleteGlobalWLOrderPostHrefSwap(uuid);
        order_id = existing_order_data?.id ?? 0;
    } else {
        const { data: existing_order_data, error: existing_order_check_error } =
            await checkForExistingOrderV2(uuid, data.product_href || '');

        order_id = existing_order_data?.id;
    }

    if (order_id && order_id !== 0) {
        const { data: orderUpdateData, error: orderUpdateError } =
            await supabase
                .from('orders')
                .update({
                    address_line1: data.address_line1,
                    address_line2: data.address_line2,
                    city: data.city,
                    state: data.state,
                    zip: data.zip,
                })
                .eq('id', order_id);

        if (orderUpdateError) {
            console.log(
                'Controller tablename: orders, method: updateShippingInformation, Error: ',
                orderUpdateError
            );
            return 'error';
        }
    }
    return 'success';
}

export async function updateUserProfileData(form: ProfileData, id: string) {
    const supabase = await createSupabaseServerComponentClient();

    //Submit Form information to supabase and update the user profile with specific profile data.
    const { data, error } = await supabase
        .from('profiles')
        .update({
            updated_at: new Date(),
            first_name: form.first_name,
            last_name: form.last_name,
            ...(form.sex_at_birth ? { sex_at_birth: form.sex_at_birth } : {}),
            phone_number: form.phone_number,
            personal_data_recently_changed: true,
            text_opt_in: form.text_opt_in,
        })
        .eq('id', id);

    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateUserProfileWithPhotoURL(
    userId: string,
    licensePhotoUrl?: string,
    selfiePhotoUrl?: string
) {
    const supabase = await createSupabaseServerComponentClient();

    // Create an object to hold the updates
    const updates: licenseSelfieUpdateObject = {};

    // Add licensePhotoUrl to updates if it exists
    if (licensePhotoUrl) {
        updates.license_photo_url = licensePhotoUrl;
    }

    // Add selfiePhotoUrl to updates if it exists
    if (selfiePhotoUrl) {
        updates.selfie_photo_url = selfiePhotoUrl;
    }

    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
        console.log('No updates to apply.');
        return;
    }

    // Perform the update
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    console.log('Profile updated successfully!', data);
}

// /**
//  *
//  * @param newAnswers The new answers object
//  * @param id customer id
//  */
// export async function updateHealthHistoryContinueAnswers(
//     newAnswers: any,
//     id: string
// ) {
//     const supabase = await createSupabaseServerComponentClient();
//     const { error } = await supabase
//         .from('profiles')
//         .update({ health_history_response: newAnswers })
//         .eq('id', id);

//     if (error) {
//         console.log(
//             'Controller tablename: profiles, method: updateHealthHistoryContinueAnswers, Error: ',
//             error
//         );
//     }
// }

export async function getProfilesCreatedAfterDate(afterDate: Date) {
    //method used in Admin portal
    const supabase = createSupabaseServiceClient();

    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .not('email', 'ilike', '%@test.com')
        .not('email', 'ilike', '%.test');

    if (error) {
        console.error(error);
        return [];
    }

    const filteredUsers = users.filter(
        (user) => new Date(user.created_at) > afterDate
    );

    return filteredUsers;
}

export async function getProfilesCreatedAfterDateWithFirstName(
    afterDate: Date
) {
    //method used in admin portal
    const supabase = createSupabaseServiceClient();

    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('first_name', null)
        .not('email', 'ilike', '%@test.com')
        .not('email', 'ilike', '%.test');

    if (error) {
        console.error(error);
        return [];
    }

    const filteredUsers = users.filter(
        (user) => new Date(user.created_at) > afterDate
    );

    return filteredUsers;
}

export async function getSideProfileData(uid: string) {
    const supabase = await createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('profiles')
        .select(
            'first_name, selfie_photo_url, sex_at_birth, right_side_profile_url,left_side_profile_url'
        )
        .eq('id', uid)
        .single();

    if (!error) {
        return {
            selfie: data.selfie_photo_url,
            name: data.first_name,
            gender: data.sex_at_birth,
            rightSideFace: data.right_side_profile_url,
            leftSideFace: data.left_side_profile_url,
        };
    } else {
        return {
            license: null,
            selfie: null,
            name: null,
        };
    }
}

export async function getIDVerificationData(uid: string) {
    const supabase = await createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('first_name, license_photo_url, selfie_photo_url, sex_at_birth')
        .eq('id', uid)
        .single();

    if (!error) {
        return {
            license: data.license_photo_url,
            selfie: data.selfie_photo_url,
            name: data.first_name,
            gender: data.sex_at_birth,
        };
    } else {
        return {
            license: null,
            selfie: null,
            name: null,
        };
    }
}
export async function getShippingInformationData(
    user_id: string | undefined
): Promise<ShippingInformation> {
    if (!user_id || user_id === '') {
        return {
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            zip: '',
        };
    }

    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('address_line1, address_line2, city, state, zip')
        .eq('id', user_id)
        .single();

    if (!error) {
        return {
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city: data.city,
            state: data.state,
            zip: data.zip,
        };
    }
    return {
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip: '',
    };
}

/**
 *
 * Set: Admin all patients functions:
 *
 * Use - provider portal all patient lookup / individual patient management.
 *
 */

/**
 *
 * Used in All-patients page to fetch a list of all possible patients to admin.
 * @returns valid profile list
 */
export async function getAllProfiles() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select(
            'id, first_name, last_name, intake_completion_time, phone_number, state, email, sex_at_birth, date_of_birth, created_at'
        )
        .neq('first_name', null)
        .not('email', 'ilike', '%@test.com')
        .not('email', 'ilike', '%.test')
        .limit(100)
        .order('created_at', { ascending: false });

    if (error) {
        return { profiles: null, error: error };
    }

    return { profiles: data, error: null };
}

/**
 *
 * Used in All-patients page to fetch a list of all possible patients to admin.
 * @returns valid profile list
 */
export async function searchProfilesUsingValue(searchValue: string[]) {
    const supabase = createSupabaseServiceClient();

    // Start with the base query
    let query = supabase
        .from('profiles')
        .select(
            'id, first_name, last_name, intake_completion_time, phone_number, state, email, sex_at_birth, date_of_birth, created_at'
        )
        .neq('first_name', null)
        .not('email', 'ilike', '%@test.com')
        .not('email', 'ilike', '%.test')
        .limit(100);

    // Add an AND condition for each search value
    searchValue.forEach((value) => {
        // Escape special characters in the search value
        const escapedValue = value.replace(/[%_]/g, '\\$&');

        // For each search value, any of the fields can match (OR between fields, AND between values)
        query = query.or(
            `first_name.ilike.%${escapedValue}%,last_name.ilike.%${escapedValue}%,email.ilike.%${escapedValue}%`
        );
    });

    // Add the final ordering
    const { data, error } = await query.order('created_at', {
        ascending: false,
    });

    if (error) {
        return { profiles: null, error: error };
    }

    return { profiles: data, error: null };
}

export async function adminEditAccountInformation(
    newProfileData: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        date_of_birth: string;
    },
    user_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...newProfileData,
        })
        .eq('id', user_id);

    if (error) {
        return { error: error };
    }

    return { error: null };
}

export async function adminEditOrderAddressInformation(
    newAddressData: {
        address_line1: string;
        address_line2: string;
        city: string;
        state: string;
        zip: string;
    },
    orderData: any,
    orderType: OrderType
) {
    const supabase = createSupabaseServiceClient();

    const originalOrderId =
        orderType === OrderType.Order
            ? orderData.id
            : orderData.original_order_id;

    const user_id =
        orderType === OrderType.Order
            ? orderData.customer_uid
            : orderData.customer_uuid;

    const { data, error } = await supabase
        .from('orders')
        .update({
            ...newAddressData,
        })
        .eq('id', originalOrderId);

    if (orderType === OrderType.Order) {
        await identifyUser(orderData.customer_uid, {
            stateAddress: newAddressData.state,
        });
    }

    if (orderType === OrderType.RenewalOrder) {
        const latestRenewalOrder =
            await getLatestRenewalOrderForOriginalOrderId(originalOrderId);

        if (!latestRenewalOrder) {
            return;
        }

        const renewalDetails = getOrderStatusDetails(
            latestRenewalOrder.order_status
        );

        await identifyUser(latestRenewalOrder.customer_uuid, {
            stateAddress: newAddressData.state,
        });

        if (renewalDetails.isPrescribed) {
            // setting prescription_json to null to force system to regenerate script for new address
            await updateRenewalOrder(latestRenewalOrder.id, {
                ...newAddressData,
                prescription_json: null,
            });
        }

        await updateRenewalOrder(latestRenewalOrder.id, { ...newAddressData });
    }

    await updateProfileData({ ...newAddressData }, user_id);

    // Check if should update for latest renewal order
    // const { data: renewalOrder, error: renewalOrdersError } = await supabase
    //     .from('renewal_orders')
    //     .select('id, order_status')
    //     .eq('original_order_id', order_id)
    //     .order('id', { ascending: false })
    //     .limit(1)
    //     .maybeSingle();

    // if (renewalOrdersError) {
    //     console.error(
    //         'Error getting renewal orders for adminEditOrderAddressInformation',
    //         order_id,
    //     );
    // }

    // if (
    //     renewalOrder?.order_status !==
    //         RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid &&
    //     renewalOrder?.order_status !==
    //         RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1 &&
    //     renewalOrder?.order_status !==
    //         RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2 &&
    //     renewalOrder?.order_status !== RenewalOrderStatus.PharmacyProcessing
    // ) {
    //     await supabase
    //         .from('renewal_orders')
    //         .update({ ...newAddressData })
    //         .eq('id', renewalOrder?.id);
    // }
}

export async function updateCurrentProfileHeight(
    height_in_inches: number,
    user_id?: string
) {
    const supabase = createSupabaseServiceClient();

    const patient_id =
        user_id ?? (await readUserSession()).data.session?.user.id;

    const { error } = await supabase
        .from('profiles')
        .update({
            height: height_in_inches,
        })
        .eq('id', patient_id);

    if (error) {
        console.error('updateCurrentProfileHeight', error);
    }
}
