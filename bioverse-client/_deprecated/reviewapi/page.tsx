// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import PriceApiSelectMenu from '../priceapi/_components/selectMenu';
// import { getAllProductsForPriceAPI } from '../priceapi/price-api-actions';
// import ReviewApiSelectMenu from './_components/selectMenu';

// interface Props {}

// export default async function ReviewApiMainPage({}: Props) {
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
//                 <BioType className='h2'>PDP Review API</BioType>

//                 <div className='flex flex-col w-full'>
//                     <ReviewApiSelectMenu productData={productNameHrefList} />
//                 </div>
//             </div>
//         </>
//     );
// }
