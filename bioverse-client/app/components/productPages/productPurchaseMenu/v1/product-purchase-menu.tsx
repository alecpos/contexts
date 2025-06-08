// 'use client';

// import { useEffect, useState } from 'react';
// import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
// import {
//     Button,
//     Checkbox,
//     FormControl,
//     FormLabel,
//     InputLabel,
//     MenuItem,
//     Select,
//     SelectChangeEvent,
//     Switch,
// } from '@mui/material';
// import { useParams, useRouter } from 'next/navigation';
// import {
//     SEMAGLUTIDE_PRODUCT_HREF,
//     TIRZEPATIDE_PRODUCT_HREF,
// } from '@/app/services/tracking/constants';
// import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

// interface Props {
//     priceData: ProductVariantRecord[];
// }

// export default function ProductPurchaseMenu({ priceData }: Props) {
//     //state variables
//     const [currentRecord, setCurrentRecord] = useState<ProductVariantRecord>(
//         priceData[0]
//     );

//     const [currentCadenceDisplay, setCurrentCadenceDisplay] =
//         useState<CadenceData>(currentRecord.cadence);

//     const [variantIndex, setVariantIndex] = useState<number>(
//         currentRecord.variant_index
//     );
//     const [variantName, setVariantName] = useState<string>(
//         currentRecord.variant
//     );

//     const [subscriptionType, setSubscriptionType] = useState<string>(
//         currentCadenceDisplay.cadence
//     );

//     const [saveCheckbox, setSaveCheckbox] = useState<boolean>(false);

//     const isSpecial =
//         priceData[0].product_href === SEMAGLUTIDE_PRODUCT_HREF ||
//         priceData[0].product_href === TIRZEPATIDE_PRODUCT_HREF;

//     const params = useParams();

//     useEffect(() => {
//         if (['metformin', 'nad-injection'].includes(params.product as string)) {
//             setSaveCheckbox(true);
//         }
//     }, [params]);

//     //router hook
//     const router = useRouter();

//     //Changes the currentRecord once variant index changes.
//     useEffect(() => {
//         setCurrentRecord(priceData[variantIndex]);
//     }, [variantIndex]);
//     //Changes the cadence to one-time > monthly > quarterly in precendence
//     useEffect(() => {
//         setCurrentCadenceDisplay(
//             currentRecord.one_time ||
//                 currentRecord.monthly ||
//                 currentRecord.quarterly!
//         );
//     }, [currentRecord, variantIndex]);

//     useEffect(() => {
//         switch (subscriptionType) {
//             case 'one_time':
//                 setCurrentCadenceDisplay(currentRecord.one_time!);
//                 setSubscriptionType('one_time');
//                 break;
//             case 'monthly':
//                 setCurrentCadenceDisplay(currentRecord.monthly!);
//                 setSubscriptionType('monthly');
//                 break;
//             case 'quarterly':
//                 setCurrentCadenceDisplay(currentRecord.quarterly!);
//                 setSubscriptionType('quarterly');
//                 break;
//         }
//     }, [subscriptionType, currentRecord]);

//     const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         /**
//          * This switch change function calculates a lot of conditional logic.
//          * Eventually, we can move it to a switch case logic since there are exactly 4 variations of the menu display.
//          */
//         const isSwitchedOn = event.target.checked;
//         let newSubscriptionType = subscriptionType;

//         if (
//             !priceData[variantIndex].one_time &&
//             priceData[variantIndex].monthly &&
//             priceData[variantIndex].quarterly
//         ) {
//             newSubscriptionType = isSwitchedOn ? 'quarterly' : 'monthly';
//         } else if (isSwitchedOn) {
//             if (priceData[variantIndex].monthly) {
//                 newSubscriptionType = 'monthly';
//             } else if (priceData[variantIndex].quarterly) {
//                 newSubscriptionType = 'quarterly';
//             }
//         } else {
//             newSubscriptionType = 'one_time';
//         }

//         setSubscriptionType(newSubscriptionType);
//     };

//     /**
//      * @author Nathan Cho
//      * This is needed as a middle man between the variant text and index number.
//      * @param event
//      */
//     const handleVariantChange = (event: SelectChangeEvent<string>) => {
//         const newVariant = event.target.value as string;
//         setVariantName(newVariant);

//         const newIndex = variants.findIndex(
//             (variant) => variant === newVariant
//         );
//         setVariantIndex(newIndex);
//     };

//     const beginIntake = () => {
//         const variantLower = currentRecord.variant.toLowerCase();

//         const coupon_string =
//             subscriptionType !== 'one_time' && saveCheckbox ? '&sd=23c' : '';

//         router.push(
//             `/intake/middlelayer/${
//                 priceData[variantIndex].product_href
//             }?pvn=${variantIndex}&st=${subscriptionType.toLowerCase()}&pvt=${variantLower}${coupon_string}`
//         );
//     };

//     const capitalizeFirstLetter = (string: string) => {
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     };

//     const handleSubscriptionTypeChange = (event: SelectChangeEvent<string>) => {
//         const newSubscriptionType = event.target.value;
//         setSubscriptionType(newSubscriptionType);
//     };

//     const subscriptionOptions = Object.entries(priceData[variantIndex])
//         .filter(
//             ([key, value]) =>
//                 value !== null &&
//                 key !== 'one_time' &&
//                 (key === 'monthly' || key === 'quarterly')
//         )
//         .map(([key]) => ({
//             value: key,
//             label:
//                 key === 'monthly' || key === 'quarterly'
//                     ? `${capitalizeFirstLetter(
//                           key.replace('_', ' ')
//                       )} (Cancel anytime)`
//                     : capitalizeFirstLetter(key.replace('_', ' ')), //changing one_time to one time
//         }));

//     const variants: string[] = Array.from(
//         new Set(priceData.map((item: { variant: any }) => item.variant))
//     );

//     const joinBullets = () => {
//         return currentCadenceDisplay.subcription_includes_bullets.join(' '); // Join with a space
//     };

//     function formatNumberWithComma(number: number): string {
//         const numberString = number.toString();
//         if (numberString.length > 3) {
//             // Insert a comma at the appropriate position for numbers greater than 999
//             return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//         }
//         return numberString;
//     }

//     const productPriceAdjustment = (() => {
//         switch (currentRecord.product_href) {
//             case 'tirzepatide':
//                 return 50;
//             case 'semaglutide':
//                 return 70;
//             default:
//                 return 100;
//         }
//     })();

//     const isWeightLossProduct = (name: string) => {
//         const weightloss_products = [
//             'ozempic',
//             'wegovy',
//             'semaglutide',
//             'tirzepatide',
//             'mounjaro',
//         ];

//         return weightloss_products.includes(name);
//     };

//     const handleCheckboxChange = (event: any) => {
//         if (saveCheckbox) {
//             return;
//         }
//         setSaveCheckbox(true);
//     };

//     const displayButtonText = () => {
//         if (isSpecial) {
//             return (
//                 <BioType className='flex flex-row justify-center items-center'>
//                     GET STARTED
//                 </BioType>
//             );
//         }

//         return (
//             <BioType className='flex flex-row justify-center items-center'>
//                 START YOUR FREE VISIT <KeyboardArrowRightOutlinedIcon />
//             </BioType>
//         );
//     };

//     const displayPrice = () => {
//         if (!isSpecial) {
//             return subscriptionType === 'quarterly'
//                 ? currentCadenceDisplay.quarterly_display_price!
//                 : currentCadenceDisplay.custom_display_price != undefined
//                 ? currentCadenceDisplay.custom_display_price
//                 : '$' +
//                   (currentRecord.product_href === 'ozempic' ||
//                   currentRecord.product_href === 'wegovy' ||
//                   currentRecord.product_href === 'mounjaro' ||
//                   currentRecord.product_href === 'semaglutide' ||
//                   currentRecord.product_href === 'tirzepatide'
//                       ? formatNumberWithComma(
//                             currentCadenceDisplay.product_price -
//                                 productPriceAdjustment
//                         )
//                       : formatNumberWithComma(
//                             currentCadenceDisplay.product_price
//                         )) +
//                   '.00'; /** product price contains price for all */
//         }
//         return priceData[0].price_data?.price_text;
//     };

//     // const productPurchaseMenuContainerClass = "flex w-full md:w-[18.3vw] p-0 flex-col items-start gap-[1.11vw]";
//     const productPurchaseMenuContainerClass =
//         'flex w-full p-0 flex-col items-start gap-[1.11vw] mt-4';
//     const includeBulletContainerClass = 'flex flex-col mb-2';
//     const includeBulletTypographyClass = 'body1 mt-1';
//     const priceDisplayContainerClass =
//         'inline-flex flex-col items-start gap-0 relative flex-[0_0_auto] mb-2 body1';
//     const subscriptionSwitchContainerClass = 'flex';
//     const oneTimeSwitchClass = 'body1';
//     const switchBoldedFontClass = 'body1';
//     const marketPriceClass =
//         'text-gray-500 text-sm font-normal leading-6 tracking-wider line-through';
//     const subscriptionSelectContainerClass =
//         'flex flex-col md:w-[18.3vw] min-w-[263px] items-start gap-[12px] relative self-stretch w-full flex-[0_0_auto] mt-2';
//     const variantSelectContainerClass =
//         'flex flex-col md:w-[18.3vw] min-w-[263px] items-start mt-2 gap-[12px] relative self-stretch w-full flex-[0_0_auto]';
//     const startButtonContainerClass = 'w-full md:w-[18.3vw] min-w-[263px] mt-2';

//     const checkBoxActiveClass = 'text-[#286BA2]';
//     const checkBoxInactiveClass = 'text-[#1b1b1b] opacity-60';

//     const product = priceData[variantIndex];
//     const product_sub = product[subscriptionType as keyof ProductPriceRecord];

//     return (
//         <>
//             {subscriptionType && (
//                 <>
//                     <div
//                         id='productPurchaseMenuContainer'
//                         className={productPurchaseMenuContainerClass}
//                     >
//                         {/* includes information does not appear unless it is a subscription */}
//                         <div
//                             id='includeBulletContainer'
//                             className={includeBulletContainerClass}
//                         >
//                             <div className='body1bold'>
//                                 {subscriptionType === 'one_time'
//                                     ? 'INCLUDES'
//                                     : 'SUBSCRIPTION INCLUDES'}
//                             </div>

//                             <BioType className={includeBulletTypographyClass}>
//                                 {joinBullets()}
//                             </BioType>
//                         </div>

//                         <BioType className={includeBulletTypographyClass}>
//                             {currentRecord.product_href === 'ozempic' ||
//                             currentRecord.product_href === 'wegovy' ||
//                             currentRecord.product_href === 'mounjaro'
//                                 ? ''
//                                 : 'Actual product packaging may appear differently than shown.'}
//                         </BioType>

//                         <div
//                             id='priceDisplayContainer'
//                             className={priceDisplayContainerClass}
//                         >
//                             <BioType className='h4 text-[28px]'>
//                                 {displayPrice()}
//                             </BioType>

//                             {currentCadenceDisplay.blue_display_text &&
//                                 !isSpecial && (
//                                     <BioType
//                                         className='savings text-primary'
//                                         id='blue-display-text'
//                                     >
//                                         {
//                                             currentCadenceDisplay.blue_display_text
//                                         }
//                                     </BioType>
//                                 )}

//                             {currentCadenceDisplay.gray_display_text &&
//                                 !isSpecial && (
//                                     <BioType
//                                         className='body1 text-[#1b1b1b99]'
//                                         id='gray-display-text'
//                                     >
//                                         {
//                                             currentCadenceDisplay.gray_display_text
//                                         }
//                                     </BioType>
//                                 )}
//                         </div>

//                         {/**
//                          * place
//                          */}

//                         {!priceData[variantIndex].one_time &&
//                         priceData[variantIndex].monthly &&
//                         priceData[variantIndex].quarterly ? (
//                             //if there is only monthly / quarterly
//                             <div
//                                 id='subscriptionSwitchContainer'
//                                 className={subscriptionSwitchContainerClass}
//                             >
//                                 <FormLabel className='body1 flex flex-center self-center'>
//                                     <BioType
//                                         className={
//                                             subscriptionType === 'monthly'
//                                                 ? 'body1'
//                                                 : 'body1  text-[#1B1B1B61]'
//                                         }
//                                     >
//                                         Order Monthly
//                                     </BioType>
//                                 </FormLabel>
//                                 <Switch
//                                     className='flex flex-center self-center'
//                                     checked={subscriptionType === 'quarterly'}
//                                     onChange={handleSwitchChange}
//                                 />
//                                 <FormLabel className='flex flex-col text-center self-center'>
//                                     <BioType
//                                         className={
//                                             subscriptionType === 'quarterly'
//                                                 ? 'body1'
//                                                 : 'body1 text-[#1B1B1B61]'
//                                         }
//                                     >
//                                         Order Quarterly (Save)
//                                     </BioType>
//                                 </FormLabel>
//                             </div>
//                         ) : (
//                             <>
//                                 {priceData[variantIndex].one_time && (
//                                     <div
//                                         id='subscriptionSwitchContainer'
//                                         className={
//                                             subscriptionSwitchContainerClass
//                                         }
//                                     >
//                                         <FormLabel className='body1 flex flex-center self-center'>
//                                             <BioType
//                                                 className={
//                                                     subscriptionType !==
//                                                     'one_time'
//                                                         ? 'body1 text-[#1B1B1B61]'
//                                                         : `${oneTimeSwitchClass}`
//                                                 }
//                                             >
//                                                 One Time
//                                             </BioType>
//                                         </FormLabel>
//                                         <Switch
//                                             className='flex flex-center self-center'
//                                             checked={
//                                                 subscriptionType !== 'one_time'
//                                             }
//                                             onChange={handleSwitchChange}
//                                         />
//                                         <FormLabel className='flex flex-col text-center self-center'>
//                                             <BioType
//                                                 className={
//                                                     subscriptionType !==
//                                                     'one_time'
//                                                         ? `${switchBoldedFontClass}`
//                                                         : 'body1 text-[#1B1B1B61]'
//                                                 }
//                                             >
//                                                 Subscribe + Save
//                                             </BioType>
//                                         </FormLabel>
//                                     </div>
//                                 )}
//                             </>
//                         )}

//                         {(subscriptionType === 'monthly' ||
//                             subscriptionType === 'quarterly') &&
//                         !isWeightLossProduct(product.product_href) ? (
//                             <div className='flex items-center'>
//                                 <Checkbox
//                                     checked={saveCheckbox}
//                                     onChange={handleCheckboxChange}
//                                 />
//                                 <BioType
//                                     className={`body1 text-[15px] ${
//                                         saveCheckbox
//                                             ? checkBoxActiveClass
//                                             : checkBoxInactiveClass
//                                     }`}
//                                 >
//                                     {saveCheckbox ? (
//                                         <>
//                                             $
//                                             {typeof product_sub === 'object' &&
//                                             product_sub?.discount_price &&
//                                             product_sub?.discount_price
//                                                 .discount_amount
//                                                 ? product_sub?.discount_price.discount_amount.toFixed(
//                                                       2
//                                                   )
//                                                 : 0}{' '}
//                                             coupon applied at checkout on your
//                                             first Subscribe + Save order.
//                                         </>
//                                     ) : (
//                                         <>
//                                             Limited Time: Save an extra $
//                                             {typeof product_sub === 'object' &&
//                                             product_sub?.discount_price &&
//                                             product_sub?.discount_price
//                                                 .discount_amount
//                                                 ? product_sub?.discount_price.discount_amount.toFixed(
//                                                       2
//                                                   )
//                                                 : 0}{' '}
//                                             on your first Subscribe + Save
//                                             order.
//                                         </>
//                                     )}
//                                 </BioType>
//                             </div>
//                         ) : null}

//                         {!isSpecial && subscriptionType !== 'one_time' && (
//                             <div
//                                 id='subscriptionSelectContainer'
//                                 className={subscriptionSelectContainerClass}
//                             >
//                                 <FormControl fullWidth>
//                                     <InputLabel
//                                         id='subscription-label'
//                                         className='bg-white'
//                                     >
//                                         Subscription Frequency
//                                     </InputLabel>
//                                     <Select
//                                         labelId='subscription-label'
//                                         id='subscription-select'
//                                         value={subscriptionType}
//                                         onChange={handleSubscriptionTypeChange}
//                                     >
//                                         {subscriptionOptions.map(
//                                             (option, index) => (
//                                                 <MenuItem
//                                                     value={option.value}
//                                                     key={index}
//                                                 >
//                                                     {option.label}
//                                                 </MenuItem>
//                                             )
//                                         )}
//                                     </Select>
//                                 </FormControl>
//                             </div>
//                         )}

//                         {!isSpecial &&
//                             priceData[0].product_href !== 'tretinoin' && (
//                                 <div
//                                     id='variantSelectContainer'
//                                     className={variantSelectContainerClass}
//                                 >
//                                     <FormControl
//                                         fullWidth
//                                         style={{ gap: 16, marginTop: 4 }}
//                                     >
//                                         <InputLabel
//                                             id='variant-label'
//                                             className='bg-white'
//                                         >
//                                             Variant
//                                         </InputLabel>
//                                         <Select
//                                             labelId='variant-label'
//                                             id='variant-select'
//                                             value={variantName}
//                                             onChange={handleVariantChange}
//                                             className='body1'
//                                         >
//                                             {variants.map(
//                                                 (
//                                                     variant: string,
//                                                     index: number
//                                                 ) => {
//                                                     return (
//                                                         <MenuItem
//                                                             value={variant}
//                                                             key={index}
//                                                             className='body1'
//                                                         >
//                                                             {variant}
//                                                         </MenuItem>
//                                                     );
//                                                 }
//                                             )}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             )}
//                         <div
//                             id='startButtonContainer'
//                             className={startButtonContainerClass}
//                         >
//                             <Button
//                                 onClick={beginIntake}
//                                 variant='contained'
//                                 style={{ height: 54 }}
//                                 fullWidth
//                             >
//                                 {displayButtonText()}
//                             </Button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </>
//     );
// }
