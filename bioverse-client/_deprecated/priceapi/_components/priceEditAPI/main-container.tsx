// 'use client';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import {
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     IconButton,
//     Paper,
//     Snackbar,
//     SnackbarContent,
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import PriceAPICadenceCheckbox from './cadence-checkboxes';
// import PriceAPIVariantSelectMenu from './variant-select-menu';
// import CustomizedAccordions from './cadence-accordion';
// import { useRouter } from 'next/navigation';
// import { updateProductPricesWithDataAndVariantIndex } from '@/app/utils/database/api-controller/product_prices/product-prices';
// import CloseIcon from '@mui/icons-material/Close';
// import { handleStripeForProduct } from '../../price-api-actions';

// interface Props {
//     priceData: any;
//     nameData: string;
// }

// export default function PriceAPIMainContainer({ priceData, nameData }: Props) {
//     const router = useRouter();

//     const [clientPriceData, setClientPriceData] = useState(priceData);

//     //tracks whether an edit was made so we can alert user before they leave the page their changes may not be saved.
//     const [productPriceChanged, setProductPriceChanged] =
//         useState<boolean>(false);

//     //possible cadencies: one-time, monthly, quarterly
//     const [cadencies, setCadencies] = useState<string[]>([]);

//     const [currentVariant, setCurrentVariant] = useState<number>(
//         clientPriceData[0].variant_index
//     );

//     const [currentPriceData, setCurrentPriceData] = useState<any>(
//         clientPriceData[currentVariant]
//     );

//     const [dialogOpen, setDialogOpen] = useState<boolean>(false);
//     const closeConfirmUpdateDialog = () => {
//         setDialogOpen(false);
//     };
//     const openConfirmUpdateDialog = () => {
//         setDialogOpen(true);
//     };
//     const [successMessage, setSuccessMessageOpen] = useState(false);
//     const handleSuccessMessageClose = () => {
//         setSuccessMessageOpen(false);
//     };

//     const [variantArray, setVariantArray] = useState<any[]>([]);

//     useEffect(() => {
//         setCurrentPriceData(clientPriceData[currentVariant]);
//     }, [currentVariant]);

//     useEffect(() => {
//         setVariantArray(
//             clientPriceData.map(
//                 (data: { variant: any; variant_index: any }, index: any) => ({
//                     variant: data.variant,
//                     variantIndex: data.variant_index,
//                 })
//             )
//         );
//         // Now variantArray is an array of objects with the structure you described.
//         // You can use this array as needed in your component.
//     }, [clientPriceData]);

//     useEffect(() => {
//         // Assuming priceData is an array and currentVariant is the index
//         const variantData = clientPriceData[currentVariant];

//         const newCadencies: string[] = [];
//         if (variantData.one_time !== null) newCadencies.push('one-time');
//         if (variantData.monthly !== null) newCadencies.push('monthly');
//         if (variantData.quarterly !== null) newCadencies.push('quarterly');

//         setCadencies(newCadencies);
//     }, [clientPriceData, currentVariant]);

//     const changeCadencies = (cadenceObj: CadencePair[]) => {
//         let updatedPriceData = { ...currentPriceData };
//         cadenceObj.forEach(({ cadence, value }) => {
//             // Create a copy of the currentPriceData to avoid direct mutation

//             // Check if the cadence exists in currentPriceData
//             if (updatedPriceData[cadence]) {
//                 // If the value is false, set the corresponding property to null
//                 if (!value) {
//                     updatedPriceData[cadence] = null;
//                 }
//                 // If the value is true and the property is already non-null, do nothing
//             } else if (value) {
//                 // If the value is true and the property does not exist, create a new PriceDataItem
//                 updatedPriceData[cadence] = {
//                     cadence: cadence,
//                     product_price: undefined,
//                     discount_price: undefined,
//                     stripe_price_id: undefined,
//                     subcription_includes_bullets: undefined,
//                     custom_display_text: null,
//                     blue_display_text: undefined,
//                     gray_display_text: undefined,
//                     quarterly_display_price: undefined,
//                 };
//             }

//             console.log('update', updatedPriceData);
//             // Update the state with the modified currentPriceData
//         });
//         setCurrentPriceData(updatedPriceData);
//     };

//     const updateProduct = async () => {
//         const { data: newData, error: error } =
//             await updateProductPricesWithDataAndVariantIndex(
//                 currentPriceData,
//                 currentVariant,
//                 currentPriceData.product_href
//             );

//         if (error) {
//             return;
//         }

//         if (productPriceChanged) {
//             await handleStripeForProduct(
//                 currentVariant,
//                 currentPriceData.product_href
//             );
//         }

//         setCurrentPriceData(newData[0]);
//         closeConfirmUpdateDialog();
//         setSuccessMessageOpen(true);
//         router.refresh();
//     };

//     return (
//         <div className='flex flex-row gap-8 w-full'>
//             <Paper className='flex w-full flex-col p-4'>
//                 <div className='flex flex-row gap-6'>
//                     <div className='w-[100%] min-w-[500px]'>
//                         <BioType className='h5'>{nameData}</BioType>
//                     </div>

//                     <div className='w-full min-w-[200px]'>
//                         <PriceAPIVariantSelectMenu
//                             setCurrentVariant={setCurrentVariant}
//                             currentVariant={currentVariant}
//                             variantList={variantArray}
//                         />
//                     </div>
//                 </div>

//                 <div className='flex flex-row gap-6'>
//                     <div className='w-[50%]'>
//                         <PriceAPICadenceCheckbox
//                             cadencies={cadencies}
//                             setCadencies={changeCadencies}
//                         />
//                     </div>

//                     <div className='justify-center items-center flex w-full'>
//                         <Button
//                             className='h-10'
//                             variant='contained'
//                             color={
//                                 !productPriceChanged ? 'success' : 'secondary'
//                             }
//                             onClick={openConfirmUpdateDialog}
//                         >
//                             Update Product
//                         </Button>
//                     </div>
//                 </div>

//                 <div className='flex mt-10 w-full'>
//                     <CustomizedAccordions
//                         setProductPriceChanged={setProductPriceChanged}
//                         currentVariant={currentVariant}
//                         cadencies={cadencies}
//                         priceData={currentPriceData}
//                         setCurrentPriceDataMain={setCurrentPriceData}
//                     />
//                 </div>
//             </Paper>

//             {/* <div className='w-[20%]'>
//                 {JSON.stringify(currentPriceData)}
//                 <ProductPurchaseMenu priceData={[currentPriceData]} />
//             </div> */}

//             <Dialog
//                 open={dialogOpen}
//                 onClose={closeConfirmUpdateDialog}
//                 aria-labelledby='alert-dialog-title'
//                 aria-describedby='alert-dialog-description'
//             >
//                 <DialogTitle id='alert-dialog-title'>
//                     {'Confirm Update on Prices'}
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id='alert-dialog-description'>
//                         Confirm Price update?
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={closeConfirmUpdateDialog} color='error'>
//                         Cancel
//                     </Button>
//                     <Button onClick={updateProduct} color='primary' autoFocus>
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//                 open={successMessage}
//                 autoHideDuration={6000}
//                 onClose={handleSuccessMessageClose}
//                 color='success'
//             >
//                 <SnackbarContent
//                     message='Update was successful! You are a rockstar!! Keep up the amazing work! <3'
//                     action={
//                         <IconButton
//                             size='small'
//                             aria-label='close'
//                             color='error'
//                             onClick={handleSuccessMessageClose}
//                         >
//                             <CloseIcon fontSize='small' />
//                         </IconButton>
//                     }
//                 />
//             </Snackbar>
//         </div>
//     );
// }
