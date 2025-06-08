'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

export interface ContinueButtonPropsAP {
    onClick: () => void;
    isCheckup?: boolean;
    buttonText?: string;
}

export default function AnimatedContinueButtonV3AP({
    onClick,
    isCheckup = false,
    buttonText,
}: ContinueButtonPropsAP) {
    const widthXs = isCheckup ? '100%' : 'calc(100vw - 48px)';
    const [isExiting, setIsExiting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const onButtonPress = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClick();
        }, 150); // Adjust the timeout to match the duration of your animation
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed md:static bottom-[25px] flex justify-center z-30 ${
                isExiting ? 'animate-buttonExit' : 'animate-buttonEnter'
            }`}
        >
            <Button
                variant="contained"
                fullWidth
                sx={{
                    width: {
                        xs: widthXs,
                        sm: '100%',
                    },
                    borderRadius: '12px',
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
                    textTransform: 'none',
                }}
                onClick={onButtonPress}
            >
                <BioType className="inter-h5-bold size-body-medium">
                    {buttonText || 'Continue'}
                </BioType>
            </Button>
        </div>
    );
}
