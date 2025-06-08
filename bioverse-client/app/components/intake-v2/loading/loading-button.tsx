'use client';

import { Button, CircularProgress } from '@mui/material';

interface LoadingButtonProps {
    fullWidth?: boolean;
}
export default function LoadingButton({ fullWidth }: LoadingButtonProps) {
    return (
        <Button
            variant='contained'
            fullWidth={fullWidth ? true : false}
            sx={{
                width: { xs: 'calc(100vw - 48px)', sm: '100%' },
                height: '52px',
                // '@media (min-width:768px)': {
                //     width: '118px',
                // },
                zIndex: 30,
            }}
        >
            <div className='items-center flex justify-center gap-4 px-4 py-1'>
                <CircularProgress sx={{ color: 'white' }} size={22} />
            </div>
        </Button>
    );
}
