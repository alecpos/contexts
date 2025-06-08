'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dispatch, SetStateAction, useState } from 'react';
import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { updateOrderShippingInformation } from '@/app/utils/database/controller/orders/orders-api';
import { ALLOWED_STATES } from '@/app/components/intake-v2/constants/constants';
import { SubscriptionDetails } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { USStates } from '@/app/types/enums/master-enums';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';

interface VerifyShippingInformationProps {
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    stateAddress: string;
    zip: string;
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    validationData: any;
    validationStatus: boolean;
    setErrors: any;
    setStep: any;
    addressLineOnePrevious: string;
    addressLineTwoPrevious: string;
    cityPrevious: string;
    zipPrevious: string;
    setAddressLineOnePrevious: Dispatch<SetStateAction<string>>;
    setAddressLineTwoPrevious: Dispatch<SetStateAction<string>>;
    setCityPrevious: Dispatch<SetStateAction<string>>;
    setZipPrevious: Dispatch<SetStateAction<string>>;
    setStateAddressPrevious: Dispatch<SetStateAction<string>>;
    setOpenSuccessSnackbar: Dispatch<SetStateAction<boolean>>;
    setSuccessMessage: Dispatch<SetStateAction<string>>;
    setOpenFailureSnackbar: Dispatch<SetStateAction<boolean>>;
    setFailureMessage: Dispatch<SetStateAction<string>>;
    subscription: SubscriptionDetails;
    userId: string;
}

export default function VerifyShippingInformation({
    addressLineOne,
    addressLineTwo,
    city,
    stateAddress,
    zip,
    modalOpen,
    setModalOpen,
    validationData,
    validationStatus,
    setErrors,
    setStep,
    addressLineOnePrevious,
    addressLineTwoPrevious,
    zipPrevious,
    cityPrevious,
    setAddressLineOnePrevious,
    setAddressLineTwoPrevious,
    setCityPrevious,
    setZipPrevious,
    setStateAddressPrevious,
    setOpenSuccessSnackbar,
    setSuccessMessage,
    setOpenFailureSnackbar,
    setFailureMessage,
    subscription,
    userId,
}: VerifyShippingInformationProps) {
    const [addressSelection, setAddressSelection] = useState<number>(0);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const params = useParams();
    const order_id = params['subscription_id'] ?? '-1';
    const { standardizedAddress } = validationData;
    if (!validationData) {
        return;
    }

    const handleSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>,
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
                };
            } else {
                setStep(0);
                setErrors((prev: any) => ({
                    ...prev,
                    addressLineOne: 'Something went wrong',
                }));

                setButtonLoading(false);
                return;
            }
        }

        if (!ALLOWED_STATES.includes(payload.state as USStates)) {
            setErrors((prev: any) => ({
                ...prev,
                stateAddress: 'Please input a state we operate in!',
            }));
            setStep(0);
            setButtonLoading(false);
            return;
        }

        await logPatientAction(
            userId,
            PatientActionTask.SHIPPING_ADDRESS_UPDATED,
            {
                stripe_subscription_id: subscription.stripe_subscription_id,
                addressLineOnePrevious,
                addressLineTwoPrevious,
                cityPrevious,
                zipPrevious,
                addressLineOne,
                addressLineTwo,
                city,
                zip,
            },
        );

        await identifyUser(userId, { stateAddress: payload.state });

        const response = await updateOrderShippingInformation(
            payload,
            subscription.order_id,
            userId,
        );
        if (response) {
            // Update for subscription details page
            setAddressLineOnePrevious(addressLineOne);
            setAddressLineTwoPrevious(addressLineTwo);
            setStateAddressPrevious(stateAddress);
            setZipPrevious(zip);
            setCityPrevious(city);
            setSuccessMessage('Successfully updated shipping address');
            setOpenSuccessSnackbar(true);
            setStep(2);
        } else {
            setFailureMessage(
                'Unexpected Error: Failed to update shipping address',
            );
            setOpenFailureSnackbar(true);
            setModalOpen(false);
            setButtonLoading(false);
        }
    };

    return (
        <div className="md:max-w-[460px] flex flex-col">
            <div className="">
                <BioType className="h4 text-[22px] text-[#286BA2]">
                    Verify your address
                </BioType>
            </div>
            <div className="w-[100%] h-[1px] bg-[#e4e4e4] mt-5 mb-3"></div>
            <div className="w-full flex flex-col gap-y-4">
                <BioType className="body1">
                    Using an unverified may cause issues with medication
                    delivery (if prescribed). Please consider using suggested
                    address below.
                </BioType>
                <FormControl sx={{ width: '100%' }}>
                    <div className="px-2 mt-4 w-full">
                        <BioType className="subtitle1 mb-3 mt-1">
                            You entered:
                        </BioType>
                        <RadioGroup
                            name="address-selection"
                            value={addressSelection}
                            onChange={handleSelectionChange}
                            sx={{ width: '100%' }}
                        >
                            <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label={
                                    <>
                                        <BioType className="body1">
                                            {addressLineOne} {addressLineTwo}
                                        </BioType>
                                        <BioType className="body1">
                                            {city} {stateAddress} {zip}
                                        </BioType>
                                    </>
                                }
                            />
                            <div className="w-[100%] h-[1px] bg-[#e4e4e4] mt-5"></div>
                            <BioType className="subtitle1 mt-3 mb-2">
                                We suggest:
                            </BioType>
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label={
                                    <>
                                        <BioType className="body1">
                                            {validationData?.standardizedAddress
                                                ?.firstAddressLine || ''}
                                        </BioType>
                                        <BioType className="body1">
                                            {validationData?.standardizedAddress
                                                ?.cityStateZipAddressLine || ''}
                                        </BioType>
                                    </>
                                }
                            />
                        </RadioGroup>
                    </div>
                </FormControl>
                <div className="w-full flex justify-center mt-6">
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            minWidth: '215px',
                            height: '54px',
                            backgroundColor: '#000000',
                            '&:hover': {
                                backgroundColor: '#666666',
                            },
                        }}
                        onClick={handleClick}
                    >
                        {buttonLoading ? (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={22}
                            />
                        ) : (
                            'USE SELECTED ADDRESS'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
