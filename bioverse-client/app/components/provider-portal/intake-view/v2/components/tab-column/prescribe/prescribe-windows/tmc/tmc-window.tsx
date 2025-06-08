import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ProcessTMCScript from '@/app/services/pharmacy-integration/tmc/provider-script-feedback';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    SelectChangeEvent,
    Snackbar,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import B12Modal from './components/b12-modal';
import TMCPrescriptionInputFields from './prescription-input-fields';
import {
    findMedicationByHref,
    findMedicationById,
} from './utils/tmc-medication-ids';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { StatusTagAction } from '@/app/types/status-tags/status-types';
import { ScriptSource } from '@/app/types/orders/order-types';

interface Props {
    patientData: any;
    orderData: DBOrderData;
    allergyData: string;
}

export default function TailorMadeCompoundsInterface({
    patientData,
    orderData,
    allergyData,
}: Props) {
    const initialPrescriptionForm: TMCPrescriptionForm = {
        prescriptions: [
            {
                // physician_npi: '1780019117', //german echeverry
                physician_npi: '1013986835', //bobby desai
                shipping_method: 'Standard Ground',
                shipping_address: {
                    shipping_city: orderData.city || 'none',
                    shipping_postal_code: orderData.zip || '00000',
                    shipping_state: orderData.state || 'none',
                    shipping_street: orderData.address_line1 || 'none',
                    shipping_address_line2: orderData.address_line2 || 'none',
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
                    },
                ],
            },
        ],
    };

    const [prescriptionForm, setPrescriptionForm] =
        useState<TMCPrescriptionForm>(initialPrescriptionForm);

    const [selectedItem, setSelectedItem] = useState<string>(
        findMedicationByHref(orderData.product_href)?.id ?? '',
    );

    const [b12ModalOpen, setb12ModalOpenState] = useState<boolean>(false);

    useEffect(() => {
        const populateFieldsAfterMedicationSelection = (id: string) => {
            const medication_object = findMedicationById(id);

            if (!medication_object) {
                return;
            }

            switch (id) {
                case '01t36000003zHJ1AAM': //B12
                    const newPrescriptionItem = {
                        Id: medication_object.id,
                        Quantity:
                            orderData.subscription_type === 'monthly'
                                ? '1'
                                : '3',
                        NoOfOriginalRefills: '0',
                        NoOfRefillRemaining: '0',
                        Sig: medication_object.sig,
                    };
                    // Update the state
                    setPrescriptionForm((prevForm) => {
                        const newForm = JSON.parse(JSON.stringify(prevForm)); // Create a deep copy to avoid mutating state directly
                        newForm.prescriptions[0].prescription_items = [
                            newPrescriptionItem,
                        ];
                        return newForm;
                    });

                    openB12Modal();
                    return;

                case '01t36000003SgojAAC': //glutathione
                case '01tDn000005pzDAIAY': //NAD
                    const newPrescriptionItemNonB12 = {
                        Id: medication_object.id,
                        Quantity: '1',
                        NoOfOriginalRefills: '0',
                        NoOfRefillRemaining: '0',
                        Sig: medication_object.sig,
                    };
                    // Update the state
                    setPrescriptionForm((prevForm) => {
                        const newForm = JSON.parse(JSON.stringify(prevForm)); // Create a deep copy to avoid mutating state directly
                        // Clear the prescription_items array and add the newPrescriptionItemNonB12 as the first item
                        newForm.prescriptions[0].prescription_items = [
                            newPrescriptionItemNonB12,
                        ];
                        return newForm;
                    });

                    addSecondaryItemWithSpecification(
                        '01t1R000007FvGmQAK',
                        2,
                        medication_object.sig,
                    );
                    return;

                default:
                    return;
            }
        };

        if (selectedItem) {
            populateFieldsAfterMedicationSelection(selectedItem);
        }
    }, [selectedItem, orderData.subscription_type]);

    useEffect(() => {
        switch (orderData.product_href) {
            case 'nad-injection':
                setSelectedItem('01tDn000005pzDAIAY');
                break;
            case 'glutathione-injection':
                setSelectedItem('01t36000003SgojAAC');
                break;
            case 'b12-injection':
                setSelectedItem('01t36000003zHJ1AAM');
                break;
            default:
                break;
        }
    }, [selectedItem, orderData.product_href]);

    const openB12Modal = () => {
        setb12ModalOpenState(true);
    };
    const closeB12Modal = () => {
        setb12ModalOpenState(false);
    };

    const setB12QuantityAndSyringeType = (type: string) => {
        const medication_object = findMedicationById('01t36000003zHJ1AAM');

        const itemId =
            type === 'standard' ? '01tDn0000002CERIA2' : '01t36000005sZ6vAAE';

        const sig = medication_object!.sig;

        addSecondaryItemWithSpecification(
            itemId,
            (orderData.subscription_type === 'monthly' ? 1 : 3) * 10,
            sig,
        );
    };

    // valdation veriables
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const handleSnackbarClose = (
        event: React.SyntheticEvent<Element> | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    /**
     * confirmation dialog variables.
     */
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const openConfirmationDialog = () => {
        if (validateForm(prescriptionForm)) {
            setConfirmDialogOpen(true);
        } else {
            // Set the error message based on the first missing required field
            const firstMissingRequiredField =
                findFirstMissingRequiredField(prescriptionForm);
            if (firstMissingRequiredField) {
                setErrorMessage(
                    `Please fill out the ${firstMissingRequiredField}`,
                );
            } else {
                setErrorMessage(`Please check the script once more`);
            }
            setSnackbarOpen(true);
        }
    };

    const [confirmationMessage, setConfirmationMessage] =
        useState<JSX.Element>();
    const showConfirmationMessage = (
        result: 'success' | 'failure',
        reason?: string,
    ) => {
        if (result === 'success') {
            setConfirmationMessage(
                <>
                    <BioType className="body1 text-green-600">
                        The script was sent successfully! You may leave this
                        page now.
                    </BioType>
                </>,
            );
        } else {
            setConfirmationMessage(
                <>
                    <BioType className="body1 text-red-400">
                        There was an issue in sending the script. Please contact
                        Nathan Cho if this continues to cause problem. Reason:{' '}
                        {reason ?? 'unspecified'}
                    </BioType>
                </>,
            );
        }
    };

    const findFirstMissingRequiredField = (
        form: TMCPrescriptionForm,
    ): string => {
        const requiredFields = [
            'Id',
            'Quantity',
            'NoOfOriginalRefills',
            'NoOfRefillRemaining',
            'Sig',
        ];
        const prescriptionItem = form.prescriptions[0].prescription_items[0];

        for (const field of requiredFields) {
            if (
                !(
                    prescriptionItem as unknown as Record<
                        string,
                        string | undefined
                    >
                )[field]
            ) {
                return field;
            }
        }
        return '';
    };

    const handleCloseConfirmationDialog = () => {
        if (confirmationMessage || !isSending) {
            setConfirmDialogOpen(false);
            setConfirmationMessage(undefined);
        }
    };

    const handleProviderPrescribeAudit = async () => {
        const time = new Date().getTime(); // Record start time

        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: 'prescribe_intake',
            timestamp: time,
            order_id: orderData.id,
            metadata: {
                pharmacy: 'tmc',
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        };

        await createNewProviderActivityAudit(new_audit);
    };
    const handleOrderStatusTagChange = async () => {
        // const orderId = orderType === OrderType.RenewalOrder? orderData.renewal_order_id: orderData.id;

        await createUserStatusTagWAction(
            'Resolved',
            orderData.id,
            StatusTagAction.REPLACE,
            patientData.id,
            'Changed to a resolved status after order has been approved and prescribed',
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            ['Resolved'],
        );
    };

    //function to submit this form to server.
    /**
     * SUBMISSION METHOD
     */
    const submitTMCForm = async () => {
        setIsSending(true);

        await handleProviderPrescribeAudit();

        const resp = await ProcessTMCScript(
            orderData.id,
            orderData.order_status,
            orderData.assigned_provider,
            orderData.customer_uid,
            prescriptionForm,
        );

        await saveScriptForFutureUse(
            prescriptionForm,
            orderData.id,
            'tmc',
            ScriptSource.TMCWindow,
        );

        await handleOrderStatusTagChange();

        if (resp.result === 'success') {
            setIsSending(false);
            showConfirmationMessage('success');
        } else {
            showConfirmationMessage('failure', resp.reason ?? '');
            setIsSending(false);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Helper function to safely update nested properties
        const updateNestedProperty = (obj: any, path: string[], value: any) => {
            let current = obj;
            for (let i = 0; i < path.length - 1; i++) {
                if (!current[path[i]]) {
                    current[path[i]] = {}; // Initialize the object if it doesn't exist
                }
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
        };

        // Determine the path to the property to update
        const path = name.split('.');
        setPrescriptionForm((prevForm) => {
            const newForm = JSON.parse(JSON.stringify(prevForm)); // Create a deep copy to avoid mutating state directly
            // Update the first item in the prescriptions array
            updateNestedProperty(newForm.prescriptions[0], path, value);

            return newForm;
        });
    };

    /**
     * Nested input is for the prescription item values since prescription items are an array.
     *
     */
    const handleNestedInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Helper function to safely update nested properties
        const updateNestedProperty = (obj: any, path: string[], value: any) => {
            let current = obj;
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (isNaN(Number(key))) {
                    if (!current[key]) {
                        current[key] = {}; // Initialize the object if it doesn't exist
                    }
                    current = current[key];
                } else {
                    // If the key is a number, it's an array index
                    const index = Number(key);
                    if (!Array.isArray(current)) {
                        current = []; // Initialize the array if it doesn't exist
                    }
                    if (!current[index]) {
                        current[index] = {}; // Initialize the array item if it doesn't exist
                    }
                    current = current[index];
                }
            }
            const lastKey = path[path.length - 1];
            if (!isNaN(Number(lastKey))) {
                // If the last key is a number, it's an array index
                const index = Number(lastKey);
                if (!Array.isArray(current)) {
                    current = []; // Initialize the array if it doesn't exist
                }
                current[index] = value;
            } else {
                current[lastKey] = value;
            }
        };

        // Determine the path to the property to update
        const path = name.split(/[\.\[\]]/).filter(Boolean); // Split on both periods and square brackets
        setPrescriptionForm((prevForm) => {
            const newForm = JSON.parse(JSON.stringify(prevForm)); // Create a deep copy to avoid mutating state directly
            // Update the first item in the prescriptions array
            updateNestedProperty(newForm.prescriptions[0], path, value);
            return newForm;
        });
    };

    /**
     * Deprecated
     *
     */
    // const handleSelectChange = (event: SelectChangeEvent) => {
    //     const { name, value } = event.target;
    //     // Helper function to safely update nested properties
    //     const updateNestedProperty = (obj: any, path: string[], value: any) => {
    //         let current = obj;
    //         for (let i = 0; i < path.length - 1; i++) {
    //             const key = path[i];
    //             if (isNaN(Number(key))) {
    //                 if (!current[key]) {
    //                     current[key] = {}; // Initialize the object if it doesn't exist
    //                 }
    //                 current = current[key];
    //             } else {
    //                 // If the key is a number, it's an array index
    //                 const index = Number(key);
    //                 if (!Array.isArray(current)) {
    //                     current = []; // Initialize the array if it doesn't exist
    //                 }
    //                 if (!current[index]) {
    //                     current[index] = {}; // Initialize the array item if it doesn't exist
    //                 }
    //                 current = current[index];
    //             }
    //         }
    //         const lastKey = path[path.length - 1];
    //         if (!isNaN(Number(lastKey))) {
    //             // If the last key is a number, it's an array index
    //             const index = Number(lastKey);
    //             if (!Array.isArray(current)) {
    //                 current = []; // Initialize the array if it doesn't exist
    //             }
    //             current[index] = value;
    //         } else {
    //             current[lastKey] = value;
    //         }
    //     };

    //     // Determine the path to the property to update
    //     const path = name.split('.');
    //     setPrescriptionForm((prevForm) => {
    //         const newForm = JSON.parse(JSON.stringify(prevForm)); // Create a deep copy to avoid mutating state directly
    //         // Update the first item in the prescriptions array
    //         updateNestedProperty(newForm.prescriptions[0], path, value);
    //         return newForm;
    //     });
    // };

    const handleSelectedItemChange = (event: SelectChangeEvent) => {
        const item_id = event.target.value;

        setSelectedItem(item_id);
    };

    const handleNestedSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        // Helper function to safely update nested properties
        const updateNestedProperty = (obj: any, path: string[], value: any) => {
            let current = obj;
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (isNaN(Number(key))) {
                    if (!current[key]) {
                        current[key] = {}; // Initialize the object if it doesn't exist
                    }
                    current = current[key];
                } else {
                    // If the key is a number, it's an array index
                    const index = Number(key);
                    if (!Array.isArray(current)) {
                        current = []; // Initialize the array if it doesn't exist
                    }
                    if (!current[index]) {
                        current[index] = {}; // Initialize the array item if it doesn't exist
                    }
                    current = current[index];
                }
            }
            const lastKey = path[path.length - 1];
            if (!isNaN(Number(lastKey))) {
                // If the last key is a number, it's an array index
                const index = Number(lastKey);
                if (!Array.isArray(current)) {
                    current = []; // Initialize the array if it doesn't exist
                }
                current[index] = value;
            } else {
                current[lastKey] = value;
            }
        };

        // Determine the path to the property to update
        const path = name.split(/[\.\[\]]/).filter(Boolean); // Split on both periods and square brackets
        setPrescriptionForm((prevForm) => {
            const newForm = JSON.parse(JSON.stringify(prevForm)); // Create a deep copy to avoid mutating state directly
            // Update the first item in the prescriptions array
            updateNestedProperty(newForm.prescriptions[0], path, value);
            return newForm;
        });
    };

    //Adds the secondary item to the prescription.
    const addSecondaryItem = () => {
        setPrescriptionForm((prevForm) => {
            // Create a deep copy of the previous form to avoid mutating state directly
            const newForm = JSON.parse(JSON.stringify(prevForm));
            // Add a new item to the prescription_items array of the first prescription
            newForm.prescriptions[0].prescription_items.push({
                Id: '',
                Quantity: '',
                NoOfOriginalRefills: '0',
                NoOfRefillRemaining: '0',
                Sig: 'Use as directed',
            });
            return newForm;
        });
    };

    const addSecondaryItemWithSpecification = (
        id: string,
        quantity: number = 1,
        sig: string,
    ) => {
        setPrescriptionForm((prevForm) => {
            // Create a deep copy of the previous form to avoid mutating state directly
            const newForm = JSON.parse(JSON.stringify(prevForm));

            // Check if there is an item at index [1] and remove it if it exists
            if (newForm.prescriptions[0].prescription_items.length > 1) {
                newForm.prescriptions[0].prescription_items.splice(1, 1);
            }

            // Add a new item to the prescription_items array of the first prescription
            newForm.prescriptions[0].prescription_items.push({
                Id: id,
                Quantity: String(quantity),
                NoOfOriginalRefills: '0',
                NoOfRefillRemaining: '0',
                Sig: sig,
            });
            return newForm;
        });
    };

    const validateForm = (form: TMCPrescriptionForm): boolean => {
        // Check if physician_npi is blank
        if (!form.prescriptions[0].physician_npi) {
            return false;
        }

        if (!form.prescriptions[0].patient.allergies) {
            return false;
        }

        // Iterate over prescription_items and check if any required fields are blank
        for (const item of form.prescriptions[0].prescription_items) {
            if (
                !item.Id ||
                !item.Quantity ||
                !item.NoOfOriginalRefills ||
                !item.NoOfRefillRemaining ||
                !item.Sig
            ) {
                return false;
            }
        }

        // If none of the required fields are blank, return true
        return true;
    };

    return (
        <>
            <Paper className="w-full flex flex-col">
                <div className="flex flex-col items-center gap-2 p-8">
                    <BioType className="h6 text-primary">
                        Prescribe to Tailor Made Compounds
                    </BioType>
                </div>
                <div className="flex flex-col">
                    <form noValidate>
                        {/**
                         * Patient fields
                         */}
                        {/* <div className='flex flex-col px-8 py-1'>
                            <TMCPatientInputFields
                                prescriptionForm={prescriptionForm}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                            />
                        </div> */}

                        {/**
                         * Address Fields
                         */}
                        {/* <div className='flex flex-col px-8 py-1'>
                            <TMCAddressInputFields
                                prescriptionForm={prescriptionForm}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                            />
                        </div> */}

                        {/**
                         * Prescription fields
                         */}
                        <TMCPrescriptionInputFields
                            selectedItem={selectedItem}
                            setSelectedItem={handleSelectedItemChange}
                            setPrescriptionForm={setPrescriptionForm}
                            addSecondaryItem={addSecondaryItem}
                            handleNestedSelectChange={handleNestedSelectChange}
                            prescriptionForm={prescriptionForm}
                            handleInputChange={handleInputChange}
                            handleNestedInputChange={handleNestedInputChange}
                        />
                    </form>
                </div>
                <div className="flex flex-col w-full px-8 mb-8 items-start">
                    <Button
                        variant="contained"
                        className="h-10"
                        onClick={openConfirmationDialog}
                    >
                        Send Script
                    </Button>
                    {/* <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                            console.log(prescriptionForm);
                            openB12Modal();
                        }}
                    >
                        Test button
                    </Button> */}
                </div>
            </Paper>
            <B12Modal
                open={b12ModalOpen}
                onClose={closeB12Modal}
                onConfirmExtraInformation={setB12QuantityAndSyringeType}
            />
            <ConfirmationDialog
                isSending={isSending}
                open={confirmDialogOpen}
                onClose={handleCloseConfirmationDialog}
                onConfirm={submitTMCForm}
                confirmationMessage={confirmationMessage}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSending: boolean;
    confirmationMessage: JSX.Element | undefined | null;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    isSending,
    confirmationMessage,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{'Confirmation'}</DialogTitle>
            <DialogContent>
                {confirmationMessage ? (
                    <>{confirmationMessage}</>
                ) : (
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to finalize and send the script?
                    </DialogContentText>
                )}
            </DialogContent>
            {!confirmationMessage && (
                <DialogActions>
                    {!isSending ? (
                        <>
                            <Button
                                onClick={onClose}
                                color="error"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onConfirm}
                                color="primary"
                                variant="contained"
                                autoFocus
                            >
                                Confirm
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-row justify-start p-4 items-center gap-4">
                            <BioType className="body1">
                                Sending the e-script to the pharmacy. Plesae
                                hold.
                            </BioType>
                            <CircularProgress />
                        </div>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
};
