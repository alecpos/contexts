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
import {
    updateUserProfileLicensePhotoURL,
    updateUserProfileSelfiePhotoURL,
} from '@/app/utils/database/controller/storage/license-selfie/license-selfie-functions';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import IDVerificationDialog from '../id-verification/id-verification-dialog/id-verification-dialog';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import CheckIcon from '@mui/icons-material/Check';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import {
    ID_VERIFICATION_SKIPPED,
    SELFIE_SKIPPED,
} from '@/app/services/customerio/event_names';
import {
    ID_VERIFICATION_COMPLETED,
    SELFIE_COMPLETED,
    SELFIE_REACHED,
} from '@/app/services/mixpanel/mixpanel-constants';
import { trackMixpanelEvent } from '@/app/services/mixpanel/mixpanel-utils';
import { generateUUIDFromStringAndNumber } from '@/app/utils/functions/generateUUIDFromStringAndNumber';
import {
    checkMixpanelEventFired,
    createMixpanelEventAudit,
} from '@/app/utils/database/controller/mixpanel/mixpanel';
import { isAdvertisedProduct } from '@/app/utils/functions/pricing';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { AB_TESTS_IDS } from '../../intake-v2/types/intake-enumerators';
import { mapProductToCode } from '@/app/services/tracking/constants';
import {
    checkForExistingOrderV2,
    getCombinedOrderV2,
    getOrderForProduct,
} from '@/app/utils/database/controller/orders/orders-api';
import { markIDAndSelfieCheckJobCompleted } from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import { shouldSendIDVerification } from '@/app/services/customerio/customerioApiFactory';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';

interface Props {
    user_id: string;
    userGender: string | undefined;
    patientName: string;
    preExistingLicense: string;
    preExistingSelfie: string;
}

export default function IDVerificationV3({
    user_id,
    userGender,
    patientName,
    preExistingLicense,
    preExistingSelfie,
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

    //The string value of the selfie or license photo.
    const [selfiePhoto, setSelfiePhoto] = useState<string | null>('');
    const [licensePhoto, setLicensePhoto] = useState<string | null>('');

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);
    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    if (!user_id) {
        router.push(
            `/intake/prescriptions/${product_href}/registration?${search}`
        );
    }

    const pushToNextRoute = async () => {
        const { license, selfie } = await getIDVerificationData(user_id);

        const hasUploadedBoth = license && selfie ? '&id=success' : '';

        //if we're in an 'ID-after-checkout' test, then this will be the last route, so we'll push them to the confirmation page:
        if (
            (searchParams.get('id_test') === AB_TESTS_IDS.WL_SHOW_ID_AFTER_CHECKOUT) 
        ) {
            const query = new URLSearchParams({
                pn: mapProductToCode(product_href),
            }).toString();

            let orderData: any = null;
            if (product_href === 'weight-loss') {
                orderData = await getCombinedOrderV2(user_id);
            } else {
                orderData = await getOrderForProduct(product_href, user_id);
            }

            if (hasUploadedBoth) {
                await markIDAndSelfieCheckJobCompleted(user_id);
            }

            await shouldSendIDVerification(user_id);

            const url = `/intake-complete/confirmation-v3?${query}&orderId=${orderData?.product_href}${hasUploadedBoth}`;
            router.push(url);
        } else {
            //if we're not in an 'ID-after-checkout' test, then we'll just push to the next route:
            const nextRoute = getNextIntakeRoute(
                fullPath,
                product_href,
                search,
                false,
                'latest',
                searchParams.get('st') || 'none'
            );
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${search}${hasUploadedBoth}`
            );
        }
    };

    useEffect(() => {
        if (preExistingLicense) {
            if (product_href === PRODUCT_HREF.TRETINOIN) {
                pushToNextRoute();
                return;
            }
            setSubStep(1);
            return;
        }
        if (preExistingLicense && preExistingSelfie) {
            pushToNextRoute();
            return;
        }
    }, [preExistingLicense, preExistingSelfie]);

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

            // await triggerEvent(user_id, ID_VERIFICATION_UPLOADED);

            //Note: this says licensePhotoUrl / selfiePhotoUrl but it only keeps the filenames.
            await updateUserProfileLicensePhotoURL(user_id, licenseFileName);

            await trackRudderstackEvent(
                user_id,
                RudderstackEvent.ID_VERIFICATION_COMPLETED
            );
            await trackRudderstackEvent(
                user_id,
                RudderstackEvent.SELFIE_REACHED
            );
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        } finally {
            if (preExistingSelfie) {
                pushToNextRoute();
            } else {
                setIsButtonLoading(false); // Stop loading

                /**
                 * skin-care flow has a different flow.
                 */
                if (product_href === PRODUCT_HREF.TRETINOIN) {
                    pushToNextRoute();
                    return;
                }

                setSubStep((prev) => prev + 1);
            }
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

            // await triggerEvent(user_id, SELFIE_UPLOADED);

            await updateUserProfileSelfiePhotoURL(user_id, selfieFileName);

            const { data, error } = await checkMixpanelEventFired(
                user_id,
                SELFIE_COMPLETED,
                product_href
            );

            if (!data && isAdvertisedProduct(product_href)) {
                const dateNow = Date.now();
                const insertId = generateUUIDFromStringAndNumber(
                    user_id,
                    SELFIE_COMPLETED,
                    dateNow
                );

                const mixpanel_payload = {
                    event: SELFIE_COMPLETED,
                    properties: {
                        distinct_id: user_id,
                        time: dateNow,
                        $insert_id: insertId,
                        product_name: product_href,
                    },
                };

                await trackRudderstackEvent(
                    user_id,
                    RudderstackEvent.SELFIE_COMPLETED
                );

                await trackMixpanelEvent(SELFIE_COMPLETED, mixpanel_payload);

                createMixpanelEventAudit(
                    user_id,
                    SELFIE_COMPLETED,
                    product_href
                );
            }
        } catch (error: any) {
            console.error('Error in uploading images:', error);
        } finally {
            pushToNextRoute();
        }
    };

    const handleSubSkipPress = async () => {
        setCapturedPhoto(null);

        const { data, error } = await checkMixpanelEventFired(
            user_id,
            ID_VERIFICATION_SKIPPED,
            product_href
        );

        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.ID_VERIFICATION_SKIPPED
        );

        await trackRudderstackEvent(user_id, RudderstackEvent.SELFIE_REACHED);

        if (preExistingSelfie || product_href === PRODUCT_HREF.TRETINOIN) {
            pushToNextRoute();
        } else {
            setSubStep((prev) => prev + 1);
        }
    };

    const handleSkipPress = async () => {
        setIsButtonLoading(true);
        // await triggerEvent(user_id, SELFIE_SKIPPED, {
        //     url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
        // });

        const { data, error } = await checkMixpanelEventFired(
            user_id,
            SELFIE_SKIPPED,
            product_href
        );

        if (!data && isAdvertisedProduct(product_href)) {
            const dateNow = Date.now();
            const insertId = generateUUIDFromStringAndNumber(
                user_id,
                SELFIE_SKIPPED,
                dateNow
            );

            const mixpanel_payload = {
                event: SELFIE_SKIPPED,
                properties: {
                    distinct_id: user_id,
                    time: dateNow,
                    $insert_id: insertId,
                    product_name: product_href,
                },
            };

            await trackRudderstackEvent(
                user_id,
                RudderstackEvent.SELFIE_SKIPPED
            );

            await trackMixpanelEvent(SELFIE_SKIPPED, mixpanel_payload);

            createMixpanelEventAudit(user_id, SELFIE_SKIPPED, product_href);
        }
        pushToNextRoute();
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
        <div
            className={`flex animate-slideRight mt-[1.25rem] md:mt-[48px] pb-16 lg:pb-0`}
        >
            <div className='flex flex-col gap-4'>
                {subStep === 0 ? (
                    <div
                        className={`flex flex-col items-start gap-2 animate-slideRight`}
                    >
                        <BioType className={`inter-h5-question-header`}>
                            {licensePhoto
                                ? 'Review and confirm ID'
                                : 'Upload your photo ID'}
                        </BioType>

                        {!licensePhoto && (
                            <>
                                <div className='flex flex-row gap-1 mt-1'>
                                    <div
                                        className={`intake-subtitle underline text-[#1e9cd1] hover:cursor-pointer `}
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
                                    className={`intake-subtitle text-[#656565]  mb-2 `}
                                >
                                    Take a photo of your ID, or upload an
                                    existing file. Examples include:
                                    driver&apos;s license, passport, school ID,
                                    or consular ID.
                                </BioType>
                            </>
                        )}

                        <div
                            className={`w-full flex flex-col   ${
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
                                    className={`flex relative rounded-xl ${
                                        licensePhoto
                                            ? 'aspect-[4/3]'
                                            : ' border-1 border-dashed border-[#1b1b1b] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden mt-2 md:mt-3 mb-1 w-full`}
                                    style={
                                        !licensePhoto
                                            ? {
                                                  borderColor: '#1b1b1b',
                                                  borderStyle: 'dashed',
                                                  borderWidth: '1px',
                                                  borderImage: 'none',
                                                  borderSpacing: '2px',
                                                  backgroundColor: 'white',
                                              }
                                            : {}
                                    }
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
                                                    <BioType className='inter-tight normal-case text-white text-[14px]'>
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='relative w-[35%] aspect-[1/1] bottom-3 opacity-75'>
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

                                <input
                                    ref={licenseInputRef}
                                    type='file'
                                    accept='image/png, image/jpeg'
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                        handleFileChange(e, setLicensePhoto)
                                    }
                                />

                                <div className='flex flex-col'>
                                    {!licensePhoto && (
                                        <div className='hidden md:flex flex-grow py-2 gap-3 mt-1'>
                                            <Button
                                                variant='contained'
                                                onClick={openLicensePopup}
                                                fullWidth
                                                className='inter-h5-bold text-sm normal-case shadow-none'
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                    color: 'black',
                                                    borderRadius: '12px',
                                                    border: '1px solid #000000',
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
                                                className='inter-h5-bold text-sm normal-case shadow-none'
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                    borderRadius: '12px',
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
                                                    borderRadius: '12px',
                                                }}
                                                className='normal-case inter-h5-constant-bold text-[16px]'
                                            >
                                                Take Photo
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {licensePhoto && (
                                    <div className='flex flex-col w-[312px] md:mt-3 mb-1 mt-4'>
                                        <BioType className='inter-h5-regular text-[16px]'>
                                            Make sure your photo
                                        </BioType>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='inter-h5-regular text-[16px]'>
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='inter-h5-regular text-[16px]'>
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
                                            <BioType className='inter-h5-regular text-[16px]'>
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
                                                    className='py-2 px-4 inter-tight-bold text-[16px] normal-case'
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
                                                        borderRadius: '12px',
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {!licensePhoto && (
                                    <div className='mt-6 flex flex-col gap-2 inter'>
                                        <div className='flex'>
                                            <BioType className=' text-[15px]'>
                                                <span className='!text-[#1b1b1b99] inter'>
                                                    If you skip this for now,
                                                    we&apos;ll follow up with
                                                    you after you submit your
                                                    treatment request.
                                                </span>
                                            </BioType>
                                        </div>
                                        <div className='w-full flex justify-center mt-4'>
                                            <BioType
                                                className='inter text-gray-500 underline underline-offset-4 decoration-gray-500 hover:text-[#286BA2] hover:decoration-[#286BA2] hover:cursor-pointer text-sm'
                                                onClick={handleSubSkipPress}
                                            >
                                                SKIP FOR NOW
                                            </BioType>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`flex flex-col gap-4 items-start animate-slideRight w-full pb-10 lg;pb-0`}
                    >
                        <BioType className={`inter-h5-question-header `}>
                            {selfiePhoto
                                ? 'Review and confirm photo of your face'
                                : 'Upload a photo of your face'}
                        </BioType>

                        {!selfiePhoto && (
                            <BioType
                                className={`intake-subtitle text-[#656565] mb-2 `}
                            >
                                To access treatment, we need to verify the ID
                                you submitted using a photo of you or selfie.
                            </BioType>
                        )}

                        {/**
                         * @Commentor Nathan Cho
                         * @Note 'Why do we need this' note was removed in a later iteration, may come back so keeping here.
                         */}
                        {/* {!selfiePhoto && (
                            <>
                                <div className='flex flex-row gap-1'>
                                    <div
                                        className='body1 underline !text-[#1b1b1bde] hover:cursor-pointer'
                                        onClick={openSelfieDialog}
                                    >
                                        Why do we need this?
                                    </div>
                                    <div>
                                        {userGender === 'Female' ? '🙋🏻‍♀️' : '🙋🏻'}
                                    </div>
                                </div>
                                <SelfieVerificationDialog
                                    isOpen={selfieDialogOpen}
                                    onClose={closeSelfieDialog}
                                />
                            </>
                        )} */}

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
                                    className={`flex relative rounded-xl ${
                                        selfiePhoto
                                            ? 'aspect-[4/3]'
                                            : ' border-1 border-dashed border-[#1b1b1b] aspect-[16/9]'
                                    } items-center justify-center overflow-hidden mt-2 mb-1`}
                                    style={
                                        !licensePhoto
                                            ? {
                                                  borderColor: '#1b1b1b',
                                                  borderStyle: 'dashed',
                                                  borderWidth: '1px',
                                                  borderImage: 'none',
                                                  borderSpacing: '2px',
                                                  backgroundColor: 'white',
                                              }
                                            : {}
                                    }
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
                                                    <BioType className='inter-tight text-white text-[14px] normal-case'>
                                                        RETAKE
                                                    </BioType>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {userGender === 'Female' ? (
                                                <div className='relative h-[110px] '>
                                                    <Image
                                                        src={
                                                            '/img/intake/wl/cartoon_woman_face.png'
                                                        }
                                                        alt={''}
                                                        height={100}
                                                        width={85}
                                                        className=''
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className='relative h-[140px]'>
                                                    <Image
                                                        src={
                                                            '/img/intake/intake-id-selfie-cartoon-portraits/male-inside-selfie-portrait.png'
                                                        }
                                                        alt={''}
                                                        height={140}
                                                        width={125}
                                                        className=''
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
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

                                {!selfiePhoto && (
                                    <div className='flex flex-col'>
                                        <div className='hidden md:flex flex-grow py-2 gap-3 mt-1'>
                                            <Button
                                                variant='contained'
                                                onClick={openSelfiePopup}
                                                fullWidth
                                                className='inter-h5-bold text-sm normal-case shadow-none'
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: 'white',
                                                    color: 'black',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                    borderRadius: '12px',
                                                    border: '1px solid #000000',
                                                }}
                                            >
                                                Take a photo
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant='contained'
                                                onClick={handleSelfieFileUpload}
                                                className='inter-h5-bold text-sm normal-case shadow-none'
                                                sx={{
                                                    height: '42px',
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                    borderRadius: '12px',
                                                }}
                                            >
                                                Upload Photo
                                            </Button>
                                        </div>
                                        {!selfiePhoto && (
                                            <div className='flex md:hidden py-2 mt-2 inter-h5-constant-bold normal-case'>
                                                <Button
                                                    sx={{
                                                        height: '52px',
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                        borderRadius: '12px',
                                                    }}
                                                    fullWidth
                                                    variant='contained'
                                                    onClick={
                                                        handleSelfieFileUpload
                                                    }
                                                    className='normal-case inter-h5-constant-bold text-[16px]'
                                                >
                                                    Take Photo
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selfiePhoto && (
                                    <div className='flex flex-col w-[312px] md:mt-3 mb-1 mt-4'>
                                        <BioType className='inter-h5-question-header'>
                                            Make sure your photo
                                        </BioType>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='inter-h5-regular text-[16px]'>
                                                Is not too dark or blurry
                                            </BioType>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <CheckIcon
                                                sx={{ color: '#286BA2' }}
                                            />
                                            <BioType className='inter-h5-regular text-[16px]'>
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
                                            <BioType className='inter-h5-regular text-[16px]'>
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
                                            <BioType className='inter-h5-regular text-[16px]'>
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
                                                    borderRadius: '12px',
                                                }}
                                                className='py-2 px-4 normal-case inter-tight-bold text-[16px]'
                                                onClick={handleStepContinue}
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </div>
                                )}
                                {!selfiePhoto && (
                                    <div className='mt-2 md:mt-4 flex flex-col gap-2'>
                                        <div className='flex'>
                                            <BioType className='label1 text-[15px]'>
                                                <span className='!text-[#1b1b1b99] intake-subtitle'>
                                                    If you skip this for now,
                                                    we&apos;ll follow up with
                                                    you after you submit your
                                                    treatment request.
                                                </span>
                                            </BioType>
                                        </div>
                                        <div className='w-full flex justify-center mt-5'>
                                            {isButtonLoading ? (
                                                <CircularProgress
                                                    size={25}
                                                    sx={{
                                                        color: '#286BA2',
                                                    }}
                                                />
                                            ) : (
                                                <BioType
                                                    className=' text-gray-500 underline underline-offset-4 decoration-gray-500 hover:text-[#286BA2] hover:decoration-[#286BA2] hover:cursor-pointer inter text-sm'
                                                    onClick={handleSkipPress}
                                                >
                                                    SKIP FOR NOW
                                                </BioType>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
