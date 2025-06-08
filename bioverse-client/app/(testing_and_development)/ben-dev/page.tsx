'use client';
import { Button, Input, TextField } from '@mui/material';
import { getProductVariantStripePriceIDsWithVariantIndex } from '@/app/utils/database/controller/product_variants/product_variants';
import React from 'react';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import {
    getVariantIndexByPriceIdV2,
    getPriceIdForProductVariant,
} from '@/app/utils/database/controller/products/products';
import {
    GLP1_STRIPE_PRICE_ID_LIST,
    getVariantIndexByPriceId,
    incorrectPriceIds,
} from '@/app/services/pharmacy-integration/variant-swap/glp1-stripe-price-id';

import { createNewSendPrescriptionJob } from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import { processAutomaticBoothwynScript } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-script-api';
import { generateBoothwynScriptAsync } from '@/app/utils/functions/prescription-scripts/boothwyn-script-generator';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

import {
    getCombinedOrder,
    getCombinedOrderV2,
    getOrderById,
    getOrderForProduct,
    updateOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';

import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
    updateStatusTagToResolved,
    updateStatusTagToReview,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    getLastInvoiceBeforeRenewal,
    getStripeSubscription,
    safeCancelSubscription,
    toggleDelayedForStripeSubscription,
    updateStripeProduct,
    updateStripeSubscriptionMetadata,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import {
    getPrescriptionSubscription,
    getSubscriptionDetails,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import { processAutomaticReviveScript } from '@/app/services/pharmacy-integration/revive/revive-send-script-api';
import { generateReviveScript } from '@/app/utils/functions/prescription-scripts/revive-script-generator';
import { processAutomaticHallandaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { addOrRemoveStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { SubscriptionStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscription_enums';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { WL_CHECKIN_RESEND } from '@/app/services/customerio/event_names';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { updateRenewalOrderMetadataSafely } from '@/app/utils/database/controller/renewal_orders/renewal_orders';


export default function BenDevPage() {
    const [loading, setLoading] = React.useState(false);

    // const [orderIDforSendPrescriptionJob, setOrderIDforSendPrescriptionJob] = React.useState<string>('');
    const [orderIDforSendBoothwynScript, setOrderIDforSendBoothwynScript] =
        React.useState<string>('');

    // things to synchronize:
    // 1. their renewal order row
    // 2. supabase subscription
    // 3. stripe subscription
    // 4. comms

    const handleCheck_getVariantIndexByPriceIdV2 = async () => {
        const semOptions = GLP1_STRIPE_PRICE_ID_LIST.semaglutide;
        let unequalSemaglutideVariants: any[] = [];

        for (const [key, value] of Object.entries(semOptions)) {
            // console.log(`${key}: ${value.prod}`);
            const responseV2 = await getVariantIndexByPriceIdV2(
                PRODUCT_HREF.SEMAGLUTIDE,
                value.prod
            );

            const responseV1 = getVariantIndexByPriceId(
                PRODUCT_HREF.SEMAGLUTIDE,
                value.prod
            );

            // console.log('ResponseV2:', responseV2);
            // console.log('ResponseV1:', responseV1);
            // console.log("---")
            if (responseV2.variant_index !== responseV1) {
                unequalSemaglutideVariants.push({
                    mappingVariantIndex: key,
                    mappingPriceId: value.prod,
                    responseV1: responseV1,
                    responseV2: responseV2.variant_index,
                });
            }
        }

        console.log(
            'Unequal Semaglutide Variants:',
            unequalSemaglutideVariants
        );

        const tirzOptions = GLP1_STRIPE_PRICE_ID_LIST.tirzepatide;
        let unequalTirzepatideVariants: any[] = [];

        for (const [key, value] of Object.entries(tirzOptions)) {
            // console.log(`${key}: ${value.prod}`);
            const responseV2 = await getVariantIndexByPriceIdV2(
                PRODUCT_HREF.TIRZEPATIDE,
                value.prod
            );

            const responseV1 = getVariantIndexByPriceId(
                PRODUCT_HREF.TIRZEPATIDE,
                value.prod
            );

            // console.log('ResponseV2:', responseV2);
            // console.log('ResponseV1:', responseV1);
            // console.log("---")
            if (responseV2.variant_index !== responseV1) {
                unequalTirzepatideVariants.push({
                    mappingVariantIndex: key,
                    mappingPriceId: value.prod,
                    responseV1: responseV1,
                    responseV2: responseV2.variant_index,
                });
            }
        }

        console.log(
            'Unequal Tirzepatide Variants:',
            unequalTirzepatideVariants
        );

        // const responseV1 = getVariantIndexByPriceId(
        //         PRODUCT_HREF.SEMAGLUTIDE,
        //         'price_1Phu0tDyFtOu3ZuTiQTyy9kT'
        //     );
        // const responseV2 = await getVariantIndexByPriceIdV2(
        //         PRODUCT_HREF.SEMAGLUTIDE,
        //         'price_1Phu0tDyFtOu3ZuTiQTyy9kT'
        //     );
        //     console.log('ResponseV2:', responseV2);
        //     console.log('ResponseV1:', responseV1);
    };


    // const handleProcessReviveOrders = async () => {
    //     for (const orderId of reviveOrderIdsBiannal) {
    //         console.log('------------------------------------------------------------------------------------');
    //         const order = await getOrderById(orderId);

    //         console.log('order:', order);

    //         if (order?.data?.variant_index === 18 && order?.data?.product_href === PRODUCT_HREF.SEMAGLUTIDE) {
    //             await updateOrder(Number(orderId), {
    //                 variant_index: 68,
    //                 assigned_pharmacy: 'revive'
    //             });
    //             console.log('Updated order:', orderId);
    //             const reviveScriptData = await generateReviveScript(
    //                 order?.data?.customer_uid,
    //                 orderId,
    //                 undefined,
    //                 true
    //             );
    //             console.log('reviveScriptData:', reviveScriptData);

    //             if (!reviveScriptData) {
    //                 console.error('Error: Could not generate revive script');
    //                 throw new Error(
    //                     'Error: Could not generate revive script'
    //                 );

    //             }

    //             const { result: reviveResult, reason: reviveMessage } =
    //                 await resendReviveScript(
    //                     JSON.stringify(reviveScriptData.script_json),
    //                     orderId,
    //                     order.data.assigned_provider,
    //                     OrderType.Order,
    //                     true,
    //                     undefined,
    //                     undefined,
    //                     68
    //                 );
    //             if (reviveResult === Status.Failure) {
    //                 console.error('Failed to send revive script for order:', orderId, 'with error:', reviveMessage);
    //             } else if (reviveResult === Status.Success) {
    //                 console.log('Successfully sent revive script for order:', orderId);

    //                 //please send the macro for REVIVE - 6 MONTH SUPPLY Semaglutide 0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg. We had to change the pharmacy because Hallandale was out of stock.
    //                 await createUserStatusTagWAction(
    //                     StatusTag.LeadProvider,
    //                     orderId + '-1',
    //                     StatusTagAction.INSERT,
    //                     order.data.customer_uid,
    //                     'please send the macro for REVIVE - 6 MONTH SUPPLY Semaglutide 0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg. We had to change the pharmacy because Hallandale was out of stock.',
    //                     '9afc3d1d-a9d0-46aa-8598-d2ac3d6ab928',
    //                     [StatusTag.LeadProvider]
    //                 );
    //                 console.log('Created user status tag for order:', orderId);
    //             }

    //         } else {
    //             console.log('Skipping order:', orderId);
    //         }
    //     }
    // }

    // const resendCheckinLinks = async () => {

    //     //look at job scheduler and find all completed jobs within the past two weeks with job_type monthly_checkin_customerio but not less than 1 hour ago
    
    //     const jobs = await getMonthlyCheckinJobsForResend()

    //     console.log("data:", jobs)

    //     //loop through the data and get the subscription for each 
    //     const patients: { patientId: string, productHref: string, scheduleTime: string }[] = []
    //     for (const job of jobs) {
    //         const subscription = await getPrescriptionSubscription(job.metadata.subscription_id)
    //         if (!subscription) {
    //             console.error(`Subscription not found for job ${job.metadata.user_id}`)
    //             continue
    //         }
    //         patients.push({ patientId: subscription.patient_id, productHref: subscription.product_href, scheduleTime: job.schedule_time })
    //     }

    //     console.log("patients: ", patients)
    
    //     const failureList: string[] = []
    //     // //loop through each and send the script. 
    //     for (const { patientId, productHref } of patients) {
    //         try {
    //             const resp = await triggerEvent(
    //                 patientId,
    //                 WL_CHECKIN_RESEND,
    //                 {
    //                     checkin_url: `https://app.gobioverse.com/check-up/${productHref}`,
    //                 }
    //             );
    
    //             if (resp.status === 200) {
    //                 await logPatientAction(
    //                     patientId,
    //                     PatientActionTask.CHECKIN_FORM_SENT,
    //                     { product_href: productHref }
    //                 );
    //             } else {
    //                 console.error(`Trigger failed for patientId: ${patientId}, productHref: ${productHref}`);
    //                 failureList.push(`Failed for patientId: ${patientId} for productHref: ${productHref}`)
    //             }
    //         } catch (error) {
    //             console.error(`Error handling patientId: ${patientId}, productHref: ${productHref}`, error);
    //         }
    //     }
    // }

    // const handleCheckPVC = async () => {
    //     const pvc = new ProductVariantController(
    //         PRODUCT_HREF.SEMAGLUTIDE,
    //         74,
    //         USStates.Ohio
    //     );

    //     const pvc_result = pvc.getConvertedVariantIndex();
    //     const new_variant_index = pvc_result.variant_index;
    //     const new_pharmacy = pvc_result.pharmacy;

    //     alert(`new_variant_index: ${new_variant_index}, new_pharmacy: ${new_pharmacy}`);
    // }

    return (
        <div className='mt-10 flex flex-row'>
            dd
            {/* <div className='mt-10 flex flex-row'>
                <Button
                    onClick={handleProcessReviveOrders}
                >
                    process revive orders
                </Button>
            </div> */}

{/* 
                <div className='mt-10 flex flex-row'>
                <Button
                    onClick={resendCheckinLinks}
                >
                    Resend checkin links 
                </Button>
            </div> */}

            {/* <div className='mt-10 flex flex-row'>
                <Button
                    onClick={() => {
                        updateRenewalOrderMetadataSafely({ refills_shipped: 122 }, '67127-1');
                    }}
                >
                    Update renewal order metadata
                </Button>
            </div> */}
        </div>
    );
}
