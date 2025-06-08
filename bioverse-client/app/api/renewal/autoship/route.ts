'use server';

import { getAutoShipMacroPopulated } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { MESSAGE_UNREAD } from '@/app/services/customerio/event_names';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { MessagePayload } from '@/app/types/messages/messages-types';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import { postNewMessage } from '@/app/utils/database/controller/messaging/messages/messages';
import { getThreadIDByPatientIDAndProduct } from '@/app/utils/database/controller/messaging/threads/threads';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getSubscriptionByProduct } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getProfileIDFromEmail } from '@/app/utils/database/controller/profiles/profiles';
import {
    getLastCompleteOrderForOriginalOrderId,
    getLatestRenewalOrderForSubscription,
    getLatestRenewalOrderForSubscriptionThatWasSent,
    updateRenewalOrderFromRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { NextRequest, NextResponse } from 'next/server';


/*
*
*
* This route is triggered by the a RenewalAutoshipJobHandler instance of job type JobSchedulerTypes.RenewalAutoship
* Such jobs are created by createNewAutoRenewalJob(), which is called in the StripeInvoicePaidJobHandler.
* 
* 
* The purpose of this route is to set the autoshipped field to true for the latest renewal order for a given subscription.
* and also to send a message to the patient with the autoship macro.
* 
* 
* 
*/
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        //extract patient e-mail
        const patient_email = body.email;

        let patient_id = body.patient_id;
        if (!patient_id) {
            patient_id = await getProfileIDFromEmail(patient_email);
        }

        //find subscription & renewal order
        let subscription_id;
        let product_href;

        const semaglutide_subscription_check = await getSubscriptionByProduct(
            'semaglutide',
            patient_id
        );
        const tirzepatide_subscription_check = await getSubscriptionByProduct(
            'tirzepatide',
            patient_id
        );

        if (semaglutide_subscription_check) {
            if (semaglutide_subscription_check.status === 'active') {
                subscription_id = semaglutide_subscription_check.id;
                product_href = PRODUCT_HREF.SEMAGLUTIDE;
            }
        } else if (tirzepatide_subscription_check) {
            if (tirzepatide_subscription_check.status === 'active') {
                subscription_id = tirzepatide_subscription_check.id;
                product_href = PRODUCT_HREF.TIRZEPATIDE;
            }
        }

        if (!subscription_id) {
            return new NextResponse(
                JSON.stringify({
                    message: 'No Subscription Found for Patient',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        /*
        *
        * latest_renewal_order SHOULD be the one that was just paid for. The script should be sent AFTER this code runs, at which point (in the /api/[phramcy]/send-script route) the next renewal order will be created
        * However, if this RenewalAutoship job is processed after the /api/[phramcy]/send-script route, then latest_renewal_order won't be the one that was just paid for - it will be the one that was just created.
        * This can cause an issue where the new unprocessed renewal order has autoshipped set to true, even though it was the previous renewal order that was actually autoshipped.
        * Might be better to just set autoshipped to true inside the StripeInvoicePaidJobHandler, instead of in this route. 
        *
        **/
        const latest_renewal_order = await getLatestRenewalOrderForSubscription(
            subscription_id
        );

        if (!latest_renewal_order) {
            return new NextResponse(
                JSON.stringify({
                    message: 'No Renewal Order Found for Patient',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        //set autoship to true for renewal - commenting out April 2, 2025 becuase it should be done in the StripeInvoicePaidJobHandler instead
        // await updateRenewalOrderFromRenewalOrderId(
        //     latest_renewal_order.renewal_order_id,
        //     {
        //         autoshipped: true, //need to make sure this is setting the correct renewal order to autoshipped
        //         assigned_provider: '8e8041bb-cdbc-4a7a-ab96-39bd76fd9583', //11-19-2024 Nathan Cho: Added autoship uuid for display.
        //     }
        // );

        let latest_sent_renewal_order;

        latest_sent_renewal_order =
            await getLatestRenewalOrderForSubscriptionThatWasSent(
                subscription_id
            );

        if (!latest_sent_renewal_order) {
            latest_sent_renewal_order = (
                await getLastCompleteOrderForOriginalOrderId(
                    latest_renewal_order.original_order_id
                )
            ).orderData;
        }

        if (!latest_sent_renewal_order) {
            return new NextResponse(
                JSON.stringify({
                    message: 'No Orders Sent',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        let isBundlePatient: boolean = false;

        const SEMAGLUTIDE_BUNDLE_INDICES = [6, 7, 8, 9, 10, 11, 12];
        const TIRZEPATIDE_BUNDLE_INDICES = [
            6, 7, 8, 9, 12, 13, 16, 17, 18, 19, 20, 21, 22,
        ];

        if (product_href === PRODUCT_HREF.TIRZEPATIDE) {
            if (
                TIRZEPATIDE_BUNDLE_INDICES.includes(
                    latest_sent_renewal_order.variant_index
                )
            ) {
                isBundlePatient = true;
            }
        }
        if (product_href === PRODUCT_HREF.SEMAGLUTIDE) {
            if (
                SEMAGLUTIDE_BUNDLE_INDICES.includes(
                    latest_sent_renewal_order.variant_index
                )
            ) {
                isBundlePatient = true;
            }
        }

        const { data: patientData, error: patientDataError } =
            await getPatientInformationById(latest_renewal_order.customer_uuid);

        if (!patientData || patientDataError) {
            return new NextResponse(
                JSON.stringify({
                    message:
                        'No Patient information found from Renewal Order Data',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // send macro to patient parsing & replacing product name
        const macroHtml = await getAutoShipMacroPopulated(
            product_href!,
            patientData,
            isBundlePatient
        );

        if (macroHtml) {
            const thread_id = await getThreadIDByPatientIDAndProduct(
                latest_renewal_order.customer_uuid,
                latest_renewal_order.product_href
            );

            if (thread_id === '') {
                console.error('AutoShip Issue: Could not find thread for user');
                await forwardOrderToEngineering(
                    latest_renewal_order.renewal_order_id,
                    latest_renewal_order.customer_uuid,
                    'Did not send sig after sending one month vial'
                );
            }
            const messagePayload: MessagePayload = {
                content: macroHtml,
                sender_id: 'e756658d-785d-46d5-85ab-22bf11256a59', // hard coded customer support
                thread_id: Number(thread_id),
                contains_phi: false,
                requires_coordinator: false,
                requires_lead: false,
                requires_provider: false,
            };
            await postNewMessage(messagePayload);

            //Triggering customer io campaign to enter campaign.
            await triggerEvent(patient_id, MESSAGE_UNREAD, {});
        }
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({
                message: 'System encountered an error: ' + error.message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    return new NextResponse(
        JSON.stringify({
            message: 'Successfully Processed Patient',
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
