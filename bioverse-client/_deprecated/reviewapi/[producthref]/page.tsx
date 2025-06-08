'use server';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { getReviewDataForProductUsingHref } from '../util/reviewapi-supabase';
import ReviewPIMainContainer from '../_components/main-container';

interface Props {
    params: {
        producthref: any;
    };
}

export default async function PDPReviewModificationPage({ params }: Props) {
    //i got lazy
    const supabase = createSupabaseServerComponentClient();
    const { data: nameData, error: error } = await supabase
        .from('products')
        .select('name')
        .eq('href', params.producthref)
        .single();

    if (error) {
        return <>Error in getting product</>;
    }

    const { data: individualProductPriceData, error: possibleError } =
        await getReviewDataForProductUsingHref(params.producthref);

    if (possibleError) {
        return (
            <>There was an error with the API, please refresh or try again</>
        );
    }

    return (
        <>
            <div className='flex flex-col justify-center items-center mx-[20vw] mb-10 mt-[100px]'>
                <BioType className='h2'>Editing: {params.producthref}</BioType>

                <ReviewPIMainContainer
                    reviewData={individualProductPriceData}
                    href={params.producthref}
                />
            </div>
        </>
    );
}
