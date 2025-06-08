// 'use client';

// import { Paper } from '@mui/material';
// import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
// import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { useEffect, useState } from 'react';
// import {
//     fetchClinicalNotesWithPatientId,
//     updateClinicalNotes,
// } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
// import EditableField from './editable-field';
// import { readUserSession } from '@/app/utils/actions/auth/session-reader';
// import NoteField from './note-field';

// interface Props {
//     patientId: string;
//     product_href: string;
// }

// export default function ClinicalNotes({ patientId, product_href }: Props) {
//     const [expanded, setExpanded] = useState<boolean>(true);

//     //Keeping the field values of the clinical notes in a state. This state represents what is visible when not editing.
//     const [clinicalNotes, setClinicalNotes] = useState<ClinicalNotesState>({
//         note: ``,
//         allergies: '',
//         medications: '',
//         last_modified: '',
//         last_modified_by_provider_id: '',
//         provider: { first_name: '', last_name: '' },
//     });

//     //keeping the edit values
//     const [clinicalNotesEditValue, setClinicalNotesEditValue] =
//         useState<ClinicalNotesState>({
//             note: ``,
//             medications: ``,
//             allergies: ``,
//         });

//     //Keeping the editing state logic in 1 state overall.
//     const [clinicalNotesEditing, setClinicalNotesEditing] =
//         useState<ClinicalNotesEditingState>({
//             note_editing_status: false,
//             allergies_editing_status: false,
//             medications_editing_status: false,
//         });

//     const [errorState, setErrorState] = useState<string | null>(null);

//     useEffect(() => {
//         (async () => {
//             await getClinicalNotes();
//         })();
//     }, [patientId]);

//     const getClinicalNotes = async () => {
//         const { data: clinicalNoteData, error: fetchError } =
//             await fetchClinicalNotesWithPatientId(patientId, product_href);

//         //If there is an
//         if (fetchError) {
//             setErrorState(
//                 'Error in getting clinical notes. Error Message: ' +
//                     JSON.stringify(fetchError)
//             );
//             return;
//         }

//         if (clinicalNoteData) {
//             const fetchedNotes = {
//                 note: clinicalNoteData.note,
//                 allergies: clinicalNoteData.allergies ?? '',
//                 medications: clinicalNoteData.medications ?? '',
//                 last_modified: clinicalNoteData.last_modified,
//                 last_modified_by_provider_id:
//                     clinicalNoteData.last_modified_by_provider_id,
//                 provider: {
//                     first_name: clinicalNoteData.provider?.first_name,
//                     last_name: clinicalNoteData.provider?.last_name,
//                 },
//             };

//             setClinicalNotes(fetchedNotes);
//             setClinicalNotesEditValue(fetchedNotes);
//         }
//     };

//     const handleInputChange =
//         (field: keyof ClinicalNotesState) =>
//         (event: React.ChangeEvent<HTMLInputElement>) => {
//             setClinicalNotesEditValue({
//                 ...clinicalNotesEditValue,
//                 [field]: event.target.value,
//             });
//         };

//     // Function to begin editing a specific field
//     const beginEditingField = (fieldName: keyof ClinicalNotesState) => {
//         setClinicalNotesEditing((prev) => ({
//             ...prev,
//             [`${fieldName}_editing_status`]: true,
//         }));
//     };

//     // Function to cancel editing a specific field
//     const cancelEditing = (fieldName: keyof ClinicalNotesState) => {
//         setClinicalNotesEditValue((prev) => ({
//             ...prev,
//             [fieldName]: clinicalNotes[fieldName],
//         }));
//         setClinicalNotesEditing((prev) => ({
//             ...prev,
//             [`${fieldName}_editing_status`]: false,
//         }));
//     };

//     const saveField = async (fieldName: keyof ClinicalNotesState) => {
//         const fetchedProviderStatus = await readUserSession();

//         if (!fetchedProviderStatus.data.session) {
//             setErrorState(
//                 'There was an error with updating the clinical notes. Please try again later.'
//             );
//             return;
//         }

//         const fetchedProviderId = fetchedProviderStatus.data.session.user.id;

//         const fieldsToUpdate: ClinicalNoteUpdateObject = {
//             [fieldName]: clinicalNotesEditValue[fieldName],
//             last_modified_at: new Date().toISOString(),
//             last_modified_by_provider_id: fetchedProviderId,
//         };

//         const { data: updatedClinicalNoteData, error: updateError } =
//             await updateClinicalNotes(fieldsToUpdate, patientId, product_href);

//         if (updateError) {
//             console.error('Error updating clinical notes:', updateError);
//             // Handle the error appropriately
//             return;
//         }

//         // Update the clinicalNotes state with the updated data for the specific field
//         setClinicalNotes((prev) => ({
//             ...prev,
//             [fieldName]: updatedClinicalNoteData[0][fieldName],
//         }));

//         // Reset the editing status
//         setClinicalNotesEditing((prev) => ({
//             ...prev,
//             [`${fieldName}_editing_status`]: false,
//         }));
//     };

//     const saveNoteField = async () => {
//         const fetchedProviderStatus = await readUserSession();

//         if (!fetchedProviderStatus.data.session) {
//             setErrorState(
//                 'There was an error with updating the clinical notes. Please try again later.'
//             );
//             return;
//         }

//         const fetchedProviderId = fetchedProviderStatus.data.session.user.id;

//         const fieldsToUpdate = {
//             note: clinicalNotesEditValue.note,
//             last_modified_at: new Date().toISOString(),
//             last_modified_by_provider_id: fetchedProviderId,
//         };

//         const { data: updatedClinicalNoteData, error: updateError } =
//             await updateClinicalNotes(fieldsToUpdate, patientId, product_href);

//         if (updateError) {
//             console.error('Error updating clinical notes:', updateError);
//             // Handle the error appropriately
//             return;
//         }

//         // Update the clinicalNotes state with the updated data for the note field
//         setClinicalNotes((prev) => ({
//             ...prev,
//             note: updatedClinicalNoteData[0].note,
//         }));

//         // Reset the editing status for the note field
//         setClinicalNotesEditing((prev) => ({
//             ...prev,
//             note_editing_status: false,
//         }));
//     };

//     const parseClinicalEditDate = (dateString: string) => {
//         const date = new Date(dateString);

//         // Formatting the date
//         const formattedDate = `${
//             date.getMonth() + 1
//         }/${date.getDate()}/${date.getFullYear()}`;

//         // Formatting the time
//         let hours = date.getHours();
//         const minutes = date.getMinutes();
//         const ampm = hours >= 12 ? 'pm' : 'am';
//         hours = hours % 12;
//         hours = hours ? hours : 12; // the hour '0' should be '12'
//         const formattedTime = `${hours}:${
//             minutes < 10 ? '0' + minutes : minutes
//         } ${ampm}`;

//         return `${formattedDate} at ${formattedTime}`;
//     };

//     const sectionHeaderClass = `flex flex-row items-center gap-2 p-8`;
//     const expandableContentClass = `flex flex-col px-8 pb-4 gap-2`;

//     return (
//         <>
//             <Paper className='w-full'>
//                 <div
//                     className={sectionHeaderClass}
//                     onClick={() => setExpanded((prev) => !prev)}
//                 >
//                     <BioType className='h6 text-primary'>
//                         Clinical Notes
//                     </BioType>
//                     {expanded ? (
//                         <KeyboardArrowUpIcon />
//                     ) : (
//                         <KeyboardArrowDownIcon />
//                     )}
//                 </div>

//                 {expanded && (
//                     <div className={expandableContentClass}>
//                         {errorState && (
//                             <BioType className='body1 text-red-600'>
//                                 {errorState}
//                             </BioType>
//                         )}

//                         <EditableField
//                             fieldName='allergies'
//                             label='Allergies'
//                             value={clinicalNotesEditValue.allergies}
//                             editing={
//                                 clinicalNotesEditing.allergies_editing_status
//                             }
//                             onEdit={() => beginEditingField('allergies')}
//                             onChange={handleInputChange('allergies')}
//                             onCancel={() => cancelEditing('allergies')}
//                             onSave={() => saveField('allergies')}
//                         />

//                         <EditableField
//                             fieldName='medications'
//                             label='Medications'
//                             value={clinicalNotesEditValue.medications}
//                             editing={
//                                 clinicalNotesEditing.medications_editing_status
//                             }
//                             onEdit={() => beginEditingField('medications')}
//                             onChange={handleInputChange('medications')}
//                             onCancel={() => cancelEditing('medications')}
//                             onSave={() => saveField('medications')}
//                         />

//                         <NoteField
//                             fieldName='note'
//                             label='Clinical Note'
//                             value={clinicalNotesEditValue.note}
//                             editing={clinicalNotesEditing.note_editing_status}
//                             onEdit={() => beginEditingField('note')}
//                             onChange={handleInputChange('note')}
//                             onCancel={() => cancelEditing('note')}
//                             onSave={() => saveNoteField()}
//                         />
//                     </div>
//                 )}

//                 <HorizontalDivider backgroundColor={'#B1B1B!'} height={1} />
//             </Paper>
//         </>
//     );
// }
