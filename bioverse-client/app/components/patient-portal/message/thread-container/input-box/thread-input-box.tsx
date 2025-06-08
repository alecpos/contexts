'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Tooltip,
    Menu,
    MenuItem,
    Fade,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { ChangeEvent, KeyboardEvent, useRef, useState, useEffect } from 'react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Image from 'next/image';
import Popup from '@/app/components/intake-v2/id-verification/camera-pop-up/camera-pop-up';
import ThreadTipTap from './thread-tiptap';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';

// Allowed file extensions
const ALLOWED_FILE_EXTENSIONS = [
    // Images
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    // Documents
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
];

// Max file size in bytes (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface PatientThreadInputBoxProps {
    current_message_content: string;
    setCurrentMessage: (message: string) => void;
    handleSend: () => void;
    handleSendWithImages?: (files: File[]) => Promise<void>;
    isUploading?: boolean;
}

interface FilePreview {
    id: string;
    data: string;
    file: File | null;
    type: 'image' | 'document';
    extension?: string;
}

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
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

export default function PatientThreadInputBox({
    current_message_content,
    setCurrentMessage,
    handleSend,
    handleSendWithImages,
    isUploading = false,
}: PatientThreadInputBoxProps) {
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
    const [isCameraPopupOpen, setIsCameraPopupOpen] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [mediaMenuAnchor, setMediaMenuAnchor] = useState<null | HTMLElement>(
        null
    );
    const isMediaMenuOpen = Boolean(mediaMenuAnchor);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if there is content to send
    const hasContent =
        current_message_content.trim().length > 0 || filePreviews.length > 0;

    const handleCameraCapture = (capturedPhoto: string) => {
        const byteString = atob(capturedPhoto.split(',')[1]);
        const mimeType = capturedPhoto
            .split(',')[0]
            .split(':')[1]
            .split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });
        const file = new File([blob], `camera_${Date.now()}.jpg`, {
            type: mimeType,
        });

        setFilePreviews((prev) => [
            ...prev,
            {
                id: `camera_${Date.now()}`,
                data: capturedPhoto,
                file: file,
                type: 'image',
            },
        ]);

        setIsCameraPopupOpen(false);
    };

    const handleMediaButtonClick = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        setMediaMenuAnchor(event.currentTarget);
    };

    const handleMediaMenuClose = () => {
        setMediaMenuAnchor(null);
    };

    const handleTakePhoto = () => {
        setIsCameraPopupOpen(true);
        handleMediaMenuClose();
    };

    const handleChooseFromGallery = () => {
        fileInputRef.current?.click();
        handleMediaMenuClose();
    };

    const isFileTypeAllowed = (extension: string): boolean => {
        return ALLOWED_FILE_EXTENSIONS.includes(extension.toLowerCase());
    };

    const isImageFile = (file: File): boolean => {
        return file.type.startsWith('image/');
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                alert(
                    `File "${file.name}" exceeds 50MB limit. Skipping this file.`
                );
                return;
            }

            // Check if extension is allowed
            const extension = getFileExtension(file.name);
            if (!isFileTypeAllowed(extension)) {
                alert(
                    `File type "${extension}" is not allowed. Skipping this file.`
                );
                return;
            }

            if (isImageFile(file)) {
                // Handle image files with preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews((prev) => [
                        ...prev,
                        {
                            id: `file_${Date.now()}_${file.name}`,
                            data: reader.result as string,
                            file: file,
                            type: 'image',
                            extension,
                        },
                    ]);
                };
                reader.readAsDataURL(file);
            } else {
                // Handle document files
                setFilePreviews((prev) => [
                    ...prev,
                    {
                        id: `file_${Date.now()}_${file.name}`,
                        data: '', // No preview data for documents
                        file: file,
                        type: 'document',
                        extension,
                    },
                ]);
            }
        });

        event.target.value = '';
    };

    const handleRemoveFile = (idToRemove: string) => {
        setFilePreviews((prev) =>
            prev.filter((item) => item.id !== idToRemove)
        );
    };

    const handleSendMessage = async () => {
        if (
            isUploading ||
            (!filePreviews.length && !current_message_content.trim())
        ) {
            return;
        }

        if (filePreviews.length === 0 && current_message_content.trim()) {
            handleSend();
            return;
        }

        if (handleSendWithImages) {
            const files = filePreviews
                .map((preview) => preview.file)
                .filter((file) => file !== null) as File[];

            try {
                await handleSendWithImages(files);

                setFilePreviews([]);

                setCurrentMessage('');
            } catch (error) {
                console.error('Error sending files:', error);
                alert('Failed to send files. Please try again.');
            }
        } else {
            handleSend();
            setFilePreviews([]);
        }
    };

    const closeCameraPopup = () => {
        setIsCameraPopupOpen(false);
    };

    const renderFilePreview = (preview: FilePreview) => {
        if (preview.type === 'image') {
            return (
                <div className='relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center'>
                    <div className='relative w-full h-full'>
                        <Image
                            src={preview.data}
                            alt='Preview'
                            fill
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                            }}
                            unoptimized
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className='relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex flex-col items-center justify-center p-2'>
                    {preview.extension && getFileIcon(preview.extension)}
                    <div className='text-xs mt-1 text-center font-medium truncate w-full'>
                        {/* @ts-ignore preview lenght */}
                        {preview.file?.name.length > 10
                            ? `${preview.file?.name.substring(0, 10)}...`
                            : preview.file?.name}
                    </div>
                    <div className='text-xs uppercase font-bold text-center'>
                        {preview.extension}
                    </div>
                </div>
            );
        }
    };

    const LoadingSpinner = () => (
        <div className='mt-[3px]'>
            <div role='status'>
                <svg
                    aria-hidden='true'
                    className='inline w-5 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                        fill='currentColor'
                    />
                    <path
                        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                        fill='currentFill'
                    />
                </svg>
            </div>
        </div>
    );

    return (
        <div className='w-full border-0 border-t border-solid border-[#191919] bg-white'>
            {filePreviews.length > 0 && (
                <div className='mb-2 flex flex-wrap gap-2 px-2'>
                    {filePreviews.map((preview) => (
                        <div
                            key={preview.id}
                            className='relative bg-[#F3F4F6] rounded-[5px]'
                        >
                            {renderFilePreview(preview)}
                            <Tooltip title='Remove attachment' arrow>
                                <div
                                    className='absolute top-1 right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center cursor-pointer border border-gray-300'
                                    onClick={() => handleRemoveFile(preview.id)}
                                >
                                    <CloseIcon style={{ fontSize: '12px' }} />
                                </div>
                            </Tooltip>
                        </div>
                    ))}
                </div>
            )}

            <Popup
                setPhoto={handleCameraCapture}
                isOpen={isCameraPopupOpen}
                onClose={closeCameraPopup}
                cameraFor='chat'
                capturedPhoto={capturedPhoto}
                setCapturedPhoto={setCapturedPhoto}
            />

            <input
                ref={fileInputRef}
                type='file'
                accept='.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <div className='relative flex justify-center w-full py-2'>
                <div className='relative w-[90%] bubble-grey-border min-h-[38px] flex flex-row items-center rounded-md'>
                    <div className='flex-1 overflow-hidden'>
                        <ThreadTipTap
                            content={current_message_content}
                            onContentChange={setCurrentMessage}
                        />
                    </div>

                    <div className='flex items-center gap-1 px-2 flex-shrink-0'>
                        <Tooltip title='Add Media' arrow>
                            <div
                                className='w-6 h-6 cursor-pointer'
                                onClick={handleMediaButtonClick}
                                style={{ opacity: isUploading ? 0.5 : 1 }}
                            >
                                <img
                                    src='/img/brandv2/camera-icon.svg'
                                    alt='Attach file'
                                    className='w-full h-full object-contain'
                                />
                            </div>
                        </Tooltip>
                        <Tooltip
                            title={isUploading ? 'Sending...' : 'Send message'}
                            arrow
                        >
                            <div
                                className={`w-6 h-6 cursor-pointer rounded-full flex items-center justify-center ${
                                    isUploading ? 'opacity-80' : ''
                                }`}
                                onClick={
                                    !isUploading ? handleSendMessage : undefined
                                }
                                data-send-message
                                style={{
                                    backgroundColor: hasContent
                                        ? '#A3CC96'
                                        : '#CCFBB6',
                                    padding: '7px',
                                    cursor: isUploading ? 'default' : 'pointer',
                                }}
                            >
                                {isUploading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <img
                                        src='/img/brandv2/send-icon.svg'
                                        alt='Send'
                                        className='w-5 h-5 object-contain'
                                    />
                                )}
                            </div>
                        </Tooltip>
                    </div>
                </div>

                <Menu
                    id='media-menu'
                    anchorEl={mediaMenuAnchor}
                    open={isMediaMenuOpen}
                    onClose={handleMediaMenuClose}
                    TransitionComponent={Fade}
                    MenuListProps={{
                        'aria-labelledby': 'media-button',
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            borderRadius: '12px',
                            minWidth: '200px',
                            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                            mt: 1.5,
                        },
                    }}
                >
                    <MenuItem onClick={handleTakePhoto} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <CameraAltOutlinedIcon
                                fontSize='small'
                                color='primary'
                            />
                        </ListItemIcon>
                        <ListItemText primary='Take Photo' />
                    </MenuItem>
                    <MenuItem
                        onClick={handleChooseFromGallery}
                        sx={{ py: 1.5 }}
                    >
                        <ListItemIcon>
                            <AttachFileIcon fontSize='small' color='primary' />
                        </ListItemIcon>
                        <ListItemText
                            primary='Upload File'
                            secondary='Images, PDFs, Documents, etc.'
                        />
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
}
