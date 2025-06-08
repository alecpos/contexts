'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewInternalNote } from '@/app/utils/database/controller/internal_notes/internal-notes-api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import { useState } from 'react';
import { KeyedMutator } from 'swr';

interface BasicDialogProps {
    open: boolean;
    onClose: () => void;
    mutate_internal_notes: KeyedMutator<any[] | null>;
    patient_id: string;
    internal_note_records: AllPatientsInternalNoteData[];
}

export default function AddManualInternalNoteDialog({
    open,
    onClose,
    mutate_internal_notes,
    patient_id,
    internal_note_records,
}: BasicDialogProps) {
    const [inputOrderId, setInputOrderId] = useState<string>('please-select');
    const [inputNote, setInputNote] = useState<string>('');

    const postNewInternalNote = async () => {
        const currentUserId = (await readUserSession()).data.session?.user.id;

        // I return a Status object - string enum here.
        const result = await createNewInternalNote(
            currentUserId!,
            inputNote,
            inputOrderId,
            patient_id
        );

        setInputOrderId('please-select');
        setInputNote('');
        mutate_internal_notes();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Internal Note</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ paddingTop: '8px' }}>
                    <InputLabel
                        id='manual-note-select'
                        sx={{ marginTop: '8px' }}
                    >
                        Order ID
                    </InputLabel>
                    <Select
                        labelId='manual-note-select'
                        label='Order ID'
                        value={inputOrderId}
                        onChange={(e) =>
                            setInputOrderId(e.target.value as string)
                        }
                        fullWidth
                    >
                        <MenuItem value='please-select' disabled>
                            Please Select
                        </MenuItem>
                        {/* 
                          1. internal_note_records.map((r) => r.order_id) gets all order_ids
                          2. new Set() removes duplicates since Sets only store unique values
                          3. Array.from() converts the Set back to an array so we can map over it
                        */}
                        {Array.from(
                            new Set(
                                internal_note_records.map((r) => r.order_id)
                            )
                        ).map((order_id) => {
                            return (
                                <MenuItem
                                    value={order_id as string}
                                    key={order_id}
                                >
                                    {order_id}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <TextField
                    label='Note'
                    value={inputNote}
                    onChange={(e) => setInputNote(e.target.value)}
                    fullWidth
                    margin='normal'
                    multiline
                    rows={4}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color='error'>
                    Close
                </Button>
                <Button
                    onClick={postNewInternalNote}
                    variant='contained'
                    color='primary'
                    disabled={!inputNote || inputOrderId === 'please-select'}
                >
                    Create Note
                </Button>
            </DialogActions>
        </Dialog>
    );
}
