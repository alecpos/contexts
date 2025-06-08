import {
    getStripeSubscription,
    updateStripeProduct,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getVariantIndexByPriceId } from '@/app/services/pharmacy-integration/variant-swap/glp1-stripe-price-id';
import { Status } from '@/app/types/global/global-enumerators';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { convertBundleVariantToSingleVariant } from '@/app/utils/functions/pharmacy-helpers/bundle-variant-index-mapping';
import { TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';

interface ConvertBundleToMonthlyProps {
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ConvertBundleToMonthly({
    setStatus,
    setStatusMessage,
}: ConvertBundleToMonthlyProps) {
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const onClick = async () => {
        setLoading(true);
        try {
            const renewalOrder = await getRenewalOrder(orderNumber);

            if (!renewalOrder) {
                throw new Error();
            }

            const subscription = await getPrescriptionSubscription(
                renewalOrder.subscription_id
            );
            if (!subscription) {
                throw new Error();
            }

            const stripeSub = await getStripeSubscription(
                subscription.stripe_subscription_id
            );
            const priceId = stripeSub.items.data[0].price.id;

            const currentVariantIndex = getVariantIndexByPriceId(
                renewalOrder.product_href as PRODUCT_HREF,
                priceId
            );

            console.log('CURRENT VAR INDEX', currentVariantIndex);

            const convertedIndex = convertBundleVariantToSingleVariant(
                renewalOrder.product_href,
                Number(currentVariantIndex)
            );

            if (String(convertedIndex) == currentVariantIndex) {
                setStatusMessage(
                    "This bundle doesn't update to a monthly product on renewal!"
                );
                setStatus('success');
                return;
            }

            const status = await updateStripeProduct(
                renewalOrder.subscription_id,
                convertedIndex,
                false
            );

            if (status !== Status.Success) {
                throw new Error('Error in update stripe product');
            }

            setStatusMessage('Successfully converted stripe subscription');
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatusMessage('Failed to convert stripe subscription');
            setStatus('failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <div className='flex flex-col w-full justify-start'>
                <div className='flex flex-col w-1/6 gap-2'>
                    <BioType className='it-h1 text-[18px]'>
                        Convert Bundle to Monthly (based off stripe sub)
                    </BioType>
                    <BioType className='it-h1'>Renewal Order #</BioType>
                    <TextField
                        fullWidth
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        multiline
                    ></TextField>
                </div>
            </div>

            <div className='flex flex-row w-full gap-4 mt-3'>
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
                            'Convert Bundle to Monthly'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
