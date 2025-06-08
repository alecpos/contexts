'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import useSWR from 'swr';
import { Fragment, useEffect, useState } from 'react';
import {
    addOrRetreivePatientAllergyAndMedicationData,
    addOrRetrievePatientBMIData,
    findAllClinicalNoteTemplatesForOrderId,
    findAllOtherClinicalNoteTemplatesForPatient,
    getAllClinicalNotesForPatient,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import React from 'react';
import AllergyMedicationClinicalNoteAccordion from './clinical-note-components/allergy-med-accordion';
import BmiClinicalNoteAccordion from './clinical-note-components/bmi-accordion';
import ClinicalNoteAndTemplateAccordion from './clinical-note-components/note-and-template-accordion';
import _ from 'lodash';

interface ClinicalNotesProps {
    patient_id: string;
    product_href: string;
    order_data: DBOrderData;
    provider_id: string;
}

const clinical_note_fetch = async (
    patient_id: string,
    product_href: string,
    order_id: number | string
) => {
    const [
        allergy_medication_clinical_notes,
        bmi_clinical_note,
        clinical_note_payload,
        previous_clinical_templates,
        other_clinical_templates,
    ] = await Promise.all([
        addOrRetreivePatientAllergyAndMedicationData(patient_id),
        addOrRetrievePatientBMIData(patient_id, product_href),
        getAllClinicalNotesForPatient(patient_id),
        findAllClinicalNoteTemplatesForOrderId(
            order_id,
            product_href as PRODUCT_HREF
        ),
        findAllOtherClinicalNoteTemplatesForPatient(
            product_href as PRODUCT_HREF,
            patient_id
        ),
    ]);

    return {
        allergy_medication_clinical_notes,
        bmi_clinical_note,
        clinical_note_payload: clinical_note_payload.data,
        previous_clinical_templates,
        other_clinical_templates,
    };
};

export default function ClinicalNoteAccordionContent({
    patient_id,
    product_href,
    order_data,
    provider_id,
}: ClinicalNotesProps) {
    const {
        data: fetched_clinical_note_data,
        error,
        isLoading,
        mutate,
    } = useSWR(`${patient_id}-clinical-notes`, () =>
        clinical_note_fetch(
            patient_id,
            product_href,
            order_data.renewal_order_id
                ? order_data.original_order_id
                : order_data.id
        )
    );

    const [allergyMedicationNotes, setAllergyMedicationNotes] = useState<any[]>(
        []
    );
    const [bmiNotes, setBmiNotes] = useState<ClinicalNotesV2Supabase[]>([]);

    const [clinicalNoteAggregation, setClinicalNoteAggregation] =
        useState<ClinicalNotesV2Supabase[]>();

    useEffect(() => {
        console.log(fetched_clinical_note_data);

        setAllergyMedicationNotes(
            fetched_clinical_note_data?.allergy_medication_clinical_notes ?? []
        );
        setBmiNotes(fetched_clinical_note_data?.bmi_clinical_note ?? []);

        // Combine and sort the arrays
        const combinedNotes = [
            ...(fetched_clinical_note_data?.clinical_note_payload ?? []),
            ...(fetched_clinical_note_data?.previous_clinical_templates ?? []),
            ...(fetched_clinical_note_data?.other_clinical_templates ?? []),
        ];

        const sortedNotes = combinedNotes.sort((a, b) => {
            const dateA = new Date(a.created_at!);
            const dateB = new Date(b.created_at!);
            return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
        });

        const filtered_notes = _.uniqBy(sortedNotes, 'id');

        setClinicalNoteAggregation(filtered_notes);
    }, [
        fetched_clinical_note_data?.clinical_note_payload,
        fetched_clinical_note_data?.allergy_medication_clinical_notes,
        fetched_clinical_note_data?.bmi_clinical_note,
        fetched_clinical_note_data?.previous_clinical_templates,
    ]);

    const refreshData = () => {
        mutate();
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        console.log('Error in clincial notes: ', error);
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <div className='flex flex-col w-full gap-0'>
            {allergyMedicationNotes && allergyMedicationNotes.length > 0 && (
                <>
                    <div>
                        {allergyMedicationNotes.map((note, index) => {
                            return (
                                <Fragment key={index}>
                                    <AllergyMedicationClinicalNoteAccordion
                                        note_data={note}
                                        refreshData={refreshData}
                                        data_type={note.data_type}
                                    />
                                    {index <
                                        allergyMedicationNotes.length - 1 && (
                                        <div className='flex flex-col h-[1px]'>
                                            <HorizontalDivider
                                                backgroundColor={'#E4E4E4'}
                                                height={1}
                                            />
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                </>
            )}

            {bmiNotes && bmiNotes.length > 0 && (
                <>
                    <div>
                        <div className='flex flex-col h-[1px]'>
                            <HorizontalDivider
                                backgroundColor={'#E4E4E4'}
                                height={1}
                            />
                        </div>
                        <BmiClinicalNoteAccordion bmi_notes={bmiNotes} />
                    </div>
                </>
            )}

            {clinicalNoteAggregation && (
                <>
                    {clinicalNoteAggregation.map(
                        (
                            note_data_item: ClinicalNotesV2Supabase,
                            index: number
                        ) => {
                            return (
                                <Fragment key={index}>
                                    <ClinicalNoteAndTemplateAccordion
                                        note_data={note_data_item}
                                        refreshData={refreshData}
                                        provider_id={provider_id}
                                    />
                                </Fragment>
                            );
                        }
                    )}
                </>
            )}
        </div>
    );
}
