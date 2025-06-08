'use client';

import useSWR from 'swr';
import { getProviderThreadList } from '@/app/utils/database/controller/messaging/thread_escalations/thread_escalations';
import PreviewCard from './preview-card/preview-card';
import { ButtonBase, Switch } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProviderMessageSearchFilter from './provider-message-dashboard-search-filter';
import SearchPreviewCard from './preview-card/search-preview-card';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { getOrderIdByPatientIdAndProductHref } from '@/app/utils/database/controller/orders/orders-api';
import {
    AllThreadIndividualThread,
    ProviderThreadData,
} from '@/app/types/messages/messages-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import CustomPagination from './pagination/custom-pagination-provider-portal';
import { getProviderLicensedStates } from '@/app/utils/database/controller/providers/providers-api';

interface ProviderMessageDashboardProps {
    userId: string;
}

export default function ProviderMessageDashboard({
    userId,
}: ProviderMessageDashboardProps) {
    const router = useRouter();

    const {
        data: threads_data,
        error: thread_error,
        isLoading: threads_Loading,
    } = useSWR(`provider-chat-threads`, () => getProviderThreadList());

    const {
        data: licensed_states,
        error: licensed_states_error,
        isLoading: licensed_states_is_loading,
    } = useSWR(`${userId}-licensed-states`, () => getProviderLicensedStates());

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchFilterValue, setSearchFilterValue] = useState<string>('');
    const [showMyMessageGroupsOnly, setShowMyMessageGroupsOnly] =
        useState<boolean>(true);
    const [filteredThreadArray, setFilteredThreadArray] =
        useState<AllThreadIndividualThread[]>();
    const [watchFilteredQueueThreads, setWatchFilteredThreads] =
        useState<ProviderThreadData[]>();

    useEffect(() => {
        if (threads_data) {
            console.log(threads_data);
            const watchFilteredSet = threads_data.filter(
                (thread: ProviderThreadData) => {
                    return (
                        thread.providers &&
                        (thread.providers.includes(userId) ||
                            userId === '24138d35-e26f-4113-bcd9-7f275c4f9a47' ||
                            userId === '025668ab-3f9e-4839-a0c5-75790305cfe9')
                    );
                }
            );
            setWatchFilteredThreads(watchFilteredSet);
        }
    }, [threads_data, showMyMessageGroupsOnly, userId]);

    console.log('wft ', watchFilteredQueueThreads);
    console.log('tl ', threads_data);

    if (threads_Loading || licensed_states_is_loading) {
        return <LoadingScreen />;
    }

    if (thread_error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const pushToProviderOrderView = async (
        patient_id: string,
        product_href: string
    ) => {
        const order_id = await getOrderIdByPatientIdAndProductHref(
            patient_id,
            product_href
        );
        router.push(`intakes/${order_id}`);
    };

    return (
        <>
            <div className='flex mt-20 flex-col justify-start w-full max-w-[600px]'>
                <BioType className=' text-primary itd-h1'>
                    Provider Escalated Message Groups
                </BioType>
                <BioType className='it-subtitle md:itd-subtitle'>
                    Patients are waiting to hear from you!
                </BioType>
            </div>

            <ProviderMessageSearchFilter
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
                            {filteredThreadArray.map(
                                (thread, index: number) => {
                                    if (
                                        !licensed_states?.includes(
                                            thread.threads.patient.state
                                        )
                                    ) {
                                        return;
                                    }

                                    return (
                                        <>
                                            <ButtonBase
                                                key={index}
                                                onClick={() => {
                                                    pushToProviderOrderView(
                                                        thread.threads
                                                            .patient_id,
                                                        thread.threads.product
                                                    );
                                                }}
                                            >
                                                <SearchPreviewCard
                                                    thread_data={thread}
                                                />
                                            </ButtonBase>
                                        </>
                                    );
                                }
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className='flex flex-col mt-4 w-full items-center gap-3 max-w-[600px] '>
                {filteredThreadArray && filteredThreadArray.length > 0 && (
                    <div className='flex w-full mt-4 mb-0 justify-start items-start'>
                        <BioType className='it-h1 text-primary'>
                            Queue Items:
                        </BioType>
                    </div>
                )}
                <div className='flex self-start justify-center items-center'>
                    <BioType
                        className={`${
                            !showMyMessageGroupsOnly
                                ? 'it-subtitle text-primary'
                                : 'it-body'
                        }`}
                    >
                        All Message Groups
                    </BioType>
                    <Switch
                        checked={showMyMessageGroupsOnly}
                        onChange={() => {
                            setShowMyMessageGroupsOnly((prev) => !prev);
                        }}
                    />
                    <BioType
                        className={`${
                            showMyMessageGroupsOnly
                                ? 'it-subtitle text-primary'
                                : 'it-body'
                        }`}
                    >
                        My Message Groups
                    </BioType>
                </div>

                {/**
                 * The below code is structured in the follwing way:
                 * There is a ternary state controlled by the switch above that shows providers either a filtered array or an unfiltered array
                 */}
                {!showMyMessageGroupsOnly ? (
                    <div className='flex flex-col gap-2'>
                        {(rowsPerPage > 0 && threads_data
                            ? threads_data.slice(
                                  (page - 1) * rowsPerPage, // Adjust to 0-based index
                                  (page - 1) * rowsPerPage + rowsPerPage // Adjust to 0-based index
                              )
                            : threads_data
                        )?.map((thread: ProviderThreadData, index: number) => {
                            if (
                                showMyMessageGroupsOnly &&
                                thread.providers &&
                                thread.providers.includes(userId)
                            ) {
                                return;
                            }

                            if (
                                !licensed_states?.includes(thread.patient_state)
                            ) {
                                return;
                            }

                            return (
                                <ButtonBase
                                    key={index}
                                    onClick={() => {
                                        pushToProviderOrderView(
                                            thread.patient_id,
                                            thread.product
                                        );
                                    }}
                                >
                                    <div className='flex cursor-pointer w-full'>
                                        <PreviewCard thread_data={thread} />
                                    </div>
                                </ButtonBase>
                            );
                        })}
                        {threads_data && (
                            <CustomPagination
                                count={threads_data.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)} // Prefix with _ to indicate intentional unuse
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event: any) => {
                                    setRowsPerPage(
                                        parseInt(event.target.value, 10)
                                    );
                                    setPage(1);
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div>
                        {(rowsPerPage > 0 && watchFilteredQueueThreads
                            ? watchFilteredQueueThreads.slice(
                                  (page - 1) * rowsPerPage, // Adjust to 0-based index
                                  (page - 1) * rowsPerPage + rowsPerPage // Adjust to 0-based index
                              )
                            : watchFilteredQueueThreads
                        )?.map((thread: any, index: number) => {
                            return (
                                <ButtonBase
                                    key={index}
                                    onClick={() => {
                                        pushToProviderOrderView(
                                            thread.patient_id,
                                            thread.product
                                        );
                                    }}
                                >
                                    <div className='flex cursor-pointer w-full'>
                                        <PreviewCard thread_data={thread} />
                                    </div>
                                </ButtonBase>
                            );
                        })}
                        {watchFilteredQueueThreads && (
                            <CustomPagination
                                count={watchFilteredQueueThreads.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)} // Prefix with _ to indicate intentional unuse
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event: any) => {
                                    setRowsPerPage(
                                        parseInt(event.target.value, 10)
                                    );
                                    setPage(1);
                                }}
                            />
                        )}
                    </div>
                )}

                <div className='flex mt-10'>
                    {!(showMyMessageGroupsOnly
                        ? watchFilteredQueueThreads
                        : threads_data) ||
                        ((showMyMessageGroupsOnly
                            ? watchFilteredQueueThreads
                            : threads_data
                        ).length < 1 && (
                            <BioType className='itd-h1'>
                                No new messages.
                            </BioType>
                        ))}
                </div>
            </div>
        </>
    );
}
