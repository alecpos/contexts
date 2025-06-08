import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface ClearAssignedDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ClearAssignedDialog: React.FC<ClearAssignedDialogProps> = ({
    open,
    onClose,
    onConfirm,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Clear Assigned Provider</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to clear the assigned provider for
                    this order?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='primary'>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color='primary' variant='contained'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClearAssignedDialog;
