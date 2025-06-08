'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, Paper } from '@mui/material';

interface UpdatePaymentMethodProps {
    last4: string;
    setOpenDrawer: any;
}

const UpdatePaymentMethod = ({
    last4,
    setOpenDrawer,
}: UpdatePaymentMethodProps) => {
    return (
        <div className='flex flex-col space-y-4'>
            <BioType className='h6 text-[24px] text-[#00000099]'>
                Payment Method
            </BioType>
            <Paper className='flex flex-col space-y-4 px-7 py-6 sm:flex-row sm:justify-between sm:items-center'>
                <div className='flex flex-col space-y-2'>
                    <BioType className='body1 text-[16px] text-[#00000099]'>
                        Default Card
                    </BioType>
                    <BioType className='body1 text-[16px] text-black'>
                        •••• •••• •••• {last4}
                    </BioType>
                </div>
                <Button
                    onClick={() => setOpenDrawer(true)}
                    variant='outlined'
                    sx={{
                        width: { xs: '100%', sm: 'unset' },
                        height: { xs: '52px', sm: 'unset' },
                    }}
                >
                    <BioType className='body1 text-[13px] text-[#286BA2]'>
                        UPDATE PAYMENT METHOD
                    </BioType>
                </Button>
            </Paper>
        </div>
    );
};

export default UpdatePaymentMethod;
