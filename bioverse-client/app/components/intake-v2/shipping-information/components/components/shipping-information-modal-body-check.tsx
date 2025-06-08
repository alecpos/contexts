'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { updateShippingInformation } from '@/app/utils/database/controller/profiles/profiles';
import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { getIntakeURLParams } from '../../../intake-functions';
import { useParams, useSearchParams } from 'next/navigation';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../../styles/intake-tailwind-declarations';

interface ShippingInformationModalBodyProps {
    validationData: any;
    validationStatus: boolean;
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    stateAddress: string;
    zip: string;
    userId: string;
    pushToNextRoute: any;
    setErrors: any;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function ShippingInformationModalBodyCheck({
    validationData,
    validationStatus,
    addressLineOne,
    addressLineTwo,
    city,
    stateAddress,
    zip,
    userId,
    pushToNextRoute,
    setErrors,
    setModalOpen,
}: ShippingInformationModalBodyProps) {
    const [addressSelection, setAddressSelection] = useState<number>(0);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const url = useParams();
    const searchParams = useSearchParams();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const { standardizedAddress } = validationData;

    const handleSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();
        setAddressSelection(Number(event.target.value));
    };

    const handleClick = async (event: any) => {
        event.preventDefault();
        setButtonLoading(true);

        // Update shipping address
        var payload: ShippingInformation;

        // Use user inputed shipping address
        if (addressSelection === 0) {
            payload = {
                address_line1: addressLineOne,
                address_line2: addressLineTwo,
                state: stateAddress,
                zip,
                city,
                product_href,
            };
        } else {
            if (
                standardizedAddress &&
                standardizedAddress?.firstAddressLine &&
                standardizedAddress?.state &&
                standardizedAddress?.zipCode &&
                standardizedAddress?.city
            ) {
                payload = {
                    address_line1: standardizedAddress.firstAddressLine,
                    address_line2: '',
                    state: standardizedAddress.state,
                    zip: `${standardizedAddress.zipCode}${
                        standardizedAddress.zipCodeExtension
                            ? `-${standardizedAddress.zipCodeExtension}`
                            : ''
                    }`,
                    city: standardizedAddress.city,
                    product_href,
                };
            } else {
                setErrors((prev: any) => ({
                    ...prev,
                    addressLineOne: 'Something went wrong',
                }));
                setModalOpen(false);
                setButtonLoading(false);
                return;
            }
        }

        if (payload.state !== stateAddress) {
            setErrors((prev: any) => ({
                ...prev,
                stateAddress:
                    'Please input the same state you previously entered',
            }));
            setModalOpen(false);
            setButtonLoading(false);
            return;
        }

        const response = await updateShippingInformation(payload, userId);

        if (response === 'success') {
            pushToNextRoute();
        } else {
            console.error('Something went wrong');
            setButtonLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                Using an unverified address may cause issues with medication
                delivery (if prescribed). Please consider using suggested
                address below.
            </BioType>
            <FormControl sx={{ width: '100%' }}>
                <div className='px-2 mt-4 w-full'>
                    <BioType
                        className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-text mb-3 mt-1`}
                    >
                        You entered:
                    </BioType>
                    <RadioGroup
                        name='address-selection'
                        value={addressSelection}
                        onChange={handleSelectionChange}
                        sx={{ width: '100%' }}
                    >
                        <FormControlLabel
                            value='0'
                            control={<Radio />}
                            label={
                                <>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} !text[#393939]`}
                                    >
                                        {addressLineOne} {addressLineTwo}
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} !text[#393939]`}
                                    >
                                        {city} {stateAddress} {zip}
                                    </BioType>
                                </>
                            }
                        />
                        <div className='w-[100%] h-[1px] bg-[#e4e4e4] mt-5'></div>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-text mb-2 mt-1`}
                        >
                            We suggest:
                        </BioType>
                        <FormControlLabel
                            value='1'
                            control={<Radio />}
                            label={
                                <>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} !text[#393939]`}
                                    >
                                        {validationData?.standardizedAddress
                                            ?.firstAddressLine || ''}
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} !text[#393939]`}
                                    >
                                        {validationData?.standardizedAddress
                                            ?.cityStateZipAddressLine || ''}
                                    </BioType>
                                </>
                            }
                        />
                    </RadioGroup>
                </div>
            </FormControl>
            <div className='w-full flex justify-center mt-6'>
                <Button
                    variant='contained'
                    sx={{
                        minWidth: '215px',
                        height: '42px',
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                    onClick={handleClick}
                >
                    {buttonLoading ? (
                        <CircularProgress sx={{ color: 'white' }} size={22} />
                    ) : (
                        'USE SELECTED ADDRESS'
                    )}
                </Button>
            </div>
        </div>
    );
}
