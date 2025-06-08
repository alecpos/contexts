'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CloseIcon from '@mui/icons-material/Close';
import { Button, CircularProgress } from '@mui/material';
import {
    CardElement,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import DrawerConfirmationSuccess from '../../../../account-information/personal-information/components/DrawerConfirmationSuccess';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { PAYMENT_SUCCESS } from '@/app/services/customerio/event_names';

interface ChangePaymentMethodDrawerProps {
    stripeMetadata: any;
    setOpenSuccessSnackbar: Dispatch<SetStateAction<boolean>>;
    setSuccessMessage: Dispatch<SetStateAction<string>>;
    setOpenFailureSnackbar: Dispatch<SetStateAction<boolean>>;
    setFailureMessage: Dispatch<SetStateAction<string>>;
    setOpenDrawer: any;
    onSubmitPaymentMethod: () => Promise<any>;
    confirmationButtonText: string;
    userId: string;
}

export default function ChangePaymentMethodDrawer({
    stripeMetadata,
    setOpenSuccessSnackbar,
    setSuccessMessage,
    setOpenFailureSnackbar,
    setFailureMessage,
    setOpenDrawer,
    onSubmitPaymentMethod,
    confirmationButtonText,
    userId,
}: ChangePaymentMethodDrawerProps) {
    const [screen, setScreen] = useState<number>(0);
    const stripe = useStripe();
    const elements = useElements();
    const elementOptions = {
        fields: {
            billingDetails: {
                address: {
                    country: 'never',
                },
            },
        },
        terms: {
            card: 'never',
        },
    };
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    useEffect(() => {
        const paymentElement = elements?.getElement(PaymentElement);

        if (!paymentElement) {
            var paymentElementNew = elements?.create(
                'payment' as any,
                elementOptions as any,
            );
            paymentElementNew?.mount('#payment-element');
        } else {
            paymentElement.mount('#payment-element');
        }
    }, []);

    const handleNoSubmit = async (event: any) => {
        event.preventDefault();
        setButtonLoading(true);

        if (!stripe || !elements) {
            // Handle the case where the card element is not available
            setButtonLoading(false);
            setFailureMessage(
                'Error: Failed to update payment method. Please try again.',
            );
            setOpenFailureSnackbar(true);
            return;
        }

        stripe
            .confirmSetup({
                //`Elements` instance that was used to create the Payment Element
                elements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
                    payment_method_data: {
                        billing_details: {
                            address: {
                                country: 'US',
                            },
                        },
                    },
                },
            })
            .then(async function (result) {
                if (result.error) {
                    console.log('error', result);
                } else {
                    // Retrieve the SetupIntent with the expand parameter to get the payment_method
                    const setupIntent = await stripe.retrieveSetupIntent(
                        stripeMetadata.clientSecret,
                    );

                    await onSubmitPaymentMethod();

                    await logPatientAction(
                        userId,
                        PatientActionTask.CARD_UPDATED,
                        {},
                    );

                    await triggerEvent(userId, PAYMENT_SUCCESS);
                    setScreen(1);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(async () => {
                setButtonLoading(false);
            });
    };

    return (
        <div className="overflow-x-hidden">
            <div
                className="flex justify-end items-center w-full h-[50px]"
                onClick={() => setOpenDrawer(false)}
            >
                <BioType className="body1 text-[14px] cursor-pointer">
                    CLOSE
                </BioType>
                <CloseIcon
                    sx={{
                        fontSize: 24,
                        color: '#1B1B1B8F',
                        cursor: 'pointer',
                    }}
                />
            </div>
            <div className="w-full h-[1px] bg-[#1B1B1B1F]"></div>
            <div className="w-[90%] mx-auto">
                {screen === 0 ? (
                    <>
                        <div className="mt-6 h6 mb-2">
                            Change payment method
                        </div>
                        <form onSubmit={handleNoSubmit}>
                            {/* <CardElement /> */}
                            <div id="payment-element"></div>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    width: '100%',
                                    height: '52px',
                                    marginTop: '36px',
                                }}
                                disabled={!stripe}
                            >
                                {buttonLoading ? (
                                    <CircularProgress
                                        sx={{ color: 'white' }}
                                        size={20}
                                    />
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </form>
                        <Button
                            type="submit"
                            sx={{
                                width: '100%',
                                height: '52px',
                                backgroundColor: 'white',
                                borderColor: '#286BA2',
                                border: 1,
                                marginTop: '16px',
                            }}
                            onClick={() => setOpenDrawer(false)}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <DrawerConfirmationSuccess
                        message={
                            'Thank you! Your payment method has been successfully changed.'
                        }
                        buttonText={confirmationButtonText}
                        setOpenDrawer={setOpenDrawer}
                    />
                )}
            </div>
        </div>
    );
}
