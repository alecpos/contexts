'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface TipTapURLInputModalProps {
    open: boolean;
    onClose: () => void;
    setLink: (url: string, displayText: string) => void;
}

export default function TipTapURLInputModal({
    open,
    onClose,
    setLink,
}: TipTapURLInputModalProps) {
    const [url, setUrl] = useState('');
    const [displayText, setDisplayText] = useState('');

    const handleSetLink = () => {
        setLink(url, displayText);
        onClose(); // Close the modal after setting the link
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add a Link</DialogTitle>
            <DialogContent>
                <BioType className='itd-body text-[#666666]'>
                    Be sure to copy the entire link with http / https
                </BioType>
                <TextField
                    autoFocus
                    margin='dense'
                    id='url'
                    label='URL'
                    type='url'
                    fullWidth
                    variant='outlined'
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <TextField
                    margin='dense'
                    id='displayText'
                    label='Display Text'
                    type='text'
                    fullWidth
                    variant='outlined'
                    value={displayText}
                    onChange={(e) => setDisplayText(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSetLink}>Add Link</Button>
            </DialogActions>
        </Dialog>
    );
}
