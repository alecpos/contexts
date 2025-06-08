'use client';
import { updatePatientUpdateStatus } from '@/app/utils/actions/provider/patient-intake';
import { validatePatientData } from '@/app/services/dosespot/v1/field-utils/string-field-modification';
import { editPatient } from '@/app/services/dosespot/v1/patient/patient-actions';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { editPatientV2 } from '@/app/services/dosespot/v2/patient/dose-spot-patient-controller-v2';

/**
 * Author: @NathanCho
 * Created Feb 5, 2024
 *
 * Component Purpose: Dose Spot Patient Creation button activated by the Provider.
 */

interface Props {
    patientData: DBPatientData;
    orderData: any;
}

export default function PatientUpdateDSButton({
    patientData,
    orderData,
}: Props) {
    const [openConfirmationDialogue, setConfirmationDialogueOpenStatus] =
        useState(false);
    const [approvalSnackbarOpenState, setApprovalSnackbarOpenState] =
        useState<boolean>(false);
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

        // const addedPatient = await addPatient(providerId, patientInformationChecked); //needed later
        const response = await editPatientV2(
            patientData.dose_spot_id!,
            patientInformationChecked
        );

        if (response) {
            updatePatientUpdateStatus(patientData.id);
            setIsCreatingPatient(false);
            router.refresh();
        } else {
            setIsCreatingPatient(false);
        }
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
                    Update Patient Data
                </Button>

                <ConfirmDoseSpotPatientUpdateDialog
                    open={openConfirmationDialogue}
                    onClose={handleCloseValidationMessage}
                    onConfirm={createDoseSpotPatient}
                    isLoading={isCreatingPatient}
                />

                <div>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={approvalSnackbarOpenState}
                        onClose={handleSnackbarClose}
                        autoHideDuration={5000}
                    >
                        <Alert onClose={handleSnackbarClose} severity='success'>
                            The order was approved successfully! Refresh the
                            page to prescribe now.
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </>
    );
}

interface ConfirmDoseSpotPatientUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

const ConfirmDoseSpotPatientUpdateDialog: React.FC<
    ConfirmDoseSpotPatientUpdateDialogProps
> = ({ open, onClose, onConfirm, isLoading }) => (
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
                Update the patient records in DoseSpot?
            </DialogContentText>
            {isLoading && <CircularProgress></CircularProgress>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onConfirm} color='primary' variant='contained'>
                UPDATE
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
