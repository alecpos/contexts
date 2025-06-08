'use client';

import { useState } from 'react';
import { Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import RedoIcon from '@mui/icons-material/Redo';

interface ImageExpandDialogModalProps {
    open: boolean;
    handleClose: () => void;
    image_ref: string;
}

export default function ImageExpandDialogModal({
    open,
    handleClose,
    image_ref,
}: ImageExpandDialogModalProps) {
    const [rotation, setRotation] = useState(0);

    const [isRotated, setIsRotated] = useState(false);

    const handleRotate = () => {
        setRotation((prevRotation) => prevRotation + 90);
        setIsRotated(!isRotated);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='image-dialog-title'
                aria-describedby='image-dialog-description'
                sx={{backgroundColor:'transparent'}}
            >
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                    sx={{
                        zIndex: '20',
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <IconButton
                    aria-label='rotate'
                    onClick={handleRotate}
                    sx={{
                        zIndex: '20',
                        position: 'absolute',
                        right: 8,
                        top: 36,
                        height: 'fit-content',
                    }}
                >
                    <RedoIcon />
                </IconButton>
                <div
                    style={{
                        backgroundColor:'transparent',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        justifyItems: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: isRotated ? '400px' : '600px',
                        height: isRotated ? '600px' : '400px',
                        transition: 'transform 0.3s',
                    }}
                >
                    <Image
                        src={image_ref}
                        alt=''
                        width={600}
                        height={400}
                        objectFit='contain'
                        style={{
                            // position: 'absolute',
                            // top: '0',
                            transform: `rotate(${rotation}deg)`,
                            transition: 'transform 0.3s',
                        }}
                        unoptimized
                    />
                </div>
            </Dialog>
        </>
    );
}
