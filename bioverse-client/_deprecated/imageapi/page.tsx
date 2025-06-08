// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { getAllProductsForPriceAPI } from '../priceapi/price-api-actions';
// import ImageApiSelectMenu from './_components/imageSelectMenu';

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
//                     Please refresh the page or contact Engineering
//                 </BioType>
//             </>
//         );
//     }

//     return (
//         <>
//             <div className='flex flex-col justify-center items-center m-auto mx-[20vw]'>
//                 <BioType className='h2'>Bioverse Change Image API</BioType>

//                 <div className='flex flex-col w-full'>
//                     <ImageApiSelectMenu productData={productNameHrefList} />
//                 </div>
//             </div>
//         </>
//     );
// }
