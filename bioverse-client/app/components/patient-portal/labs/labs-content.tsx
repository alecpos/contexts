'use client';

import { isSafari } from 'react-device-detect';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Input,
    Modal,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ScienceIcon from '@mui/icons-material/ScienceOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import React, {
    createRef,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { LabWorkDocument, LabWorkFile } from '@/app/types/patient-portal/labs';
import { SupabaseClient } from '@supabase/supabase-js';
import { getLabWorkDocumentNames } from '@/app/utils/database/storage/lab-work-documents/lab-work-documents';

interface Props {
    documents: LabWorkDocument[];
    patientId: string | null;
}

/**
 * MyLabsContent is a React functional component for managing lab work documents.
 *
 * @component
 * @param {Array} documents - An array of LabWorkDocument objects representing the lab documents.
 * @param {string|null} patientId - The ID of the patient, or null if not applicable.
 * @return {JSX.Element}
 */
const MyLabsContent: React.FC<Props> = ({ documents, patientId }) => {
    // Whether an upload is in progress
    const [uploading, setUploading] = useState(false);

    // Whether an deletion is in progress
    const [deletingIndex, setDeletingIndex] = useState(-1);

    // Whether an download is in progress
    const [downloadingIndex, setDownloadingIndex] = useState(-1);

    // On page load the server passes `documents` as props
    // `refreshedDocuments` is used instead when the user makes changes (i.e., uploading or deleting files)
    const [refreshedDocuments, setRefreshedDocuments] = useState<
        LabWorkDocument[] | null
    >(null);

    // Any status message to show to users when uploading files
    const [message, setMessage] = useState<React.ReactElement | null>(null);

    // A ref for manipulating the message's style directly
    const [messageRef, setMessageRef] =
        useState<RefObject<HTMLDivElement> | null>(null);

    // Use a ref for the upload button to trigger an upload event
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [documentName, setDocumentName] = useState('');

    const handleCloseModal = () => {
        resetFileInput();
        setUploading(false);
        setModalOpen(false);
    };

    const handleSubmitFilename = () => {
        setModalOpen(false);
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            upload(file);
        }
    };

    // Trigger a fadeout after 4 seconds when a new message is displayed
    useEffect(() => {
        if (messageRef?.current) {
            setTimeout(
                (current) => {
                    current.style.opacity = '0';
                },
                4000,
                messageRef.current
            );
        }
    }, [messageRef]);

    /**
     * Trigger an upload event when the user clicks the upload button.
     */
    const handleClickUpload = () => {
        if (fileInputRef.current) {
            setMessage(null);
            fileInputRef.current.click();
        }
    };

    /**
     * Handle the file input change event to upload a selected file.
     *
     * @param {HTMLInputElement} target - The input element targeting the file.
     */
    const handleInputChange = (target: HTMLInputElement) => {
        const file = target.files?.[0];
        if (file) {
            setDocumentName(file.name);
            setUploading(true);
            setModalOpen(true);
        }
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
                await insertDocument(documentName, fileName, supabase);
            }

            handleUploadSuccess();
        } catch (error) {
            // Correctly type the error as it is returned from supabse
            const e = error as { message: string; statusCode: string };
            console.error('Error uploading file:', e.message);

            if (e.statusCode == '413') {
                handleUploadError(
                    'Your file exceeds the maximum allowed file size. Please select a file smaller than 5 MB.'
                );
            } else if (e.statusCode == '415') {
                handleUploadError(
                    'Your file is an unsupported type. Supported types are PDF, JPG, and PNG.'
                );
            } else {
                handleUploadError();
            }
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

    /**
     * Handle upload errors by showing a message and resetting the state.
     *
     * @param {string} [messageText] - Optional message text to display.
     */
    const handleUploadError = (messageText?: string) => {
        const ref = createRef<HTMLDivElement>();
        const message = (
            // Include transitions to fade out the message before removing from the DOM
            <div ref={ref} style={{ transition: 'all 1s ease-out' }}>
                <BioType className='body1 text-red-700 text-center'>
                    {messageText ||
                        'An error occured while uploading your lab results. Please try again.'}
                </BioType>
            </div>
        );

        setMessage(message);
        setMessageRef(ref);
        setUploading(false);
        resetFileInput();

        // Automatically remove message after five seconds
        setTimeout(() => setMessage(null), 5000);
    };

    /**
     * Handle upload success by showing a message and resetting the state.
     *
     * @param {string} [messageText] - Optional message text to display.
     */
    const handleUploadSuccess = (messageText?: string) => {
        const ref = createRef<HTMLDivElement>();
        const message = (
            // Include transitions to fade out the message before removing from the DOM
            <div ref={ref} style={{ transition: 'all 1s ease-out' }}>
                <BioType className='body1 text-green-700 text-center'>
                    {messageText ||
                        'Lab results uploaded successfully. Thank you!'}
                </BioType>
            </div>
        );

        setMessage(message);
        setMessageRef(ref);
        setUploading(false);
        resetFileInput();
        getDocuments();

        // Automatically remove message after five seconds
        setTimeout(() => setMessage(null), 5000);
    };

    /**
     * Reset the file input field.
     */
    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.files = null;
        }
    };

    /**
     * Retrieve the updated list of lab work documents from the database.
     *
     * @async
     */
    const getDocuments = async () => {
        const supabase = createSupabaseBrowserClient();

        try {
            const documents = await getLabWorkDocumentNames(patientId!);

            setRefreshedDocuments(documents ?? []);
        } catch (error) {
            console.error('An error occured:', error);
        }
    };

    /**
     * Handle the download button click event for downloading a document.
     *
     * @param {number} index - The index of the document in the list.
     * @param {string} documentName - The name of the document to be downloaded.
     * @param {number} [documentId] - The optional ID of the document.
     */
    const handleClickDownload = async (
        index: number,
        documentName: string,
        documentId?: number
    ) => {
        setMessage(null);

        if (documentId) {
            setDownloadingIndex(index);
            await download(documentName, documentId);
        }

        setDownloadingIndex(-1);
    };

    /**
     * Download the specified document file from supabase. Currently this function
     * opens a new tab where the user can view the PDF. We may want to just
     * trigger a download instead.
     *
     * @async
     * @param {string} documentName - The name of the document to download.
     * @param {number} documentId - The ID of the document.
     */
    const download = async (documentName: string, documentId: number) => {
        try {
            const supabase = createSupabaseBrowserClient();

            // Get the document's filename
            // For now assume that there is one file for each document
            // If there are multiple files for a document then we will need to
            // download them individually or zip them
            const { error: queryError, data } = await supabase
                .from('lab_work_file')
                .select('filename')
                .eq('lab_work_document_id', documentId)
                .single();

            if (queryError) {
                throw queryError;
            }

            // Download the file
            const fileName = `${patientId}/${data.filename}`;
            const { error, data: fileUrl } = await supabase.storage
                .from('lab_work_file_uploads')
                .createSignedUrl(fileName, 60);

            if (error) {
                throw error;
            }

            if (isSafari) {
                window.location.href = fileUrl.signedUrl;
            } else {
                // Create an anchor element and trigger the download for other platforms
                const link = document.createElement('a');
                link.href = fileUrl.signedUrl;
                link.download = documentName;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            alert(
                'An error occurred while downloading the file. Please try again.'
            );
            console.error('An error occurred:', error);
        }
    };

    /**
     * Handle the delete button click event for deleting a document. This function shows the user
     * a confirmation window and the deletion only occurs if the user confirms to continue.
     *
     * @param {number} index - The index of the document in the list.
     * @param {string} documentName - The name of the document to be deleted.
     * @param {number} [documentId] - The optional ID of the document.
     */
    const handleClickDelete = async (
        index: number,
        documentName: string,
        documentId?: number
    ) => {
        setMessage(null);

        if (
            documentId &&
            confirm(
                `Are you sure you want to delete ${documentName}? This action cannot be undone.`
            )
        ) {
            setDeletingIndex(index);
            if (await deleteDocument(documentId)) {
                const updatedDocuments = [...(refreshedDocuments || documents)];
                setRefreshedDocuments(
                    updatedDocuments.filter(
                        (document) => document.id !== documentId
                    )
                );
            }
        }

        setDeletingIndex(-1);
    };

    /**
     * Delete a specific document from the database and associated files from storage.
     *
     * @async
     * @param {number} documentId - The ID of the document to delete.
     * @return {Promise<boolean>} Returns a promise resolving to a boolean indicating success or failure.
     */
    const deleteDocument = async (documentId: number) => {
        try {
            const supabase = createSupabaseBrowserClient();

            // Delete any files uploaded to storage
            // Get all files associated with this document
            const { error: dbError, data } = await supabase
                .from('lab_work_file')
                .select('filename')
                .eq('lab_work_document_id', documentId);

            const fileNames = data?.map(
                (entry) => `${patientId}/${entry.filename}`
            );

            // Attempt to delete the files from storage
            if (fileNames) {
                const { error: storageError } = await supabase.storage
                    .from('lab_work_file_uploads')
                    .remove(fileNames);
                if (storageError) {
                    throw storageError;
                }
            }

            if (dbError) {
                throw dbError;
            }

            // Delete the document from the database
            const { error } = await supabase
                .from('lab_work_document')
                .delete()
                .eq('id', documentId);

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(
                'An error occurred while deleting the file. Please try again.'
            );
            console.error('An error occurred:', error);

            return false;
        }
        return true;
    };

    const modal = (
        <Modal open={modalOpen} onClose={handleCloseModal}>
            <Box
                sx={{
                    borderRadius: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: '#F6F9FB',
                    boxShadow: 24,
                    p: 4,
                    maxWidth: '70vw',
                }}
            >
                <div className='mb-6 w-full flex flex-col items-center'>
                    <BioType className='body1 text-xl mb-2 text-center'>
                        Please enter a name for this document
                    </BioType>
                    <Input
                        sx={{ width: '100%' }}
                        defaultValue={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                    />
                </div>
                <Button
                    variant='contained'
                    onClick={handleSubmitFilename}
                    sx={{
                        height: 42,
                        minWidth: 100,
                        alignSelf: 'center',
                        padding: '0.75rem 2rem',
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );

    // The list of all of a user's current documents
    const documentsList = (refreshedDocuments || documents).map(
        (document, i) => {
            return (
                <div key={`document-${i}`}>
                    <div className='flex items-center justify-between p-3'>
                        <BioType className='body1 w-min-0 truncate'>
                            {document.document_name}
                        </BioType>
                        <div className='flex'>
                            <div className='h-9 w-9 flex items-center justify-center'>
                                {
                                    // Show a loading icon when downloading
                                    downloadingIndex === i ? (
                                        <CircularProgress
                                            size={24}
                                            style={{ color: 'black' }}
                                        />
                                    ) : // Grey out other icons when one is downloading
                                    downloadingIndex === -1 ? (
                                        <DownloadIcon
                                            className='cursor-pointer'
                                            onClick={() =>
                                                handleClickDownload(
                                                    i,
                                                    document.document_name,
                                                    document.id
                                                )
                                            }
                                        />
                                    ) : (
                                        <DownloadIcon className='text-gray-400' />
                                    )
                                }
                            </div>
                            <div className='h-9 w-9 flex items-center justify-center'>
                                {
                                    // Show a loading icon when deleting
                                    deletingIndex === i ? (
                                        <CircularProgress
                                            size={24}
                                            style={{ color: 'black' }}
                                        />
                                    ) : // Grey out other icons when one is deleting
                                    deletingIndex === -1 ? (
                                        <DeleteIcon
                                            className='cursor-pointer'
                                            onClick={() =>
                                                handleClickDelete(
                                                    i,
                                                    document.document_name,
                                                    document.id
                                                )
                                            }
                                        />
                                    ) : (
                                        <DeleteIcon className='text-gray-400' />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Do not show a divider after the last document */}
                    {i != (refreshedDocuments || documents).length - 1 && (
                        <Divider />
                    )}
                </div>
            );
        }
    );

    return (
        <>
            {modal}
            <Paper elevation={2} className='py-5 px-5 bg-[#F6F9FB]'>
                <div className='flex flex-col items-center p-4 mb-6'>
                    {
                        // Display a status message when one is present
                        message && <div className='mb-6'>{message}</div>
                    }
                    <div>
                        <ScienceIcon style={{ fontSize: '4rem' }} />
                    </div>
                    <div className='mt-1.5 mb-6 body1'>
                        <span>
                            Have lab work? Please upload your results for
                            provider review.
                        </span>
                    </div>
                    <div className='flex flex-col justify-center'>
                        {/* A hidden input field for handling file uploads */}
                        <input
                            type='file'
                            accept='application/pdf, image/jpeg, image/jpg, image/png'
                            ref={fileInputRef}
                            className='hidden'
                            onChange={(e) =>
                                handleInputChange(e.target as HTMLInputElement)
                            }
                        />

                        {/* The upload button */}
                        <Button
                            variant='contained'
                            sx={{
                                height: 42,
                                minWidth: 100,
                                alignSelf: 'center',
                                padding: '0.75rem 2rem',
                            }}
                            onClick={handleClickUpload}
                            className='mb-1'
                        >
                            {
                                // Show a loader when uploading
                                uploading ? (
                                    <CircularProgress
                                        size={16}
                                        style={{ color: 'white' }}
                                    />
                                ) : (
                                    <BioType className='body1 text-white pt-[2px]'>
                                        UPLOAD
                                    </BioType>
                                )
                            }
                        </Button>
                        <BioType className='body1 text-sm text-gray-500'>
                            Maximum file size: 5 MB
                            <br />
                            Supported types: PDF, JPG, PNG
                        </BioType>
                    </div>
                </div>
                <div>
                    {
                        // Show a message when the list of uploaded documents is empty
                        documentsList.length ? (
                            documentsList
                        ) : (
                            <div className='flex justify-center mb-6'>
                                <BioType className='body1 italic'>
                                    You have not uploaded any documents yet.
                                </BioType>
                            </div>
                        )
                    }
                </div>
            </Paper>
        </>
    );
};

export default MyLabsContent;
