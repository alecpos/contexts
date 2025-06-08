import { processAutomaticHallandaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { BaseScriptHandler } from './BaseScriptHandler';
import {
    generateHallandaleScript,
    generateHallandaleScriptAsync,
} from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { convertHallandaleOrderToBase64 } from '@/app/components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/hallandale/utils/hallandale-base64-pdf';
import { updateRenewalOrderFromRenewalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { updatePrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';
import { forwardOrderToEngineering } from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { auditHallandaleOrder } from '@/app/(testing_and_development)/olivier-dev/utils';
import { getPriceDataRecordWithVariant } from '../../database/controller/product_variants/product_variants';

export class HallandaleScriptHandler extends BaseScriptHandler {
    async sendScript(): Promise<Status> {
        await this.loadPrescriptionData();

        const res = await processAutomaticHallandaleScript(
            this.prescriptionData,
            String(this.renewalOrder.id),
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

            if (this.patientData && this.scriptOrderData && this.allergyData) {
                const addressData: AddressInterface = {
                    address_line1: this.renewalOrder.address_line1,
                    address_line2: this.renewalOrder.address_line2,
                    city: this.renewalOrder.city,
                    state: this.renewalOrder.state,
                    zip: this.renewalOrder.zip,
                };

                const scriptMetadata = await generateHallandaleScriptAsync(
                    this.patientData.id,
                    this.scriptOrderData.renewal_order_id!,
                    undefined,
                    this.resending
                );

                if (scriptMetadata) {
                    const base64pdf = convertHallandaleOrderToBase64(
                        scriptMetadata.script,
                        this.allergyData && this.allergyData.length > 0
                            ? this.allergyData[0].allergies
                            : 'nkda'
                    );

                    const orderWithPdf: HallandaleOrderObject = {
                        ...scriptMetadata.script,
                        document: { pdfBase64: base64pdf },
                    };

                    const body_json: HallandaleScriptJSON = {
                        message: {
                            id: this.scriptOrderData.id,
                            sentTime: new Date().toISOString(),
                        },
                        order: orderWithPdf,
                    };

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

                    await updateRenewalOrderFromRenewalOrderId(
                        this.renewalOrder.renewal_order_id,
                        {
                            prescription_json: body_json,
                            subscription_type: new_subscription_cadency,
                            assigned_pharmacy: PHARMACY.HALLANDALE,
                            variant_index: this.renewalOrder.variant_index,
                        }
                    );

                    if (
                        this.renewalOrder.subscription_type !==
                        new_subscription_cadency
                    ) {
                        await updatePrescriptionSubscription(
                            this.subscription.id,
                            {
                                subscription_type:
                                    priceData && priceData.cadence
                                        ? (priceData.cadence as SubscriptionCadency)
                                        : SubscriptionCadency.Monthly,
                                assigned_pharmacy:
                                    this.renewalOrder.assigned_pharmacy,
                            }
                        );
                        this.renewalOrder.subscription_type =
                            new_subscription_cadency;
                        this.subscription.subscription_type =
                            new_subscription_cadency;
                    }
                    this.renewalOrder.prescription_json = body_json;
                }
            }
        } catch (error) {
            console.error(
                'Something went wrong converting variant index for hallandalescripthandler',
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
