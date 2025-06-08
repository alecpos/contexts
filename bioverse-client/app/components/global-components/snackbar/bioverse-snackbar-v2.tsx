'use client';

import { Snackbar, Alert } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import DoneIcon from '@mui/icons-material/Done';

interface SnackbarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    color: 'success' | 'error';
    message: string;
}

/**
 *
 * This is a snackbar component we can universally use to display error or success messages.
 *
 * Accepts 4 props:
 * open (state boolean)
 * setState (set state boolean)
 * color
 * message
 *
 *
 *
 * boiler plate:
 * const [ snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
 *
 *
 */
export default function BioverseSnackbarMessage({
    open,
    setOpen,
    color,
    message,
}: SnackbarProps) {
    const handleClose = (event: React.SyntheticEvent<any> | Event) => {
        setOpen(false);
    };
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={color}
                sx={{ 
                    width: '100%' ,
                    borderRadius: '12px',
                }}
                icon={<DoneIcon 
                    fontSize='small'
                />}
            >
                <span className='inter-basic text-[15px]'>{message}</span>
            </Alert>
        </Snackbar>
    );
}
