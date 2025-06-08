'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { PillStatus } from '@/app/types/provider-portal/provider-portal-types';
import { Chip } from '@mui/material';

interface StatusPillProps {
    status: PillStatus;
}

// Define the type for status colors
interface StatusColorInfo {
    [key: string]: {
        color: string;
        text: string;
    };
}

const statusInfo: StatusColorInfo = {
    [PillStatus.ActiveSubscription]: {
        color: '#2E7D32',
        text: 'Active Subscription',
    },
    [PillStatus.Canceled]: {
        color: '#D32F2F',
        text: 'Canceled Subscription',
    },
    [PillStatus.Incomplete]: {
        color: '#00000026',
        text: 'Intake Incomplete',
    },
    [PillStatus.NeedsReview]: {
        color: '#286BA2',
        text: 'Needs Provider Review',
    },
    [PillStatus.ScheduledCancel]: {
        color: '#EF6C00',
        text: 'Subscription scheduled for cancelation',
    },
    [PillStatus.ActiveGLP1Subscription]: {
        color: '#2E7D32',
        text: 'Patient has an active GLP-1 subscription',
    },
    [PillStatus.PreviouslyCanceledSubscription]: {
        color: '#D32F2F',
        text: 'Patient has a previously canceled GLP-1 subscription',
    },
    [PillStatus.PreviouslyDeniedSubscription]: {
        color: '#D32F2F',
        text: 'Patient is not eligible to GLP-1 treatment',
    },
    [PillStatus.Autoshipped]: {
        color: '#FF5F15',
        text: '• Patient Received An Autoshipped Vial',
    },
    [PillStatus.NoCheckInHold]: {
        color: 'red',
        text: 'Subscription on hold due to no check-ins',
    }
};

export default function StatusPillV2({ status }: StatusPillProps) {
    const borderColor = statusInfo[status].color;
    const statusText = statusInfo[status].text;
    return (
        <Chip
            label={
                <BioType className='inter-basic text-[14px]'>{statusText}</BioType>
            }
            color='primary'
            variant='outlined'
            sx={{ 
                borderColor: borderColor, 
                color: borderColor,
                borderRadius: '6px',
            }}
        />
    );
}
