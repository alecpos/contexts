// 'use client';
// import {
//     Checkbox,
//     FormControlLabel,
//     IconButton,
//     Menu,
//     MenuItem,
// } from '@mui/material';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import { Dispatch, SetStateAction, useState } from 'react';
// import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
// import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';

// interface Props {
//     onFilterChange: (filters: string[]) => void;
//     selectedApprovalStatusFilters: string[];
//     idFilterStatus: boolean;
//     setIDFilterStatus: Dispatch<SetStateAction<boolean>>;
// }

// const filterOptions = [
//     {
//         label: 'Needs Provider Review',
//         status: [
//             // 'Unapproved-CardDown',
//             RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid,
//             RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid,
//             RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Paid,
//             RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Unpaid,
//         ],
//     },
//     {
//         label: 'Approved Treatment Not Prescribed',
//         status: ['Approved-CardDown'],
//     },
//     {
//         label: 'Customer Charged Script Not Sent',
//         status: [
//             'Payment-Completed',
//             RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Paid,
//         ],
//     },
//     {
//         label: 'Prescription Sent',
//         status: [
//             'Approved-CardDown-Finalized',
//             RenewalOrderStatus.PharmacyProcessing,
//         ],
//     },
// ];

// export default function ProviderFilter({
//     onFilterChange,
//     selectedApprovalStatusFilters,
//     idFilterStatus,
//     setIDFilterStatus,
// }: Props) {
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleCheckboxChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//         filter: { label: string; status: string[] },
//     ) => {
//         const { checked } = event.target;
//         const { status } = filter;

//         let newSelectedFilters: string[];

//         if (checked) {
//             newSelectedFilters = [
//                 ...selectedApprovalStatusFilters,
//                 ...status.filter(
//                     (s) => !selectedApprovalStatusFilters.includes(s),
//                 ),
//             ];
//         } else {
//             newSelectedFilters = selectedApprovalStatusFilters.filter(
//                 (selectedStatus) => !status.includes(selectedStatus),
//             );
//         }

//         onFilterChange(newSelectedFilters);
//     };

//     const handleIDCheckboxChange = () => {
//         setIDFilterStatus((prev) => !prev);
//     };

//     return (
//         <div>
//             <IconButton onClick={handleMenuOpen}>
//                 <FilterAltIcon />
//             </IconButton>

//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//             >
//                 <MenuItem>
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={idFilterStatus}
//                                 onChange={handleIDCheckboxChange}
//                             />
//                         }
//                         label={'ID Uploaded'}
//                     />
//                 </MenuItem>
//                 <div className="px-2 justify-self-center items-center">
//                     <HorizontalDivider
//                         backgroundColor={'#1B1B1BDE'}
//                         height={1}
//                     />
//                 </div>
//                 {filterOptions.map((option) => (
//                     <MenuItem key={option.label}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={option.status.some((status) =>
//                                         selectedApprovalStatusFilters.includes(
//                                             status,
//                                         ),
//                                     )}
//                                     onChange={(event) =>
//                                         handleCheckboxChange(event, option)
//                                     }
//                                 />
//                             }
//                             label={option.label}
//                         />
//                     </MenuItem>
//                 ))}
//             </Menu>
//         </div>
//     );
// }
