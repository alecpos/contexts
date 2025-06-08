// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { Dispatch, SetStateAction } from 'react';
// import { active_pharmacies } from './pharmacy-select-options';

// interface Props {
//     selectedPharmacy: string;
//     setSelectedPharmacy: Dispatch<SetStateAction<string>>;
//     orderId: string;
// }
// export default function ChangePharmacyMenu({
//     selectedPharmacy,
//     setSelectedPharmacy,
// }: Props) {
//     return (
//         <div>
//             <FormControl fullWidth>
//                 <InputLabel id="pharmacy-select-label">
//                     Selected Pharmacy
//                 </InputLabel>
//                 <Select
//                     labelId="pharmacy-select-label"
//                     label={'Selected Pharmacy'}
//                     value={selectedPharmacy}
//                     onChange={(event) =>
//                         setSelectedPharmacy(event.target.value)
//                     }
//                 >
//                     {active_pharmacies.map((item) => (
//                         <MenuItem key={item.key} value={item.value}>
//                             {item.key}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </div>
//     );
// }
