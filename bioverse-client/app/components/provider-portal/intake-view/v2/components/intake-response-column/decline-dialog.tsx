import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import { OrderType } from '@/app/types/orders/order-types';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
import { getMacroById } from '@/app/utils/database/controller/macros/macros-api';
import {
    assignProviderToOrderUsingOrderId,
    updateOrderMetadata,
} from '@/app/utils/database/controller/orders/orders-api';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from '@mui/material';
import { isEmpty } from 'lodash';
import { Dispatch, SetStateAction, useState } from 'react';
import { KeyedMutator } from 'swr';
import { replaceParameters } from '@/app/utils/database/controller/macros/macros';
import { getProviderFromId } from '@/app/utils/database/controller/providers/providers-api';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import React from 'react';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderData: DBOrderData;
    patientData: DBPatientData;
    orderType: OrderType;
    setMessageContent: Dispatch<SetStateAction<string>>;
    mutateIntakeData: KeyedMutator<any>;
    handleProviderApprovalAudit: (approval: boolean) => Promise<void>;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    handleCloseDeclineVerifyMessage: () => void;
}

export default function DeclineOrderDialog({
    open,
    onClose,
    onConfirm,
    orderData,
    orderType,
    setMessageContent,
    mutateIntakeData,
    handleProviderApprovalAudit,
    setCanProceed,
    handleCloseDeclineVerifyMessage,
    patientData,
}: DialogProps) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedNonGLP1Products, setSelectedNonGLP1] = useState<
        PRODUCT_HREF[]
    >([PRODUCT_HREF.METFORMIN, PRODUCT_HREF.WL_CAPSULE]);

    const isGLP1 = [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
    ].includes(orderData.product_href as PRODUCT_HREF);

    const handleConfirmationOfNonGLP1Denial = async () => {
        setIsProcessing(true);
        const current_provider_id = (await readUserSession()).data.session?.user
            .id;

        if (!current_provider_id) {
            setIsProcessing(false);
            return;
        }

        const { data: messageMacro } = await getMacroById(310);

        const provider_data = await getProviderFromId(current_provider_id!);

        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name!,
            messageMacro?.macroHtml,
            provider_data?.credentials!,
            orderData.product_href,
            orderData.id
        );

        setMessageContent(replacedHTML ?? '');

        onConfirm();
    };

    const changeSelectedProducts = (product_href: PRODUCT_HREF) => {
        setSelectedNonGLP1((prevSelected) => {
            if (prevSelected.includes(product_href)) {
                // If the product is already selected, remove it
                return prevSelected.filter((href) => href !== product_href);
            } else {
                // If the product is not selected, add it
                return [...prevSelected, product_href];
            }
        });
    };

    const handleDenialOfGlp1 = async () => {
        setIsProcessing(true);
        handleProviderApprovalAudit(false);

        const current_provider_id = (await readUserSession()).data.session?.user
            .id;

        if (!current_provider_id) {
            setIsProcessing(false);
            return;
        }

        await assignProviderToOrderUsingOrderId(
            Number(orderData.id),
            current_provider_id
        );
        await addProviderToPatientRelationship(
            orderData.customer_uid,
            current_provider_id
        );

        if (orderData.order_status === 'Unapproved-CardDown') {
            await updateExistingOrderStatus(orderData.id, 'Denied-CardDown');
        } else if (orderData.order_status === 'Unapproved-NoCard') {
            await updateExistingOrderStatus(orderData.id, 'Denied-NoCard');
        } else if (orderData.order_status === 'Pending-Customer-Response') {
            await updateExistingOrderStatus(orderData.id, 'Denied-CardDown');
        }

        const newMetadata = {
            alternative_options: selectedNonGLP1Products,
        };
        await updateOrderMetadata(newMetadata, orderData.id);

        await createUserStatusTagWAction(
            StatusTag.NE,
            orderData.id,
            StatusTagAction.REPLACE,
            orderData.customer_uid,
            'Changed to a resolved status after order has been denied',
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            ['N/E']
        );

        try {
            await trackRudderstackEvent(
                patientData.id,
                RudderstackEvent.PRESCRIPTION_DENIED,
                {
                    order_id: orderData.id,
                    product_name: orderData.product_href,
                    provider_id: current_provider_id,
                }
            );
        } catch (error) {
            console.error(
                'Error tracking Rudderstack event in decline-dialog.tsx',
                error
            );
        }

        mutateIntakeData();

        let macroIdForFetch: number = -1;

        if (isEmpty(selectedNonGLP1Products)) {
            macroIdForFetch = 12;
        } else if (
            selectedNonGLP1Products.includes(PRODUCT_HREF.METFORMIN) &&
            selectedNonGLP1Products.includes(PRODUCT_HREF.WL_CAPSULE)
        ) {
            macroIdForFetch = 252; //macro for if both are recommended
        } else if (selectedNonGLP1Products.includes(PRODUCT_HREF.METFORMIN)) {
            macroIdForFetch = 308; //macro for if only metformin is recommended
        } else if (selectedNonGLP1Products.includes(PRODUCT_HREF.WL_CAPSULE)) {
            macroIdForFetch = 309; //macro for if only wl capsule is recommended
        }

        const { data: messageMacro } = await getMacroById(macroIdForFetch);

        const provider_data = await getProviderFromId(current_provider_id!);

        const replacedHTML = replaceParameters(
            patientData,
            provider_data?.name!,
            messageMacro?.macroHtml,
            provider_data?.credentials!,
            orderData.product_href,
            orderData.id
        );

        setMessageContent(replacedHTML ?? '');

        if (setCanProceed) {
            setCanProceed(true);
        }

        setIsProcessing(false);
        handleCloseDeclineVerifyMessage();
    };

    const renderDialogContent = () => {
        if (isGLP1 && orderType === OrderType.Order) {
            return (
                <>
                    <DialogContentText id='alert-dialog-description'>
                        Is the patient eligible for any of the following
                        non-GLP-1 treatments? You can select one or two options.
                    </DialogContentText>
                    <div>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedNonGLP1Products.includes(
                                            PRODUCT_HREF.METFORMIN
                                        )}
                                    />
                                }
                                label={
                                    PRODUCT_NAME_HREF_MAP[
                                        PRODUCT_HREF.METFORMIN
                                    ]
                                }
                                onChange={() => {
                                    changeSelectedProducts(
                                        PRODUCT_HREF.METFORMIN
                                    );
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedNonGLP1Products.includes(
                                            PRODUCT_HREF.WL_CAPSULE
                                        )}
                                    />
                                }
                                label={
                                    PRODUCT_NAME_HREF_MAP[
                                        PRODUCT_HREF.WL_CAPSULE
                                    ]
                                }
                                onChange={() => {
                                    changeSelectedProducts(
                                        PRODUCT_HREF.WL_CAPSULE
                                    );
                                }}
                            />
                        </FormGroup>
                    </div>
                </>
            );
        } else
            return (
                <DialogContentText id='alert-dialog-description'>
                    Are you sure you want to decline this order? This action
                    cannot be reversed by the provider.
                </DialogContentText>
            );
    };

    const renderTitle = () => {
        if (isGLP1 && orderType === OrderType.Order) {
            return 'Decline patient order request?';
        } else {
            return 'Decline patient order request?';
        }
    };

    const renderDialogActions = () => {
        if (isGLP1 && orderType === OrderType.Order) {
            return (
                <>
                    <Button
                        onClick={handleDenialOfGlp1}
                        color='primary'
                        variant='contained'
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: 'black',
                            paddingX: '32px',
                            paddingY: '14px',
                            ':hover': {
                                backgroundColor: 'darkslategray',
                            },
                        }}
                    >
                        {isProcessing ? (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={22}
                            />
                        ) : isEmpty(selectedNonGLP1Products) ? (
                            <span className='normal-case provider-bottom-button-text  text-white'>
                                Deny Order
                            </span>
                        ) : (
                            <span className='normal-case provider-bottom-button-text  text-white'>
                                Confirm Alternatives
                            </span>
                        )}
                    </Button>
                    <Button
                        onClick={onClose}
                        autoFocus
                        variant='outlined'
                        color='error'
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            paddingX: '32px',
                            paddingY: '14px',
                        }}
                    >
                        <span className='normal-case provider-bottom-button-text  text-red'>
                            Cancel
                        </span>
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Button
                        onClick={handleConfirmationOfNonGLP1Denial}
                        color='primary'
                        variant='contained'
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: 'black',
                            paddingX: '32px',
                            paddingY: '14px',
                            ':hover': {
                                backgroundColor: 'darkslategray',
                            },
                        }}
                    >
                        {isProcessing ? (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={22}
                            />
                        ) : (
                            <span className='normal-case provider-bottom-button-text  text-white'>
                                Deny Order
                            </span>
                        )}
                    </Button>
                    <Button
                        onClick={onClose}
                        autoFocus
                        variant='outlined'
                        color='error'
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            paddingX: '32px',
                            paddingY: '14px',
                        }}
                    >
                        <span className='normal-case provider-bottom-button-text  text-red'>
                            Cancel
                        </span>
                    </Button>
                </>
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{renderTitle()}</DialogTitle>
            <DialogContent>{renderDialogContent()}</DialogContent>
            <DialogActions>{renderDialogActions()}</DialogActions>
        </Dialog>
    );
}
