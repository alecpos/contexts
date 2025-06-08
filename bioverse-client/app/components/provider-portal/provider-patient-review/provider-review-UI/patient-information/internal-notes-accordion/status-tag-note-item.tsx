'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { formatDate } from 'react-datepicker/dist/date_utils';

interface StatusTagNoteProps {
    statusTagNoteData: PatientStatusTagsSBR;
}

export default function StatusTagNoteItem({
    statusTagNoteData,
}: StatusTagNoteProps) {
    const formatDate = (dateString?: Date) => {
        return dayjs(dateString).format('MMMM D, YYYY [at] h:mm A');
    };

    if (!statusTagNoteData) {
        return null;
    }

    /**
     * excluding status tag notes written by the automatic status changer or if the note is blank.
     */
    if (
        statusTagNoteData.last_modified_by ===
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a' ||
        isEmpty(statusTagNoteData.note?.trim())
    ) {
        return null;
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='bg-[#E5EDF4] rounded-sm flex flex-row justify-between px-2 py-1'>
                <div className='flex flex-col '>
                    <BioType className='provider-tabs-subtitle-weak'>
                        Added by
                    </BioType>
                    <BioType className='provider-tabs-subtitle'>
                        {statusTagNoteData.first_name}{' '}
                        {statusTagNoteData.last_name}
                    </BioType>
                </div>
                <div className='flex flex-col '>
                    <BioType className='provider-tabs-subtitle-weak'>
                        Added on
                    </BioType>
                    <BioType className='provider-tabs-subtitle'>
                        {formatDate(statusTagNoteData.created_at)}
                    </BioType>
                </div>
            </div>
            <div className='flex flex-col px-2 '>
                <div className='flex flex-row gap-2'>
                    <BioType className='provider-tabs-subtitle-weak '>
                        Order ID:
                    </BioType>
                    <BioType className='provider-tabs-subtitle'>
                        {statusTagNoteData.order_id}
                    </BioType>
                </div>
                <BioType className='provider-tabs-subtitle-weak'>
                    Internal Note
                </BioType>
                <BioType className='provider-tabs-subtitle'>{statusTagNoteData.note}</BioType>
            </div>
        </div>
    );
}
