import { findMedicationByHref } from '../../../components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/tmc/utils/tmc-medication-ids';

export function generateTMCScript(
    orderData: DBOrderData,
    patientData: DBPatientData,
    allergyData: string
) {
    const prescriptionForm: TMCPrescriptionForm = {
        prescriptions: [
            {
                // physician_npi: '1780019117', //german echeverry
                physician_npi: '1013986835', //bobby desai
                shipping_method: 'Standard Ground',
                shipping_address: {
                    shipping_city: orderData.city || 'none',
                    shipping_postal_code: orderData.zip || '00000',
                    shipping_state: orderData.state || 'none',
                    shipping_street: orderData.address_line1 || undefined,
                    shipping_address_line2:
                        orderData.address_line2 || undefined,
                    shipping_country: 'United States',
                },
                patient: {
                    first_name: patientData.first_name || 'N/A',
                    last_name: patientData.last_name || 'N/A',
                    dob: patientData.date_of_birth || '2000/1/1',
                    gender: patientData.sex_at_birth || 'NA',
                    email: patientData.email || 'none',
                    phone: patientData.phone_number || 'none',
                    //   ssn: '',
                    allergies: allergyData || 'none',
                },
                prescription_items: [
                    {
                        Id: '',
                        Quantity: '',
                        NoOfOriginalRefills: '0',
                        NoOfRefillRemaining: '0',
                        Sig: '',
                        Reason_for_Compounding:
                            'Product not available commercially',
                    },
                ],
            },
        ],
    };

    const medication_object = findMedicationByHref(orderData.product_href);

    console.log('href ', orderData.product_href);
    console.log('med obj: ', medication_object);

    const updatePrescriptionForm = (
        prescriptionForm: TMCPrescriptionForm,
        newPrescriptionItem: TMCPrescriptionItem
    ): TMCPrescriptionForm => {
        // Create a deep copy to avoid mutating state directly
        const newForm = prescriptionForm;

        // Update the prescription_items of the first prescription
        newForm.prescriptions[0].prescription_items = [newPrescriptionItem];

        return newForm;
    };

    const addSecondaryItemWithSpecification = (
        prescriptionForm: TMCPrescriptionForm,
        id: string,
        quantity: number = 1,
        sig: string
    ): void => {
        // Note the return type is now void since we're mutating the input directly
        // Check if there is an item at index [1] and remove it if it exists
        if (prescriptionForm.prescriptions[0].prescription_items.length > 1) {
            prescriptionForm.prescriptions[0].prescription_items.splice(1, 1);
        }

        // Add a new item to the prescription_items array of the first prescription
        prescriptionForm.prescriptions[0].prescription_items.push({
            Id: id,
            Quantity: String(quantity),
            NoOfOriginalRefills: '0',
            NoOfRefillRemaining: '0',
            Sig: sig,
        });

        // Since we're modifying the input directly, no need to return anything
    };

    switch (orderData.product_href) {
        case 'b12-injection':
            const newPrescriptionItem = {
                Id: medication_object!.id,
                Quantity: orderData.subscription_type === 'monthly' ? '1' : '3',
                NoOfOriginalRefills: '0',
                NoOfRefillRemaining: '0',
                Sig: medication_object!.sig,
                Reason_for_Compounding: 'Product not available commercially',
            };

            console.log('treated as b12');

            updatePrescriptionForm(prescriptionForm, newPrescriptionItem);

            break;
        case 'nad-injection':
        case 'glutathione-injection':
            const newPrescriptionItemNonB12 = {
                Id: medication_object!.id,
                Quantity: '1',
                NoOfOriginalRefills: '0',
                NoOfRefillRemaining: '0',
                Sig: medication_object!.sig,
                Reason_for_Compounding: 'Product not available commercially',
            };

            updatePrescriptionForm(prescriptionForm, newPrescriptionItemNonB12);

            addSecondaryItemWithSpecification(
                prescriptionForm,
                '01t1R000007FvGmQAK',
                2,
                medication_object!.sig
            );

            break;
    }

    return prescriptionForm;
}
