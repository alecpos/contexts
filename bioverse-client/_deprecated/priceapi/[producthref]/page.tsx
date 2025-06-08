// 'use server';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import {
//     getIndividualProductInfoForApi,
//     getNameDataPriceAPI,
// } from '../price-api-actions';
// import PriceAPIMainContainer from '../_components/priceEditAPI/main-container';
// import GoBackButton from '../_components/goBackButton';

// interface Props {
//     params: {
//         producthref: any;
//     };
// }

// export default async function ProductPriceModificationPage({ params }: Props) {
//     const { name: nameData, error: error } = await getNameDataPriceAPI(
//         params.producthref
//     );
//     const { data: individualProductPriceData, error: possibleError } =
//         await getIndividualProductInfoForApi(params.producthref);

//     if (error) {
//         console.log('api product href', possibleError);
//         return <>Error in getting product name</>;
//     }

//     console.log(
//         'individualProductPriceData page.tsx',
//         individualProductPriceData
//     );

//     return (
//         <>
//             <div className='flex flex-col justify-center items-center w-full mb-10 mt-[100px]'>
//                 <div className='flex justify-start items-start w-[950px]'>
//                     <GoBackButton></GoBackButton>
//                 </div>
//                 <BioType className='h2'>Editing: {params.producthref}</BioType>

//                 <div className='flex flex-row gap-10'>
//                     <div className='flex w-full'>
//                         <PriceAPIMainContainer
//                             nameData={nameData!.name}
//                             priceData={individualProductPriceData}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
