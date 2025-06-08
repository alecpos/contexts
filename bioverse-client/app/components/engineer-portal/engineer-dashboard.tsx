'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import useSWR, { MutatorCallback, MutatorOptions } from 'swr';
import { EngineerDashboardFetch } from '@/app/utils/actions/engineer/dashboard-scripts';
import LoadingScreen from '../global-components/loading-screen/loading-screen';
import { useEffect, useState } from 'react';
import React from 'react';
import EngineeringTableItem from './components/dashboard-table-item/eng-dashboard-table-record';

interface Props {
    current_user_id: string;
}

export default function EngineerDashboardTable({ current_user_id }: Props) {
    const {
        data: intake_list,
        isLoading: intake_list_isLoading,
        mutate: mutate_intake_list,
    } = useSWR(`$engineer-intake-list`, () => EngineerDashboardFetch(), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        revalidateIfStale: false,
        dedupingInterval: 5000,
        shouldRetryOnError: false,
    });

    const [metadataFilter, setMetadataFilter] = useState<string>('');
    const [filteredIntakeList, setFilteredIntakeList] = useState<
        PatientOrderEngineerDetails[]
    >([]);
    const [newQueueItemsToday, setNewQueueItemsToday] = useState<number>(0);

    useEffect(() => {
        if (metadataFilter !== '') {
            if (intake_list) {
                const filtered = intake_list.filter(
                    (item) => item.metadata.renewalSpecialCase == metadataFilter
                );
                setFilteredIntakeList(filtered);
            }
        } else {
            // If no filter is applied, show all items
            setFilteredIntakeList(intake_list || []);
        }

        // Count new orders today
        if (intake_list) {
            const newQueueItemsToday = intake_list?.filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at).toDateString() ===
                        new Date().toDateString()
            ).length;
            setNewQueueItemsToday(newQueueItemsToday || 0);
        }
    }, [metadataFilter, intake_list]);

    if (intake_list_isLoading) {
        return <LoadingScreen />;
    }

    const options = [
        {
            id: 'BugTracking',
            name: 'Tracking Bug - No Pending Patient',
            color: 'text-blue-500',
        },
        {
            id: 'PatientNeedsScript',
            name: 'Patient Needs Script',
            color: 'text-red-500',
        },
        {
            id: 'NeedDiscussion',
            name: 'Needs Discussion',
            color: 'text-orange-600',
        },
        {
            id: 'Unknown',
            name: 'Issue Unknown',
            color: 'text-black',
        },
    ];

    return (
        <>
            <div className='w-full px-10'>
                <BioType className='mt-10 mb-[2rem] ml-10 text-[2.5em] font-light'>
                    # of Orders: {intake_list?.length}
                </BioType>

                <BioType className='mt-4 mb-[3rem] ml-10 text-[1.5em] text-weak'>
                    New orders today:
                    <span className='font-bold ml-2'>{newQueueItemsToday}</span>
                </BioType>

                <Paper className='px-4 pb-8 mx-10'>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row justify-start flex-grow p-4 items-center gap-2'>
                            <BioType className='it-subtitle'>
                                Filter to Special Case:{' '}
                            </BioType>
                            <Select
                                value={metadataFilter}
                                onChange={(e) => {
                                    setMetadataFilter(e.target.value);
                                }}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={''}>None</MenuItem>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        <BioType className={`${option.color}`}>
                                            {option.name}
                                        </BioType>
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Renewal Case: </TableCell>
                                <TableCell>Order ID</TableCell>

                                {/* <TableCell
                                onClick={() =>
                                    handleSort('statusTag')
                                }
                            >
                                Status Tags
                                {renderSortArrow('statusTag')}
                            </TableCell> */}

                                <TableCell>Note</TableCell>
                                <TableCell>Time Since Escalation</TableCell>
                                <TableCell>Assignment</TableCell>
                                <TableCell>Sent by</TableCell>
                                <TableCell>Change Status Tag</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {intake_list &&
                                (filteredIntakeList
                                    ? filteredIntakeList
                                    : intake_list
                                ).map((order, index) => {
                                    return (
                                        <EngineeringTableItem
                                            key={index}
                                            order={order}
                                            mutate_intake_list={
                                                mutate_intake_list
                                            }
                                            current_user_id={current_user_id}
                                        />
                                    );
                                })}
                        </TableBody>
                    </Table>
                </Paper>
                {/* {!intake_list ||
                (intake_list.length === 0 && (
                    <div className='my-10 text-center italic'>
                        No requests
                    </div>
                ))} */}
            </div>
        </>
    );
}
