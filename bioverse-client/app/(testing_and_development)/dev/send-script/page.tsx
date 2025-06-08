'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { onlySendScriptToEmpower } from '@/app/services/pharmacy-integration/empower/send-script';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { generateAndSendScriptforRenewalOrder } from './helpers';
import UpdateStripeProduct from './components/UpdateStripeProduct';
import ConvertBundleToMonthly from './components/ConvertBundleToMonthly';

export default function SendScriptGeneral() {
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');

    const onClick = async () => {
        setStatus('');
        setStatusMessage('');
        try {
            setLoading(true);
            await generateAndSendScriptforRenewalOrder(orderNumber);
            setStatusMessage('Successfully sent script for order');
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatusMessage(`Failed to send order ${error}`);
            setStatus('failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center p-10 gap-4">
                <BioType className="h2medium text-primary">
                    Send Script for Hallandale and Empower
                </BioType>

                <BioType className="itd-body">
                    Instructions: Enter the renewal order number (eg. 11251-1)
                    and submit. This will send the script to the respective
                    pharmacy.
                </BioType>
                <BioType className="itd-body">
                    Note: SCRIPT WILL BE GENERATED AND SENT OFF
                    ASSIGNED_PHARMACY AND VARIANT_INDEX
                </BioType>
                {status === 'success' && (
                    <BioType className="itd-body text-green-500">
                        {statusMessage}
                    </BioType>
                )}
                {status === 'failure' && (
                    <BioType className="itd-body text-red-600">
                        {statusMessage}
                    </BioType>
                )}

                <div className="flex flex-row w-full justify-start">
                    <div className="flex flex-col w-1/6 gap-2">
                        <BioType className="it-h1">Renewal Order #</BioType>
                        <TextField
                            fullWidth
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            multiline
                        ></TextField>
                    </div>
                </div>

                <div className="flex flex-row w-full gap-4">
                    <div>
                        <Button
                            variant="contained"
                            color="success"
                            className="py-2 px-8"
                            onClick={onClick}
                        >
                            {loading ? (
                                <CircularProgress size={22} />
                            ) : (
                                'Send script'
                            )}
                        </Button>
                    </div>
                </div>
                <UpdateStripeProduct
                    setStatus={setStatus}
                    setStatusMessage={setStatusMessage}
                />
                <ConvertBundleToMonthly
                    setStatus={setStatus}
                    setStatusMessage={setStatusMessage}
                />
            </div>
        </>
    );
}
