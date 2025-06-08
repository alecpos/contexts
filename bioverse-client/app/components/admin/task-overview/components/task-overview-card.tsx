'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { CircularProgress, Paper } from '@mui/material';
import { Fragment } from 'react';

interface TaskOverviewCardProps {
    title: string;
    primaryDisplayText: string | undefined;
    secondaryDisplayText: string[];
    isValidating: boolean;
}

export default function TaskOverviewCard({
    title,
    primaryDisplayText,
    secondaryDisplayText,
    isValidating,
}: TaskOverviewCardProps) {
    return (
        <>
            <Paper className='flex flex-col h-[230.12px] w-[303.82px] relative'>
                <div className='flex flex-col p-4 justify-center'>
                    {isValidating && (
                        <div className='absolute top-2 right-2'>
                            <CircularProgress size={20} />
                        </div>
                    )}
                    <BioType className='itd-subtitle text-[#646464]'>
                        {title}
                    </BioType>
                    <div className='flex my-3'>
                        <BioType className={`itd-h1 text-[2rem]`}>
                            {primaryDisplayText ?? (
                                <span className='itd-subtitle'>Loading...</span>
                            )}
                        </BioType>
                    </div>
                    {secondaryDisplayText.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                <BioType className='itd-body text-[#9E9E9E]'>
                                    {item}
                                </BioType>
                            </Fragment>
                        );
                    })}
                </div>
            </Paper>
        </>
    );
}
