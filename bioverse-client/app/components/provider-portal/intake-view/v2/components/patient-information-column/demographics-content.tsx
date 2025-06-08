'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import useSWR from 'swr';
import { getLicenseSelfieSignedURL } from '../../utils/license-selfies/signed-url-retriever';
import { memo, useState } from 'react';
import ImageExpandDialogModal from './document-image-expand-modal';
import FlagPatientIDIssueModal from './id-issue-modal';
import React from 'react';
import { Button } from '@mui/material';

interface DemographicsProps {
    patient_data: DBPatientData;
    setMessageContent: (message: string) => void;
}

export default function DemographicsAccordionContent({
    patient_data,
    setMessageContent,
}: DemographicsProps) {
    const { data: license_selfie_data } = useSWR(
        `${patient_data.id}-license-selfie-data`,
        () => getLicenseSelfieSignedURL(patient_data.id),
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
            errorRetryCount: 3,
        }
    );

    const [imageDialog1Open, setImageDialog1Open] = useState(false);
    const [imageDialog2Open, setImageDialog2Open] = useState(false);

    const [flagPatientIDIssueModalOpen, setFlagPatientIDIssueModalOpen] =
        useState(false);

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

    const convertDOB = (dob: string) => {
        if (!dob) {
            return '';
        }
        const [year, month, day] = dob.split('-');
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    };

    const convertPatientSince = (date: string) => {
        const dateObj = new Date(date);
        const formattedDate = `${
            dateObj.getMonth() + 1
        }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
        return formattedDate;
    };

    return (
        <div className='flex flex-col overflow-auto h-full'>
            <div className='grid grid-cols-2 justify-between gap-y-4 leading-none '>
                {/*DATE OF BIRTH*/}
                <div>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Date of birth
                    </BioType>
                    <BioType className='inter-basic text-strong text-[14px]'>
                        {convertDOB(patient_data.date_of_birth)}
                    </BioType>
                </div>
                {/*SEX ASSIGNED AT BIRTH*/}
                <div>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Sex Assigned at Birth
                    </BioType>
                    <BioType className='inter-basic text-strong text-[14px]'>
                        {patient_data.sex_at_birth}
                    </BioType>
                </div>
                {/*MAILING ADDRESS*/}
                <div className='flex flex-col'>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Mailing Address
                    </BioType>
                    <div className='flex flex-col'>
                        <BioType className='inter-basic text-strong text-[14px] capitalize'>
                            {patient_data.address_line1
                                ? patient_data.address_line1.toLowerCase()
                                : 'N/A'}
                        </BioType>
                        {patient_data.address_line2 && (
                            <BioType className='capitalize inter-basic text-strong text-[14px]'>
                                {patient_data.address_line2.toLowerCase()}
                            </BioType>
                        )}
                        <BioType className='inter-basic text-strong text-[14px] capitalize'>
                            {patient_data.city
                                ? patient_data.city.toLowerCase()
                                : 'N/A'}
                            ,{/**LEGITSCRIPTCODETOREMOVE */ ' '}
                            {patient_data.email === 'legitscripttest1@test.com'
                                ? 'FL'
                                : patient_data.state}{' '}
                            {patient_data.zip}
                        </BioType>
                    </div>
                </div>
                <div className='flex flex-col gap-4 items-start'>
                    <div className='flex flex-col text-start'>
                        <BioType className='inter-basic text-weak text-[14px]'>
                            Patient Since
                        </BioType>
                        <BioType className='inter-basic text-strong text-[14px]'>
                            {convertPatientSince(patient_data.created_at)}
                        </BioType>
                    </div>
                </div>

                {/*EMAIL ADDRESS*/}
                <div className='flex flex-col'>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Email Address
                    </BioType>
                    <p className='text-wrap overflow-wrap inter-basic text-strong text-[14px]'>
                        {patient_data.email}
                    </p>
                    {/*<BioType className='itd-body text-wrap'>*/}
                    {/*    {patient_data.email}*/}
                    {/*</BioType>*/}
                </div>

                {/*PHONE NUMBER*/}
                <div className='flex flex-col'>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Phone number
                    </BioType>
                    <BioType className='inter-basic text-strong text-[14px]'>
                        {patient_data.phone_number}
                    </BioType>
                </div>

                {/*PATIENT ID*/}
                <div className='flex flex-col'>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Patient ID
                    </BioType>

                    {!license_selfie_data?.license ? (
                        <></>
                    ) : (
                        <div className='relative w-[90%] aspect-[1.5] cursor-pointer'>
                            <>
                                <Image
                                    src={license_selfie_data.license}
                                    alt={'license-image'}
                                    onClick={handleClickOpen2}
                                    fill
                                    quality={40}
                                    loading='lazy'
                                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                    objectFit='contain'
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        target.src = '/fallback-image.png'; // Add a fallback image
                                    }}
                                    priority={false}
                                />
                                <ImageExpandDialogModal
                                    open={imageDialog2Open}
                                    handleClose={handleClose2}
                                    image_ref={license_selfie_data.license}
                                />
                            </>
                        </div>
                    )}
                </div>

                {/*SELFIE*/}
                <div className='flex flex-col'>
                    <BioType className='inter-basic text-weak text-[14px]'>
                        Selfie
                    </BioType>
                    {!license_selfie_data?.selfie ? (
                        <></>
                    ) : (
                        <div className='relative w-[90%] aspect-[1.5] cursor-pointer'>
                            <>
                                <div className='relative w-[90%] aspect-[1.5] cursor-pointer'>
                                    <Image
                                        src={license_selfie_data.selfie}
                                        alt={'selfie-image'}
                                        onClick={handleClickOpen1}
                                        fill
                                        quality={40}
                                        loading='lazy'
                                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                        objectFit='contain'
                                        onError={(e) => {
                                            const target =
                                                e.target as HTMLImageElement;
                                            target.onerror = null; // Prevent infinite loop
                                            target.src = '/fallback-image.png'; // Add a fallback image
                                        }}
                                        priority={false}
                                    />
                                </div>
                                <ImageExpandDialogModal
                                    open={imageDialog1Open}
                                    handleClose={handleClose1}
                                    image_ref={license_selfie_data.selfie}
                                />
                            </>
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full flex justify-center mt-[14px]'>
                <Button
                    sx={{
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        paddingX: '32px',
                        paddingY: '14px',
                        ':hover': {
                            backgroundColor: 'lightgray',
                        },
                    }}
                    onClick={() => setFlagPatientIDIssueModalOpen(true)}
                    style={{
                        border: '1px solid #CC9596',
                        maxWidth: '293px',
                    }}
                    className=''
                >
                    <span className='normal-case provider-bottom-button-text  text-[#CC9596]'>
                        Flag issue with patient ID
                    </span>
                </Button>
            </div>
            <FlagPatientIDIssueModal
                open={flagPatientIDIssueModalOpen}
                handleClose={() => setFlagPatientIDIssueModalOpen(false)}
                setMessageContent={setMessageContent}
            />
        </div>
    );
}
