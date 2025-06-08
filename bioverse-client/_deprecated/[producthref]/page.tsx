'use server';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    params: {
        producthref: any;
    };
}

export default async function ProductPriceModificationPage({ params }: Props) {
    const { name: nameData, error: error } = await getNameDataPriceAPI(
        params.producthref
    );
    const { data: individualProductPriceData, error: possibleError } =
        await getIndividualProductInfoForApi(params.producthref);

    if (error) {
        console.log('api product href', possibleError);
        return <>Error in getting product name</>;
    }

    console.log(
        'individualProductPriceData page.tsx',
        individualProductPriceData
    );

    return (
        <>
            <div className='flex flex-col justify-center items-center w-full mb-10 mt-[100px]'>
                <div className='flex justify-start items-start w-[950px]'>
                    <GoBackButton></GoBackButton>
                </div>
                <BioType className='h2'>
                    Editing Images for: {params.producthref}
                </BioType>

                <div className='flex flex-row gap-10'>
                    <div className='flex w-full'></div>
                </div>
            </div>
        </>
    );
}
