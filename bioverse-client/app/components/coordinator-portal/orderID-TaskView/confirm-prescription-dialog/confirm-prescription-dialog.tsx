import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { generateEmpowerScript } from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';
import { generateHallandaleScript } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { getProviderMacroHTMLPrePopulated } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { PRESCRIPTION_APPROVED } from '@/app/services/customerio/event_names';
import processEmpowerScript from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { sendHallendaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { getSwappableGLP1Variants } from '@/app/services/pharmacy-integration/variant-swap/glp1-variant-index-swap';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { StatusTagAction } from '@/app/types/status-tags/status-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getPatientAllergyData } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import {
    assignProviderToOrderUsingOrderId,
    updateExistingOrderPharmacyUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { updateRenewalOrderByRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { updateStripeProduct } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
import EmpowerConfirmationView from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/empower-script-view';
import HallandaleConfirmationView from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/hallandale-script-view';
import { generateReviveScript } from '@/app/utils/functions/prescription-scripts/revive-script-generator';
import { generateBoothwynScriptWithData } from '@/app/utils/functions/prescription-scripts/boothwyn-script-generator';
import ReviveScriptView from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/revive-script-view';
import BoothwynScriptView from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/boothwyn-script-view';
import { sendBoothwynScript } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-script-api';
import { sendReviveScript } from '@/app/services/pharmacy-integration/revive/revive-send-script-api';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    orderData: DBOrderData;
    patientData: DBPatientData;
    orderType: OrderType;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
}

export default function CoordinatorConfirmPrescriptionDialog({
    open,
    onClose,
    orderData,
    patientData,
    orderType,
    messageContent,
    setMessageContent,
}: ConfirmDialogProps) {
    const provider_id = orderData.assigned_provider;

    const pvc = new ProductVariantController(
        orderData.product_href as PRODUCT_HREF,
        orderType === OrderType.Order
            ? orderData.variant_index
            : orderData.variant_index
            ? orderData.variant_index
            : orderData.order.variant_index,
        orderData.state as USStates
    );

    const pvc_result = pvc.getConvertedVariantIndex();
    const dosage = pvc.getEquivalenceDosage();

    console.log('PVC Result check: ', pvc_result);

    const variant_index = pvc_result.variant_index ?? orderData.variant_index;
    const elligiblePharmacy = pvc_result.pharmacy;

    const isSwappableVariant = getSwappableGLP1Variants(
        orderData.product_href
    )?.includes(variant_index);

    const [prescribedInSession, setPrescribedInSession] =
        useState<boolean>(false);

    const {
        data: bmiData,
        error,
        isLoading,
    } = useSWR(
        `${
            elligiblePharmacy === 'empower'
                ? patientData.id + '-BMI-data'
                : null
        } `,
        () => {
            getQuestionAnswersForBMI(patientData.id);
        }
    );

    const {
        data: allergy_data,
        error: allergy_data_error,
        isLoading: allergy_loading,
    } = useSWR(
        `${
            elligiblePharmacy === 'hallandale'
                ? patientData.id + '-allergy-data'
                : null
        } `,
        () => getPatientAllergyData(patientData.id, 'deprecated prop')
    );

    const [scriptMetadata, setScriptMetadata] = useState<{
        script: any;
        sigList: string[] | null;
    }>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [checkboxConfirmed, setCheckboxConfirmed] = useState<boolean>(false);

    const [empowerDisplayName, setEmpowerDisplayName] = useState<string>();
    const [hallandaleDisplayName, setHallandaleDisplayName] =
        useState<string>();

    const [confirmationMessage, setConfirmationMessage] =
        useState<JSX.Element>();

    const [scriptSent, setScriptSent] = useState<boolean>(false);

    useEffect(() => {
        const generateRevivePayload = async () => {
            const revive_generated_payload = await generateReviveScript(
                patientData.id,
                orderData.id,
                {
                    product_href: orderData.product_href,
                    variant_index: variant_index,
                }
            );

            if (revive_generated_payload.error) {
                console.log('error in revive script generation');
            }

            const reviveSigList: any[] = [];

            setScriptMetadata({
                script: revive_generated_payload.script_json,
                sigList: reviveSigList,
            });

            console.log(
                'Revive Script Generated Log for variant index:  ',
                variant_index,
                ' ',
                revive_generated_payload.script_json
            );
        };

        if (elligiblePharmacy) {
            switch (elligiblePharmacy) {
                case 'empower':
                    const empowerScriptData = generateEmpowerScript(
                        patientData,
                        orderData,
                        orderType,
                        bmiData ?? {
                            height_feet: 0,
                            height_inches: 0,
                            weight_lbs: 0,
                            bmi: 0,
                        },
                        variant_index
                    );

                    setEmpowerDisplayName(empowerScriptData.displayName);
                    setScriptMetadata({
                        script: empowerScriptData.script,
                        sigList: empowerScriptData.sigs,
                    });
                    break;

                case 'hallandale':
                    const addressData: AddressInterface = {
                        address_line1:
                            orderType === OrderType.Order
                                ? orderData.address_line1
                                : orderData.order.address_line1,
                        address_line2:
                            orderType === OrderType.Order
                                ? orderData.address_line2
                                : orderData.order.address_line2,
                        city:
                            orderType === OrderType.Order
                                ? orderData.city
                                : orderData.order.city,
                        state:
                            orderType === OrderType.Order
                                ? orderData.state
                                : orderData.order.state,
                        zip:
                            orderType === OrderType.Order
                                ? orderData.zip
                                : orderData.order.zip,
                    };
                    const hallandaleScriptData = generateHallandaleScript(
                        patientData,
                        orderData,
                        addressData,
                        orderType,
                        variant_index
                    );

                    setScriptMetadata({
                        script: hallandaleScriptData?.script ?? {},
                        sigList: hallandaleScriptData?.sigs ?? [],
                    });
                    setHallandaleDisplayName(hallandaleScriptData?.displayName);

                case 'boothwyn':
                    const boothwny_generated_payload =
                        generateBoothwynScriptWithData(patientData, orderData, {
                            product_href: orderData.product_href,
                            variant_index: variant_index,
                        });

                    if (boothwny_generated_payload.error) {
                        console.log('error in boothwyn script generation');
                    }

                    const boothwynSigList =
                        boothwny_generated_payload.script_json?.prescriptions?.map(
                            (prescription) => prescription.instructions
                        ) ?? [];

                    setScriptMetadata({
                        script: boothwny_generated_payload.script_json,
                        sigList: boothwynSigList,
                    });

                    console.log(
                        'Boothwyn Script Generated Log for variant index:  ',
                        variant_index,
                        ' ',
                        boothwny_generated_payload.script_json
                    );
                    break;

                case 'revive':
                    generateRevivePayload();
                    break;
                default:
                    break;
            }
        }
    }, [bmiData, orderData, elligiblePharmacy]);

    const handleProviderPrescribeAudit = async () => {
        const time = new Date().getTime(); // Record start time

        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: 'prescribe_intake',
            timestamp: time,
            metadata: {
                pharmacy: elligiblePharmacy,
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            order_id: orderData.id,
        };

        await createNewProviderActivityAudit(new_audit);
    };

    const handleOrderFailureStatusTagChange = async () => {
        const orderId = orderData.id;

        await createUserStatusTagWAction(
            'Engineering',
            orderId,
            StatusTagAction.REPLACE,
            patientData.id,
            'Escalated to Engineering Queue automatically after a prescribing failure',
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            ['Engineering']
        );
    };

    const deliverEmpowerScript = async () => {
        const resp = await processEmpowerScript(
            orderData.id,
            orderData.order_status,
            orderData.assigned_provider,
            scriptMetadata?.script,
            orderType,
            orderData.subscription_id ? orderData.subscription_id : '',
            orderData,
            variant_index
        );

        await saveScriptForFutureUse(
            scriptMetadata?.script,
            orderData.id,
            'empower',
            ScriptSource.ConfirmPrescriptionDialog
        );

        if (resp.result === Status.Success) {
            setIsSubmitting(false);
            setConfirmationMessage(
                <BioType className='itd-body text-green-500'>
                    🚀 Processed successfully 🚀
                </BioType>
            );

            assignProviderToOrderUsingOrderId(
                Number(orderData.id),
                provider_id
            );
            addProviderToPatientRelationship(patientData.id, provider_id);

            await triggerEvent(patientData.id, PRESCRIPTION_APPROVED, {
                order_id: orderData.id,
                product_name: orderData.product_href,
            });

            // await handleOrderStatusTagChange();
        } else if (resp.result === 'failure') {
            console.log(
                'EMPOWER ERROR LOG: ',
                'script producted: ',
                scriptMetadata!.script,
                `failure reason: reason START | ${resp.reason} | END reason`
            );
            setConfirmationMessage(
                <BioType className='itd-body text-red-500'>
                    There was an issue. Engineering has logged the issue. Please
                    escalate to Engineering with a note.
                </BioType>
            );

            await handleOrderFailureStatusTagChange();

            setIsSubmitting(false);
        }

        // if (setCanProceed) {
        //     setCanProceed(true);
        // }

        setScriptSent(true);
    };

    const handleEmpowerScript = async () => {
        if (orderType === OrderType.Order) {
            await deliverEmpowerScript();
        } else {
            const orderDetails = getOrderStatusDetails(orderData.order_status);

            await updateStripeProduct(
                Number(orderData.subscription_id),
                variant_index,
                orderDetails.isPaid,
                false
            );

            if (orderDetails.isPaid) {
                await deliverEmpowerScript();
            } else {
                if (!orderData.renewal_order_id) {
                    await handleOrderFailureStatusTagChange();
                    setConfirmationMessage(
                        <BioType className='itd-body text-red-500'>
                            There was an issue. Engineering has logged the
                            issue. Please escalate to Engineering with a note.
                        </BioType>
                    );
                    return;
                }
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id,
                    {
                        prescription_json: scriptMetadata?.script,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                        assigned_pharmacy: PHARMACY.EMPOWER,
                    }
                );
            }
        }
    };

    const deliverHallandaleScript = async (body_json: HallandaleScriptJSON) => {
        const result = await sendHallendaleScript(
            body_json,
            orderData.id,
            provider_id,
            orderData.order_status,
            orderType,
            orderData.subscription_id,
            orderData.renewal_order_id,
            variant_index
        );

        await saveScriptForFutureUse(
            body_json,
            orderData.id,
            PHARMACY.HALLANDALE,
            ScriptSource.ConfirmPrescriptionDialog
        );

        if (result.result === Status.Success) {
            setIsSubmitting(false);
            setConfirmationMessage(
                <BioType className='itd-body text-green-500'>
                    🚀 Processed successfully 🚀
                </BioType>
            );

            assignProviderToOrderUsingOrderId(
                Number(orderData.id),
                provider_id
            );
            addProviderToPatientRelationship(patientData.id, provider_id);

            await triggerEvent(patientData.id, PRESCRIPTION_APPROVED, {
                order_id: orderData.id,
                product_name: orderData.product_href,
            });

            // await handleOrderStatusTagChange();
        } else {
            console.log(
                'EMPOWER ERROR LOG: ',
                'script producted: ',
                scriptMetadata!.script,
                `failure reason: reason START | ${result.reason} | END reason`
            );
            setConfirmationMessage(
                <BioType className='itd-body text-red-500'>
                    There was an issue. Engineering has logged the issue. Please
                    escalate to Engineering with a note.
                </BioType>
            );

            await handleOrderFailureStatusTagChange();

            setIsSubmitting(false);
        }
    };

    const handleHallandaleScript = async () => {
        const allergyDataH = allergy_data?.data;

        if (!scriptMetadata) {
            return;
        }

        const hallandale_script_with_allergy = {
            ...scriptMetadata.script,
            patient: {
                ...scriptMetadata.script.patient,
                allergy_data: allergy_data,
            },
        };

        const body_json: HallandaleScriptJSON = {
            message: { id: orderData.id, sentTime: new Date().toISOString() },
            order: hallandale_script_with_allergy,
        };

        if (orderType === OrderType.Order) {
            await deliverHallandaleScript(body_json);
        } else {
            const orderDetails = getOrderStatusDetails(orderData.order_status);

            await updateStripeProduct(
                Number(orderData.subscription_id),
                variant_index,
                orderDetails.isPaid,
                false
            );

            if (orderDetails.isPaid) {
                await deliverHallandaleScript(body_json);
            } else {
                if (!orderData.renewal_order_id) {
                    await handleOrderFailureStatusTagChange();
                    setConfirmationMessage(
                        <BioType className='itd-body text-red-500'>
                            There was an issue. Engineering has logged the
                            issue. Please escalate to Engineering with a note.
                        </BioType>
                    );
                    return;
                }
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id,
                    {
                        prescription_json: body_json,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                        assigned_pharmacy: PHARMACY.HALLANDALE,
                    }
                );
            }
        }

        setScriptSent(true);
    };

    const deliverBoothwynScript = async (scriptJson: BoothwynScriptJSON) => {
        const result = await sendBoothwynScript(
            scriptJson,
            orderData.id,
            provider_id,
            orderData.order_status,
            orderType,
            orderData.subscription_id,
            orderData.renewal_order_id,
            variant_index
        );

        await saveScriptForFutureUse(
            scriptJson,
            orderData.id,
            PHARMACY.BOOTHWYN,
            ScriptSource.ConfirmPrescriptionDialog
        );

        if (result.result === Status.Success) {
            setIsSubmitting(false);
            setConfirmationMessage(
                <BioType className='itd-body text-green-500'>
                    🚀 Processed successfully 🚀
                </BioType>
            );

            assignProviderToOrderUsingOrderId(
                Number(orderData.id),
                provider_id
            );
            addProviderToPatientRelationship(patientData.id, provider_id);

            await triggerEvent(patientData.id, PRESCRIPTION_APPROVED, {
                order_id: orderData.id,
                product_name: orderData.product_href,
            });

            // await handleOrderStatusTagChange();
        } else {
            console.log(
                'BOOTHWYN ERROR LOG: ',
                'script producted: ',
                scriptMetadata!.script,
                `failure reason: reason START | ${result.reason} | END reason`
            );
            setConfirmationMessage(
                <BioType className='itd-body text-red-500'>
                    There was an issue. Engineering has logged the issue. Please
                    escalate to Engineering with a note.
                </BioType>
            );

            await handleOrderFailureStatusTagChange();

            setIsSubmitting(false);
        }
    };

    const handleBoothwynScript = async () => {
        if (!scriptMetadata) {
            return;
        }

        if (orderType === OrderType.Order) {
            await deliverBoothwynScript(scriptMetadata.script);
        } else {
            const orderDetails = getOrderStatusDetails(orderData.order_status);

            await updateStripeProduct(
                Number(orderData.subscription_id),
                variant_index,
                orderDetails.isPaid,
                false
            );

            if (orderDetails.isPaid) {
                await deliverBoothwynScript(scriptMetadata.script);
            } else {
                if (!orderData.renewal_order_id) {
                    await handleOrderFailureStatusTagChange();
                    setConfirmationMessage(
                        <BioType className='itd-body text-red-500'>
                            There was an issue. Engineering has logged the
                            issue. Please escalate to Engineering with a note.
                        </BioType>
                    );
                    return;
                }
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id,
                    {
                        prescription_json: scriptMetadata.script,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                        assigned_pharmacy: PHARMACY.BOOTHWYN,
                    }
                );
            }
        }

        setScriptSent(true);
    };

    const deliverReviveScript = async (scriptJson: ReviveScriptJSON) => {
        const result = await sendReviveScript(
            scriptJson,
            orderData.id,
            provider_id,
            orderData.order_status,
            orderType,
            orderData.subscription_id,
            orderData.renewal_order_id,
            variant_index
        );

        await saveScriptForFutureUse(
            scriptJson,
            orderData.id,
            PHARMACY.REVIVE,
            ScriptSource.ConfirmPrescriptionDialog
        );

        if (result.result === Status.Success) {
            setIsSubmitting(false);
            setConfirmationMessage(
                <BioType className='itd-body text-green-500'>
                    🚀 Processed successfully 🚀
                </BioType>
            );

            assignProviderToOrderUsingOrderId(
                Number(orderData.id),
                provider_id
            );
            addProviderToPatientRelationship(patientData.id, provider_id);

            await triggerEvent(patientData.id, PRESCRIPTION_APPROVED, {
                order_id: orderData.id,
                product_name: orderData.product_href,
            });

            // await handleOrderStatusTagChange();
        } else {
            console.log(
                'REVIVE ERROR LOG: ',
                'script producted: ',
                scriptMetadata!.script,
                `failure reason: reason START | ${result.reason} | END reason`
            );
            setConfirmationMessage(
                <BioType className='itd-body text-red-500'>
                    There was an issue. Engineering has logged the issue. Please
                    escalate to Engineering with a note.
                </BioType>
            );

            await handleOrderFailureStatusTagChange();

            setIsSubmitting(false);
        }
    };

    const handleReviveScript = async () => {
        if (!scriptMetadata) {
            return;
        }

        if (orderType === OrderType.Order) {
            await deliverReviveScript(scriptMetadata.script);
        } else {
            const orderDetails = getOrderStatusDetails(orderData.order_status);

            await updateStripeProduct(
                Number(orderData.subscription_id),
                variant_index,
                orderDetails.isPaid,
                false
            );

            if (orderDetails.isPaid) {
                await deliverBoothwynScript(scriptMetadata.script);
            } else {
                if (!orderData.renewal_order_id) {
                    await handleOrderFailureStatusTagChange();
                    setConfirmationMessage(
                        <BioType className='itd-body text-red-500'>
                            There was an issue. Engineering has logged the
                            issue. Please escalate to Engineering with a note.
                        </BioType>
                    );
                    return;
                }
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id,
                    {
                        prescription_json: scriptMetadata.script,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                        assigned_pharmacy: PHARMACY.BOOTHWYN,
                    }
                );
            }
        }

        setScriptSent(true);
    };

    const sendScript = async () => {
        setIsSubmitting(true);

        if (prescribedInSession) {
            setIsSubmitting(false);

            setConfirmationMessage(
                <BioType className='itd-body text-red-500'>
                    You have already prescribed during this session. This
                    message is shown to prevent double charges.
                </BioType>
            );
            return;
        }

        setPrescribedInSession(true);

        await handleProviderPrescribeAudit();

        switch (elligiblePharmacy) {
            case 'empower':
                await updateExistingOrderPharmacyUsingId(
                    orderData.id,
                    'empower'
                );
                await handleEmpowerScript();
                const htmlMacroTextEmpower =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData
                    );

                if (htmlMacroTextEmpower) {
                    setMessageContent(htmlMacroTextEmpower);
                }
                break;

            case 'hallandale':
                await updateExistingOrderPharmacyUsingId(
                    orderData.id,
                    'hallandale'
                );
                await handleHallandaleScript();
                const htmlMacroTextHallandale =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData
                    );
                if (htmlMacroTextHallandale) {
                    setMessageContent(htmlMacroTextHallandale);
                }
                break;

            case 'boothwyn':
                await updateExistingOrderPharmacyUsingId(
                    orderData.id,
                    'boothwyn'
                );
                await handleBoothwynScript();
                const htmlMacroTextBoothwyn =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData
                    );
                if (htmlMacroTextBoothwyn) {
                    setMessageContent(htmlMacroTextBoothwyn);
                }
                break;
            case 'revive':
                await updateExistingOrderPharmacyUsingId(
                    orderData.id,
                    'revive'
                );
                await handleReviveScript();
                const htmlMacroTextRevive =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData
                    );
                if (htmlMacroTextRevive) {
                    setMessageContent(htmlMacroTextRevive);
                }
                break;
        }

        setIsSubmitting(false);
        onClose();
    };

    const renderConfirmationView = () => {
        if (!scriptMetadata) {
            return (
                <>
                    <BioType className='itd-body'>
                        Error in generating Script data, please escalate to
                        Engineering with this message: CODE-02-ScriptGeneration
                    </BioType>
                </>
            );
        }

        switch (elligiblePharmacy) {
            case 'empower':
                return (
                    <div>
                        <EmpowerConfirmationView
                            script={scriptMetadata.script}
                            sigList={scriptMetadata.sigList ?? []}
                            empowerDisplayName={empowerDisplayName}
                        />
                    </div>
                );

            case 'hallandale':
                return (
                    <div>
                        <HallandaleConfirmationView
                            script={scriptMetadata.script}
                            sigList={scriptMetadata.sigList ?? []}
                            hallandaleDisplayName={hallandaleDisplayName}
                        />
                    </div>
                );

            case 'boothwyn':
                return (
                    <div>
                        <BoothwynScriptView
                            script={scriptMetadata.script}
                            sigList={scriptMetadata.sigList ?? []}
                            dosage={dosage}
                            product_href={orderData.product_href}
                        />
                    </div>
                );
            case 'revive':
                return (
                    <div>
                        <ReviveScriptView
                            script={scriptMetadata.script}
                            sigList={scriptMetadata.sigList ?? []}
                            dosage={dosage}
                            product_href={orderData.product_href}
                        />
                    </div>
                );
            default:
                return (
                    <BioType className='itd-body text-red-500'>
                        Error in finding elligible pharmacy within
                        approve-script-dialog. Please contact Engineering with
                        this message.
                    </BioType>
                );
        }
    };

    return (
        <Dialog
            open={open}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>
                {'Approve and prescribe the following?'}
            </DialogTitle>
            <DialogContent className='flex flex-col justify-center gap-4'>
                {renderConfirmationView()}
                {confirmationMessage}
            </DialogContent>
            <DialogActions>
                {!scriptSent ? (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={() =>
                                        setCheckboxConfirmed((prev) => !prev)
                                    }
                                />
                            }
                            label='Patient Consent Received'
                        />
                        <Button
                            onClick={sendScript}
                            variant='contained'
                            color='primary'
                            disabled={
                                isSubmitting || checkboxConfirmed === false
                            }
                        >
                            {isSubmitting ? (
                                <CircularProgress
                                    sx={{ color: '#FFFFFF' }}
                                    size={22}
                                />
                            ) : (
                                'SEND SCRIPT'
                            )}
                        </Button>

                        <Button
                            onClick={onClose}
                            autoFocus
                            variant='outlined'
                            color='error'
                            disabled={isSubmitting}
                        >
                            CANCEL
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={onClose}
                            variant='contained'
                            color='error'
                        >
                            Close
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
