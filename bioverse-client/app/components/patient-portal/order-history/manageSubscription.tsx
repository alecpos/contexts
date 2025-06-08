'use client';
import React, { useState } from 'react';
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
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';

// Define the types for the props
type SubscriptionStatus =
    | 'Approved'
    | 'Active'
    | 'Pending Approval'
    | 'Paused'
    | 'Canceled'
    | 'Unable to Approve';

interface ManageSubscriptionProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    status: SubscriptionStatus; // Add status prop
    productName: string;
    price: string;
    productHref: string;
    imageUrl: string;
}

const ManageSubscription: React.FC<ManageSubscriptionProps> = ({
    isOpen,
    onClose,
    orderId,
    price,
    productName,
    status, // Don't forget to destructure status here
    productHref,
    imageUrl,
}) => {
    const [cancelDialogueOpen, setCancelDialogueOpen] =
        useState<boolean>(false);
    const [resumeDialogueOpen, setResumeDialogueOpen] =
        useState<boolean>(false);

    const router = useRouter();

    // Tailwind CSS classes for animation
    const slideInClasses = isOpen
        ? 'translate-x-0 ease-out'
        : 'translate-x-full ease-in';

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
        console.log('order being canceled.');
        const { data: canceledOrderData, error: cancelationError } =
            await cancelSubscription(orderId);

        if (cancelationError) {
            console.log('issue with cancelation' + cancelationError);
        }

        if (canceledOrderData) {
            const requestBody = {
                path: '/portal/order-history',
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
                onClose();
                router.refresh();
                console.log('subscription cancelled');
            }
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
                    <DialogActions className='flex flex-row justify-end p-4'>
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
                            autoFocus
                        >
                            Confirm Cancelation
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
            case 'Approved':
                return (
                    <>
                        {/* <div className='flex justify-center'>
              <Button variant='contained' sx={{ mb: 2, width: '80%' }}>
                REQUEST CHANGE
              </Button>
            </div> */}
                        {/* <div className='flex justify-center'>
              <Button variant='contained' sx={{ mb: 2, width: '80%' }}>
                PAUSE ORDER
              </Button>
            </div> */}
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
                                onClick={handleCancelDialogueOpen}
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
            {isOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-40'
                    onClick={onClose}
                ></div>
            )}

            <div
                className={`fixed mt-16 right-0 top-0 w-full md:w-[25%] min-w-[350px] h-full bg-white  z-50 transform transition-all duration-500 ${slideInClasses} `}
            >
                <button
                    onClick={onClose}
                    className='absolute top-0 right-0 p-4 z-50 bg-white border-none'
                >
                    <h3>CLOSE X</h3>
                </button>

                <div className='pt-14 w-full'>
                    <HorizontalDivider backgroundColor='Gainsboro' height={1} />

                    <h2 className='text-lg font-bold mb-4 ml-4 mt-4'>
                        Manage Subscription
                    </h2>

                    <div
                        id='product-information'
                        className='flex flex-row p-4 gap-2 justify-between'
                    >
                        <div id='product-image' className='w-1/2'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageUrl}`}
                                alt={'product image'}
                                width={160} // Maximum width
                                height={160} // Maximum height
                                sizes='(max-width:  600px)  100vw,  160px'
                                unoptimized
                            />
                        </div>
                        <div
                            id='product-metadata'
                            className='flex flex-col gap-2 w-1/2'
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

            <CancelDialogue />
            <ResumeDialogue />
        </>
    );
};

export default ManageSubscription;
