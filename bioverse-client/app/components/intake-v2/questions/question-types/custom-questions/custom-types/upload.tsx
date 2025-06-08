'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { Button } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    formInformation: string[];
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function CustomUpload({
    question,
    formInformation,
    setFormInformation,
    setResponse,
    setAnswered,
    handleContinueButton,
    isButtonLoading,
}: Props) {
    const [uid, setUid] = useState<string | undefined>('');
    const [selectedFile, setSelectedFile] = useState<string>();

    useEffect(() => {
        const obtainSesion = async () => {
            const { data: sessionData } = await readUserSession();
            setUid(sessionData.session?.user.id);
        };
        obtainSesion();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setSelectedFile(file.name);
            uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        try {
            if (!file) return;

            const supabase = createSupabaseBrowserClient();

            const userId = uid;
            const sanitizedFileName = file.name.replace(
                /[^a-zA-Z0-9-_\.]/g,
                '-'
            );

            const fileName = `${sanitizedFileName}-${Date.now()}`;
            const filePath = `${userId}/${fileName}`;

            const { error } = await supabase.storage
                .from('face_cream_picture_upload')
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
            } else {
                // File uploaded successfully
                // Now, update the state as in handleFileUpload

                setFormInformation([fileName]);
                setResponse(
                    'I have uploaded a file with the name: ' + fileName
                );
                setAnswered(true);
            }
        } catch (error) {
            console.error('Error in file upload:', error);
        }
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center w-full md:w-[51.5vw] gap-[2.5vw] p-0'>
                {/* {arrowBack} */}

                <div className='flex flex-col justify-center items-center bg-[#F7F9FE] gap-[16px] rounded-md border'>
                    <BioType className='hquestion'>{question.question}</BioType>

                    <div className=''>
                        <div className='flex flex-col'>
                            <Button
                                variant='outlined'
                                className='p-2'
                                component='label'
                            >
                                CHOOSE A FILE TO UPLOAD <UploadFileIcon />
                                <input
                                    type='file'
                                    accept='image/jpeg, image/png, image/heic'
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {selectedFile && (
                                <div className='selected-file-name'>
                                    {selectedFile}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='md:mt-4'>
                    <ContinueButton
                        onClick={handleContinueButton}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            </div>
        </>
    );
}
