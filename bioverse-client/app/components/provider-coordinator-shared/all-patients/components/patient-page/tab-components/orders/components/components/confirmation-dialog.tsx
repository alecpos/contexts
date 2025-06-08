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
}

export default function OrderTableConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title,
    content,
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
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <div>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </div>
                <div className="mt-4">
                    <TextField
                        label={'Reason'}
                        fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeny} variant="outlined">
                    NEVERMIND
                </Button>
                <Button
                    disabled={reason === ''}
                    onClick={() => onConfirm(reason)}
                    autoFocus
                    variant="outlined"
                    color="error"
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
