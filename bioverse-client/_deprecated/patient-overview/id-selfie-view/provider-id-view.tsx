// 'use client';

// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { Paper } from '@mui/material';
// import { useState } from 'react';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import Image from 'next/image';
// import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';

// /**
//  * author: @NathanCho
//  * Modified to add Author: Feb 5th 2024
//  *
//  * Purpose: Show Providers an image of the ID's available.
//  */

// interface Props {
//     licenseData: LicenseData;
// }

// export default function ProviderIDView({ licenseData }: Props) {
//     const [expanded, setExpanded] = useState<boolean>(true);
//     const [openModal, setOpenModal] = useState<boolean>(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const sectionHeaderClass = `flex flex-row items-center gap-2 p-8`;

//     const handleImageClick = (src: string) => {
//         setSelectedImage(src);
//         setOpenModal(true);
//     };

//     return (
//         <>
//             <Paper className='w-full'>
//                 <div
//                     className={sectionHeaderClass}
//                     onClick={() => setExpanded((prev) => !prev)}
//                 >
//                     <BioType className='h6 text-primary'>
//                         ID Verification
//                     </BioType>
//                     {expanded ? (
//                         <KeyboardArrowUpIcon />
//                     ) : (
//                         <KeyboardArrowDownIcon />
//                     )}
//                 </div>

//                 {expanded && (
//                     <>
//                         {(!licenseData.license || !licenseData.selfie) && (
//                             <BioType className='text-red-500 px-4 pb-2'>
//                                 The customer has not uploaded their ID and
//                                 Selfie Photo yet.
//                             </BioType>
//                         )}
//                         <div className='flex flex-col md:flex-row gap-4 md:gap-[8.5vw] px-8 pb-8'>
//                             <div className='flex-col flex flex-grow md:w-1/2'>
//                                 <BioType className='body1'>Selfie</BioType>

//                                 <Paper
//                                     className='flex w-[100%] relative aspect-[16/9] items-center justify-center overflow-hidden'
//                                     sx={
//                                         licenseData.selfie
//                                             ? {
//                                                   borderRadius:
//                                                       'var(--3, 24px)',
//                                                   border: '1px var(--secondary-contrast, #1B1B1B)',
//                                               }
//                                             : {
//                                                   borderRadius:
//                                                       'var(--3, 24px)',
//                                                   border: '1px dashed var(--secondary-contrast, #1B1B1B)',
//                                               }
//                                     }
//                                 >
//                                     {licenseData.selfie ? (
//                                         <div className='p-0 relative w-full h-full rounded-sm'>
//                                             <Image
//                                                 src={licenseData.selfie}
//                                                 alt={'selfie'}
//                                                 fill
//                                                 style={{ objectFit: 'contain' }}
//                                                 unoptimized      
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div
//                                             style={{
//                                                 borderRadius: '50%', // Make the div circular
//                                                 width: '100px', // Set the width of the circle
//                                                 height: '100px', // Set the height of the circle
//                                                 backgroundColor: '#E0E0E0', // Set the background color of the circle
//                                                 display: 'flex', // Utilize flexbox for centering the icon
//                                                 alignItems: 'center', // Center the icon vertically
//                                                 justifyContent: 'center', // Center the icon horizontally
//                                             }}
//                                         >
//                                             <CameraAltOutlinedIcon fontSize='large' />
//                                         </div>
//                                     )}
//                                 </Paper>
//                             </div>

//                             <div className='flex flex-col flex-grow md:w-1/2'>
//                                 <BioType className='body1'>
//                                     Government ID (with date of birth)
//                                 </BioType>

//                                 <Paper
//                                     className='flex w-[100%] relative aspect-[16/9] items-center justify-center overflow-hidden'
//                                     sx={
//                                         licenseData.license
//                                             ? {
//                                                   borderRadius:
//                                                       'var(--3, 24px)',
//                                                   border: '1px var(--secondary-contrast, #1B1B1B)',
//                                               }
//                                             : {
//                                                   borderRadius:
//                                                       'var(--3, 24px)',
//                                                   border: '1px dashed var(--secondary-contrast, #1B1B1B)',
//                                               }
//                                     }
//                                 >
//                                     {licenseData.license ? (
//                                         <div
//                                             className='p-0 relative w-full h-full rounded-sm'
//                                             onClick={() =>
//                                                 handleImageClick(
//                                                     licenseData.license!
//                                                 )
//                                             }
//                                         >
//                                             <Image
//                                                 src={licenseData.license}
//                                                 alt={'license'}
//                                                 fill
//                                                 style={{ objectFit: 'contain' }}
//                                                 unoptimized
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div
//                                             style={{
//                                                 borderRadius: '50%', // Make the div circular
//                                                 width: '100px', // Set the width of the circle
//                                                 height: '100px', // Set the height of the circle
//                                                 backgroundColor: '#E0E0E0', // Set the background color of the circle
//                                                 display: 'flex', // Utilize flexbox for centering the icon
//                                                 alignItems: 'center', // Center the icon vertically
//                                                 justifyContent: 'center', // Center the icon horizontally
//                                             }}
//                                         >
//                                             <CameraAltOutlinedIcon fontSize='large' />
//                                         </div>
//                                     )}
//                                 </Paper>
//                                 <Dialog
//                                     open={openModal}
//                                     onClose={() => setOpenModal(false)}
//                                 >
//                                     <DialogTitle>
//                                         <IconButton
//                                             edge='end'
//                                             color='inherit'
//                                             onClick={() => setOpenModal(false)}
//                                             aria-label='close'
//                                         >
//                                             <CloseIcon />
//                                         </IconButton>
//                                     </DialogTitle>
//                                     <DialogContent>
//                                         {selectedImage && (
//                                             <img
//                                                 src={selectedImage}
//                                                 alt=''
//                                                 style={{
//                                                     maxWidth: '100%',
//                                                     maxHeight: '100%',
//                                                 }}
//                                             />
//                                         )}
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </Paper>
//         </>
//     );
// }
