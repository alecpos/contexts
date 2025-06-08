import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { SetStateAction, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Button } from '@mui/material';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    formInformation: string[];
    checkedBoxes: string[];
    setCheckedBoxes: (value: SetStateAction<string[]>) => void;
}

export default function CheckboxBloodWorkCustom({
    question,
    setFormInformation,
    setResponse,
    setAnswered,
    formInformation,
    checkedBoxes,
    setCheckedBoxes,
}: Props) {
    const [displayMessage, setDisplayMessage] = useState<string>('');
    const [uid, setUid] = useState<string | undefined>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const obtainSesion = async () => {
            const { data: sessionData } = await readUserSession();
            setUid(sessionData.session?.user.id);
        };

        obtainSesion();
    }, []);

    useEffect(() => {
        const customerInputPrefix = 'customer-input: ';
        const customerInputEntry = formInformation.find((item) =>
            item.startsWith(customerInputPrefix)
        );
        if (customerInputEntry) {
            const fileName = customerInputEntry.substring(
                customerInputPrefix.length
            );
            setSelectedFile(new File([], fileName)); // Create a file with no content, just the name
        }
    }, [formInformation]);

    useEffect(() => {
        if (checkedBoxes[0] === 'Yes, my doctor ordered labs.') {
            if (selectedFile === null) {
                setAnswered(false);
            } else {
                setAnswered(true);
            }
        } else {
            setAnswered(true);
        }
    }, [checkedBoxes, selectedFile]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);

            // Begin the upload process immediately after file selection
            await uploadFile(files[0]);
        }
        setAnswered(true);
    };

    const uploadFile = async (file: File) => {
        try {
            if (!file) return;

            const userId = uid;
            const fileName = `${file.name}-${Date.now()}`;
            const filePath = `${userId}/${fileName}`;

            const { error } = await supabase.storage
                .from('bloodwork_upload')
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
            } else {
                // File uploaded successfully
                // Now, update the state as in handleFileUpload

                const existingFormInfo = formInformation.slice();
                const fileNameIndex = existingFormInfo.findIndex((item) =>
                    item.startsWith(`customer-input:`)
                );

                if (fileNameIndex !== -1) {
                    existingFormInfo[
                        fileNameIndex
                    ] = `customer-input: ${fileName}`;
                } else {
                    existingFormInfo.push(`customer-input: ${fileName}`);
                }

                setFormInformation(existingFormInfo);
                setResponse('Yes, my doctor ordered labs. ' + fileName);
                setAnswered(true);
            }
        } catch (error) {
            console.error('Error in file upload:', error);
        }
    };

    const renderLogicDetails = () => {
        switch (checkedBoxes[0]) {
            case 'Yes, my doctor ordered labs.':
                return (
                    <div className='flex flex-col'>
                        <Button variant='outlined' component='label'>
                            +Upload
                            <input
                                type='file'
                                accept='image/jpeg, image/png, application/pdf, application/msword'
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </Button>
                        {selectedFile && (
                            <div className='selected-file-name'>
                                {selectedFile.name}
                            </div>
                        )}
                    </div>
                );

            case 'Yes, I completed a BIOVERSE longevity panel (at-home test).':
                return (
                    <BioType className='label1'>
                        Thank you for letting us know! We’ll reference these
                        results when evaluating you for this medication.
                    </BioType>
                );

            case 'No, I have not completed any bloodwork in the past year':
                return (
                    <>
                        <BioType className='label1'>
                            Not to worry! You can still place this request, but
                            your prescriber won’t be able to approve the
                            prescription without bloodwork. At minimum, your
                            provider will need to see recent LDL levels within
                            the past year. You can purchase a BIOVERSE Longevity
                            Panel following this section as a suitable
                            alternative to lab work.
                        </BioType>
                    </>
                );

            default:
                return <></>;
        }
    };

    return (
        <div className='flex min-w-[30vw] justify-center items-center flex-row gap-[12px]'>
            <BioType className='label1'>{renderLogicDetails()}</BioType>
        </div>
    );
}
