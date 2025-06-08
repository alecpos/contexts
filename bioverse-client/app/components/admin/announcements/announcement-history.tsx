'use client';

import { getAnnouncementHistory } from '@/app/utils/actions/provider/announcements';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { format } from 'date-fns';
import { Announcement as APIAnnouncement } from '@/app/utils/actions/provider/announcements';
import Image from 'next/image';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

interface AnnouncementHistoryProps {
    announcements?: APIAnnouncement[];
}

export default function AnnouncementHistory({
    announcements,
}: AnnouncementHistoryProps) {
    const [selectedAnnouncement, setSelectedAnnouncement] =
        useState<APIAnnouncement | null>(null);

    const formatDate = (dateString: Date | string | undefined) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    };

    const handlePreview = (announcement: APIAnnouncement) => {
        setSelectedAnnouncement(announcement);
    };

    const handleClosePreview = () => {
        setSelectedAnnouncement(null);
    };

    useEffect(() => {
        console.log(selectedAnnouncement);
    }, [selectedAnnouncement]);

    return (
        <>
            <Paper className='flex flex-col px-4 pb-8 w-full'>
                <div className='flex flex-row justify-between items-center pt-4'>
                    <BioType className='p-1 font-inter text-[20px] font-medium leading-[26px] text-[rgba(51,51,51,0.75)] [font-feature-settings:"liga"_off,"clig"_off] [text-edge:cap] [leading-trim:both] w-full'>
                        Announcement History
                    </BioType>
                </div>
                <Table
                    sx={{
                        minWidth: 650,
                        '& .MuiTableRow-root:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                    aria-label='announcement history table'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <BioType className='inter-body'>ID</BioType>
                            </TableCell>
                            <TableCell align='left'>
                                <BioType className='inter-body'>
                                    Created At
                                </BioType>
                            </TableCell>
                            <TableCell align='left'>
                                <BioType className='inter-body'>Title</BioType>
                            </TableCell>
                            <TableCell align='left'>
                                <BioType className='inter-body'>
                                    Preview
                                </BioType>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {announcements?.map((announcement) => (
                            <TableRow
                                key={announcement.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component='th' scope='row'>
                                    <BioType className='inter-body'>
                                        {announcement.id}
                                    </BioType>
                                </TableCell>
                                <TableCell align='left'>
                                    <BioType className='inter-body'>
                                        {formatDate(announcement.created_at)}
                                    </BioType>
                                </TableCell>
                                <TableCell align='left'>
                                    <BioType className='inter-body'>
                                        {announcement.title}
                                    </BioType>
                                </TableCell>
                                <TableCell align='left'>
                                    <div
                                        onClick={() =>
                                            handlePreview(announcement)
                                        }
                                        className='cursor-pointer'
                                    >
                                        <Button variant='outlined' size='small'>
                                            Preview
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {selectedAnnouncement && (
                <Dialog
                    open={true}
                    maxWidth={false}
                    PaperProps={{
                        sx: {
                            width: '75vw',
                            padding: '24px 36px',
                            maxHeight: '90vh',
                        },
                    }}
                >
                    <DialogTitle sx={{ padding: '0', marginBottom: '12px' }}>
                        <div className='flex flex-row items-center gap-2'>
                            <CampaignOutlinedIcon />
                            <BioType className='fd-header inter-h5-bold'>
                                Announcement Preview
                            </BioType>
                        </div>
                        <Divider />
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            padding: '0',
                            marginTop: '6px',
                        }}
                    >
                        <div className='flex flex-row gap-6 w-full'>
                            {selectedAnnouncement.image_url && (
                                <div className='flex justify-center w-1/2 relative aspect-[4/3]'>
                                    <Image
                                        src={selectedAnnouncement.image_url}
                                        alt='Announcement image'
                                        fill
                                        priority
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className='flex flex-col gap-4 w-1/2 p-2'>
                                <BioType className='inter-h5-bold'>
                                    {selectedAnnouncement.title}
                                </BioType>
                                <BioType className='inter-body-regular text-[20px] text-[rgba(0,0,0,0.6)] leading-[22px]'>
                                    {selectedAnnouncement.body}
                                </BioType>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='flex flex-row items-center justify-center w-full mt-6'>
                            <Button
                                onClick={handleClosePreview}
                                variant='contained'
                                sx={{
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                    borderRadius: '12px',
                                    height: '42px',
                                    padding: '0 24px',
                                }}
                            >
                                <span className='normal-case inter text-[0.75rem]'>
                                    Close
                                </span>
                            </Button>
                        </div>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
