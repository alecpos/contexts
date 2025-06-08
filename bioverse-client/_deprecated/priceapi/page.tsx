// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { getAllProductsForPriceAPI } from './price-api-actions';
// import PriceApiSelectMenu from './_components/selectMenu';

// interface Props {}

// export default async function PriceApiMainPage({}: Props) {
//     const { data: productNameHrefList, error: fetchError } =
//         await getAllProductsForPriceAPI();

//     if (fetchError) {
//         return (
//             <>
//                 <BioType className='h4'>
//                     There was an issue with fetching the data
//                 </BioType>
//                 <BioType className='body1'>
//                     Please refresh the page or contact Nathan:
//                 </BioType>
//             </>
//         );
//     }

//     return (
//         <>
//             <div className='flex flex-col justify-center items-center m-auto mx-[20vw]'>
//                 <BioType className='h2'>Product Pricing API</BioType>

//                 <div className='flex flex-col w-full'>
//                     <PriceApiSelectMenu productData={productNameHrefList} />
//                 </div>
//             </div>
//         </>
//     );
// }
