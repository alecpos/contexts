'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';

interface CompleteProps {
    setModalOpen: any;
}

export default function CompletedUpdateShippingInformation({
    setModalOpen,
}: CompleteProps) {
    return (
        <div className='flex flex-col mt-4 gap-8'>
            <BioType className='it-body md:itd-body'>
                Thank you! Your subscription address has been successfully
                updated.
            </BioType>

            <BioType className='it-body md:itd-body text-[#666666]'>
                Please note: If your next order is scheduled to process by the
                pharmacy within the next 48 hours, it will still ship to the
                previously saved address.
            </BioType>

            <Button
                variant='outlined'
                sx={{
                    height: '54px',
                    color: '#666666',
                    borderColor: '#666666',
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: '#66666699',
                        borderColor: '#66666699',
                    },
                }}
                onClick={() => setModalOpen(false)}
            >
                Back to subscription details
            </Button>
        </div>
    );
}
