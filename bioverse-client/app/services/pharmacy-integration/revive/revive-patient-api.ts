'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getReviveIdByPatientId } from '@/app/utils/database/controller/revive_pharmacy_patient_data/revive_pharamacy_patient_data_api';
import { getReviveToken } from './revive-token-api';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

/**
 * Invoking this function for a patient ID will create the revive patient object inside of the revive registry.
 * @param patientId
 * @returns
 */
export async function retrieveOrCreateAndRetrieveRevivePatientData(
    patientId: string
): Promise<RevivePatientObject> {
    /**
     * Procedure:
     * Check if patient exists in revive catalog.
     * If existent, api fetch revive patient.
     *      return api patient.
     * If not existent invoke creation.
     *      return created patient.
     */

    let revive_paient_id = await getReviveIdByPatientId(patientId);

    let { data: patient_data_information, error } =
        await getPatientInformationById(patientId);

    try {
        //If there is no revive patient id associated, create one & get it.
        if (!revive_paient_id) {
            const { revivePatientId } = await createRevivePatient(patientId);
            revive_paient_id = revivePatientId;
        }

        const patient_data = await getRevivePatientDataFromRevive(
            revive_paient_id
        );

        const patient_data_parsed: RevivePatientObject = {
            identification: {
                patient_id: parseInt(revive_paient_id),
            },
            name: {
                last_name:
                    patient_data.profile_direct.last_name ??
                    patient_data_information?.last_name,
                first_name:
                    patient_data.profile_direct.first_name ??
                    patient_data_information?.first_name,
                Suffix: null,
            },
            gender: patient_data.gender === 'male' ? 'M' : 'F',
            DOB:
                patient_data.birthDate ??
                patient_data_information?.date_of_birth,
            species: 'human',
            address: {
                line_1:
                    patient_data.address[0].line[0] ??
                    patient_data_information?.address_line1,
                line_2:
                    patient_data.address[0].line[1] ??
                    patient_data_information?.address_line2 ??
                    null,
                city:
                    patient_data.address[0].city ??
                    patient_data_information?.city,
                state:
                    patient_data.address[0].state ??
                    patient_data_information?.state,
                postal_code:
                    patient_data.address[0].postalCode ??
                    patient_data_information?.zip,
            },
            email:
                patient_data.profile_direct.email ??
                patient_data_information?.email,
            phone_primary:
                patient_data.profile_direct.phone_cell ??
                patient_data_information?.phone_number,
        };

        return patient_data_parsed as RevivePatientObject;
    } catch (error) {
        throw error;
    }
}

// async function retrievePatientFromReviveSystem(
//     revivePatientId: string
// ): Promise<RevivePatientObject> {
//     return {};
// }

export async function createRevivePatient(
    patientId: string
): Promise<{ revivePatientId: string }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .limit(1)
        .maybeSingle();

    if (error) {
        throw error;
    }

    const dataAsProfileData: DBPatientData = data;

    const patient_creation_request_body = {
        override_accept_duplicate: true,
        active: true,
        address: [
            {
                country: 'US',
                line: [
                    dataAsProfileData.address_line1,
                    ...(dataAsProfileData.address_line2
                        ? [dataAsProfileData.address_line2]
                        : []),
                ],
                city: dataAsProfileData.city,
                postalCode: dataAsProfileData.zip,
                state: dataAsProfileData.state,
            },
        ],
        birthDate: new Date(dataAsProfileData.date_of_birth).toISOString(),
        communication: [
            {
                language: {
                    coding: [
                        {
                            code: 'en',
                            system: 'urn:ietf:bcp:47',
                        },
                    ],
                },
                preferred: true,
            },
        ],
        name: [
            {
                family: dataAsProfileData.last_name,
                given: [dataAsProfileData.first_name],
                use: 'official',
            },
        ],
        gender: dataAsProfileData.sex_at_birth === 'M' ? 'male' : 'female',
        resourceType: 'Patient',
        telecom: [
            {
                system: 'phone',
                value: dataAsProfileData.phone_number.replace(/\D/g, ''), // strip all non-numeric characters
                use: 'mobile',
            },
            {
                system: 'email',
                value: dataAsProfileData.email,
                use: 'home',
            },
        ],
        clinic_identifier: 'bed973e6-444a-4098-a881-b1990f6ce5c7',
        practitioner_identifier: 'ee6bc798-fb24-40e6-a2bc-267eb7a2e878',
    };

    const revive_token = await getReviveToken();

    const response = await fetch(
        'https://reviverx.pharmetika.com/api/v5/provider_portal/patient/create_new',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-pmk-authentication-token': revive_token,
            },
            body: JSON.stringify(patient_creation_request_body),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to create patient in Revive: ${response.statusText}`
        );
    }

    const result = await response.json();

    const { contact_id, patient_id, success, messages } = result;

    console.log('Revive messages check: ', messages);

    if (!success) {
        throw new Error('Failed to create patient in Revive system');
    }

    const { error: mappingError } = await supabase
        .from('revive_pharmacy_patient_data')
        .insert({
            patient_id: patientId,
            revive_patient_id: patient_id,
        });

    if (mappingError) {
        throw new Error(
            `Failed to store Revive mapping: ${mappingError.message}`
        );
    }

    return {
        revivePatientId: patient_id,
    };
}

async function getRevivePatientDataFromRevive(revivePatientId: string) {
    const revive_token = await getReviveToken();

    const response = await fetch(
        `https://reviverx.pharmetika.com/api/v5/provider_portal/patient/${revivePatientId}/fhir/Patient`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-pmk-authentication-token': revive_token,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch patient data from Revive: ${response.statusText}`
        );
    }

    const patientData = await response.json();
    return patientData;
}

/**
 * changePatientAddressInReviveIfNecessary()
 * First checks if they have a revive id in revive_pharmacy_patient_data, and if so, it will create a new address in Revive for them and set the new address as primary.
 * @returns void
 */
export async function changePatientAddressInReviveIfNecessary(
    patient_id: string,
    new_address_payload: any,
    order_id: string
) {
    if (!order_id) {
        return;
    }

    const supabase = createSupabaseServiceClient();

    //first check if there is a row with the patient_id in the revive_pharmacy_patient_data table
    const { data, error } = await supabase
        .from('revive_pharmacy_patient_data')
        .select('*')
        .eq('patient_id', patient_id)
        .limit(1)
        .maybeSingle();

    if (!data) {
        console.log(
            `Patient (${patient_id} does not have a revive_patient_id, will not update any addresses in Revive`
        );
        return; //if they don't have a revive_patient_id, then we can't update their address in revive
    }

    const revive_patient_id = data?.revive_patient_id;

    if (!revive_patient_id) {
        console.log(
            `Patient (${patient_id} does not have a revive_patient_id, will not update any addresses in Revive`
        );

        await forwardOrderToEngineering(
            order_id,
            patient_id,
            `Patient has a row in revive_pharmacy_patient_data but no revive patient id`
        );
        return;
    }
    // const currentpatientdata = await getRevivePatientDataFromRevive(revive_patient_id);
    // console.log("currentpatientdata.address: ", currentpatientdata.address);
    // console.log("currentpatientdata: ", currentpatientdata);
    // return;

    const reviveAddressObj = {
        data: {
            line_1: new_address_payload.address_line1,
            line_2: new_address_payload.address_line2,
            line_3: '',
            postal_code: new_address_payload.zip,
            city: new_address_payload.city,
            state: new_address_payload.state,
            country: 'US',
            patient_id: revive_patient_id,
            address_type: 'primary',
            primary_address: 1, //set the new address as their primary address
            data: {},
        },
    };

    const revive_token = await getReviveToken();

    const response = await fetch(
        `https://reviverx.pharmetika.com/api/v5/provider_portal/patient/${revive_patient_id}/address/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-pmk-authentication-token': revive_token,
            },
            body: JSON.stringify(reviveAddressObj),
        }
    );

    if (!response.ok) {
        await forwardOrderToEngineering(
            order_id,
            patient_id,
            `Failed to update patient address in Revive: ${response.statusText}`
        );

        return;
    }

    const result = await response.json();
    console.log('result: ', result);
    return;
}
