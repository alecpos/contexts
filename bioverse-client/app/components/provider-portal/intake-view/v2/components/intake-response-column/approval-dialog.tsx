import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Select,
    MenuItem,
    DialogActions,
    Button,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { active_pharmacies } from '../../constants/active-pharmacies';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    setSelectedPharmacy: Dispatch<SetStateAction<string>>;
    selectedPharmacy: string;
}

const ConfirmPaymentDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    setSelectedPharmacy,
    selectedPharmacy,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
    >
        <DialogTitle id='alert-dialog-title'>
            {'Approve Patient Prescription Order?'}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id='alert-dialog-description'>
                Which Pharmacy will you be prescribing this with?
            </DialogContentText>
            <Select
                value={selectedPharmacy}
                onChange={(event) => setSelectedPharmacy!(event.target.value)}
            >
                <MenuItem key={'empty'} value='Please Select'>
                    <em>Please Select</em>
                </MenuItem>
                {active_pharmacies.map((item) => (
                    <MenuItem key={item.key} value={item.value}>
                        {item.key}
                    </MenuItem>
                ))}
            </Select>
            <DialogContentText id='alert-dialog-description'>
                Are you sure you want to approve of this order?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onConfirm}
                color='primary'
                disabled={selectedPharmacy === 'Please Select'}
                variant='contained'
            >
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

export default ConfirmPaymentDialog;
