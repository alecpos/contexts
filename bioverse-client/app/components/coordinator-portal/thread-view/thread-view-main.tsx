'use client';

import useSWR from 'swr';
import { getPatientAndOrderDataWithThreadId } from './provider-view-clone/utils/data-fetching/coordinator-thread-data-fetch';
import CoordinatorThreadViewMainContainer from './provider-view-clone/components/containers/coordinator-main-view-container';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import React from 'react';

interface CoordinatorThreadViewProps {
    thread_id: number;
}

export default function CoordinatorThreadView({
    thread_id,
}: CoordinatorThreadViewProps) {
    const {
        data: thread_data,
        error: thread_error,
        isLoading: threads_Loading,
        mutate,
    } = useSWR(`${thread_id}-patient-order-data`, () =>
        getPatientAndOrderDataWithThreadId(thread_id)
    );

    if (threads_Loading || !thread_data?.patient_data) {
        return <LoadingScreen />;
    }

    if (thread_error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const mutateSWRData = () => {
        mutate();
    };

    console.log('SWR DATA on TVMain : ', thread_data);

    return (
        <>
            <CoordinatorThreadViewMainContainer
                patient_data={thread_data!.patient_data!}
                order_data={thread_data!.order_data!}
                thread_id={thread_id}
                escalation_data={thread_data.thread_data?.escalation}
                mutateSWRData={mutateSWRData}
            />
        </>
    );
}
