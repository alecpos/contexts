import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { useState } from 'react';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title: string;
    content: string;
    showReason?: boolean;
}

export default function CancelSubscriptionConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title,
    content,
    showReason = true,
}: ConfirmationDialogProps) {
    const [reason, setReason] = useState<string>('');

    const handleDeny = () => {
        onClose();
        // Additional actions on deny
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
                <div>
                    <DialogContentText id='alert-dialog-description'>
                        {content}
                    </DialogContentText>
                </div>
                {showReason && (
                    <div className='mt-4'>
                        <TextField
                            fullWidth
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeny} variant='outlined'>
                    NEVERMIND
                </Button>
                <Button
                    disabled={
                        showReason && title === 'Cancel Order For Patient'
                            ? reason.trim() !== 'I understand'
                            : reason.trim() !== ''
                    }
                    onClick={() => onConfirm(reason)}
                    autoFocus
                    variant='outlined'
                    color='error'
                >
                    {showReason ? 'Confirm cancelation' : 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
