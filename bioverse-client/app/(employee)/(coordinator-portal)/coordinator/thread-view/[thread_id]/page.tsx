'use server';

import CoordinatorThreadView from '@/app/components/coordinator-portal/thread-view/thread-view-main';
import React from 'react';

interface CoordinatorThreadViewProps {
    params: {
        thread_id: number;
    };
}

export default async function CoordinatorThreadViewPage({
    params,
}: CoordinatorThreadViewProps) {
    return (
        <>
            <CoordinatorThreadView thread_id={params.thread_id} />
        </>
    );
}
