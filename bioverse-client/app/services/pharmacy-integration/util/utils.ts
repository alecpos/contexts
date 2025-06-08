'use server';

import {
    getStripeSubscription,
    uncancelStripeSubscription,
    updateStripeProduct,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { generateEmpowerScript } from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';
import { getProviderMacroHTMLPrePopulatedForDosageSelection } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { Status } from '@/app/types/global/global-enumerators';
import { MessagePayload } from '@/app/types/messages/messages-types';
import { OrderType } from '@/app/types/orders/order-types';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { getPriceIdForProductVariant } from '@/app/utils/database/controller/products/products';

import {
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    getPrescriptionSubscription,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import { postNewMessage } from '@/app/utils/database/controller/messaging/messages/messages';
import { getThreadIDByPatientIDAndProduct } from '@/app/utils/database/controller/messaging/threads/threads';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { updateRenewalOrderByRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { triggerEvent } from '../../customerio/customerioApiFactory';
import { TREATMENT_CONFIRMED } from '../../customerio/event_names';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { providerInfoMeylinC } from '../provider-static-information';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import { clearDosageSelectionActionItems } from '@/app/utils/database/controller/action-items/action-items-actions';
import { updateOrderAssignedDosage } from '@/app/utils/database/controller/orders/orders-api';
import { generateAndReturnHallandaleScript } from '../hallandale/hallandale-script-api';

import { createOrderDataAudit } from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import {
    OrderDataAuditDescription,
    OrderDataAuditActions,
} from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
import { generateBoothwynScriptWithData } from '@/app/utils/functions/prescription-scripts/boothwyn-script-generator';
import { generateReviveScript } from '@/app/utils/functions/prescription-scripts/revive-script-generator';
import { SubscriptionStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscription_enums';
import { wipeStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';

/**
 * onAlmostDoneScreenSubmit
 *
 * Executed after the patient has selected a dosage in their dosage-selection refill flow
 * Uses the PVC to determine the pharmacy and variant index of their next shipment based on the variant index selected by the patient in dosage selection
 * Then generates a new script and saves that and the new  variant index to their renewal order. It finishes by sending an auto macro to the patient
 *
 * along the way it will call:
 *  - updateOrderAssignedDosage
 *  - updateRenewalOrderByRenewalOrderId
 *  - updateStripeProduct
 *  - updatePrescriptionSubscription
 *  - createOrderDataAudit
 *
 * @param renewalOrder
 * @param selectedVariantIndex
 * @param patientData
 * @param priceData
 * @param source
 */

export async function onAlmostDoneScreenSubmit(
    renewalOrder: DBOrderData,
    selectedVariantIndex: number,
    patientData: DBPatientData,
    priceData: Partial<ProductVariantRecord>,
    source: 'patient' | 'coordinator' | 'automatic-CA-patient-monthly-DS' //'automatic dosage selection' for california patients who only get 1 monthly variant
) {
    await logPatientAction(
        patientData.id,
        PatientActionTask.DOSAGE_SELECTION_REQUESTED,
        {
            selectedVariantIndex: Number(selectedVariantIndex),
            cadence: priceData.cadence,
            product_href: renewalOrder.product_href,
        }
    );
    await triggerEvent(patientData.id, TREATMENT_CONFIRMED);

    let prescriptionStatusFlags: SubscriptionStatusFlags[] = [];

    if (source === 'patient') {
        const subscription = await getPrescriptionSubscription(
            Number(renewalOrder.subscription_id)
        );

        if (!subscription) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id!,
                renewalOrder.customer_uuid,
                'Failure dosage selection'
            );
            return;
        }
        prescriptionStatusFlags = subscription?.status_flags;

        const stripeSub = await getStripeSubscription(
            subscription.stripe_subscription_id
        );

        try {
            if (stripeSub.cancel_at_period_end) {
                await uncancelStripeSubscription(
                    subscription.stripe_subscription_id
                );
            }
        } catch (error) {
            console.error('Error un-cancelling stripe subscription', error);
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id!,
                renewalOrder.customer_uuid,
                'Error un-cancelling stripe subscription'
            );
            return;
        }
    }

    let scriptData;

    const pvc = new ProductVariantController(
        renewalOrder.product_href as PRODUCT_HREF,
        selectedVariantIndex,
        patientData.state as USStates
    );
    const pvc_result = pvc.getConvertedVariantIndex();

    const new_pharmacy = pvc_result.pharmacy;
    const new_variant_index = pvc_result.variant_index ?? selectedVariantIndex;

    // patient data, orderData, orderType, bmiData, variantIndex
    if (new_pharmacy === PHARMACY.EMPOWER) {
        const bmiData = await getQuestionAnswersForBMI(patientData.id);

        const empowerScript = generateEmpowerScript(
            patientData,
            renewalOrder,
            OrderType.RenewalOrder,
            bmiData ?? {
                height_feet: 0,
                height_inches: 0,
                weight_lbs: 0,
                bmi: 0,
            },
            new_variant_index
        );
        scriptData = empowerScript.script;
    } else if (new_pharmacy === PHARMACY.HALLANDALE) {
        // patientData, orderData, orderType, variantIndex
        const hallandaleScript = await generateAndReturnHallandaleScript(
            renewalOrder,
            patientData,
            new_variant_index
        );

        if (!hallandaleScript) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id || renewalOrder.subscription_id,
                patientData.id,
                'Could not load script in for user - almost done screen'
            );
        } else {
            scriptData = hallandaleScript;
        }
    } else if (new_pharmacy === PHARMACY.BOOTHWYN) {
        const boothwynScript = generateBoothwynScriptWithData(
            patientData,
            renewalOrder,
            {
                product_href: renewalOrder.product_href,
                variant_index: new_variant_index,
            }
        );

        if (!boothwynScript) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id || renewalOrder.subscription_id,
                patientData.id,
                'Could not load Boothwyn script in for user - almost done screen'
            );
        } else {
            scriptData = boothwynScript;
        }
    } else if (new_pharmacy === PHARMACY.REVIVE) {
        const reviveScript = await generateReviveScript(
            patientData.id,
            renewalOrder.renewal_order_id ?? '',
            {
                product_href: renewalOrder.product_href,
                variant_index: new_variant_index,
            }
        );

        if (!reviveScript) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id || renewalOrder.subscription_id,
                patientData.id,
                'Could not load Revive script in for user - almost done screen'
            );
        } else {
            scriptData = reviveScript;
        }
    } else {
        await forwardOrderToEngineering(
            renewalOrder.renewal_order_id || renewalOrder.subscription_id,
            patientData.id,
            'new_pharmacy not found in onAlmostDoneScreenSubmit'
        );
        return;
    }

    // Update order's variant_index, generate script, order status, subscription_type, stripe product, assigned pharmacy
    if (renewalOrder.renewal_order_id && scriptData) {
        await updateRenewalOrderByRenewalOrderId(
            renewalOrder.renewal_order_id,
            {
                variant_index: Number(new_variant_index),
                order_status:
                    RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                subscription_type: priceData.cadence as SubscriptionCadency,
                assigned_pharmacy: new_pharmacy,
                prescription_json: scriptData,
                dosage_selection_completed: true,
                autoshipped: false, //since the patient is completing the dosage selection form, this renewal order is not autoshipped
            }
        );

        const dosageUpdateString =
            PRODUCT_NAME_HREF_MAP[renewalOrder.product_href] +
            ' ' +
            pvc.getEquivalenceDosage();

        await updateOrderAssignedDosage(
            renewalOrder.renewal_order_id.split('-')[0],
            dosageUpdateString
        );

        const updateStripeProductStatus = await updateStripeProduct(
            Number(renewalOrder.subscription_id),
            Number(new_variant_index),
            prescriptionStatusFlags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_PENDING_DS) //set hasPaid to true if they are in NCI_Hold_Pending_DS state / this will send the script immediately
        );
        const new_price_id = await getPriceIdForProductVariant(
            //new_price_id gets added to the prescription_subscription and the order_data_audit
            renewalOrder.product_href,
            new_variant_index,
            process.env.NEXT_PUBLIC_ENVIRONMENT!
        );

        const newPharmacy = pvc_result.pharmacy;

        // subscription_type, variant_text, price_id, assigned_pharmacy,
        await updatePrescriptionSubscription(
            Number(renewalOrder.subscription_id),
            {
                subscription_type: priceData.cadence,
                variant_text: priceData.variant,
                ...(new_price_id && { price_id: new_price_id }),
                assigned_pharmacy: newPharmacy,
                status_flags: [], //flush the status flags since they are completing dosage selection
            }
        );

        /**
         * @here nathan
         */
        const provider_id =
            renewalOrder.metadata?.dosage_selection_provider ||
            renewalOrder.assigned_provider ||
            providerInfoMeylinC.uuid;

        //Audit the change of stripe data inside database audit.
        await createOrderDataAudit(
            renewalOrder.original_order_id!,
            renewalOrder.renewal_order_id,
            source === 'coordinator' //if the coordinator did it manually we indicate that in the audit.
                ? OrderDataAuditDescription.CoordinatorDosageSelection
                : OrderDataAuditDescription.DosageSelection,
            source === 'coordinator'
                ? OrderDataAuditActions.CoordinatorDosageSelection
                : OrderDataAuditActions.DosageSelection,
            {
                renewalOrder: renewalOrder,
                new_pharmacy: newPharmacy,
                new_price_id: new_price_id,
                variant_text: priceData.variant,
                selectedVariantIndex: new_variant_index,
                dosageUpdateString: dosageUpdateString,
                source: source,
            },
            {
                updateRenewalOrderByRenewalOrderIdPayload: {
                    variant_index: Number(new_variant_index),
                    order_status:
                        RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    subscription_type: priceData.cadence as SubscriptionCadency,
                    assigned_pharmacy: new_pharmacy,
                    prescription_json: scriptData,
                    dosage_selection_completed: true,
                },
                updatePrescriptionSubscriptionPayload: {
                    subsctiption_id: Number(renewalOrder.subscription_id),
                    data: {
                        subscription_type: priceData.cadence,
                        variant_text: priceData.variant,
                        ...(new_price_id && { price_id: new_price_id }),
                        assigned_pharmacy: newPharmacy,
                    },
                },
            }
        );

        const macroHtml =
            await getProviderMacroHTMLPrePopulatedForDosageSelection(
                renewalOrder.product_href,
                Number(new_variant_index),
                patientData,
                provider_id
            );

        const thread_id = await getThreadIDByPatientIDAndProduct(
            patientData.id,
            renewalOrder.product_href
        );

        if (thread_id && macroHtml) {
            const messagePayload: MessagePayload = {
                content: macroHtml,
                sender_id: provider_id,
                thread_id: Number(thread_id),
                contains_phi: true,
                requires_coordinator: false,
                requires_lead: false,
                requires_provider: false,
            };
            await postNewMessage(messagePayload);
        }

        await clearDosageSelectionActionItems(
            patientData.id,
            renewalOrder.product_href as PRODUCT_HREF
        );

        // Forward to engineering if updateStripeProduct fails
        if (updateStripeProductStatus === Status.Error) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                patientData.id,
                `Failed to update stripe product. Could not find subscription or renewal order based on subscription ID in updateStripeProduct. Subscription ID: ${
                    renewalOrder?.subscription_id || 'Not Found'
                }`
            );
        } else {
            //wipe the status flags since they have successfully updated their stripe product/subscription
            await wipeStatusFlags(Number(renewalOrder.subscription_id));
        }
    } else {
        if (!scriptData) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id || renewalOrder.subscription_id,
                patientData.id,
                'Failed to generate script after dosage selection'
            );
            return;
        }

        await forwardOrderToEngineering(
            renewalOrder.renewal_order_id || renewalOrder.subscription_id,
            patientData.id,
            'Failed to update order after dosage selection'
        );
    }
}

/**
 * Note by Nathan:
 * This is deprecataed by the Product Variant Controller.
 */
// function getDoseConcentrationFromProductVariantPair(
//     productHref: PRODUCT_HREF,
//     variantIndex: number
// ): string {
//     switch (productHref) {
//         case PRODUCT_HREF.SEMAGLUTIDE:
//             switch (variantIndex) {
//                 case 2:
//                     return 'Semaglutide 0.25 mg/week';
//                 case 3:
//                     return 'Semaglutide 0.5 mg/week';
//                 case 4:
//                     return 'Semaglutide 1.25 mg/week';
//                 case 5:
//                     return 'Semaglutide 2.5 mg/week';
//                 case 13:
//                     return 'Semaglutide 0.5 mg/week';
//                 case 14:
//                     return 'Semaglutide 1.25 mg/week';
//                 case 6:
//                     return 'Semaglutide 0.25 mg/week';
//                 case 7:
//                     return 'Semaglutide 1.25 mg/week';
//                 case 8:
//                     return 'Semaglutide 0.5 mg/week';
//                 case 9:
//                     return 'Semaglutide 1.25 mg/week';
//                 case 10:
//                     return 'Semaglutide 2.5 mg/week';
//                 case 11:
//                     return 'Semaglutide 0.5 mg/week';
//                 case 12:
//                     return 'Semaglutide 0.25 mg/week';
//                 default:
//                     return 'Semaglutide Dose Unassigned';
//             }

//         case PRODUCT_HREF.TIRZEPATIDE:
//             switch (variantIndex) {
//                 case 3:
//                     return 'Tirzepatide 2.5 mg/week';
//                 case 4:
//                     return 'Tirzepatide 5 mg/week';
//                 case 5:
//                     return 'Tirzepatide 7.5 mg/week';
//                 case 10:
//                     return 'Tirzepatide 10 mg/week';
//                 case 11:
//                     return 'Tirzepatide 12.5 mg/week';
//                 case 14:
//                     return 'Tirzepatide 2.5 mg/week';
//                 case 15:
//                     return 'Tirzepatide 10 mg/week';
//                 case 23:
//                     return 'Tirzepatide 12.5 mg/week';
//                 case 6:
//                     return 'Tirzepatide 2.5 mg/week';
//                 case 7:
//                     return 'Tirzepatide 2.5 mg/week';
//                 case 8:
//                     return 'Tirzepatide 5 mg/week';
//                 case 9:
//                     return 'Tirzepatide 7.5 mg/week';
//                 case 12:
//                     return 'Tirzepatide 10 mg/week';
//                 case 13:
//                     return 'Tirzepatide 12.5 mg/week';
//                 case 16:
//                     return 'Tirzepatide 2.5 mg/week';
//                 case 17:
//                     return 'Tirzepatide 5 mg/week';
//                 case 18:
//                     return 'Tirzepatide 5 mg/week';
//                 case 19:
//                     return 'Tirzepatide 5 mg/week';
//                 case 20:
//                     return 'Tirzepatide 7.5 mg/week';
//                 case 21:
//                     return 'Tirzepatide 10 mg/week';
//                 case 22:
//                     return 'Tirzepatide 12.5 mg/week';
//                 default:
//                     return 'Tirzepatide Dose Unassigned';
//             }
//     }

//     return 'Dose Assignment Issue during Selection (Alert Engineering)';
// }
