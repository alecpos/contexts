'use client';

import PatientInformationColumn from '../../../intake-view/v2/components/containers/patient-information-column';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TabColumn from '../../../intake-view/v2/components/containers/tab-container';
import { OrderType } from '@/app/types/orders/order-types';
import {
    determineProviderIntakeWidth,
    ProviderWidths,
} from '../../../intake-view/v2/components/containers/utils/minimizer-width-controller';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { INTAKE_WINDOW_WIDTHS } from '../../../intake-view/v2/constants/intake-v2-constants';
import useSWR from 'swr';
import { intakeViewDataFetch } from '../../../intake-view/v2/components/containers/utils/data-fetch/intake-view-datafetch';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { reportTaskFailure } from '@/app/utils/database/controller/tasks/task-api';
import { useParams } from 'next/navigation';
import React from 'react';

interface IntakeViewMainContainerProps {
    providerId: string;
    setCanProceed: Dispatch<SetStateAction<boolean>>;
    order_id: string;
    authorization: string | null;
}

export default function IntakeViewTaskContainer({
    providerId,
    setCanProceed,
    order_id,
    authorization,
}: IntakeViewMainContainerProps) {
    const params = useParams();
    const taskId = params.taskId as string;

    const {
        data: intakeFetchData,
        isLoading: fetchLoading,
        error: fetchError,
        mutate: mutateIntakeData,
    } = useSWR(`intake-view-${order_id}`, () => intakeViewDataFetch(order_id), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        revalidateIfStale: false,
        dedupingInterval: 5000,
        shouldRetryOnError: false,
    });

    const [widthArray, setWidthArray] = useState<ProviderWidths>({
        intake: INTAKE_WINDOW_WIDTHS.intake,
        patientInformation: INTAKE_WINDOW_WIDTHS.patientInformation,
        tabWindow: INTAKE_WINDOW_WIDTHS.tabWindow,
    });
    const [tabSelected, setTabSelected] = useState<string>('messages');
    const [clinicalNoteTextInputValue, setClinicalNoteTextInputValue] =
        useState<string>('');

    const [macroDestination, setMacroDestination] =
        useState<string>('messages');
    const [isIntakeMinimized, setIntakeMinimized] = useState<boolean>(false);
    const [isDemographicsMinimized, setDemographicsMinimized] =
        useState<boolean>(false);
    const [responseRequired, setResponseRequired] = useState<boolean>(true);

    // const [orderPillStatusState, setOrderPillStatusState] = useState<any>();
    const [messageContent, setMessageContent] = useState<string>('');

    // useEffect(() => {
    //     if (orderPillStatuses) {
    //         setOrderPillStatusState(orderPillStatuses);
    //     }
    // }, [orderPillStatuses]);

    useEffect(() => {
        setWidthArray(
            determineProviderIntakeWidth(
                isIntakeMinimized,
                isDemographicsMinimized
            )
        );
    }, [isIntakeMinimized, isDemographicsMinimized]);

    useEffect(() => {
        const handleProviderAudit = async () => {
            const time = new Date().getTime(); // Record start time

            const new_audit: ProviderActivityAuditCreateObject = {
                provider_id: (await readUserSession()).data.session?.user.id!,
                action: 'view_intake',
                timestamp: time,
                // metadata: {},
                environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
                ...(intakeFetchData?.orderType === OrderType.RenewalOrder
                    ? {
                          renewal_order_id:
                              intakeFetchData?.orderData.renewal_order_id,
                          order_id:
                              intakeFetchData?.orderData.original_order_id!,
                      }
                    : { order_id: intakeFetchData?.orderData.id }),
            };

            await createNewProviderActivityAudit(new_audit);
        };

        if (intakeFetchData?.orderData && intakeFetchData.orderType) {
            handleProviderAudit();
        }
    }, [intakeFetchData?.orderType, intakeFetchData?.orderData]);

    const reportTaskFailureFunction = async () => {
        await reportTaskFailure(parseInt(taskId));
    };

    if (!fetchLoading && !intakeFetchData) {
        reportTaskFailureFunction();
        setCanProceed(true);
        return <LoadingScreen />;
    }

    if (fetchLoading || !intakeFetchData) {
        return <LoadingScreen />;
    }

    return (
        <div
            id='main_container'
            className='flex flex-col px-8 pt-1 pb-6 gap-0'
        ></div>
    );
}
