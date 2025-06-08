'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import dayjs from 'dayjs';

interface InternalNoteItemProps {
    noteData: InternalNoteItem;
}

export default function InternalNoteItem({ noteData }: InternalNoteItemProps) {
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('MMMM D, YYYY [at] h:mm A');
    };

    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#E5EDF4] rounded-sm flex flex-row justify-between px-2 py-1'>
                <div className='flex flex-col gap-1'>
                    <BioType className='provider-tabs-subtitle-weak'>
                        Added by
                    </BioType>
                    <BioType className='provider-tabs-subtitle'>
                        {noteData.employee.display_name}
                    </BioType>
                </div>
                <div className='flex flex-col gap-1'>
                    <BioType className='provider-tabs-subtitle-weak'>
                        Added on
                    </BioType>
                    <BioType className='provider-tabs-subtitle'>
                        {formatDate(noteData.created_at)}
                    </BioType>
                </div>
            </div>
            <div className='flex flex-col px-2'>
                <BioType className='provider-tabs-subtitle-weak text-[#5C5F62]'>
                    Internal Note
                </BioType>
                <BioType className='provider-tabs-subtitle'>{noteData.note}</BioType>
            </div>
        </div>
    );
}
