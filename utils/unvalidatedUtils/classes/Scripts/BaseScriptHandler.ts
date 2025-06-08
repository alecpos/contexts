import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
} from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { saveScriptForFutureUse } from '../../database/controller/prescription_script_audit/prescription_script_audit';
import { updateRenewalOrderByRenewalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { getPatientInformationById } from '../../actions/provider/patient-overview';
import { getPatientAllergyData } from '../../database/controller/clinical_notes/clinical-notes';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import { ScriptHandlerFactory } from './ScriptHandlerFactory';
import { Status } from '@/app/types/global/global-enumerators';
import { ScriptSource } from '@/app/types/orders/order-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { ProductVariantController } from '../ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';

// To generate a script for order with no prescription json:
// Create new ScriptHandlerFactory
// this.generateScript() -> this.sendScript()

export abstract class BaseScriptHandler {
    renewalOrder: RenewalOrder;
    subscription: PrescriptionSubscription;
    prescriptionData: any;
    price: string;
    patientData: DBPatientData | null;
    allergyData: any;
    scriptOrderData: DBOrderData | null;
    source: ScriptSource;
    customOrderId: string;
    resending: boolean;
    constructor(
        renewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription,
        source: ScriptSource,
        price: string = '',
        custom_order_id: string,
        resending: boolean = true
    ) {
        this.renewalOrder = renewalOrder;
        this.subscription = subscription;
        this.price = price;
        this.patientData = null;
        this.scriptOrderData = null;
        this.allergyData = null;
        this.source = source;
        this.customOrderId = custom_order_id;
        this.resending = resending;
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
            prescriptionDataRes = null;
        }
        this.prescriptionData = prescriptionDataRes;
    }

    // Sends script from order's prescription json to the pharmacy
    abstract sendScript(): Promise<Status>;

    // Generates and loads script into order's prescription json from order's variant index and updates order accordingly
    abstract generateScript(): Promise<Status>;

    // Should be always calling this as opposed to just sendScript. It is the business logic call for sending the script.
    async processAndSendScript(): Promise<Status> {
        const { scriptStatus, shouldSendScript } =
            await this.preprocessSendingScript();

        if (scriptStatus === Status.Failure) {
            return Status.Failure;
        }

        if (shouldSendScript) {
            console.log('ATTEMPTING TO SEND SCRIPT');
            return await this.sendScript();
        }
        return Status.Success;
    }

    // Regenerate script based on order's variant index and sends to pharmacy
    async regenerateAndSendScript(): Promise<Status> {
        const res = await this.generateScript();

        if (res === Status.Failure) {
            return Status.Failure;
        }

        const sendScriptRes = await this.processAndSendScript();

        return sendScriptRes;
    }

    // Any pre-processing we have to do before sending a script
    // So far these include: converting hallandale orders to empower for tirzepatide & state restrictions
    async preprocessSendingScript(): Promise<{
        scriptStatus: Status;
        shouldSendScript: boolean;
    }> {
        const pvc = new ProductVariantController(
            this.renewalOrder.product_href as PRODUCT_HREF,
            this.renewalOrder.variant_index,
            this.renewalOrder.state as USStates
        );

        const pvc_conversion = pvc.getConvertedVariantIndex();

        let variantIndex =
            pvc_conversion.variant_index ?? this.renewalOrder.variant_index;
        let pvcPharmacy = pvc_conversion.pharmacy;

        if (variantIndex !== this.renewalOrder.variant_index) {
            // Can abstract this to be more general once we update this for new pharmacies
            switch (pvcPharmacy) {
                case PHARMACY.EMPOWER: {
                    const empowerHandler = ScriptHandlerFactory.createHandler(
                        {
                            ...this.renewalOrder,
                            assigned_pharmacy: PHARMACY.EMPOWER,
                            variant_index: variantIndex,
                        },
                        {
                            ...this.subscription,
                            assigned_pharmacy: PHARMACY.EMPOWER,
                        },
                        this.source,
                        this.price
                    );

                    return {
                        scriptStatus:
                            await empowerHandler.regenerateAndSendScript(),
                        shouldSendScript: false,
                    };
                }
                case PHARMACY.HALLANDALE: {
                    const hallandaleHandler =
                        ScriptHandlerFactory.createHandler(
                            {
                                ...this.renewalOrder,
                                assigned_pharmacy: PHARMACY.HALLANDALE,
                                variant_index: variantIndex,
                            },
                            {
                                ...this.subscription,
                                assigned_pharmacy: PHARMACY.HALLANDALE,
                            },
                            this.source,
                            this.price
                        );
                    return {
                        scriptStatus:
                            await hallandaleHandler.regenerateAndSendScript(),
                        shouldSendScript: false,
                    };
                }
                case PHARMACY.BOOTHWYN: {
                    const boothwynHandler = ScriptHandlerFactory.createHandler(
                        {
                            ...this.renewalOrder,
                            assigned_pharmacy: PHARMACY.BOOTHWYN,
                            variant_index: variantIndex,
                        },
                        {
                            ...this.subscription,
                            assigned_pharmacy: PHARMACY.BOOTHWYN,
                        },
                        this.source,
                        this.price
                    );

                    await updateRenewalOrderByRenewalOrderId(
                        this.renewalOrder.renewal_order_id,
                        {
                            assigned_pharmacy: PHARMACY.BOOTHWYN,
                            variant_index: variantIndex,
                        }
                    );
                    return {
                        scriptStatus:
                            await boothwynHandler.regenerateAndSendScript(),
                        shouldSendScript: false,
                    };
                }

                case PHARMACY.REVIVE: {
                    const reviveHandler = ScriptHandlerFactory.createHandler(
                        {
                            ...this.renewalOrder,
                            assigned_pharmacy: PHARMACY.REVIVE,
                            variant_index: variantIndex,
                        },
                        {
                            ...this.subscription,
                            assigned_pharmacy: PHARMACY.REVIVE,
                        },
                        this.source,
                        this.price
                    );

                    await updateRenewalOrderByRenewalOrderId(
                        this.renewalOrder.renewal_order_id,
                        {
                            assigned_pharmacy: PHARMACY.REVIVE,
                            variant_index: variantIndex,
                        }
                    );
                    return {
                        scriptStatus:
                            await reviveHandler.regenerateAndSendScript(),
                        shouldSendScript: false,
                    };
                }

                default:
                    return {
                        scriptStatus: Status.Failure,
                        shouldSendScript: false,
                    };
            }
        }
        return { scriptStatus: Status.Success, shouldSendScript: true };
    }

    // Generates and loads patient data for script generation
    async loadDataForScriptGeneration() {
        const { type: orderType, data: orderData } = await fetchOrderData(
            this.renewalOrder.renewal_order_id
        );

        const { data: patientData, error: patientDataError } =
            await getPatientInformationById(this.renewalOrder.customer_uuid);

        const { data: allergyData, error: allergyError } =
            await getPatientAllergyData(this.renewalOrder.customer_uuid, 'asd');

        this.allergyData = allergyData;
        this.patientData = patientData;
        this.scriptOrderData = orderData;
    }

    async onScriptSendSuccess() {
        await updateRenewalOrderByRenewalOrderId(
            this.renewalOrder.renewal_order_id,
            { ...(this.price !== '' && { price: this.price }) }
        );
        await this.saveScriptForFutureUse();
        await createUserStatusTagWAction(
            StatusTag.Resolved,
            this.renewalOrder.renewal_order_id,
            StatusTagAction.REPLACE,
            this.renewalOrder.customer_uuid,
            'Sent script to pharmacy',
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            [StatusTag.Resolved],
            false
        );
        return Status.Success;
    }

    async onScriptSendFailure() {
        console.error(
            'Script sending failed, forwarding to engineering - base script handler',
            this.renewalOrder,
            this.renewalOrder.customer_uuid
        );
        await forwardOrderToEngineering(
            this.renewalOrder.renewal_order_id,
            this.renewalOrder.customer_uuid,
            StatusTagNotes.AutomaticSendScriptError
        );
        return Status.Failure;
    }

    async saveScriptForFutureUse() {
        await saveScriptForFutureUse(
            this.prescriptionData,
            this.renewalOrder.renewal_order_id,
            this.renewalOrder.assigned_pharmacy,
            this.source
        );
    }

    /**
     * Note from Nathan:
     *
     * This function was only used in one place in a dev file.
     * The function itself is deprecated since we have a Product Variant Controller which can convert with eligibility logic.
     */
    // async convertVariantIndex(new_variant_index: number) {
    //     const new_pharmacy = getEligiblePharmacy(
    //         this.renewalOrder.product_href,
    //         new_variant_index
    //     );

    //     const { data: updatedRenewalOrder, status } =
    //         await updateRenewalOrderByRenewalOrderId(
    //             this.renewalOrder.renewal_order_id,
    //             {
    //                 variant_index: new_variant_index,
    //                 assigned_pharmacy: new_pharmacy,
    //             }
    //         );

    //     if (!updatedRenewalOrder || status === Status.Failure) {
    //         console.error(
    //             'Something went wrong updating converting this variant index',
    //             this.renewalOrder
    //         );
    //         return { status: Status.Failure, data: this };
    //     }
    //     return {
    //         data: ScriptHandlerFactory.createHandler(
    //             updatedRenewalOrder,
    //             this.subscription,
    //             this.source,
    //             this.price
    //         ),
    //         status: Status.Success,
    //     };
    // }
}
