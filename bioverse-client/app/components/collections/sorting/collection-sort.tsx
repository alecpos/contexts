'use client';

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

interface Props {
    setSorting: (criteria: string) => void;
}

export default function CollectionSort({ setSorting }: Props) {
    const [sorting, setSortingLocal] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        const selectedSorting = event.target.value as string;
        setSortingLocal(selectedSorting);
        setSorting(selectedSorting);
    };

    return (
        <Box sx={{ width: '23%' }}>
            <FormControl fullWidth>
                <InputLabel id="sort-label" className="body1">
                    Sort by
                </InputLabel>
                <Select
                    labelId="sort-label"
                    id="sort-select"
                    value={sorting}
                    label="Sort By"
                    onChange={handleChange}
                >
                    <MenuItem value={'best-selling'}>Best Selling</MenuItem>
                    <MenuItem value={'alphabetical'}>
                        Alphabetical: A-Z
                    </MenuItem>
                    <MenuItem value={'alphabetical-reverse'}>
                        Alphabetical: Z-A
                    </MenuItem>
                    <MenuItem value={'price'}>Price: Low - High</MenuItem>
                    <MenuItem value={'price-reverse'}>
                        Price: High - Low
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
