'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface ShippingInformationModalBodyFixProps {
    validationData: any;
    validationStatus: boolean;
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    stateAddress: string;
    zip: string;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ShippingInformationModalBodyFix({
    validationData,
    validationStatus,
    addressLineOne,
    addressLineTwo,
    city,
    stateAddress,
    zip,
    setModalOpen,
}: ShippingInformationModalBodyFixProps) {
    const [addressSelection, setAddressSelection] = useState<number>(0);

    const handleSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();
        setAddressSelection(Number(event.target.value));
    };

    return (
        <div className='w-full'>
            <BioType className='body1'>
                We can’t seem to verify your mailing address. Please check to
                make sure your information is accurate and try again.
            </BioType>
            <BioType className='subtitle1 mb-3 mt-5'>You entered:</BioType>
            <div>
                <BioType className='body1'>
                    {addressLineOne} {addressLineTwo}
                </BioType>
                <BioType className='body1'>
                    {city} {stateAddress} {zip}
                </BioType>
            </div>
            <div className='w-full flex justify-center mt-9'>
                <Button
                    variant='contained'
                    sx={{ minWidth: '215px', height: '42px' }}
                    onClick={() => setModalOpen(false)}
                >
                    RE-ENTER YOUR ADDRESS
                </Button>
            </div>
        </div>
    );
}
