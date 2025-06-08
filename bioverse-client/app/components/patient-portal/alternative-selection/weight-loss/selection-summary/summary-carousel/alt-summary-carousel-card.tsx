'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';

interface AltSummaryCarouselCardProps {
    data: {
        title: string;
        description: string;
    };
}

export default function AltSummaryCarouselCard({
    data,
}: AltSummaryCarouselCardProps) {
    return (
        <div>
            <Paper className='w-[85vw] md:w-[340px] h-[300px]'>
                <div className='flex flex-col gap-4 p-6'>
                    <BioType className='it-subtitle md:itd-subtitle text-primary'>
                        {data.title}
                    </BioType>
                    <BioType className='it-body md:itd-body text-[#00000099]'>
                        {data.description}
                    </BioType>
                </div>
            </Paper>
        </div>
    );
}
