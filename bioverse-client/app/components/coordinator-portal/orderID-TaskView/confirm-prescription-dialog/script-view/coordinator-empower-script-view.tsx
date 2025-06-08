import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    getDisplayNameForVariantGLP1Swap,
    getSwappableVariantIndexForCoordinatorMenu,
} from '@/app/services/pharmacy-integration/variant-swap/glp1-variant-index-swap';
import { OrderType } from '@/app/types/orders/order-types';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { updateRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getPriceIdForProductVariant } from '@/app/utils/database/controller/products/products';

import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import { useState } from 'react';

interface ConfirmationWindowProps {
    script: EmpowerPrescriptionOrder;
    sigList: string[];
    empowerDisplayName: string | undefined;
    orderData: DBOrderData;
    isSwappableVariant: boolean;
    variant_index: number; //new type variant that includes the right pharmacy
    orderType: OrderType;
}

export default function CoordinatorEmpowerConfirmationView({
    script,
    sigList,
    empowerDisplayName,
    orderData,
    isSwappableVariant,
    variant_index,
    orderType,
}: ConfirmationWindowProps) {
    const [selectedVariant, setSelectedVariant] = useState<number>(-1);
    const [isChangingVariant, setIsChangingVariant] = useState<boolean>();

    let swappableVariantArray;

    swappableVariantArray = getSwappableVariantIndexForCoordinatorMenu(
        orderData.product_href,
        orderData.state,
    );

    const updateSamePriceVariantDosage = async () => {
        setIsChangingVariant(true);
        if (selectedVariant === -1) {
            setIsChangingVariant(false);
            return;
        }

        const new_price_id = await getPriceIdForProductVariant( 
            orderData.product_href,
            selectedVariant!,
            process.env.NEXT_PUBLIC_ENVIRONMENT!,
        );

        const productPrice = await getPriceDataRecordWithVariant(
            orderData.product_href,
            selectedVariant!,
        );

        if (orderType === OrderType.RenewalOrder) {
            await updateRenewalOrder(Number(orderData.id), {
                variant_index: selectedVariant || -1,
                price_id: new_price_id!,
                subscription_type: productPrice?.cadence as SubscriptionCadency,
            });
        } else {
            await updateOrder(orderData.id, {
                subscription_type: productPrice?.cadence as SubscriptionCadency,
                price_id: new_price_id!,
                variant_index: selectedVariant,
            });
        }

        window.location.reload();
        setIsChangingVariant(false);
    };

    return (
        <>
            {/* <BioType className='itd-body'>
                Please confirm the below medications and sig&apos;s
            </BioType> */}
            <BioType className="itd-subtitle text-primary">
                {empowerDisplayName}
            </BioType>
            <div className="flex flex-row p-4 gap-2">
                <FormControl>
                    <InputLabel id="demo-simple-select-label">
                        Change Variant
                    </InputLabel>
                    <Select
                        label={'Change Variant'}
                        value={selectedVariant}
                        onChange={(e) =>
                            setSelectedVariant(e.target.value as number)
                        }
                    >
                        <MenuItem value={-1} disabled>
                            Swap Variant
                        </MenuItem>
                        {swappableVariantArray &&
                            swappableVariantArray.map((variant_index) => {
                                return (
                                    <MenuItem
                                        value={variant_index}
                                        key={variant_index}
                                    >
                                        {getDisplayNameForVariantGLP1Swap(
                                            orderData.product_href,
                                            variant_index,
                                        )}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    disabled={selectedVariant === -1}
                    onClick={updateSamePriceVariantDosage}
                >
                    {isChangingVariant ? <CircularProgress /> : 'Confirm'}
                </Button>
            </div>
            {script.newRxs.map((rx: EmpowerNewRx, index: number) => {
                return (
                    <div key={index} className="py-2 w-full">
                        <BioType className="itd-body text-primary">
                            Medication:{' '}
                            <span className="it-body text-[#000000]">
                                {rx.medication.drugDescription}
                            </span>
                        </BioType>
                        <BioType className="itd-body text-primary">
                            Sig:{' '}
                            <span className="it-body text-[#000000]">
                                {sigList[index]}
                            </span>
                        </BioType>
                    </div>
                );
            })}
        </>
    );
}
