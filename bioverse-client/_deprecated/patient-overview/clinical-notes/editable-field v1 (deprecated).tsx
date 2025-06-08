// import { TextField, Button } from '@mui/material';
// import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
// import EditIcon from '@mui/icons-material/Edit';

// /**
//  *
//  *
//  *
//  *
//  * This file is deprecated and not used.
//  *
//  *
//  *
//  *
//  *
//  *
//  */
// interface EditableFieldProps {
//     fieldName: keyof ClinicalNotesState;
//     label: string;
//     value: string | undefined;
//     editing: boolean;
//     onEdit: () => void;
//     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//     onCancel: () => void;
//     onSave: () => void;
// }

// export default function EditableField({
//     fieldName,
//     label,
//     value,
//     editing,
//     onEdit,
//     onChange,
//     onCancel,
//     onSave,
// }: EditableFieldProps) {
//     const clinical_note_field = `flex flex-col gap-2 p-2`;
//     const clinical_note_header = `flex flex-row gap-2`;
//     const clinical_note_value = `body1 px-2`;
//     const button_group = `flex flex-row gap-2`;

//     return (
//         <div className={clinical_note_field}>
//             <div className={clinical_note_header}>
//                 <BioType className='subtitle2'>{label}:</BioType>
//                 {!editing && (
//                     <div onClick={onEdit} className='hover:cursor-pointer'>
//                         <EditIcon color='primary' />
//                     </div>
//                 )}
//             </div>
//             {editing ? (
//                 <>
//                     <TextField
//                         variant='outlined'
//                         value={value || ''}
//                         onChange={onChange}
//                         fullWidth
//                     />

//                     <div className={button_group}>
//                         <Button
//                             variant='contained'
//                             color='primary'
//                             onClick={onSave}
//                         >
//                             SAVE
//                         </Button>
//                         <Button
//                             variant='outlined'
//                             color='error'
//                             onClick={onCancel}
//                         >
//                             CANCEL
//                         </Button>
//                     </div>
//                 </>
//             ) : (
//                 <BioType className={clinical_note_value}>{value}</BioType>
//             )}
//         </div>
//     );
// }
