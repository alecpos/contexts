// import { styled } from '@mui/material/styles';
// import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
// import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
// import MuiAccordionSummary, {
//     AccordionSummaryProps,
// } from '@mui/material/AccordionSummary';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import {
//     Button,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     SelectChangeEvent,
//     TextField,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';

// const Accordion = styled((props: AccordionProps) => (
//     <MuiAccordion disableGutters elevation={0} square {...props} />
// ))(({ theme }) => ({
//     border: `1px solid ${theme.palette.divider}`,
//     '&:not(:last-child)': {
//         borderBottom: 0,
//     },
//     '&::before': {
//         display: 'none',
//     },
// }));

// const AccordionSummary = styled((props: AccordionSummaryProps) => (
//     <MuiAccordionSummary expandIcon={<KeyboardArrowUpIcon />} {...props} />
// ))(({ theme }) => ({
//     '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
//         transform: 'rotate(180deg)',
//     },
//     '& .MuiAccordionSummary-content': {
//         marginLeft: theme.spacing(1),
//     },
// }));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//     padding: theme.spacing(2),
//     borderTop: '1px solid rgba(0,  0,  0, .125)',
//     [`&.Mui-expanded`]: {
//         borderTop: 'none',
//     },
// }));

// interface CustomizedAccordionsProps {
//     priceData: any;
//     cadencies: string[];
//     currentVariant: number;
//     setCurrentPriceDataMain: Dispatch<any>;
//     setProductPriceChanged: Dispatch<SetStateAction<boolean>>;
// }

// export default function CustomizedAccordions({
//     priceData,
//     cadencies,
//     currentVariant,
//     setCurrentPriceDataMain,
//     setProductPriceChanged,
// }: CustomizedAccordionsProps) {
//     const [accordionItems, setAccordionItems] = useState<
//         { cadence: string; value: PriceDataItem }[]
//     >([]);
//     const [expanded, setExpanded] = useState<string[]>([]);
//     const [currentPriceData, setCurrentPriceData] = useState(priceData);

//     useEffect(() => {
//         const initialExpanded = accordionItems.map(
//             (_, index) => `panel${index}`
//         );
//         setExpanded(initialExpanded);
//     }, [accordionItems]);

//     //Editing Code:
//     const [editingPrice, setEditingPrice] = useState<boolean>(false);
//     const [editingBullets, setEditingBullets] = useState<boolean>(false);
//     const [editingBlueDisplay, setEditingBlueDisplay] =
//         useState<boolean>(false);
//     const [editingGrayDisplay, setEditingGrayDisplay] =
//         useState<boolean>(false);
//     const [editingQuarterlyDisplay, setEditingQuarterlyDisplay] =
//         useState<boolean>(false);

//     useEffect(() => {
//         setCurrentPriceData(priceData);
//     }, [priceData]);

//     useEffect(() => {
//         const newAccordionItems: { cadence: string; value: PriceDataItem }[] =
//             [];

//         if (currentPriceData.one_time) {
//             newAccordionItems.push({
//                 cadence: 'one_time',
//                 value: {
//                     type: 'One Time',
//                     ...currentPriceData.one_time,
//                 },
//             });
//         }

//         if (currentPriceData.monthly) {
//             newAccordionItems.push({
//                 cadence: 'monthly',
//                 value: {
//                     type: 'Monthly',
//                     ...currentPriceData.monthly,
//                 },
//             });
//         }

//         if (currentPriceData.quarterly) {
//             newAccordionItems.push({
//                 cadence: 'quarterly',
//                 value: {
//                     type: 'Quarterly',
//                     ...currentPriceData.quarterly,
//                 },
//             });
//         }

//         console.log('newitems', newAccordionItems);
//         setAccordionItems(newAccordionItems);
//     }, [currentPriceData, cadencies, currentVariant]);

//     const handleChange =
//         (panel: string) =>
//         (event: React.SyntheticEvent, isExpanded: boolean) => {
//             setExpanded((currentExpanded) => {
//                 if (isExpanded) {
//                     return [...currentExpanded, panel];
//                 } else {
//                     return currentExpanded.filter((p) => p !== panel);
//                 }
//             });
//         };

//     const updateValue = (cadence: string, field: string, value: string) => {
//         console.log(cadence);
//         console.log('updating value', value);
//         setCurrentPriceDataMain((prevData: { [x: string]: any }) => {
//             let updatedData = { ...prevData };

//             switch (cadence) {
//                 case 'one_time':
//                 case 'monthly':
//                 case 'quarterly':
//                     if (prevData[cadence]) {
//                         updatedData[cadence] = {
//                             ...updatedData[cadence],
//                             [field]: value,
//                         };
//                     }
//                     break;
//                 default:
//                     console.log('Cadence not recognized');
//                     return prevData; // Return previous data if cadence is not recognized
//             }

//             return updatedData;
//         });
//     };

//     const updateDiscountValue = (
//         cadence: string,
//         field: string,
//         value: any
//     ) => {
//         console.log(cadence);
//         console.log('updating value', value);
//         setCurrentPriceDataMain((prevData: { [x: string]: any }) => {
//             let updatedData = { ...prevData };

//             switch (cadence) {
//                 case 'one_time':
//                 case 'monthly':
//                 case 'quarterly':
//                     if (prevData[cadence]) {
//                         updatedData[cadence] = {
//                             ...updatedData[cadence],
//                             [field]: value,
//                         };
//                     }
//                     break;
//                 default:
//                     console.log('Cadence not recognized');
//                     return prevData; // Return previous data if cadence is not recognized
//             }

//             return updatedData;
//         });
//     };

//     const updateBulletsValue = (
//         cadence: string,
//         field: string,
//         bullets: string[]
//     ) => {
//         console.log(cadence);
//         console.log('updating bullets', bullets);
//         setCurrentPriceDataMain((prevData: { [x: string]: any }) => {
//             let updatedData = { ...prevData };

//             switch (cadence) {
//                 case 'one_time':
//                 case 'monthly':
//                 case 'quarterly':
//                     if (prevData[cadence]) {
//                         updatedData[cadence] = {
//                             ...updatedData[cadence],
//                             [field]: bullets,
//                         };
//                     }
//                     break;
//                 default:
//                     console.log('Cadence not recognized');
//                     return prevData; // Return previous data if cadence is not recognized
//             }

//             return updatedData;
//         });
//     };

//     return (
//         <div className='flex w-full flex-col'>
//             {accordionItems.map((item, index) => (
//                 <Accordion
//                     key={index}
//                     expanded={expanded.includes(`panel${index}`)}
//                     onChange={handleChange(`panel${index}`)}
//                 >
//                     <AccordionSummary
//                         aria-controls={`panel${index}d-content`}
//                         id={`panel${index}d-header`}
//                     >
//                         <BioType className='h6'>
//                             {item.value.cadence.replace(/[_-]/g, '')}
//                         </BioType>
//                     </AccordionSummary>
//                     <AccordionDetails className='mx-6'>
//                         <div className='flex flex-col gap-4'>
//                             <PriceEditField
//                                 type={item.value.cadence}
//                                 field={'product_price'}
//                                 value={item.value.product_price}
//                                 updateValue={updateValue}
//                                 setProductPriceChanged={setProductPriceChanged}
//                             />

//                             <PriceEditField
//                                 type={item.value.cadence}
//                                 field={'blue_display_text'}
//                                 value={item.value.blue_display_text}
//                                 updateValue={updateValue}
//                             />

//                             <PriceEditField
//                                 type={item.value.cadence}
//                                 field={'gray_display_text'}
//                                 value={item.value.gray_display_text}
//                                 updateValue={updateValue}
//                             />

//                             {item.value.cadence !== 'quarterly' && (
//                                 <PriceEditField
//                                     type={item.value.cadence}
//                                     field={'custom_display_price'}
//                                     value={item.value.custom_display_price}
//                                     updateValue={updateValue}
//                                     setProductPriceChanged={
//                                         setProductPriceChanged
//                                     }
//                                 />
//                             )}

//                             {item.value.cadence === 'quarterly' && (
//                                 <PriceEditField
//                                     type={item.value.cadence}
//                                     field={'quarterly_display_price'}
//                                     value={item.value.quarterly_display_price}
//                                     updateValue={updateValue}
//                                 />
//                             )}

//                             <PriceEditBulletsField
//                                 type={item.value.cadence}
//                                 field={'subcription_includes_bullets'}
//                                 bullets={
//                                     item.value.subcription_includes_bullets!
//                                 }
//                                 updateBulletsValue={updateBulletsValue}
//                             />

//                             <PriceDiscountEditField
//                                 type={item.value.cadence}
//                                 field={'discount_price'}
//                                 value={item.value.discount_price}
//                                 updateDiscountValue={updateDiscountValue}
//                             />
//                         </div>
//                     </AccordionDetails>
//                 </Accordion>
//             ))}
//         </div>
//     );
// }

// interface PricePaperProps {
//     type: string;
//     field: string;
//     value: any;
//     setProductPriceChanged?: Dispatch<SetStateAction<boolean>>;
//     updateValue: (type: string, field: string, value: string) => void;
// }

// const PriceEditField = ({
//     type,
//     field,
//     value,
//     updateValue,
//     setProductPriceChanged,
// }: PricePaperProps) => {
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [editValue, setEditValue] = useState<string>(value);

//     useEffect(() => {
//         setEditValue(value);
//     }, [value]);

//     const handleValueChange = (
//         event: React.ChangeEvent<HTMLTextAreaElement>
//     ) => {
//         setEditValue(event.target.value);
//     };

//     const convertFieldToText = (field: string) => {
//         // Remove '-' and '_' and split the string into words
//         const words = field.replace(/[-_]/g, ' ').split(' ');

//         // Capitalize the first letter of each word and join them back together
//         const capitalizedWords = words.map(
//             (word) => word.charAt(0).toUpperCase() + word.slice(1)
//         );

//         // Join the words back into a single string
//         return capitalizedWords.join(' ');
//     };

//     const changeEdits = () => {
//         updateValue(type, field, editValue);
//         if (field === 'product_price' && setProductPriceChanged) {
//             setProductPriceChanged(true);
//         }
//         setIsEditing(false);
//     };

//     return (
//         <Paper className='p-2'>
//             <div className='flex flex-row justify-between gap-2'>
//                 <div className='flex flex-col'>
//                     <BioType className='h6'>
//                         {convertFieldToText(field)}:
//                     </BioType>
//                 </div>
//                 {!isEditing ? (
//                     <div
//                         onClick={() => {
//                             setIsEditing(true);
//                         }}
//                         className='hover:cursor-pointer'
//                     >
//                         <EditIcon color='primary' />
//                     </div>
//                 ) : (
//                     <div className='p-2 gap-2 flex'>
//                         <Button
//                             color='primary'
//                             variant='contained'
//                             onClick={changeEdits}
//                         >
//                             Confirm
//                         </Button>
//                         <Button
//                             color='error'
//                             variant='outlined'
//                             onClick={() => {
//                                 setIsEditing(false);
//                             }}
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 )}
//             </div>
//             {!isEditing ? (
//                 <BioType className='body1'>
//                     {value ? `${value}` : 'none'}
//                 </BioType>
//             ) : (
//                 <div className='p-2'>
//                     {field === 'product_price' && (
//                         <div className='p-1'>
//                             <BioType className='body3 text-red-600'>
//                                 Product Price must be a whole number. It will
//                                 add .00 to the end in the application.
//                             </BioType>
//                         </div>
//                     )}
//                     <TextField
//                         type={field === 'product_price' ? 'number' : 'text'}
//                         defaultValue={editValue}
//                         onChange={handleValueChange}
//                         variant='outlined'
//                         fullWidth
//                     />
//                 </div>
//             )}
//         </Paper>
//     );
// };

// interface PriceDiscountEditFieldProps {
//     type: string;
//     field: string;
//     value: any;
//     updateDiscountValue: (type: string, field: string, value: any) => void;
// }

// interface DiscountValue {
//     discount_type: string;
//     discount_amount: number;
// }

// const PriceDiscountEditField = ({
//     type,
//     field,
//     value,
//     updateDiscountValue,
// }: PriceDiscountEditFieldProps) => {
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [editValue, setEditValue] = useState<DiscountValue>(
//         value
//             ? {
//                   discount_amount: value.discount_amount || undefined,
//                   discount_type: value.discount_type || '',
//               }
//             : { discount_amount: undefined, discount_type: '' }
//     );

//     useEffect(() => {
//         setEditValue(
//             value
//                 ? {
//                       discount_amount: value.discount_amount || undefined,
//                       discount_type: value.discount_type || '',
//                   }
//                 : { discount_amount: undefined, discount_type: '' }
//         );
//     }, [value]);

//     const handleValueChange = (
//         event: React.ChangeEvent<HTMLTextAreaElement>
//     ) => {
//         setEditValue((prevState) => ({
//             ...prevState,
//             discount_amount: parseFloat(
//                 parseFloat(event.target.value).toFixed(2)
//             ),
//         }));
//     };

//     const handleSelectValueChange = (event: SelectChangeEvent<string>) => {
//         setEditValue((prevState) => ({
//             ...prevState,
//             discount_type: event.target.value, // No need to cast to string as event.target.value is already a string
//         }));
//     };

//     const convertFieldToText = (field: string) => {
//         // Remove '-' and '_' and split the string into words
//         const words = field.replace(/[-_]/g, ' ').split(' ');

//         // Capitalize the first letter of each word and join them back together
//         const capitalizedWords = words.map(
//             (word) => word.charAt(0).toUpperCase() + word.slice(1)
//         );

//         // Join the words back into a single string
//         return capitalizedWords.join(' ');
//     };

//     const changeEdits = () => {
//         updateDiscountValue(type, field, editValue);
//         setIsEditing(false);
//     };

//     /**
//      * "discount_type": "percent",
//      * "discount_amount": 23
//      */

//     return (
//         <Paper className='p-2'>
//             <div className='flex flex-row justify-between gap-2'>
//                 <div className='flex flex-col'>
//                     <BioType className='h6'>
//                         {convertFieldToText(field)}:
//                     </BioType>
//                 </div>
//                 {!isEditing ? (
//                     <div
//                         onClick={() => {
//                             setIsEditing(true);
//                         }}
//                         className='hover:cursor-pointer'
//                     >
//                         <EditIcon color='primary' />
//                     </div>
//                 ) : (
//                     <div className='p-2 gap-2 flex'>
//                         <Button
//                             color='primary'
//                             variant='contained'
//                             onClick={changeEdits}
//                         >
//                             Confirm
//                         </Button>
//                         <Button
//                             color='error'
//                             variant='outlined'
//                             onClick={() => {
//                                 setIsEditing(false);
//                             }}
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 )}
//             </div>
//             {!isEditing ? (
//                 <>
//                     <BioType className='body1'>
//                         Discount Type:{' '}
//                         {value && value.discount_type
//                             ? `${value.discount_type}`
//                             : 'none'}
//                     </BioType>
//                     <BioType className='body1'>
//                         Discount Amount:{' '}
//                         {value && value.discount_type
//                             ? `${value.discount_amount}`
//                             : 'none'}
//                     </BioType>
//                 </>
//             ) : (
//                 <div className='p-2 gap-2 flex-col flex'>
//                     <FormControl>
//                         <InputLabel id='discount_select_label'>
//                             Discount Type
//                         </InputLabel>
//                         <Select
//                             id='discount_type_select'
//                             labelId='discount_select_label'
//                             label='Discount Type'
//                             value={editValue.discount_type}
//                             onChange={handleSelectValueChange}
//                             variant='outlined'
//                             fullWidth
//                         >
//                             <MenuItem disabled={true} value=''>
//                                 Please Select
//                             </MenuItem>
//                             <MenuItem value='percent'>Percent</MenuItem>
//                             <MenuItem value='fixed'>Fixed</MenuItem>
//                         </Select>
//                     </FormControl>

//                     <TextField
//                         label='Discount Amount'
//                         defaultValue={editValue.discount_amount}
//                         onChange={handleValueChange}
//                         variant='outlined'
//                         fullWidth
//                     />
//                 </div>
//             )}
//         </Paper>
//     );
// };

// interface PriceEditBulletsFieldProps {
//     type: string;
//     field: string;
//     bullets: string[];
//     updateBulletsValue: (type: string, field: string, value: string[]) => void;
// }

// const PriceEditBulletsField = ({
//     bullets,
//     type,
//     field,
//     updateBulletsValue,
// }: PriceEditBulletsFieldProps) => {
//     const [editingBullets, setEditingBullets] = useState<boolean>(false);
//     // Remove tags from the displayed value
//     const [editValue, setEditValue] = useState<string[]>(
//         bullets
//             ? bullets.map((bullet) =>
//                   bullet.replace(
//                       /\[bio-bullet-item\]|\[\/bio-bullet-item\]/g,
//                       ''
//                   )
//               )
//             : []
//     );

//     const addBullet = () => {
//         setEditValue([...editValue, '']); // Add an empty bullet
//     };

//     const removeLastBullet = () => {
//         setEditValue(editValue.slice(0, -1)); // Remove the last bullet
//     };

//     const changeBulletEdits = () => {
//         // Append tags when updating the value
//         const valueWithTags = editValue.map(
//             (bullet) => `[bio-bullet-item]${bullet}[/bio-bullet-item]`
//         );
//         updateBulletsValue(type, field, valueWithTags);
//         setEditingBullets(false);
//     };

//     const handleBulletsChange = (
//         event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//         bulletIndex: number
//     ) => {
//         const updatedBullets = editValue.map((bullet, index) =>
//             index === bulletIndex ? event.target.value : bullet
//         );
//         setEditValue(updatedBullets);
//     };

//     return (
//         <Paper className='p-2'>
//             {/* Component content remains unchanged */}
//             <div className='flex flex-row justify-between'>
//                 <div className='flex flex-col justify-between'>
//                     <BioType className='h6'>
//                         Subscription Includes Bullets:
//                     </BioType>
//                 </div>
//                 {!editingBullets ? (
//                     <div
//                         onClick={() => {
//                             setEditingBullets(true);
//                         }}
//                         className='hover:cursor-pointer'
//                     >
//                         <EditIcon color='primary' />
//                     </div>
//                 ) : (
//                     <div className='p-2 gap-2 flex'>
//                         <Button
//                             color='primary'
//                             variant='contained'
//                             onClick={changeBulletEdits}
//                         >
//                             Confirm
//                         </Button>
//                         <Button
//                             color='error'
//                             variant='outlined'
//                             onClick={() => {
//                                 setEditingBullets(false);
//                             }}
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 )}
//             </div>
//             {editingBullets ? (
//                 <div className='flex flex-col'>
//                     {editValue.map((bullet, bulletIndex) => (
//                         <TextField
//                             key={bulletIndex}
//                             defaultValue={bullet}
//                             variant='outlined'
//                             onChange={(e) =>
//                                 handleBulletsChange(e, bulletIndex)
//                             }
//                             className='my-2'
//                         />
//                     ))}
//                     <div className='flex gap-2'>
//                         <Button
//                             onClick={addBullet}
//                             color='primary'
//                             variant='contained'
//                         >
//                             Add Bullet
//                         </Button>
//                         <Button
//                             onClick={removeLastBullet}
//                             color='error'
//                             variant='outlined'
//                         >
//                             Remove Last Bullet
//                         </Button>
//                     </div>
//                 </div>
//             ) : (
//                 <div className='flex flex-col'>
//                     {/* Display bullets without tags */}
//                     {bullets && bullets.length > 0
//                         ? bullets.map((bullet, bulletIndex) => (
//                               <BioType key={bulletIndex} className='body1'>
//                                   {bullet.replace(
//                                       /\[bio-bullet-item\]|\[\/bio-bullet-item\]/g,
//                                       ''
//                                   )}
//                               </BioType>
//                           ))
//                         : 'none'}
//                 </div>
//             )}
//         </Paper>
//     );
// };
