import ConfirmedRefill from '@/app/components/patient-portal/subscriptions/components/ChangeRefillDate/confirmed/ConfirmedRefill';
import { CssBaseline } from '@mui/material';
import React from 'react';

const ConfirmedRefillChangePage = () => {
    return (
        <>
            <CssBaseline />
            <div className='px-4 '>
                <ConfirmedRefill />
            </div>
        </>
    );
};

export default ConfirmedRefillChangePage;
