'use client';

import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
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
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../intake-v2/styles/intake-tailwind-declarations';

import { uploadPatientDocumentDB } from '@/app/utils/database/controller/patient_document_uploads/patient_document_uploads';

interface Props {
    user_id: string;
    patientName: string;
}

export default function PatientUploadDocument({ user_id, patientName }: Props) {
    //loading state of button spinner
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const [documentTypeSelected, setDocumentTypeSelected] =
        useState<string>('');

    const [documentUpload, setDocumentUpload] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [uploaded, setUploaded] = useState<boolean>(false);

    const documentInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file && file.type === 'application/pdf') {
            setDocumentUpload(file);
        }
    };

    const handleLicenseFileUpload = () => {
        documentInputRef.current?.click();
    };

    const handleDocumentUpload = async () => {
        setIsButtonLoading(true);

        try {
            if (!documentTypeSelected) {
                setErrorMessage('Please select a document type to upload');
                setIsButtonLoading(false);
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
                return;
            }
            // Ensure pdf is available before proceeding
            if (!documentUpload) {
                throw new Error('The document is required');
            }

            const documentFileName = `${documentTypeSelected}-${Date.now()}.pdf`;

            await uploadDocumentStorage(
                user_id,
                documentUpload!,
                documentFileName
            );

            await uploadPatientDocumentDB(
                user_id,
                documentTypeSelected,
                documentFileName
            );
        } catch (error: any) {
            console.error('Error in uploading document:', error);
        } finally {
            setIsButtonLoading(false); // Stop loading
            setUploaded(true);
        }
    };

    const uploadDocumentStorage = async (
        userId: string,
        file: File,
        fileName: string
    ) => {
        const filePath = `${userId}/${fileName}`;

        const supabase = createSupabaseBrowserClient();

        const { error } = await supabase.storage
            .from('document_uploads')
            .upload(filePath, file);

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    return (
        <div className={` animate-slideRight`}>
            <div className='flex flex-col gap-4 pt-10 px-10'>
                {/* No License Id submitted at the moment */}

                {!uploaded ? (
                    <div
                        className={`flex flex-col items-center md:items-start gap-4 animate-slideRight`}
                    >
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND} `}>
                            Upload your documents
                        </BioType>

                        <FormControl fullWidth>
                            <InputLabel id='document-type-select'>
                                Document Type
                            </InputLabel>
                            <Select
                                labelId='document-type-select'
                                id='demo-simple-select'
                                value={documentTypeSelected}
                                label='Document Type'
                                onChange={(e) => {
                                    setDocumentTypeSelected(e.target.value);
                                }}
                            >
                                <MenuItem value={'Bloodwork'}>
                                    {'Bloodwork'}
                                </MenuItem>
                                <MenuItem value={'Other'}>{'Other'}</MenuItem>
                            </Select>

                            <div className={`w-full flex flex-col`}>
                                <div className='flex flex-col w-full'>
                                    <div
                                        className={`flex relative rounded-[4px] ${
                                            !documentUpload &&
                                            'border-1 border-dashed border-[#1b1b1b] '
                                        } aspect-[16/9] items-center justify-center overflow-hidden mt-2 md:mt-4 w-full text-center`}
                                    >
                                        {documentUpload ? (
                                            <div className='p-0  relative w-full h-full rounded-[4px] overflow-hidden'>
                                                <div className='hidden md:block'>
                                                    <embed
                                                        src={URL.createObjectURL(
                                                            documentUpload
                                                        )}
                                                        width='100%'
                                                        height='500'
                                                    />
                                                </div>
                                                <div className='md:hidden '>
                                                    <BioType
                                                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                                    >
                                                        File Name
                                                        <br />
                                                        {documentUpload?.name}
                                                    </BioType>
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

                                    <input
                                        ref={documentInputRef}
                                        type='file'
                                        accept='application/pdf'
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileChange(e)}
                                    />

                                    <div className='flex flex-col'>
                                        {!documentUpload && (
                                            <div className='hidden md:flex flex-grow py-2 gap-3 mt-1'>
                                                <Button
                                                    fullWidth
                                                    variant='contained'
                                                    onClick={
                                                        handleLicenseFileUpload
                                                    }
                                                    sx={{
                                                        height: '42px',
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                    }}
                                                >
                                                    Upload Document
                                                </Button>
                                            </div>
                                        )}
                                        {!documentUpload && (
                                            <div className='flex md:hidden py-2 mt-2'>
                                                <Button
                                                    fullWidth
                                                    variant='contained'
                                                    onClick={
                                                        handleLicenseFileUpload
                                                    }
                                                    sx={{
                                                        height: '52px',
                                                        backgroundColor:
                                                            '#000000',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#666666',
                                                        },
                                                    }}
                                                >
                                                    Upload Document
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {documentUpload && (
                                        <div className='flex flex-col mt-3'>
                                            <div className=' mb-4'>
                                                <Button
                                                    onClick={() => {
                                                        setDocumentUpload(null);
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor:
                                                            'rgba(0, 0, 0, 0.45)',
                                                        color: 'white',
                                                        height: {
                                                            xs: '52px',
                                                            sm: '42px',
                                                        },

                                                        boxShadow: 4,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgba(0, 0, 0, 0.8)',
                                                        },
                                                    }}
                                                >
                                                    Reupload
                                                </Button>
                                            </div>
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
                                                            sx={{
                                                                color: 'white',
                                                            }}
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
                                                            handleDocumentUpload
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
                                                        Confirm Upload
                                                    </Button>
                                                    {errorMessage && (
                                                        <BioType className='mt-2 it-body text-red-500'>
                                                            {errorMessage}
                                                        </BioType>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormControl>
                    </div>
                ) : (
                    <div
                        className={`flex flex-col items-center md:items-start gap-4 animate-slideRight`}
                    >
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND}  mb-10 text-center`}
                        >
                            Thank you for uploading the necessary documents! You
                            can now close this tab.
                        </BioType>
                    </div>
                )}
            </div>
        </div>
    );
}
