'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Dialog,
    DialogContent,
    Button,
    CircularProgress,
    Box,
    Tab,
    Tabs,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import EmpowerConfirmationView from './approve-and-prescribe-confirmation-details/empower-script-view';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { generateEmpowerScript } from '../../../../../../utils/functions/prescription-scripts/empower-approval-script-generator';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import useSWR, { KeyedMutator } from 'swr';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import processEmpowerScript from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { PRESCRIPTION_APPROVED } from '@/app/services/customerio/event_names';
import {
    assignProviderToOrderUsingOrderId,
    updateExistingOrderPharmacyAndVariantIndexUsingId,
    updateExistingOrderPharmacyUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { useRouter } from 'next/navigation';
import { generateTMCScript } from '../../../../../../utils/functions/prescription-scripts/tmc-approval-script-generator';
import { getPatientAllergyData } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
import TmcConfirmationView from './approve-and-prescribe-confirmation-details/tmc-script-view';
import ProcessTMCScript from '@/app/services/pharmacy-integration/tmc/provider-script-feedback';
import { getProviderMacroHTMLPrePopulated } from '../containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import HallandaleConfirmationView from './approve-and-prescribe-confirmation-details/hallandale-script-view';
import { generateHallandaleScript } from '../../../../../../utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { sendHallendaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { Status } from '@/app/types/global/global-enumerators';
import React from 'react';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { updateRenewalOrderByRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
import { generateBoothwynScriptWithData } from '@/app/utils/functions/prescription-scripts/boothwyn-script-generator';
import BoothwynScriptView from './approve-and-prescribe-confirmation-details/boothwyn-script-view';
import ProviderDosageChangeComponent from './approve-and-prescribe-confirmation-details/dosage-change/dosage-change-component';
import ReviveScriptView from './approve-and-prescribe-confirmation-details/revive-script-view';
import { generateReviveScript } from '@/app/utils/functions/prescription-scripts/revive-script-generator';
import { sendBoothwynScript } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-script-api';
import { sendReviveScript } from '@/app/services/pharmacy-integration/revive/revive-send-script-api';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    orderData: DBOrderData;
    patientData: DBPatientData;
    provider_id: string;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    orderType: OrderType;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmApprovalAndScriptDialog({
    open,
    onClose,
    orderData,
    patientData,
    provider_id,
    mutateIntakeData,
    setMessageContent,
    orderType,
    setResponseRequired,
}: ConfirmDialogProps) {
    let variant_index: number;
    const pvc = new ProductVariantController(
        orderData.product_href as PRODUCT_HREF,
        orderData.variant_index,
        (orderData.state as USStates) ?? (patientData.state as USStates)
    );

    /**
     * Conversion Controller code -
     * - Consumes product href / variant index / state of residence
     * - Outputs the new variant index + the equivalence name
     */
    const pvc_converted_result = pvc.getConvertedVariantIndex();
    const dosage = pvc.getEquivalenceDosage();

    // console.log('product href: ', orderData.product_href);
    // console.log('variant index: ', orderData.variant_index);
    // console.log('state: ', orderData.state);

    variant_index =
        pvc_converted_result.variant_index ?? orderData.variant_index;

    const elligiblePharmacy = pvc_converted_result.pharmacy;

    console.log('PVC Result check: ', pvc_converted_result);

    const [prescribedInSession, setPrescribedInSession] =
        useState<boolean>(false);

    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const { data: bmiData } = useSWR(
        elligiblePharmacy === 'empower' ? `${patientData.id}-BMI-data` : null,
        () => getQuestionAnswersForBMI(patientData.id)
    );

    const { data: allergy_data } = useSWR(
        elligiblePharmacy === 'tmc' || elligiblePharmacy === 'hallandale'
            ? `${patientData.id}-allergy-data`
            : null,
        () => getPatientAllergyData(patientData.id, 'deprecated prop')
    );

    const [scriptMetadata, setScriptMetadata] = useState<{
        script: any;
        sigList: string[] | null;
    }>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    //To deprecate below
    const [empowerDisplayName, setEmpowerDisplayName] = useState<string>();
    const [hallandaleDisplayName, setHallandaleDisplayName] =
        useState<string>();
    //To depcreatae above

    const [confirmationMessage, setConfirmationMessage] =
        useState<JSX.Element>();
    const [scriptSent, setScriptSent] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const generateRevivePayload = async () => {
            if (orderData.product_href === PRODUCT_HREF.B12_INJECTION) {
                //Generate a revive script for the b12 injection here
                const revive_generated_payload = await generateReviveScript(
                    patientData.id,
                    orderData.id,
                    {
                        product_href: orderData.product_href,
                        variant_index: variant_index,
                    }
                );

                if (revive_generated_payload.error) {
                    console.error('Error in revive b12 script generation');
                    return;
                }

                const reviveSigList: any[] = [];
                setScriptMetadata({
                    script: revive_generated_payload.script_json,
                    sigList: reviveSigList,
                });

                return;
            }
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
                        variant_index ??
                            orderData.variant_index ??
                            orderData.order.variant_index
                    );

                    console.log(
                        'Empower Script Generated Log: ',
                        empowerScriptData.script
                    );

                    setEmpowerDisplayName(empowerScriptData.displayName);
                    setScriptMetadata({
                        script: empowerScriptData.script,
                        sigList: empowerScriptData.sigs,
                    });

                    break;
                case 'tmc':
                    const allergyDataT = allergy_data?.data;

                    const tmcScriptData = generateTMCScript(
                        orderData,
                        patientData,
                        allergyDataT && allergyDataT.length > 0
                            ? allergyDataT[0].allergies
                            : 'nkda'
                    );

                    setScriptMetadata({
                        script: tmcScriptData,
                        sigList: null,
                    });

                    console.log('TMC Script LOGGING: ', tmcScriptData);

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

                    console.log(
                        'Hallandale Script Generated Log for variant index:  ',
                        variant_index,
                        ' ',
                        {
                            order: hallandaleScriptData?.script,
                            message: {
                                id: orderData.id,
                                sentTime: new Date().toISOString(),
                            },
                        }
                    );

                    setHallandaleDisplayName(hallandaleScriptData?.displayName);
                    break;

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
    }, [bmiData, orderData]);

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

    const handleEmpowerScript = async () => {
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
            ScriptSource.ApproveScriptDialog
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
                provider_id: provider_id, //will adding this cause any issues with customer.io?
            });

            // await handleOrderStatusTagChange();
        } else if (resp.result === 'failure') {
            console.error(
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

        mutateIntakeData();
        setScriptSent(true);
    };

    const handleTMCScript = async () => {
        if (!scriptMetadata) {
            return;
        }

        const resp = await ProcessTMCScript(
            orderData.id,
            orderData.order_status,
            orderData.assigned_provider,
            orderData.customer_uid,
            scriptMetadata.script
        );

        await saveScriptForFutureUse(
            scriptMetadata?.script,
            orderData.id,
            'tmc',
            ScriptSource.ApproveScriptDialog
        );

        // await handleOrderStatusTagChange();

        if (resp.result === 'success') {
            setIsSubmitting(false);
            // await handleOrderStatusTagChange();

            setConfirmationMessage(
                <BioType className='itd-body text-green-500'>
                    🚀 Processed successfully 🚀
                </BioType>
            );
        } else {
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
    };

    const handleHallandaleScript = async () => {
        const allergyDataH = allergy_data?.data;

        if (!scriptMetadata) {
            return;
        }

        const orderWithPdf: HallandaleOrderObject = {
            ...scriptMetadata.script,
            document: { pdfBase64: '' },
        };

        const body_json: HallandaleScriptJSON = {
            message: { id: orderData.id, sentTime: new Date().toISOString() },
            order: orderWithPdf,
        };

        if (orderType === OrderType.RenewalOrder) {
            const orderStatusDetails = getOrderStatusDetails(
                orderData.order_status
            );

            if (!orderStatusDetails.isPaid) {
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id!,
                    {
                        prescription_json: body_json,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    }
                );
                setIsSubmitting(false);
                setConfirmationMessage(
                    <BioType className='itd-body text-green-500'>
                        🚀 Processed successfully 🚀
                    </BioType>
                );
                await createUserStatusTagWAction(
                    StatusTag.Resolved,
                    orderData.renewal_order_id!,
                    StatusTagAction.REPLACE,
                    orderData.customer_uuid!,
                    'Resolved',
                    provider_id,
                    [StatusTag.Resolved]
                );

                mutateIntakeData();
                return;
            }
        }

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
            scriptMetadata?.script,
            orderData.id,
            'hallandale',
            ScriptSource.ApproveScriptDialog
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

            //TODO Nathan undo this change
            // await triggerEvent(patientData.id, PRESCRIPTION_APPROVED, {
            //     order_id: orderData.id,
            //     product_name: orderData.product_href,
            // });

            // await handleOrderStatusTagChange();
        } else {
            console.error(
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

        // if (setCanProceed) {
        //     setCanProceed(true);
        // }

        mutateIntakeData();
        setScriptSent(true);
    };

    async function handleBoothwynScript() {
        if (!scriptMetadata) {
            return;
        }

        if (orderType === OrderType.RenewalOrder) {
            const orderStatusDetails = getOrderStatusDetails(
                orderData.order_status
            );

            if (!orderStatusDetails.isPaid) {
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id!,
                    {
                        prescription_json: scriptMetadata.script,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    }
                );
                setIsSubmitting(false);
                setConfirmationMessage(
                    <BioType className='itd-body text-green-500'>
                        🚀 Processed successfully 🚀
                    </BioType>
                );
                await createUserStatusTagWAction(
                    StatusTag.Resolved,
                    orderData.renewal_order_id!,
                    StatusTagAction.REPLACE,
                    orderData.customer_uuid!,
                    'Resolved',
                    provider_id,
                    [StatusTag.Resolved]
                );

                mutateIntakeData();
                return;
            }
        }

        const body_json: BoothwynScriptJSON = scriptMetadata.script;

        const result = await sendBoothwynScript(
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
            scriptMetadata?.script,
            orderData.id,
            'boothwyn',
            ScriptSource.ApproveScriptDialog
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
            console.error(
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

        // if (setCanProceed) {
        //     setCanProceed(true);
        // }

        mutateIntakeData();
        setScriptSent(true);
    }

    async function handleReviveScript() {
        if (!scriptMetadata) {
            return;
        }

        if (orderType === OrderType.RenewalOrder) {
            const orderStatusDetails = getOrderStatusDetails(
                orderData.order_status
            );

            if (!orderStatusDetails.isPaid) {
                await updateRenewalOrderByRenewalOrderId(
                    orderData.renewal_order_id!,
                    {
                        prescription_json: scriptMetadata.script,
                        order_status:
                            RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    }
                );
                setIsSubmitting(false);
                setConfirmationMessage(
                    <BioType className='itd-body text-green-500'>
                        🚀 Processed successfully 🚀
                    </BioType>
                );
                await createUserStatusTagWAction(
                    StatusTag.Resolved,
                    orderData.renewal_order_id!,
                    StatusTagAction.REPLACE,
                    orderData.customer_uuid!,
                    'Resolved',
                    provider_id,
                    [StatusTag.Resolved]
                );

                mutateIntakeData();
                return;
            }
        }

        const body_json: ReviveScriptJSON = scriptMetadata.script;

        const result = await sendReviveScript(
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
            scriptMetadata?.script,
            orderData.id,
            'revive',
            ScriptSource.ApproveScriptDialog
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
            console.error(
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

        // if (setCanProceed) {
        //     setCanProceed(true);
        // }

        mutateIntakeData();
        setScriptSent(true);
    }

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
                await updateExistingOrderPharmacyAndVariantIndexUsingId(
                    orderData.id,
                    'empower',
                    variant_index
                );

                // For zealthy test
                if (orderData.id != '9618') {
                    await handleEmpowerScript();
                }

                const htmlMacroTextEmpower =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData,
                        provider_id
                    );
                if (htmlMacroTextEmpower) {
                    setMessageContent(htmlMacroTextEmpower);
                }
                break;

            case 'tmc':
                await updateExistingOrderPharmacyUsingId(orderData.id, 'tmc');
                await handleTMCScript();
                const htmlMacroTextTMC = await getProviderMacroHTMLPrePopulated(
                    orderData.product_href,
                    variant_index,
                    patientData,
                    provider_id
                );
                if (htmlMacroTextTMC) {
                    setMessageContent(htmlMacroTextTMC);
                }
                break;

            case 'hallandale':
                await updateExistingOrderPharmacyAndVariantIndexUsingId(
                    orderData.id,
                    'hallandale',
                    variant_index
                );

                await handleHallandaleScript();

                const htmlMacroTextHallandale =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData,
                        provider_id
                    );
                if (htmlMacroTextHallandale) {
                    setMessageContent(htmlMacroTextHallandale);
                }
                break;

            case 'boothwyn':
                await updateExistingOrderPharmacyAndVariantIndexUsingId(
                    orderData.id,
                    'boothwyn',
                    variant_index
                );

                await handleBoothwynScript();

                const htmlMacroTextBoothwyn =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData,
                        provider_id
                    );
                if (htmlMacroTextBoothwyn) {
                    setMessageContent(htmlMacroTextBoothwyn);
                }
                break;

            case 'revive':
                await updateExistingOrderPharmacyAndVariantIndexUsingId(
                    orderData.id,
                    'revive',
                    variant_index
                );

                await handleReviveScript();

                const htmlMacroTextRevive =
                    await getProviderMacroHTMLPrePopulated(
                        orderData.product_href,
                        variant_index,
                        patientData,
                        provider_id
                    );
                if (htmlMacroTextRevive) {
                    setMessageContent(htmlMacroTextRevive);
                }
                break;
        }

        setResponseRequired(false);
        setIsSubmitting(false);
        onClose();
    };

    // const sendToCoordinatorForDosingChange = async (
    //     dosingOption: DosingChangeOption
    // ) => {
    //     // addProviderToPatientRelationship(patientData.id, provider_id);
    //     // assignProviderToOrderUsingOrderId(Number(orderData.id), provider_id);

    //     console.log(
    //         'Logging the values pumped into getDosageChangeMacro: ',
    //         dosingOption
    //     );

    //     //TODO: Nathan - you need to set this later.
    //     const htmlMacroTextDosageChange = await getDosageChangeMacro(
    //         dosingOption.product_href,
    //         dosingOption.index,
    //         patientData
    //     );
    //     if (htmlMacroTextDosageChange) {
    //         setMessageContent(htmlMacroTextDosageChange);
    //     }
    //     await createUserStatusTagWAction(
    //         StatusTag.LeadCoordinator,
    //         orderType === OrderType.Order
    //             ? orderData.id
    //             : orderData.renewal_order_id,
    //         StatusTagAction.REPLACE,
    //         patientData.id,
    //         `Please request a dosing change to patient for the following dose: ${
    //             dosingOption.dosing
    //         } to receive ${
    //             orderType === OrderType.Order
    //                 ? dosingOption.product_description.monthly
    //                 : dosingOption.product_description.bundle
    //         }`,
    //         provider_id,
    //         ['LeadCoordinator']
    //     );

    //     mutate(`${patientData.id}-status-Tags`);
    //     onClose();
    // };

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
            case 'tmc':
                return (
                    <div>
                        <TmcConfirmationView
                            script={scriptMetadata.script}
                            setScriptMetadata={setScriptMetadata}
                            product_href={orderData.product_href}
                            orderData={orderData}
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
                console.log('revive script metadata: ', scriptMetadata);
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

    const renderMenuTabContent = (tabIndex: number) => {
        switch (tabIndex) {
            case 0:
                return (
                    <>
                        <DialogContent className='flex flex-col justify-center gap-2'>
                            <BioType className='it-h1 text-primary'>
                                Approve and prescribe the following?
                            </BioType>
                            {renderConfirmationView()}
                            {confirmationMessage}

                            <div className='flex flex-row justify-end gap-2'>
                                {!scriptSent ? (
                                    <>
                                        <Button
                                            onClick={sendScript}
                                            variant='contained'
                                            color='primary'
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress
                                                    sx={{ color: '#FFFFFF' }}
                                                    size={22}
                                                />
                                            ) : (
                                                'PRESCRIBE'
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
                            </div>
                        </DialogContent>
                    </>
                );

            case 1:
                return (
                    <>
                        <DialogContent className='flex flex-col justify-center gap-2'>
                            <BioType className='it-h1 text-primary'>
                                Change Dosage
                            </BioType>
                            <ProviderDosageChangeComponent
                                productHref={
                                    orderData.product_href as PRODUCT_HREF
                                }
                                patientData={patientData}
                                orderData={orderData}
                                setMessageContent={setMessageContent}
                                provider_id={provider_id}
                                onClose={onClose}
                                setPrescribedInSession={setPrescribedInSession}
                            />
                        </DialogContent>
                    </>
                );
        }
    };

    return (
        <Dialog
            open={open}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                sx={{ padding: '8px' }} // Add padding here
            >
                <Tab label='Prescribe' />
                {[PRODUCT_HREF.SEMAGLUTIDE, PRODUCT_HREF.TIRZEPATIDE].includes(
                    orderData.product_href as PRODUCT_HREF
                ) && !orderData?.renewal_order_id  && <Tab label='Adjust Dosage' />}
            </Tabs>
            <Box>{renderMenuTabContent(tabIndex)}</Box>
        </Dialog>
    );
}
