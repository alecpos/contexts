import { constructQuestionObject } from '@/app/utils/actions/intake/wl-supply';
import { Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

interface ContinueButtonProps {
    onClick: any;
    buttonLoading: boolean;
    disabled?: boolean;
    altText?: string;
}
export default function AltContinueButton({
    buttonLoading,
    onClick,
    disabled = false,
    altText,
}: ContinueButtonProps) {
    return (
        <div
            className={`continue-button static bottom-[25px] flex justify-center z-30 w-[90vw] max-w-[520px]`}
        >
            <Button
                variant='contained'
                fullWidth
                sx={{
                    width: {
                        xs: '100%',
                        sm: '100%',
                    },
                    height: '52px',
                    // '@media (min-width:768px)': {
                    //     width: '118px',
                    // },
                    // position: { xs: 'fixed', sm: 'static' },
                    // bottom: { xs: bottomXs, sm: 0 },
                    zIndex: 30,
                    backgroundColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#666666',
                    },
                }}
                onClick={onClick}
                disabled={disabled}
            >
                {buttonLoading ? (
                    <CircularProgress sx={{ color: 'white' }} size={22} />
                ) : altText ? (
                    altText
                ) : (
                    'Continue'
                )}
            </Button>
        </div>
    );
}
