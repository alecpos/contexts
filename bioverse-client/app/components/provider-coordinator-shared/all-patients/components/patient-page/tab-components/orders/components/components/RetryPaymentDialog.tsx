'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { OrderType } from '@/app/types/orders/order-types';
import { retryPaymentFailureOnOrder } from '@/app/utils/database/controller/payment_failures/payment-failures';

interface RetryPaymentDialogProps {
    open: boolean;
    onClose: () => void;
    orderId: string | number;
    orderType: OrderType;
}

export default function RetryPaymentDialogPatientChart({
    open,
    onClose,
    orderId,
    orderType,
}: RetryPaymentDialogProps) {
    const handleSubmit = async () => {
        const result = await retryPaymentFailureOnOrder(orderId, orderType);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Retry Payment</DialogTitle>
            <DialogContent>
                <BioType className='itd-body'>
                    Retry payment for this patient?
                </BioType>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='error'>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color='primary'>
                    Retry
                </Button>
            </DialogActions>
        </Dialog>
    );
}
