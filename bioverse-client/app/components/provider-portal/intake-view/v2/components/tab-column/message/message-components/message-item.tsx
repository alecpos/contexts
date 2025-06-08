'use client';

import React, { useState } from 'react';
import { InitialMessageV2 } from '@/app/types/messages/messages-types';
import MessageBubble from './message-bubble';
import Image from 'next/image';
import { Modal, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { format } from 'date-fns';

interface MessageItemProps {
    message: InitialMessageV2;
    providerId: string;
    isCurrentUser: boolean;
    patientId: string;
}

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
};

// Helper function to check if a file is an image
const isImageFile = (url: string): boolean => {
    const extension = getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
};

// Helper function to get the file name from a URL
const getFileName = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const segments = pathname.split('/');
        const filename = segments[segments.length - 1];

        // Decode URL encoded characters and remove any timestamp prefixes
        return decodeURIComponent(filename.replace(/^\d+_/, ''));
    } catch (error) {
        // If URL parsing fails, try to extract filename from the path
        const segments = url.split('/');
        return segments[segments.length - 1].replace(/^\d+_/, '');
    }
};

// Helper function to get appropriate icon for file type
const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
        case 'pdf':
            return <PictureAsPdfIcon style={{ color: '#f44336' }} />;
        case 'doc':
        case 'docx':
        case 'txt':
            return <DescriptionIcon style={{ color: '#2196f3' }} />;
        case 'xls':
        case 'xlsx':
        case 'csv':
            return <TableChartIcon style={{ color: '#4caf50' }} />;
        default:
            return <InsertDriveFileIcon style={{ color: '#757575' }} />;
    }
};

const MessageItem = React.memo(
    ({ message, providerId, isCurrentUser, patientId }: MessageItemProps) => {
        const [selectedImageIndex, setSelectedImageIndex] = useState<
            number | null
        >(null);

        // Functions to handle image modal
        const openImageModal = (index: number) => setSelectedImageIndex(index);
        const closeImageModal = () => setSelectedImageIndex(null);

        // Parse attachment URLs if they exist
        const getAttachmentUrls = (): string[] => {
            if (!message.attachment_urls) return [];
            return message.attachment_urls.split(',').filter(Boolean);
        };

        const attachmentUrls = getAttachmentUrls();

        // Separate attachments into images and documents
        const imageAttachments = attachmentUrls.filter((url) =>
            isImageFile(url)
        );
        const documentAttachments = attachmentUrls.filter(
            (url) => !isImageFile(url)
        );

        const formatTimestamp = (timestamp: string | Date) => {
            const date = new Date(timestamp);
            return format(date, 'MMM d, yyyy, h:mm a');
        };

        return (
            <div
                className={`flex w-full ${
                    message.sender_id === providerId
                        ? 'justify-end'
                        : 'justify-start'
                }`}
            >
                <div
                    className={`flex flex-col w-full ${
                        message.sender_id === providerId
                            ? 'items-end'
                            : 'items-start'
                    }`}
                >
                    <div
                        className={`relative px-[22px] py-4 ${
                            message.sender_id === providerId
                                ? 'bg-[#64B5F6] rounded-[12px]'
                                : message.sender_id === patientId
                                ? 'bg-[#e0f6ff] rounded-[12px]'
                                : 'bg-[#fafafa] rounded-[12px]'
                        }`}
                    >
                        <span
                            className={`text-sm text-${
                                message.sender_id === providerId
                                    ? 'white'
                                    : 'black'
                            }`}
                        >
                            {/* Message Contents */}
                            {message.content && message.content.length > 0 && (
                                <MessageBubble content={message.content} />
                            )}

                            {/* Display image attachments */}
                            {imageAttachments.length > 0 && (
                                <div className='flex flex-col space-y-2 mt-2'>
                                    {imageAttachments.map((url, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className='relative rounded-md overflow-hidden cursor-pointer'
                                            onClick={() =>
                                                openImageModal(imgIndex)
                                            }
                                        >
                                            <div className='relative w-[236px] h-[300px]'>
                                                <Image
                                                    src={url}
                                                    alt={`Attachment ${
                                                        imgIndex + 1
                                                    }`}
                                                    fill
                                                    objectFit='cover'
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Display document attachments */}
                            {documentAttachments.length > 0 && (
                                <div className='flex flex-col space-y-2 mt-2'>
                                    {documentAttachments.map(
                                        (url, docIndex) => {
                                            const fileName = getFileName(url);
                                            const extension =
                                                getFileExtension(fileName);

                                            return (
                                                <a
                                                    key={docIndex}
                                                    href={url}
                                                    download
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='no-underline'
                                                >
                                                    <div className='flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200'>
                                                        <div className='mr-3 text-2xl'>
                                                            {getFileIcon(
                                                                extension
                                                            )}
                                                        </div>
                                                        <div className='flex-1 min-w-0'>
                                                            <div className='font-medium truncate max-w-[170px] text-gray-800'>
                                                                {fileName}
                                                            </div>
                                                            <div className='text-xs uppercase text-gray-500'>
                                                                {extension}
                                                            </div>
                                                        </div>
                                                        <div className='ml-2'>
                                                            <Tooltip title='Download file'>
                                                                <DownloadIcon
                                                                    fontSize='small'
                                                                    className='text-gray-500'
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </a>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </span>
                    </div>
                </div>

                {/* Image Modal */}
                {selectedImageIndex !== null &&
                    selectedImageIndex < imageAttachments.length && (
                        <Modal
                            open={selectedImageIndex !== null}
                            onClose={closeImageModal}
                            aria-labelledby='image-modal'
                            className='flex items-center justify-center'
                        >
                            <div className='relative w-full max-w-3xl max-h-[90vh] mx-4 bg-white rounded-lg overflow-hidden'>
                                <div className='absolute top-2 right-2 z-10'>
                                    <IconButton
                                        onClick={closeImageModal}
                                        className='group relative transition-all duration-200 hover:bg-opacity-70 text-gray-400 hover:text-gray-400 rounded-full p-1.5'
                                    >
                                        <CloseIcon className='transform transition-all duration-200 group-hover:text-gray-400 group-hover:drop-shadow-lg' />
                                        <span className='absolute inset-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200'></span>
                                    </IconButton>
                                </div>
                                <div className='relative w-full h-[80vh]'>
                                    <img
                                        src={
                                            imageAttachments[selectedImageIndex]
                                        }
                                        alt='Full-size image'
                                        className='w-full h-full object-contain'
                                    />
                                </div>
                                <div className='p-2 text-center'>
                                    <BioType className='text-sm'>
                                        {formatTimestamp(message.created_at)}
                                    </BioType>
                                </div>
                                <div className='absolute bottom-12 right-4'>
                                    <a
                                        href={
                                            imageAttachments[selectedImageIndex]
                                        }
                                        download
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Tooltip title='Download image'>
                                            <IconButton
                                                sx={{
                                                    backgroundColor:
                                                        'rgba(255, 255, 255, 0.8)',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'rgba(255, 255, 255, 0.9)',
                                                    },
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </a>
                                </div>
                            </div>
                        </Modal>
                    )}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.message.content === nextProps.message.content &&
            prevProps.providerId === nextProps.providerId &&
            prevProps.isCurrentUser === nextProps.isCurrentUser
        );
    }
);

MessageItem.displayName = 'MessageItem';

export default MessageItem;
