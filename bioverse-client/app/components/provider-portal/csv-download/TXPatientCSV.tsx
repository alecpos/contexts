'use client';

import { Button, Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';
import { getTxPatientCSVData } from './tx_patient_csv_data_fetch';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    convertToCSV,
    downloadCSV,
} from '@/app/utils/functions/csv_convert_download';

export default function TXPatientCSV() {
    const [isLoading, setIsLoading] = useState(false);

    const [startDate, setStartDate] = useState<Date>(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return today;
    });

    const handleExportCSV = async () => {
        setIsLoading(true);

        const returnData = await getTxPatientCSVData(
            startDate.toISOString(),
            endDate.toISOString()
        );

        setIsLoading(false);

        if (!returnData) {
            return;
        }

        downloadCSV(returnData, 'tx_patient_list.csv');
    };

    return (
        <Paper
            className='flex flex-col mt-28 p-4 w-[800px] h-[500px] gap-2'
            id='provider-tx-patient-csv-component'
        >
            <BioType className='inter_h3_bold_dt'>
                Download Texas Patient List CSV
            </BioType>

            <BioType className='inter_h4_regular_dt'>
                Please select a date range to download a list of patients we
                have served in the state of Texas:
            </BioType>
            <BioType className='inter_h4_regular_dt'>
                <a href='https://www.loom.com/share/b11224ea51e44d219ab94090d4667e4a'>
                    Video tutorial link
                </a>
            </BioType>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className='flex flex-row space-x-4 p-4'>
                    <div className='flex flex-col'>
                        <BioType className='itd-body text-[#646464]'>
                            Start Date:
                        </BioType>
                        <DatePicker
                            value={startDate}
                            onChange={(newValue) => {
                                if (newValue) setStartDate(newValue);
                            }}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <BioType className='itd-body text-[#646464]'>
                            End Date:
                        </BioType>
                        <DatePicker
                            value={endDate}
                            onChange={(newValue) => {
                                if (newValue) {
                                    const endOfDay = new Date(newValue);
                                    endOfDay.setHours(23, 59, 59, 999);
                                    setEndDate(endOfDay);
                                }
                            }}
                        />
                    </div>
                </div>
            </LocalizationProvider>

            <Button
                variant='contained'
                color='primary'
                onClick={handleExportCSV}
                disabled={isLoading}
                sx={{
                    borderRadius: '12px',
                    backgroundColor: 'black',
                    paddingX: '32px',
                    paddingY: '14px',
                    ':hover': {
                        backgroundColor: 'darkslategray',
                    },
                    width: '200px',
                }}
            >
                {isLoading ? 'Loading...' : 'Download'}
            </Button>
        </Paper>
    );
}
