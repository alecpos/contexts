// 'use client';
// import {
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     TableRow,
//     SelectChangeEvent,
// } from '@mui/material';
// import { Dispatch, SetStateAction, useState } from 'react';
// import AddIcon from '@mui/icons-material/Add';

// interface Props {
//     setCurrentVariant: Dispatch<SetStateAction<number>>;
//     currentVariant: number;
//     variantList: any[];
// }

// export default function PriceAPIVariantSelectMenu({
//     currentVariant,
//     setCurrentVariant,
//     variantList,
// }: Props) {
//     const handleVariantChange = (event: SelectChangeEvent<number>) => {
//         // if(event.target.value === 'create_new_variant'){
//         //     return;
//         // }
//         setCurrentVariant(Number(event.target.value));
//     };

//     return (
//         <>
//             <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">
//                     Select a Product
//                 </InputLabel>
//                 <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     value={currentVariant}
//                     label="Select a Product"
//                     onChange={handleVariantChange}
//                 >
//                     {variantList.map((variantObject, index) => (
//                         <MenuItem
//                             key={index}
//                             value={variantObject.variantIndex}
//                         >
//                             {variantObject.variant}
//                         </MenuItem>
//                     ))}
//                     {/* <MenuItem
//                     key={'create-new'}
//                     value='create_new_variant'
//                     className='flex flex-row items-center'>
//                         Create New Variant
//                     </MenuItem> */}
//                 </Select>
//             </FormControl>
//         </>
//     );
// }
