import { searchEmpowerItemCatalogByCode } from '@/app/services/pharmacy-integration/empower/empower-catalog';
import { OrderType } from '@/app/types/orders/order-types';
import { getDiagnosisWithBMIData } from '../../../components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/empower/utils/bmi-diagnosis-functions';
import { getEmpowerCatalogObject } from '@/app/services/pharmacy-integration/empower/empower-variant-product-script-data';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import { getPatientInformationById } from '../../actions/provider/patient-overview';
import { getQuestionAnswersForBMI } from '../../database/controller/clinical_notes/clinical_notes_v2';
import { getResendCount } from '../../database/controller/order_data_audit/order_data_audit_api';

export function generateEmpowerScript(
    patientData: DBPatientData,
    orderData: DBOrderData,
    orderType: OrderType,
    bmi_data?: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    },
    variant_index_data: number = orderData.variant_index,
    custom_order_id?: string
) {
    custom_order_id =
        custom_order_id ??
        (orderType === OrderType.Order
            ? orderData.id
            : orderData.renewal_order_id);

    /**
     * Scripts have key-values that are not repeated within Rx's - defined here.
     */
    const SCRIPT_NON_REPEATED_VARIABLES = {
        clientOrderId: custom_order_id!,
        poNumber: custom_order_id!,
        deliveryService: 'UPS Priority 2-Day',
        allowOverrideDeliveryService: true,
        allowOverrideEssentialCopyGuidance: true,
        lfPracticeId: parseInt(process.env.NEXT_PUBLIC_EPID!),
        referenceFields: '',
    };

    /**
     * Prescriber details have to be loaded continuously per Rx, so defining here.
     */
    const PRESCRIBER_OBJECT = {
        npi: '1013986835',
        stateLicenseNumber: 'ME80459',
        lastName: 'Desai',
        firstName: 'Bobby',
        address: {
            city: 'New York',
            postalCode: '10014',
            countryCode: 'US',
            addressLine1: '875 Washington Street',
            stateProvince: 'NY',
        },
        phoneNumber: '7476668167',
    };

    /**
     * Parse if address line 2 exists, since it cannot be null.
     */
    const addressLineTwo =
        orderType === OrderType.Order
            ? orderData.address_line2
            : orderData.order.address_line2;

    /**
     * Patient object needs to be loaded in for each Rx item.
     */
    const PATIENT_OBJECT: EmpowerPatient = {
        clientPatientId: patientData.id,
        lastName: patientData.last_name,
        firstName: patientData.first_name,
        gender: patientData.sex_at_birth?.charAt(0) ?? 'U',
        dateOfBirth: patientData.date_of_birth,
        address: {
            addressLine1:
                orderType === OrderType.Order
                    ? orderData.address_line1
                    : orderData.order.address_line1,
            addressLine2: addressLineTwo === '' ? null : addressLineTwo,
            city:
                orderType === OrderType.Order
                    ? orderData.city
                    : orderData.order.city,
            stateProvince:
                orderType === OrderType.Order
                    ? orderData.state
                    : orderData.order.state,
            postalCode:
                orderType === OrderType.Order
                    ? orderData.zip
                    : orderData.order.zip,
            countryCode: 'US',
        },
        phoneNumber: patientData.phone_number.replace(/\D/g, ''),
        email: patientData.email,
    };

    /**
     * These details will be consistent throughout all Rx medications added.
     */
    const MEDICATION_STATIC_VARIABLES = {
        refills: '0',
        writtenDate: new Date().toISOString().split('T')[0],
        note: 'From Bioverse, Supervising physician: Dr. Bobby Desai, MD',
    };

    /**
     * 12/11/24 new method of fetching Empower Catalog Instruction Object.
     * Fetches an object that interacts with the below code to generate the script.
     */
    const variant_index_script_instructions = getEmpowerCatalogObject(
        orderData.product_href as PRODUCT_HREF,
        variant_index_data ?? orderData.variant_index
    );

    const newRxArrayConstructed: EmpowerNewRx[] = [];

    const sigs_list: string[] = [];

    let diagnosis_obtained;
    diagnosis_obtained = getDiagnosisWithBMIData(bmi_data);

    //construct Diagnosis Object
    const diagnosis: EmpowerDiagnosis =
        diagnosis_obtained.code !== ''
            ? {
                  clinicalInformationQualifier: 0,
                  primary: {
                      code: diagnosis_obtained.code,
                      qualifier: 0,
                      description: diagnosis_obtained.description,
                  },
              }
            : {
                  clinicalInformationQualifier: 0,
                  primary: {
                      code: 'E66.9',
                      qualifier: 0,
                      description: 'Obesity',
                  },
              };

    if (
        variant_index_script_instructions &&
        variant_index_script_instructions.array
    ) {
        /**
         * Iterating through the instructions object to create the Rx's array for the script.
         */
        variant_index_script_instructions.array.forEach(
            (rxItemInstruction: ScriptInstruction) => {
                const catalogItemData = searchEmpowerItemCatalogByCode(
                    rxItemInstruction.catalogItemCode
                );

                const newMedicationItem: EmpowerMedication = {
                    ...MEDICATION_STATIC_VARIABLES,
                    ...catalogItemData,
                    quantity: `${rxItemInstruction.quantity}`,
                    sigText: rxItemInstruction.sigText,
                    daysSupply: `${rxItemInstruction.daysSupply}`,
                    diagnosis: diagnosis,
                };

                const newRxItem: EmpowerNewRx = {
                    medication: newMedicationItem,
                    patient: PATIENT_OBJECT,
                    prescriber: PRESCRIBER_OBJECT,
                };

                sigs_list.push(rxItemInstruction.internalSigText);

                newRxArrayConstructed.push(newRxItem);
                return;
            }
        );
    }

    /**
     * Putting the item together to be returned.
     */
    const script_json: EmpowerPrescriptionOrder = {
        ...SCRIPT_NON_REPEATED_VARIABLES,
        newRxs: newRxArrayConstructed,
    };

    //results:
    //script_json
    //sigs_list

    return {
        script: script_json,
        sigs: sigs_list,
        displayName:
            variant_index_script_instructions?.selectDisplayName ??
            'display name not set',
    };
}

export async function generateEmpowerScriptAsync(
    patientId: string,
    orderId: string,
    override?: ScriptOverrideObject,
    resend?: boolean
) {
    const { type: orderType, data: orderData } = await fetchOrderData(orderId);
    const { data: patientData, error } = await getPatientInformationById(
        patientId
    );

    const bmi_data = await getQuestionAnswersForBMI(patientId);

    if (error) {
        throw new Error(error.message);
    }

    const resendCount = await getResendCount(
        parseInt(orderId),
        orderType === OrderType.Order ? undefined : orderData.renewal_order_id
    );

    /**
     * Scripts have key-values that are not repeated within Rx's - defined here.
     */
    const SCRIPT_NON_REPEATED_VARIABLES = {
        clientOrderId: `${
            orderType === OrderType.Order
                ? orderData.id
                : orderData.renewal_order_id
        }${resend ? 'R'.repeat(resendCount + 1) : ''}`,
        poNumber: `${
            orderType === OrderType.Order
                ? orderData.id
                : orderData.renewal_order_id
        }${resend ? 'R'.repeat(resendCount + 1) : ''}`,
        deliveryService: 'UPS Priority 2-Day',
        allowOverrideDeliveryService: true,
        allowOverrideEssentialCopyGuidance: true,
        lfPracticeId: parseInt(process.env.NEXT_PUBLIC_EPID!),
        referenceFields: '',
    };

    /**
     * Prescriber details have to be loaded continuously per Rx, so defining here.
     */
    const PRESCRIBER_OBJECT = {
        npi: '1013986835',
        stateLicenseNumber: 'ME80459',
        lastName: 'Desai',
        firstName: 'Bobby',
        address: {
            city: 'New York',
            postalCode: '10014',
            countryCode: 'US',
            addressLine1: '875 Washington Street',
            stateProvince: 'NY',
        },
        phoneNumber: '7476668167',
    };

    /**
     * Parse if address line 2 exists, since it cannot be null.
     */
    const addressLineTwo =
        orderType === OrderType.Order
            ? orderData.address_line2
            : orderData.order.address_line2;

    /**
     * Patient object needs to be loaded in for each Rx item.
     */
    const PATIENT_OBJECT: EmpowerPatient = {
        clientPatientId: patientData.id,
        lastName: patientData.last_name,
        firstName: patientData.first_name,
        gender: patientData.sex_at_birth?.charAt(0) ?? 'U',
        dateOfBirth: patientData.date_of_birth,
        address: {
            addressLine1:
                orderType === OrderType.Order
                    ? orderData.address_line1
                    : orderData.order.address_line1,
            addressLine2: addressLineTwo === '' ? null : addressLineTwo,
            city:
                orderType === OrderType.Order
                    ? orderData.city
                    : orderData.order.city,
            stateProvince:
                orderType === OrderType.Order
                    ? orderData.state
                    : orderData.order.state,
            postalCode:
                orderType === OrderType.Order
                    ? orderData.zip
                    : orderData.order.zip,
            countryCode: 'US',
        },
        phoneNumber: patientData.phone_number.replace(/\D/g, ''),
        email: patientData.email,
    };

    /**
     * These details will be consistent throughout all Rx medications added.
     */
    const MEDICATION_STATIC_VARIABLES = {
        refills: '0',
        writtenDate: new Date().toISOString().split('T')[0],
        note: 'From Bioverse, Supervising physician: Dr. Bobby Desai, MD',
    };

    /**
     * 12/11/24 new method of fetching Empower Catalog Instruction Object.
     * Fetches an object that interacts with the below code to generate the script.
     */
    const variant_index_script_instructions = getEmpowerCatalogObject(
        orderData.product_href as PRODUCT_HREF,
        override?.variant_index ?? orderData.variant_index
    );

    const newRxArrayConstructed: EmpowerNewRx[] = [];

    const sigs_list: string[] = [];

    let diagnosis_obtained;
    diagnosis_obtained = getDiagnosisWithBMIData(
        bmi_data ?? {
            height_feet: 0,
            height_inches: 0,
            weight_lbs: 0,
            bmi: 0,
        }
    );

    //construct Diagnosis Object
    const diagnosis: EmpowerDiagnosis =
        diagnosis_obtained.code !== ''
            ? {
                  clinicalInformationQualifier: 0,
                  primary: {
                      code: diagnosis_obtained.code,
                      qualifier: 0,
                      description: diagnosis_obtained.description,
                  },
              }
            : {
                  clinicalInformationQualifier: 0,
                  primary: {
                      code: 'E66.9',
                      qualifier: 0,
                      description: 'Obesity',
                  },
              };

    if (
        variant_index_script_instructions &&
        variant_index_script_instructions.array
    ) {
        /**
         * Iterating through the instructions object to create the Rx's array for the script.
         */
        variant_index_script_instructions.array.forEach(
            (rxItemInstruction: ScriptInstruction) => {
                const catalogItemData = searchEmpowerItemCatalogByCode(
                    rxItemInstruction.catalogItemCode
                );

                const newMedicationItem: EmpowerMedication = {
                    ...MEDICATION_STATIC_VARIABLES,
                    ...catalogItemData,
                    quantity: `${rxItemInstruction.quantity}`,
                    sigText: rxItemInstruction.sigText,
                    daysSupply: `${rxItemInstruction.daysSupply}`,
                    diagnosis: diagnosis,
                };

                const newRxItem: EmpowerNewRx = {
                    medication: newMedicationItem,
                    patient: PATIENT_OBJECT,
                    prescriber: PRESCRIBER_OBJECT,
                };

                sigs_list.push(rxItemInstruction.internalSigText);

                newRxArrayConstructed.push(newRxItem);
                return;
            }
        );
    }

    /**
     * Putting the item together to be returned.
     */
    const script_json: EmpowerPrescriptionOrder = {
        ...SCRIPT_NON_REPEATED_VARIABLES,
        newRxs: newRxArrayConstructed,
    };

    //results:
    //script_json
    //sigs_list

    return {
        script: script_json,
        sigs: sigs_list,
        displayName:
            variant_index_script_instructions?.selectDisplayName ??
            'display name not set',
    };
}

export function generateCustomEmpowerScript(
    patientData: APProfileData,
    custom_order_id: string,
    product_href: string,
    variant_index: number,
    shipping_information: AddressInterface,
    bmi_data?: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    }
): EmpowerGeneratedScript {
    /**
     * Scripts have key-values that are not repeated within Rx's - defined here.
     */
    const SCRIPT_NON_REPEATED_VARIABLES = {
        clientOrderId: custom_order_id,
        poNumber: custom_order_id,
        deliveryService: 'UPS Priority 2-Day',
        allowOverrideDeliveryService: true,
        allowOverrideEssentialCopyGuidance: true,
        lfPracticeId: parseInt(process.env.NEXT_PUBLIC_EPID!),
        referenceFields: '',
    };

    /**
     * Prescriber details have to be loaded continuously per Rx, so defining here.
     */
    const PRESCRIBER_OBJECT = {
        npi: '1013986835',
        stateLicenseNumber: 'ME80459',
        lastName: 'Desai',
        firstName: 'Bobby',
        address: {
            city: 'New York',
            postalCode: '10014',
            countryCode: 'US',
            addressLine1: '875 Washington Street',
            stateProvince: 'NY',
        },
        phoneNumber: '7476668167',
    };

    /**
     * Parse if address line 2 exists, since it cannot be null.
     */
    const addressLineTwo = shipping_information.address_line2;

    /**
     * Patient object needs to be loaded in for each Rx item.
     */
    const PATIENT_OBJECT: EmpowerPatient = {
        clientPatientId: patientData.id,
        lastName: patientData.last_name,
        firstName: patientData.first_name,
        gender: patientData.sex_at_birth.charAt(0),
        dateOfBirth: patientData.date_of_birth,
        address: {
            addressLine1: shipping_information.address_line1,
            addressLine2: addressLineTwo === '' ? undefined : addressLineTwo,
            city: shipping_information.city,
            stateProvince: shipping_information.state,
            postalCode: shipping_information.zip,
            countryCode: 'US',
        },
        phoneNumber: patientData.phone_number.replace(/\D/g, ''),
        email: patientData.email,
    };

    /**
     * These details will be consistent throughout all Rx medications added.
     */
    const MEDICATION_STATIC_VARIABLES = {
        refills: '0',
        writtenDate: new Date().toISOString().split('T')[0],
        note: 'From Bioverse, Supervising physician: Dr. Bobby Desai, MD',
    };

    /**
     * 12/11/24 new method of fetching Empower Catalog Instruction Object.
     * Fetches an object that interacts with the below code to generate the script.
     */
    const variant_index_script_instructions = getEmpowerCatalogObject(
        product_href as PRODUCT_HREF,
        variant_index
    );

    const newRxArrayConstructed: EmpowerNewRx[] = [];

    const sigs_list: string[] = [];

    let diagnosis_obtained;
    diagnosis_obtained = getDiagnosisWithBMIData(bmi_data);

    //construct Diagnosis Object
    const diagnosis: EmpowerDiagnosis =
        diagnosis_obtained.code !== ''
            ? {
                  clinicalInformationQualifier: 0,
                  primary: {
                      code: diagnosis_obtained.code,
                      qualifier: 0,
                      description: diagnosis_obtained.description,
                  },
              }
            : {
                  clinicalInformationQualifier: 0,
                  primary: {
                      code: 'E66.9',
                      qualifier: 0,
                      description: 'Obesity',
                  },
              };

    if (
        variant_index_script_instructions &&
        variant_index_script_instructions.array
    ) {
        /**
         * Iterating through the instructions object to create the Rx's array for the script.
         */
        variant_index_script_instructions.array.forEach(
            (rxItemInstruction: ScriptInstruction) => {
                const catalogItemData = searchEmpowerItemCatalogByCode(
                    rxItemInstruction.catalogItemCode
                );

                const newMedicationItem: EmpowerMedication = {
                    ...MEDICATION_STATIC_VARIABLES,
                    ...catalogItemData,
                    quantity: `${rxItemInstruction.quantity}`,
                    sigText: rxItemInstruction.sigText,
                    daysSupply: `${rxItemInstruction.daysSupply}`,
                    diagnosis: diagnosis,
                };

                const newRxItem: EmpowerNewRx = {
                    medication: newMedicationItem,
                    patient: PATIENT_OBJECT,
                    prescriber: PRESCRIBER_OBJECT,
                };

                sigs_list.push(rxItemInstruction.internalSigText);

                newRxArrayConstructed.push(newRxItem);
                return;
            }
        );
    }

    /**
     * Putting the item together to be returned.
     */
    const script_json: EmpowerPrescriptionOrder = {
        ...SCRIPT_NON_REPEATED_VARIABLES,
        newRxs: newRxArrayConstructed,
    };

    //results:
    //script_json
    //sigs_list

    return {
        script: script_json,
        sigs: sigs_list,
        displayName:
            variant_index_script_instructions?.selectDisplayName ??
            'display name not set',
    };
}
