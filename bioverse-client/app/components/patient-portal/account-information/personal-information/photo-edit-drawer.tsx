'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, CircularProgress, useMediaQuery } from '@mui/material';
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import Popup from '@/app/components/intake-v2/id-verification/camera-pop-up/camera-pop-up';
import { updateUserProfileWithPhotoURL } from '@/app/utils/database/controller/profiles/profiles';
import {
    canExitUserFromIDVerificationCampaign,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';

interface Props {
    togglePhotoEditDrawer: () => void;
    userID: string | undefined;
    doToggleDataCheck: Dispatch<SetStateAction<boolean>>;
    licensePhoto: string;
    selfiePhoto: string;
    setLicensePhoto: Dispatch<SetStateAction<string>>;
    setSelfiePhoto: Dispatch<SetStateAction<string>>;
    setOpenSuccessSnackbar: Dispatch<SetStateAction<boolean>>;
    setSuccessMessage: Dispatch<SetStateAction<string>>;
    setOpenFailureSnackbar: Dispatch<SetStateAction<boolean>>;
    setFailureMessage: Dispatch<SetStateAction<string>>;
}

interface FormErrors {
    email?: string;
    phone_number?: string;
}

export default function PhotoEditDrawer({
    togglePhotoEditDrawer,
    userID,
    doToggleDataCheck,
    licensePhoto: pageLicensePhoto,
    selfiePhoto: pageSelfiePhoto,
    setLicensePhoto: setPageLicensePhoto,
    setSelfiePhoto: setPageSelfiePhoto,
    setOpenSuccessSnackbar,
    setSuccessMessage,
    setOpenFailureSnackbar,
    setFailureMessage,
}: Props) {
    //States to track whether license or selfie camera pop-up is open.
    const [isLicensePopupOpen, setIsLicensePopupOpen] = useState(false);
    const [isSelfiePopupOpen, setIsSelfiePopupOpen] = useState(false);

    const [selfiePhoto, setSelfiePhoto] = useState<string | null>(
        pageSelfiePhoto
    );
    const [licensePhoto, setLicensePhoto] = useState<string | null>(
        pageLicensePhoto
    );

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const licenseInputRef = useRef<HTMLInputElement>(null);
    const selfieInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);

    const [pictureInputComplete, setPictureInputComplete] =
        useState<boolean>(false);

    const isNotMobile = useMediaQuery('(min-width:640px)');

    useEffect(() => {
        if (selfiePhoto && licensePhoto) {
            setPictureInputComplete(true);
        } else {
            setPictureInputComplete(false);
        }
    }, [selfiePhoto, licensePhoto]);

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
        selfieInputRef.current?.click();
    };

    //functions for opening and closing license and selfie popups
    const openLicensePopup = () => setIsLicensePopupOpen(true);
    const closeLicensePopup = () => setIsLicensePopupOpen(false);
    const openSelfiePopup = () => setIsSelfiePopupOpen(true);
    const closeSelfiePopup = () => setIsSelfiePopupOpen(false);

    const handleClose = () => {
        togglePhotoEditDrawer();
    };

    const handleSubmit = async () => {
        setIsUploading(true);

        try {
            if (!userID) {
                console.log(
                    'There was an error with uploading your image. Please try again after refreshing the page.'
                );
                setFailureMessage(
                    'There was an error with uploading your image. Please try again after refreshing the page.'
                );
                setOpenFailureSnackbar(true);
                return;
            }

            let licensePhotoUrl = undefined;
            let selfiePhotoUrl = undefined;

            // Upload License Photo if available
            if (licensePhoto && licensePhoto !== pageLicensePhoto) {
                const licensePhotoBlob = await convertPhotoToBlob(licensePhoto);
                licensePhotoUrl = await uploadImage(
                    userID,
                    licensePhotoBlob,
                    'license'
                );
            }

            // Upload Selfie Photo if available
            if (selfiePhoto && selfiePhoto !== pageSelfiePhoto) {
                const selfiePhotoBlob = await convertPhotoToBlob(selfiePhoto);
                selfiePhotoUrl = await uploadImage(
                    userID,
                    selfiePhotoBlob,
                    'selfie'
                );
            }

            // If at least one photo is uploaded, update user profile
            if (licensePhotoUrl || selfiePhotoUrl) {
                await updateUserProfileWithPhotoURL(
                    userID,
                    licensePhotoUrl,
                    selfiePhotoUrl
                );
                await canExitUserFromIDVerificationCampaign(userID);
                setSuccessMessage('Successfully uploaded your images.');
                setOpenSuccessSnackbar(true);
            } else {
                // Handle case where no photo is available
                console.log('No photo available to upload.');
                return;
            }
        } catch (error) {
            console.error('Error in uploading images:', error);
            setFailureMessage(
                'Error: Unable to upload image. Please reach out to support if this persists.'
            );
            setOpenFailureSnackbar(true);
        } finally {
            setIsUploading(false); // Stop loading
            doToggleDataCheck((prev) => !prev);
            if (licensePhoto !== pageLicensePhoto) {
                setPageLicensePhoto(licensePhoto || '');
                togglePhotoEditDrawer();
            }
            if (selfiePhoto !== pageSelfiePhoto) {
                setPageSelfiePhoto(selfiePhoto || '');
                togglePhotoEditDrawer();
            }
        }
    };

    const uploadImage = async (
        userId: string,
        image: Blob,
        imageType: 'license' | 'selfie'
    ): Promise<string> => {
        const fileName = `${imageType}-${Date.now()}.jpg`;
        const filePath = `${userId}/${fileName}`;

        const supabase = createSupabaseBrowserClient();

        const { error } = await supabase.storage
            .from('license_and_selfie_images')
            .upload(filePath, image);

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        return fileName;
    };

    const convertPhotoToBlob = (photo: any) => {
        if (photo.startsWith('data:')) {
            return base64ToBlob(photo, 'image/jpeg');
        } else {
            return fetch(photo).then((res) => res.blob());
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

    return (
        <div className='overflow-x-hidden bg-[#f9f9f9]'>
            <div
                className='flex justify-end items-center w-full h-[50px] bg-white'
                onClick={togglePhotoEditDrawer}
            >
                <div className='mr-2 flex items-center'>
                    <BioType className='body1 text-[14px] cursor-pointer'>
                        CLOSE
                    </BioType>
                    <CloseIcon
                        sx={{
                            fontSize: 24,
                            color: '#1B1B1B8F',
                            cursor: 'pointer',
                        }}
                    />
                </div>
            </div>
            <div className='w-full h-[1px] bg-[#1B1B1B1F]'></div>
            <div className='w-[90%] mx-auto flex flex-col space-y-3'>
                <BioType className='h6 mb-2 mt-4 text-[24px] text-black'>
                    Change my ID / photo
                </BioType>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <BioType className='body1 text-black text-[16px] mb-1'>
                                ID
                            </BioType>

                            <Popup
                                setPhoto={handleLicenseCapture}
                                isOpen={isLicensePopupOpen}
                                onClose={closeLicensePopup}
                                cameraFor={'license'}
                                capturedPhoto={capturedPhoto}
                                setCapturedPhoto={setCapturedPhoto}
                            />

                            <div className='flex w-[100%] bg-white relative aspect-[16/9] items-center justify-center overflow-hidden border-dashed border-1 border-[#1B1B1B] rounded-[4px]'>
                                {licensePhoto ? (
                                    <div className='p-0 relative w-full h-full rounded-sm'>
                                        <Image
                                            src={licensePhoto}
                                            alt={'license'}
                                            layout='fill'
                                            objectFit='contain'
                                            unoptimized
                                        />
                                    </div>
                                ) : null}
                            </div>

                            <input
                                ref={licenseInputRef}
                                type='file'
                                accept='image/png, image/jpeg'
                                style={{ display: 'none' }}
                                onChange={(e) =>
                                    handleFileChange(e, setLicensePhoto)
                                }
                            />

                            <div className='flex flex-col sm:flex-row justify-center sm:space-x-4 items-stretch mt-4'>
                                <Button
                                    variant='contained'
                                    onClick={openLicensePopup}
                                    sx={{
                                        height: 52,
                                        flexGrow: 1,
                                        display: {
                                            xs: 'none',
                                            sm: 'inline-block',
                                        },
                                    }}
                                >
                                    <BioType className='body1 text-[16px] text-white'>
                                        Take Photo
                                    </BioType>
                                </Button>

                                <Button
                                    variant='contained'
                                    onClick={handleLicenseFileUpload}
                                    sx={{
                                        height: 52,
                                        flexGrow: 1,
                                    }}
                                >
                                    <BioType className='body1 text-[16px] text-white'>
                                        Upload Photo
                                    </BioType>
                                </Button>
                            </div>
                        </div>

                        <div className='flex flex-col mt-9'>
                            <BioType className='body1 text-black text-[16px] mb-1'>
                                Selfie (e.g. photo of you)
                            </BioType>

                            <Popup
                                setPhoto={handleSelfieCapture}
                                isOpen={isSelfiePopupOpen}
                                onClose={closeSelfiePopup}
                                cameraFor={'selfie'}
                                capturedPhoto={capturedPhoto}
                                setCapturedPhoto={setCapturedPhoto}
                            />

                            <div className='flex bg-white w-[100%] relative aspect-[16/9] items-center justify-center overflow-hidden border-dashed border-1 border-[#1B1B1B] rounded-[4px]'>
                                {selfiePhoto ? (
                                    <div className='relative w-[100%] h-[100%] rounded-sm'>
                                        <Image
                                            src={selfiePhoto}
                                            alt={'selfie'}
                                            fill
                                            objectFit='contain'
                                            unoptimized
                                        />
                                    </div>
                                ) : null}
                            </div>

                            <input
                                ref={selfieInputRef}
                                type='file'
                                accept='image/png, image/jpeg'
                                style={{ display: 'none' }}
                                onChange={(e) =>
                                    handleFileChange(e, setSelfiePhoto)
                                }
                            />

                            <div className='flex flex-col sm:flex-row justify-center sm:space-x-4 items-stretch mt-4'>
                                <Button
                                    variant='contained'
                                    onClick={openSelfiePopup}
                                    sx={{
                                        height: 52,
                                        flexGrow: 1,
                                        display: {
                                            xs: 'none',
                                            sm: 'inline-block',
                                        },
                                    }}
                                >
                                    <BioType className='body1 text-[16px] text-white'>
                                        Take photo
                                    </BioType>
                                </Button>

                                <Button
                                    variant='contained'
                                    onClick={handleSelfieFileUpload}
                                    sx={{
                                        height: 52,
                                        flexGrow: 1,
                                    }}
                                >
                                    <BioType className='body1 text-[16px] text-white'>
                                        Upload Photo
                                    </BioType>
                                </Button>
                            </div>
                        </div>
                        <Button
                            variant='contained'
                            onClick={handleSubmit}
                            sx={{ height: 52, marginTop: 4 }}
                        >
                            {isUploading ? (
                                <CircularProgress
                                    size={22}
                                    sx={{ color: 'white' }}
                                />
                            ) : (
                                <BioType className='body1 text-[16px] text-white'>
                                    Submit
                                </BioType>
                            )}
                        </Button>
                        <div className='h-10 sm:h-0'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
