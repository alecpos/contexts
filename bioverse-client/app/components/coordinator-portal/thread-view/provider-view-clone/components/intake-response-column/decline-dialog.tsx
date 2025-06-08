import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DenyPaymentDialog: React.FC<DialogProps> = ({
    open,
    onClose,
    onConfirm,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
    >
        <DialogTitle id='alert-dialog-title'>
            {'Decline patient order request?'}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id='alert-dialog-description'>
                Are you sure you want to decline this order? This action cannot
                be reversed by the provider.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onConfirm} color='primary' variant='contained'>
                CONFIRM
            </Button>
            <Button
                onClick={onClose}
                autoFocus
                variant='outlined'
                color='error'
            >
                CANCEL
            </Button>
        </DialogActions>
    </Dialog>
);

export default DenyPaymentDialog;
