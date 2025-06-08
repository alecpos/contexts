'use client';

import { Button, CircularProgress, Paper } from '@mui/material';
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';

import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import {
    updateUserProfileLicensePhotoURL,
    updateUserProfileSelfiePhotoURL,
} from '@/app/utils/database/controller/storage/license-selfie/license-selfie-functions';
import { useRouter } from 'next/navigation';

import CheckIcon from '@mui/icons-material/Check';

import {
    canExitUserFromIDVerificationCampaign,
    shouldSendIDVerification,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';

import Popup from '../../intake-v2/id-verification/camera-pop-up/camera-pop-up';
import IDVerificationDialog from '../../intake-v2/id-verification/id-verification-dialog/id-verification-dialog';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../intake-v2/styles/intake-tailwind-declarations';

interface Props {
    user_id: string;
    userGender: string | undefined;
    patientName: string;
}

export default function PatientIDVerification({
    user_id,
    userGender,
    patientName,
}: Props) {
    //loading state of button spinner
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    //Current substep value.
    // 0 = license, 1 = selfie
    const [subStep, setSubStep] = useState<number>(0);

    //States to track whether license or selfie camera pop-up is open.
    const [isLicensePopupOpen, setIsLicensePopupOpen] = useState(false);
    const [isSelfiePopupOpen, setIsSelfiePopupOpen] = useState(false);

    const [licenseDialogOpen, setLicenseDialogOpen] = useState<boolean>(false);
    const [selfieDialogOpen, setSelfieDialogOpen] = useState<boolean>(false);

    const router = useRouter();

    //The string value of the selfie or license photo.
    const [selfiePhoto, setSelfiePhoto] = useState<string | null>('');
    const [licensePhoto, setLicensePhoto] = useState<string | null>('');

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const licenseInputRef = useRef<HTMLInputElement>(null);
    const selfieInputRef = useRef<HTMLInputElement>(null);

    const handleLicenseCapture = (capturedPhoto: string) => {
        setLicensePhoto(capturedPhoto);
    };

    const handleSelfieCapture = (capturedPhoto: string) => {
        setSelfiePhoto(capturedPhoto);
    };

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        setPhoto: Dispatch<SetStateAction<string | null>>
    ) => {
        console.log('file change code log: ', setPhoto);

        const file = event.target.files ? event.target.files[0] : null;
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLicenseFileUpload = () => {
        licenseInputRef.current?.click();
    };

    const handleSelfieFileUpload = () => {
        console.log('handle selfie upload ');

        selfieInputRef.current?.click();
    };

    //functions for opening and closing license and selfie popups
    const openLicensePopup = () => setIsLicensePopupOpen(true);
    const closeLicensePopup = () => setIsLicensePopupOpen(false);

    const openSelfiePopup = () => setIsSelfiePopupOpen(true);
    const closeSelfiePopup = () => setIsSelfiePopupOpen(false);
    /**
     * SubStepContinue encompasses
     */
    const handleSubStepContinue = async () => {
        setIsButtonLoading(true);
        setCapturedPhoto(null);

        try {
            // Initialize variables for the blob
            let licensePhotoBlob: Blob | null = null;

            // Convert the base64 or URL to Blob for license photo
            if (licensePhoto) {
                if (licensePhoto.startsWith('data:')) {
                    // Check if it's base64
                    licensePhotoBlob = base64ToBlob(licensePhoto, 'image/jpeg');
                } else {
                    licensePhotoBlob = await fetch(licensePhoto).then((res) =>
                        res.blob()
                    );
                }
            }

            // Ensure both photos are available before proceeding
            if (!licensePhotoBlob) {
                throw new Error('Both license and selfie photos are required');
            }

            const licenseFileName = `license-${Date.now()}.jpg`;

            await uploadImage(user_id, licensePhotoBlob, licenseFileName);

            await updateUserProfileLicensePhotoURL(user_id, licenseFileName);
            await shouldSendIDVerification(user_id);
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        } finally {
            setIsButtonLoading(false); // Stop loading
            setSubStep((prev) => prev + 1);
        }
    };

    /**
     * SubStepContinue encompasses
     */
    const handleStepContinue = async () => {
        setIsButtonLoading(true);

        try {
            // Initialize variables for the blob
            let selfiePhotoBlob: Blob | null = null;

            // Convert the base64 or URL to Blob for selfie photo
            if (selfiePhoto) {
                if (selfiePhoto.startsWith('data:')) {
                    selfiePhotoBlob = base64ToBlob(selfiePhoto, 'image/jpeg');
                } else {
                    selfiePhotoBlob = await fetch(selfiePhoto).then((res) =>
                        res.blob()
                    );
                }
            }

            // Ensure both photos are available before proceeding
            if (!selfiePhotoBlob) {
                throw new Error('Both license and selfie photos are required');
            }

            const selfieFileName = `selfie-${Date.now()}.jpg`;
            await uploadImage(user_id, selfiePhotoBlob, selfieFileName);

            await updateUserProfileSelfiePhotoURL(user_id, selfieFileName);
            const result = await shouldSendIDVerification(user_id);
            console.log('RESULT TEST: ', result);
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        } finally {
            setSubStep(2);
        }
    };

    const base64ToBlob = (base64: string, mimeType: string): Blob => {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeType });
    };

    const uploadImage = async (
        userId: string,
        image: Blob,
        fileName: string
    ) => {
        const filePath = `${userId}/${fileName}`;

        const supabase = createSupabaseBrowserClient();

        const { error } = await supabase.storage
            .from('license_and_selfie_images')
            .upload(filePath, image);

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const openLicenseDialog = () => {
        setLicenseDialogOpen(true);
    };

    const closeLicenseDialog = () => {
        setLicenseDialogOpen(false);
    };

    const openSelfieDialog = () => {
        setSelfieDialogOpen(true);
    };

    const closeSelfieDialog = () => {
        setSelfieDialogOpen(false);
    };

    return (
        <div className={`flex animate-slideRight`}>
            <div className='flex flex-col gap-4 pt-10 px-10'>
                <input
                    ref={licenseInputRef}
                    type='file'
                    accept='image/png, image/jpeg'
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, setLicensePhoto)}
                />

                <input
                    ref={selfieInputRef}
                    type='file'
                    accept='image/png, image/jpeg'
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, setSelfiePhoto)}
                />
                {/* No License Id submitted at the moment */}
                {subStep === 0 ? (
                    <div
                        className={`flex flex-col items-center md:items-start gap-4 animate-slideRight`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} md:-mb-2 -mb-0.5`}
                        >
                            {licensePhoto
                                ? 'Review and confirm ID'
                                : 'Upload your photo ID'}
                        </BioType>

                        {!licensePhoto && (
                            <>
                                <div className='flex flex-row gap-1 justify-center'>
                                    <div
                                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} underline !text-[#1b1b1bde] hover:cursor-pointer`}
                                        onClick={openLicenseDialog}
                                    >
                                        Why do we need this?
                                    </div>
                                    <div>
                                        {userGender === 'Female' ? '🙋🏻‍♀️' : '🙋🏻'}
                                    </div>
                                </div>
                                <IDVerificationDialog
                                    isOpen={licenseDialogOpen}
                                    onClose={closeLicenseDialog}
                                />

                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Take a photo of your ID, or upload an
                                    existing file. Examples include:
                                    driver&apos;s license, passport, school ID,
                                    or consular ID.
                                </BioType>
                            </>
                        )}

                        <div
                            className={`w-full flex flex-col ${
                                licensePhoto ? '-mt-4 ml-6' : ''
                            }`}
                        >
                            <div className='flex flex-col w-full'>
                                <Popup
                                    setPhoto={handleLicenseCapture}
                                    isOpen={isLicensePopupOpen}
                                    onClose={closeLicensePopup}
                                    cameraFor={'license'}
                                    capturedPhoto={capturedPhoto}
                                    setCapturedPhoto={setCapturedPhoto}
                                />

                                <div
                                    className={`flex relative rounded-[4px] ${
                                        licensePhoto
                                            ? 'aspect-[4/3]'
                                            : ' border-1 border-dashed border-[#1b1b1b] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden mt-2 md:mt-4 w-full`}
                                >
                                    {licensePhoto ? (
                                        <div className='p-0 mt-4 relative w-full h-full rounded-[4px] overflow-hidden'>
                                            <Image
                                                src={licensePhoto}
                                                alt={'license'}
                                                layout='fill'
                                                objectFit='contain'
                                                unoptimized
                                            />
                                            <div className='absolute bottom-[14px] md:bottom-[12px] right-[6px]'>
                                                <Button
                                                    onClick={() => {
                                                        setLicensePhoto(null);
                                                        setCapturedPhoto(null);
                                                    }}
                                                    sx={{
                                                        backgroundColor:
                                                            'rgba(0, 0, 0, 0.45)',
                                                        color: 'white',
                                                        width: '66px',
                                                        height: '36px',
                                                        fontSize: '14px',
                                                        boxShadow: 4,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgba(0, 0, 0, 0.8)',
                                                        },
                                                    }}
                                                >
                                                    <BioType className='body1 text-white text-[14px]'>
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='relative w-[70%] aspect-[1/1] bottom-3 opacity-50'>
                                                <Image
                                                    src={
                                                        '/img/intake/intake-id-selfie-cartoon-portraits/license-inside-window-image.png'
                                                    }
                                                    alt={''}
                                                    fill
                                                    sizes=''
                                                    className=''
                                                    unoptimized
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className='flex flex-col'>
                                    {!licensePhoto && (
                                        <div className='hidden md:flex flex-grow py-2 gap-3 mt-1'>
                                            <Button
                                                variant='contained'
                                                onClick={openLicensePopup}
                                                fullWidth
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                }}
                                            >
                                                Take a photo
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant='contained'
                                                onClick={
                                                    handleLicenseFileUpload
                                                }
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                }}
                                            >
                                                Upload Photo
                                            </Button>
                                        </div>
                                    )}
                                    {!licensePhoto && (
                                        <div className='flex md:hidden py-2 mt-2'>
                                            <Button
                                                fullWidth
                                                variant='contained'
                                                onClick={
                                                    handleLicenseFileUpload
                                                }
                                                sx={{
                                                    height: '52px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                }}
                                            >
                                                Take Photo
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {licensePhoto && (
                                    <div className='flex flex-col w-[312px] md:mt-3 mb-1 mt-4'>
                                        <BioType className='body1bold text-[16px]'>
                                            Make sure your photo
                                        </BioType>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Your ID is not cutoff
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center align-middle'>
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Your ID is not expired
                                            </BioType>
                                        </div>
                                    </div>
                                )}

                                {/**
                                 * Buttons to submit license photo are different for mobile/desktop
                                 * Below is Desktop
                                 */}
                                {licensePhoto && (
                                    <div className='flex flex-col mt-3'>
                                        {isButtonLoading ? (
                                            <>
                                                <Button
                                                    variant='contained'
                                                    fullWidth
                                                    className='py-2 px-4'
                                                    sx={{
                                                        height: {
                                                            xs: '52px',
                                                            sm: '42px',
                                                        },
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                    }}
                                                >
                                                    <CircularProgress
                                                        size={22}
                                                        sx={{ color: 'white' }}
                                                    />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant='contained'
                                                    fullWidth
                                                    className='py-2 px-4'
                                                    onClick={
                                                        handleSubStepContinue
                                                    }
                                                    sx={{
                                                        height: {
                                                            xs: '52px',
                                                            sm: '42px',
                                                        },
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : subStep === 1 ? (
                    //  No Selfie photo submitted at the moment
                    <div
                        className={`flex flex-col gap-4 items-center animate-slideRight w-full`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} md:leading-normal`}
                        >
                            {selfiePhoto
                                ? 'Review and confirm photo of your face'
                                : 'Upload a photo of your face.'}
                        </BioType>

                        {!selfiePhoto && (
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                            >
                                To access treatment, we need a to verify the ID
                                you submitted using a photo of you or selfie.
                            </BioType>
                        )}

                        <div className='flex flex-col gap-[32px] w-full'>
                            <div className='flex flex-col'>
                                <Popup
                                    setPhoto={handleSelfieCapture}
                                    isOpen={isSelfiePopupOpen}
                                    onClose={closeSelfiePopup}
                                    cameraFor={'selfie'}
                                    capturedPhoto={capturedPhoto}
                                    setCapturedPhoto={setCapturedPhoto}
                                />

                                <div
                                    className={`flex relative rounded-[4px] ${
                                        selfiePhoto
                                            ? 'aspect-[4/3]'
                                            : ' border-1 border-dashed border-[#1b1b1b] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden`}
                                >
                                    {selfiePhoto ? (
                                        <div className='p-0 md:-mt-2 relative w-full h-full rounded-[4px] overflow-hidden'>
                                            <Image
                                                src={selfiePhoto}
                                                alt={'selfie'}
                                                layout='fill'
                                                objectFit='contain'
                                                unoptimized
                                            />
                                            <div className='absolute bottom-[14px] md:bottom-[8px] right-[6px]'>
                                                <Button
                                                    onClick={() => {
                                                        setSelfiePhoto(null);
                                                        setCapturedPhoto(null);
                                                    }}
                                                    sx={{
                                                        backgroundColor:
                                                            'rgba(0, 0, 0, 0.45)',
                                                        color: 'white',
                                                        width: '66px',
                                                        height: '36px',
                                                        fontSize: '14px',
                                                        boxShadow: 4,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgba(0, 0, 0, 0.8)',
                                                        },
                                                    }}
                                                >
                                                    <BioType className='body1 text-white text-[14px]'>
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {userGender === 'Female' ? (
                                                <div className='relative w-[30%] aspect-[.75] opacity-50'>
                                                    <Image
                                                        src={
                                                            '/img/intake/intake-id-selfie-cartoon-portraits/female-inside-selfie-portrait.png'
                                                        }
                                                        alt={''}
                                                        fill
                                                        sizes=''
                                                        className=''
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className='relative w-[50%] aspect-[1] opacity-50'>
                                                    <Image
                                                        src={
                                                            '/img/intake/intake-id-selfie-cartoon-portraits/male-inside-selfie-portrait.png'
                                                        }
                                                        alt={''}
                                                        fill
                                                        sizes=''
                                                        className=''
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {!selfiePhoto && (
                                    <div className='flex flex-col'>
                                        <div className='hidden md:flex flex-grow py-2 gap-3 mt-1'>
                                            <Button
                                                variant='contained'
                                                onClick={openSelfiePopup}
                                                fullWidth
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                }}
                                            >
                                                Take a photo
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant='contained'
                                                onClick={handleSelfieFileUpload}
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                }}
                                            >
                                                Upload Photo
                                            </Button>
                                        </div>
                                        {!selfiePhoto && (
                                            <div className='flex md:hidden py-2 mt-2'>
                                                <Button
                                                    sx={{
                                                        height: '52px',
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                    }}
                                                    fullWidth
                                                    variant='contained'
                                                    onClick={
                                                        handleSelfieFileUpload
                                                    }
                                                >
                                                    Take Photo
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selfiePhoto && (
                                    <div className='flex flex-col w-[312px] md:mt-3 mb-1 mt-4'>
                                        <BioType className='body1bold text-[16px]'>
                                            Make sure your photo
                                        </BioType>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Only has you in the photo
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center align-middle'>
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Has not been edited or filtered
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center align-middle'>
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className='body1 text-[16px]'>
                                                Shows your full face
                                            </BioType>
                                        </div>
                                    </div>
                                )}

                                {selfiePhoto && (
                                    <div className='flex flex-col mt-3'>
                                        {isButtonLoading ? (
                                            <>
                                                <Button
                                                    variant='contained'
                                                    fullWidth
                                                    className='py-2 px-4'
                                                    sx={{
                                                        height: {
                                                            xs: '52px',
                                                            sm: '42px',
                                                        },
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                    }}
                                                >
                                                    <CircularProgress
                                                        size={22}
                                                        sx={{ color: 'white' }}
                                                    />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant='contained'
                                                fullWidth
                                                disabled={
                                                    selfiePhoto ? false : true
                                                }
                                                sx={{
                                                    height: {
                                                        xs: '52px',
                                                        sm: '42px',
                                                    },
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                }}
                                                className='py-2 px-4'
                                                onClick={handleStepContinue}
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    //  Both License and Selfie have been submitted
                    <div
                        className={`flex flex-col items-center md:items-start gap-4 animate-slideRight`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} md:-mb-2 -mb-0.5 text-center`}
                        >
                            Thank you for verifying your identity! You can now
                            close this tab.
                        </BioType>
                    </div>
                )}
            </div>
        </div>
    );
}
