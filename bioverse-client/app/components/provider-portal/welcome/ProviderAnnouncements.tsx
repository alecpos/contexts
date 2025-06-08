'use client';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    addImageUrlsToAnnouncements,
    Announcement,
    getAnnouncementsForProvider,
    updateAnnouncementReceipt,
} from '@/app/utils/actions/provider/announcements';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
} from '@mui/material';
import Image from 'next/image';

import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

interface ProviderAnnouncementsProps {
    providerId: UUID;
    role: BV_AUTH_TYPE;
}

export default function ProviderAnnouncements({
    providerId,
    role,
}: ProviderAnnouncementsProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const announcements = await getAnnouncementsForProvider(
                    providerId,
                    role
                );

                const announcementsWithImageUrls =
                    await addImageUrlsToAnnouncements(announcements);

                setAnnouncements(announcementsWithImageUrls);
            } catch (error) {
                console.log({ error });
            }
        };
        fetchAnnouncements();
    }, [providerId, role]);

    const closeAnnouncement = async () => {
        if (announcements.length === 0) {
            return;
        }

        const announcementReceipt = {
            user_id: providerId,
            updated_at: announcements[0].updated_at,
        };
        await updateAnnouncementReceipt(announcementReceipt);

        setAnnouncements(announcements.slice(1));
    };

    const announcement = announcements[0] || null;

    return (
        <>
            {announcement && (
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
                            {/* <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            ></div> */}
                            <CampaignOutlinedIcon />
                            <BioType className='fd-header inter-h5-bold'>
                                New Announcement!
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
                            {announcement.image_url && (
                                <div className='flex justify-center w-1/2 relative aspect-[4/3]'>
                                    <Image
                                        src={announcement.image_url}
                                        alt='Announcement image'
                                        fill
                                        priority
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className='flex flex-col gap-4 w-1/2 p-2'>
                                <BioType className='inter-h5-bold'>
                                    {announcement.title}
                                </BioType>
                                <BioType className='inter-body-regular text-[20px] text-[rgba(0,0,0,0.6)] leading-[22px]'>
                                    {announcement.body}
                                </BioType>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='flex flex-row items-center justify-center w-full mt-6'>
                            <Button
                                onClick={() => closeAnnouncement()}
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
                                    I understand
                                </span>
                            </Button>
                        </div>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
