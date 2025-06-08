'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { note } from 'pdfkit';
import { useState } from 'react';

interface EditNoteModalProps {
    open: boolean;
    onClose: () => void;
    note: string;
    onSave: (newNote: string) => void;
}

export default function EditNoteModal({
    open,
    onClose,
    note,
    onSave,
}: EditNoteModalProps) {
    const [editedNote, setEditedNote] = useState(note);

    const handleSave = () => {
        onSave(editedNote);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogContent style={{ width: '600px' }}>
                <TextField
                    multiline
                    autoFocus
                    margin='dense'
                    label='Note'
                    type='text'
                    fullWidth
                    variant='outlined'
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='error'>
                    Cancel
                </Button>
                <Button onClick={handleSave} color='primary'>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
