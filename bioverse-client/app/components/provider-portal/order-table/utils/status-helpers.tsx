import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { Chip } from '@mui/material';

export const renderApprovalStatus = (status: string, statusTag: StatusTag) => {
    switch (statusTag) {
        case StatusTag.ReviewNoPrescribe:
        case StatusTag.OverdueNoPrescribe:
        case StatusTag.ProviderMessage:
            return (
                <BioType className='inter-body'>
                    Review & Message Patient
                </BioType>
            );
        case StatusTag.FinalReview:
            return <BioType className='inter-body'>Review & Prescribe</BioType>;
    }

    switch (status) {
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
            return <BioType className='inter-body'>Review & Prescribe</BioType>;
        case 'Unapproved-CardDown':
            return <BioType className='inter-body'>Pending Review</BioType>;
        case 'Approved-CardDown':
            return <BioType className='inter-body'>Approved</BioType>;
        case 'Pending Payment':
            return <BioType className='inter-body'>Payment Pending</BioType>;
        case 'Denied-CardDown':
            return <BioType className='inter-body'>Order Denied</BioType>;
        case 'Pending-Customer-Response':
            return (
                <BioType className='inter-body'>
                    Pending Customer Response
                </BioType>
            );
        case 'Approved-PendingPayment':
            return <BioType className=''>Pending Payment</BioType>;
        case 'Approved-NoCard':
            return <BioType className='inter-body'>Approved No Card</BioType>;
        case 'Payment-Completed':
            return <BioType className='inter-body'>Payment Completed</BioType>;
        case 'Payment-Declined':
            return <BioType className='inter-body'>Payment Declined</BioType>;
        case 'Canceled':
            return <BioType className='inter-body'>Canceled</BioType>;
        case 'Incomplete':
            return <BioType className='inter-body'>Incomplete</BioType>;
        case 'Approved-NoCard-Finalized':
            return (
                <BioType className='inter-body'>
                    Approved No Card Finalized
                </BioType>
            );
        case 'Approved-CardDown-Finalized':
            return (
                <BioType className='inter-body'>
                    Approved Card Down Finalized
                </BioType>
            );
        case 'Order-Processing':
            return <BioType className='inter-body'>Order Processing</BioType>;
        case RenewalOrderStatus.PharmacyProcessing:
            return <BioType className='inter-body'>Sent to Pharmacy</BioType>;
        default:
            return null;
    }
};

export const determineLicenseSelfieStatus = (
    license_url: string,
    selfie_url: string
) => {
    if (license_url && selfie_url) {
        return <div className='inter-body text-green-500'>Uploaded</div>;
    }

    return <div className='inter-body'>Not Uploaded</div>;
};

export const renderStatusTag = (status: string) => {
    const commonSx = {
        borderRadius: '4px',
        height: '32px',
        '& .MuiChip-label': {
            px: 2,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
        },
    };

    switch (status) {
        case StatusTag.Overdue:
            return (
                <Chip
                    variant='filled'
                    color='error'
                    label={StatusTag.Overdue}
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(244, 67, 54, 0.08)',
                        color: 'error.dark',
                    }}
                />
            );
        case StatusTag.FinalReview:
            return (
                <Chip
                    variant='filled'
                    color='primary'
                    label='Review'
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.dark',
                    }}
                />
            );
        case StatusTag.ReviewNoPrescribe:
            return (
                <Chip
                    variant='filled'
                    color='primary'
                    label={'Review'}
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.dark',
                    }}
                />
            );
        case StatusTag.OverdueNoPrescribe:
            return (
                <Chip
                    variant='filled'
                    color='error'
                    label={'Overdue'}
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(244, 67, 54, 0.08)',
                        color: 'error.dark',
                    }}
                />
            );
        case StatusTag.LeadProvider:
            return (
                <Chip
                    variant='filled'
                    color='primary'
                    label={StatusTag.LeadProvider.replace(
                        /([a-z])([A-Z])/g,
                        '$1 $2'
                    )}
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.dark',
                    }}
                />
            );
        case StatusTag.ProviderMessage:
            return (
                <Chip
                    variant='filled'
                    color='error'
                    label={'Message Patient'}
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(244, 67, 54, 0.08)',
                        color: 'error.dark',
                    }}
                />
            );
        default:
            return (
                <Chip
                    variant='filled'
                    color='primary'
                    label={status}
                    className='inter-body'
                    sx={{
                        ...commonSx,
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.dark',
                    }}
                />
            );
    }
};
