'use client';

import { useState } from 'react';
import {
    addOrRetreivePatientAllergyAndMedicationData,
    updateClinicalNote,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
} from '@mui/material';
import useSWR from 'swr';
import React from 'react';

interface ClinicalNoteDisplayProps {
    note_data: ClinicalNotesV2Supabase;
    refreshData: () => void;
}

export default function ClinicalNoteDisplayV2({
    note_data,
    refreshData,
}: ClinicalNoteDisplayProps) {
    const [editable, setEditable] = useState<boolean>(false);
    const [editsMade, setEditsMade] = useState<boolean>(false);
    const [new_text_value, setNewTextValue] = useState<string>(
        note_data.note ?? ''
    );

    // const isNoteInEditableTimePeriod = isNoteEditable(note_data);
    const isNoteInEditableTimePeriod = false;

    const beginEditingClinicalNote = () => {
        if (isNoteInEditableTimePeriod) {
            setEditable(true);
            setEditsMade(true);
        }
    };

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

    const {
        data: allergy_medication_clinical_notes,
        error: allergy_medication_error,
        isLoading: allergy_medication_loading,
        mutate: mutate_allergy_medication,
    } = useSWR(
        `${note_data.patient_id}-allergy-medication-clinical-note-data`,
        () =>
            addOrRetreivePatientAllergyAndMedicationData(note_data.patient_id!)
    );

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
        <></>
        //     <><Accordion
        //     defaultExpanded
        //     disableGutters
        //     sx={{
        //         boxShadow: 'none',
        //         width: '100%',
        //         padding: 0,
        //         position: 'sticky',
        //     }}
        // >
        //     <AccordionSummary
        //         sx={[
        //             {
        //                 backgroundColor: 'rgba(40, 107, 162, 0.12)',
        //                 display: 'flex',
        //                 justifyContent: 'space-between',
        //             },
        //         ]}
        //     >
        //         <div className='w-full'>
        //             <p className='itd-input'>Updated by</p>
        //             <p className='itd-body'>
        //                 {note_data.creating_provider.first_name}{' '}
        //                 {note_data.creating_provider.last_name}
        //             </p>
        //         </div>
        //         <div className='w-full'>
        //             <p className='itd-input'>Amended on</p>
        //             <p className='itd-body'>
        //                 {!note_data.last_modified_at
        //                     ? convertTimestamp(note_data.created_at!)
        //                     : note_data.last_modified_at}
        //             </p>
        //         </div>
        //     </AccordionSummary>
        //     <AccordionDetails>
        //         <div className='flex flex-col gap-y-[12px] items-start self-stretch'>
        //             <div className='w-full'>
        //                 <p className='itd-input'>Medications</p>
        //                 <p className='itd-body'>
        //                     {product_href.charAt(0).toUpperCase() +
        //                         product_href.slice(1)}
        //                 </p>
        //             </div>
        //             <div className='w-full'>
        //                 <p className='itd-input'>Allergies</p>
        //                 {allergy_medication_clinical_notes &&
        //                     allergy_medication_clinical_notes.length > 0 &&
        //                     allergy_medication_clinical_notes.map(
        //                         (allergy, i) => (
        //                             <div key={i}>
        //                                 <p>{allergy.note}</p>
        //                             </div>
        //                         )
        //                     )}
        //             </div>
        //             <div className='w-full'>
        //                 <p className='itd-input'>Note</p>
        //                 <div
        //                     dangerouslySetInnerHTML={{
        //                         __html: note_data.note!,
        //                     }}
        //                     className='itd-body'
        //                 />
        //             </div>
        //         </div>
        //     </AccordionDetails>
        // </Accordion>

        //     <BioType className='itd-input'>Note:</BioType>
        //     <ClinicalNoteDisplayTiptap
        //         content={note_data.note ?? 'none'}
        //         editable={editable}
        //         onContentChange={setNewTextValue}
        //     />
        //     <div className='flex flex-col'>
        //         {note_data.last_modified_at && note_data.editing_provider ? (
        //             <>
        //                 <BioType>
        //                     Last Modified By:{' '}
        //                     {note_data.editing_provider.first_name}{' '}
        //                     {note_data.editing_provider.last_name}
        //                 </BioType>
        //                 <BioType>
        //                     {convertTimestamp(note_data.last_modified_at)}
        //                 </BioType>
        //             </>
        //         ) : (
        //             <></>
        //         )}
        //     </div>
        // </div></>
    );
}
