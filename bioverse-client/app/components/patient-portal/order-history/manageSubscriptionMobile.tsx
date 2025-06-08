'use client';

import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    cancelSubscription,
    resumeSubscription,
} from '@/app/utils/actions/membership/order-history-actions';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useRouter } from 'next/navigation';

// Define the types for the props
type SubscriptionStatus =
    | 'Approved'
    | 'Active'
    | 'Pending Approval'
    | 'Paused'
    | 'Canceled'
    | 'Unable to Approve';

interface MobileManageSubscriptionProps {
    isOpen: boolean;
    onClose: () => void;
    status: SubscriptionStatus;
    productName: string;
    price: string;
    orderId: string;
    productHref: string;
    imageUrl: string;
}

const MobileManageSubscription: React.FC<MobileManageSubscriptionProps> = ({
    isOpen,
    onClose,
    status,
    productName,
    price,
    orderId,
    productHref,
    imageUrl,
}) => {
    const [cancelDialogueOpen, setCancelDialogueOpen] =
        useState<boolean>(false);
    const [resumeDialogueOpen, setResumeDialogueOpen] =
        useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]); // Only re-run the effect if isOpen changes

    // Tailwind CSS classes for animation
    const slideInClasses = isOpen
        ? 'translate-x-0 ease-out'
        : '-translate-x-full ease-in';

    const handleCancelDialogueClose = () => {
        setCancelDialogueOpen(false);
    };

    const handleCancelDialogueOpen = () => {
        setCancelDialogueOpen(true);
    };

    const handleResumeDialogueClose = () => {
        setResumeDialogueOpen(false);
    };

    const handleResumeDialogueOpen = () => {
        setResumeDialogueOpen(true);
    };

    const cancelOrder = async () => {
        const { data: canceledOrderData, error: cancelationError } =
            await cancelSubscription(orderId);

        if (cancelationError) {
            console.log('issue with cancelation' + cancelationError);
        }

        if (canceledOrderData) {
            const requestBody = {
                path: '/portal',
            };

            const response = await fetch('/api/revalidate/path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response) {
                console.log('Failed to revalidate data');
            } else {
                handleCancelDialogueClose();
                console.log('subscription cancelled');
            }
            router.refresh();
            handleCancelDialogueClose();

            console.log('subscription cancelled');
        }
    };

    const resumeOrder = async () => {
        const { data: resumedOrderData, error: resumeError } =
            await resumeSubscription(orderId);

        if (resumeError) {
            console.log('issue with resuming' + resumeError);
        }

        if (resumedOrderData) {
            const requestBody = {
                path: '/portal',
            };

            const response = await fetch('/api/revalidate/path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response) {
                console.log('Failed to revalidate data');
            } else {
                handleResumeDialogueClose();
                console.log('subscription resumed');
            }
        }
    };

    const CancelDialogue = () => {
        return (
            <>
                <Dialog
                    open={cancelDialogueOpen}
                    onClose={handleCancelDialogueClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>
                        {'Cancel Subscription?'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            Are you sure you wish to cancel your order? This
                            process may not be reversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className=''>
                        <Button
                            variant='outlined'
                            onClick={handleCancelDialogueClose}
                        >
                            Nevermind
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={cancelOrder}
                            color='error'
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    const ResumeDialogue = () => {
        return (
            <>
                <Dialog
                    open={resumeDialogueOpen}
                    onClose={handleResumeDialogueClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>
                        {'Resume Subscription?'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            Would you like yo resume this subscription? The
                            subscription will attempt to return to the state it
                            was prior to cancellation.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className=''>
                        <Button
                            variant='outlined'
                            onClick={resumeOrder}
                            color='primary'
                        >
                            Confirm
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={handleResumeDialogueClose}
                            color='error'
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    // Function to determine which buttons to render based on the status
    const renderButtons = () => {
        switch (status) {
            case 'Active':
                return (
                    <>
                        <div className='flex justify-center'>
                            <Button
                                variant='contained'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                REQUEST CHANGE
                            </Button>
                        </div>
                        <div className='flex justify-center'>
                            <Button
                                variant='outlined'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                PAUSE ORDER
                            </Button>
                        </div>
                        <div className='flex justify-center'>
                            <Button
                                variant='outlined'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                CANCEL ORDER
                            </Button>
                        </div>
                    </>
                );
            case 'Pending Approval':
                return (
                    <>
                        <div className='flex justify-center'>
                            <Button
                                onClick={handleCancelDialogueOpen}
                                variant='contained'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                CANCEL ORDER
                            </Button>
                        </div>
                    </>
                );
            case 'Paused':
                return (
                    <>
                        <div className='flex justify-center'>
                            <Button
                                variant='contained'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                RESUME ORDER
                            </Button>
                        </div>
                        <div className='flex justify-center'>
                            <Button
                                variant='contained'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                REQUEST CHANGE
                            </Button>
                        </div>
                        <div className='flex justify-center'>
                            <Button
                                variant='contained'
                                sx={{ mb: 2, width: '80%' }}
                            >
                                CANCEL ORDER
                            </Button>
                        </div>
                    </>
                );
            case 'Canceled':
                return (
                    <div className='flex justify-center'>
                        <Button
                            onClick={handleResumeDialogueOpen}
                            variant='contained'
                            sx={{ mb: 2, width: '80%' }}
                        >
                            RESUME ORDER
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 transform transition-all duration-500 ${slideInClasses} ${
                    isOpen ? 'block' : 'hidden'
                } bg-white`}
            >
                <button
                    onClick={onClose}
                    className='absolute mt-12 right-0 pt-4 pr-4 z-10 bg-white border-none '
                >
                    <h3>CLOSE X</h3>
                </button>

                <div className='pt-12 h-screen bg-white'>
                    <div className='mt-12'>
                        <HorizontalDivider
                            backgroundColor='Gainsboro'
                            height={1}
                        />
                    </div>
                    <h2 className='text-lg font-bold mb-6 ml-4 mt-4'>
                        Manage Subscription
                    </h2>

                    <div
                        id='product-information'
                        className='flex flex-row p-4 gap-2 justify-center'
                    >
                        <div
                            id='product-image'
                            className='aspect-[1/1] w-1/2 relative'
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageUrl}`}
                                alt={'img'}
                                fill
                                unoptimized
                            />
                        </div>
                        <div
                            id='product-metadata'
                            className='flex flex-col gap-2'
                        >
                            <div>
                                <BioType className='body2'>
                                    Order Number:
                                </BioType>
                                <BioType className='body1'>
                                    BV-{orderId}
                                </BioType>
                            </div>

                            <div>
                                <BioType className='body2'>
                                    Product Name:
                                </BioType>
                                <BioType className='body1'>
                                    {productName}
                                </BioType>
                            </div>
                        </div>
                    </div>

                    {renderButtons()}
                </div>
            </div>
            <ResumeDialogue />
            <CancelDialogue />
        </>
    );
};

export default MobileManageSubscription;
