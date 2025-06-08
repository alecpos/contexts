'use client';

import { editEscalationNote } from '@/app/utils/database/controller/escalations/escalations-api';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { KeyedMutator } from 'swr';

interface EditEscalationNoteDialogProps {
    escalation_id: number;
    open: boolean;
    handleClose: () => void;
    current_note: string;
    mutate_escalations: KeyedMutator<PatientEscalationData[]>;
}

export default function EditEscalationNoteDialog({
    escalation_id,
    open,
    handleClose,
    current_note,
    mutate_escalations,
}: EditEscalationNoteDialogProps) {
    const [escalationNote, setEscalationNote] = useState<string>(current_note);
    const [isSendingEdit, setIsSendingEdit] = useState<boolean>(false);

    const handleChangeEscalationNote = async () => {
        setIsSendingEdit(true);
        await editEscalationNote(escalation_id, escalationNote);
        mutate_escalations();
        handleClose();
        setIsSendingEdit(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='form-dialog-title'
            >
                <DialogTitle id='form-dialog-title'>
                    Edit Escalation Note
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your note for the escalation.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='note'
                        label='Escalation Note'
                        type='text'
                        fullWidth
                        value={escalationNote}
                        onChange={(e) => setEscalationNote(e.target.value)}
                        multiline
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color='error'
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChangeEscalationNote}
                        color='primary'
                        variant='contained'
                    >
                        {!isSendingEdit ? (
                            'Save'
                        ) : (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={24}
                            />
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
