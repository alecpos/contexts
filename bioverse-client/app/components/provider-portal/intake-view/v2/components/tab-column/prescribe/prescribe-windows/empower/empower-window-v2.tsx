'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    EMPOWER_VARIANT_SCRIPT_DATA,
    searchEmpowerItemCatalogByCode,
} from '@/app/services/pharmacy-integration/empower/empower-catalog';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getDiagnosisWithBMIData } from './utils/bmi-diagnosis-functions';
import processEmpowerScript from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { StatusTagAction } from '@/app/types/status-tags/status-types';
import { getEmpowerCatalogObject } from '@/app/services/pharmacy-integration/empower/empower-variant-product-script-data';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface EmpowerWindowProps {
    patientData: DBPatientData;
    orderData: DBOrderData;
    orderType: OrderType;
}

export default function EmpowerWindowV2({
    patientData,
    orderData,
    orderType,
}: EmpowerWindowProps) {
    const {
        data: bmiData,
        error,
        isLoading,
    } = useSWR(`${patientData.id}-BMI-data`, () => {
        getQuestionAnswersForBMI(patientData.id);
    });

    const [bmiDataPresent, setBmiDataPresent] = useState<boolean>(false);
    const [selectedMedicationVariantIndex, setSelectedMedicationVariantIndex] =
        useState<number>(orderData.variant_index);
    const [selectedMedicationEditable, setSelectedMedicationEditable] =
        useState<boolean>(false);

    useEffect(() => {
        setSelectedMedicationEditable(false);
    }, [selectedMedicationVariantIndex]);

    const [confirmationScript, setConfirmationScript] =
        useState<EmpowerPrescriptionOrder>();

    const [confirmationSigs, setConfirmationSigs] = useState<string[]>([]);

    useEffect(() => {
        if (bmiData) {
            setBmiDataPresent(true);
        }
    }, [bmiData]);

    const [confirmationWindowOpen, setConfirmationWindowOpen] =
        useState<boolean>(false);

    const closeConfirmationWindow = () => {
        setConfirmationWindowOpen(false);
    };

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [confirmationMessage, setConfirmationMessage] =
        useState<JSX.Element>();

    if (isLoading) {
        return <LoadingScreen />;
    }

    const SCRIPT_NON_REPEATED_VARIABLES = {
        clientOrderId:
            orderType === OrderType.Order
                ? orderData.id
                : orderData.renewal_order_id,
        poNumber: orderData.id,
        deliveryService: 'UPS Priority 2-Day',
        allowOverrideDeliveryService: true,
        allowOverrideEssentialCopyGuidance: true,
        lfPracticeId: parseInt(process.env.NEXT_PUBLIC_EPID!),
        referenceFields: '',
    };

    /**
     * Doctor Echeverry used to be the old provider used.
     */
    // const PRESCRIBER_OBJECT_OLD = {
    //     npi: '1689995771',
    //     stateLicenseNumber: '279563',
    //     lastName: 'Echeverry',
    //     firstName: 'German',
    //     address: {
    //         city: 'New York',
    //         postalCode: '10014',
    //         countryCode: 'US',
    //         addressLine1: '875 Washington Street',
    //         stateProvince: 'NY',
    //     },
    //     phoneNumber: '7476668167',
    // };

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

    const addressLineTwo =
        orderType === OrderType.Order
            ? orderData.address_line2
            : orderData.order.address_line2;

    const PATIENT_OBJECT: EmpowerPatient = {
        clientPatientId: patientData.id,
        lastName: patientData.last_name,
        firstName: patientData.first_name,
        gender: patientData.sex_at_birth.charAt(0),
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

    const MEDICATION_STATIC_VARIABLES = {
        refills: '0',
        writtenDate: new Date().toISOString().split('T')[0],
        note: 'From Bioverse, Supervising physician: Dr. Bobby Desai, MD',
    };

    const constructScript = () => {
        setConfirmationMessage(<></>);

        if (selectedMedicationVariantIndex === -1) {
            setConfirmationMessage(
                <>
                    <BioType className='text-red-500 it-body1'>
                        There was no medication/dosage selected
                    </BioType>
                </>
            );
            return;
        }

        const variant_index_script_instructions = getEmpowerCatalogObject(
            orderData.product_href as PRODUCT_HREF,
            selectedMedicationVariantIndex
        );

        const newRxArrayConstructed: EmpowerNewRx[] = [];

        const sigs_list: string[] = [];

        let diagnosis_obtained;
        if (bmiDataPresent) {
            diagnosis_obtained = getDiagnosisWithBMIData(bmiData);
        }

        //construct Diagnosis Object
        const diagnosis: EmpowerDiagnosis = diagnosis_obtained
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

        const script_json: EmpowerPrescriptionOrder = {
            ...SCRIPT_NON_REPEATED_VARIABLES,
            newRxs: newRxArrayConstructed,
        };

        setConfirmationSigs(sigs_list);
        setConfirmationScript(script_json);
        setConfirmationWindowOpen(true);
    };

    const handleProviderPrescribeAudit = async () => {
        const time = new Date().getTime(); // Record start time

        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: 'prescribe_intake',
            timestamp: time,
            metadata: {
                pharmacy: 'empower',
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            ...(orderType === OrderType.RenewalOrder
                ? {
                      renewal_order_id: orderData.renewal_order_id,
                      order_id: orderData.original_order_id!,
                  }
                : { order_id: orderData.id }),
        };

        await createNewProviderActivityAudit(new_audit);
    };

    const handleOrderStatusTagChange = async () => {
        const orderId =
            orderType === OrderType.RenewalOrder
                ? orderData.renewal_order_id
                : orderData.id;

        await createUserStatusTagWAction(
            'Resolved',
            orderId,
            StatusTagAction.REPLACE,
            patientData.id,
            'Changed to a resolved status after order has been approved and prescribed',
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            ['Resolved']
        );
    };

    const submitScript = async () => {
        setIsSubmitting(true);

        if (!confirmationScript) {
            return;
        }

        await handleProviderPrescribeAudit();

        const resp = await processEmpowerScript(
            orderData.id,
            orderData.order_status,
            orderData.assigned_provider,
            confirmationScript,
            orderType,
            orderData.subscription_id ? orderData.subscription_id : '',
            orderData,
            selectedMedicationVariantIndex
        );

        if (orderType === OrderType.Order) {
            await saveScriptForFutureUse(
                confirmationScript,
                orderData.id,
                'empower',
                ScriptSource.EmpowerWindowV2
            );
        } else if (orderType === OrderType.RenewalOrder) {
            await saveScriptForFutureUse(
                confirmationScript,
                orderData.renewal_order_id!,
                'empower',
                ScriptSource.EmpowerWindowV2
            );
        }

        await handleOrderStatusTagChange();

        if (resp.result === 'success') {
            setIsSubmitting(false);
            setConfirmationMessage(
                <BioType className='itd-body text-green-500'>
                    🚀 Processed successfully 🚀
                </BioType>
            );
        } else if (resp.result === 'failure') {
            console.log(
                'EMPOWER ERROR LOG: ',
                'script producted: ',
                confirmationScript,
                `failure reason: reason START | ${resp.reason} | END reason`
            );
            setConfirmationMessage(
                <BioType className='itd-body text-red-500'>
                    There was an issue. Engineering has logged the issue. Please
                    inform Coordinators.
                </BioType>
            );
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Paper className='w-full flex flex-col max-w-[1000px]'>
                <div className='flex flex-col gap-4 p-8'>
                    <BioType className='h6 text-primary self-center'>
                        Prescribe to Empower
                    </BioType>
                    <div className='flex flex-row gap-2 items-center w-full'>
                        {/* Container for Select with a fixed max-width */}
                        <div
                            style={{
                                flexGrow: 1,
                                maxWidth: 'calc(100% - 85px)',
                            }}
                        >
                            <Select
                                disabled={!selectedMedicationEditable}
                                value={selectedMedicationVariantIndex}
                                onChange={(event) => {
                                    setSelectedMedicationVariantIndex(
                                        event.target.value as number
                                    );
                                }}
                                sx={{ width: '100%' }} // Adjusted to fill the container width
                            >
                                <MenuItem
                                    sx={{
                                        fontStyle: 'italic',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    disabled
                                    value={-1}
                                >
                                    Please Select
                                </MenuItem>
                                {EMPOWER_VARIANT_SCRIPT_DATA.map(
                                    (
                                        data: EmpowerVariantSigData,
                                        index: number
                                    ) => (
                                        <MenuItem
                                            key={index}
                                            value={index}
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            <div>{data.selectDisplayName}</div>
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </div>
                        {/* Button container */}
                        <div className='flex-none'>
                            <Button
                                variant='contained'
                                onClick={() =>
                                    setSelectedMedicationEditable(true)
                                }
                            >
                                Edit
                            </Button>
                        </div>
                    </div>

                    {isSubmitting ? (
                        <Button variant='outlined' disabled>
                            <CircularProgress color='secondary' />
                        </Button>
                    ) : (
                        <Button variant='outlined' onClick={constructScript}>
                            CONFIRM
                        </Button>
                    )}

                    <div>{confirmationMessage}</div>
                </div>
            </Paper>
            {confirmationScript && (
                <ConfirmationWindow
                    open={confirmationWindowOpen}
                    onClose={closeConfirmationWindow}
                    onSubmit={submitScript}
                    script={confirmationScript}
                    sigList={confirmationSigs}
                />
            )}
        </>
    );
}

interface ConfirmationWindowProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    script: EmpowerPrescriptionOrder;
    sigList: string[];
}

function ConfirmationWindow({
    open,
    onClose,
    onSubmit,
    script,
    sigList,
}: ConfirmationWindowProps) {
    const confirm = () => {
        onSubmit();
        onClose();
    };

    return (
        <>
            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {'Confirmation'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        <BioType className='it-body'>
                            Please confirm the below medications and sig&apos;s
                        </BioType>
                        {script.newRxs.map(
                            (rx: EmpowerNewRx, index: number) => {
                                return (
                                    <div key={index} className='py-2 w-full'>
                                        <BioType className='itd-body text-primary'>
                                            Medication:{' '}
                                            <span className='it-body text-[#000000]'>
                                                {rx.medication.drugDescription}
                                            </span>
                                        </BioType>
                                        <BioType className='itd-body text-primary'>
                                            Sig:{' '}
                                            <span className='it-body text-[#000000]'>
                                                {sigList[index]}
                                            </span>
                                        </BioType>
                                    </div>
                                );
                            }
                        )}
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color='error' variant='outlined'>
                        Cancel
                    </Button>
                    <Button
                        onClick={confirm}
                        color='primary'
                        autoFocus
                        variant='outlined'
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
