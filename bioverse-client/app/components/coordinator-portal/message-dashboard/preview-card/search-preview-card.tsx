'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { formatThreadSidebarTimestamp } from '@/app/utils/actions/message/message-util';
import { Avatar, Paper } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';
import PreviewTipTap from './components/preview-tiptap';
import { AllThreadIndividualThread } from '@/app/types/messages/messages-types';

interface SearchMessagePreviewProps {
    thread_data: AllThreadIndividualThread;
}

export default function SearchPreviewCard({
    thread_data,
}: SearchMessagePreviewProps) {
    return (
        <Paper
            elevation={3}
            className='flex h-[98px] md:h-[98px] w-full max-w-[90vw] min-w-[90vw] md:min-w-[600px] gap-2 justify-center items-center bg-slate-100'
        >
            <div className='flex flex-row px-4 items-center h-full w-full gap-3 overflow-y-hidden'>
                <div className='flex flex-col'>
                    <Avatar className='flex text-[20px]'>
                        {thread_data.threads.patient?.first_name?.charAt(0) ??
                            '' +
                                thread_data.threads.patient?.last_name?.charAt(
                                    0
                                ) ??
                            ''}
                    </Avatar>
                </div>

                <div className='flex flex-col w-full overflow-y-hidden text-left'>
                    <div className='flex justify-between'>
                        <BioType className='it-subtitle md:itd-subtitle truncate'>
                            {thread_data.threads.patient?.first_name ?? ''}{' '}
                            {thread_data.threads.patient?.last_name ?? ''}
                        </BioType>

                        <BioType className='id-body md:itd-body text-textSecondary flex justify-end'>
                            {formatThreadSidebarTimestamp(
                                thread_data.last_patient_message_time as Date
                            )}
                        </BioType>
                    </div>
                    <div className='flex flex-row justify-between w-full'>
                        <div className='flex flex-col items-center truncate'>
                            <BioType className='itd-body'>
                                {thread_data.threads?.product ?? ''}
                            </BioType>
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
