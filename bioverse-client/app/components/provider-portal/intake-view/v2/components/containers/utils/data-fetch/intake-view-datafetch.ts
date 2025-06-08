'use server';

import { OrderType } from '@/app/types/orders/order-types';
import { getOrderPillStatus } from '@/app/utils/actions/intake/order-util';
import {
    getQuestionnaireResponseForProduct_with_version,
    filterCheckupResponses,
    categorizeCheckupResponse,
    getGLP1Statuses,
    getCheckupResponsesWithoutSession,
    getAllCheckupResponsesWithSession,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import {
    fetchOrderData,
    getAllOrdersForPatient,
    getBaseOrderById,
    getCurrentAssignedDosageForOrder,
    getFirstCompletedOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { getUserStatusTag } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getRenewalSubmissionTimes } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { concat } from 'lodash';
import { Dashboard, TitleInformation } from '@/app/utils/classes/Dashboard';
import {
    CheckupResponse,
    CheckupResponseReturn,
} from '@/app/types/questionnaires/questionnaire-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { TaskViewQuestionData } from '@/app/types/questionnaires/questionnaire-types';

/**
 * Fetches data required for a provider to review a new intake OR a renewal order
 * Used in ProviderReviewTopInfoComponent and elsewhere
 * @param orderId - The order ID
 * @returns The data required for the intake view
 */
export async function intakeViewDataFetch(orderId: string) {
    // First fetch order data as it's required for subsequent calls
    const { type: orderType, data: orderData } = await fetchOrderData(orderId);
    if (!orderData) throw new Error('Order data not found');

    const patient_id =
        orderType === OrderType.Order
            ? orderData.customer_uid
            : orderData.customer_uuid;

    // Group independent API calls together
    const [
        current_assigned_dosage,
        checkupResponses,
        submissionTimes,
        glp1Statuses,
        patientData,
        statusTagData,
        patient_order_product_array,
    ] = await Promise.all([
        getCurrentAssignedDosageForOrder(
            orderType === OrderType.Order
                ? orderData.id
                : orderData.renewal_order_id.split('-')[0]
        ),
        getCheckupResponsesWithoutSession(patient_id, orderData?.product_href),
        getRenewalSubmissionTimes(patient_id, orderData?.product_href),
        getGLP1Statuses(patient_id),
        getPatientInformationById(patient_id).then((res) => res.data),
        getUserStatusTag(patient_id, orderId).then((res) => res.data),
        getAllOrdersForPatient(patient_id),
    ]);

    // Get questionnaire response

    let baseOrderId = orderId;

    if (orderData.renewal_order_id) {
        baseOrderId = orderData.original_order_id;
    }

    const baseOrder = await getBaseOrderById(Number(baseOrderId));

    let questionnaire_target_product_href = orderData.product_href;
    let questionnaire_target_version =
        orderType === OrderType.Order
            ? orderData?.question_set_version
            : orderData?.order.question_set_version;

    if (baseOrder?.metadata?.selected_product) {
        questionnaire_target_product_href = PRODUCT_HREF.WEIGHT_LOSS;
    }

    if (baseOrder?.metadata.edSelectionData) {
        questionnaire_target_product_href = PRODUCT_HREF.ED_GLOBAL;
    }

    const questionnaire_response =
        await getQuestionnaireResponseForProduct_with_version(
            patient_id,
            questionnaire_target_product_href,
            questionnaire_target_version
        ).then(async (response) => {
            if (response.length === 0) {
                return getQuestionnaireResponseForProduct_with_version(
                    patient_id,
                    orderData?.product_href,
                    1
                );
            }
            return response;
        });

    /**
     * Check to add GLP-1 check-ins for zofran product.
     */
    let checkupResponsesWithGLP1: CheckupResponse[] = [];
    if (orderData?.product_href === PRODUCT_HREF.ZOFRAN) {
        const checkupResponsesWithSemaglutide =
            await getCheckupResponsesWithoutSession(
                patient_id,
                PRODUCT_HREF.SEMAGLUTIDE
            );

        const checkupResponsesWithTirzeptide =
            await getCheckupResponsesWithoutSession(
                patient_id,
                PRODUCT_HREF.TIRZEPATIDE
            );

        checkupResponsesWithGLP1 = [
            ...checkupResponsesWithSemaglutide,
            ...checkupResponsesWithTirzeptide,
        ];
    }

    const updatedCheckupResponses = [
        ...checkupResponses,
        ...checkupResponsesWithGLP1,
    ];

    // Process checkup responses
    const checkupResponsesFiltered = await filterCheckupResponses(
        updatedCheckupResponses
    );

    const categorizedCheckupResponses = (
        await categorizeCheckupResponse(
            checkupResponsesFiltered,
            orderData?.product.name,
            submissionTimes
        )
    ).filter(
        (checkup) =>
            !checkup.responses.every((response) => response.answer === null)
    );

    // Get order pill statuses
    const orderPillStatuses = await getOrderPillStatus(
        orderType === OrderType.Order ? orderId : orderData?.original_order_id,
        orderData?.order_status,
        orderData?.product_href
    );

    const otherProductPromises = patient_order_product_array
        .filter((item) => item.product_href !== orderData?.product_href)
        .map(async (item) => {
            const response =
                await getQuestionnaireResponseForProduct_with_version(
                    patient_id,
                    item.product_href,
                    item.question_set_version
                );

            if (response.length > 0) {
                return {
                    product_name: item.product_href,
                    responses: response,
                    submission_time: item.created_at,
                };
            }
            return null;
        });

    const otherProductResponses = (
        await Promise.all(otherProductPromises)
    ).filter(
        (response): response is CheckupResponseReturn => response !== null
    );

    const otherProductResponses_filtered = otherProductResponses.filter(
        (response) => response.responses.length > 0
    );

    const firstOrder = await getFirstCompletedOrder(
        patient_id,
        orderData.product_href
    );

    let isFirstOrder = true;
    if (firstOrder) {
        if (orderType === OrderType.Order) {
            if (firstOrder.id !== orderData.id) {
                isFirstOrder = false;
            }
        }
    }

    const intakeEntry: CheckupResponseReturn = {
        product_name: orderData?.product.name,
        responses: questionnaire_response,
        index: 0,
        submission_time:
            orderType === OrderType.Order
                ? isFirstOrder
                    ? orderData.created_at
                    : firstOrder?.created_at
                : submissionTimes[orderData?.original_order_id],
    };

    const dashboard = new Dashboard(orderData, orderType);

    let dashboardTitle: TitleInformation;
    let currentMonth;
    let subscriptionRenewalDate;

    try {
        currentMonth = await dashboard.getCurrentMonth();
        dashboardTitle = await dashboard.getDashboardTitle();
        subscriptionRenewalDate = await dashboard.getSubscriptionRenewalDate();
    } catch (error) {
        dashboardTitle = {
            taskName:
                'Error in fetching Title - Please send to Engineering with message: Dashboard Title Issue Code 3',
            currentOrder: '',
            upcomingOrder: '',
        };
        currentMonth = 1;
        subscriptionRenewalDate =
            'Error in fetching Title - Please send to Engineering with message: Dashboard Title Issue Code 3';

        console.log('datafetch dashboard error log', error);
    }

    function convertToTaskViewQuestionData(
        checkupResponse: CheckupResponseReturn
    ): TaskViewQuestionData {
        return {
            product_name: checkupResponse.product_name,
            submission_time: checkupResponse.submission_time,
            responses: checkupResponse.responses.map((response) => ({
                question_id: response.question_id,
                question: {
                    question: response.question.question,
                    options: response.question.options,
                    noneBox: response.question.noneBox ?? false,
                    other: response.question.other ?? false,
                },
                answer: {
                    answer: response.answer?.answer || '',
                    question:
                        response.answer?.question || response.question.question,
                    formData: response.answer?.formData || [],
                },
            })),
        };
    }

    // here

    // Convert initial data to TaskViewQuestionData early
    const initialTaskViewData = concat<CheckupResponseReturn>(
        [intakeEntry],
        otherProductResponses_filtered,
        categorizedCheckupResponses
    ).map(convertToTaskViewQuestionData);

    // Get checkup responses with session
    const checkupResponsesWithSession = await getAllCheckupResponsesWithSession(
        patient_id
    );

    // Combine the initial data with the checkup responses
    const combinedTaskViewData = [
        ...initialTaskViewData,
        ...checkupResponsesWithSession,
    ];

    return {
        patientData,
        orderData,
        orderType,
        intakeResponses: combinedTaskViewData,
        orderPillStatuses,
        statusTag: statusTagData?.status_tag,
        currentDosage: current_assigned_dosage,
        currentMonth: currentMonth, //from the Dashboard instance
        dashboardTitle: dashboardTitle, //from the Dashboard instance
        subscriptionRenewalDate: subscriptionRenewalDate, //from the Dashboard instance
        glp1Statuses,
    };
}

//
