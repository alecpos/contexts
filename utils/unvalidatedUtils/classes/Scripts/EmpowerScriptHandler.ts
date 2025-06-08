import { processAutomaticEmpowerScript } from '@/app/services/pharmacy-integration/empower/provider-script-feedback';
import { Status } from '@/app/types/global/global-enumerators';
import { BaseScriptHandler } from './BaseScriptHandler';
import {
    generateEmpowerScript,
    generateEmpowerScriptAsync,
} from '@/app/utils/functions/prescription-scripts/empower-approval-script-generator';
import { OrderType } from '@/app/types/orders/order-types';
import { getQuestionAnswersForBMI } from '../../database/controller/clinical_notes/clinical_notes_v2';
import { updateRenewalOrderByRenewalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { forwardOrderToEngineering } from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { updatePrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';
import { getPriceDataRecordWithVariant } from '../../database/controller/product_variants/product_variants';

export class EmpowerScriptHandler extends BaseScriptHandler {
    async sendScript(): Promise<Status> {
        await this.loadPrescriptionData();

        const res = await processAutomaticEmpowerScript(
            this.prescriptionData,
            this.renewalOrder.id,
            this.subscription.provider_id,
            this.renewalOrder,
            this.source,
            this.resending
        );

        if (res === Status.Success) {
            return await this.onScriptSendSuccess();
        } else {
            return await this.onScriptSendFailure();
        }
    }

    async generateScript(): Promise<Status> {
        try {
            await this.loadDataForScriptGeneration();

            const bmiData = await getQuestionAnswersForBMI(
                this.renewalOrder.customer_uuid
            );

            if (this.patientData && bmiData && this.scriptOrderData) {
                const scriptData = await generateEmpowerScriptAsync(
                    this.patientData.id,
                    this.scriptOrderData.renewal_order_id!,
                    undefined,
                    this.resending
                );

                const priceData = await getPriceDataRecordWithVariant(
                    this.renewalOrder.product_href,
                    this.renewalOrder.variant_index
                );

                if (!priceData || !priceData.cadence) {
                    await forwardOrderToEngineering(
                        this.renewalOrder.renewal_order_id,
                        this.renewalOrder.customer_uuid,
                        'Failed to get pricedata in hallandale script handler'
                    );
                }

                const new_subscription_cadency =
                    priceData && priceData.cadence
                        ? (priceData.cadence as SubscriptionCadency)
                        : SubscriptionCadency.Monthly;

                await updateRenewalOrderByRenewalOrderId(
                    this.renewalOrder.renewal_order_id,
                    {
                        prescription_json: scriptData.script,
                        subscription_type: new_subscription_cadency,
                        assigned_pharmacy: PHARMACY.EMPOWER,
                        variant_index: this.renewalOrder.variant_index,
                    }
                );

                if (
                    this.renewalOrder.subscription_type !==
                    new_subscription_cadency
                ) {
                    await updatePrescriptionSubscription(this.subscription.id, {
                        subscription_type:
                            priceData && priceData.cadence
                                ? (priceData.cadence as SubscriptionCadency)
                                : SubscriptionCadency.Monthly,
                    });
                    this.renewalOrder.subscription_type =
                        new_subscription_cadency;
                    this.subscription.subscription_type =
                        new_subscription_cadency;
                }

                this.renewalOrder.prescription_json = scriptData.script;
            }
        } catch (error) {
            console.error('Error converting variant index', error);
        } finally {
            return Status.Success;
        }
    }
}
