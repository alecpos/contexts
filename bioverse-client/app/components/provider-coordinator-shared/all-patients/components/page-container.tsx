'use client';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getAllProfiles,
    searchProfilesUsingValue,
} from '@/app/utils/database/controller/profiles/profiles';
import useSWR from 'swr';
import LoadingScreen from '../../../global-components/loading-screen/loading-screen';
import AllPatientsSearchFilter from './search-filter';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import AllPatientsTableRow from './all-patients-table-row';

interface AllPatientsContainerProps {
    access_type: BV_AUTH_TYPE | null;
}

export default function AllPatientsPageContainer({
    access_type,
}: AllPatientsContainerProps) {
    const [mounted, setMounted] = useState(false);
    const [filters, setFilters] = useState<string[]>([]);
    const [filteredProfiles, setFilteredProfiles] = useState<APProfile[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, isLoading, error } = useSWR(
        ['all-patients-all-profiles', filters], // Simplified key
        async () => {
            return filters.length === 0
                ? getAllProfiles()
                : searchProfilesUsingValue(filters);
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 5000, // Add caching
            keepPreviousData: true, // Keep previous data while loading
        }
    );

    useEffect(() => {
        if (data) {
            setFilteredProfiles(data.profiles as APProfile[]);
        }
    }, [data]);

    if (!mounted) {
        return null;
    }

    const addFilter = (value: string) => {
        // Split the value by spaces, trim each value, and filter out empty strings
        const valueArray = value
            .split(' ')
            .map((v) => v.trim())
            .filter((v) => v !== '');

        setFilters((prev) => {
            // Create a new array with all unique values
            const combinedValues = [...new Set([...prev, ...valueArray])];
            return combinedValues;
        });

        setPage(0); // Reset pagination when adding new filters
    };

    const clearFilters = (text: string) => {
        setFilters(filters.filter((filterItem) => filterItem !== text));
    };

    return (
        <>
            <Paper className='w-full p-4 min-h-[75vh]' elevation={3}>
                <div
                    id='profile-search-filter'
                    className='flex flex-row w-full'
                >
                    {filters.length > 0 && (
                        <div className='flex flex-row w-[20%] items-center'>
                            <BioType className='body1 p-2'>
                                Search Results: {filteredProfiles.length}
                            </BioType>
                            <Button
                                color='error'
                                variant='contained'
                                sx={{
                                    paddingX: 0,
                                    paddingY: 2,
                                    height: '20px',
                                    fontSize: '14px',
                                }}
                                onClick={() => {
                                    setFilters([]);
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                    <AllPatientsSearchFilter
                        addFilter={addFilter}
                        filters={filters}
                        clearFilters={clearFilters}
                    />
                </div>

                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <BioType className='subtitle2'>
                                    Patient Name
                                </BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>State</BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>Sex</BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>
                                    Date of Birth
                                </BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>Phone #</BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>Email</BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>Status</BioType>
                            </TableCell>
                            <TableCell>
                                <BioType className='subtitle2'>
                                    Patient Since
                                </BioType>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center w-full py-8'>
                            <LoadingScreen />
                        </div>
                    ) : (
                        <TableBody>
                            {(rowsPerPage > 0 && filteredProfiles
                                ? filteredProfiles.slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                  )
                                : filteredProfiles
                            ).map((profile: APProfile, index) => (
                                <AllPatientsTableRow
                                    profile={profile}
                                    router={router}
                                    access_type={access_type}
                                    key={profile.id} // Use profile.id instead of index
                                />
                            ))}
                        </TableBody>
                    )}

                    {!isLoading && (
                        <TablePagination
                            className='w-full' // Replace style={{width: '150%'}}
                            component='div'
                            count={filteredProfiles.length}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)} // Simplified
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(
                                    parseInt(event.target.value, 10)
                                );
                                setPage(0);
                            }}
                        />
                    )}
                </Table>
            </Paper>
        </>
    );
}
