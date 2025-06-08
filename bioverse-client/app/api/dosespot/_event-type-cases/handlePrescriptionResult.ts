'server only';

/**
 * 'server only' for this file as it is only accessed from an API route.
 */
import { NextResponse } from 'next/server';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { getBestMatchingOrder } from '../_event-actions/dose-spot/order-matcher';
import { sendGGMRequest } from '@/app/services/pharmacy-integration/gogomeds/ggm-actions';
import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { chargeCustomerV2 } from '@/app/services/stripe/charge-customer';
import { createAndSendCurexaOrder } from '@/app/services/pharmacy-integration/curexa/curexa-actions';
import {
    updateOrderPharmacyDisplayName,
    updateOrderPharmacyScript,
    updateOrderShippingStatusAndExternalMetadata,
} from '@/app/utils/database/controller/orders/orders-api';
import { insertDoseSpotWebhookAudit } from '@/app/utils/database/controller/dose_spot_webhook_audit/dose-spot-webhook-audit';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    createFirstTimeRenewalOrder,
    createUpcomingRenewalOrder,
    getLatestRenewalOrderForSubscription,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';

export async function handlePrescriptionResult(jsonData: any) {
    /**
     * I construct the dose spot status update data into an interface that matches the way that it comes for typescript.
     */
    const statusUpdateData: DoseSpotStatusPrescriptionData = {
        patient_id: jsonData.Data.PatientId,
        clinic_id: jsonData.Data.ClinicId,
        clinician_id: jsonData.Data.ClinicianId,
        agent_id: jsonData.Data.AgentId,
        prescription_id: jsonData.Data.PrescriptionId,
        related_rx_request_queue_item_id:
            jsonData.Data.RelatedRxRequestQueueItemId,
        prescription_status: jsonData.Data.PrescriptionStatus,
        status_date_time: jsonData.Data.StatusDateTime,
        status_details: jsonData.Data.StatusDetails,
    };

    /**
     * For future reference, this is the point at which likelihood of error is highest.
     * There are many situations / cases that go into matching the best order, and it is not foolproof.
     */
    const { order, prescriptionData } = await getBestMatchingOrder(
        statusUpdateData
    );

    /**
     * 8/8/24 - nathan cho : commenting this block out and replacing every use case of auditingPrescriptionData with prescriptionData obtained in function above.
     * This function is identically called within getBestMatchingOrder and the results are returned as prescriptionData.
     */
    // const auditingPrescriptionData =
    //     await getDoseSpotPrescriptionWithPrescriptionIdAndPatientId(
    //         statusUpdateData.prescription_id,
    //         statusUpdateData.patient_id,
    //         statusUpdateData.clinician_id
    //     );

    //Optimistically inserting the webhook audit while the API call resolves.
    insertDoseSpotWebhookAudit(jsonData, statusUpdateData, prescriptionData);

    if (order === null) {
        SaveJsonUsedToFailureTable(
            statusUpdateData,
            '',
            '',
            'DoseSpot error in finding order using status update data..',
            null,
            null,
            ScriptSource.Manual
        );
        return;
    }

    /**
     * THIS SECTION RETURN IS ENTIRELY DELETE-ABLE: ONLY WAS USED FOR TESTING CUREXA GGM
     */
    // return new NextResponse(
    //     JSON.stringify({
    //         message: 'Prescription status change processed successfully',
    //     }),
    //     {
    //         status: 200, // OK
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     }
    // );

    if (statusUpdateData.prescription_status == '4') {
        await handlePrescriptionSentOrderMatch(
            order,
            prescriptionData,
            statusUpdateData
        );
    }

    if (statusUpdateData.prescription_status == '13') {
        await handlePrescriptionRxVerified(
            prescriptionData,
            order,
            statusUpdateData
        );
    }

    // const doseSpotPrescriptionData =
    //   await getDoseSpotPrescriptionWithPrescriptionIdAndPatientId(
    //     statusUpdateData.prescription_id,
    //     statusUpdateData.patient_id,
    //     statusUpdateData.clinician_id
    //   );

    // const {
    //   data: prescriptionStatusChangeData,
    //   error: prescriptionStatusChangeError,
    // } = await supabase
    //   .from("prescription_status_changes")
    //   .upsert(prescriptionData, { onConflict: "prescription_id" });

    // if (prescriptionStatusChangeError) {
    //   throw prescriptionStatusChangeError;
    // }

    return new NextResponse(
        JSON.stringify({
            message: 'Prescription status change processed successfully',
        }),
        {
            status: 200, // OK
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}

async function handlePrescriptionSentOrderMatch(
    prescriptionData: any,
    order: any,
    statusUpdateData: DoseSpotStatusPrescriptionData
) {
    const external_metadata = {
        doseSpotPrescriptionId: statusUpdateData.prescription_id,
    };

    updateOrderShippingStatusAndExternalMetadata(
        order.id,
        'Processing',
        external_metadata
    );
}

export async function handlePrescriptionRxVerified(
    prescriptionData: any,
    order: any,
    statusUpdateData: DoseSpotStatusPrescriptionData
) {
    /**
     * Curexa
     */
    if (prescriptionData.PharmacyId == '29992') {
        //29992 is the pharmacy code in production for curexa.
        //send a script to curexa

        if (order.assigned_pharmacy !== 'curexa') {
            SaveJsonUsedToFailureTable(
                statusUpdateData,
                order.id,
                order.assigned_provider,
                'Curexa-DoseSpot error: This order is not associated with curexa',
                order,
                order.assigned_pharmacy,
                ScriptSource.Manual
            );
            return;
        }

        let chargeStatus;

        //username: bioverse_test_iYeOXdTgzLZEpqhF8D0GuyamPJRI1HNw
        //pw: 3iM5d4LXvhjRHayFqlUgN96w87rYEpzP
        if (order.order_status === 'Payment-Completed') {
            chargeStatus = { result: 'success' };
        } else {
            chargeStatus = await chargeCustomerV2(
                order.id,
                order.assigned_provider,
                OrderType.Order
            );
        }

        console.log(
            'handlePrescriptionRxVerified INFO - chargeStatus: ',
            chargeStatus
        );

        try {
            await updateOrderPharmacyScript(prescriptionData, order.id);

            if (order.product_href == PRODUCT_HREF.TRETINOIN) {
                // saves the prescription strength of tretinoin
                await updateOrderPharmacyDisplayName(
                    prescriptionData,
                    order.id
                );
            }

            if (chargeStatus.result === 'success') {
                //meta-pixel : success
                //Once the script itself is sent, there is nothing more for the provider to do here.
                //However we do it PRIOR to sending the script such that if the script fails, it will update the status.
                await updateExistingOrderStatus(
                    Number(order.id),
                    'Approved-CardDown-Finalized'
                );

                const response = await createAndSendCurexaOrder(
                    prescriptionData,
                    order
                );

                console.log(
                    'handlePrescriptionRxVerified INFO - Curexa Order Sent response: ',
                    response
                );

                if (response.status == 'success') {
                    updateOrderShippingStatusAndExternalMetadata(
                        order.id,
                        'In Processing',
                        { curexa_result: response }
                    );
                    //meta-pixel : curexa prescription-processed event.

                    /**
                     * 12/17/2024 - Nathan Cho:
                     * Adding a change here to make this work for renewal orders:
                     */
                    let latestRenewalOrder = undefined;

                    if (order?.subscription_id) {
                        latestRenewalOrder =
                            await getLatestRenewalOrderForSubscription(
                                order?.subscription_id
                            );
                    }

                    if (latestRenewalOrder) {
                        await createUpcomingRenewalOrder(latestRenewalOrder);
                    } else {
                        await createFirstTimeRenewalOrder(order.id);
                    }
                }
                return;
            } else {
                await updateExistingOrderStatus(
                    Number(order.id),
                    'Payment-Declined'
                );
                return;
            }
        } catch (error: any) {
            // await updateExistingOrderStatus(Number(order.id), 'Error-In-Send');
            await updateExistingOrderStatus(Number(order.id), 'Error-In-Send');
            console.error('Curexa error in script sending log: ', error);
            return;
        }
    }

    /**
     * GOGO-Meds
     */
    if (
        prescriptionData.PharmacyId == '78463' ||
        prescriptionData.PharmacyId == '245312'
    ) {
        //245312 is the pharmacy code in production for gogomeds.
        //78463 is the code it should come through in... ? UPDATED.
        //send a script to ggm

        if (order.assigned_pharmacy !== 'ggm') {
            SaveJsonUsedToFailureTable(
                statusUpdateData,
                order.id,
                order.assigned_provider,
                'GGM-DoseSpot error: This order is not associated with ggm',
                null,
                order.assigned_pharmacy,
                ScriptSource.Manual
            );
            return;
        }

        await updateOrderPharmacyScript(prescriptionData, order.id);

        const chargeStatus = await chargeCustomerV2(
            order.id,
            order.assigned_provider,
            OrderType.Order
        );

        if (chargeStatus.result === 'success') {
            //Once the script itself is sent, there is nothing more for the provider to do here.
            //However we do it PRIOR to sending the script such that if the script fails, it will update the status.
            await updateExistingOrderStatus(
                Number(order.id),
                'Approved-CardDown-Finalized'
            );

            const response = await sendGGMRequest(prescriptionData, order, {
                address_line1: order.address_line1,
                address_line2: order.address_line2,
                state: order.state,
                zip: order.zip,
                city: order.city,
            });
            if (response) {
                updateOrderShippingStatusAndExternalMetadata(
                    order.id,
                    'In Processing',
                    { ggm: response }
                );
            }
            await saveScriptForFutureUse(
                prescriptionData,
                order.id,
                'ggm',
                ScriptSource.Manual
            );

            /**
             * 12/17/2024 - Nathan Cho:
             * Adding a change here to make this work for renewal orders:
             */
            let latestRenewalOrder = undefined;

            if (order?.subscription_id) {
                latestRenewalOrder = await getLatestRenewalOrderForSubscription(
                    order?.subscription_id
                );
            }

            if (latestRenewalOrder) {
                await createUpcomingRenewalOrder(latestRenewalOrder);
            } else {
                await createFirstTimeRenewalOrder(order.id);
            }

            return;
        } else {
            await updateExistingOrderStatus(
                Number(order.id),
                'Payment-Declined'
            );
            await saveScriptForFutureUse(
                prescriptionData,
                order.id,
                'ggm',
                ScriptSource.Manual
            );
        }
        return;
    }
}
