'use client';

import { Button, CircularProgress } from '@mui/material';
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import Popup from '../id-verification/camera-pop-up/camera-pop-up';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { updateUserProfileSelfiePhotoURL } from '@/app/utils/database/controller/storage/license-selfie/license-selfie-functions';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import CheckIcon from '@mui/icons-material/Check';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';

import {
    updateUserLeftSidePhotoURL,
    updateUserRightSidePhotoURL,
} from '@/app/utils/database/controller/storage/face-pictures/face-picture-functions';

interface Props {
    user_id: string;
    userGender: string | undefined;
    patientName: string;
    preExistingSelfie: string;
    preExistingRightSideFace: string;
    preExistingLeftSideFace: string;
}

export default function SkincareUpload({ user_id, userGender }: Props) {
    //loading state of button spinner
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    //Current substep value.
    // 0 = front, 1 = right-side, 2 = left-side
    const [subStep, setSubStep] = useState<number>(0);

    //States to track whether license or selfie camera pop-up is open.
    const [isSelfiePopupOpen, setIsSelfiePopupOpen] = useState(false);
    const [isRightSidePopupOpen, setIsRightSidePopupOpen] = useState(false);
    const [isLeftSidePopupOpen, setIsLeftSidePopupOpen] = useState(false);

    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    if (!user_id) {
        router.push(
            `/intake/prescriptions/${product_href}/registration?${search}`,
        );
    }

    const pushToNextRoute = async () => {
        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            search,
            false,
            'latest',
            searchParams.get('st') || 'none',
        );
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    //The string value of the selfie or license photo.
    const [selfiePhoto, setSelfiePhoto] = useState<string | null>('');
    const [rightSidePhoto, setRightSidePhoto] = useState<string | null>('');
    const [leftSidePhoto, setLeftSidePhoto] = useState<string | null>('');

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    // useEffect(() => {
    //     if (preExistingLicense && preExistingSelfie) {
    //         pushToNextRoute();
    //     }
    // }, [preExistingLicense, preExistingSelfie]);

    const selfieInputRef = useRef<HTMLInputElement>(null);
    const rightSideInputRef = useRef<HTMLInputElement>(null);
    const leftSideInputRef = useRef<HTMLInputElement>(null);

    const handleSelfieCapture = (capturedPhoto: string) => {
        setSelfiePhoto(capturedPhoto);
    };
    const handleRightSideFaceCapture = (capturedPhoto: string) => {
        setRightSidePhoto(capturedPhoto);
    };
    const handleLeftSideFaceCapture = (capturedPhoto: string) => {
        setLeftSidePhoto(capturedPhoto);
    };

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        setPhoto: Dispatch<SetStateAction<string | null>>,
    ) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelfieFileUpload = () => {
        selfieInputRef.current?.click();
    };
    const handleRightSideFileUpload = () => {
        rightSideInputRef.current?.click();
    };
    const handleLeftSideFileUpload = () => {
        leftSideInputRef.current?.click();
    };

    const openSelfiePopup = () => setIsSelfiePopupOpen(true);
    const closeSelfiePopup = () => setIsSelfiePopupOpen(false);

    const openRightSidePopup = () => setIsRightSidePopupOpen(true);
    const closeRightSidePopup = () => setIsRightSidePopupOpen(false);

    const openLeftSidePopup = () => setIsLeftSidePopupOpen(true);
    const closeLeftSidePopup = () => setIsLeftSidePopupOpen(false);

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
                        res.blob(),
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

            setSubStep((prev) => prev + 1);
            setCapturedPhoto(null);
            setIsButtonLoading(false);
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        }
    };

    const handleRightSideContinue = async () => {
        setIsButtonLoading(true);

        try {
            // Initialize variables for the blob
            let rightSidePhotoBlob: Blob | null = null;

            // Convert the base64 or URL to Blob for selfie photo
            if (rightSidePhoto) {
                if (rightSidePhoto.startsWith('data:')) {
                    rightSidePhotoBlob = base64ToBlob(
                        rightSidePhoto,
                        'image/jpeg',
                    );
                } else {
                    rightSidePhotoBlob = await fetch(rightSidePhoto).then(
                        (res) => res.blob(),
                    );
                }
            }

            // Ensure both photos are available before proceeding
            if (!rightSidePhotoBlob) {
                throw new Error('The right side of your face is required');
            }

            const sideFileName = `right-side-${Date.now()}.jpg`;
            await uploadSideImages(user_id, rightSidePhotoBlob, sideFileName);

            await updateUserRightSidePhotoURL(user_id, sideFileName);

            setSubStep((prev) => prev + 1);
            setCapturedPhoto(null);
            setIsButtonLoading(false);
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        }
    };
    const handleLeftSideContinue = async () => {
        setIsButtonLoading(true);

        try {
            // Initialize variables for the blob
            let leftSidePhotoBlob: Blob | null = null;

            // Convert the base64 or URL to Blob for selfie photo
            if (leftSidePhoto) {
                if (leftSidePhoto.startsWith('data:')) {
                    leftSidePhotoBlob = base64ToBlob(
                        leftSidePhoto,
                        'image/jpeg',
                    );
                } else {
                    leftSidePhotoBlob = await fetch(leftSidePhoto).then((res) =>
                        res.blob(),
                    );
                }
            }

            // Ensure both photos are available before proceeding
            if (!leftSidePhotoBlob) {
                throw new Error('The left side of your face is required');
            }

            const sideFileName = `left-side-${Date.now()}.jpg`;
            await uploadSideImages(user_id, leftSidePhotoBlob, sideFileName);

            await updateUserLeftSidePhotoURL(user_id, sideFileName);

            setSubStep((prev) => prev + 1);
            setCapturedPhoto(null);
            setIsButtonLoading(false);
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        } finally {
            pushToNextRoute();
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
        fileName: string,
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

    const uploadSideImages = async (
        userId: string,
        image: Blob,
        fileName: string,
    ) => {
        const filePath = `${userId}/${fileName}`;

        const supabase = createSupabaseBrowserClient();

        const { error } = await supabase.storage
            .from('face-picture-uploads')
            .upload(filePath, image);

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div
                        className={`flex flex-col gap-4 animate-slideRight w-full justify-start items-start mb-24`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} md:leading-normal`}
                        >
                            {selfiePhoto
                                ? 'Review and confirm photo of your face'
                                : 'Upload photos of your face.'}
                        </BioType>

                        {!selfiePhoto && (
                            <div className="flex flex-col gap-4">
                                <BioType className={`it-body md:itd-body`}>
                                    To provide you with the best treatment, we
                                    need a photo of your face.
                                </BioType>
                                <BioType className="it-subtitle md:itd-subtitle">
                                    Make sure your photo
                                </BioType>
                                <div>
                                    <div className="flex space-x-2 items-center">
                                        <CheckIcon fontSize="small" />
                                        <BioType className="it-body md:itd-body">
                                            Is not too dark or blurry
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <CheckIcon fontSize="small" />
                                        <BioType className="it-body md:itd-body">
                                            Only has you in the photo
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Has not been edited or filtered
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Was taken within the past 30 days
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Shows your full face
                                        </BioType>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-[32px] w-full">
                            <div className="flex flex-col">
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
                                            : ' border-[2px] border-dashed border-[#AFAFAF] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden`}
                                >
                                    {selfiePhoto ? (
                                        <div className="p-0 md:-mt-2 relative w-full h-full rounded-[4px] overflow-hidden">
                                            <Image
                                                src={selfiePhoto}
                                                alt={'selfie'}
                                                layout="fill"
                                                objectFit="contain"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-[14px] md:bottom-[8px] right-[6px]">
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
                                                    <BioType className="body1 text-white text-[14px]">
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {userGender === 'Female' ? (
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/female-front-portrait.png'
                                                    }
                                                    alt={''}
                                                    sizes=""
                                                    className=""
                                                    width={128}
                                                    height={128}
                                                    unoptimized
                                                />
                                            ) : (
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/male-front-portrait.png'
                                                    }
                                                    alt={''}
                                                    width={128}
                                                    height={128}
                                                    sizes=""
                                                    className=""
                                                    unoptimized
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                <input
                                    ref={selfieInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                        handleFileChange(e, setSelfiePhoto)
                                    }
                                />

                                {!selfiePhoto && (
                                    <div className="flex flex-col">
                                        <div className="hidden md:flex flex-grow py-2 gap-3 mt-1">
                                            <Button
                                                variant="outlined"
                                                onClick={openSelfiePopup}
                                                fullWidth
                                                sx={{
                                                    height: '42px',
                                                    // backgroundColor: '#000000',
                                                    // '&:hover': {
                                                    //     backgroundColor:
                                                    //         '#666666',
                                                    // },
                                                }}
                                            >
                                                Take a photo
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant="contained"
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
                                            <div className="flex md:hidden py-2 mt-2">
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
                                                    variant="contained"
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
                                    <div className="flex flex-col w-[312px] md:mt-3 mb-1 mt-4">
                                        <BioType className="body1bold text-[16px]">
                                            Make sure your photo
                                        </BioType>
                                        <div className="flex space-x-2 items-center">
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center">
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Only has you in the photo
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center align-middle">
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Has not been edited or filtered
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center align-middle">
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Shows your full face
                                            </BioType>
                                        </div>
                                    </div>
                                )}

                                {/**
                                 * Buttons to submit license photo are different for mobile/desktop
                                 * Below is Desktop
                                 */}
                                {selfiePhoto && (
                                    <div className="flex flex-col mt-3">
                                        {isButtonLoading ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    className="py-2 px-4"
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
                                                variant="contained"
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
                                                className="py-2 px-4"
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
                );
            case 1:
                return (
                    <div
                        className={`flex flex-col gap-4 items-center animate-slideRight w-full mb-24`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} md:leading-normal`}
                        >
                            {rightSidePhoto ? (
                                'Review and confirm photo of your face'
                            ) : (
                                <>
                                    Upload a photo of the{' '}
                                    <span className="underline decoration-2">
                                        right side
                                    </span>{' '}
                                    of your face
                                </>
                            )}
                        </BioType>

                        {!rightSidePhoto && (
                            <div className="flex flex-col gap-4">
                                <BioType className={`it-body md:itd-body`}>
                                    To provide you with the best treatment, we
                                    need a photo of the right side of your face.
                                </BioType>
                                <BioType className="it-subtitle md:itd-subtitle">
                                    Make sure your photo
                                </BioType>
                                <div>
                                    <div className="flex space-x-2 items-center">
                                        <CheckIcon fontSize="small" />
                                        <BioType className="it-body md:itd-body">
                                            Is not too dark or blurry
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <CheckIcon fontSize="small" />
                                        <BioType className="it-body md:itd-body">
                                            Only has you in the photo
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Has not been edited or filtered
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Was taken within the past 30 days
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Shows the{' '}
                                            <span className="underline decoration-1">
                                                right side
                                            </span>{' '}
                                            of your face
                                        </BioType>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-[32px] w-full">
                            <div className="flex flex-col">
                                <Popup
                                    setPhoto={handleRightSideFaceCapture}
                                    isOpen={isRightSidePopupOpen}
                                    onClose={closeRightSidePopup}
                                    cameraFor={'right-side-face'}
                                    capturedPhoto={capturedPhoto}
                                    setCapturedPhoto={setCapturedPhoto}
                                />

                                <div
                                    className={`flex relative rounded-[4px] ${
                                        rightSidePhoto
                                            ? 'aspect-[4/3]'
                                            : ' border-1 border-dashed border-[#1b1b1b] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden`}
                                >
                                    {rightSidePhoto ? (
                                        <div className="p-0 md:-mt-2 relative w-full h-full rounded-[4px] overflow-hidden">
                                            <Image
                                                src={rightSidePhoto}
                                                alt={'selfie'}
                                                layout="fill"
                                                objectFit="contain"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-[14px] md:bottom-[8px] right-[6px]">
                                                <Button
                                                    onClick={() => {
                                                        setRightSidePhoto(null);
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
                                                    <BioType className="body1 text-white text-[14px]">
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {userGender === 'Female' ? (
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/female-right-portrait.png'
                                                    }
                                                    alt={''}
                                                    sizes=""
                                                    className=""
                                                    width={128}
                                                    height={128}
                                                    unoptimized
                                                />
                                            ) : (
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/male-right-side-portrait.png'
                                                    }
                                                    alt={''}
                                                    width={128}
                                                    height={128}
                                                    sizes=""
                                                    className=""
                                                    unoptimized
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                <input
                                    ref={rightSideInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        handleFileChange(e, setRightSidePhoto);
                                    }}
                                />

                                {!rightSidePhoto && (
                                    <div className="flex flex-col">
                                        <div className="hidden md:flex flex-grow py-2 gap-3 mt-1">
                                            <Button
                                                variant="contained"
                                                onClick={openRightSidePopup}
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
                                                variant="contained"
                                                onClick={
                                                    handleRightSideFileUpload
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
                                        {!rightSidePhoto && (
                                            <div className="flex md:hidden py-2 mt-2">
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
                                                    variant="contained"
                                                    onClick={
                                                        handleRightSideFileUpload
                                                    }
                                                >
                                                    Take Photo
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {rightSidePhoto && (
                                    <div className="flex flex-col w-[312px] md:mt-3 mb-1 mt-4">
                                        <BioType className="body1bold text-[16px]">
                                            Make sure your photo
                                        </BioType>
                                        <div className="flex space-x-2 items-center">
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center">
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Only has you in the photo
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center align-middle">
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Has not been edited or filtered
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center align-middle">
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Shows the right side of the face
                                            </BioType>
                                        </div>
                                    </div>
                                )}

                                {/**
                                 * Buttons to submit license photo are different for mobile/desktop
                                 * Below is Desktop
                                 */}
                                {rightSidePhoto && (
                                    <div className="flex flex-col mt-3">
                                        {isButtonLoading ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    className="py-2 px-4"
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
                                                variant="contained"
                                                fullWidth
                                                disabled={
                                                    rightSidePhoto
                                                        ? false
                                                        : true
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
                                                className="py-2 px-4"
                                                onClick={
                                                    handleRightSideContinue
                                                }
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div
                        className={`flex flex-col gap-4 items-center animate-slideRight w-full mb-24`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} md:leading-normal`}
                        >
                            {leftSidePhoto ? (
                                'Review and confirm photo of your face'
                            ) : (
                                <>
                                    Upload a photo of the{' '}
                                    <span className="underline decoration-2">
                                        left side
                                    </span>{' '}
                                    of your face
                                </>
                            )}
                        </BioType>

                        {!leftSidePhoto && (
                            <div className="flex flex-col gap-4">
                                <BioType className={`it-body md:itd-body`}>
                                    To provide you with the best treatment, we
                                    need a photo of the right side of your face.
                                </BioType>
                                <BioType className="it-subtitle md:itd-subtitle">
                                    Make sure your photo
                                </BioType>
                                <div>
                                    <div className="flex space-x-2 items-center">
                                        <CheckIcon fontSize="small" />
                                        <BioType className="it-body md:itd-body">
                                            Is not too dark or blurry
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <CheckIcon fontSize="small" />
                                        <BioType className="it-body md:itd-body">
                                            Only has you in the photo
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Has not been edited or filtered
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Was taken within the past 30 days
                                        </BioType>
                                    </div>
                                    <div className="flex space-x-2 items-center align-middle">
                                        <CheckIcon
                                            fontSize="small"
                                            sx={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <BioType className="it-body md:itd-body">
                                            Shows the{' '}
                                            <span className="underline decoration-1">
                                                left side
                                            </span>{' '}
                                            of your face
                                        </BioType>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-[32px] w-full">
                            <div className="flex flex-col">
                                <Popup
                                    setPhoto={handleLeftSideFaceCapture}
                                    isOpen={isLeftSidePopupOpen}
                                    onClose={closeLeftSidePopup}
                                    cameraFor={'left-side-face'}
                                    capturedPhoto={capturedPhoto}
                                    setCapturedPhoto={setCapturedPhoto}
                                />

                                <div
                                    className={`flex relative rounded-[4px] ${
                                        leftSidePhoto
                                            ? 'aspect-[4/3]'
                                            : ' border-1 border-dashed border-[#1b1b1b] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden`}
                                >
                                    {leftSidePhoto ? (
                                        <div className="p-0 md:-mt-2 relative w-full h-full rounded-[4px] overflow-hidden">
                                            <Image
                                                src={leftSidePhoto}
                                                alt={'selfie'}
                                                layout="fill"
                                                objectFit="contain"
                                                unoptimized
                                            />
                                            <div className="absolute bottom-[14px] md:bottom-[8px] right-[6px]">
                                                <Button
                                                    onClick={() => {
                                                        setLeftSidePhoto(null);
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
                                                    <BioType className="body1 text-white text-[14px]">
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {userGender === 'Female' ? (
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/female-left-portrait.png'
                                                    }
                                                    alt={''}
                                                    sizes=""
                                                    className=""
                                                    width={128}
                                                    height={128}
                                                    unoptimized
                                                />
                                            ) : (
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/male-left-side-portrait.png'
                                                    }
                                                    alt={''}
                                                    width={128}
                                                    height={128}
                                                    sizes=""
                                                    className=""
                                                    unoptimized
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                <input
                                    ref={leftSideInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                        handleFileChange(e, setLeftSidePhoto)
                                    }
                                />

                                {!leftSidePhoto && (
                                    <div className="flex flex-col">
                                        <div className="hidden md:flex flex-grow py-2 gap-3 mt-1">
                                            <Button
                                                variant="contained"
                                                onClick={openLeftSidePopup}
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
                                                variant="contained"
                                                onClick={
                                                    handleLeftSideFileUpload
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
                                        {!leftSidePhoto && (
                                            <div className="flex md:hidden py-2 mt-2">
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
                                                    variant="contained"
                                                    onClick={
                                                        handleLeftSideFileUpload
                                                    }
                                                >
                                                    Take Photo
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {leftSidePhoto && (
                                    <div className="flex flex-col w-[312px] md:mt-3 mb-1 mt-4">
                                        <BioType className="body1bold text-[16px]">
                                            Make sure your photo
                                        </BioType>
                                        <div className="flex space-x-2 items-center">
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center">
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Only has you in the photo
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center align-middle">
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Has not been edited or filtered
                                            </BioType>
                                        </div>
                                        <div className="flex space-x-2 items-center align-middle">
                                            <CheckIcon
                                                sx={{
                                                    color: '#286BA2',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <BioType className="body1 text-[16px]">
                                                Shows the left side of your face
                                            </BioType>
                                        </div>
                                    </div>
                                )}

                                {/**
                                 * Buttons to submit license photo are different for mobile/desktop
                                 * Below is Desktop
                                 */}
                                {leftSidePhoto && (
                                    <div className="flex flex-col mt-3">
                                        {isButtonLoading ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    className="py-2 px-4"
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
                                                variant="contained"
                                                fullWidth
                                                disabled={
                                                    leftSidePhoto ? false : true
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
                                                className="py-2 px-4"
                                                onClick={handleLeftSideContinue}
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`flex animate-slideRight`}>
            <div className="flex flex-col gap-4">
                {renderStepContent(subStep)}
            </div>
        </div>
    );
}
