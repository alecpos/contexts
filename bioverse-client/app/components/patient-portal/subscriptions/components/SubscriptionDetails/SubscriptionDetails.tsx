'use client';
import React, { useEffect, useState } from 'react';
import { Drawer, Paper, useMediaQuery } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SubscriptionDetailsShippingModal from './components/SubscriptionDetailsShippingModal';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import Link from 'next/link';
import ChangePaymentMethodDrawer from './components/ChangePaymentMethodDrawer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createSetupIntentServerCustomer } from '@/app/services/stripe/setupIntent';
import axios from 'axios';
import { SubscriptionDetails } from '../../types/subscription-types';

// Inside OrderItemProps definition

interface Props {
    subscription: SubscriptionDetails;
    subscription_id: number;
    stripeCustomerId: string;
    cardDigits: string | undefined;
    userId: string;
}

export default function SubscriptionDetailsComponent({
    subscription,
    subscription_id,
    stripeCustomerId,
    cardDigits,
    userId,
}: Props) {
    const isLargeScreen = useMediaQuery('(min-width:576px)');
    const [shippingModalOpen, setShippingModalOpen] = useState<boolean>(false);

    const [addressLineOne, setAddressLineOne] = useState<string>(
        subscription.address_line1 || ''
    );
    const [addressLineTwo, setAddressLineTwo] = useState<string>(
        subscription.address_line2 || ''
    );
    const [stateAddress, setStateAddress] = useState<string>(
        subscription.state || ''
    );
    const [zip, setZip] = useState<string>(subscription.zip || '');
    const [city, setCity] = useState<string>(subscription.city || '');
    const [last4, setLast4] = useState<string | undefined>(cardDigits || '');

    const [openSuccessSnackbar, setOpenSuccessSnackbar] =
        useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [openFailureSnackbar, setOpenFailureSnackbar] =
        useState<boolean>(false);
    const [failureMessage, setFailureMessage] = useState<string>('');
    const [openPaymentMethodDrawer, setOpenPaymentMethodDrawer] =
        useState<boolean>(false);

    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
    );

    const [stripeMetadata, setStripeMetadata] = useState<any>(null);

    const createSetupIntent = async (refire: boolean) => {
        if (!stripeMetadata || !stripeMetadata.setupIntentId || refire) {
            const setupIntent = await createSetupIntentServerCustomer(
                stripeCustomerId
            );
            if (!setupIntent) {
                console.log('error in creating setup intent');
            } else {
                setStripeMetadata({
                    clientSecret: setupIntent.client_secret,
                    paymentMethodId: '',
                    setupIntentId: setupIntent.id,
                });
            }
        }
    };

    useEffect(() => {
        createSetupIntent(false);
    }, []);

    function formatShippingFrequency(shippingFrequency: string) {
        switch (shippingFrequency) {
            case 'monthly':
                return 'Monthly';
            case 'quarterly':
                return '3 months';
            default:
                return 'N/A';
        }
    }

    function displayShippingAddress() {
        if (!subscription.address_line2 || subscription.address_line2 === '') {
            return (
                <>
                    <BioType className='body1 text-black text-[16px]'>
                        {addressLineOne}
                    </BioType>
                    <BioType className='body1 text-black text-[16px]'>
                        {city}, {stateAddress} {zip}
                    </BioType>
                </>
            );
        }
        return (
            <>
                <BioType className='body1 text-black text-[16px]'>
                    {addressLineOne}
                </BioType>
                <BioType className='body1 text-black text-[16px]'>
                    {addressLineTwo}
                </BioType>
                <BioType className='body1 text-black text-[16px]'>
                    {city}, {stateAddress} {zip}
                </BioType>
            </>
        );
    }

    const onSubmitPaymentMethod = async () => {
        try {
            const request = await axios.post(
                '/api/stripe/payment-method/subscription',
                {
                    stripeCustomerId,
                    stripeSubscriptionId: subscription.stripe_subscription_id,
                }
            );

            if (request.data.success) {
                setSuccessMessage('Successfully updated payment method');
                setOpenSuccessSnackbar(true);
                if (request.data.digits) {
                    setLast4(request.data.digits);
                }
                await createSetupIntent(true);
            } else {
                setFailureMessage(
                    'Error: Failed to update payment method. Please try again.'
                );
                setOpenFailureSnackbar(true);
            }
        } catch (error) {
            console.error(error);

            setFailureMessage(
                'Error: Failed to update payment method. Please try again.'
            );
            setOpenFailureSnackbar(true);
        } finally {
            setOpenPaymentMethodDrawer(false);
        }
    };

    const drawerWidth = isLargeScreen ? 360 : '100%';

    return (
        <div className='w-full flex justify-center'>
            <div className='mt-6 sm:mt-12 w-full px-4 sm:px-36 lg::px-72  sm:max-w-[570px]'>
                <BioType className='h6 text-black'>
                    Subscription Details
                </BioType>
                <Paper elevation={2} className='py-3 px-5 mt-9'>
                    <div className='flex flex-col'>
                        <div className='flex justify-center'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${subscription.image_ref[0]}`}
                                alt={subscription.name}
                                width={180}
                                height={180}
                                className=''
                                sizes='(max-width:  180px)  100vw,  293px'
                                unoptimized
                            />
                        </div>
                        <div className='flex mt-6'>
                            <BioType className='h5 text-black'>
                                {subscription.name}
                            </BioType>
                        </div>
                        <div className='mx-auto w-[100%] h-[1px] bg-[#1B1B1B1F] mt-4 mb-4'></div>

                        {/* Treatment */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='h5 text-black'>
                                Treatment
                            </BioType>
                            <div className='flex flex-col space-y-2'>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Shipping Frequency
                                </BioType>
                                <BioType className='body1 text-black text-[16px]'>
                                    {formatShippingFrequency(
                                        subscription.subscription_type
                                    )}
                                </BioType>
                            </div>
                        </div>
                        <div className='mx-auto w-[100%] h-[1px] bg-[#1B1B1B1F] mt-4 mb-4'></div>
                        {/* Shipping */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='h5 text-black'>
                                Shipping
                            </BioType>
                            <div className='flex flex-col space-y-2'>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Ships to
                                </BioType>
                                <div className='flex justify-between items-center'>
                                    <div>{displayShippingAddress()}</div>
                                    <BioType
                                        onClick={() =>
                                            setShippingModalOpen(true)
                                        }
                                        className='body1 text-black text-[16px] underline cursor-pointer decoration-1 underline-offset-1'
                                    >
                                        Edit
                                    </BioType>
                                </div>
                            </div>
                        </div>
                        <div className='mx-auto w-[100%] h-[1px] bg-[#1B1B1B1F] mt-4 mb-4'></div>
                        {/* Payment Method */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='h5 text-black'>Payment</BioType>
                            <div className='flex flex-col space-y-2'>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Default card
                                </BioType>
                                <div className='flex justify-between items-center'>
                                    <BioType className='body1 text-black text-[16px]'>
                                        •••• •••• •••• {last4}
                                    </BioType>
                                    <BioType
                                        onClick={() =>
                                            setOpenPaymentMethodDrawer(true)
                                        }
                                        className='body1 text-black text-[16px] underline cursor-pointer decoration-1 underline-offset-1'
                                    >
                                        Edit
                                    </BioType>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>

                {/* Treatment Plan */}
                {(subscription.href === 'semaglutide' ||
                    subscription.href === 'tirzepatide') && (
                    <div className='flex flex-col mt-12'>
                        <BioType className='h5 text-black'>
                            Treatment Plan
                        </BioType>
                        <BioType className='body1 text-[#00000099] text-[16px]'>
                            Learn more about your prescription.
                        </BioType>
                        <Paper
                            elevation={2}
                            className='py-3 flex justify-between items-center mt-4 w-full'
                        >
                            <a
                                href={`https://www.gobioverse.com/treatment/${subscription.href}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full no-underline flex justify-center'
                            >
                                <div className='w-[80%] sm:w-[87%] h-[128px] bg-[#0288d10a] px-[22px] py-[12px]'>
                                    <div className='flex w-full h-full justify-between items-center'>
                                        <div className='flex items-center h-full'>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${subscription.image_ref_transparent[0]}`}
                                                alt={subscription.name}
                                                width={100}
                                                height={100}
                                                className=''
                                                sizes='(max-width:  100px)  100vw,  100px'
                                                unoptimized
                                            />
                                            <BioType className='body1 text-[16px] text-[#00000099]'>
                                                Medication Overview
                                            </BioType>
                                        </div>
                                        <ChevronRightIcon
                                            sx={{ color: 'black' }}
                                            fontSize='small'
                                        />
                                    </div>
                                </div>
                            </a>
                        </Paper>
                    </div>
                )}

                {/* Manage Subscription */}

                <div className='flex w-full flex-col mt-12 pb-[109px] space-y-4'>
                    <BioType className='h5 text-black'>
                        Manage Subscription
                    </BioType>
                    <Link
                        href={`/portal/subscriptions/manage/${subscription_id}`}
                        className='no-underline'
                    >
                        <Paper
                            elevation={2}
                            className='py-3 px-5 flex justify-between items-centers'
                        >
                            <div>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Manage Subscription
                                </BioType>
                                <BioType className='body1 text-black text-[16px]'>
                                    Edit, snooze or cancel orders
                                </BioType>
                            </div>
                            <ChevronRightIcon
                                sx={{ color: 'black' }}
                                fontSize='small'
                            />
                        </Paper>
                    </Link>
                </div>
                <SubscriptionDetailsShippingModal
                    modalOpen={shippingModalOpen}
                    setModalOpen={setShippingModalOpen}
                    addressLineOnePrevious={addressLineOne}
                    addressLineTwoPrevious={addressLineTwo}
                    cityPrevious={city}
                    stateAddressPrevious={stateAddress}
                    zipPrevious={zip}
                    setAddressLineOnePrevious={setAddressLineOne}
                    setAddressLineTwoPrevious={setAddressLineTwo}
                    setCityPrevious={setCity}
                    setStateAddressPrevious={setStateAddress}
                    setZipPrevious={setZip}
                    setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                    setSuccessMessage={setSuccessMessage}
                    setOpenFailureSnackbar={setOpenFailureSnackbar}
                    setFailureMessage={setFailureMessage}
                    subscription={subscription}
                    userId={userId}
                />
                <BioverseSnackbarMessage
                    color='success'
                    open={openSuccessSnackbar}
                    setOpen={setOpenSuccessSnackbar}
                    message={successMessage}
                />
                <BioverseSnackbarMessage
                    color='error'
                    open={openFailureSnackbar}
                    setOpen={setOpenFailureSnackbar}
                    message={failureMessage}
                />
                {stripeMetadata?.clientSecret && (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret: stripeMetadata.clientSecret || '',
                            fonts: [
                                {
                                    family: 'Tw Cen MT Pro SemiMedium',
                                    src: 'url(/fonts/tw_cent/twc-pro-semimedium.woff2)',
                                    weight: '400',
                                },
                            ],
                            appearance: {
                                rules: {
                                    '.Label': {
                                        fontSize: '0',
                                    },
                                },
                            },
                        }}
                    >
                        <Drawer
                            open={
                                openPaymentMethodDrawer &&
                                stripeMetadata.clientSecret
                            }
                            onClose={() => setOpenPaymentMethodDrawer(false)}
                            anchor='right'
                            PaperProps={{
                                style: {
                                    width: drawerWidth, // This makes the drawer full screen
                                },
                            }}
                        >
                            <ChangePaymentMethodDrawer
                                stripeMetadata={stripeMetadata}
                                setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                                setSuccessMessage={setSuccessMessage}
                                setOpenFailureSnackbar={setOpenFailureSnackbar}
                                setFailureMessage={setFailureMessage}
                                setOpenDrawer={setOpenPaymentMethodDrawer}
                                onSubmitPaymentMethod={onSubmitPaymentMethod}
                                confirmationButtonText={
                                    'Back to Subscription Details'
                                }
                                userId={userId}
                            />
                        </Drawer>
                    </Elements>
                )}
            </div>
        </div>
    );
}
