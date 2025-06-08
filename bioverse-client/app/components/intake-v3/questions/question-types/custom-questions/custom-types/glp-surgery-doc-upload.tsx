'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { Button, CircularProgress } from '@mui/material';
import { SetStateAction, useState, useEffect } from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import { QUESTION_HEADER_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { LabWorkDocument, LabWorkFile } from '@/app/types/patient-portal/labs';
import { SupabaseClient } from '@supabase/supabase-js';
import { LoadingButtonCustom } from '@/app/components/intake-v3/buttons/LoadingButtonCustom';
import {
    getOrderForProduct,
    updateOrderMetadata,
    getCombinedOrderV2,
} from '@/app/utils/database/controller/orders/orders-api';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { useParams, useSearchParams } from 'next/navigation';

interface GLPSurgeryDocUploadProps {
    question: any;
    handleContinueButton: any;
    setAnswered: (value: SetStateAction<boolean>) => void;
    patientId: string;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    isButtonLoading: boolean;
}

export default function GlpSurgeryDocUploadComponent({
    question,
    handleContinueButton,
    patientId,
    setAnswered,
    setFormInformation,
    setResponse,
    isButtonLoading,
}: GLPSurgeryDocUploadProps) {
    const url = useParams();
    const searchParams = useSearchParams();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [documentUploaded, setDocumentUploaded] = useState<boolean>(false);
    const [documentSkipped, setDocumentSkipped] = useState<boolean>(false);

    useEffect(() => {
        if (documentSkipped) {
            handleContinueButton();
        }
    }, [documentSkipped]);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsUploading(true);

        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            try {
                setFormInformation([file.name]);
                setResponse(
                    'I have uploaded a file with the name: ' + file.name
                );
                setAnswered(true);

                await upload(file);
            } catch (error) {
                console.error('There was an issue uploading file.');
                return;
            }
        }

        // const orderData = await getOrderForProduct(product_href, patientId);
        let orderData: any = null;
        if (product_href === 'weight-loss') {
            orderData = await getCombinedOrderV2(patientId);
        } else {
            orderData = await getOrderForProduct(product_href, patientId);
        }

        if (!orderData) {
            console.log('no order found');
            return;
        }

        console.log('order ID: ', orderData.id);

        await updateOrderMetadata(
            { doctorLetterRequired: false },
            orderData.id
        );

        setDocumentUploaded(true);
        setIsUploading(false);
    };

    const handleSkipPress = async () => {
        let orderData: any = null;
        if (product_href === 'weight-loss') {
            orderData = await getCombinedOrderV2(patientId);
        } else {
            orderData = await getOrderForProduct(product_href, patientId);
        }

        if (!orderData) {
            console.log('no order found');
            return;
        }
        await updateOrderMetadata({ doctorLetterRequired: true }, orderData.id);

        setFormInformation([
            'I will upload a lab-work document at a later time.',
        ]);
        setResponse('I will upload a lab-work document at a later time.');
        setAnswered(true);
        setDocumentSkipped(true);
    };

    /**
     * Upload a file to supabase and handle possible upload errors.
     *
     * @async
     * @param {File} file - The file object to be uploaded.
     */
    const upload = async (file: File) => {
        const supabase = createSupabaseBrowserClient();

        // Generate a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExt = file.name.split('.').pop();
        const fileName = `${uniqueSuffix}.${fileExt}`;

        // Put the file inside a unique folder for the user
        const filePath = `${patientId}/${fileName}`;

        // Try uploading the file
        try {
            let { error, data } = await supabase.storage
                .from('lab_work_file_uploads')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            if (data && data.path) {
                await insertDocument(file.name, fileName, supabase);
            }

            //TODO : handle success
        } catch (error) {
            // Correctly type the error as it is returned from supabse
            throw error;
        }
    };

    /**
     * Insert a lab work document and corresponding file into the database.
     *
     * @async
     * @param {string} documentName - The name of the lab document.
     * @param {string} fileName - The file name of the uploaded lab work.
     * @param {SupabaseClient} supabase - The Supabase client instance.
     */
    const insertDocument = async (
        documentName: string,
        fileName: string,
        supabase: SupabaseClient
    ) => {
        // Create a new lab work document entry
        const document: LabWorkDocument = {
            lab_work_type: 'bloodwork', // TODO: Change this
            document_name: documentName,
            patient_id: patientId || '',
        };

        // Get the id of the new entry for the new lab work file entry
        const { error: documentError, data } = await supabase
            .from('lab_work_document')
            .insert(document)
            .select('id')
            .single();

        if (documentError) {
            // TODO: delete the uploaded file and rollback database insert
            throw documentError;
        }

        // Create a new lab work file entry
        const workFile: LabWorkFile = {
            filename: fileName,
            lab_work_document_id: data.id, // Put the inserted document id here,
        };

        const { error: fileError } = await supabase
            .from('lab_work_file')
            .insert(workFile);

        if (fileError) {
            // TODO: delete the uploaded file and rollback database insert
            throw fileError;
        }
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full mt-[1.25rem] md:mt-[48px]'>
                <div className='flex flex-col justify-center items-center  gap-[16px] rounded-md border'>
                    <BioType className={`inter-h5-constant`}>
                        {question.question}
                    </BioType>

                    <BioType className='intake-subtitle text-weak'>
                        You&apos;ll be able to upload this document at a later
                        date, if needed. Your BIOVERSE provider will need this
                        information before prescribing your medication, if
                        appropriate.
                    </BioType>

                    {documentUploaded ? (
                        <>
                            <LoadingButtonCustom
                                onClick={handleContinueButton}
                                loading={isButtonLoading}
                            />
                        </>
                    ) : (
                        <div className='w-full mt-10'>
                            <div className='flex flex-col w-full'>
                                <Button
                                    variant='outlined'
                                    className='p-2 normal-case inter-tight-bold text-[16px]'
                                    component='label'
                                    fullWidth
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#000000',
                                        '&:hover': {
                                            backgroundColor: '#666666',
                                        },
                                        height: '52px',
                                        borderRadius: '12px',
                                    }}
                                >
                                    {isUploading ? (
                                        <CircularProgress
                                            sx={{ color: 'white' }}
                                            size={20}
                                        />
                                    ) : (
                                        <>
                                            Upload document{'  '}
                                            <PublishIcon
                                                sx={{ color: 'white' }}
                                            />
                                            <input
                                                type='file'
                                                accept='image/jpeg, image/png, image/heic, application/pdf'
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div
                                className='mt-4 flex w-full items-center justify-center cursor-pointer'
                                onClick={handleSkipPress}
                            >
                                <BioType className='inter-basic underline'>
                                    SKIP AND UPLOAD LATER
                                </BioType>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
