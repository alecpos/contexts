import {
    FormControl,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    Button,
    Chip,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface SearchFilterProps {
    addFilter: (value: string) => void;
    filters: string;
    clearFilters: () => void;
}

export default function ProviderHistorySearchFilter({
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addFilter(searchTerm);
        setSearchTerm('');
    };

    return (
        <form onSubmit={handleSubmit} className='flex w-full items-center'>
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
                        label='Search Patient History'
                        variant='outlined'
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                    />
                </FormControl>
            </div>
            <div className='flex flex-row justify-end items-center gap-2 overflow-hidden ml-4'>
                {filters && (
                    <Chip
                        label={
                            <div
                                className='flex flex-row items-center body2 gap-1 hover:cursor-pointer'
                                onClick={() => {
                                    clearFilters();
                                }}
                            >
                                {filters}
                                <CloseIcon fontSize={'small'} />
                            </div>
                        }
                    />
                )}
            </div>
            <Button type='submit' style={{ display: 'none' }}>
                Submit
            </Button>
        </form>
    );
}
