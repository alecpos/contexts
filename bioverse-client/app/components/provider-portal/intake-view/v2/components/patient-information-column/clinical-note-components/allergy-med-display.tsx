'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { updateClinicalNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { Button } from '@mui/material';
import ClinicalNoteDisplayTiptap from './note-tiptap';
import React from 'react';

interface AllergyMedClinicalNoteDisplayProps {
    note_data: ClinicalNotesV2Supabase;
    refreshData: () => void;
    setClinicalNotes: Dispatch<SetStateAction<ClinicalNotesV2Supabase[]>>;
    data_type: string;
}

export default function AllergyOrMedicationClinicalNoteDisplay({
    note_data,
    refreshData,
    setClinicalNotes,
    data_type,
}: AllergyMedClinicalNoteDisplayProps) {
    const [editable, setEditable] = useState<boolean>(false);
    const [editsMade, setEditsMade] = useState<boolean>(false);
    const [new_text_value, setNewTextValue] = useState<string>(
        note_data.note ?? ''
    );

    const beginEditingClinicalNote = () => {
        setEditable(true);
        setEditsMade(true);
    };

    const sendClinicalNoteUpdate = async () => {
        try {
            const editor_id = (await readUserSession()).data.session?.user.id;
            await updateClinicalNote(note_data.id!, new_text_value, editor_id!);
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

    const parseDataType = () => {
        switch (data_type) {
            case 'bmi':
                return `BMI data from: ${convertTimestamp(
                    note_data.created_at!
                )}`;
            case 'allergy':
                return 'Allergy Information';
            case 'medication':
                return 'Current Medication Information';
        }
    };

    return (
        <div className='flex flex-col p-4 itd-body gap-4'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-col'>
                    <BioType className='itd-input'>{parseDataType()}</BioType>
                </div>
                {!editsMade ? (
                    <Button
                        variant='outlined'
                        onClick={beginEditingClinicalNote}
                        sx={{
                            maxHeight: '30px',
                        }}
                    >
                        Edit
                    </Button>
                ) : (
                    <Button
                        className='outlined'
                        color='error'
                        onClick={sendClinicalNoteUpdate}
                        sx={{
                            maxHeight: '30px',
                        }}
                    >
                        Save
                    </Button>
                )}
            </div>

            <ClinicalNoteDisplayTiptap
                content={note_data.note ?? 'none'}
                editable={editable}
                onContentChange={setNewTextValue}
            />
            <div className='flex flex-col !text-[#9a9a9a]'>
                {note_data.last_modified_at && note_data.editing_provider ? (
                    <>
                        <BioType>
                            Last Modified By:{' '}
                            {note_data.editing_provider.first_name}{' '}
                            {note_data.editing_provider.last_name}
                        </BioType>
                        <BioType>
                            {convertTimestamp(note_data.last_modified_at)}
                        </BioType>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
