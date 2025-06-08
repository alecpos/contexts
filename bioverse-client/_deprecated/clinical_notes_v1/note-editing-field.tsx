// 'use client';
// import {
//     TextField,
//     Button,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Select,
//     SelectChangeEvent,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { useState } from 'react';
// import {
//     TEMPLATE_NAME_TO_TEMPLATE,
//     TEMPLATES_ARRAY,
// } from './clinical-note-templates';

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

// export default function NoteField2({
//     fieldName,
//     label,
//     value,
//     editing,
//     onEdit,
//     onChange,
//     onCancel,
//     onSave,
// }: EditableFieldProps) {
//     const [templateName, setTemplateName] = useState<string>('');

//     const clinical_note_field = `flex flex-col gap-2 p-2`;
//     const clinical_note_header = `flex flex-row gap-2`;
//     const button_group = `flex flex-col gap-4`;

//     const handleTemplateChange = (event: SelectChangeEvent) => {
//         setTemplateName(event.target.value);
//     };

//     const addTemplateToNote = () => {
//         const template_text = TEMPLATE_NAME_TO_TEMPLATE[templateName];

//         // Create a synthetic event to simulate a change to the note field
//         const event = {
//             target: {
//                 value: template_text,
//             },
//         } as React.ChangeEvent<HTMLInputElement>;

//         // Call the onChange prop with the synthetic event
//         onChange(event);
//     };

//     return (
//         <div className={clinical_note_field}>
//             <div className={clinical_note_header}>
//                 {!editing && (
//                     <Button
//                         variant='outlined'
//                         onClick={onEdit}
//                         className='hover:cursor-pointer'
//                     >
//                         Edit Clinical note <EditIcon color='primary' />
//                     </Button>
//                 )}
//             </div>
//             {editing ? (
//                 <>
//                     <div className={button_group}>
//                         <div className='flex flex-row gap-2'>
//                             <Button
//                                 variant='contained'
//                                 color='primary'
//                                 onClick={onSave}
//                             >
//                                 SAVE
//                             </Button>
//                             <Button
//                                 variant='outlined'
//                                 color='error'
//                                 onClick={onCancel}
//                             >
//                                 CANCEL
//                             </Button>
//                         </div>
//                         <div className='flex flex-row gap-2'>
//                             <FormControl className='flex flex-grow'>
//                                 <InputLabel id='demo-simple-select-outlined-label'>
//                                     Template
//                                 </InputLabel>
//                                 <Select
//                                     labelId='demo-simple-select-outlined-label'
//                                     id='demo-simple-select-outlined'
//                                     label='Options'
//                                     value={templateName}
//                                     onChange={handleTemplateChange}
//                                 >
//                                     <MenuItem disabled value={''}>
//                                         Select Template
//                                     </MenuItem>
//                                     {TEMPLATES_ARRAY.map((template) => (
//                                         <MenuItem
//                                             key={template.template_name}
//                                             value={template.template_name}
//                                         >
//                                             {template.select_text}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             <Button
//                                 variant='outlined'
//                                 color='secondary'
//                                 onClick={addTemplateToNote}
//                             >
//                                 Add Template
//                             </Button>
//                         </div>
//                     </div>
//                     <TextField
//                         variant='outlined'
//                         value={value || ''}
//                         onChange={onChange}
//                         fullWidth
//                         multiline
//                         focused
//                         minRows={4} // Adjust the minimum number of rows as needed
//                     />
//                 </>
//             ) : (
//                 <TextField
//                     disabled
//                     variant='outlined'
//                     value={value || ''}
//                     onChange={onChange}
//                     fullWidth
//                     multiline
//                     sx={{
//                         '& .MuiInputBase-input.Mui-disabled': {
//                             WebkitTextFillColor: '#353935',
//                         },
//                     }}
//                     minRows={4} // Adjust the minimum number of rows as needed
//                 />
//             )}
//         </div>
//     );
// }

// interface FormattedTextProps {
//     text: string;
// }

// const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
//     // Function to safely parse and replace your custom formatting tags with actual HTML or React components
//     const parseText = (text: string) => {
//         // Example: Replace [b] with <strong>, you can add more replacements as needed
//         const replacedText = text.replace(
//             /\[b\](.*?)\[\/b\]/g,
//             '<strong>$1</strong>'
//         );
//         // Add more replacements here
//         return { __html: replacedText };
//     };

//     return <div dangerouslySetInnerHTML={parseText(text)} />;
// };
