'use client';

import { getUserStatusTagsWithNotes } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';

interface InternalNoteAlertProps {
    patient_id: string;
    order_id: string;
}

export default function InternalNoteAlert({
    patient_id,
    order_id,
}: InternalNoteAlertProps) {
    const [open, setOpen] = useState(false);
    const [seenNotes, setSeenNotes] = useSessionStorage(
        'internal-notes-seen',
        [] as string[]
    );

    const { data: statusTagsResponse, isLoading: statusTagsLoading } = useSWR(
        `${patient_id}-status-tags`,
        () => getUserStatusTagsWithNotes(patient_id, order_id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    // Get the note ID from the response and convert to string
    const noteId = statusTagsResponse?.data?.id?.toString();

    // Check if this note should be automatically marked as seen
    //If the uuid of the author is the automatic status changer, then we don't need to have the provider review the note.
    const shouldAutoMarkAsSeen =
        statusTagsResponse?.data?.last_modified_by ===
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a' ||
        !statusTagsResponse?.data?.note;

    // Initialize session storage and handle dialog visibility on mount
    useEffect(() => {
        // Don't proceed if we don't have a note ID yet
        if (!noteId) return;

        // If this note should be auto-marked as seen, add it to the list and don't show dialog
        if (shouldAutoMarkAsSeen) {
            setSeenNotes((prev: string[] | null) => {
                if (!prev || !Array.isArray(prev)) {
                    return [noteId];
                }
                if (!prev.includes(noteId)) {
                    return [...prev, noteId];
                }
                return prev;
            });
            return;
        }

        // Force create the session storage key if it doesn't exist
        if (!window.sessionStorage.getItem('internal-notes-seen')) {
            window.sessionStorage.setItem(
                'internal-notes-seen',
                JSON.stringify([])
            );
            setSeenNotes([]);
            setOpen(true);
            return;
        }

        try {
            const storedNotes = JSON.parse(
                window.sessionStorage.getItem('internal-notes-seen') || '[]'
            );
            if (!Array.isArray(storedNotes)) {
                window.sessionStorage.setItem(
                    'internal-notes-seen',
                    JSON.stringify([])
                );
                setSeenNotes([]);
                setOpen(true);
            } else if (!storedNotes.includes(noteId)) {
                setOpen(true);
            }
        } catch (error) {
            window.sessionStorage.setItem(
                'internal-notes-seen',
                JSON.stringify([])
            );
            setSeenNotes([]);
            setOpen(true);
        }
    }, [noteId, setSeenNotes, shouldAutoMarkAsSeen]);

    const handleClose = () => {
        // Don't proceed if we don't have a note ID
        if (!noteId) return;

        // Add the current note ID to the seen notes list
        setSeenNotes((prev: string[] | null) => {
            if (!prev || !Array.isArray(prev)) {
                return [noteId];
            }
            if (!prev.includes(noteId)) {
                return [...prev, noteId];
            }
            return prev;
        });
        setOpen(false);
    };

    // Extract the status tags data from the response
    const statusTags = statusTagsResponse?.data?.status_tags || [];
    const note = statusTagsResponse?.data?.note || '';

    // Correctly access the author object
    const author = statusTagsResponse?.data?.author
        ? `${statusTagsResponse.data.author.first_name || ''} ${
              statusTagsResponse.data.author.last_name || ''
          }`
        : '';

    const createdAt = statusTagsResponse?.data?.created_at || '';
    const formattedCreatedAt = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // If we don't have a note ID yet, if it should be auto-marked as seen, or if the note has already been seen, don't render the dialog
    if (
        !noteId ||
        shouldAutoMarkAsSeen ||
        !seenNotes ||
        !Array.isArray(seenNotes) ||
        seenNotes.includes(noteId)
    ) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={() => {}}
            aria-labelledby='internal-note-dialog-title'
            aria-describedby='internal-note-dialog-description'
            maxWidth='sm'
            disableEscapeKeyDown
            PaperProps={{
                style: {
                    maxWidth: '538px',
                },
            }}
        >
            <DialogTitle id='internal-note-dialog-title'>
                <div className='flex flex-row items-center gap-2'>
                    <CampaignOutlinedIcon />{' '}
                    <BioType className='inter-h5-bold'>Please Read It</BioType>
                </div>
            </DialogTitle>
            <div className='px-4'>
                <HorizontalDivider backgroundColor='#1B1B1B1F' height={1} />
            </div>
            <DialogContent>
                <BioType
                    id='internal-note-dialog-description'
                    className='flex flex-col mt-4'
                >
                    {statusTagsLoading ? (
                        'Loading notes...'
                    ) : statusTags && statusTags.length > 0 ? (
                        <div className='flex flex-col gap-4'>
                            <BioType className='inter-h6-bold text-[33px]'>
                                New Internal Note
                            </BioType>

                            {note && (
                                <div>
                                    <BioType className='inter-body text-[20px] leading-[28px]'>
                                        {note}
                                    </BioType>

                                    {author && (
                                        <BioType className='inter-body text-[20px] leading-[28px] text-gray-500'>
                                            Written by: {author}
                                        </BioType>
                                    )}

                                    {formattedCreatedAt && (
                                        <BioType className='inter-body text-[20px] leading-[28px] text-gray-500'>
                                            {formattedCreatedAt}
                                        </BioType>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        'One moment please.'
                    )}
                </BioType>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
                <Button
                    onClick={handleClose}
                    variant='contained'
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#333',
                        },
                        minWidth: '200px',
                        borderRadius: '15px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 500,
                        textTransform: 'none',
                    }}
                >
                    I understand
                </Button>
            </DialogActions>
        </Dialog>
    );
}
