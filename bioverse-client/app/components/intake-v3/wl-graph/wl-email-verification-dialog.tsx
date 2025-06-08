import React, { ReactNode } from 'react';
import { Drawer, Box, DialogContent } from '@mui/material';

interface WLEmailVerificationDialogProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function WLEmailVerificationDialog({
    open,
    onClose,
    children,
}: WLEmailVerificationDialogProps) {
    return (
        <Drawer
            open={open}
            onClose={(event, reason) => {
                if (reason && reason === 'backdropClick') return;
                onClose();
            }}
            disableEscapeKeyDown
            disableScrollLock
            anchor='bottom'
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <div className='w-full flex flex-col items-center'>
                <DialogContent>{children}</DialogContent>
            </div>
        </Drawer>
    );
}
