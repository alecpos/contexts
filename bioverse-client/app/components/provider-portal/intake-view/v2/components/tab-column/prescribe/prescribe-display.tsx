import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React, { useState } from 'react';
import PrescribeDisplayOptions from './prescribe-display-options';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { OrderStatus, OrderType } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { StatusTag } from '@/app/types/status-tags/status-types';

interface PrescribeDisplayProps {
    patient_data: DBPatientData;
    order_data: DBOrderData;
    orderType: OrderType;
    providerId: string;
    statusTag: string | undefined;
}
const PrescribeDisplay = ({
    patient_data,
    order_data,
    orderType,
    providerId,
    statusTag,
}: PrescribeDisplayProps) => {
    const [pharmacySelected, setPharmacySelected] = useState<string>(
        order_data.assigned_pharmacy ?? 'empower'
    );

    const handleSelectChange = (event: SelectChangeEvent) => {
        setPharmacySelected(event.target.value);
    };

    const { order_status: orderStatus } = order_data;

    if (
        statusTag &&
        [StatusTag.ReviewNoPrescribe, StatusTag.OverdueNoPrescribe].includes(
            statusTag as StatusTag
        )
    ) {
        return (
            <div className='w-full flex justify-center mt-6'>
                <BioType className='body1'>
                    Patient is ineligible to be prescribed right now.
                </BioType>
            </div>
        );
    }

    if (
        (orderType === OrderType.Order &&
            (orderStatus === OrderStatus.PaymentCompleted ||
                orderStatus === OrderStatus.ApprovedCardDown)) ||
        (orderType === OrderType.RenewalOrder &&
            orderStatus !== RenewalOrderStatus.PharmacyProcessing &&
            orderStatus !==
                RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid)
    ) {
        return (
            <div className='flex flex-col'>
                <div className='my-2 mx-6 max-w-[1000px]'>
                    <FormControl fullWidth margin='normal'>
                        <InputLabel id='medication'>Pharmacy</InputLabel>
                        <Select
                            id='prescription_item_id'
                            name='prescription_items[0].Id'
                            label='Medication'
                            variant='outlined'
                            value={pharmacySelected}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={'tmc'}>TMC</MenuItem>
                            <MenuItem value={'empower'}>Empower</MenuItem>
                            <MenuItem value={'belmar'}>Belmar</MenuItem>
                            <MenuItem value={'hallandale'}>Hallandale</MenuItem>
                            <MenuItem value={'ggm'}>GGM</MenuItem>
                            <MenuItem value={'curexa'}>Curexa</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className=' mb-3 py-4 w-full h-[60vh] '>
                    <PrescribeDisplayOptions
                        pharmacy={pharmacySelected}
                        patient_data={patient_data}
                        order_data={order_data}
                        orderType={orderType}
                        providerId={providerId}
                        orderStatus={order_data.order_status}
                    />
                </div>
            </div>
        );
    } else if (
        orderStatus === RenewalOrderStatus.PharmacyProcessing ||
        orderStatus === RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid
    ) {
        return (
            <div className='w-full flex justify-center mt-6'>
                <BioType className='body1'>Prescription Sent!</BioType>
            </div>
        );
    }

    return (
        <div className='w-full flex justify-center mt-6'>
            <BioType className='body1'>
                Patient is ineligible to be prescribed right now.
            </BioType>
        </div>
    );
};

export default PrescribeDisplay;
