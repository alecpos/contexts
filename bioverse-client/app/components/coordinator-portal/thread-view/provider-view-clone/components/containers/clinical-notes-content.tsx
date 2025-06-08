'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import AllergyOrMedicationClinicalNoteDisplay from '@/app/components/provider-portal/intake-view/v2/components/patient-information-column/clinical-note-components/allergy-med-display';
import {
    getAllClinicalNotesForPatient,
    addOrRetreivePatientAllergyAndMedicationData,
    addOrRetrievePatientBMIData,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { useState, useEffect, Fragment } from 'react';
import useSWR from 'swr';
import ClinicalNoteDisplayV2 from '../patient-information-column/clinical-note-components/note-display-v2';
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
        mutate,
    } = useSWR(`${patient_id}-clinical-note-data-PRVIT`, () =>
        getAllClinicalNotesForPatient(patient_id)
    );

    //addOrRetreivePatientAllergyAndMedicationData

    const {
        data: allergy_medication_clinical_notes,
        error: allergy_medication_error,
        isLoading: allergy_medication_loading,
        mutate: mutate_allergy_medication,
    } = useSWR(`${patient_id}-allergy-medication-clinical-note-data`, () =>
        addOrRetreivePatientAllergyAndMedicationData(patient_id)
    );

    const {
        data: bmi_clinical_note,
        error: bmi_clinical_note_error,
        isLoading: bmi_clinical_note_error_isLoading,
        mutate: mutate_bmi_clinical_note_error,
    } = useSWR(`${patient_id}-bmi-clinical-note-data`, () =>
        addOrRetrievePatientBMIData(patient_id, product_href)
    );

    const [errorState, setErrorState] = useState<string | null>(null);

    const refreshData = () => {
        mutate();
    };

    //Keeping the field values of the clinical notes in a state. This state represents what is visible when not editing.
    const [clinicalNotes, setClinicalNotes] = useState<
        ClinicalNotesV2Supabase[]
    >([]);

    useEffect(() => {
        if (clinical_note_payload && clinical_note_payload.data) {
            setClinicalNotes(clinical_note_payload.data);
        }
    }, [clinical_note_payload]);

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
        <div className='flex flex-col w-full gap-4'>
            {errorState && (
                <BioType className='body1 text-red-600'>{errorState}</BioType>
            )}

            {allergy_medication_clinical_notes &&
                allergy_medication_clinical_notes.length > 0 && (
                    <>
                        <div>
                            {allergy_medication_clinical_notes.map(
                                (note, index) => {
                                    return (
                                        <Fragment key={note.id}>
                                            <AllergyOrMedicationClinicalNoteDisplay
                                                note_data={note}
                                                refreshData={refreshData}
                                                setClinicalNotes={
                                                    setClinicalNotes
                                                }
                                                data_type={note.data_type}
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
    );
}
