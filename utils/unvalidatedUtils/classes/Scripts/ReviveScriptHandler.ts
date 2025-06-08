import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { BaseScriptHandler } from './BaseScriptHandler';
import { updateRenewalOrderFromRenewalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { updatePrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';
import { forwardOrderToEngineering } from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { getPriceDataRecordWithVariant } from '../../database/controller/product_variants/product_variants';
import { processAutomaticReviveScript } from '@/app/services/pharmacy-integration/revive/revive-send-script-api';
import { generateReviveScript } from '../../functions/prescription-scripts/revive-script-generator';

export class ReviveScriptHandler extends BaseScriptHandler {
    async sendScript(): Promise<Status> {
        await this.loadPrescriptionData();

        const res = await processAutomaticReviveScript(
            this.prescriptionData,
            String(this.renewalOrder.original_order_id),
            this.renewalOrder.assigned_provider,
            this.renewalOrder.order_status,
            OrderType.RenewalOrder,
            this.source,
            String(this.subscription.id),
            this.renewalOrder.renewal_order_id,
            this.renewalOrder.variant_index,
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

            if (this.patientData && this.scriptOrderData) {
                const { script_json, error } = await generateReviveScript(
                    this.patientData.id,
                    this.renewalOrder.renewal_order_id,
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
                        'Failed to get pricedata in revive script handler'
                    );
                }

                const new_subscription_cadency =
                    priceData && priceData.cadence
                        ? (priceData.cadence as SubscriptionCadency)
                        : SubscriptionCadency.Monthly;

                await updateRenewalOrderFromRenewalOrderId(
                    this.renewalOrder.renewal_order_id,
                    {
                        prescription_json: script_json,
                        subscription_type: new_subscription_cadency,
                        assigned_pharmacy: PHARMACY.REVIVE,
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
                        assigned_pharmacy: this.renewalOrder.assigned_pharmacy,
                    });
                    this.renewalOrder.subscription_type =
                        new_subscription_cadency;
                    this.subscription.subscription_type =
                        new_subscription_cadency;
                }
                this.renewalOrder.prescription_json = script_json;
            }
        } catch (error) {
            console.error(
                'Something went wrong converting variant index for revivescripthandler',
                error
            );
            await forwardOrderToEngineering(
                this.renewalOrder.renewal_order_id,
                this.renewalOrder.customer_uuid,
                'Error in generateScript'
            );
        } finally {
            return Status.Success;
        }
    }
}
