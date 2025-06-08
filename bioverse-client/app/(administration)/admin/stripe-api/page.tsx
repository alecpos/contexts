import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getAllProductsForPriceAPIWithoutStripeProductId } from './stripe-api-actions';
import StripeProductAPISelectMenu from './_components/selectmenu';

interface Props {}

export default async function PriceApiMainPage({}: Props) {
    const { data: productNameHrefList, error: fetchError } =
        await getAllProductsForPriceAPIWithoutStripeProductId();

    if (fetchError) {
        return (
            <>
                <BioType className='h4'>
                    There was an issue with fetching the data
                </BioType>
                <BioType className='body1'>Please refresh the page</BioType>
            </>
        );
    }

    return (
        <>
            <div className='flex flex-col justify-center items-center m-auto mx-[20vw]'>
                <BioType className='h2'>CREATE STRIPE PRODUCTS</BioType>

                <div className='flex flex-col w-full'>
                    <StripeProductAPISelectMenu
                        productData={productNameHrefList}
                    />
                </div>
            </div>
        </>
    );
}
