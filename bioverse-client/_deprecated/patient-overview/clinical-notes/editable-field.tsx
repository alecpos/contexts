// import { TextField, Button } from '@mui/material';
// import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
// import EditIcon from '@mui/icons-material/Edit';

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
//     const clinical_note_header = `flex flex-row`;
//     const clinical_note_value = `body1 px-2`;
//     const button_group = `flex flex-row gap-2`;

//     return (
//         <div className={clinical_note_field}>
//             <div className={clinical_note_header}>
//                 {!editing && (
//                     <Button
//                         variant='outlined'
//                         onClick={onEdit}
//                         className='hover:cursor-pointer gap-2 items-center'
//                     >
//                         <BioType className='subtitle2'>{label}:</BioType>
//                         <EditIcon color='primary' />
//                     </Button>
//                 )}
//             </div>
//             {editing ? (
//                 <>
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
//                     <TextField
//                         variant='outlined'
//                         value={value || ''}
//                         onChange={onChange}
//                         fullWidth
//                         color='primary'
//                         focused
//                     />
//                 </>
//             ) : (
//                 <>
//                     <TextField
//                         disabled
//                         variant='outlined'
//                         value={value || ''}
//                         onChange={onChange}
//                         fullWidth
//                         sx={{
//                             '& .MuiInputBase-input.Mui-disabled': {
//                                 WebkitTextFillColor: '#353935',
//                             },
//                         }}
//                     />
//                 </>
//             )}
//         </div>
//     );
// }
