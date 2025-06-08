'use client';

import useSWR from 'swr';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getCoordinatorThreadList } from '@/app/utils/database/controller/messaging/thread_escalations/thread_escalations';
import PreviewCard from './preview-card/preview-card';
import { ButtonBase, Pagination, Stack, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CoordinatorMessageSearchFilter from './message-dashboard-search-filter';
import SearchPreviewCard from './preview-card/search-preview-card';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import { AllThreadIndividualThread } from '@/app/types/messages/messages-types';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';

interface CoordinatorMessageDashboardProps {}
const ITEMS_PER_PAGE = 10; // Number of items per page

export default function CoordinatorMessageDashboard({}: CoordinatorMessageDashboardProps) {
    const router = useRouter();

    const {
        data: threads_data,
        error: thread_error,
        isLoading: threads_Loading,
    } = useSWR(`coordinator-chat-threads`, () => getCoordinatorThreadList());
    const [currentPage, setCurrentPage] = useState(1);

    const [searchFilterValue, setSearchFilterValue] = useState<string>('');
    const [filteredThreadArray, setFilteredThreadArray] =
        useState<AllThreadIndividualThread[]>();

    if (threads_Loading) {
        return <LoadingScreen />;
    }

    if (thread_error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const handlePageChange = (event: any, page: any) => {
        setCurrentPage(page);
    };

    const pushToThreadIdView = (event: React.MouseEvent, thread_id: number) => {
        const url = `/coordinator/thread-view/${thread_id}`;

        if (event.metaKey) {
            // Open in a new tab
            window.open(url, '_blank');
        } else {
            // Navigate in the same tab
            router.push(url);
        }
    };

    const totalItems = threads_data?.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = threads_data.slice(startIndex, endIndex);

    return (
        <>
            <div className='flex mt-20 flex-col justify-start w-full max-w-[600px]'>
                <BioType className=' text-primary itd-h1'>
                    Message Queue
                </BioType>
                <BioType className='it-subtitle md:itd-subtitle'>
                    Patients are waiting to hear from you!
                </BioType>
            </div>

            <CoordinatorMessageSearchFilter
                searchFilterValue={searchFilterValue}
                setSearchFilterValue={setSearchFilterValue}
                setFilteredThreadArray={setFilteredThreadArray}
            />
            <div className='flex flex-col w-full max-w-[600px]'>
                {filteredThreadArray && (
                    <>
                        <div className='flex mt-2 mb-1 justify-start items-start justify-self-start w-full max-w-[600px]'>
                            <BioType className='it-h1 text-primary'>
                                Search Results:
                            </BioType>
                        </div>
                        {searchFilterValue &&
                            filteredThreadArray.length == 0 && (
                                <div className='flex flex-col gap-3'>
                                    <BioType>No results found</BioType>
                                    <div className='flex flex-col h-[1px]'>
                                        <HorizontalDivider
                                            backgroundColor='#A7A7A7'
                                            height={1}
                                        />
                                    </div>
                                </div>
                            )}
                        <div className='flex flex-col gap-3'>
                            {filteredThreadArray.map((thread, index) => {
                                return (
                                    <>
                                        <Tooltip
                                            key={index}
                                            title={
                                                <>
                                                    <div>Open thread</div>{' '}
                                                    <div>
                                                        ⌘-Click for new tab
                                                    </div>
                                                </>
                                            }
                                            placement='right'
                                        >
                                            <ButtonBase
                                                onClick={(e) => {
                                                    /**
                                                     * @author Nathan Cho
                                                     * I put a time out to implement button base so I can add the ripple effect.
                                                     * However I needed to add the timeout because the state change happened faster than the animation playing.
                                                     */
                                                    setTimeout(() => {
                                                        pushToThreadIdView(
                                                            e,
                                                            thread.thread_id
                                                        );
                                                    }, 200); // Delay in milliseconds
                                                }}
                                            >
                                                <SearchPreviewCard
                                                    thread_data={thread}
                                                />
                                            </ButtonBase>
                                        </Tooltip>
                                    </>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <div>
                <div className='flex flex-col mt-4 w-full items-center gap-3'>
                    {currentItems.map((thread: any, index: number) => (
                        <Tooltip
                            key={index}
                            title={
                                <>
                                    <div>Open thread</div>{' '}
                                    <div>⌘-Click for new tab</div>
                                </>
                            }
                            placement='right'
                        >
                            <ButtonBase
                                onClick={(e) => {
                                    /**
                                     * @author Nathan Cho
                                     * I put a time out to implement button base so I can add the ripple effect.
                                     * However I needed to add the timeout because the state change happened faster than the animation playing.
                                     */
                                    setTimeout(() => {
                                        pushToThreadIdView(e, thread.thread_id);
                                    }, 200); // Delay in milliseconds
                                }}
                            >
                                <div className='flex cursor-pointer w-full'>
                                    <PreviewCard thread_data={thread} />
                                </div>
                            </ButtonBase>
                        </Tooltip>
                    ))}
                </div>
                <div className='w-full flex justify-center mt-8 mb-24'>
                    <Stack spacing={2} className='pagination-controls'>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            color='primary'
                            onChange={handlePageChange}
                        />
                    </Stack>
                </div>
            </div>
        </>
    );
}
