'use server';
import {
    incrementSinceLastCheckup,
    updateRenewalCount,
    updateSubscriptionLastUsedJSON,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getPatientAllergyAndMedicationData } from '../../../utils/database/controller/clinical_notes/clinical-notes';
import { updateGGMOrderMetadata } from '../../../utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '../../../utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '../../../utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import { getCustomerDemographicInformationById } from '../../../utils/database/controller/profiles/profiles';
import {
    providerAddress,
    providerInfoGermanE,
    providerInfoMeylinC,
    providerListByUUID,
} from '../provider-static-information';
import getGGMToken from './token';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import createNewRenewalOrder from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { ScriptSource } from '@/app/types/orders/order-types';

export async function sendGGMRequest(
    prescriptionData: DoseSpotPrescriptionItemObject,
    order: {
        id: string;
        assigned_provider: string;
        customer_uid: string;
    },
    order_address: {
        address_line1: string;
        address_line2: string;
        state: string;
        zip: string;
        city: string;
    }
) {
    const { token: ggmToken, error: tokenError } = await getGGMToken();
    if (tokenError) {
        console.log('send-request failure.', tokenError);
        SaveJsonUsedToFailureTable(
            null,
            order.id,
            order.assigned_provider,
            'Gogomeds error in generating token.',
            tokenError,
            'ggm',
            ScriptSource.Manual
        );

        return null;
    }

    const { data: patientData, error: demographicDataFetchError } =
        await getCustomerDemographicInformationById(order.customer_uid);

    if (demographicDataFetchError || patientData === null) {
        console.log('send-request failure.', demographicDataFetchError);
        SaveJsonUsedToFailureTable(
            null,
            order.id,
            order.assigned_provider,
            'Gogomeds error in fetching patient data.',
            demographicDataFetchError,
            'ggm',
            ScriptSource.Manual
        );
        return null;
    }

    /**
     * TODO: FIX LATER: Provider logic
     *
     * At the moment this logic will only account for Dr. E and Meylin
     */
    const provider_uuid = order.assigned_provider;

    // Convert the prescription data to the payload format expected by Gogomeds
    const payload = await convertDoseSpotPrescriptionToGGMPayload(
        prescriptionData,
        patientData,
        provider_uuid,
        order.id,
        order_address
    );

    // Define the headers for the request
    const headers = new Headers({
        Authorization: `Bearer ${ggmToken}`,
        'Content-Type': 'application/json',
    });

    // Define the request options
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
    };

    // Send the request
    try {
        const response = await fetch(
            process.env.GGM_SUBMIT_ORDER_URL!,
            requestOptions
        );

        if (!response.ok) {
            SaveJsonUsedToFailureTable(
                payload,
                order.id,
                order.assigned_provider,
                'Gogomeds Error in POST Method while sending order.',
                response,
                'ggm',
                ScriptSource.AutomaticInvoicePaid
            );

            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        updateSubscriptionLastUsedJSON(order.id, 'ggm', payload);

        if (data.success) {
            insertPharmacyOrderAudit(
                JSON.stringify(payload),
                'GGM',
                order.id,
                order.assigned_provider,
                ScriptSource.ConfirmPrescriptionDialog,
                data
            );

            return data;
        } else {
            SaveJsonUsedToFailureTable(
                payload,
                order.id,
                order.assigned_provider,
                'Gogomeds Error in POST Method while sending order. data status returned unsuccessful',
                data,
                'ggm',
                ScriptSource.AutomaticInvoicePaid
            );
            console.error(
                'There was a problem with the fetch operation:',
                data
            );
        }
    } catch (error) {
        // Handle the error
        SaveJsonUsedToFailureTable(
            payload,
            order.id,
            order.assigned_provider,
            'Gogomeds Error in POST Method while sending order. try-catch failure.',
            error,
            'ggm',
            ScriptSource.AutomaticInvoicePaid
        );
        console.error('There was a problem with the fetch operation:', error);
    }

    return null;
}

/**
 *
 * @param affiliateOrderNumber The order number in Bioverse database.
 */
export async function cancelGGMOrder(affiliateOrderNumber: string) {
    const { token: ggmToken, error: tokenError } = await getGGMToken();
    if (tokenError) {
        console.log('send-request failure.', tokenError);
        SaveJsonUsedToFailureTable(
            null,
            'none',
            '',
            'Gogomeds error in generating token.',
            tokenError,
            'ggm',
            ScriptSource.AutomaticInvoicePaid
        );

        return null;
    }

    // Define the headers for the request
    const headers = new Headers({
        Authorization: `Bearer ${ggmToken}`,
        'Content-Type': 'application/json',
    });

    // Define the request options
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
    };

    const response = await fetch(
        `${process.env.GGM_CANCEL_ORDER_URL!}${affiliateOrderNumber}`,
        requestOptions
    );

    const result = await response.json();

    console.log('GGM Order Cancellation result', result);
}

export async function sendGGMRenewalRequest(
    subscription_data: PrescriptionSubscription,
    renewalOrder: RenewalOrder
) {
    //Establish suffix to append to order # to generate new order ID
    const suffix_number = subscription_data.renewal_count + 1;

    //service client bypasses RLS
    const supabase = createSupabaseServiceClient();

    //obtain last used script from subscription record
    const last_used_script: GGMOrder = subscription_data.last_used_script;

    //fetch information regarding the original order
    const { data: order_data, error } = await supabase
        .from('orders')
        .select(
            'customer_uid, subscription_type, product_href, assigned_pharmacy, address_line1, address_line2, state, city, zip'
        )
        .eq('id', subscription_data.order_id)
        .single();

    if (error) {
        console.log('GGM stripe webhook customer and got error: ', error);
        return;
    }

    //obtain most recent customer shipping information
    const { data: customer_shipping_data, error: shipping_error } =
        await supabase
            .from('profiles')
            .select('address_line1, address_line2, state, city, zip')
            .eq('id', order_data.customer_uid)
            .single();

    //catch error
    if (shipping_error || !customer_shipping_data) {
        console.log(
            'GGM stripe webhook customer and got error: ',
            shipping_error
        );
        return;
    }

    const { data: allergyAndMedData, error: allergyMedicationError } =
        await getPatientAllergyAndMedicationData(order_data.customer_uid);

    if (allergyMedicationError) {
        console.log(
            'GGM stripe webhook customer allergy and medication error: ',
            allergyMedicationError
        );
        return;
    }

    //debugging temporarily while we need to stabilize this
    console.log(
        'ggm stripe webhook customer data: ',
        customer_shipping_data,
        'last used script: ',
        last_used_script
    ); //TODO delete this

    // Assuming customer_shipping_data is defined and accessible in this scope
    const new_script: GGMOrder = {
        ...last_used_script,
        AffiliateOrderNumber: subscription_data.order_id + '-' + suffix_number,
        Customer: {
            ...last_used_script.Customer,
            Address: {
                ...last_used_script.Customer.Address,
                Line1:
                    order_data.address_line1 ||
                    customer_shipping_data.address_line1,
                Line2: order_data.address_line2
                    ? order_data.address_line2
                    : customer_shipping_data.address_line1
                    ? customer_shipping_data!.address_line2 ?? ''
                    : '',
                City: order_data.city || customer_shipping_data.city,
                State: order_data.state || customer_shipping_data.state,
                Zip: order_data.zip || customer_shipping_data.zip,
            },
        },
    };

    //TODO delete later, was used for debugging ggm script renewal
    console.log('new ggm script created: ', new_script);

    // Convert the prescriptionData object to JSON
    const payload = JSON.stringify(new_script);

    const { token: ggmToken, error: tokenError } = await getGGMToken();
    if (tokenError) {
        console.log('send-request failure.', tokenError);
        SaveJsonUsedToFailureTable(
            payload,
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            'GGM: Error in POST Method while sending order.',
            null,
            'ggm',
            ScriptSource.AutomaticInvoicePaid
        );

        return null;
    }

    // Define the headers for the request
    const headers = new Headers({
        Authorization: `Bearer ${ggmToken}`,
        'Content-Type': 'application/json',
    });

    // Define the request options
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
    };

    // Send the request
    try {
        const response = await fetch(
            process.env.GGM_SUBMIT_ORDER_URL!,
            requestOptions
        );

        if (!response.ok) {
            SaveJsonUsedToFailureTable(
                payload,
                renewalOrder.renewal_order_id,
                renewalOrder.assigned_provider,
                'GGM: Error in POST Method while sending order.',
                null,
                'ggm',
                ScriptSource.AutomaticInvoicePaid
            );

            return;
        }
        const data = await response.json();

        insertPharmacyOrderAudit(
            JSON.stringify(payload),
            'GGM',
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            ScriptSource.AutomaticInvoicePaid,
            data
        );

        updateSubscriptionLastUsedJSON(
            String(renewalOrder.original_order_id),
            'ggm',
            payload
        );

        if (data.success) {
            //Create and capture the renewal order and populate it into the renewal table.
            await createNewRenewalOrder(
                `${subscription_data.order_id}-${suffix_number}`,
                order_data,
                subscription_data,
                new_script,
                null,
                {
                    city: order_data.city,
                    zip: order_data.zip,
                    state: order_data.state,
                    address_line1: order_data.address_line1,
                    address_line2: order_data.address_line2
                        ? order_data.address_line2
                        : '',
                }
            );

            await incrementSinceLastCheckup(subscription_data.id);

            //increase the renewal count in the subscription
            await updateRenewalCount(
                String(subscription_data.id),
                suffix_number
            );
            return;
        } else {
            SaveJsonUsedToFailureTable(
                payload,
                renewalOrder.renewal_order_id,
                renewalOrder.assigned_provider,
                'GGM: Error in POST Method while sending order. data status returned unsuccessful',
                null,
                'ggm',
                ScriptSource.AutomaticInvoicePaid
            );
            console.error(
                'There was a problem with the fetch operation:',
                data
            );
            return;
        }
    } catch (error) {
        // Handle the error
        SaveJsonUsedToFailureTable(
            payload,
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            'GGM: Error in POST Method while sending order. try-catch failure',
            null,
            'ggm',
            ScriptSource.AutomaticInvoicePaid
        );
        console.error('There was a problem with the fetch operation:', error);
        return;
    }

    return;
}

async function convertDoseSpotPrescriptionToGGMPayload(
    prescriptionData: DoseSpotPrescriptionItemObject,
    patientData: PatientData,
    providerUUID: string, //1 is Dr. E , and 2 is Meylin
    orderId: string,
    order_address: any
) {
    const convertDate = (dateToConvert: string): string => {
        const [year, month, day] = dateToConvert.split('-');
        return `${month}/${day}/${year}`;
    };

    const dob = convertDate(patientData.date_of_birth);

    const { data: allergyAndMedData, error: allergyMedicationError } =
        await getPatientAllergyAndMedicationData(patientData.id);

    //TODO: FIX LATER: Provider logic
    const providerData =
        providerListByUUID[providerUUID as keyof typeof providerListByUUID];

    const convertGender = (gender: string): string => {
        const lowerCaseGender = gender.toLowerCase();
        if (lowerCaseGender === 'male') {
            return 'M';
        } else if (lowerCaseGender === 'female') {
            return 'F';
        } else {
            throw new Error('Invalid gender value');
        }
    };

    let order: GGMOrder = {
        AffiliateOrderNumber: orderId,
        Payment: {
            BillAffiliate: true,
        },
        Customer: {
            AffiliateCustomerNumber: patientData.id,
            FirstName: patientData.first_name,
            LastName: patientData.last_name,
            DOB: dob,
            Gender: convertGender(patientData.sex_at_birth),
            IsPregnant: false,
            PhoneNumber: patientData.phone_number,
            HasMedicalConditions: false,
            ...(allergyAndMedData
                ? {
                      HasAllergies: true,
                      AllergyText: allergyAndMedData.allergies,
                  }
                : { HasAllergies: false }),
            ...(allergyAndMedData
                ? {
                      HasCurrentMedications: true,
                      CurrentMedications: allergyAndMedData.medications,
                  }
                : { HasCurrentMedications: false }),

            Address: {
                Line1: order_address.address_line1 || patientData.address_line1,
                Line2: order_address.address_line2
                    ? order_address.address_line2
                    : 'n/a',
                City: order_address.city,
                State: order_address.state,
                Zip: order_address.zip,
            },
        },
        Drugs: [
            {
                NDC: prescriptionData.NDC,
                Quantity: parseInt(prescriptionData.Quantity),
                PrescriptionSourceId: 1,
                Prescriber: {
                    FirstName: providerData.first_name,
                    LastName: providerData.last_name,
                    NPI: providerData.npi,
                    Address: {
                        Line1: providerAddress.address_line1,
                        City: providerAddress.city,
                        State: providerAddress.state,
                        Zip: providerAddress.zip,
                    },
                },
            },
        ],
    };

    return order;
}

interface PatientData {
    id: any;
    first_name: any;
    last_name: any;
    date_of_birth: any;
    sex_at_birth: any;
    address_line1: any;
    address_line2: any;
    city: any;
    state: any;
    zip: any;
    phone_number: any;
    email: any;
}
