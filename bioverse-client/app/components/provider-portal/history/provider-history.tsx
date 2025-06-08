'use client';

import { getProviderHistoryAuditDetails } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import DateRangePicker from './date-picker';
import ProviderHistorySearchFilter from './history-search-filter';
import { isEmpty } from 'lodash';

interface ProviderHistoryComponentProps {
    userId: string;
}

export default function ProviderHistoryComponent({
    userId,
}: ProviderHistoryComponentProps) {
    const { data, isLoading, error, mutate } = useSWR(`provider-history`, () =>
        getProviderHistoryAuditDetails(userId)
    );

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [filteredData, setFilteredData] = useState<any[] | null>(null);
    const [filters, setFilters] = useState<string>('');

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
    const [endDate, setEndDate] = useState<Date>(today);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function applyFilter(): any[] {
        if (!data) {
            return [];
        }

        // Convert startDate and endDate to timestamps for easy comparison
        const startTimestamp = startDate?.getTime() ?? 0;
        const endTimestamp = endDate?.getTime() ?? Date.now();

        // Convert the search value to lowercase for case-insensitive comparison
        const searchValue = filters?.toLowerCase() ?? '';

        return data.filter((record: any) => {
            if (!record) return false;

            // Convert created_at to a Date object and get its timestamp
            const recordDate = new Date(record.created_at).getTime();

            // Check if the recordDate is within the specified date range
            const isWithinDateRange =
                recordDate >= startTimestamp && recordDate <= endTimestamp;

            // Check if the search value matches any of the specified fields
            const matchesSearchValue =
                (record.profile_email?.toLowerCase() ?? '').includes(
                    searchValue
                ) ||
                (record.profile_first_name?.toLowerCase() ?? '').includes(
                    searchValue
                ) ||
                (record.profile_last_name?.toLowerCase() ?? '').includes(
                    searchValue
                );

            return isWithinDateRange && matchesSearchValue;
        });
    }

    useEffect(() => {
        setFilteredData(applyFilter());
    }, [filters, startDate, endDate, data]);

    function formatDate(dateString: string): string {
        const date = new Date(dateString);

        // Get the weekday
        const weekdays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        const weekday = weekdays[date.getUTCDay()];

        // Get the month, day, and year
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getUTCDate()).padStart(2, '0');
        const year = date.getUTCFullYear();

        // Format the date as MM-DD-YYYY
        const formattedDate = `${month}-${day}-${year}`;

        return `${weekday}, ${formattedDate}`;
    }

    const addFilter = (value: string) => {
        setFilters(value);
    };

    const clearFilters = () => {
        setFilters('');
    };

    return (
        <div className='flex flex-col p-10'>
            <div className='flex flex-row'>
                <ProviderHistorySearchFilter
                    addFilter={addFilter}
                    filters={filters}
                    clearFilters={clearFilters}
                />
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Patient</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Date of Care</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data &&
                            (isEmpty(filteredData) ? data : filteredData)
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((record: any, index: number) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div
                                                    className='text-primary hover:underline cursor-pointer'
                                                    onClick={() => {
                                                        window.open(
                                                            `/provider/intakes/${
                                                                record.renewal_order_id ??
                                                                record.order_id
                                                            }`
                                                        );
                                                    }}
                                                >
                                                    {record.renewal_order_id ??
                                                        record.order_id}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    onClick={() => {
                                                        window.open(
                                                            `/provider/all-patients/${record.customer_uid}`,
                                                            '_blank'
                                                        );
                                                    }}
                                                    className='text-primary hover:underline cursor-pointer'
                                                >
                                                    {record.profile_first_name}{' '}
                                                    {record.profile_last_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {record.profile_date_of_birth}
                                            </TableCell>
                                            <TableCell>
                                                {record.profile_email}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(record.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredData ? filteredData.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}
