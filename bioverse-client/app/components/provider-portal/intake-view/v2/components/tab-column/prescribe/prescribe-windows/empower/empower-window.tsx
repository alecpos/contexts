'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { itemList } from '@/app/services/pharmacy-integration/empower/empower-item-list';
import {
    providerAddress,
    providerInfoGermanE,
    providerInfoMeylinC,
} from '@/app/services/pharmacy-integration/provider-static-information';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import processEmpowerScript from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import { OrderType } from '@/app/types/orders/order-types';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { getDiagnosisWithBMIData } from './utils/bmi-diagnosis-functions';

interface Props {
    patientData: DBPatientData;
    orderData: any;
    orderType: OrderType;
}

export default function EmpowerInterface({
    patientData,
    orderData,
    orderType,
}: Props) {
    const addressLineTwo =
        orderType === OrderType.Order
            ? orderData.address_line2
            : orderData.order.address_line2;
    const empowerPatientData: EmpowerPatient = {
        clientPatientId: patientData.id,
        lastName: patientData.last_name,
        firstName: patientData.first_name,
        gender: patientData.sex_at_birth?.charAt(0).toUpperCase(),
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
    const router = useRouter();

    const {
        data: bmi_data,
        error: bmi_data_error,
        isLoading: bmi_data_Loading,
    } = useSWR(`${patientData.id}-bmi-data`, () =>
        getQuestionAnswersForBMI(patientData.id)
    );

    const providerData: EmpowerPrescriber = {
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

    const [newRxArray, setNewRxArray] = useState<EmpowerNewRx[]>([]);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [displaySig, setDisplaySig] = useState<string>('');

    const [confirmationMessage, setConfirmationMessage] =
        useState<JSX.Element>();

    const [empowerForm, setEmpowerFormData] =
        useState<EmpowerPrescriptionOrder>({
            clientOrderId:
                orderType === OrderType.Order
                    ? orderData.id
                    : orderData.renewal_order_id, //set client order id to Order ID #
            // clientOrderId: '100', don't use this. it's a test
            poNumber: orderData.id, //set PO Number to Order ID
            deliveryService: 'UPS Priority 2-Day', //set this way.
            allowOverrideDeliveryService: true,
            allowOverrideEssentialCopyGuidance: true,
            lfPracticeId: parseInt(process.env.NEXT_PUBLIC_EPID!), //set by Empower.
            newRxs: newRxArray,
        });

    const [syringeAdded, setSyringeAdded] = useState<boolean>(false);
    const [firstItemAdded, setFirstItemAdded] = useState<boolean>(false);

    useEffect(() => {
        setEmpowerFormData((currentFormData) => ({
            ...currentFormData,
            newRxs: newRxArray,
        }));
    }, [newRxArray]);

    const addNewRxItem = () => {
        // Create a new EmpowerDiagnosis object with the specified fields
        const newDiagnosis: EmpowerDiagnosis = {
            clinicalInformationQualifier: 0,
            primary: {
                code: '', // This should be input by the provider
                qualifier: 0,
                description: '', // This should be input by the provider
            },
        };

        // Create a new EmpowerMedication object with the specified fields
        const newMedication: EmpowerMedication = {
            itemDesignatorId: '', // Adjust the type according to what itemDesignatorId can contain
            drugDescription: '',
            quantity: '0',
            refills: '0',
            daysSupply: '0',
            writtenDate: new Date().toISOString().split('T')[0],
            diagnosis: newDiagnosis,
            note: '',
            sigText: '',
        };

        // Create a new EmpowerNewRx item with the patient, prescriber, and medication
        const newRxItem: EmpowerNewRx = {
            patient: empowerPatientData,
            prescriber: providerData!,
            medication: newMedication,
        };

        // Add the new item to the newRxArray state
        setNewRxArray((prevRxArray) => [...prevRxArray, newRxItem]);

        setFirstItemAdded(true);
    };

    useEffect(() => {
        if (empowerForm.newRxs.length < 1) {
            addNewRxItem();
        }
    }, []);

    useEffect(() => {
        if (empowerForm.newRxs.length == 0) {
            return;
        }
        if (empowerForm.newRxs.length > 1) {
            return;
        }
        if (
            empowerForm.newRxs.length == 1 &&
            empowerForm.newRxs[0].medication.itemDesignatorId
        ) {
            addSyringeAndAlcoholWipes();
        }
    }, [empowerForm]);

    const addSyringeAndAlcoholWipes = () => {
        if (syringeAdded || !validateForm()) {
            return;
        }

        // Create a new EmpowerDiagnosis object with the specified fields
        const newDiagnosis: EmpowerDiagnosis = {
            clinicalInformationQualifier: 0,
            primary: {
                code: empowerForm.newRxs[0].medication.diagnosis.primary.code, // This should be input by the provider
                qualifier:
                    empowerForm.newRxs[0].medication.diagnosis.primary
                        .qualifier,
                description:
                    empowerForm.newRxs[0].medication.diagnosis.primary
                        .description, // This should be input by the provider
            },
        };

        // Create a new EmpowerMedication object with the specified fields
        const syringe: EmpowerMedication = {
            itemDesignatorId: 'C0F34D98BC3218F057D4572CF106E66A',
            drugDescription:
                'SYRINGE KIT 31G  5/16" 1CC (EASY TOUCH), ALCOHOL SWABS',
            quantity: '10',
            refills: empowerForm.newRxs[0].medication.refills,
            daysSupply: empowerForm.newRxs[0].medication.daysSupply,
            writtenDate: new Date().toISOString().split('T')[0],
            diagnosis: newDiagnosis,
            note: empowerForm.newRxs[0].medication.note,
            sigText: 'Use as Directed',
        };

        // const swab: EmpowerMedication = {
        //     itemDesignatorId: '164E03AAC77A9C31601F4F93A294D65F', // Adjust the type according to what itemDesignatorId can contain
        //     drugDescription: 'ALCOHOL PREP PADS (EASY TOUCH)',
        //     quantity: '10',
        //     refills: empowerForm.newRxs[0].medication.refills,
        //     daysSupply: empowerForm.newRxs[0].medication.daysSupply,
        //     writtenDate: new Date().toISOString().split('T')[0],
        //     diagnosis: newDiagnosis,
        //     note: empowerForm.newRxs[0].medication.note,
        //     sigText: 'Use as Directed',
        // };

        // Create a new EmpowerNewRx item with the patient, prescriber, and medication
        const syringeRxItem: EmpowerNewRx = {
            patient: empowerPatientData,
            prescriber: providerData!,
            medication: syringe, // Use medication instead of diagnosis
        };
        // const swabRxItem: EmpowerNewRx = {
        //     patient: empowerPatientData,
        //     prescriber: providerData!,
        //     medication: swab, // Use medication instead of diagnosis
        // };

        // Add the new item to the newRxArray state
        setNewRxArray((prevRxArray) => [
            ...prevRxArray,
            syringeRxItem,
            // swabRxItem,
        ]);

        setSyringeAdded(true);
    };

    const removeSyringeAndAlcoholWipes = () => {
        setNewRxArray((prevRxArray) => [prevRxArray[0]]);

        setSyringeAdded(false);
    };

    const handleMedicationChange = async (
        event:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>,
        index: number,
        fieldName: string
    ) => {
        let bmi_to_use = bmi_data;

        if (!bmi_to_use) {
            bmi_to_use = await getQuestionAnswersForBMI(patientData.id);
        }

        setNewRxArray((prevRxArray) => {
            const updatedRxArray = [...prevRxArray];
            const medication = updatedRxArray[index].medication;
            switch (fieldName) {
                case 'itemDesignatorId':
                    // Assuming itemDesignatorId is a select input
                    const selectedItemDesignatorId = (
                        event as SelectChangeEvent<string>
                    ).target.value;
                    // Find the corresponding item from the combined list
                    const selectedItem = itemList.find(
                        (item) => item.id === selectedItemDesignatorId
                    );
                    if (selectedItem) {
                        // Update the drugDescription with the display value of the selected item
                        medication.itemDesignatorId =
                            selectedItem.itemDesignatorId;
                        medication.drugDescription = `${selectedItem.drugDescription}`;

                        medication.quantity = selectedItem.metadata.quantity;
                        medication.daysSupply =
                            selectedItem.metadata.days_in_duration;
                        medication.sigText = selectedItem.metadata.script_sig;
                        setDisplaySig(selectedItem.metadata.display_sig);

                        const diagnosis_obtained =
                            getDiagnosisWithBMIData(bmi_to_use);

                        medication.diagnosis.primary.code =
                            diagnosis_obtained.code;
                        medication.diagnosis.primary.description =
                            diagnosis_obtained.description;
                        medication.note =
                            'From Bioverse, Supervising physician: Dr Bobby Desai, MD';
                    }
                    break;
                case 'quantity':
                    // Assuming quantity is a text input
                    medication.quantity = (
                        event as ChangeEvent<HTMLInputElement>
                    ).target.value;
                    break;
                case 'refills':
                    // Assuming refills is a text input
                    medication.refills = (
                        event as ChangeEvent<HTMLInputElement>
                    ).target.value;
                    break;
                case 'daysSupply':
                    // Assuming daysSupply is a text input
                    medication.daysSupply = (
                        event as ChangeEvent<HTMLInputElement>
                    ).target.value;
                    break;
                case 'writtenDate':
                    // Assuming writtenDate is a date input
                    medication.writtenDate = (
                        event as ChangeEvent<HTMLInputElement>
                    ).target.value;
                    break;
                case 'note':
                    // Assuming note is a text input
                    medication.note = (
                        event as ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ).target.value;
                    break;
                case 'sigText':
                    // Assuming sigText is a text input
                    medication.sigText = (
                        event as ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ).target.value;
                    break;

                case 'diagnosisCode':
                    // Assuming diagnosisCode is a text input
                    medication.diagnosis.primary.code = (
                        event as ChangeEvent<HTMLInputElement>
                    ).target.value;
                    break;
                case 'diagnosisDescription':
                    // Assuming diagnosisDescription is a text input
                    medication.diagnosis.primary.description = (
                        event as ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ).target.value;
                    break;
                default:
                    console.error(`Invalid field name: ${fieldName}`);
            }
            return updatedRxArray;
        });
    };

    const handleTodayClick = (index: number) => {
        setNewRxArray((prevRxArray) => {
            const updatedRxArray = [...prevRxArray];
            const medication = updatedRxArray[index].medication;
            // Set the writtenDate to the current date in the format 'yyyy-mm-dd'
            medication.writtenDate = new Date().toISOString().split('T')[0];
            return updatedRxArray;
        });
    };

    const openConfirmationDialog = () => {
        setConfirmDialogOpen(true);
    };

    const closeConfirmationDialog = () => {
        if (confirmationMessage || !isSubmitting) {
            setConfirmDialogOpen(false);
            setConfirmationMessage(undefined);
        }
    };

    const showConfirmationMessage = (
        result: 'success' | 'failure',
        reason?: string
    ) => {
        if (result === 'success') {
            setConfirmationMessage(
                <>
                    <BioType className='body1 text-green-600'>
                        The script was sent successfully! You may leave this
                        page now.
                    </BioType>
                </>
            );
        } else {
            setConfirmationMessage(
                <>
                    <BioType className='body1 text-red-400'>
                        There was an issue in sending the script. Please contact
                        Nathan Cho if this continues to cause problem. Reason:{' '}
                        {reason ?? 'unspecified'}
                    </BioType>
                </>
            );
        }
    };
    const confirmPrescriptionSend = async () => {
        setIsSubmitting(true);

        console.log('empf ', empowerForm);
        return;

        if (validateForm() && validateSyringeAdded()) {
            const resp = await processEmpowerScript(
                orderData.id,
                orderData.order_status,
                orderData.assigned_provider,
                empowerForm,
                orderType,
                orderData.subscription_id ? orderData.subscription_id : '',
                orderData,
                0
            );

            if (orderType === OrderType.Order) {
                // await saveScriptForFutureUse(
                //     empowerForm,
                //     orderData.id,
                //     'empower'
                // );
            } else if (orderType === OrderType.RenewalOrder) {
                // await saveScriptForFutureUse(
                //     empowerForm,
                //     orderData.renewal_order_id,
                //     'empower'
                // );
            }

            if (resp.result === 'success') {
                setIsSubmitting(false);
                showConfirmationMessage('success');
                setTimeout(() => {
                    router.refresh();
                }, 800);
            } else if (resp.result === 'failure') {
                showConfirmationMessage('failure', resp.reason ?? '');
                setIsSubmitting(false);
            }
        }
    };

    const listOfProductsThatNeedSyringe = [
        'A25CCAF5A59AE9D9764A59DA9BCEB5EE',
        '2E856CB5BEF400773849E2576305CF02',
        'CFD8712D2EF9495087967973E5CCDEE9',
        '6F743FC0E60CFDC817A1912351824286',
        'B1961EA2BDFA7A1AF0168EBC969E4A99',
        'C33D31DFC3AEBBAC2B127876340292F7',
    ];

    const validateSyringeAdded = () => {
        if (
            listOfProductsThatNeedSyringe.includes(
                empowerForm.newRxs[0].medication.itemDesignatorId
            ) &&
            empowerForm.newRxs.length < 2
        ) {
            setErrorMessages([
                'This item requires you to add a syringe & alcohol swabs',
            ]);
            return false;
        }
        return true;
    };

    const validateForm = () => {
        let isValid = true;
        const errorMessages: string[] | SetStateAction<undefined> = [];

        empowerForm.newRxs.forEach((rx, index) => {
            const errors = [];
            if (!rx.medication.itemDesignatorId.trim())
                errors.push('Item Designator ID is required.');
            if (rx.medication.quantity == '0')
                errors.push('Quantity is required.');
            if (!rx.medication.refills.trim())
                errors.push('Refills are required.');
            if (rx.medication.daysSupply == '0')
                errors.push('Days Supply is required.');
            if (!rx.medication.writtenDate.trim())
                errors.push('Written Date is required.');
            if (!rx.medication.diagnosis.primary.code.trim())
                errors.push('Diagnosis Code is required.');
            if (!rx.medication.diagnosis.primary.description.trim())
                errors.push('Diagnosis Description is required.');
            if (!rx.medication.note.trim()) errors.push('Note is required.');
            if (!rx.medication.sigText.trim())
                errors.push('Sig Text is required.');

            if (errors.length > 0) {
                isValid = false;
                // Join the errors for the current prescription item with a space and add a newline at the end if it's not the last item
                errorMessages.push(
                    `Prescription Item ${index + 1}: ${errors.join(' ')}${
                        index < empowerForm.newRxs.length - 1 ? '\n' : ''
                    }`
                );
            }
        });

        setErrorMessages(errorMessages);
        return isValid;
    };

    const findIdWithDesignator = (designator_id: string) => {
        const foundItem = itemList.find(
            (item) => item.itemDesignatorId === designator_id
        );
        return foundItem ? foundItem.id : designator_id;
    };

    return (
        <>
            <Paper className='w-full flex flex-col'>
                <div className='flex flex-col gap-4 p-8'>
                    <BioType className='h6 text-primary self-center'>
                        Prescribe to Empower
                    </BioType>

                    {/* <div className='p-2'>
                        {JSON.stringify(empowerForm.newRxs)}
                    </div> */}

                    {providerData && (
                        <>
                            {empowerForm.newRxs.map((rx_order_item, index) => (
                                <Paper
                                    className='flex flex-col p-4'
                                    key={index}
                                >
                                    {index === 0 ? (
                                        <BioType className='h6 text-primary'>
                                            Prescription Item {index + 1}
                                        </BioType>
                                    ) : (
                                        <BioType className='h6 text-primary'>
                                            {index === 1 ? (
                                                <BioType className='h6 text-primary'>
                                                    Syringe
                                                </BioType>
                                            ) : (
                                                <BioType className='h6 text-primary'>
                                                    Alcohol Swab
                                                </BioType>
                                            )}
                                        </BioType>
                                    )}
                                    {index === 0 && (
                                        <>
                                            <Select
                                                labelId={`itemDesignatorId-select-label-${index}`}
                                                id={`itemDesignatorId-select-${index}`}
                                                value={findIdWithDesignator(
                                                    rx_order_item.medication
                                                        .itemDesignatorId
                                                )}
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'itemDesignatorId'
                                                    )
                                                }
                                            >
                                                <MenuItem
                                                    sx={{ fontStyle: 'italic' }}
                                                    disabled
                                                    value=''
                                                >
                                                    Please Select
                                                </MenuItem>
                                                {itemList.map((item) => (
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {`${item.drugDescription}, ${item.dosage}`}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                            {/* <TextField
                                                label='Quantity'
                                                disabled
                                                value={
                                                    rx_order_item.medication
                                                        .quantity
                                                }
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'quantity'
                                                    )
                                                }
                                                fullWidth
                                                margin='normal'
                                            /> */}
                                            {/* <TextField
                                                label='Refills'
                                                value={
                                                    rx_order_item.medication
                                                        .refills
                                                }
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'refills'
                                                    )
                                                }
                                                fullWidth
                                                margin='normal'
                                            /> */}
                                            {/* <TextField
                                                label='Days Supply'
                                                disabled
                                                value={
                                                    rx_order_item.medication
                                                        .daysSupply
                                                }
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'daysSupply'
                                                    )
                                                }
                                                fullWidth
                                                margin='normal'
                                            /> */}
                                            <div className='flex flex-row gap-4'>
                                                {/* <Button
                                                    variant='contained'
                                                    className='flex h-1/2 self-center'
                                                    onClick={() => {
                                                        handleTodayClick(index);
                                                    }}
                                                >
                                                    TODAY
                                                </Button> */}
                                                {/* <TextField
                                                    disabled
                                                    label='Written Date'
                                                    type='date'
                                                    value={
                                                        rx_order_item.medication
                                                            .writtenDate
                                                    }
                                                    onChange={(event) =>
                                                        handleMedicationChange(
                                                            event,
                                                            index,
                                                            'writtenDate'
                                                        )
                                                    }
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    fullWidth
                                                    margin='normal'
                                                /> */}
                                            </div>
                                            {/* <TextField
                                                disabled
                                                label='Sig / Directions'
                                                value={displaySig}
                                                // onChange={(event) =>
                                                //     handleMedicationChange(
                                                //         event,
                                                //         index,
                                                //         'sigText'
                                                //     )
                                                // }
                                                fullWidth
                                                margin='normal'
                                            /> */}
                                            {/* <TextField
                                                label='Notes'
                                                value={
                                                    rx_order_item.medication
                                                        .note
                                                }
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'note'
                                                    )
                                                }
                                                fullWidth
                                                margin='normal'
                                            /> */}
                                            {/* <BioType className='h6 text-primary'>
                                                Diagnosis
                                            </BioType>
                                            <TextField
                                                label='Diagnosis Code'
                                                value={
                                                    rx_order_item.medication
                                                        .diagnosis.primary.code
                                                }
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'diagnosisCode'
                                                    )
                                                }
                                                fullWidth
                                                margin='normal'
                                            />
                                            <TextField
                                                label='Diagnosis Description'
                                                value={
                                                    rx_order_item.medication
                                                        .diagnosis.primary
                                                        .description
                                                }
                                                onChange={(event) =>
                                                    handleMedicationChange(
                                                        event,
                                                        index,
                                                        'diagnosisDescription'
                                                    )
                                                }
                                                fullWidth
                                                margin='normal'
                                            /> */}
                                        </>
                                    )}
                                    {index !== 0 && (
                                        <>
                                            <BioType className='body1'>
                                                {
                                                    rx_order_item.medication
                                                        .drugDescription
                                                }{' '}
                                            </BioType>
                                            <BioType className='body1'>
                                                Quantity:{' '}
                                                {
                                                    rx_order_item.medication
                                                        .quantity
                                                }
                                            </BioType>
                                        </>
                                    )}
                                </Paper>
                            ))}
                            {/* <div className='flex flex-col items-start'>
                                {firstItemAdded && !syringeAdded && (
                                    <Button
                                        variant='outlined'
                                        onClick={addSyringeAndAlcoholWipes}
                                    >
                                        Add Syringes and Alcohol Swabs
                                    </Button>
                                )}
                                {firstItemAdded && syringeAdded && (
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        onClick={removeSyringeAndAlcoholWipes}
                                    >
                                        Remove Syringe and Alcohol Swabs
                                    </Button>
                                )}
                            </div> */}
                        </>
                    )}

                    <BioType className='body1 text-red-500'>
                        {errorMessages}
                    </BioType>

                    {empowerForm.newRxs[0] && (
                        <Button
                            className='w-1/2'
                            variant='contained'
                            onClick={openConfirmationDialog}
                        >
                            Submit Prescription
                        </Button>
                    )}
                </div>
            </Paper>

            <>
                <Paper className='w-full flex flex-col'>
                    {/* Your existing component code */}
                </Paper>

                {/* Confirmation Dialog */}
                <Dialog
                    open={confirmDialogOpen}
                    onClose={closeConfirmationDialog}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>
                        {'Confirmation'}
                    </DialogTitle>
                    <DialogContent>
                        {confirmationMessage ? (
                            confirmationMessage
                        ) : (
                            <DialogContentText id='alert-dialog-description'>
                                Confirm submission of prescription?
                            </DialogContentText>
                        )}
                    </DialogContent>
                    {!confirmationMessage && (
                        <DialogActions>
                            <Button
                                onClick={closeConfirmationDialog}
                                color='error'
                                variant='outlined'
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmPrescriptionSend}
                                color='primary'
                                autoFocus
                                variant='outlined'
                            >
                                Confirm
                            </Button>
                            {isSubmitting && (
                                <div>
                                    {' '}
                                    <CircularProgress
                                        color='secondary'
                                        size={30}
                                    ></CircularProgress>
                                </div>
                            )}
                        </DialogActions>
                    )}
                </Dialog>
            </>
        </>
    );
}

const providerList = [providerInfoGermanE, providerInfoMeylinC];
