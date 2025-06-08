'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { updateClinicalNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { Button } from '@mui/material';
import ClinicalNoteDisplayTiptap from './note-tiptap';

interface ClinicalNoteDisplayProps {
    note_data: ClinicalNotesV2Supabase;
    refreshData: () => void;
    setClinicalNotes: Dispatch<SetStateAction<ClinicalNotesV2Supabase[]>>;
}

export default function ClinicalNoteDisplayV2({
    note_data,
    refreshData,
    setClinicalNotes,
}: ClinicalNoteDisplayProps) {
    const [editable, setEditable] = useState<boolean>(false);
    const [editsMade, setEditsMade] = useState<boolean>(false);
    const [new_text_value, setNewTextValue] = useState<string>(
        note_data.note ?? ''
    );

    const sendClinicalNoteUpdate = async () => {
        console.log('ntv', new_text_value);

        try {
            const editor_id = (await readUserSession()).data.session?.user.id;
            const { data, error } = await updateClinicalNote(
                note_data.id!,
                new_text_value,
                editor_id!
            );
        } catch (error: any) {
            console.error('Error in updating clinical note', error);
        }
        refreshData();
        setEditable(false);
        setEditsMade(false);
    };

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div className='flex flex-col p-4 itd-body gap-4'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-col'>
                    <BioType className='itd-input'>Created By:</BioType>
                    <BioType>
                        {note_data?.creating_provider?.first_name}{' '}
                        {note_data?.creating_provider?.last_name}
                    </BioType>
                    <BioType className='it-body text-[#666666]'>
                        {convertTimestamp(note_data?.created_at!)}
                    </BioType>
                </div>
            </div>

            <BioType className='itd-input'>Note:</BioType>
            <ClinicalNoteDisplayTiptap
                content={note_data.note ?? 'none'}
                editable={editable}
                onContentChange={setNewTextValue}
            />
            <div className='flex flex-col'>
                {note_data.last_modified_at && note_data.editing_provider ? (
                    <>
                        <BioType>
                            Last Modified By:{' '}
                            {note_data?.editing_provider?.first_name}{' '}
                            {note_data?.editing_provider?.last_name}
                        </BioType>
                        <BioType>
                            {convertTimestamp(note_data?.last_modified_at)}
                        </BioType>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
