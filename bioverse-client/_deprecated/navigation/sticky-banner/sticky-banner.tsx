// 'use client';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { useEffect, useState } from 'react';
// import { Navigation } from 'swiper/modules';

// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// import { getPriceTableData } from '@/app/utils/database/api-controller/product_prices/product-prices';
// import Link from 'next/link';
// import { Button } from '@mui/material';
// import {
//     SEMAGLUTIDE_PRODUCT_HREF,
//     TIRZEPATIDE_PRODUCT_HREF,
// } from '@/app/services/tracking/constants';
// import BioType from '../../bioverse-typography/bio-type/bio-type';
// import useSWR from 'swr';
// import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';

// interface StickyBannerProps {
//     product_href: string;
// }

// export default function StickyBanner({ product_href }: StickyBannerProps) {
//     const [productDiscountArray, setProductDiscountArray] = useState<any[]>();
//     const [discountsToMap, setDiscountsToMap] = useState<any[]>();

//     const isSpecial =
//         product_href === SEMAGLUTIDE_PRODUCT_HREF ||
//         product_href === TIRZEPATIDE_PRODUCT_HREF;

//     useEffect(() => {
//         (async () => {
//             const { data: productDiscountData, error: fetchError } =
//                 await getPriceTableData(product_href);

//             if (!fetchError && productDiscountData) {
//                 setProductDiscountArray(productDiscountData);

//                 // Map through productDiscountData to extract the values of quarterly, monthly, and one_time
//                 const discountsMapping = productDiscountData
//                     .map((product) => {
//                         // Check if the product has a quarterly or monthly discount
//                         const discounts = [
//                             product.quarterly,
//                             product.monthly,
//                         ].filter(Boolean);

//                         // For each discount found, create a new object with the required properties
//                         return discounts.map((discount) => ({
//                             price_data: discount,
//                             variant_index: product.variant_index,
//                             variant: product.variant,
//                         }));
//                     })
//                     .flat();

//                 // Update the discountsToMap state with the new array
//                 if (isSpecial) {
//                     setDiscountsToMap([discountsMapping[0]]);
//                 } else {
//                     setDiscountsToMap(discountsMapping);
//                 }
//             }
//         })();
//     }, [product_href]);

//     const displayBannerText = (product: any) => {
//         if (!isSpecial) {
//             return (
//                 <Link
//                     href={`/intake/middlelayer/${product_href}?pvn=${product.variant_index}&st=${product.price_data.cadence}&pvt=${product.variant}&sd=23c`}
//                     className='no-underline'
//                 >
//                     <div className='flex flex-col md:hidden justify-center'>
//                         <BioType className='body1 text-white whitespace-nowrap overflow-hidden'>
//                             Limited Time: Save an extra $
//                             {product.price_data.discount_price?.discount_amount.toFixed(
//                                 2
//                             ) ?? ''}{' '}
//                             on your first order
//                         </BioType>
//                         {productDiscountArray!.length > 1 && (
//                             <BioType className='body1 text-white'>
//                                 {product.variant}
//                             </BioType>
//                         )}
//                     </div>
//                     <div className='hidden md:flex flex-col justify-center items-center'>
//                         <BioType className='body1 text-white whitespace-nowrap overflow-hidden'>
//                             Limited Time: Save an extra $
//                             {product.price_data.discount_price?.discount_amount.toFixed(
//                                 2
//                             ) ?? ''}{' '}
//                             on your first order{' '}
//                             {productDiscountArray!.length > 1 &&
//                                 `| ${product.variant}`}
//                         </BioType>
//                     </div>
//                     <BioType className='body1bold text-[13pt] text-white underline'>
//                         Start your {product.price_data.cadence} subscription
//                     </BioType>
//                 </Link>
//             );
//         } else {
//             const text =
//                 product_href === SEMAGLUTIDE_PRODUCT_HREF
//                     ? 'Limited Time: Semaglutide for as little as $159/mo!'
//                     : 'Limited Time: Tirzepatide for as little as $234/mo!';
//             return (
//                 <Link
//                     href={`/intake/middlelayer/${product_href}?pvn=${product.variant_index}&st=${product.price_data.cadence}&pvt=${product.variant}&sd=23c`}
//                     className='no-underline'
//                 >
//                     <div className='flex flex-col md:hidden justify-center'>
//                         <BioType className='body1 text-white whitespace-nowrap overflow-hidden mt-1'>
//                             {text}
//                         </BioType>
//                     </div>
//                     <div className='hidden md:flex flex-col justify-center items-center'>
//                         <BioType className='body1 text-white whitespace-nowrap overflow-hidden mt-1'>
//                             {text}
//                         </BioType>
//                     </div>
//                 </Link>
//             );
//         }
//     };

//     return (
//         <>
//             {discountsToMap && (
//                 <div
//                     className={`${
//                         productDiscountArray
//                             ? productDiscountArray.length < 2
//                                 ? 'h-[50px]'
//                                 : 'h-[70px] md:h-[50px]'
//                             : 'h-[50px]'
//                     } bg-primary flex flex-row w-full`}
//                 >
//                     {!isSpecial && productDiscountArray!.length > 1 && (
//                         <Button
//                             disableRipple
//                             className='arrowLeft justify-self-end'
//                             sx={{
//                                 '&:hover': {
//                                     backgroundColor: 'transparent',
//                                 },
//                             }}
//                         >
//                             <ChevronLeftIcon sx={{ color: 'white' }} />
//                         </Button>
//                     )}

//                     <Swiper
//                         modules={[Navigation]}
//                         navigation={{
//                             nextEl: '.arrowRight',
//                             prevEl: '.arrowLeft',
//                         }}
//                         spaceBetween={50}
//                         slidesPerView={1}
//                         loop={discountsToMap.length > 3}
//                         centeredSlides={true}
//                         className='h-full'
//                     >
//                         {discountsToMap.map((product, index) => (
//                             <SwiperSlide
//                                 key={index}
//                                 className='flex w-full items-center justify-center text-center mt-1'
//                             >
//                                 {displayBannerText(product)}
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>

//                     {!isSpecial && productDiscountArray!.length > 1 && (
//                         <Button
//                             disableRipple
//                             className='arrowRight'
//                             sx={{
//                                 '&:hover': {
//                                     backgroundColor: 'transparent',
//                                 },
//                             }}
//                         >
//                             <ChevronRightIcon sx={{ color: 'white' }} />
//                         </Button>
//                     )}
//                 </div>
//             )}
//         </>
//     );
// }
