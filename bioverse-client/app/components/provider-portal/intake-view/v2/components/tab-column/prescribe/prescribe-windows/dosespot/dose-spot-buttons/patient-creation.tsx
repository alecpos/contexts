'use client';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { updatePatientDoseSpotPatientId } from '@/app/utils/actions/provider/patient-intake';
import { getProviderDoseSpotIdWithId } from '@/app/utils/database/controller/providers/providers-api';
import { validatePatientData } from '@/app/services/dosespot/v1/field-utils/string-field-modification';
import { addPatient } from '@/app/services/dosespot/v1/patient/patient-actions';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { addPatientV2 } from '@/app/services/dosespot/v2/patient/dose-spot-patient-controller-v2';

/**
 * Author: @NathanCho
 * Created Feb 5, 2024
 *
 * Component Purpose: Dose Spot Patient Creation button activated by the Provider.
 */

interface Props {
    providerId: string;
    patientData: DBPatientData;
    setDoseSpotId: Dispatch<SetStateAction<string | undefined>>;
    orderData: any;
}

export default function PatientCreateDSButton({
    providerId,
    patientData,
    setDoseSpotId,
    orderData,
}: Props) {
    const [openConfirmationDialogue, setConfirmationDialogueOpenStatus] =
        useState(false);
    const [approvalSnackbarOpenState, setApprovalSnackbarOpenState] =
        useState<boolean>(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);
    const [isCreatingPatient, setIsCreatingPatient] = useState<boolean>(false);

    const router = useRouter();

    const handleOpenValidationMessage = () => {
        setConfirmationDialogueOpenStatus(true);
    };

    const handleCloseValidationMessage = () => {
        setConfirmationDialogueOpenStatus(false);
    };

    const handleSnackbarClose = () => {
        setApprovalSnackbarOpenState(false);
    };

    const createDoseSpotPatient = async () => {
        setIsCreatingPatient(true);

        const patientInformationChecked: DoseSpotPatientDetails =
            validatePatientData(patientData, orderData);

        // const providerDoseSpotId = await getProviderDoseSpotIdWithId(
        //     providerId
        // );

        const addedPatient = await addPatientV2(patientInformationChecked);

        if (addedPatient) {
            const idAdded = addedPatient.Id;

            if (idAdded === -1) {
                console.log(
                    'Dose Spot Patient Creation Failure (DoseSpot): Id of patient to add returned -1'
                );
                setIsCreatingPatient(false);
                setErrorSnackbarOpen(true);
                return;
            }
            await updatePatientDoseSpotPatientId(patientData.id, idAdded);
            setDoseSpotId(idAdded);
            setIsCreatingPatient(false);
        } else {
            setIsCreatingPatient(false);
            setErrorSnackbarOpen(true);
        }
        router.refresh();
    };

    const handleSnackbarOpen = () => {
        setApprovalSnackbarOpenState(true);
    };

    return (
        <>
            <div className='flex-row flex gap-2'>
                <Button
                    variant='contained'
                    onClick={handleOpenValidationMessage}
                >
                    Create DoseSpot Patient
                </Button>

                <ConfirmDoseSpotPatientCreationDialog
                    open={openConfirmationDialogue}
                    onClose={handleCloseValidationMessage}
                    onConfirm={createDoseSpotPatient}
                    isCreatingPatient={isCreatingPatient}
                />

                <div>
                    <BioverseSnackbarMessage
                        open={approvalSnackbarOpenState}
                        setOpen={setApprovalSnackbarOpenState}
                        color={'success'}
                        message='The order was approved successfully! Refresh the
                            page to prescribe if the button does not appear.'
                    />
                    <BioverseSnackbarMessage
                        open={errorSnackbarOpen}
                        setOpen={setErrorSnackbarOpen}
                        color={'error'}
                        message={`There was an error in creating the patient, please contact Engineering if this persists.`}
                    />
                </div>
            </div>
        </>
    );
}

interface ConfirmDoseSpotPatientCreationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isCreatingPatient: boolean;
}

const ConfirmDoseSpotPatientCreationDialog: React.FC<
    ConfirmDoseSpotPatientCreationDialogProps
> = ({ open, onClose, onConfirm, isCreatingPatient }) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='confirm-dose-spot-patient-creation-dialog-title'
        aria-describedby='confirm-dose-spot-patient-creation-dialog-description'
    >
        <DialogTitle id='confirm-dose-spot-patient-creation-dialog-title'>
            {'Create DoseSpot Patient Account?'}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id='confirm-dose-spot-patient-creation-dialog-description'>
                This action will create a new patient account in DoseSpot.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {isCreatingPatient && <CircularProgress />}
            <Button onClick={onConfirm} color='primary' variant='contained'>
                CREATE PATIENT
            </Button>
            <Button
                onClick={onClose}
                autoFocus
                variant='outlined'
                color='error'
            >
                CANCEL
            </Button>
        </DialogActions>
    </Dialog>
);
