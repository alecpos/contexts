'use client';

import { Button, Drawer, Paper, useMediaQuery } from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AccountEditDrawer from './account-edit-drawer';
import PhotoEditDrawer from './photo-edit-drawer';
import PasswordEditDrawer from './password-edit-drawer';
import Link from 'next/link';
import { SubscriptionListItem } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import PrescriptionsList from './components/PrescriptionsList';
import ProtectedHealthInformationDownload from '../phi-download-component';
import UpdatePaymentMethod from './components/UpdatePaymentMethod';
import ChangePaymentMethodDrawer from '../../subscriptions/components/SubscriptionDetails/components/ChangePaymentMethodDrawer';
import { loadStripe } from '@stripe/stripe-js';
import { createSetupIntentServerCustomer } from '@/app/services/stripe/setupIntent';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';

interface Props {
    personalData: AccountNameEmailPhoneData | undefined;
    licenseData: LicenseData;
    userProvider: string | undefined;
    userID: string | undefined;
    setPersonalData: Dispatch<
        SetStateAction<AccountNameEmailPhoneData | undefined>
    >;
    activeSubscriptions: SubscriptionListItem[];
    last4: string;
    stripeCustomerId: string;
}

export default function AccountInformationDisplay({
    personalData,
    licenseData,
    userProvider,
    userID,
    setPersonalData,
    activeSubscriptions,
    last4,
    stripeCustomerId,
}: Props) {
    const isLargeScreen = useMediaQuery('(min-width:576px)');

    const [licensePhoto, setLicensePhoto] = useState<string>('');
    const [selfiePhoto, setSelfiePhoto] = useState<string>('');

    const [nameAddressPhoneEditDrawerOpen, setNameEditDrawerOpen] =
        useState<boolean>(false);
    const [photoEditDrawerState, setPhotoUpdateDrawerState] =
        useState<boolean>(false);
    const [passwordEditDrawerState, setPasswordEditDrawerState] =
        useState<boolean>(false);
    const [paymentMethodDrawerState, setPaymentMethodDrawerState] =
        useState<boolean>(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] =
        useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [openFailureSnackbar, setOpenFailureSnackbar] =
        useState<boolean>(false);
    const [failureMessage, setFailureMessage] = useState<string>('');

    const [last4PM, setLast4PM] = useState<string>(last4 || '');

    const [toggleDataCheck, doToggleDataCheck] = useState<boolean>(false);

    const toggleNameDrawer = () => {
        setNameEditDrawerOpen((prev) => !prev);
    };

    const closeNameDrawer = () => {
        setNameEditDrawerOpen(false);
    };

    const toggleImageDrawer = async () => {
        setPhotoUpdateDrawerState((prev) => !prev);
    };

    const closeImageDrawer = () => {
        setPhotoUpdateDrawerState(false);
    };

    const togglePasswordDrawer = () => {
        setPasswordEditDrawerState((prev) => !prev);
    };

    const closePaymentMethodDrawer = () => {
        setPaymentMethodDrawerState(false);
    };

    const togglePaymentMethodDrawer = () => {
        setPaymentMethodDrawerState((prev) => !prev);
    };

    const closePasswordDrawer = () => {
        setPasswordEditDrawerState(false);
    };

    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    );

    const [stripeMetadata, setStripeMetadata] = useState<any>(null);

    const createSetupIntent = async (refire: boolean) => {
        if (!stripeMetadata || !stripeMetadata.setupIntentId || refire) {
            if (!stripeCustomerId) {
                return;
            }
            const setupIntent = await createSetupIntentServerCustomer(
                stripeCustomerId,
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

    const onSubmitPaymentMethod = async () => {
        try {
            const request = await axios.post(
                '/api/stripe/payment-method/default',
                {
                    stripeCustomerId,
                },
            );

            if (request.data.success) {
                // setSuccessMessage('Successfully updated payment method');
                // setOpenSuccessSnackbar(true);
                if (request.data.digits) {
                    console.log(request.data);
                    setLast4PM(request.data.digits);
                }
                await createSetupIntent(true);
            } else {
                setFailureMessage(
                    'Error: Failed to update payment method. Please try again.',
                );
                setOpenFailureSnackbar(true);
            }
        } catch (error) {
            console.error(error);

            setFailureMessage(
                'Error: Failed to update payment method. Please try again.',
            );
            setOpenFailureSnackbar(true);
        }
    };

    //Set Lisence and Selfie Photo URL's.
    useEffect(() => {
        setLicensePhoto(licenseData.license || '');
        setSelfiePhoto(licenseData.selfie || '');
    }, [licenseData]);

    const reformatDate = (dateToFormat: string) => {
        const [year, month, day] = dateToFormat.split('-');
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    };

    const drawerWidth = isLargeScreen ? 360 : '100%';

    return (
        <div className="mx-auto max-w-[90%] sm:w-full mt-7 sm:mt-16">
            {/*  */}
            <BioType className="h3 text-[28px] sm:text-[36px] text-black mb-4">
                Profile
            </BioType>
            <div className="flex flex-col space-y-12">
                <div className="flex flex-col space-y-4">
                    <BioType className="h6 text-[24px] text-[#00000099]">
                        Account Details
                    </BioType>
                    <Paper className="px-7 py-6">
                        <div className="flex flex-col space-y-4 w-full">
                            <div className="flex w-full">
                                <div className="flex flex-col space-y-2 w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <BioType className="body1 text-[#00000099] text-[16px]">
                                            Name
                                        </BioType>
                                        <div className="hidden sm:flex">
                                            <Button
                                                onClick={toggleNameDrawer}
                                                variant="outlined"
                                                sx={{
                                                    height: 30,
                                                    width: 32,
                                                }}
                                            >
                                                <BioType className="body1 text-[13px] text-[#286BA2]">
                                                    EDIT
                                                </BioType>
                                            </Button>
                                        </div>
                                    </div>
                                    <BioType className="body1 text-black text-[16px]">
                                        {personalData?.first_name}{' '}
                                        {personalData?.last_name}
                                    </BioType>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <BioType className="body1 text-[#00000099] text-[16px]">
                                    Email Address
                                </BioType>
                                <BioType className="body1 text-black text-[16px]">
                                    {personalData?.email}
                                </BioType>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <BioType className="body1 text-[#00000099] text-[16px]">
                                    Phone Number
                                </BioType>
                                <BioType className="body1 text-black text-[16px]">
                                    {personalData?.phone_number}
                                </BioType>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <BioType className="body1 text-[#00000099] text-[16px]">
                                    Birthday
                                </BioType>
                                <BioType className="body1 text-black text-[16px]">
                                    {reformatDate(
                                        personalData?.date_of_birth || '',
                                    )}
                                </BioType>
                            </div>
                            <div className="w-full block sm:hidden">
                                <Button
                                    onClick={toggleNameDrawer}
                                    variant="outlined"
                                    sx={{
                                        height: 52,
                                        width: '100%',
                                    }}
                                >
                                    <BioType className="body1 text-[13px] text-[#286BA2]">
                                        EDIT
                                    </BioType>
                                </Button>
                            </div>
                        </div>
                    </Paper>
                </div>
                <UpdatePaymentMethod
                    last4={last4PM}
                    setOpenDrawer={setPaymentMethodDrawerState}
                />
                <div className="flex flex-col space-y-4">
                    <BioType className="h6 text-[24px] text-[#00000099]">
                        My ID/Photo
                    </BioType>

                    <Paper id="id-verification-container" className="px-7 py-6">
                        {/**
                         * Images Section
                         *
                         * Change License and Selfie Images here.
                         *
                         * Selfie image appears first
                         * License image appears second
                         *
                         */}

                        {/* <div className="flex justify-between items-center mb-4">
                        {isMobile ? (
                            ''
                        ) : (
                            <Button
                                onClick={toggleImageDrawer}
                                variant="outlined"
                                className="gap-2"
                            >
                                <EditIcon /> EDIT
                            </Button>
                        )}
                    </div> */}

                        <div className="flex flex-col sm:flex-row sm:space-x-2 sm:justify-center">
                            {/* <div className='flex flex-col'>
                                <BioType className='body1 mb-1 text-[16px] text-black'>
                                    ID
                                </BioType>

                                <div className='flex w-[100%] sm:w-[239px] relative aspect-[16/9] items-center justify-center overflow-hidden border-dashed border-1 border-[#1B1B1B] h-[133px] rounded-[4px]'>
                                    {selfiePhoto ? (
                                        <div className='p-0 relative w-full h-full rounded-sm'>
                                            <Image
                                                src={selfiePhoto}
                                                alt={'selfie'}
                                                fill
                                                objectFit='contain'
                                                unoptimized
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div> */}

                            {/* <div className='flex flex-col'>
                                <BioType className='body1 text-black text-[16px] mb-1 mt-4 sm:mt-0'>
                                    Selfie (e.g. photo of you)
                                </BioType>

                                <div className='flex w-[100%] sm:w-[239px] max-h-[133px] relative aspect-[16/9] items-center justify-center overflow-hidden border-dashed border-1 border-[#1B1B1B] rounded-[4px]'>
                                    {licensePhoto ? (
                                        <div className='p-0 relative w-full h-full rounded-sm'>
                                            <Image
                                                src={licensePhoto}
                                                alt={'license'}
                                                fill
                                                style={{
                                                    objectFit: 'contain',
                                                }}
                                                unoptimized
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div> */}
                            <div className="w-full hidden sm:flex">
                                <Button
                                    onClick={toggleImageDrawer}
                                    variant="outlined"
                                    sx={{
                                        height: 30,
                                        maxWidth: 30,
                                    }}
                                >
                                    <BioType className="body1 text-[13px] text-[#286BA2]">
                                        EDIT
                                    </BioType>
                                </Button>
                            </div>
                        </div>
                        <div className="w-full flex sm:hidden mt-4 sm:mt-0">
                            <Button
                                onClick={toggleImageDrawer}
                                variant="outlined"
                                sx={{ height: 52, width: '100%' }}
                            >
                                <BioType className="body1 text-[13px] text-[#286BA2]">
                                    EDIT
                                </BioType>
                            </Button>
                        </div>
                    </Paper>
                </div>
                <div className="flex flex-col space-y-4">
                    <BioType className="h6 text-[24px] text-[#00000099]">
                        Shipping Address
                    </BioType>
                    <Paper className="px-7 py-6 flex flex-col space-y-6">
                        <div className="flex flex-col space-y-2">
                            <BioType className="body1 text-[16px] text-[#00000099]">
                                Subscriptions
                            </BioType>
                            <BioType className="body1 text-[16px] text-black">
                                If you want to update your shipping address, you
                                can do so in your subscriptions page.
                            </BioType>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <BioType className="body1 text-[16px] text-[#00000099]">
                                Orders
                            </BioType>
                            <BioType className="body1 text-[16px] text-black font-[400]">
                                Need to change the address of an order that’s
                                in-progress? Contact customer support.
                            </BioType>
                        </div>
                    </Paper>
                </div>

                <PrescriptionsList activeSubscriptions={activeSubscriptions} />

                {/* <Button
                                    onClick={togglePasswordDrawer}
                                    variant="outlined"
                                    className="gap-2 justify-self-end"
                                >
                                    <EditIcon /> EDIT
                                </Button> */}

                {userProvider === 'email' && (
                    <div className="flex flex-col space-y-4">
                        <BioType className="h6 text-[24px] text-[#00000099]">
                            Password
                        </BioType>
                        <Paper className="flex flex-col px-7 py-6 space-y-4 sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex flex-col space-y-2">
                                <BioType className="body1 text-[16px] text-[#00000099]">
                                    Current password
                                </BioType>
                                <BioType className="body1 text-[16px] text-black">
                                    •••••••••••
                                </BioType>
                            </div>
                            <Button
                                onClick={togglePasswordDrawer}
                                variant="outlined"
                                sx={{
                                    width: { xs: '100%', sm: 'unset' },
                                    height: { xs: '52px', sm: 'unset' },
                                }}
                            >
                                <BioType className="body1 text-[13px] text-[#286BA2]">
                                    CHANGE PASSWORD
                                </BioType>
                            </Button>
                        </Paper>
                    </div>
                )}

                <ProtectedHealthInformationDownload />
                <div className="mb-8"></div>
                {/* <Drawer
                            open={
                                openPaymentMethodDrawer &&
                                stripeMetadata.clientSecret
                            }
                            onClose={() => setOpenPaymentMethodDrawer(false)}
                            anchor="right"
                            PaperProps={{
                                style: {
                                    width: drawerWidth, // This makes the drawer full screen
                                },
                            }}
                        > */}

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
                            id="payment-method-edit-drawer"
                            anchor="right"
                            open={
                                paymentMethodDrawerState &&
                                stripeMetadata.clientSecret
                            }
                            onClose={closePaymentMethodDrawer}
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
                                setOpenDrawer={setPaymentMethodDrawerState}
                                onSubmitPaymentMethod={onSubmitPaymentMethod}
                                confirmationButtonText={'Continue to Profile'}
                                userId={userID!}
                            />
                        </Drawer>
                    </Elements>
                )}
                <Drawer
                    id="name-address-phone-edit-drawer"
                    anchor="right"
                    open={nameAddressPhoneEditDrawerOpen}
                    onClose={closeNameDrawer}
                    PaperProps={{
                        style: {
                            width: drawerWidth, // This makes the drawer full screen
                        },
                    }}
                >
                    <AccountEditDrawer
                        personalData={personalData}
                        toggleNameDrawer={toggleNameDrawer}
                        userID={userID}
                        setPersonalData={setPersonalData}
                        setNameEditDrawerOpen={setNameEditDrawerOpen}
                    />
                </Drawer>

                <Drawer
                    anchor="right"
                    open={photoEditDrawerState}
                    onClose={closeImageDrawer}
                    PaperProps={{
                        style: {
                            width: drawerWidth, // This makes the drawer full screen
                        },
                    }}
                >
                    <PhotoEditDrawer
                        userID={userID}
                        togglePhotoEditDrawer={toggleImageDrawer}
                        doToggleDataCheck={doToggleDataCheck}
                        licensePhoto={licensePhoto}
                        setLicensePhoto={setLicensePhoto}
                        selfiePhoto={selfiePhoto}
                        setSelfiePhoto={setSelfiePhoto}
                        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                        setSuccessMessage={setSuccessMessage}
                        setOpenFailureSnackbar={setOpenFailureSnackbar}
                        setFailureMessage={setFailureMessage}
                    />
                </Drawer>

                <Drawer
                    id="name-address-phone-edit-drawer"
                    anchor="right"
                    open={passwordEditDrawerState}
                    onClose={closePasswordDrawer}
                    PaperProps={{
                        style: {
                            width: drawerWidth, // This makes the drawer full screen
                        },
                    }}
                >
                    <PasswordEditDrawer
                        togglePasswordEditDrawer={togglePasswordDrawer}
                        userID={userID}
                        userEmail={personalData?.email}
                        setPasswordEditDrawer={setPasswordEditDrawerState}
                    />
                </Drawer>
            </div>
            <BioverseSnackbarMessage
                color="success"
                open={openSuccessSnackbar}
                setOpen={setOpenSuccessSnackbar}
                message={successMessage}
            />
            <BioverseSnackbarMessage
                color="error"
                open={openFailureSnackbar}
                setOpen={setOpenFailureSnackbar}
                message={failureMessage}
            />
        </div>
    );
}
