'use server';

import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { PRODUCT_NAME_HREF_MAP } from '@/app/types/global/product-enumerator';
import { BaseOrderInterface, OrderType } from '@/app/types/orders/order-types';
import {
    RenewalOrder,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { isWeightlossProduct } from '@/app/utils/functions/pricing';
import { TitleInformation } from '@/app/utils/classes/Dashboard';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import {
    getGLP1Statuses,
    getCheckupResponses,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getStatusTagForOrder } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { ProviderTaskNames } from '@/app/utils/constants/provider-portal/ProviderTasks';

export async function getDaysBetweenDates(date1: Date, date2: Date) {
    const timeDifference = date1.getTime() - date2.getTime();

    // Convert time difference from milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return Math.abs(daysDifference);
}

/*
 *
 * The titles are determined based on waterfall logic.
 *
 * The following scenarios are handled:
 *
 *     New Orders:
 *        1. Subscription Reactivation                        - approval buttons
 *        2. Manually Created New Order                       - approval buttons
 *        3. New Patient                                      - approval buttons
 *
 *     Renewal Orders where the last order sent was monthly:
 *        4. Checkin + Prescribe Refill                       - approval buttons
 *
 *     Renewal Orders where the last order sent was multi-month:
 *        5. Supplementary Vial Request (based on status tag) - approval buttons
 *        6. Custom Dosage Request (based on status tag)      - approval buttons
 *        7. Provider Message Request (based on status tag)   - no buttons
 *        8. Check-in                                         - adjust dosing
 *        9. Refill Request                                   - approval buttons
 *
 * */
export async function getIntakeDashboardTitle(
    upcomingOrder: DBOrderData, //if the order is the OG order and there are no renewal orders yet (haven't been prescribed yet) - then this will be the current order
    upcomingOrderType: OrderType,
    currentOrder: BaseOrderInterface | RenewalOrder | null //if the order is the OG order and there are no renewal orders yet (haven't been prescribed yet) - then this will be null
): Promise<TitleInformation> {
    const {
        productInformation: productInformationUpcoming,
        productPrice: productPriceUpcoming,
    } = await getProductInformationForTitle(
        //for rendering the product description (i.e. "Semaglutide 3 month supply (0.25 mg, 0.5 mg, 1.25 mg)")
        upcomingOrderType === OrderType.Order
            ? upcomingOrder.variant_index
            : upcomingOrder.variant_index ?? upcomingOrder.order.variant_index,
        upcomingOrder.product_href
    );

    const {
        productInformation: productInformationCurrent,
        productPrice: productPriceCurrent,
    } = await getProductInformationForTitle(
        //for rendering the product description (i.e. "Semaglutide 3 month supply (0.25 mg, 0.5 mg, 1.25 mg)")
        currentOrder?.variant_index ?? 0,
        currentOrder?.product_href || ''
    );

    //Provider Dashboard Titles for NEW Orders
    if (upcomingOrderType === OrderType.Order) {
        if (
            await isPreviouslyCancelledSubscription(upcomingOrder.customer_uid)
        ) {
            return {
                taskName: ProviderTaskNames.SubscriptionReactivation,
                currentOrder: productInformationUpcoming,
                upcomingOrder: '',
                providerActionRequired:
                    'Action Needed: Approve, if medically appropriate & send dosing instructions.',
            };
        }

        //if it's a manually created new order:
        if (upcomingOrder?.source === 'admin') {
            return {
                taskName: ProviderTaskNames.ManuallyCreatedOrder,
                currentOrder: productInformationUpcoming,
                upcomingOrder: '',
                currentOrderPharmacy: upcomingOrder.assigned_pharmacy,
                providerActionRequired:
                    'Action Needed: Approve, if medically appropriate & send dosing instructions.',
            };
        }

        return {
            taskName: ProviderTaskNames.NewPatientPrescribe,
            currentOrder: productInformationUpcoming, //this is actually the current order given that the order is new and the provider hasn't prescribed the patient yet
            upcomingOrder: '',
            currentOrderPharmacy: upcomingOrder.assigned_pharmacy, //actually the current order given that the order is new and the provider hasn't prescribed the patient yet
            providerActionRequired:
                'Action Needed: Approve, if medically appropriate & send dosing instructions.',
        };
    }

    //if the order is being treated as a new order but it wasn't handled in the previous if statement...
    if (!currentOrder) {
        return {
            taskName: 'Intake Title Error Code 42',
            currentOrder: '',
            upcomingOrder: '',
        };
    }
    //END OF Provider Dashboard Titles for NEW Orders

    //Provider Dashboard Titles for orders that have already been prescribed (at least 1 renewal order exists)
    try {
        const mostRecentStatusTag =
            upcomingOrder && upcomingOrder?.renewal_order_id
                ? await getStatusTagForOrder(upcomingOrder.renewal_order_id) //duplicate db call here, it's also in intakeViewDataFetch, could passed into the Dashboard instance somehow
                : await getStatusTagForOrder(upcomingOrder.id.toString()); //upcomingOrder is the OG order if the order type is not a renewal order

        const userId =
            currentOrder && 'renewal_order_id' in currentOrder
                ? currentOrder.customer_uuid
                : currentOrder.customer_uid;
        const productHref = currentOrder.product_href;

        if (!userId) {
            return {
                taskName: 'Intake Title Error Code 43',
                currentOrder: '',
                upcomingOrder: '',
            };
        }
        if (!productHref) {
            return {
                taskName: 'Intake Title Error Code 44',
                currentOrder: '',
                upcomingOrder: '',
            };
        }

        //get their checkin responses
        const checkinResponses = await getCheckupResponses(
            userId,
            productHref as PRODUCT_HREF
        );
        const lastTwoResponses = getLastTwoCheckinResponses(checkinResponses); //filters down checkin responses to an array of length 2, with nulls if checkin responses don't exist

        //handle monthly renewal orders
        if (currentOrder?.subscription_type === SubscriptionCadency.Monthly) {
            return {
                taskName: ProviderTaskNames.WLMonthlyCheckin,
                currentOrder: productInformationCurrent,
                upcomingOrder: productInformationUpcoming,
            };
        }

        //handle quarterly and biannual renewal orders
        if (
            currentOrder?.subscription_type === SubscriptionCadency.Quarterly ||
            currentOrder?.subscription_type ===
                SubscriptionCadency.Biannually ||
            currentOrder?.subscription_type === SubscriptionCadency.Annually
        ) {
            if (currentOrder.subscription_id) {
                const subscription = await getPrescriptionSubscription(
                    currentOrder.subscription_id
                );

                if (!subscription) {
                    return {
                        taskName: ProviderTaskNames.WLQuarterlyCheckin,
                        currentOrder: productInformationCurrent,
                        upcomingOrder: productInformationUpcoming,
                    };
                }

                const stripeSubscription = await getStripeSubscription(
                    subscription.stripe_subscription_id
                );

                const stripeSubEndDate = convertEpochToDate(
                    stripeSubscription.current_period_end
                );

                const stripeSubStartDate = convertEpochToDate(
                    stripeSubscription.current_period_start
                );

                const daysBetween = await getDaysBetweenDates(
                    new Date(),
                    stripeSubEndDate
                );
                if (isWeightlossProduct(currentOrder.product_href)) {
                    const justTheDoses = productInformationCurrent
                        .split('(')[1]
                        .split(')')[0];
                    const justTheDosesArray = justTheDoses
                        .split(',')
                        .map((dose) => dose.trim()); //an array of what the dosages for each month would be if the patient were to follow the plan exactly as prescribed

                    if (
                        await isSupplementaryVialRequest(
                            currentOrder,
                            mostRecentStatusTag?.data.status_tags
                        )
                    ) {
                        //need to check status tag
                        return {
                            taskName: ProviderTaskNames.AdditionalVialsRequest,
                            currentOrder: productInformationCurrent,
                            upcomingOrder: productInformationUpcoming,
                            currentOrderPharmacy:
                                currentOrder.assigned_pharmacy ?? 'N/A',
                            upcomingOrderPharmacy:
                                upcomingOrder.assigned_pharmacy ?? 'N/A',
                            providerActionRequired:
                                'Action Needed: Approve, if medically appropriate & send dosing instructions.',
                            currentDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'current',
                                lastTwoResponses[0]
                            ),
                            previousDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'previous',
                                lastTwoResponses[1]
                            ),
                        };
                    }

                    if (
                        await isCustomDosageRequest(
                            currentOrder,
                            mostRecentStatusTag?.data.status_tags
                        )
                    ) {
                        //need to check status tag
                        return {
                            taskName: ProviderTaskNames.CustomDosageRequest,
                            currentOrder: productInformationCurrent,
                            upcomingOrder: productInformationUpcoming,
                            currentOrderPharmacy:
                                currentOrder.assigned_pharmacy ?? 'N/A',
                            upcomingOrderPharmacy:
                                upcomingOrder.assigned_pharmacy ?? 'N/A',
                            providerActionRequired:
                                'Action Needed: Approve, if medically appropriate & send dosing instructions.',
                            currentDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'current',
                                lastTwoResponses[0]
                            ),
                            previousDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'previous',
                                lastTwoResponses[1]
                            ),
                        };
                    }

                    if (
                        await isProviderMessageRequest(
                            mostRecentStatusTag?.data.status_tags
                        )
                    ) {
                        return {
                            taskName: ProviderTaskNames.ProviderMessage,
                            currentOrder: productInformationCurrent,
                            upcomingOrder: productInformationUpcoming,
                            currentOrderPharmacy:
                                currentOrder.assigned_pharmacy ?? 'N/A',
                            upcomingOrderPharmacy:
                                upcomingOrder.assigned_pharmacy ?? 'N/A',
                            providerActionRequired:
                                'Action Needed: Answer Patient Message.',
                            currentDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'current',
                                lastTwoResponses[0]
                            ),
                            previousDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'previous',
                                lastTwoResponses[1]
                            ),
                        };
                    }

                    //if they have more than a month left "No approval required"
                    if (daysBetween >= 30) {
                        return {
                            taskName: ProviderTaskNames.NonRefillCheckin,
                            currentOrder: productInformationCurrent,
                            upcomingOrder: productInformationUpcoming,
                            currentOrderPharmacy:
                                currentOrder.assigned_pharmacy ?? 'N/A',
                            upcomingOrderPharmacy:
                                upcomingOrder.assigned_pharmacy ?? 'N/A',
                            providerActionRequired:
                                'Action Needed: Review the Check in. Send Dosing Instructions.',
                            currentDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'current',
                                lastTwoResponses[0]
                            ),
                            previousDosage: calculateCurrentDosageDisplay(
                                stripeSubStartDate,
                                stripeSubEndDate,
                                currentOrder?.subscription_type,
                                justTheDosesArray,
                                'previous',
                                lastTwoResponses[1]
                            ),
                        };
                    }

                    //if they have less than a month left, their renewal date (refill date) will be coming up
                    return {
                        taskName: ProviderTaskNames.RefillRequest,
                        currentOrder: productInformationCurrent,
                        upcomingOrder: productInformationUpcoming,
                        currentOrderPharmacy:
                            currentOrder.assigned_pharmacy ?? 'N/A',
                        upcomingOrderPharmacy:
                            upcomingOrder.assigned_pharmacy ?? 'N/A',
                        providerActionRequired:
                            'Action Needed: Approve, if medically appropriate & send dosing instructions.',
                        currentDosage: calculateCurrentDosageDisplay(
                            stripeSubStartDate,
                            stripeSubEndDate,
                            currentOrder?.subscription_type,
                            justTheDosesArray,
                            'current',
                            lastTwoResponses[0]
                        ),
                        previousDosage: calculateCurrentDosageDisplay(
                            stripeSubStartDate,
                            stripeSubEndDate,
                            currentOrder?.subscription_type,
                            justTheDosesArray,
                            'previous',
                            lastTwoResponses[1]
                        ),
                    };
                } //end of "if isWeightlossProduct()" - why is this necessary?
            } //end of "if currentOrder.subscription_id"

            return {
                taskName: ProviderTaskNames.WLCheckinReview, //<-- this should theoretically never be used
                currentOrder: productInformationCurrent,
                upcomingOrder: productInformationUpcoming,
            };
        }
    } catch (error: any) {
        console.error('title fetch error: ', error);
    }

    return {
        taskName: ProviderTaskNames.WLCheckinReview, //<-- this should theoretically never be used
        currentOrder: productInformationCurrent,
        upcomingOrder: productInformationUpcoming,
    };
}

async function getProductInformationForTitle(
    variant_index: number,
    product_href: string
) {
    // TODO: Uncomment this code after empower orders are done
    // const variant_index = convertEmpowerOrderToHallandaleVariant(
    //     order.product_href,
    //     orderType === OrderType.Order
    //         ? order.variant_index
    //         : order.variant_index ?? order.order.variant_index,
    // );

    const productData = await getPriceDataRecordWithVariant(
        product_href,
        variant_index
    );

    const productName = PRODUCT_NAME_HREF_MAP[product_href];

    var res;
    if (!productData) {
        return { productInformation: '', productPrice: productData };
    }

    const cadenceTextMap = {
        monthly: '1 month supply',
        quarterly: '3 month supply',
        biannually: '6 month supply',
        annually: '12 month supply',
    };

    const cadence = productData.cadence ?? 'SEND TO ENGINEERING';
    const cadenceText =
        cadenceTextMap[cadence as keyof typeof cadenceTextMap] ??
        'SEND TO ENGINEERING';

    res = `${productName} ${cadenceText} ${
        productData.dosages ? productData.dosages : ''
    }`;

    return { productInformation: res, productPrice: productData };
}

function getWeeksAndMonthsIntoSubscription(
    endDate: Date,
    cadence:
        | SubscriptionCadency.Quarterly
        | SubscriptionCadency.Biannually
        | SubscriptionCadency.Annually
) {
    let monthDisplay;
    let weekDisplay;
    const currentDate = new Date();
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (cadence === SubscriptionCadency.Quarterly) {
        const daysIn = 90 - daysDiff;
        weekDisplay = Math.ceil(daysIn / 7.5);

        if (daysDiff > 60) {
            monthDisplay = 1;
        } else if (daysDiff > 30) {
            monthDisplay = 2;
        } else {
            monthDisplay = 3;
        }

        return `(Week ${weekDisplay}/12, Month ${monthDisplay}/3)`;
    } else if (cadence === SubscriptionCadency.Biannually) {
        const daysIn = 180 - daysDiff;
        weekDisplay = Math.ceil(daysIn / 7.5);

        if (daysDiff > 150) {
            monthDisplay = 1;
        } else if (daysDiff > 120) {
            monthDisplay = 2;
        } else if (daysDiff > 90) {
            monthDisplay = 3;
        } else if (daysDiff > 60) {
            monthDisplay = 4;
        } else if (daysDiff > 30) {
            monthDisplay = 5;
        } else {
            monthDisplay = 6;
        }

        return `Week ${weekDisplay}/24, Month ${monthDisplay}/6`;
    } else if (cadence === SubscriptionCadency.Annually) {
        const daysIn = 365 - daysDiff; // Changed from 180 to 365 for annual
        weekDisplay = Math.ceil(daysIn / 7); // Changed from 7.5 to 7 for standard weeks

        if (daysDiff > 330) {
            monthDisplay = 1;
        } else if (daysDiff > 300) {
            monthDisplay = 2;
        } else if (daysDiff > 270) {
            monthDisplay = 3;
        } else if (daysDiff > 240) {
            monthDisplay = 4;
        } else if (daysDiff > 210) {
            monthDisplay = 5;
        } else if (daysDiff > 180) {
            monthDisplay = 6;
        } else if (daysDiff > 150) {
            monthDisplay = 7;
        } else if (daysDiff > 120) {
            monthDisplay = 8;
        } else if (daysDiff > 90) {
            monthDisplay = 9;
        } else if (daysDiff > 60) {
            monthDisplay = 10;
        } else if (daysDiff > 30) {
            monthDisplay = 11;
        } else {
            monthDisplay = 12;
        }

        return `Week ${weekDisplay}/52, Month ${monthDisplay}/12`;
    } else {
        return '';
    }
}

function calculateCurrentDosageDisplay(
    startDate: Date,
    endDate: Date,
    cadence:
        | SubscriptionCadency.Quarterly
        | SubscriptionCadency.Biannually
        | SubscriptionCadency.Annually,
    dosagesArray: string[],
    currentOrPrevious: 'current' | 'previous',
    mostRecentCheckinResponse: any
) {
    const lengthOfSubscription =
        cadence === SubscriptionCadency.Quarterly ? 90 : 180;
    const totalNumberOfWeeks =
        cadence === SubscriptionCadency.Quarterly ? 12 : 24;
    const currentDate = new Date();
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const daysIn = lengthOfSubscription - daysDiff;
    let weekDisplay = Math.ceil(daysIn / 7.5); // it's 7.5 instead of 7 because our 3 month cadence is actually 90 days which isn't exactly 12 weeks

    let monthDisplay;
    if (cadence === SubscriptionCadency.Quarterly) {
        if (daysDiff > 60) {
            monthDisplay = 1;
        } else if (daysDiff > 30) {
            monthDisplay = 2;
        } else {
            monthDisplay = 3;
        }
    } else if (cadence === SubscriptionCadency.Biannually) {
        if (daysDiff > 150) {
            monthDisplay = 1;
        } else if (daysDiff > 120) {
            monthDisplay = 2;
        } else if (daysDiff > 90) {
            monthDisplay = 3;
        } else if (daysDiff > 60) {
            monthDisplay = 4;
        } else if (daysDiff > 30) {
            monthDisplay = 5;
        } else {
            monthDisplay = 6;
        }
    } else if (cadence === SubscriptionCadency.Annually) {
        if (daysDiff > 330) {
            monthDisplay = 1;
        } else if (daysDiff > 300) {
            monthDisplay = 2;
        } else if (daysDiff > 270) {
            monthDisplay = 3;
        } else if (daysDiff > 240) {
            monthDisplay = 4;
        } else if (daysDiff > 210) {
            monthDisplay = 5;
        } else if (daysDiff > 180) {
            monthDisplay = 6;
        } else if (daysDiff > 150) {
            monthDisplay = 7;
        } else if (daysDiff > 120) {
            monthDisplay = 8;
        } else if (daysDiff > 90) {
            monthDisplay = 9;
        } else if (daysDiff > 60) {
            monthDisplay = 10;
        } else if (daysDiff > 30) {
            monthDisplay = 11;
        } else {
            monthDisplay = 12;
        }
    } else {
        return '';
    }

    if (currentOrPrevious === 'previous') {
        if (mostRecentCheckinResponse) {
            const checkinSubmittedDate = new Date(
                mostRecentCheckinResponse.submission_time
            );

            if (checkinSubmittedDate > startDate) {
                //if the check in was submitted within the current subscription period
                return (
                    mostRecentCheckinResponse?.answer?.answer?.toString() ?? '?' +
                    ` (reported ${converteTimestamp(
                        mostRecentCheckinResponse.submission_time
                    )})`
                );
            }
            return '';
        } else {
            if (monthDisplay === 1) {
                return ``;
            } else {
                // return `${dosagesArray[monthDisplay - 2]} `
                //return `Unknown (${dosagesArray[monthDisplay - 2]} as prescribed)`;
                return '';
            }
        }
    }

    //first check for their most recent check in that was after the beginning of the current subscription period
    if (mostRecentCheckinResponse && currentOrPrevious === 'current') {
        const checkinSubmittedDate = new Date(
            mostRecentCheckinResponse.submission_time
        );

        if (checkinSubmittedDate > startDate) {
            //if the check in was submitted within the current subscription period
            return (
                mostRecentCheckinResponse?.answer?.answer?.toString() ?? '?' +
                ` (reported ${converteTimestamp(
                    mostRecentCheckinResponse.submission_time
                )}) (Week ${weekDisplay}/${totalNumberOfWeeks})`
            );
        }
    }

    return `Unknown (${
        dosagesArray[monthDisplay - 1]
    } as prescribed) (Week ${weekDisplay}/${totalNumberOfWeeks})`;
}

const isCustomDosageRequest = async (
    order: BaseOrderInterface | RenewalOrder,
    statusTags: string[] | undefined
) => {
    if (!statusTags) {
        return false;
    }
    if (statusTags.includes('CustomDosageRequest')) {
        return true;
    }
    return false;
};

const isSupplementaryVialRequest = async (
    order: BaseOrderInterface | RenewalOrder,
    statusTags: string[] | undefined
) => {
    if (!statusTags) {
        return false;
    }
    if (statusTags.includes('SupplementaryVialRequest')) {
        return true;
    }
    return false;
};

const isProviderMessageRequest = async (statusTags: string[] | undefined) => {
    if (!statusTags) {
        return false;
    }
    if (statusTags.includes('ProviderMessage') || statusTags.includes('ReadPatientMessage')) {
        return true;
    }
    return false;
};

const isPreviouslyCancelledSubscription = async (userId: string) => {
    if (!userId) {
        return false;
    }

    const statuses = await getGLP1Statuses(userId); //duplicate db call here, it's also in intakeViewDataFetch, could passed into the Dashboard instance somehow

    if (statuses.previously_canceled_subscription === true) {
        return true;
    }

    return false;
};
function getLastTwoCheckinResponses(checkinResponses: any[]) {
    const validIds = new Set([
        1058, 1194, 1218, 1821, 1718, 1811, 1730, 1230, 1704, 1694,
    ]); // These are the question IDs that ask about which dosage the patient has been taking

    const filteredResponses = checkinResponses
        .filter((item) => validIds.has(item.question_id)) // Keep only specified question_ids
        .sort(
            (a, b) =>
                new Date(b.submission_time).getTime() -
                new Date(a.submission_time).getTime()
        ); // Sort by submission time

    //ensure exactly two items, fill with null if necessary
    while (filteredResponses.length < 2) {
        filteredResponses.push(null);
    }

    return filteredResponses.slice(0, 2);
}

function converteTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
