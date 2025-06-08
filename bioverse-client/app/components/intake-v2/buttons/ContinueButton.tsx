import { Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

interface ContinueButtonProps {
    onClick: () => void; // Ensure unique
    buttonLoading: boolean;
    isCheckup?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

export default function ContinueButton({
    buttonLoading,
    onClick,
    isCheckup = false,
    disabled = false,
}: ContinueButtonProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [shouldReappear, setShouldReappear] = useState(false);

    useEffect(() => {
        if (isExiting) {
            const hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 300); // Match this with buttonExit animation duration

            const reappearTimeout = setTimeout(() => {
                setShouldReappear(true);
                setIsExiting(false);
                setIsVisible(true);
            }, 3300); // 3 seconds after the button disappears

            return () => {
                clearTimeout(hideTimeout);
                clearTimeout(reappearTimeout);
            };
        }
    }, [isExiting]);

    useEffect(() => {
        if (shouldReappear) {
            setShouldReappear(false);
        }
    }, [shouldReappear]);

    if (!isVisible) return null;

    const onButtonPress = () => {
        setIsExiting(true);
        onClick(); // Ensure this function is not duplicated elsewhere
    };

    return (
        <div
            className={`fixed bottom-6 sm:static sm:mt-4 z-30 ${
                isExiting ? 'animate-buttonExit' : 'animate-buttonEnter'
            }`}
            style={{
                opacity: isExiting ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out',
                transform: isExiting ? 'translateY(50%)' : 'translateY(0)',
                // marginLeft: '-50%',
            }}
        >
            <Button
                variant="contained"
                fullWidth
                sx={{
                    width: {
                        xs: 'calc(100vw - 44px)',
                        md: '520px',
                    },
                    height: '52px',
                    zIndex: 30,
                    backgroundColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#666666',
                    },
                }}
                onClick={onButtonPress}
                disabled={disabled}
            >
                {buttonLoading ? (
                    <CircularProgress sx={{ color: 'white' }} size={22} />
                ) : (
                    'Continue'
                )}
            </Button>
        </div>
    );
}
