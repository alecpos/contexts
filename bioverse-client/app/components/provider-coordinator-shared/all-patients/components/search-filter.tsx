import { FormControl, TextField, Button, Chip, debounce } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface SearchFilterProps {
    addFilter: (value: string) => void;
    filters: string[];
    clearFilters: (text: string) => void;
}

export default function AllPatientsSearchFilter({
    addFilter,
    filters,
    clearFilters,
}: SearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmedTerm = searchTerm.trim();
            if (trimmedTerm.length < 2) return; // Minimum length check
            if (filters.includes(trimmedTerm)) return; // Duplicate check
            addFilter(trimmedTerm);
            setSearchTerm('');
        },
        [searchTerm, addFilter, filters]
    );

    const renderChips = filters.map((filter_item) => (
        <Chip
            key={filter_item}
            label={
                <div
                    className='flex flex-row items-center body2 gap-1 hover:cursor-pointer'
                    onClick={() => {
                        clearFilters(filter_item);
                    }}
                >
                    {filter_item}
                    <CloseIcon fontSize={'small'} />
                </div>
            }
        />
    ));

    return (
        <form
            onSubmit={handleSubmit}
            className='flex w-full justify-end'
            role='search'
            aria-label='Search filters'
        >
            <div className='flex flex-row justify-end items-center mr-8 gap-2'>
                {renderChips}
            </div>
            <div className='flex flex-row w-[50%]'>
                <FormControl
                    variant='outlined'
                    style={{ marginRight: '0px' }}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        id='search-term-input'
                        label='Search Term'
                        variant='outlined'
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                    />
                </FormControl>
            </div>
            <Button type='submit' style={{ display: 'none' }}>
                Submit
            </Button>
        </form>
    );
}
