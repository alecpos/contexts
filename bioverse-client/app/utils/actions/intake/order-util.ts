'use server';
import {
    BaseOrderInterface,
    OrderStatus,
    OrderType,
} from '@/app/types/orders/order-types';
import {
    getPrescriptionSubscription,
    getSubscriptionDetails,
} from '../subscriptions/subscription-actions';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { PillStatus } from '@/app/types/provider-portal/provider-portal-types';
import {
    isActiveSubscription,
    getSubscriptionStatusFlagsFromOriginalOrderId,
} from '../../database/controller/prescription_subscriptions/prescription_subscriptions';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';
import { updateOrder } from '../../database/controller/orders/orders-api';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { getPatientInformationById } from '../provider/patient-overview';
import { getQuestionAnswersForBMI } from '../../database/controller/clinical_notes/clinical_notes_v2';
import { generateEmpowerScript } from '../../functions/prescription-scripts/empower-approval-script-generator';
import processEmpowerScript from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { Status } from '@/app/types/global/global-enumerators';
import { forwardOrderToEngineering } from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { generateHallandaleScript } from '../../functions/prescription-scripts/hallandale-approval-script-generator';
import { sendHallendaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { generateBoothwynScriptWithData } from '../../functions/prescription-scripts/boothwyn-script-generator';
import { sendBoothwynScript } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-script-api';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { ProductVariantRecord } from '../../database/controller/product_variants/product_variants';
import { logPatientAction } from '../../database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '../../database/controller/patient_action_history/patient-action-history-types';
import { getProviderMacroHTMLPrePopulated } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { MessagePayload } from '@/app/types/messages/messages-types';
import { postNewMessage } from '../../database/controller/messaging/messages/messages';
import { getThreadIDByPatientIDAndProduct } from '../../database/controller/messaging/threads/threads';
import { generateReviveScript } from '../../functions/prescription-scripts/revive-script-generator';
import { sendReviveScript } from '@/app/services/pharmacy-integration/revive/revive-send-script-api';

export async function parseStateToNumeric(order_state: string) {
    switch (order_state) {
        case 'Incomplete':
            return 0;
        case 'Unapproved-NoCard':
            return 1;
        case 'Unapproved-CardDown':
            return 5;
        case 'Approved-NoCard':
            return 2;
        case 'Approved-CardDown':
            return 5;
        case 'Approved-CardDown':
            return 5;
        case 'Canceled':
            return 5;
        default:
            return 5;
    }
}

export async function getOrderType(order_id: string | number) {
    if (typeof order_id === 'number') {
        return OrderType.Order;
    } else if (typeof order_id === 'string') {
        if (order_id.includes('-')) {
            return OrderType.RenewalOrder;
        } else {
            return OrderType.Order;
        }
    } else {
        throw new Error(
            'Invalid input type. Please provide a string or a number.'
        );
    }
}

export async function getOrderPillStatus(
    order_id: string,
    orderStatus: string,
    product_href: string
) {
    var res = [];

    const subscriptionStatus = await isActiveSubscription(order_id);

    if (
        subscriptionStatus === 'active' &&
        !WEIGHT_LOSS_PRODUCT_HREF.includes(product_href)
    ) {
        res.push(PillStatus.ActiveSubscription);
    } else if (subscriptionStatus === 'canceled') {
        res.push(PillStatus.Canceled);
    }

    const isIncomplete = await isOrderIncomplete(orderStatus);

    if (isIncomplete) {
        res.push(PillStatus.Incomplete);
    }

    const orderNeedsReview = await shouldOrderNeedReview(orderStatus);

    if (orderNeedsReview) {
        res.push(PillStatus.NeedsReview);
    }

    const subscriptionStatusFlags =
        await getSubscriptionStatusFlagsFromOriginalOrderId(order_id);

    if (
        subscriptionStatusFlags &&
        subscriptionStatusFlags.includes(PillStatus.NoCheckInHold)
    ) {
        res.push(PillStatus.NoCheckInHold);
    }

    // TODO: Scheduled Cancelations
    return res;
}

export async function isOrderIncomplete(orderStatus: string) {
    switch (orderStatus) {
        case OrderStatus.Incomplete:
        case RenewalOrderStatus.Incomplete:
            return true;
        default:
            return false;
    }
}

export async function shouldOrderNeedReview(orderStatus: string) {
    switch (orderStatus) {
        case OrderStatus.UnapprovedCardDown:
        case OrderStatus.PaymentCompleted:
        case OrderStatus.ApprovedCardDown:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
            return true;
        default:
            return false;
    }
}

export async function processDosageSelectionFirstTimeRequest(
    order: BaseOrderInterface,
    priceData: Partial<ProductVariantRecord>
) {
    const pharmacy = priceData.pharmacy;

    await updateOrder(order.id, {
        variant_index: priceData?.variant_index,
        assigned_pharmacy: pharmacy,
        subscription_type: priceData?.cadence,
    });

    await logPatientAction(
        order.customer_uid,
        PatientActionTask.FIRST_TIME_DOSAGE_SELECTION_REQUESTED,
        {
            order_id: order.id,
            variant_index: priceData.variant_index,
        }
    );

    await triggerEvent(
        order.customer_uid,
        RudderstackEvent.PRESCRIPTION_APPROVED,
        {
            order_id: order.id,
            product_name: order.product_href,
        }
    );

    await triggerEvent(
        order.customer_uid,
        RudderstackEvent.FIRST_TIME_DOSAGE_SELECTION_COMPLETE
    );

    const { data: patientData } = await getPatientInformationById(
        order.customer_uid
    );

    await sendAutoMacro(order, priceData, patientData as DBPatientData);

    try {
        let result;

        switch (pharmacy) {
            case PHARMACY.EMPOWER:
                result = await processEmpowerOrder(
                    order,
                    priceData,
                    patientData as DBPatientData
                );
                break;
            case PHARMACY.HALLANDALE:
                result = await processHallandaleOrder(
                    order,
                    priceData,
                    patientData as DBPatientData
                );
                break;
            case PHARMACY.BOOTHWYN:
                result = await processBoothwynOrder(
                    order,
                    priceData,
                    patientData as DBPatientData
                );
                break;
            case PHARMACY.REVIVE:
                result = await processReviveOrder(
                    order,
                    priceData,
                    patientData as DBPatientData
                );
                break;
            default:
                throw new Error('Unknown pharmacy');
        }
    } catch (error: any) {
        await forwardOrderToEngineering(
            String(order.id),
            order.customer_uid,
            error.message
        );
    }
}

export async function processEmpowerOrder(
    order: BaseOrderInterface,
    priceData: Partial<ProductVariantRecord>,
    patientData: DBPatientData
) {
    const bmiData = await getQuestionAnswersForBMI(order.customer_uid);

    const empowerScript = generateEmpowerScript(
        patientData as DBPatientData,
        order as unknown as DBOrderData,
        OrderType.Order,
        bmiData,
        priceData.variant_index
    );

    const resp = await processEmpowerScript(
        String(order.id),
        order.order_status,
        order.assigned_provider,
        empowerScript.script,
        OrderType.Order,
        String(order.subscription_id) ?? '',
        order,
        priceData.variant_index!
    );

    if (resp.result === Status.Success) {
        return Status.Success;
    }

    throw new Error(
        'Could not send empower script - first time dosage selection'
    );
}

export async function processHallandaleOrder(
    order: BaseOrderInterface,
    priceData: Partial<ProductVariantRecord>,
    patientData: DBPatientData
) {
    const addressData: AddressInterface = {
        address_line1: order.address_line1,
        address_line2: order.address_line2,
        city: order.city,
        state: order.state,
        zip: order.zip,
    };

    const hallandaleScript = generateHallandaleScript(
        patientData as DBPatientData,
        order as unknown as DBOrderData,
        addressData,
        OrderType.Order,
        priceData.variant_index!
    );

    if (!hallandaleScript) {
        throw new Error(
            'Could not generate hallandale script - first time dosage selection'
        );
    }

    const orderWithPdf: HallandaleOrderObject = {
        ...hallandaleScript.script,
        document: { pdfBase64: '' },
    };

    const body_json: HallandaleScriptJSON = {
        message: { id: order.id, sentTime: new Date().toISOString() },
        order: orderWithPdf,
    };

    const result = await sendHallendaleScript(
        body_json,
        String(order.id),
        order.assigned_provider,
        order.order_status,
        OrderType.Order,
        '',
        '',
        priceData.variant_index!
    );

    if (result.result !== Status.Success) {
        throw new Error(
            'Could not send hallandale script - first time dosage selection'
        );
    }
    return Status.Success;
}

export async function processReviveOrder(
    order: BaseOrderInterface,
    priceData: Partial<ProductVariantRecord>,
    patientData: DBPatientData
) {
    const reviveScript = await generateReviveScript(
        patientData.id,
        String(order.id),
        {
            product_href: order.product_href,
            variant_index: priceData.variant_index!,
        }
    );

    if (!reviveScript.script_json) {
        throw new Error(
            'Could not generate revive script - first time dosage selection'
        );
    }

    const result = await sendReviveScript(
        reviveScript.script_json,
        String(order.id),
        order.assigned_provider,
        order.order_status,
        OrderType.Order,
        '',
        '',
        priceData.variant_index
    );

    if (result.result === Status.Success) {
        return Status.Success;
    }

    console.log("Revive FTDS debug log: ", order?.id, priceData?.variant_index || "no variant index", order?.customer_uid || "no customer uid", order?.order_status, order?.assigned_provider, result?.reason || "no result reason")
    throw new Error(
        'Could not send revive script - first time dosage selection'
    );
}

export async function processBoothwynOrder(
    order: BaseOrderInterface,
    priceData: Partial<ProductVariantRecord>,
    patientData: DBPatientData
) {
    const boothwynScript = generateBoothwynScriptWithData(
        patientData as DBPatientData,
        order as unknown as DBOrderData,
        {
            product_href: order.product_href,
            variant_index: priceData.variant_index!,
        }
    );

    if (!boothwynScript.script_json) {
        throw new Error(
            'Could not generate boothwyn script - first time dosage selection'
        );
    }

    const result = await sendBoothwynScript(
        boothwynScript.script_json,
        String(order.id),
        order.assigned_provider,
        order.order_status,
        OrderType.Order,
        '',
        '',
        priceData.variant_index
    );

    if (result.result === Status.Success) {
        return Status.Success;
    }

    throw new Error(
        'Could not send boothwyn script - first time dosage selection'
    );
}

export async function sendAutoMacro(
    order: BaseOrderInterface,
    priceData: Partial<ProductVariantRecord>,
    patientData: DBPatientData
) {
    const thread_id = await getThreadIDByPatientIDAndProduct(
        order.customer_uid,
        order.product_href
    );

    if (!thread_id) {
        throw new Error(
            'Could not send auto macro - first time dosage selection'
        );
    }

    const htmlMacroText = await getProviderMacroHTMLPrePopulated(
        order.product_href,
        priceData.variant_index!,
        patientData as DBPatientData,
        order.assigned_provider
    );

    const messagePayload: MessagePayload = {
        content: htmlMacroText,
        sender_id: order.assigned_provider, // hard coded customer support
        thread_id: Number(thread_id),
        contains_phi: false,
        requires_coordinator: false,
        requires_lead: false,
        requires_provider: false,
    };

    await postNewMessage(messagePayload);
}
