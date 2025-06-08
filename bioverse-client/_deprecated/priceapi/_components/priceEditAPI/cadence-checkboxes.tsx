// import {
//     FormGroup,
//     FormControlLabel,
//     Checkbox,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
// } from '@mui/material';
// import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// interface Props {
//     cadencies: string[];
//     setCadencies: (cadenceObj: CadencePair[]) => void;
// }

// export default function PriceAPICadenceCheckbox({
//     cadencies,
//     setCadencies,
// }: Props) {
//     const [hasChanges, setHasChanges] = useState<boolean>(false);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [currentCadencies, setCurrentCadencies] = useState<string[]>([]);

//     useEffect(() => {
//         setCurrentCadencies(cadencies);
//     }, [cadencies]);

//     const handleCheckboxChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         const checked = event.target.checked;
//         const value = event.target.value;

//         if (checked) {
//             // If the checkbox is checked and the length of currentCadencies is less than  2, add the value
//             if (currentCadencies.length < 2) {
//                 setCurrentCadencies((prevCadencies) => [
//                     ...prevCadencies,
//                     value,
//                 ]);
//             }
//         } else {
//             // If the checkbox is unchecked, remove the value
//             setCurrentCadencies((prevCadencies) =>
//                 prevCadencies.filter((cadence) => cadence !== value),
//             );
//         }

//         setHasChanges(true);
//     };

//     const openChangeCadencyWarning = () => {
//         setDialogOpen(true);
//     };

//     const handleConfirm = () => {
//         // Create an array of objects with cadence and value properties
//         const cadenceArr = [
//             {
//                 cadence: 'one_time',
//                 value: currentCadencies.includes('one-time'),
//             },
//             { cadence: 'monthly', value: currentCadencies.includes('monthly') },
//             {
//                 cadence: 'quarterly',
//                 value: currentCadencies.includes('quarterly'),
//             },
//         ];

//         // Call setCadencies with the constructed cadenceArr
//         setCadencies(cadenceArr);

//         // Close the dialog
//         setDialogOpen(false);
//     };
//     return (
//         <>
//             <FormGroup>
//                 <FormControlLabel
//                     control={
//                         <Checkbox
//                             checked={currentCadencies.includes('one-time')}
//                             onChange={handleCheckboxChange}
//                         />
//                     }
//                     label="One-Time"
//                     value={'one-time'}
//                 />
//                 <FormControlLabel
//                     control={
//                         <Checkbox
//                             checked={currentCadencies.includes('monthly')}
//                             onChange={handleCheckboxChange}
//                         />
//                     }
//                     label="Monthly"
//                     value={'monthly'}
//                 />
//                 <FormControlLabel
//                     control={
//                         <Checkbox
//                             checked={currentCadencies.includes('quarterly')}
//                             onChange={handleCheckboxChange}
//                         />
//                     }
//                     label="Quarterly"
//                     value={'quarterly'}
//                 />

//                 <div className="flex w-full">
//                     {hasChanges && (
//                         <Button
//                             onClick={openChangeCadencyWarning}
//                             color="error"
//                         >
//                             Set Cadencies
//                         </Button>
//                     )}
//                 </div>
//             </FormGroup>

//             <Dialog
//                 open={dialogOpen}
//                 onClose={() => setDialogOpen(false)}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogTitle id="alert-dialog-title">
//                     {'Change Cadency Warning'}
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id="alert-dialog-description">
//                         Are you sure you want to change the cadency?
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         color="error"
//                         variant="contained"
//                         onClick={() => setDialogOpen(false)}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         color="primary"
//                         variant="contained"
//                         onClick={handleConfirm}
//                     >
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// }
