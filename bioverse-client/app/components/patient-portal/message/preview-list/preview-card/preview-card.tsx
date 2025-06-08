'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    formatThreadSidebarTimestamp,
    formatToMonthDay,
} from '@/app/utils/actions/message/message-util';
import { Avatar, Paper } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';
import PreviewTipTap from './components/preview-tiptap';
import { PreviewCardThreadData } from '@/app/types/messages/messages-types';

interface MessagePreviewProps {
    initial_thread_data: PreviewCardThreadData;
}

export default function PreviewCard({
    initial_thread_data,
}: MessagePreviewProps) {
    return (
        <Paper
            elevation={0}
            className='flex h-[140px] md:h-[140px] w-full max-w-[90vw] min-w-[90vw] md:min-w-[600px] gap-2 justify-between rounded-xl'
        >
            <div className='flex flex-row px-4 items-center h-full w-full gap-3'>
                <div className='flex flex-col'>
                    {initial_thread_data.avatar}
                </div>

                <div className='flex flex-col w-full text-left'>
                    <div className='flex justify-between'>
                        <BioType className='it-subtitle-inter text-[18px] md:itd-subtitle-inter md:text-[18px] truncate'>
                            {initial_thread_data.product_name}
                        </BioType>

                        <BioType className='id-body-inter md:itd-body-inter text-textSecondary sm:text-sm flex justify-end'>
                            {formatToMonthDay(
                                initial_thread_data.message.created_at
                            )}
                        </BioType>
                    </div>
                    <div className='flex flex-row justify-between w-full h-[3.3rem] md:h-[3.3rem]'>
                        <div className='flex flex-col items-center w-full'>
                            <div className='line-clamp-2 w-full'>
                                <PreviewTipTap
                                    content={
                                        initial_thread_data.message.content
                                    }
                                />
                            </div>
                        </div>
                        <ChevronRightIcon
                            className='text-gray-400'
                            fontSize='medium'
                        />
                    </div>
                </div>
            </div>
        </Paper>
    );
}
