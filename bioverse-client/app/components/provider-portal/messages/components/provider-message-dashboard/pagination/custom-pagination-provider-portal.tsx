import React from 'react';
import { Select, MenuItem, SelectChangeEvent, Pagination } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface CustomPaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
    onRowsPerPageChange: (event: SelectChangeEvent) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const totalPages = Math.ceil(count / rowsPerPage);

    console.log('CustomPagination Props:', {
        count,
        page,
        rowsPerPage,
        totalPages,
    });

    return (
        <div className='flex w-full items-center justify-center flex-row gap-2 mb-8 mt-4'>
            <BioType className='it-subtitle'>Messages per Page: </BioType>
            <Select
                value={rowsPerPage.toString()}
                onChange={onRowsPerPageChange}
                variant='standard'
            >
                {[5, 10, 25, 50].map((rows) => (
                    <MenuItem key={rows} value={rows}>
                        {rows}
                    </MenuItem>
                ))}
            </Select>
            <Pagination
                count={totalPages}
                page={page} // Adjust to 0-based index
                onChange={(event, newPage) => onPageChange(event, newPage)} // Adjust to 1-based index
            />
        </div>
    );
};

export default CustomPagination;
