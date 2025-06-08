import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { processAutomaticEmpowerScript } from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    getLastCompleteOrderForOriginalOrderId,
    updateRenewalOrderByRenewalOrderId,
} from '../database/controller/renewal_orders/renewal_orders';
import { updatePrescriptionScript } from '../functions/prescription-scripts/prescription-scripts-utils';
import { saveScriptForFutureUse } from '../database/controller/prescription_script_audit/prescription_script_audit';
import { Status } from '@/app/types/global/global-enumerators';
import { forwardOrderToEngineering } from '../database/controller/patient-status-tags/patient-status-tags-api';
import { StatusTagNotes } from '@/app/types/status-tags/status-types';
import { processAutomaticHallandaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { fetchOrderData } from '../database/controller/orders/orders-api';
import { getScriptForVariantIndex } from '../functions/pharmacy-helpers/bundle-to-single-vial-converter';
import { getPatientInformationById } from '../actions/provider/patient-overview';

export class RenewalOrderScriptHandler {
    renewalOrder: RenewalOrder;
    subscription: PrescriptionSubscription;
    prescriptionData: any;
    price: string;
    source: ScriptSource;

    constructor(
        renewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription,
        source: ScriptSource,
        price: string = ''
    ) {
        this.renewalOrder = renewalOrder;
        this.subscription = subscription;
        this.source = source;
        this.price = price;
    }

    async loadPrescriptionData() {
        let prescriptionDataRes = null;

        try {
            prescriptionDataRes =
                typeof this.renewalOrder.prescription_json === 'string'
                    ? await JSON.parse(this.renewalOrder.prescription_json)
                    : this.renewalOrder.prescription_json;
        } catch (error) {
            console.error(
                'Error parsing prescription_json:',
                error,
                this.renewalOrder.id,
                this.renewalOrder.customer_uuid
            );
            // Handle the error as needed, for example, set prescriptionData to null or an empty object
            prescriptionDataRes = null;
        }
        this.prescriptionData = prescriptionDataRes;
    }

    // Loads the last script sent into the current order's prescription json
    // Doesn't need to convert bundle -> quarterly as that's handled in invoice_paid already
    async generateGLP1ScriptForLastMonth() {
        try {
            const { orderData: lastCompleteOrder, orderType } =
                await getLastCompleteOrderForOriginalOrderId(
                    this.renewalOrder.original_order_id
                );

            if (!lastCompleteOrder || !lastCompleteOrder.variant_index) {
                console.error(
                    'Could not fetch last complete order',
                    this.renewalOrder
                );
                await forwardOrderToEngineering(
                    this.renewalOrder.renewal_order_id,
                    this.renewalOrder.customer_uuid,
                    'Could not fetch last complete order generating script'
                );
                return;
            }

            const lastVariantIndex = lastCompleteOrder.variant_index;

            const orderId =
                orderType === OrderType.Order
                    ? lastCompleteOrder.id
                    : (lastCompleteOrder as RenewalOrder).renewal_order_id;

            if (!lastVariantIndex) {
                await forwardOrderToEngineering(
                    String(orderId),
                    this.renewalOrder.customer_uuid,
                    'No variant index found for prev order when resending script'
                );
                return;
            }

            const { data: order_data, type } = await fetchOrderData(
                String(orderId)
            );
            const { data: patientData, error: patientDataError } =
                await getPatientInformationById(
                    this.renewalOrder.customer_uuid
                );

            if (!patientData) {
                console.error(
                    'Error getting patient data for generating glp1 script',
                    patientDataError
                );
                return;
            }

            const { script: scriptData, pharmacy } =
                await getScriptForVariantIndex(
                    {
                        ...order_data,
                        renewal_order_id: this.renewalOrder.renewal_order_id,
                    },
                    patientData,
                    orderType,
                    lastVariantIndex
                );

            if (scriptData) {
                const { data, status } =
                    await updateRenewalOrderByRenewalOrderId(
                        this.renewalOrder.renewal_order_id,
                        {
                            prescription_json: scriptData,
                            variant_index: lastVariantIndex,
                            assigned_pharmacy: pharmacy,
                        }
                    );
                if (data) {
                    this.renewalOrder = data;
                }
            } else {
                console.error(
                    'Failed to update script data for renewal order',
                    this.renewalOrder,
                    this.subscription
                );
            }
        } catch (error) {
            console.error(
                'Error generate script for last month',
                error,
                this.renewalOrder
            );
            await forwardOrderToEngineering(
                this.renewalOrder.renewal_order_id,
                this.renewalOrder.customer_uuid,
                'Error generate script for last month'
            );
        }
    }

    async sendGLP1Script() {
        await this.loadPrescriptionData();

        console.log(
            'N checking if sendGLP1Script is invoked for order number ',
            this.renewalOrder.renewal_order_id
        );

        if (!this.prescriptionData) {
            console.error(
                'N logging Check for GLP Renewal Scripts Load Prescription Data Error'
            );

            return;
        }

        switch (this.renewalOrder.assigned_pharmacy) {
            case PHARMACY.EMPOWER:
                await this.sendEmpowerScript();
                break;
            case PHARMACY.HALLANDALE:
                await this.sendHallandaleScript();
                break;
            default:
                console.error(
                    'Error: Unknown pharmacy when sending GLP1 Script',
                    this.renewalOrder
                );
        }
    }

    async sendEmpowerScript() {
        const res = await processAutomaticEmpowerScript(
            this.prescriptionData,
            this.renewalOrder.id,
            this.subscription.provider_id,
            this.renewalOrder,
            this.source
        );

        if (res === Status.Success) {
            await this.onScriptSendSuccess();
        } else {
            await this.onScriptSendFailure();
        }
    }

    async sendHallandaleScript() {
        const res = await processAutomaticHallandaleScript(
            this.prescriptionData,
            String(this.renewalOrder.id),
            this.renewalOrder.assigned_provider,
            this.renewalOrder.order_status,
            OrderType.RenewalOrder,
            this.source,
            String(this.subscription.id),
            this.renewalOrder.renewal_order_id,
            this.renewalOrder.variant_index
        );

        if (res === Status.Success) {
            await this.onScriptSendSuccess();
        } else {
            await this.onScriptSendFailure();
        }
    }

    async onScriptSendSuccess() {
        await updateRenewalOrderByRenewalOrderId(
            this.renewalOrder.renewal_order_id,
            { ...(this.price !== '' && { price: this.price }) }
        );

        switch (this.renewalOrder.assigned_pharmacy) {
            case PHARMACY.EMPOWER:
                const updatedScript = updatePrescriptionScript(
                    this.renewalOrder.prescription_json,
                    this.renewalOrder.renewal_order_id
                );

                await saveScriptForFutureUse(
                    updatedScript,
                    this.renewalOrder.renewal_order_id,
                    this.renewalOrder.assigned_pharmacy,
                    this.source
                );
                break;
            case PHARMACY.HALLANDALE:
                await saveScriptForFutureUse(
                    this.prescriptionData,
                    this.renewalOrder.renewal_order_id,
                    PHARMACY.HALLANDALE,
                    this.source
                );
                break;
            case PHARMACY.REVIVE:
                await saveScriptForFutureUse(
                    this.prescriptionData,
                    this.renewalOrder.renewal_order_id,
                    PHARMACY.REVIVE,
                    this.source
                );
                break;
            case PHARMACY.BOOTHWYN:
                await saveScriptForFutureUse(
                    this.prescriptionData,
                    this.renewalOrder.renewal_order_id,
                    PHARMACY.BOOTHWYN,
                    this.source
                );
                break;
            default:
                console.error('Unknown pharmacy on send script success');
        }
    }

    async onScriptSendFailure() {
        console.error(
            'Script sending failed Forwarding to engineering - pharmacy.ts',
            this.renewalOrder,
            this.renewalOrder.customer_uuid
        );
        await forwardOrderToEngineering(
            this.renewalOrder.renewal_order_id,
            this.renewalOrder.customer_uuid,
            StatusTagNotes.AutomaticSendScriptError
        );
    }
}
