'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { statesArray } from '@/public/static-ts/states';
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Dispatch, SetStateAction, useState } from 'react';

interface ShippingInformationCollectionProps {
    addressLineOne: string;
    setAddressLineOne: Dispatch<SetStateAction<string>>;
    addressLineTwo: string;
    setAddressLineTwo: Dispatch<SetStateAction<string>>;
    stateAddress: string;
    setStateAddress: Dispatch<SetStateAction<string>>;
    zip: string;
    setZip: Dispatch<SetStateAction<string>>;
    city: string;
    setCity: Dispatch<SetStateAction<string>>;
    sendAddressValidationRequest: () => void;
    errors: any;
    setErrors: any;
    buttonLoading: boolean;
    setButtonLoading: Dispatch<SetStateAction<boolean>>;
    setModalOpen: any;
}

export default function ShippingInformationCollection({
    addressLineOne,
    setAddressLineOne,
    addressLineTwo,
    setAddressLineTwo,
    stateAddress,
    setStateAddress,
    zip,
    setZip,
    city,
    setCity,
    sendAddressValidationRequest,
    errors,
    setErrors,
    buttonLoading,
    setButtonLoading,
    setModalOpen,
}: ShippingInformationCollectionProps) {
    return (
        <div className='md:max-w-[460px] flex flex-col'>
            <div className='mt-4'>
                <BioType className='it-h1 md:itd-h1 text-black'>
                    Change shipping address
                </BioType>
            </div>
            <div className='w-full flex flex-col gap-y-4'>
                <FormControl sx={{ marginTop: '20px' }}>
                    <TextField
                        id='address1'
                        label='Address Line 1'
                        InputLabelProps={{ shrink: true }}
                        value={addressLineOne}
                        onChange={(val: any) => {
                            setAddressLineOne(val.target.value);
                            setErrors((prev: any) => ({
                                ...prev,
                                addressLineOne: '',
                            }));
                        }}
                    />
                    {errors.addressLineOne && (
                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                            {errors.addressLineOne}
                        </BioType>
                    )}
                </FormControl>
                <FormControl>
                    <TextField
                        id='address2'
                        label='Address Line 2'
                        placeholder='Apt, suite, unit, building (optional)'
                        value={addressLineTwo}
                        InputLabelProps={{ shrink: true }}
                        onChange={(val) => {
                            setAddressLineTwo(val.target.value);
                            setErrors((prev: any) => ({
                                ...prev,
                                addressLineTwo: '',
                            }));
                        }}
                    />
                    {errors.addressLineTwo && (
                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                            {errors.addressLineTwo}
                        </BioType>
                    )}
                </FormControl>
                <FormControl>
                    <TextField
                        id='city'
                        label='City'
                        value={city}
                        InputLabelProps={{ shrink: true }}
                        onChange={(val) => {
                            setCity(val.target.value);
                            setErrors((prev: any) => ({
                                ...prev,
                                city: '',
                            }));
                        }}
                    />
                    {errors.city && (
                        <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                            {errors.city}
                        </BioType>
                    )}
                </FormControl>
                <div className='flex flex-col md:flex-row md:gap-x-4 gap-y-4'>
                    <FormControl className='flex-1' variant='outlined'>
                        <InputLabel id='state-label' className=''>
                            State
                        </InputLabel>
                        <Select
                            labelId='state-label'
                            label='State'
                            id='state'
                            required
                            value={stateAddress}
                            onChange={(val) => {
                                setStateAddress(val.target.value);
                                setErrors((prev: any) => ({
                                    ...prev,
                                    stateAddress: '',
                                }));
                            }}
                            placeholder='State'
                            sx={{ height: '58px' }}
                        >
                            {statesArray.map((stateName) => (
                                <MenuItem key={stateName} value={stateName}>
                                    {stateName}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.stateAddress && (
                            <BioType className='body1 text-red-500 mt-0.5 text-[16px]'>
                                {errors.stateAddress}
                            </BioType>
                        )}
                    </FormControl>
                    <FormControl className='flex-1'>
                        <TextField
                            id='zip'
                            sx={{ height: '58px' }}
                            label='Zip Code'
                            InputLabelProps={{ shrink: true }}
                            value={zip}
                            onChange={(val) => {
                                setZip(val.target.value);
                                setErrors((prev: any) => ({
                                    ...prev,
                                    zip: '',
                                }));
                            }}
                        />
                        {errors.zip && (
                            <BioType className='body1 text-red-500 mt-0.5 text-[16px] ml-0.5'>
                                {errors.zip}
                            </BioType>
                        )}
                    </FormControl>
                </div>
            </div>

            <Paper
                sx={{
                    padding: '16px',
                    marginTop: '16px',
                    backgroundColor: '#FFF4E5',
                }}
            >
                <div className='flex flex-row gap-2'>
                    <div>
                        <WarningAmberIcon sx={{ color: '#EF6C00' }} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <BioType className='it-subtitle md:itd-subtitle text-[#663C00]'>
                            Updating your address?
                        </BioType>
                        <BioType className='it-body md:itd-body [-webkit-font-smoothing:antialiased] text-[#663C00]'>
                            To ensure your next order arrives at the correct
                            address, please update your address at least 48
                            hours before your order&apos;s scheduled processing
                            date. Address changes made within this 48-hour
                            window will not apply to your current order, which
                            will be delivered to your previously saved address.
                            This is because the pharmacy may have already begun
                            processing your order and preparing it for shipment.
                        </BioType>
                    </div>
                </div>
            </Paper>

            <div className='mt-6 flex flex-col gap-4'>
                <Button
                    fullWidth
                    variant='contained'
                    sx={{
                        height: '54px',
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                    onClick={() => {
                        setButtonLoading(true);
                        sendAddressValidationRequest();
                    }}
                >
                    {!buttonLoading ? (
                        <>Update Address</>
                    ) : (
                        <CircularProgress sx={{ color: 'white' }} size={22} />
                    )}
                </Button>
                <Button
                    variant='outlined'
                    sx={{
                        height: '54px',
                        color: '#666666',
                        borderColor: '#666666',
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: '#66666699',
                            borderColor: '#66666699',
                        },
                    }}
                    onClick={() => setModalOpen(false)}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
