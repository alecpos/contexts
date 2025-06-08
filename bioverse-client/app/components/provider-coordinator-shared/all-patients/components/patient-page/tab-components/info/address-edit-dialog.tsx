'use client';
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, TextField } from '@mui/material';
import { adminEditOrderAddressInformation } from '@/app/utils/database/controller/profiles/profiles';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { ALLOWED_STATES } from '@/app/components/intake-v2/constants/constants';
import { USStates } from '@/app/types/enums/master-enums';
import { OrderType } from '@/app/types/orders/order-types';
import { changePatientAddressInReviveIfNecessary } from '@/app/services/pharmacy-integration/revive/revive-patient-api';

interface InfoEditDialogProps {
    onClose: () => void;
    onConfirm: () => void;
    order_data: any;
    dialog_open: boolean;
    orderType: OrderType;
}

export default function AddressEditDialog({
    onClose,
    onConfirm,
    dialog_open,
    order_data,
    orderType,
}: InfoEditDialogProps) {
    const [address_line1, setAddressLine1] = useState<string>(
        order_data?.address_line1,
    );
    const [address_line2, setAddressLine2] = useState<string>(
        order_data?.address_line2,
    );
    const [city, setCity] = useState<string>(order_data?.city);
    const [state, setResidenceState] = useState<string>(order_data?.state);
    const [zip, setZip] = useState<string>(order_data?.zip);

    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

    const submitAdminEdits = async () => {
        if (!ALLOWED_STATES.includes(state as USStates)) {
            setErrorSnackbarOpen(true);
            return;
        }

        const newAddressData = {
            address_line1: address_line1,
            address_line2: address_line2,
            city: city,
            state: state,
            zip: zip,
        };

        await changePatientAddressInReviveIfNecessary(
            orderType === OrderType.Order
                    ? order_data.customer_uid
                    : order_data.customer_uuid,
            newAddressData,
            orderType === OrderType.Order
                ? order_data.id.toString()
                : order_data.renewal_order_id,
        );

        await adminEditOrderAddressInformation(
            newAddressData,
            order_data,
            orderType,
        );

        onConfirm();
        onClose();
    };

    return (
        <Dialog open={dialog_open} onClose={onClose}>
            <DialogTitle>
                <span className="h5">Edit Patient Address</span>
            </DialogTitle>
            <DialogContent>
                <form>
                    <FormControl
                        fullWidth
                        margin="normal"
                        className="flex flex-col gap-4"
                    >
                        <TextField
                            id="addressLine1"
                            label="Street Address"
                            value={address_line1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                        />
                        <TextField
                            id="addressLine2"
                            label="Line 2"
                            value={address_line2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                        />
                        <TextField
                            id="city"
                            label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <TextField
                            id="state"
                            label="State"
                            value={state}
                            onChange={(e) => setResidenceState(e.target.value)}
                        />
                        <TextField
                            id="zip"
                            label="Zip"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        submitAdminEdits();
                    }}
                >
                    Save
                </Button>
            </DialogActions>
            <BioverseSnackbarMessage
                open={errorSnackbarOpen}
                setOpen={() => {
                    setErrorSnackbarOpen(true);
                }}
                color={'error'}
                message={'You cannot change the address to that state.'}
            />
        </Dialog>
    );
}
