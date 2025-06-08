'use client';

import { Modal, Box, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Fragment } from 'react';
interface InformationItem {
    type: 'paragraph' | 'bullet-list';
    text: string;
    bullets?: string[];
}
interface ImportantSafetyInformationProps {
    open: boolean;
    handleClose: () => void;
    importantSafetyInformation: InformationItem[];
}

export default function EDImportantSafetyInformation({
    open,
    handleClose,
    importantSafetyInformation,
}: ImportantSafetyInformationProps) {
    const paragraphItem = (paragraphData: InformationItem) => {
        return (
            <Typography id='modal-body' variant='body2' color='textSecondary'>
                {paragraphData.text}
            </Typography>
        );
    };

    const bulletItem = (bulletData: InformationItem) => {
        return (
            <>
                <Typography variant='body2' color='textSecondary'>
                    {bulletData.text}
                </Typography>
                {bulletData.bullets && (
                    <ul className='ml-6 text-textSecondary'>
                        {bulletData.bullets.map((bullet, index) => {
                            return (
                                <li key={index}>
                                    <Typography
                                        variant='body2'
                                        color='textSecondary'
                                    >
                                        {bullet}
                                    </Typography>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </>
        );
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    maxHeight: '75vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflowY: 'scroll',
                    '&::-webkit-scrollbar': {
                        display: 'none', // Safari and Chrome
                    },
                    msOverflowStyle: 'none', // IE and Edge
                    scrollbarWidth: 'none', // Firefox
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'grey.500',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography
                    id='modal-title'
                    variant='h6'
                    component='h2'
                    gutterBottom
                >
                    Important safety information
                </Typography>

                <div className='flex flex-col gap-4'>
                    {importantSafetyInformation.map((safetyItem, index) => {
                        if (safetyItem.type === 'paragraph') {
                            return (
                                <Fragment key={index}>
                                    {paragraphItem(safetyItem)}
                                </Fragment>
                            );
                        }
                        if (safetyItem.type === 'bullet-list') {
                            return (
                                <Fragment key={index}>
                                    {bulletItem(safetyItem)}
                                </Fragment>
                            );
                        }
                    })}
                </div>

                <Button
                    onClick={handleClose}
                    variant='contained'
                    fullWidth
                    className='bg-black pt-2 mt-4'
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}
