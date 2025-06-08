'use client';

import { getUpcomingSubscriptionDataFromSupabase } from './utils/upcoming-list-function';
import { Button } from '@mui/material';
import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { downloadCSV } from '@/app/utils/functions/csv_convert_download';

interface UpcomingListComponentProps {}

export default function UpcomingListComponent({}: UpcomingListComponentProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExportCSV = async () => {
        setIsLoading(true);
        try {
            const data = await getUpcomingSubscriptionDataFromSupabase();

            const filteredData = data.filter(
                (item: any) => item.stripe_subscription_id !== null
            );

            if (filteredData && filteredData.length > 0) {
                downloadCSV(filteredData, 'upcoming_subscriptions.csv', [
                    'stripe_subscription_id',
                    'patient_id',
                ]);
            } else {
                console.log('No data to export after filtering');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col mt-28 w-full items-center justify-center'>
            <BioType className='itd-h1'>Get Upcoming Patient CSV</BioType>
            <Button
                variant='contained'
                color='primary'
                onClick={handleExportCSV}
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Download'}
            </Button>
            {/* You can add more content here to display the data */}
        </div>
    );
}
