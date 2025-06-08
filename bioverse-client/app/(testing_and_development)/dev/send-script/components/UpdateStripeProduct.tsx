import { updateStripeProduct } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Status } from '@/app/types/global/global-enumerators';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    TextField,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { useState } from 'react';

interface UpdateStripeProductProps {
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function UpdateStripeProduct({
    setStatus,
    setStatusMessage,
}: UpdateStripeProductProps) {
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [variantIndex, setVariantIndex] = useState<string>('');
    const [hasPaid, setHasPaid] = useState<string>('no');
    const [loading, setLoading] = useState<boolean>(false);

    const onClick = async () => {
        setLoading(true);
        try {
            const renewalOrder = await getRenewalOrder(orderNumber);

            if (!renewalOrder) {
                throw new Error('Could not find renewal order');
            }

            const paid = hasPaid === 'no' ? false : true;

            const res = await updateStripeProduct(
                renewalOrder.subscription_id,
                Number(variantIndex),
                paid,
                false
            );

            if (!res || res === Status.Error) {
                throw new Error('Something went wrong updating stripe product');
            }
            setStatusMessage('Successfully updated stripe product');
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatusMessage('Failed to update stripe product');
            setStatus('failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <div className='flex flex-col w-full justify-start'>
                <div className='flex flex-col w-1/6 gap-2'>
                    <BioType className='it-h1'>Renewal Order #</BioType>
                    <TextField
                        fullWidth
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        multiline
                    ></TextField>
                    <BioType className='it-h1'>Variant Index</BioType>
                    <TextField
                        fullWidth
                        value={variantIndex}
                        onChange={(e) => setVariantIndex(e.target.value)}
                        multiline
                    ></TextField>
                </div>
                <div>
                    <BioType className='it-subtitle'>
                        Has this user paid?
                    </BioType>
                    <FormControl>
                        <RadioGroup
                            defaultValue={hasPaid}
                            name='has-paid-radio'
                            onChange={(event) => setHasPaid(event.target.value)}
                        >
                            <FormControlLabel
                                value='no'
                                control={<Radio />}
                                label='No'
                            />
                            <FormControlLabel
                                value='yes'
                                control={<Radio />}
                                label='Yes'
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>

            <div className='flex flex-row w-full gap-4'>
                <div>
                    <Button
                        variant='contained'
                        color='success'
                        className='py-2 px-8'
                        onClick={onClick}
                    >
                        {loading ? (
                            <CircularProgress size={22} />
                        ) : (
                            'Update Stripe Product'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
