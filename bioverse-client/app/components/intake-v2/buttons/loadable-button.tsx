'use client';

import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';

interface IntakeButtonProps {
    button_text: string;
    custom_function: () => any;
    fullWidth?: boolean;
    variant?: 'contained' | 'outlined' | 'text';
}

export function IntakeButtonWithLoading({
    button_text,
    custom_function,
    fullWidth,
    variant,
}: IntakeButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleButtonPress = () => {
        setIsLoading(true);
        custom_function();
    };

    return (
        <>
            {!isLoading ? (
                <Button
                    fullWidth={fullWidth ? true : false}
                    variant={variant ? variant : 'contained'}
                    onClick={handleButtonPress}
                    sx={{
                        height: '52px',
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}

                    // disabled={!isFormValid} // The button is disabled unless the form is valid
                >
                    {button_text}
                </Button>
            ) : (
                <Button
                    variant={variant ? variant : 'contained'}
                    fullWidth={fullWidth ? true : false}
                    sx={{
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                >
                    <div className='items-center flex justify-center gap-4 px-4 py-1'>
                        <CircularProgress
                            sx={{
                                color: variant !== 'text' ? 'white' : 'primary',
                            }}
                            size={22}
                        />
                    </div>
                </Button>
            )}
        </>
    );
}
