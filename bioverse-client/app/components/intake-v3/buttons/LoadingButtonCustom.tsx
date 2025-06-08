import { constructQuestionObject } from '@/app/utils/actions/intake/wl-supply';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, CircularProgress } from '@mui/material';

interface ContinueButtonProps {
    onClick: any;
    loading: boolean;
    isCheckup?: boolean;
    fullWidth?: boolean;
    customButtonText?: string;
}
export const LoadingButtonCustom = ({
    loading,
    onClick,
    customButtonText,
}: ContinueButtonProps) => {
    return (
        <div
            className={`w-full md:flex md:justify-center animate-slideRight md:mt-4`}
        >
            <LoadingButton
                variant='contained'
                loading={loading}
                onClick={onClick}
                className='inter-h5-constant-bold text-[16px] normal-case '
                loadingIndicator={
                    <CircularProgress sx={{ color: 'white' }} size={22} />
                }
                sx={{
                    width: {
                        xs: 'calc(100vw - 48px)',
                        sm: '100%',
                    },
                    height: '52px',
                    borderRadius: '12px',

                    zIndex: 30,
                    backgroundColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#666666',
                    },
                }}
            >
                {customButtonText ? customButtonText : 'Continue'}
            </LoadingButton>
        </div>
    );
};
