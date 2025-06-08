'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { getEscalationMessage } from './escalation-constants';
import {
    createSupabaseEscalation,
    createSupabaseEscalationByPharmacy,
} from '@/app/utils/database/controller/escalations/escalations-api';
import { Status } from '@/app/types/global/global-enumerators';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface EscalateDialogProps {
    open: boolean;
    onClose: () => void;
    selectedRowData: PatientOrderAdminDetails | null;
}

export default function EscalateOrderDialog({
    open,
    onClose,
    selectedRowData,
}: // order_id,
// patient_id,
// patient_first_name,
// patient_last_name,
// patient_dob
EscalateDialogProps) {
    const [noteTextInput, setNoteTextInput] = useState<string>('');
    const [clarificationTextInput, setClarificationTextInput] =
        useState<string>('');
    const [selectedEscalationType, setSelectedEscalationType] =
        useState<string>('please-select');
    const [errorMessage, setErrorMessage] = useState<JSX.Element>(<></>);
    const [isCreatingEscalation, setIsCreatingEscalation] =
        useState<boolean>(false);

    if (!selectedRowData || selectedRowData == null) {
        return;
    }

    const getCustomerIOEvent = () => {
        switch (selectedRowData.pharmacy) {
            case 'tmc':
                return 'tmc-escalate';
            case 'empower':
                return 'escalate-order';
            case 'hallandale':
                return 'hallandale-escalate';
            default:
                return null;
        }
    };

    const createEscalation = async () => {
        setIsCreatingEscalation(true);
        setErrorMessage(<></>);

        if (!noteTextInput.trim()) {
            setErrorMessage(
                <BioType className='text-red-400'>
                    Note cannot be empty.
                </BioType>
            );
            setIsCreatingEscalation(false);
            return;
        }

        if (
            selectedEscalationType === 'new_rx' &&
            !clarificationTextInput.trim()
        ) {
            setErrorMessage(
                <BioType className='text-red-400'>
                    Clarification cannot be empty.
                </BioType>
            );
            setIsCreatingEscalation(false);
            return;
        }

        setErrorMessage(<></>);

        const escalation_data: EscalationDataObject = {
            order_id: selectedRowData.id,
            patient_id: selectedRowData.patientId,
            type: selectedEscalationType,
            note: noteTextInput,
            metadata: {
                ...(clarificationTextInput
                    ? { clarification: clarificationTextInput }
                    : {}),
                email_content: getEscalationMessage(
                    selectedEscalationType,
                    selectedRowData.patient_last_name.charAt(0),
                    selectedRowData.patient_first_name,
                    selectedRowData.date_of_birth,
                    clarificationTextInput
                ),
                pharmacy: selectedRowData.pharmacy,
            },
            escalated_by: (await readUserSession()).data.session?.user.id!,
            assigned_pharmacy: selectedRowData.pharmacy,
        };

        const event = getCustomerIOEvent();

        if (event == null) {
            setErrorMessage(
                <BioType className='text-red-400'>
                    Escalation to this pharmacy is not yet supported. Contact
                    engineering.
                </BioType>
            );
            setIsCreatingEscalation(false);
            return;
        }

        const result = await createSupabaseEscalationByPharmacy(
            escalation_data,
            event
        );

        if (result === Status.Error) {
            setIsCreatingEscalation(false);
            setErrorMessage(
                <BioType className='itd-subtitle text-red-500'>
                    There was an issue with escalating this order.
                </BioType>
            );
        }

        if (result === Status.Success) {
            setIsCreatingEscalation(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <BioType className='itd-h1'>Escalate Order</BioType>
            </DialogTitle>
            <DialogContent style={{ minWidth: '500px' }}>
                <div className='flex flex-col gap-4'>
                    <div>
                        <BioType className='it-body'>Escalation Type:</BioType>
                        <Select
                            value={selectedEscalationType}
                            onChange={(e) => {
                                setSelectedEscalationType(e.target.value);
                            }}
                            fullWidth
                            autoFocus
                        >
                            <MenuItem value={'please-select'} disabled>
                                Please Select
                            </MenuItem>
                            <MenuItem value={'cancel'}>Cancel Order</MenuItem>
                            <MenuItem value={'escalate'}>Escalate</MenuItem>
                            <MenuItem value={'new_rx'}>New Rx</MenuItem>
                            <MenuItem value={'late_shipment'}>
                                Late Shipment
                            </MenuItem>
                        </Select>
                    </div>

                    <div>
                        <BioType className='it-body'>Note:</BioType>
                        <TextField
                            fullWidth
                            value={noteTextInput}
                            onChange={(e) => {
                                setNoteTextInput(e.target.value);
                            }}
                        />
                    </div>

                    {selectedEscalationType === 'new_rx' && (
                        <div>
                            <BioType className='it-body'>
                                Clarification:
                            </BioType>
                            <TextField
                                fullWidth
                                variant='outlined'
                                value={clarificationTextInput}
                                onChange={(e) => {
                                    setClarificationTextInput(e.target.value);
                                }}
                                multiline
                            />
                        </div>
                    )}

                    {selectedEscalationType !== 'please-select' && (
                        <div>
                            <BioType className='itd-body'>
                                Preview Email Message:
                            </BioType>
                            <div className='p-3'>
                                <BioType className='itd-body'>
                                    {getEscalationMessage(
                                        selectedEscalationType,
                                        selectedRowData.patient_last_name.charAt(
                                            0
                                        ),
                                        selectedRowData.patient_first_name,
                                        selectedRowData.date_of_birth,
                                        clarificationTextInput
                                    )}
                                </BioType>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <div className='flex flex-col gap-2'>
                    <div>{errorMessage}</div>
                    <div className='flex flex-row gap-2'>
                        <Button
                            onClick={onClose}
                            color='error'
                            variant='outlined'
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            onClick={createEscalation}
                            color='primary'
                            disabled={
                                selectedEscalationType === 'please-select'
                            }
                        >
                            {isCreatingEscalation ? (
                                <CircularProgress
                                    size={24}
                                    sx={{ color: 'white' }}
                                />
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </Dialog>
    );
}
