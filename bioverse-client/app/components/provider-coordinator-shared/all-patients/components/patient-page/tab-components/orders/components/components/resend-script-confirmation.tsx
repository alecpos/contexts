import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import { useState } from 'react';
import {
    resendBoothwynScript,
    resendEmpowerScript,
    resendHallandaleScript,
    resendReviveScript,
} from '../../utils/resend-scripts';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import React from 'react';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { ScriptHandlerFactory } from '@/app/utils/classes/Scripts/ScriptHandlerFactory';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { VARIANT_PHARMACY_MAP } from '@/app/utils/classes/ProductVariant/constants/VariantPharmacyMap';
import ResendScriptSigDisplay from './resend-script-view-components/resendScriptSigDisplay';
import { generateEmpowerScriptAsync } from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';
import { getOrderById } from '@/app/utils/database/controller/orders/orders-api';
import { generateHallandaleScriptAsync } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { generateBoothwynScriptAsync } from '@/app/utils/functions/prescription-scripts/boothwyn-script-generator';
import { generateReviveScript } from '@/app/utils/functions/prescription-scripts/revive-script-generator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface ResendScriptDialogProps {
    open: boolean;
    onClose: () => void;
    orderId: string;
    patientId: string;
    assigned_provider: string;
    order_type: OrderType;
    product_href: PRODUCT_HREF;
    variant_index: number;
    script_sent: boolean;
    renewal_order_id?: string;
    subscription_id?: number;
}
export default function ResendScriptConfirmationDialog({
    open,
    onClose,
    orderId,
    patientId,
    assigned_provider,
    order_type,
    product_href,
    variant_index,
    renewal_order_id,
    subscription_id,
    script_sent,
}: ResendScriptDialogProps) {
    const [errorInScript, setErrorInScript] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<JSX.Element>();

    const [editingClinicalOrderID, setEditingClinicalOrderID] =
        useState<boolean>(false);

    const [confirmationCheckbox, setConfirmationCheckbox] =
        useState<boolean>(false);
    const [isSendingScript, setIsSendingScript] = useState<boolean>(false);

    const [overrideAudit, setOverrideAudit] = useState<boolean>(false);

    const [assignedPharmacy, setAssignedPharmacy] = useState<string | null>(
        VARIANT_PHARMACY_MAP[product_href][variant_index] ?? null
    );

    const handleScriptSend = async () => {
        setIsSendingScript(true);
        try {
            if (order_type === OrderType.RenewalOrder) {
                const renewalOrder = await getRenewalOrder(renewal_order_id!);

                if (!renewalOrder) {
                    throw new Error('Error: Something went wrong');
                }

                const subscription = await getPrescriptionSubscription(
                    renewalOrder.subscription_id
                );

                if (!subscription) {
                    throw new Error('Error: Something went wrong');
                }

                const scriptHandler = ScriptHandlerFactory.createHandler(
                    renewalOrder,
                    subscription,
                    ScriptSource.ResendScript,
                    undefined,
                    undefined,
                    true
                );

                const res = await scriptHandler.regenerateAndSendScript();

                if (res === Status.Failure) {
                    throw new Error('Failed to send script');
                }

                setErrorMessage(
                    <BioType className='it-subtitle text-green-500'>
                        Script Sent!
                    </BioType>
                );
            } else {
                const { data: orderData, error } = await getOrderById(orderId);

                if (error) {
                    throw new Error('Error: Could not fetch order data');
                }

                switch (assignedPharmacy) {
                    case 'empower':
                        const { script: empowerScript } =
                            await generateEmpowerScriptAsync(
                                patientId,
                                orderId,
                                undefined,
                                overrideAudit
                            );

                        const empowerScriptResponse = await resendEmpowerScript(
                            JSON.stringify(empowerScript),
                            orderId,
                            assigned_provider,
                            order_type,
                            overrideAudit,
                            renewal_order_id,
                            subscription_id
                        );

                        if (empowerScriptResponse.result === Status.Failure) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-red-500'>
                                    {empowerScriptResponse.message}
                                </BioType>
                            );
                        } else if (
                            empowerScriptResponse.result === Status.Success
                        ) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-green-500'>
                                    Script Sent!
                                </BioType>
                            );
                        }

                        break;
                    case 'hallandale':
                        const hallandaleScriptData =
                            await generateHallandaleScriptAsync(
                                patientId,
                                orderId,
                                undefined,
                                overrideAudit
                            );

                        if (!hallandaleScriptData) {
                            throw new Error(
                                'Could not generate Hallandale Script'
                            );
                        }

                        const body_json: HallandaleScriptJSON = {
                            message: {
                                id: orderData.id,
                                sentTime: new Date().toISOString(),
                            },
                            order: hallandaleScriptData.script,
                        };

                        if (!hallandaleScriptData) {
                            throw new Error(
                                'Error: Could not generate hallandale script'
                            );
                        }

                        console.log(
                            'script information hallandale: ',
                            hallandaleScriptData
                        );

                        const {
                            result: hallandaleResult,
                            message: hallandaleMessage,
                        } = await resendHallandaleScript(
                            JSON.stringify(body_json),
                            orderId,
                            assigned_provider,
                            order_type,
                            overrideAudit,
                            renewal_order_id,
                            subscription_id,
                            variant_index
                        );

                        if (hallandaleResult === Status.Failure) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-red-500'>
                                    {hallandaleMessage}
                                </BioType>
                            );
                        } else if (hallandaleResult === Status.Success) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-green-500'>
                                    Script Sent!
                                </BioType>
                            );
                        }
                        break;

                    case 'boothwyn':
                        const boothwynScriptData =
                            await generateBoothwynScriptAsync(
                                patientId,
                                orderId,
                                undefined,
                                overrideAudit
                            );

                        if (!boothwynScriptData) {
                            throw new Error(
                                'Error: Could not generate boothwyn script'
                            );
                        }

                        const {
                            result: boothwynResult,
                            reason: boothwynMessage,
                        } = await resendBoothwynScript(
                            JSON.stringify(boothwynScriptData),
                            orderId,
                            assigned_provider,
                            order_type,
                            overrideAudit,
                            renewal_order_id,
                            subscription_id
                        );

                        if (boothwynResult === Status.Failure) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-red-500'>
                                    {boothwynMessage}
                                </BioType>
                            );
                        } else if (boothwynResult === Status.Success) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-green-500'>
                                    Script Sent!
                                </BioType>
                            );
                        }

                        break;

                    case 'revive':
                        const reviveScriptData = await generateReviveScript(
                            patientId,
                            orderId,
                            undefined,
                            overrideAudit
                        );

                        if (!reviveScriptData) {
                            throw new Error(
                                'Error: Could not generate revive script'
                            );
                        }

                        const { result: reviveResult, reason: reviveMessage } =
                            await resendReviveScript(
                                JSON.stringify(reviveScriptData.script_json),
                                orderId,
                                assigned_provider,
                                order_type,
                                overrideAudit,
                                renewal_order_id,
                                subscription_id,
                                variant_index
                            );

                        if (reviveResult === Status.Failure) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-red-500'>
                                    {reviveMessage}
                                </BioType>
                            );
                        } else if (reviveResult === Status.Success) {
                            setErrorMessage(
                                <BioType className='it-subtitle text-green-500'>
                                    Script Sent!
                                </BioType>
                            );
                        }
                        break;

                    default:
                        setErrorMessage(
                            <BioType className='it-subtitle text-red-500'>
                                There was an error in sending the retry script -
                                No Pharmacy Mapped in code
                            </BioType>
                        );
                }
            }
        } catch (error: any) {
            setErrorMessage(
                <BioType className='it-subtitle text-red-500'>
                    {error.message}
                </BioType>
            );
        }

        setIsSendingScript(false);
    };

    if (errorInScript) {
        return <></>;
    }

    if (assignedPharmacy === 'tmc') {
        return <></>;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>
                Resend Pharmacy Script
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col mb-2 gap-2'>
                    <ResendScriptSigDisplay
                        productHref={product_href as PRODUCT_HREF}
                        variantIndex={variant_index}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <div className='flex flex-col w-full'>
                    <div className='px-2'> {errorMessage && errorMessage} </div>
                    <div className='flex flex-row px-2'>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={confirmationCheckbox}
                                        checked={confirmationCheckbox}
                                        onChange={() =>
                                            setConfirmationCheckbox(
                                                (prev) => !prev
                                            )
                                        }
                                    />
                                }
                                label='Looks Good'
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={overrideAudit}
                                        onChange={() =>
                                            setOverrideAudit((prev) => !prev)
                                        }
                                        disabled={!script_sent}
                                    />
                                }
                                label={
                                    <div className='flex items-center gap-1'>
                                        Override Audit
                                        <Tooltip title='This will bypass the audit process and send the script regardless of the audit results'>
                                            <HelpOutlineIcon
                                                sx={{
                                                    fontSize: '20px',
                                                    color: 'gray',
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            />
                        </FormGroup>
                    </div>
                    <Button
                        disabled={
                            !confirmationCheckbox ||
                            isSendingScript ||
                            editingClinicalOrderID
                        }
                        onClick={() => {
                            handleScriptSend();
                        }}
                        autoFocus
                        variant='outlined'
                        color='primary'
                        fullWidth
                    >
                        {isSendingScript ? <CircularProgress /> : 'Send Script'}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
