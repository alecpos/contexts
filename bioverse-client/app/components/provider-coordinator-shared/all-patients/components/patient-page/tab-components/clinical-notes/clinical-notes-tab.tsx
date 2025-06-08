'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import {
    addOrRetreivePatientAllergyAndMedicationData,
    getAllClinicalNotesForPatient,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import ClinicalNoteDisplayV2 from './components/clinical-note-tiptap';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import AllergyOrMedicationClinicalNoteDisplay from './components/allergy-med-display';

interface ClinicalNoteTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: any;
}

export default function ClinicalNoteTabContent({
    profile_data,
}: ClinicalNoteTabProps) {
    const [open, setOpen] = useState(false);

    const [clinicalNotes, setClinicalNotes] = useState<
        ClinicalNotesV2Supabase[]
    >([]);

    const {
        data: allergy_medication_clinical_notes,
        error: allergy_medication_error,
        isLoading: allergy_medication_loading,
        mutate: mutate_allergy_medication,
    } = useSWR(`${profile_data.id}-allergy-medication-clinical-note-data`, () =>
        addOrRetreivePatientAllergyAndMedicationData(profile_data.id)
    );

    const {
        data: clinical_note_payload,
        error,
        isLoading,
        mutate,
    } = useSWR(`${profile_data.id}-clinical-note-data-PRVIT`, () =>
        getAllClinicalNotesForPatient(profile_data.id)
    );

    useEffect(() => {
        if (clinical_note_payload && clinical_note_payload.data) {
            setClinicalNotes(clinical_note_payload.data);
        }
    }, [clinical_note_payload]);

    const refreshData = () => {
        mutate();
    };

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

    return (
        <>
            <div className='flex flex-col w-full justify-center items-center gap-4 mt-4'>
                <div className='flex flex-col w-full justify-center items-center mt-4'>
                    <div className='flex flex-col w-full gap-4'>
                        {allergy_medication_clinical_notes &&
                            allergy_medication_clinical_notes.length > 0 && (
                                <>
                                    <div>
                                        {allergy_medication_clinical_notes.map(
                                            //bmi_clinical_note
                                            (note, index) => {
                                                return (
                                                    <Fragment key={note.id}>
                                                        <AllergyOrMedicationClinicalNoteDisplay
                                                            note_data={note}
                                                            refreshData={
                                                                refreshData
                                                            }
                                                            setClinicalNotes={
                                                                setClinicalNotes
                                                            }
                                                            data_type={
                                                                note.data_type
                                                            }
                                                        />
                                                        {index <
                                                            allergy_medication_clinical_notes.length -
                                                                1 && (
                                                            <div className='flex flex-col h-[1px]'>
                                                                <HorizontalDivider
                                                                    backgroundColor={
                                                                        '#666666'
                                                                    }
                                                                    height={1}
                                                                />
                                                            </div>
                                                        )}
                                                    </Fragment>
                                                );
                                            }
                                        )}
                                    </div>
                                    <div className='flex flex-col h-[1px]'>
                                        <HorizontalDivider
                                            backgroundColor={'#666666'}
                                            height={1}
                                        />
                                    </div>
                                </>
                            )}

                        {clinicalNotes &&
                            clinicalNotes.map((clinical_note, index) => (
                                <Fragment key={clinical_note.id}>
                                    <ClinicalNoteDisplayV2
                                        note_data={clinical_note}
                                        refreshData={refreshData}
                                        setClinicalNotes={setClinicalNotes}
                                    />
                                    {index < clinicalNotes.length - 1 && (
                                        <div className='flex flex-col h-[1px]'>
                                            <HorizontalDivider
                                                backgroundColor={'#666666'}
                                                height={1}
                                            />
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
