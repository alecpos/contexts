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
} from '@mui/material';
import { useState } from 'react';
import { KeyedMutator, mutate } from 'swr';

interface BasicDialogProps {
    open: boolean;
    onClose: () => void;
    patient_id: string;
    order_id: string;
}

export default function CoordinatorAddManualInternalNoteDialog({
    open,
    onClose,
    patient_id,
    order_id,
}: BasicDialogProps) {
    const [inputNote, setInputNote] = useState<string>('');

    const postNewInternalNote = async () => {
        const currentUserId = (await readUserSession()).data.session?.user.id;

        // I return a Status object - string enum here.
        const result = await createNewInternalNote(
            currentUserId!,
            inputNote,
            order_id,
            patient_id
        );

        setInputNote('');
        mutate(`${patient_id}-notes`);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ style: { minWidth: '35vw', padding: '4px' } }}
        >
            <DialogTitle sx={{ backgroundColor: '#FAFAFA' }}>
                <span className='font-inter text-[18px] font-bold text-[#00000099]'>
                    Add custom note
                </span>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-2 p-2'>
                    <BioType className='font-inter text-[16px]'>
                        Adding note for BV-{order_id}
                    </BioType>
                    <TextField
                        label='Note'
                        value={inputNote}
                        onChange={(e) => setInputNote(e.target.value)}
                        fullWidth
                        margin='normal'
                        multiline
                        rows={4}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant='contained'
                    color='primary'
                    sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        px: 6,
                        py: 0,
                        height: '36px',
                        borderRadius: 'var(--Corner-radius-M,12px)',
                        bgcolor: 'white',
                        color: 'black',
                        '&:hover': {
                            bgcolor: '#ffebee',
                            color: '#d32f2f',
                        },
                    }}
                >
                    <span className='font-inter'>Close</span>
                </Button>
                <Button
                    onClick={postNewInternalNote}
                    variant='contained'
                    color='primary'
                    disabled={!inputNote}
                    sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        px: 6,
                        py: 0,
                        height: '36px',
                        borderRadius: 'var(--Corner-radius-M,12px)',
                        bgcolor: 'black',
                        '&:hover': {
                            bgcolor: '#666666',
                        },
                    }}
                >
                    <span className='font-inter'>Create Note</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
}
