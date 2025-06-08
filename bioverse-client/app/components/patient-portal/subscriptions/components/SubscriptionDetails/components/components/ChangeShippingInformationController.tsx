'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import ShippingInformationCollection from './ShippingInformationCollection';
import axios from 'axios';
import VerifyShippingInformation from './components/VerifyShippingInformation';
import FixShippingInformation from './components/FixShippingInformation';
import { SubscriptionDetails } from '../../../../types/subscription-types';
import React from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CompletedUpdateShippingInformation from './components/CompletedUpdateShippingInformation';
import { ALLOWED_STATES } from '@/app/components/intake-v2/constants/constants';
import { USStates } from '@/app/types/enums/master-enums';

interface ChangeShippingInformationControllerProps {
    addressLineOnePrevious: string;
    addressLineTwoPrevious: string;
    cityPrevious: string;
    zipPrevious: string;
    stateAddressPrevious: string;
    modalOpen: boolean;
    setModalOpen: any;
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

export default function ChangeShippingInformationController({
    addressLineOnePrevious,
    addressLineTwoPrevious,
    cityPrevious,
    stateAddressPrevious,
    zipPrevious,
    setAddressLineOnePrevious,
    setAddressLineTwoPrevious,
    setCityPrevious,
    setZipPrevious,
    setStateAddressPrevious,
    modalOpen,
    setModalOpen,
    setOpenSuccessSnackbar,
    setSuccessMessage,
    setOpenFailureSnackbar,
    setFailureMessage,
    subscription,
    userId,
}: ChangeShippingInformationControllerProps) {
    const [addressLineOne, setAddressLineOne] = useState<string>(
        addressLineOnePrevious || ''
    );
    const [addressLineTwo, setAddressLineTwo] = useState<string>(
        addressLineTwoPrevious || ''
    );
    const [stateAddress, setStateAddress] = useState<string>(
        stateAddressPrevious || ''
    );
    const [zip, setZip] = useState<string>(zipPrevious || '');
    const [city, setCity] = useState<string>(cityPrevious || '');
    const [step, setStep] = useState<number>(0);
    const [validationStatus, setValidationStatus] = useState<boolean>(false);
    const [validationData, setValidationData] = useState({});
    const [previousResponseId, setPreviousResponseId] = useState<string>('');
    const [errors, setErrors] = useState({
        addressLineOne: '',
        addressLineTwo: '',
        stateAddress: '',
        zip: '',
        city: '',
    });
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const verifyShipping = () => {
        let isValid = true;
        const newErrors = {
            addressLineOne: '',
            addressLineTwo: '',
            stateAddress: '',
            zip: '',
            city: '',
        };

        if (!addressLineOne || !addressLineOne.trim()) {
            isValid = false;
            newErrors.addressLineOne = 'Address Line 1 is required';
        }
        if (addressLineOne.length >= 40) {
            isValid = false;
            newErrors.addressLineOne =
                'Address Line 1 must be less than 40 characters';
        }

        if (addressLineTwo.length >= 40) {
            isValid = false;
            newErrors.addressLineTwo =
                'Address Line 2 must be less than 40 characters';
        }

        if (city.length >= 20) {
            isValid = false;
            newErrors.city = 'City must be less than 20 characters';
        }

        if (!city || !city.trim()) {
            isValid = false;
            newErrors.city = 'City is required';
        }
        if (!stateAddress || !stateAddress.trim()) {
            isValid = false;
            newErrors.stateAddress = 'State is required';
        } else if (!ALLOWED_STATES.includes(stateAddress as USStates)) {
            isValid = false;
            newErrors.stateAddress = 'Please enter a valid state we ship to';
        }
        if (!zip || !zip.trim()) {
            isValid = false;
            newErrors.zip = 'Zip Code is required';
        }

        setErrors(newErrors);

        return isValid;
    };

    const sendAddressValidationRequest = async () => {
        const isValid = verifyShipping();

        if (!isValid) {
            setButtonLoading(false);
            return;
        }
        const payload = {
            addressLineOne,
            addressLineTwo,
            stateAddress,
            zip,
            city,
            ...(previousResponseId !== '' && { previousResponseId }),
        };

        const response = await axios.post('/api/google', payload);

        const { data, success } = response.data;
        if (previousResponseId === '') {
            setPreviousResponseId(data.responseId);
        }

        setValidationData(data);
        if (success) {
            setButtonLoading(false);
            setStep(1);
        } else {
            setButtonLoading(false);
            setStep(3);
        }
    };

    // Step 0: Change Shipping Address Input Screen
    // Step 1: Verify your address
    // Step 2: Fix your address

    switch (step) {
        case 0:
            // return (
            //     <>
            //         <div>
            //             <BioType className='it-h1'>Edit Address: </BioType>
            //             <BioType className='itd-body'>
            //                 Need to update your address?
            //             </BioType>
            //             <BioType className='itd-body'>
            //                 Contact support at support@gobioverse.com or message
            //                 your BIOVERSE Care Team through your secure portal
            //             </BioType>
            //         </div>
            //     </>
            // );

            return (
                <ShippingInformationCollection
                    addressLineOne={addressLineOne}
                    setAddressLineOne={setAddressLineOne}
                    addressLineTwo={addressLineTwo}
                    setAddressLineTwo={setAddressLineTwo}
                    stateAddress={stateAddress}
                    setStateAddress={setStateAddress}
                    zip={zip}
                    setZip={setZip}
                    city={city}
                    setCity={setCity}
                    sendAddressValidationRequest={sendAddressValidationRequest}
                    errors={errors}
                    setErrors={setErrors}
                    buttonLoading={buttonLoading}
                    setButtonLoading={setButtonLoading}
                    setModalOpen={setModalOpen}
                />
            );
        case 1:
            return (
                <VerifyShippingInformation
                    addressLineOne={addressLineOne}
                    addressLineTwo={addressLineTwo}
                    city={city}
                    stateAddress={stateAddress}
                    zip={zip}
                    setModalOpen={setModalOpen}
                    validationData={validationData}
                    setStep={setStep}
                    modalOpen={modalOpen}
                    setErrors={setErrors}
                    validationStatus={validationStatus}
                    addressLineOnePrevious={addressLineOnePrevious}
                    addressLineTwoPrevious={addressLineTwoPrevious}
                    cityPrevious={cityPrevious}
                    zipPrevious={zipPrevious}
                    setAddressLineOnePrevious={setAddressLineOnePrevious}
                    setAddressLineTwoPrevious={setAddressLineTwoPrevious}
                    setCityPrevious={setCityPrevious}
                    setStateAddressPrevious={setStateAddressPrevious}
                    setZipPrevious={setZipPrevious}
                    setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                    setSuccessMessage={setSuccessMessage}
                    setOpenFailureSnackbar={setOpenFailureSnackbar}
                    setFailureMessage={setFailureMessage}
                    subscription={subscription}
                    userId={userId}
                />
            );
        case 2:
            return (
                <CompletedUpdateShippingInformation
                    setModalOpen={setModalOpen}
                />
            );
        case 3:
            return (
                <FixShippingInformation
                    addressLineOne={addressLineOne}
                    addressLineTwo={addressLineTwo}
                    city={city}
                    stateAddress={stateAddress}
                    zip={zip}
                    setStep={setStep}
                />
            );
    }
}
