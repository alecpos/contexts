'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import ShippingInformationModalBodyController from './shipping-information-modal-body-controller';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../../styles/intake-tailwind-declarations';

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
    userId: string;
    pushToNextRoute: any;
    setErrors: any;
}

export default function VerifyShippingInformationModal({
    addressLineOne,
    addressLineTwo,
    city,
    stateAddress,
    zip,
    modalOpen,
    setModalOpen,
    validationData,
    validationStatus,
    userId,
    pushToNextRoute,
    setErrors,
}: VerifyShippingInformationProps) {
    if (!validationData) {
        return;
    }
    return (
        <>
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-40'
                    onClose={() => setModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/25' />
                    </Transition.Child>
                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-full items-center justify-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel
                                    className={`w-[90vw] rounded-xl  md:w-[500px]  bg-white flex`}
                                >
                                    <div className='w-full flex flex-col p-6'>
                                        <div className='flex flex-row justify-between items-center px-2'>
                                            <div
                                                className={`flex flex-col justify-end h-[45px] ${
                                                    validationStatus
                                                        ? '-mt-2'
                                                        : '-mt-2'
                                                }`}
                                            >
                                                <BioType
                                                    className={`${INTAKE_PAGE_HEADER_TAILWIND} text-xl ${
                                                        validationStatus
                                                            ? 'text-black]'
                                                            : 'text-[#D32F2F]'
                                                    }`}
                                                >
                                                    {validationStatus
                                                        ? 'Verify your address'
                                                        : 'Please re-enter your address'}
                                                </BioType>
                                            </div>
                                            <div className='flex justify-end'>
                                                <div
                                                    className='cursor-pointer'
                                                    onClick={() =>
                                                        setModalOpen(false)
                                                    }
                                                >
                                                    <CloseIcon
                                                        sx={{
                                                            color: '#7f7f7f',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-y-4 mt-2 pt-3 px-2'>

                                            <ShippingInformationModalBodyController
                                                validationData={validationData}
                                                validationStatus={
                                                    validationStatus
                                                }
                                                addressLineOne={addressLineOne}
                                                addressLineTwo={addressLineTwo}
                                                city={city}
                                                stateAddress={stateAddress}
                                                zip={zip}
                                                userId={userId}
                                                pushToNextRoute={
                                                    pushToNextRoute
                                                }
                                                setErrors={setErrors}
                                                setModalOpen={setModalOpen}
                                            />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
