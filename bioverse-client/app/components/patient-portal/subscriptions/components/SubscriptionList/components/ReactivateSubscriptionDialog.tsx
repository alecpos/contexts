import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Drawer, useTheme, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { handleSubscriptionReactivation } from '../utils/SubscriptionItem-functions';
import { Status } from '@/app/types/global/global-enumerators';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { PRODUCT_ROUTE_MAPPING } from '../constants/reactivation_product_routes';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
interface ReactivateSubscriptionDialogProps {
    open: boolean;
    onClose: () => void;
    subscriptionId: number;
    product_href: PRODUCT_HREF;
}

export default function ReactivateSubscriptionDialog({
    open,
    onClose,
    subscriptionId,
    product_href,
}: ReactivateSubscriptionDialogProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const handleReactivate = async () => {
        setLoading(true);

        const result = await handleSubscriptionReactivation(subscriptionId); //x
        if (result === Status.Success) {
            setStep(2);
        } else {
            setError(true);
        }

        setLoading(false);
    };

    const handleClose = () => {
        setStep(1);
        setError(false);
        onClose();
    };

    const handleRedirectToIntake = () => {
        window.open(
            `/intake/prescriptions/${product_href}/${PRODUCT_ROUTE_MAPPING[product_href]}`,
            '_blank'
        );
    };

    const errorContent = (
        <div className='flex flex-col items-center justify-center py-8'>
            <BioType className='body1 text-red-600 text-[18px] mb-4'>
                Something went wrong while reactivating your subscription.
            </BioType>
            <BioType className='inter_h4_regular text-[#00000099] text-[16px] mb-6 text-center'>
                Please try again or contact support if the issue persists.
            </BioType>
            <Button
                onClick={handleClose}
                variant='contained'
                sx={{
                    backgroundColor: '#000000',
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#666666' },
                    padding: '10px 20px',
                }}
            >
                <span className='inter_body_small_bold text-white'>Close</span>
            </Button>
        </div>
    );

    const desktopDialog = (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { width: '48vw', borderRadius: '10px', paddingTop: '40px' },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    width: 48,
                    height: 48,
                    bgcolor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                    sx={{
                        color: '#999',
                        width: 40,
                        height: 40,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {error ? (
                errorContent
            ) : step === 1 ? (
                <>
                    <DialogContent>
                        <div className='flex flex-col items-center'>
                            <BioType className='inter_body_medium_regular text-black text-[20px]'>
                                Reactivate your subscription?
                            </BioType>
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                            onClick={handleClose}
                            variant='outlined'
                            sx={{
                                display: 'flex',
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black',
                                borderWidth: 1,
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    borderColor: 'black',
                                },
                                borderRadius: '10px',
                                textTransform: 'none',
                                padding: '10px 20px',
                            }}
                        >
                            <span className='inter_body_small_bold'>
                                Cancel
                            </span>
                        </Button>
                        <Button
                            onClick={handleReactivate}
                            variant='contained'
                            disabled={loading}
                            sx={{
                                display: 'flex',
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                                borderRadius: '10px',
                                textTransform: 'none',
                                padding: '10px 20px',
                            }}
                        >
                            <span className='inter_body_small_bold text-white'>
                                Yes, reactivate
                            </span>
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <>
                    <DialogTitle>
                        <BioType className='inter_h4_regular text-black text-[18px] flex items-start'>
                            <CheckCircleOutlineIcon sx={{ color: '#AFDBA1' }} />
                            Your subscription has been reactivated. Now complete
                            check-in intake.
                        </BioType>
                    </DialogTitle>
                    <DialogContent>
                        <BioType className='inter_h4_regular text-[#00000099] px-2 text-[20px] leading-[25px]'>
                            Please fill out your check-in form as soon as
                            possible to have your order reviewed by a Bioverse
                            provider.
                        </BioType>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                            onClick={() => {
                                handleRedirectToIntake();
                            }}
                            variant='contained'
                            sx={{
                                backgroundColor: '#000000',
                                borderRadius: '10px',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                                padding: '10px 20px',
                            }}
                        >
                            <span className='inter_body_small_bold text-white'>
                                Start my check-in
                            </span>
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );

    const mobileDialog = (
        <Drawer
            anchor='bottom'
            open={open}
            onClose={handleClose}
            PaperProps={{
                className: 'rounded-t-2xl',
                style: { padding: '1.5rem' },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    width: 40,
                    height: 40,
                    bgcolor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                    sx={{
                        color: '#999',
                        width: 40,
                        height: 40,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {error ? (
                errorContent
            ) : step === 1 ? (
                <div className='flex flex-col items-center'>
                    <BioType className='inter_body_medium_regular text-black text-[20px] mb-2'>
                        Reactivate your subscription?
                    </BioType>
                    <div className='flex flex-col w-full justify-between gap-4'>
                        <Button
                            onClick={handleClose}
                            variant='outlined'
                            className='flex-1'
                            sx={{
                                color: 'black',
                                borderColor: 'white',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    borderColor: 'black',
                                },
                                padding: '13px 20px',
                            }}
                        >
                            <span className='inter_body_small_bold text-[16px]'>
                                Cancel
                            </span>
                        </Button>
                        <Button
                            onClick={handleReactivate}
                            variant='contained'
                            className='flex-1'
                            sx={{
                                backgroundColor: '#000000',
                                borderRadius: '10px',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                                padding: '13px 20px',
                            }}
                        >
                            <span className='inter_body_small_bold text-[16px] text-white'>
                                Yes, reactivate
                            </span>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col items-center px-2'>
                    <BioType className='inter_body_large_bold text-black flex items-start  mb-4 mt-8'>
                        <CheckCircleOutlineIcon sx={{ color: '#AFDBA1' }} />
                        Your subscription has been reactivated. Now complete
                        check-in intake.
                    </BioType>
                    <BioType className='inter_body_regular text-black mb-2 px-2'>
                        Please fill out your check-in form as soon as possible
                        to have your order reviewed by a Bioverse provider.
                    </BioType>
                    <Button
                        onClick={handleRedirectToIntake}
                        variant='contained'
                        sx={{
                            backgroundColor: '#000000',
                            borderRadius: '10px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#666666',
                            },
                            width: '100%',
                            padding: '15px 20px',
                        }}
                    >
                        <span className='inter_body_small_bold text-white'>
                            Start my check-in
                        </span>
                    </Button>
                </div>
            )}
        </Drawer>
    );

    return <>{isDesktop ? desktopDialog : mobileDialog}</>;
}
