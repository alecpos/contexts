'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import {
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    Paper,
    TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllThreadEscalations } from '@/app/utils/database/controller/messaging/thread_escalations/thread_escalations';
import useSWR from 'swr';
import { AllThreadIndividualThread } from '@/app/types/messages/messages-types';

interface ProviderMessageFilterProps {
    searchFilterValue: string;
    setSearchFilterValue: Dispatch<SetStateAction<string>>;
    setFilteredThreadArray: Dispatch<
        SetStateAction<AllThreadIndividualThread[] | undefined>
    >;
}

export default function ProviderMessageSearchFilter({
    searchFilterValue,
    setSearchFilterValue,
    setFilteredThreadArray,
}: ProviderMessageFilterProps) {
    const {
        data: all_threads_array,
        error: all_threads_error,
        isLoading: all_threads_Loading,
    } = useSWR(`all-chat-threads`, () => getAllThreadEscalations());

    //getAllThreadEscalations

    const filterThreads = () => {
        if (all_threads_Loading || all_threads_error || !all_threads_array) {
            setFilteredThreadArray(undefined);
            return;
        }

        if (!searchFilterValue || searchFilterValue.length < 3) {
            setFilteredThreadArray(undefined);
            return;
        }

        const searchTerms = searchFilterValue.split(' ');
        const filteredThreads = all_threads_array.filter((thread) => {
            // Create a combined string of fields to search in
            const searchableString = `${
                thread.threads.patient?.first_name ?? ''
            } ${thread.threads.patient?.last_name ?? ''} ${
                thread.threads.patient?.email ?? ''
            } ${thread.threads.product ?? ''}`.toLowerCase();

            // Check if all search terms are included in the searchable string
            return searchTerms.every((term) => {
                const regex = new RegExp(term, 'i'); // 'i' for case-insensitive
                return regex.test(searchableString);
            });
        });

        // Use a Set to remove duplicates based on thread_id
        const uniqueThreadIDs = Array.from(
            new Set(filteredThreads.map((thread) => thread.thread_id))
        );
        const uniqueThreads = uniqueThreadIDs
            .map((id) =>
                filteredThreads.find((thread) => thread.thread_id === id)
            )
            .filter(
                (thread) => thread !== undefined
            ) as AllThreadIndividualThread[];

        setFilteredThreadArray(uniqueThreads);
    };

    useEffect(() => {
        filterThreads();
    }, [searchFilterValue]);

    const handleInput = (e: { target: { value: SetStateAction<string> } }) => {
        setSearchFilterValue(e.target.value);
    };

    return (
        <>
            <div className='flex w-full items-center justify-center mt-2'>
                <Paper
                    component='form'
                    sx={{
                        padding: '.25em',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '25px',
                        boxShadow: 'none',
                        border: '1px solid #ced4da',
                        maxWidth: '600px',
                        width: '100%', // Adjust this if you need the unexpanded state to have a different width
                        transition: 'max-width 0.3s ease-in-out',
                        marginRight: '0px',
                        marginTop: '0px',
                        '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.87)',
                        },
                        '& .MuiInputBase-root': {
                            marginRight: '0px',
                        },
                        '& .MuiInputBase-input': {
                            transition: 'width 0.3s ease-in-out',
                            width: '100%',
                        },
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        className='body1'
                        placeholder='Search patients by name or prescription'
                        inputProps={{
                            'aria-label':
                                'search patients by name or prescription',
                        }}
                        startAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle search'
                                    // onClick={() => setIsExpanded(true)}
                                    edge='start'
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        // autoFocus={isExpanded}
                        // inputRef={inputRef}
                        // onBlur={handleBlur}
                        onChange={handleInput}
                        value={searchFilterValue}
                        fullWidth
                    />
                </Paper>
            </div>
        </>
    );
}
