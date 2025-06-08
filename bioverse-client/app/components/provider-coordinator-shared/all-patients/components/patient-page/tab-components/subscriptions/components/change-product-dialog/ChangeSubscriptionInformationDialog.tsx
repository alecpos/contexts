import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import {
    retrieveStripeSubscription,
    updateInternalSubscriptionProductAndDate,
    updateSubscriptionProductAndDate,
} from '@/app/services/stripe/subscriptions';
import useSWR from 'swr';
import { SEMAGLUTIDE_TIRZEPATIDE_COMBINED_DISPLAY_ARRAY } from '../../../../../../utils/glp-1-list';
import { getGLP1PriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';
import { isNull } from 'lodash';

interface ChangeSubscriptionInformationDialog {
    open: boolean;
    onClose: () => void;
    subscriptionData: SubscriptionTableItem;
    setSnackbarMessage: any;
    setShowSnackbar: any;
    setSnackbarStatus: any;
}

export default function ChangeSubscriptionInformationDialog({
    open,
    onClose,
    subscriptionData,
    setSnackbarMessage,
    setShowSnackbar,
    setSnackbarStatus,
}: ChangeSubscriptionInformationDialog) {
    const [date, setDate] = useState<Date | null>(new Date());
    const [selectedIndex, setSelectedIndex] = useState<string>('');
    const [selectedMedication, setSelectedMedication] = useState<{
        priceId: string;
        product_href: string;
        variant_index: number;
    }>();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const handleDeny = () => {
        onClose();
        // Additional actions on deny
    };

    const { data } = useSWR(
        `${subscriptionData.stripe_subscription_id}-data`,
        () =>
            retrieveStripeSubscription(subscriptionData.stripe_subscription_id)
    );

    const { data: glp1_variant_data } = useSWR(`glp1-prices`, () =>
        getGLP1PriceVariantTableData()
    );

    useEffect(() => {
        if (data) {
            const stripe_data = JSON.parse(data);
            const endDate = new Date(stripe_data.current_period_end * 1000); // Convert epoch to milliseconds
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 30); // Subtract 30 days from endDate
            setDate(endDate); // Set the date to 30 days prior to endDate
        }
    }, [data]);

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedIndex(event.target.value);

        if (isNull(glp1_variant_data)) {
            return;
        }

        const selectedVariant = glp1_variant_data?.find(
            (_, index) => index === parseInt(event.target.value)
        );

        if (selectedVariant) {
            setSelectedMedication({
                priceId:
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
                        ? selectedVariant.stripe_price_ids!.dev
                        : selectedVariant.stripe_price_ids!.prod,
                product_href: selectedVariant.product_href!,
                variant_index: selectedVariant.variant_index!,
            });
        }
    };

    // TODO: Add handling for different variants
    const handleClick = async () => {
        if (!selectedMedication) {
            return;
        }

        setButtonLoading(true);
        try {
            // tirzepatide: price_1Om8TjDyFtOu3ZuTns8m2lM9
            // sema: price_1Om7LwDyFtOu3ZuTGzqgOVvt

            const updateStripeSuccess = await updateSubscriptionProductAndDate(
                subscriptionData.stripe_subscription_id,
                subscriptionData.product_href,
                selectedMedication.priceId,
                // 'price_1Om8TjDyFtOu3ZuTns8m2lM9',
                date || new Date()
            );

            if (!updateStripeSuccess) {
                setSnackbarMessage(
                    `Error: Failed to update order. Please contact engineering.`
                );
                setSnackbarStatus('error');
                setShowSnackbar(true);
                return;
            }

            const updateInternalSuccess =
                await updateInternalSubscriptionProductAndDate(
                    subscriptionData.id,
                    selectedMedication.product_href,
                    subscriptionData.patient_id
                );

            if (!updateInternalSuccess) {
                setSnackbarMessage(
                    `Error: Updated Stripe, but not internal. Please contact engineering with a screenshot of this message!!`
                );
                setSnackbarStatus('error');
                setShowSnackbar(true);
                return;
            }

            setSnackbarMessage(`Successfuly updated order`);
            setSnackbarStatus('success');
            setShowSnackbar(true);
        } catch (error) {
            setSnackbarMessage(
                `Error: Failed to update order. Please contact engineering.`
            );
            setSnackbarStatus('error');
            setShowSnackbar(true);
        } finally {
            setButtonLoading(false);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>
                <BioType className='h4'>
                    Change Subscription Information for Patient
                </BioType>
            </DialogTitle>
            <DialogContent className='flex flex-col space-y-4'>
                <div className='flex flex-col justify-center gap-2'>
                    <BioType className='it-body'>Next Renewal Date:</BioType>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label='Select Date'
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                        />
                    </LocalizationProvider>
                </div>
                <Box className='flex justify-center w-full'>
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id='selected-medication-input'>
                            New Medication
                        </InputLabel>
                        <Select
                            id='selected-medication-select'
                            value={selectedIndex}
                            onChange={handleChange}
                            label='Current Medication'
                        >
                            <MenuItem value='' disabled>
                                <span className='italic'>Please Select</span>
                            </MenuItem>
                            {glp1_variant_data &&
                                glp1_variant_data.map(
                                    (price_variant, index) => {
                                        if (price_variant.variant_index! > 2) {
                                            return (
                                                <MenuItem
                                                    value={index}
                                                    key={index}
                                                >
                                                    {
                                                        SEMAGLUTIDE_TIRZEPATIDE_COMBINED_DISPLAY_ARRAY[
                                                            price_variant.product_href!
                                                        ][
                                                            price_variant.variant_index!
                                                        ]
                                                    }
                                                </MenuItem>
                                            );
                                        }
                                    }
                                )}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions className='w-full flex justify-center'>
                <Button onClick={handleDeny} variant='contained' color='error'>
                    Cancel
                </Button>
                <Button
                    onClick={handleClick}
                    autoFocus
                    variant='contained'
                    color='primary'
                >
                    {buttonLoading ? (
                        <CircularProgress size={22} sx={{ color: 'white' }} />
                    ) : (
                        'Change Medication'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
