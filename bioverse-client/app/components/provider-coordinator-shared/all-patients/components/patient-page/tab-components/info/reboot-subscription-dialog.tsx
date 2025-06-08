'use client';
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel, InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { adminEditOrderAddressInformation } from '@/app/utils/database/controller/profiles/profiles';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { ALLOWED_STATES } from '@/app/components/intake-v2/constants/constants';
import { USStates } from '@/app/types/enums/master-enums';
import { OrderType } from '@/app/types/orders/order-types';
import { changePatientAddressInReviveIfNecessary } from '@/app/services/pharmacy-integration/revive/revive-patient-api';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface InfoEditDialogProps {
    onClose: () => void;
    onConfirm: (variantIndex: number, scheduledOrImmediate: 'scheduled' | 'immediate') => void;
    order_data: any;
    dialog_open: boolean;
    orderType: OrderType;
}

export default function RebootSubscriptionDialog({
    onClose,
    onConfirm,
    dialog_open,
    order_data,
    orderType,
}: InfoEditDialogProps) {

    const [chosenVariantIndex, setChosenVariantIndex] = useState<number>(order_data.variant_index);
    const [scheduledOrImmediate, setScheduledOrImmediate] = useState<'scheduled' | 'immediate'>('scheduled');
    const [postPVCVariantIndex, setPostPVCVariantIndex] = useState<string>('not calculated');
    const [postPVCPharmacy, setPostPVCPharmacy] = useState<string>('not calculated');

    useEffect(() => {
        const pvcResult = pvcConvertAVariantIndex(chosenVariantIndex);
        setPostPVCVariantIndex(pvcResult.new_variant_index as string);
        setPostPVCPharmacy(pvcResult.new_pharmacy as string);
    }, [chosenVariantIndex]);

    const handleScheduleChange = (type: 'scheduled' | 'immediate') => {
        setScheduledOrImmediate(type);
    };

    const pvcConvertAVariantIndex = (variantIndex: number) => {
        const pvc = new ProductVariantController(
            order_data.product_href as PRODUCT_HREF,
            variantIndex,
            order_data.state as USStates
        );
        const pvc_result = pvc.getConvertedVariantIndex();
        const new_variant_index = pvc_result.variant_index ?? 'not found';
        const new_pharmacy = pvc_result.pharmacy ?? 'not found';
        return {new_variant_index, new_pharmacy};
    };


    return (
        <Dialog open={dialog_open} onClose={onClose}>
            <DialogTitle>
                <span className="h5">Reboot Subscription</span>
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <FormControl>
                        <p className='text-sm font-medium'>Variant Index</p>
                        <TextField
                            
                            type="number"
                            value={chosenVariantIndex}
                            onChange={(e) => setChosenVariantIndex(Number(e.target.value))}
                            inputProps={{ min: 1 }}
                        />
                    </FormControl>

                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-medium'>Post-PVC Pharmacy: {postPVCPharmacy}</p>
                        <p className='text-sm font-medium'>Post-PVC Variant Index: {postPVCVariantIndex}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={scheduledOrImmediate === 'scheduled'}
                                    onChange={() => handleScheduleChange('scheduled')}
                                />
                            }
                            label="On their next renewal date"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={scheduledOrImmediate === 'immediate'}
                                    onChange={() => handleScheduleChange('immediate')}
                                />
                            }
                            label="Immediately"
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
            <Button
                sx={{
                    borderRadius: '12px',
                    paddingX: '32px',
                    paddingY: '14px',
                    color: 'white',
                    background: 'linear-gradient(to bottom right, #2dd4bf, #3b82f6, #4ade80)', // teal-400, blue-500, green-400
                    boxShadow: 3,
                    ":hover": {
                    background: 'linear-gradient(to bottom right, #2acfb8, #3a7eea, #45d373)',
                    },
                }}
                onClick={() => {
                    onConfirm(chosenVariantIndex, scheduledOrImmediate);
                }}
            >
                    <span className='normal-case provider-bottom-button-text  text-white'>Reboot!</span>
                </Button>
            </DialogActions>
    
        </Dialog>
    );
}
