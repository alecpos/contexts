'use client';
import { Dispatch, Fragment, SetStateAction } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ChangeShippingInformationController from './components/ChangeShippingInformationController';
import { SubscriptionDetails } from '../../../types/subscription-types';
import React from 'react';
import { Drawer, Slide } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface SubscriptionDetailsShippingModalProps {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    addressLineOnePrevious: string;
    addressLineTwoPrevious: string;
    cityPrevious: string;
    zipPrevious: string;
    stateAddressPrevious: string;
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

export default function SubscriptionDetailsShippingModal({
    modalOpen,
    setModalOpen,
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
    setOpenSuccessSnackbar,
    setSuccessMessage,
    setOpenFailureSnackbar,
    setFailureMessage,
    subscription,
    userId,
}: SubscriptionDetailsShippingModalProps) {
    return (
        <>
            <Drawer
                className='relative z-10'
                anchor='right'
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <div className='flex flex-col flex-grow items-start justify-start mt-16'>
                    <div
                        className={`w-[90vw] rounded-md md:w-[400px] bg-white flex`}
                    >
                        <div className='w-full flex flex-col p-6'>
                            <div className='w-full flex justify-end'>
                                <div
                                    className='cursor-pointer flex flex-row items-center'
                                    onClick={() => setModalOpen(false)}
                                >
                                    <BioType className='itd-input mt-0.5'>
                                        CLOSE
                                    </BioType>
                                    <CloseIcon sx={{ color: '#7f7f7f' }} />
                                </div>
                            </div>
                            <ChangeShippingInformationController
                                addressLineOnePrevious={addressLineOnePrevious}
                                addressLineTwoPrevious={addressLineTwoPrevious}
                                cityPrevious={cityPrevious}
                                stateAddressPrevious={stateAddressPrevious}
                                zipPrevious={zipPrevious}
                                modalOpen={modalOpen}
                                setModalOpen={setModalOpen}
                                setAddressLineOnePrevious={
                                    setAddressLineOnePrevious
                                }
                                setAddressLineTwoPrevious={
                                    setAddressLineTwoPrevious
                                }
                                setCityPrevious={setCityPrevious}
                                setStateAddressPrevious={
                                    setStateAddressPrevious
                                }
                                setZipPrevious={setZipPrevious}
                                setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                                setSuccessMessage={setSuccessMessage}
                                setOpenFailureSnackbar={setOpenFailureSnackbar}
                                setFailureMessage={setFailureMessage}
                                subscription={subscription}
                                userId={userId}
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
