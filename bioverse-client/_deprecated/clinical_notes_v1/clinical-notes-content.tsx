// 'use client';

// import BioType from '@/app/components/bioverse-typography/bio-type/bio-type';
// import LoadingScreen from '@/app/components/loading-screen/loading-screen';
// import useSWR from 'swr';
// import { Fragment, useEffect, useState } from 'react';
// import { getAllClinicalNotesForPatient } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
// import ClinicalNoteDisplayV2 from '../../app/components/coordinator-portal/thread-view/provider-view-clone/components/patient-information-column/clinical-note-components/note-display-v2';
// import { Button } from '@mui/material';
// import HorizontalDivider from '@/app/components/dividers/horizontalDivider/horizontalDivider';

// interface DemographicsProps {
//     patient_id: string;
// }

// export default function ClinicalNoteAccordionContent({
//     patient_id,
// }: DemographicsProps) {
//     const {
//         data: clinical_note_payload,
//         error,
//         isLoading,
//         mutate,
//     } = useSWR(`${patient_id}-clinical-note-data-PRVIT`, () =>
//         getAllClinicalNotesForPatient(patient_id)
//     );

//     const [errorState, setErrorState] = useState<string | null>(null);

//     const refreshData = () => {
//         mutate();
//     };

//     //Keeping the field values of the clinical notes in a state. This state represents what is visible when not editing.
//     const [clinicalNotes, setClinicalNotes] = useState<
//         ClinicalNotesV2Supabase[]
//     >([]);

//     useEffect(() => {
//         if (clinical_note_payload && clinical_note_payload.data) {
//             setClinicalNotes(clinical_note_payload.data);
//         }
//     }, [clinical_note_payload]);

//     if (isLoading) {
//         return <LoadingScreen />;
//     }

//     if (error || !clinical_note_payload) {
//         return (
//             <>
//                 <BioType>Error</BioType>
//             </>
//         );
//     }

//     return (
//         <div className='flex flex-col w-full gap-4'>
//             {errorState && (
//                 <BioType className='body1 text-red-600'>{errorState}</BioType>
//             )}
//             {clinicalNotes &&
//                 clinicalNotes.map((clinical_note, index) => (
//                     <Fragment key={clinical_note.id}>
//                         <ClinicalNoteDisplayV2
//                             note_data={clinical_note}
//                             refreshData={refreshData}
//                             setClinicalNotes={setClinicalNotes}
//                         />
//                         {index < clinicalNotes.length - 1 && (
//                             <div className='flex flex-col h-[1px]'>
//                                 <HorizontalDivider
//                                     backgroundColor={'#666666'}
//                                     height={1}
//                                 />
//                             </div>
//                         )}
//                     </Fragment>
//                 ))}
//         </div>
//     );
// }
