'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import useSWR from 'swr';
import {
    fetchClinicalNotesWithPatientId,
    updateClinicalNotes,
} from '@/app/utils/database/controller/clinical_notes/clinical-notes';
import { useState } from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import NoteField2 from './clinical-note-components/note-field';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface DemographicsProps {
    patient_id: string;
    product_href: string;
}

export default function ClinicalNoteAccordionContent({
    patient_id,
    product_href,
}: DemographicsProps) {
    const {
        data: clinical_note_payload,
        error,
        isLoading,
    } = useSWR(`${patient_id}-clinical-note-data-PRVIT`, () =>
        fetchClinicalNotesWithPatientId(patient_id, product_href)
    );

    const [errorState, setErrorState] = useState<string | null>(null);

    //Keeping the field values of the clinical notes in a state. This state represents what is visible when not editing.
    const [clinicalNotes, setClinicalNotes] = useState<ClinicalNotesState>({
        note: ``,
        allergies: '',
        medications: '',
        last_modified: '',
        last_modified_by_provider_id: '',
        provider: { first_name: '', last_name: '' },
    });

    //keeping the edit values
    const [clinicalNotesEditValue, setClinicalNotesEditValue] =
        useState<ClinicalNotesState>({
            note: ``,
            medications: ``,
            allergies: ``,
        });

    //Keeping the editing state logic in 1 state overall.
    const [clinicalNotesEditing, setClinicalNotesEditing] =
        useState<ClinicalNotesEditingState>({
            note_editing_status: false,
            allergies_editing_status: false,
            medications_editing_status: false,
        });

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error || !clinical_note_payload) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const handleInputChange =
        (field: keyof ClinicalNotesState) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setClinicalNotesEditValue({
                ...clinicalNotesEditValue,
                [field]: event.target.value,
            });
        };

    // Function to begin editing a specific field
    const beginEditingField = (fieldName: keyof ClinicalNotesState) => {
        setClinicalNotesEditing((prev) => ({
            ...prev,
            [`${fieldName}_editing_status`]: true,
        }));
    };

    // Function to cancel editing a specific field
    const cancelEditing = (fieldName: keyof ClinicalNotesState) => {
        setClinicalNotesEditValue((prev) => ({
            ...prev,
            [fieldName]: clinicalNotes[fieldName],
        }));
        setClinicalNotesEditing((prev) => ({
            ...prev,
            [`${fieldName}_editing_status`]: false,
        }));
    };

    const saveNoteField = async () => {
        const fetchedProviderStatus = await readUserSession();

        if (!fetchedProviderStatus.data.session) {
            setErrorState(
                'There was an error with updating the clinical notes. Please try again later.'
            );
            return;
        }

        const fetchedProviderId = fetchedProviderStatus.data.session.user.id;

        const fieldsToUpdate = {
            note: clinicalNotesEditValue.note,
            last_modified_at: new Date().toISOString(),
            last_modified_by_provider_id: fetchedProviderId,
        };

        const { data: updatedClinicalNoteData, error: updateError } =
            await updateClinicalNotes(fieldsToUpdate, patient_id, product_href);

        if (updateError) {
            console.error('Error updating clinical notes:', updateError);
            // Handle the error appropriately
            return;
        }

        // Update the clinicalNotes state with the updated data for the note field
        setClinicalNotes((prev) => ({
            ...prev,
            note: updatedClinicalNoteData[0].note,
        }));

        // Reset the editing status for the note field
        setClinicalNotesEditing((prev) => ({
            ...prev,
            note_editing_status: false,
        }));
    };

    return (
        <div className='flex flex-col px-2 w-full gap-4'>
            {errorState && (
                <BioType className='body1 text-red-600'>{errorState}</BioType>
            )}

            <NoteField2
                fieldName='note'
                label='Clinical Note'
                value={clinicalNotesEditValue.note}
                editing={clinicalNotesEditing.note_editing_status}
                onEdit={() => beginEditingField('note')}
                onChange={handleInputChange('note')}
                onCancel={() => cancelEditing('note')}
                onSave={() => saveNoteField()}
            />
        </div>
    );
}
