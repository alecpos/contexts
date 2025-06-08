'use client';

import { getPatientThreadData } from '@/app/utils/database/controller/messaging/threads/threads';
import useSWR from 'swr';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';
import PreviewListContainer from './preview-list/preview-list-container';
import QuickSupport from './preview-list/quickSupport';
import ThreadNewContainer from './thread-container/thread-container-new';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';

interface MessageMainContainerProps {
    user_id: string;
}

export default function MessageMainContainer({
    user_id,
}: MessageMainContainerProps) {
    /**
     * SWR method to obtain thread ID list
     */
    const {
        data: thread_data,
        error: thread_error,
        isLoading: threads_Loading,
    } = useSWR(`chat-threads`, () => getPatientThreadData());

    //Thread display is built as SAP, so we do not set thread on render, but on click will set the thread.
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>();

    const setThreadToView = (thread_id: string | null) => {
        setSelectedThreadId(thread_id);
        scrollToTop();
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (threads_Loading) {
        return (
            <div className='h-screen'>
                <LoadingScreen />
            </div>
        );
    }

    if (thread_error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <div className='w-full flex justify-center'>
            {selectedThreadId ? (
                <div className='flex flex-col w-full max-h-screen overflow-hidden'>
                    <ThreadNewContainer
                        thread_id={selectedThreadId}
                        setThreadToView={setThreadToView}
                        user_id={user_id}
                    />
                </div>
            ) : (
                <PreviewListContainer
                    thread_preview_data={thread_data!}
                    setThreadToView={setThreadToView}
                />
            )}
        </div>
    );
}
