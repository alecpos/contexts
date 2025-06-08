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

interface ShippingInformationFixProps {
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    stateAddress: string;
    zip: string;
    setStep: any;
}

export default function FixShippingInformation({
    addressLineOne,
    addressLineTwo,
    city,
    stateAddress,
    zip,
    setStep,
}: ShippingInformationFixProps) {
    return (
        <div className='md:max-w-[460px] flex flex-col'>
            <div className='mt-4'>
                <BioType className='h4 text-[#D32F2F]'>
                    Please re-enter your address
                </BioType>
            </div>
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
                    onClick={() => setStep(0)}
                >
                    RE-ENTER YOUR ADDRESS
                </Button>
            </div>
        </div>
    );
}
