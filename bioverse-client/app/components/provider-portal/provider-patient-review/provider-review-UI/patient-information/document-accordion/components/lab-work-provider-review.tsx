'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { LabWorkDocument } from '@/app/types/patient-portal/labs';
import { getLabWorkSignedURL } from '@/app/utils/database/storage/lab-work-documents/lab-work-documents';
import DownloadIcon from '@mui/icons-material/Download';
import { CircularProgress, Divider } from '@mui/material';
import { useState } from 'react';
import { isSafari } from 'react-device-detect';

interface LabWorkComponentProps {
    documents: LabWorkDocument[] | undefined;
    patientId: string;
}

export default function LabWorkProviderReview({
    documents,
    patientId,
}: LabWorkComponentProps) {
    const [downloadingIndex, setDownloadingIndex] = useState(-1);

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
        documentId: number
    ) => {
        if (documentId) {
            setDownloadingIndex(index);

            console.log('download data: ', documentId, patientId);

            const downloadURL = await getLabWorkSignedURL(
                documentId,
                patientId
            );

            console.log('download url: ', downloadURL);

            if (!downloadURL) {
                console.error('No Download URL');
                setDownloadingIndex(-1);
                return;
            }

            try {
                if (isSafari) {
                    window.location.href = downloadURL.signedUrl;
                } else {
                    // Create an anchor element and trigger the download for other platforms
                    const link = document.createElement('a');
                    link.href = downloadURL.signedUrl;
                    link.download = documentName;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } catch (error) {
                console.error(error);
                setDownloadingIndex(-1);
                return;
            }
        }

        setDownloadingIndex(-1);
    };

    const documentsList =
        documents &&
        documents.map((document, i) => {
            return (
                <div key={`document-${i}`}>
                    <div className='flex items-center justify-between p-3'>
                        <BioType className='provider-tabs-subtitle w-min-0 truncate'>
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
                                                    document.id!
                                                )
                                            }
                                        />
                                    ) : (
                                        <DownloadIcon className='text-gray-400' />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Do not show a divider after the last document */}
                    {i != documents.length - 1 && <Divider />}
                </div>
            );
        });

    return (
        <div className='flex flex-col gap-2'>
            <BioType className='provider-tabs-subtitle'>Patient Lab Work</BioType>
            {documents && documentsList}
            {documents?.length === 0 && (
                <>
                    <BioType className='provider-tabs-subtitle-weak'>No Documents</BioType>
                </>
            )}
        </div>
    );
}
