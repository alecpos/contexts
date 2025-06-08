import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, Dialog, DialogTitle, Typography } from '@mui/material';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    cameraFor: string;
    setPhoto: (capturedPhoto: string) => void;
    capturedPhoto: string | null;
    setCapturedPhoto: (capturedPhoto: string | null) => void;
}

const Popup: React.FC<PopupProps> = ({
    isOpen,
    onClose,
    cameraFor,
    setPhoto,
    capturedPhoto,
    setCapturedPhoto,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        if (isOpen) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((mediaStream) => {
                    stream = mediaStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.play();
                    }
                })
                .catch((err) => {
                    console.error('Error accessing the camera:', err);
                });

            return () => {
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                }
            };
        }
    }, [isOpen, capturedPhoto]);

    const takePicture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const imageSrc = canvasRef.current.toDataURL('image/png');
                setCapturedPhoto(imageSrc);
            }
        }
    }, []);

    const reTakePicture = () => {
        setCapturedPhoto(null);
    };

    const handleUseThisPicture = () => {
        if (capturedPhoto) {
            setPhoto(capturedPhoto);
        }
        onClose();
    };

    const renderPopupTitle=()=>{
        switch (cameraFor){
            case 'selfie':
                return(<Typography className='h5'>Take a selfie:</Typography>)
            case 'right-side-face':
                return(<Typography className='h5'>Take a picture of the right side of your face:</Typography>)
            case 'left-side-face':
                return(<Typography className='h5'>Take a picture of the left side of your face:</Typography>)
            
            default:
                return(<Typography className='h5'>
                Take a picture of your license:
                </Typography>)
        }
    }

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby='id-verification-dialog-title'
        >
            <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
                {renderPopupTitle()}
                {!capturedPhoto && (
                    <div className='flex gap-4 flex-col justify-center items-center'>
                        <video
                            className='md:w-[31.6vw] w-full aspect-[4/3]'
                            ref={videoRef}
                        ></video>
                        <div className='flex flex-row gap-2 items-center justify-center'>
                            <Button onClick={takePicture} variant='outlined'>
                                Take Picture
                            </Button>
                            <Button onClick={onClose} variant='contained'>
                                Close
                            </Button>
                        </div>
                    </div>
                )}

                {capturedPhoto && (
                    <div className='flex flex-col justify-center items-center'>
                        <img
                            src={capturedPhoto}
                            alt='Captured'
                            className='mb-3 w-[100%] aspect-[4/3]'
                        />
                        <div className='flex flex-row gap-2 items-center justify-center'>
                            <Button onClick={reTakePicture} variant='outlined'>
                                <BioType className='body1 text-[#286BA2]'>
                                    RETAKE PICTURE
                                </BioType>
                            </Button>
                            <Button
                                onClick={handleUseThisPicture}
                                variant='contained'
                            >
                                <BioType className='body1 text-white'>
                                    USE THIS PICTURE
                                </BioType>
                            </Button>
                        </div>
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>
        </Dialog>
    );
};

export default Popup;
