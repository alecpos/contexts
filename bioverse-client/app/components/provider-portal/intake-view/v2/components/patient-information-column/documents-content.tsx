'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import useSWR from 'swr';
import Image from 'next/image';
import {
    getLicenseSelfieSignedURL,
    getSideProfileSignedURL,
} from '../../utils/license-selfies/signed-url-retriever';
import { Button, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import ImageExpandDialogModal from './document-image-expand-modal';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import {
    getDocumentUploads,
    getDocumentURL,
} from '@/app/utils/database/controller/patient_document_uploads/patient_document_uploads';
import { SEMAGLUTIDE_PRODUCT_HREF } from '@/app/services/tracking/constants';
import { SKINCARE_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';

interface DocumentsNotesProps {
    patient_id: string;
    isOpenDocuments: boolean;
    product_href: string;
}

export default function DocumentAccordionContent({
    patient_id,
    isOpenDocuments,
    product_href,
}: DocumentsNotesProps) {
    const { data, error, isLoading } = useSWR(
        isOpenDocuments ? `${patient_id}-license-selfie-data` : null,
        () => getLicenseSelfieSignedURL(patient_id)
    );
    const { data: document_data, isLoading: documentLoading } = useSWR(
        isOpenDocuments ? `${patient_id}-document-data` : null,
        () => getDocumentUploads(patient_id)
    );

    const { data: side_profile_data, isLoading: side_profile_dataLoading } =
        useSWR(isOpenDocuments ? `${patient_id}-side-profile-data` : null, () =>
            getSideProfileSignedURL(patient_id)
        );
    const [documentData, setDocumentData] = useState<DocumentUpload[]>([]);

    useEffect(() => {
        if (document_data) {
            const updateDocumentURLs = async () => {
                const updatedDocuments = [];
                for (const document of document_data) {
                    const filePath = `${patient_id}/${document.file_url}`;
                    const { data: documentUrl, error: documentUrlError } =
                        await getDocumentURL(filePath);
                    if (documentUrlError) {
                        console.error(
                            'Error retrieving document url',
                            documentUrlError
                        );
                    }
                    if (documentUrl) {
                        // Update the file_url property of the current document
                        const updatedDocument = {
                            ...document,
                            file_url: documentUrl.signedUrl,
                        };
                        updatedDocuments.push(updatedDocument);
                    } else {
                        console.error(
                            'Error fetching document URL for:',
                            filePath
                        );
                    }
                }
                setDocumentData(updatedDocuments);
            };

            updateDocumentURLs();
        }
    }, [data, patient_id]);

    const [imageDialog1Open, setImageDialog1Open] = useState(false);
    const [imageDialog2Open, setImageDialog2Open] = useState(false);

    const [licenseURL, setLicenseURL] = useState<string>();
    const [selfieURL, setSelfieURL] = useState<string>();
    const [rightSideProfileURL, setRightSideProfileURL] = useState<string>();
    const [leftSideProfileURL, setLeftSideProfileURL] = useState<string>();

    useEffect(() => {
        if (data) {
            setLicenseURL(data.license);
            setSelfieURL(data.selfie);
        }
    }, [data]);

    useEffect(() => {
        if (side_profile_data) {
            setRightSideProfileURL(side_profile_data.right_side_profile);
            setLeftSideProfileURL(side_profile_data.left_side_profile);
        }
    });

    const handleClickOpen1 = () => {
        setImageDialog1Open(true);
    };
    const handleClose1 = () => {
        setImageDialog1Open(false);
    };

    const handleClickOpen2 = () => {
        setImageDialog2Open(true);
    };
    const handleClose2 = () => {
        setImageDialog2Open(false);
    };

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error || !data) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <div className='flex flex-col px-2 w-full gap-4'>
            {data.license && data.selfie ? (
                <div className='flex flex-col'>
                    <div className='flex flex-row py-2 w-full justify-between overflow-x-auto gap-4'>
                        <div className='flex flex-col w-full'>
                            <BioType className='itd-input'>Patient ID</BioType>
                            {licenseURL && (
                                <div className='relative w-[1/2] aspect-[1.5] cursor-pointer'>
                                    <>
                                        <Image
                                            src={licenseURL}
                                            alt={''}
                                            onClick={handleClickOpen1}
                                            // width={313.5}
                                            // height={196}
                                            fill
                                            quality={50}
                                            unoptimized
                                        />
                                        <ImageExpandDialogModal
                                            open={imageDialog1Open}
                                            handleClose={handleClose1}
                                            image_ref={licenseURL}
                                        />
                                    </>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col w-full h-full'>
                            <BioType className='itd-input'>Selfie</BioType>
                            {selfieURL && (
                                <div className='relative w-[1/2] aspect-[3/2] cursor-pointer'>
                                    <Image
                                        src={selfieURL}
                                        alt={''}
                                        onClick={handleClickOpen2}
                                        // width={313.5}
                                        // height={196}
                                        fill
                                        unoptimized
                                        quality={50}
                                    />
                                    <ImageExpandDialogModal
                                        open={imageDialog2Open}
                                        handleClose={handleClose2}
                                        image_ref={selfieURL}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <BioType className='itd-body text-[#666666]'>
                        click to expand
                    </BioType>
                </div>
            ) : (
                <>
                    <BioType className='itd-body text-red-500'>
                        Patient has not uploaded ID and Selfie
                    </BioType>
                </>
            )}
            {side_profile_data?.left_side_profile &&
            side_profile_data.right_side_profile ? (
                <div className='flex flex-col'>
                    <div className='flex flex-row py-2 w-full justify-between overflow-x-auto gap-4'>
                        <div className='flex flex-col w-full h-full'>
                            <BioType className='itd-input'>
                                Left Side Profile
                            </BioType>
                            {leftSideProfileURL && (
                                <div className='relative w-[1/2] aspect-[3/2] cursor-pointer'>
                                    <Image
                                        src={leftSideProfileURL}
                                        alt={''}
                                        onClick={handleClickOpen2}
                                        // width={313.5}
                                        // height={196}
                                        fill
                                        unoptimized
                                    />
                                    <ImageExpandDialogModal
                                        open={imageDialog2Open}
                                        handleClose={handleClose2}
                                        image_ref={leftSideProfileURL}
                                    />
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col w-full'>
                            <BioType className='itd-input'>
                                Right Side Profile
                            </BioType>
                            {rightSideProfileURL && (
                                <div className='relative w-[1/2] aspect-[1.5] cursor-pointer'>
                                    <>
                                        <Image
                                            src={rightSideProfileURL}
                                            alt={''}
                                            onClick={handleClickOpen1}
                                            // width={313.5}
                                            // height={196}
                                            fill
                                            unoptimized
                                        />
                                        <ImageExpandDialogModal
                                            open={imageDialog1Open}
                                            handleClose={handleClose1}
                                            image_ref={rightSideProfileURL}
                                        />
                                    </>
                                </div>
                            )}
                        </div>
                    </div>
                    <BioType className='itd-body text-[#666666]'>
                        click to expand
                    </BioType>
                </div>
            ) : (
                <>
                    {side_profile_dataLoading ? (
                        <LoadingScreen />
                    ) : (
                        <BioType className='itd-body text-red-500'>
                            Patient has not uploaded photos of their side
                            profiles.
                        </BioType>
                    )}
                </>
            )}

            <div className='flex flex-col gap-2'>
                <div>
                    <BioType className='itd-input'>Documents Results</BioType>
                </div>
                <div className='flex flex-col w-auto gap-4'>
                    {documentLoading && <LoadingScreen />}
                    {!documentLoading && documentData?.length < 1 && (
                        <BioType className='it-input'>
                            No Documents Uploaded
                        </BioType>
                    )}
                    {documentData &&
                        documentData.map((document, index) => (
                            <div key={index} className='flex flex-col gap-2'>
                                <div>
                                    <BioType className='it-subtitle'>
                                        {document.document_type}
                                    </BioType>
                                    <div className='flex flex-row items-center justify-around'>
                                        <BioType className='it-body'>
                                            {convertTimestamp(
                                                document?.created_at!
                                            )}
                                        </BioType>
                                        <Chip
                                            label='Open PDF'
                                            onClick={() => {
                                                window.open(
                                                    document.file_url,
                                                    '_blank'
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
