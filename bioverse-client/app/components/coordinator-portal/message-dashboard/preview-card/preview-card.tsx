'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { formatThreadSidebarTimestamp } from '@/app/utils/actions/message/message-util';
import { Avatar, Chip, Paper } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';
import { CoordinatorThreadData } from '@/app/types/messages/messages-types';
import MessageBubbleCoordinatorPreview from './components/preview-card-content';
import CircleIcon from '@mui/icons-material/Circle';

interface MessagePreviewProps {
    thread_data: CoordinatorThreadData;
}

export default function PreviewCard({ thread_data }: MessagePreviewProps) {
    function getFirstNWords(content: string, n: number): string {
        return content.split(' ').slice(0, n).join(' ');
    }

    return (
        <Paper
            elevation={3}
            className='flex h-[98px] md:h-[98px] w-full max-w-[90vw] min-w-[90vw] md:max-w-[600px] md:min-w-[600px] gap-2 justify-center items-center'
        >
            <div className='flex flex-row px-4 items-center h-full w-full gap-3 overflow-y-hidden'>
                <div className='flex flex-col'>
                    <Avatar className='flex text-[20px]'>
                        {thread_data?.patient_first_name?.charAt(0) +
                            thread_data?.patient_last_name?.charAt(0)}
                    </Avatar>
                </div>

                <div className='flex flex-col w-full overflow-y-hidden text-left'>
                    <div className='flex justify-between'>
                        <BioType className='it-subtitle md:itd-subtitle truncate'>
                            {thread_data?.patient_first_name}{' '}
                            {thread_data?.patient_last_name}:{' '}
                            {thread_data.product && (
                                <span className='it-body'>
                                    {thread_data.product}
                                </span>
                            )}
                        </BioType>

                        <BioType className='id-body md:itd-body text-textSecondary flex justify-end items-center gap-1'>
                            {thread_data.requires_coordinator && (
                                <Chip
                                    color='error'
                                    variant='outlined'
                                    label={
                                        <span className='flex flex-row items-center gap-1'>
                                            <CircleIcon
                                                fontSize='inherit'
                                                color='error'
                                            />
                                            Requires Follow-up
                                        </span>
                                    }
                                ></Chip>
                            )}
                            {!thread_data.requires_coordinator &&
                                thread_data.last_patient_message_time >
                                    thread_data.last_bioverse_message_time && (
                                    <CircleIcon
                                        fontSize='inherit'
                                        color='primary'
                                    />
                                )}
                            {formatThreadSidebarTimestamp(
                                new Date(thread_data?.last_message_time || '')
                            )}
                        </BioType>
                    </div>
                    <div className='flex flex-row justify-between w-full'>
                        <div className='flex flex-col items-center truncate text-[#666666] it-body max-h-[50px]'>
                            <MessageBubbleCoordinatorPreview
                                content={thread_data.content}
                            />
                        </div>
                        <ChevronRightIcon
                            className='text-gray-400'
                            fontSize='large'
                        />
                    </div>
                </div>
            </div>
        </Paper>
    );
}
