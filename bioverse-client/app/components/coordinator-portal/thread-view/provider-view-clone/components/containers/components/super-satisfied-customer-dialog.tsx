'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { SUPER_SATISFIED_CUSTOMER } from '@/app/services/customerio/event_names';

interface SuperSatisfiedCustomerDialogProps {
    open: boolean;
    onClose: () => void;
    patient_id: string;
}

export default function SuperSatisfiedCustomerDialog({
    open,
    onClose,
    patient_id,
}: SuperSatisfiedCustomerDialogProps) {
    const sendSuperSatisfiedCustomerEvent = async () => {
        await triggerEvent(patient_id, SUPER_SATISFIED_CUSTOMER);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='sm'
            sx={{
                '& .MuiDialog-paper': {
                    width: '36.04vw', // 519/1440 = 36.04%
                },
            }}
        >
            <DialogTitle
                className='font-inter'
                sx={{ backgroundColor: '#FFF8F8' }}
            >
                <span className='font-inter text-[18px] text-[#D11E66] flex flex-row gap-1 items-center'>
                    <WarningAmberRoundedIcon /> Are you sure this customer is
                    super satisfied?
                </span>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-4 px-1 py-4'>
                    <BioType className='font-inter text-[16px]'>
                        This action will trigger an email to the patient asking
                        them to review Bioverse on Trust Pilot.
                    </BioType>
                    <BioType className='font-inter text-[16px]'>
                        Select the{' '}
                        <span className='font-interbold'>Send message</span>{' '}
                        button to proceed with this action. The patient will
                        receive an automated email shortly afterward.
                    </BioType>
                </div>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: '#FFF8F8' }}>
                <Button
                    onClick={onClose}
                    variant='contained'
                    color='primary'
                    sx={{
                        textTransform: 'none',
                        fontSize: '16px',
                        px: 4,
                        py: 0,
                        height: '36px',
                        borderRadius: 'var(--Corner-radius-M,12px)',
                        bgcolor: 'white',
                        color: 'black',
                        '&:hover': {
                            bgcolor: '#ffebee',
                            color: '#d32f2f',
                        },
                    }}
                >
                    <span className='font-inter'>Close</span>
                </Button>
                <Button
                    onClick={sendSuperSatisfiedCustomerEvent}
                    variant='contained'
                    color='primary'
                    sx={{
                        textTransform: 'none',
                        fontSize: '16px',
                        px: 4,
                        py: 0,
                        height: '36px',
                        borderRadius: 'var(--Corner-radius-M,12px)',
                        bgcolor: 'black',
                        '&:hover': {
                            bgcolor: '#666666',
                        },
                    }}
                >
                    <span className='font-inter'>Send message</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
}
