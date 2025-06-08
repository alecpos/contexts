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
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    padding: '12px',
                    minWidth: '31vw',
                },
            }}
        >
            <DialogTitle>
                <BioType className='inter'>Add a Link</BioType>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-2'>
                    <BioType className='inter-body'>
                        Be sure to copy the entire link with http or https
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#FBFAFC',
                            },
                        }}
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#FBFAFC',
                            },
                        }}
                    />
                </div>
                <div className='flex flex-row gap-2 items-center justify-center mt-2'>
                    <Button
                        onClick={onClose}
                        color='error'
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            padding: '12px 32px',
                        }}
                    >
                        <BioType className='inter text-[#666666]'>
                            Cancel
                        </BioType>
                    </Button>
                    <Button
                        onClick={handleSetLink}
                        variant='contained'
                        sx={{
                            backgroundColor: '#000000',
                            '&:hover': {
                                backgroundColor: '#666666',
                            },
                            borderRadius: '12px',
                            textTransform: 'none',
                            padding: '12px 32px',
                        }}
                    >
                        <BioType className='inter'>Add Link</BioType>
                    </Button>
                </div>
            </DialogContent>
            {/* <DialogActions></DialogActions> */}
        </Dialog>
    );
}
