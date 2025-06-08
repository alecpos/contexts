import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    setStartDate: Dispatch<SetStateAction<Date>>;
    setEndDate: Dispatch<SetStateAction<Date>>;
}

export default function DateRangePicker({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}: DateRangePickerProps) {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const handleStartDateChange = (
        date: Date | null,
        event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
    ) => {
        if (date) {
            setStartDate(date);
        }
    };

    const handleEndDateChange = (
        date: Date | null,
        event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
    ) => {
        if (date) {
            setEndDate(date);
        }
    };

    return (
        <Box
            display='flex'
            gap={2}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '1rem',
            }}
        >
            <div className='flex flex-col gap-0'>
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    customInput={
                        <TextField
                            variant='outlined'
                            label={'Start Date'}
                            inputProps={{ autoComplete: 'off' }}
                        />
                    }
                />
            </div>
            <BioType className='flex itd-body'>:</BioType>
            <div>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    customInput={
                        <TextField
                            variant='outlined'
                            label={'End Date'}
                            inputProps={{ autoComplete: 'off' }}
                        />
                    }
                />
            </div>
        </Box>
    );
}
