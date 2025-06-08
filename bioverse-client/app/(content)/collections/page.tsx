import type { Metadata } from 'next';
import CollectionClientContent from '@/app/components/collections/pageContents/collection-client-content';
import { getActiveCollectionsData } from '@/app/utils/database/controller/products/products';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

export const metadata: Metadata = {
    title: 'Bioverse: Collections',
    description: 'Catalog of products',
};

interface PageProps {
    searchParams: {
        tpf: any;
        fpf: any;
    };
}

export default async function Page({ searchParams }: PageProps) {
    const prefilterObject: CollectionsFilterSearchParams = {
        typePrefilter: searchParams.tpf,
        focusPrefilter: searchParams.fpf,
    };

    return (
        <div className='w-full justify-center flex mb-[4.44vw]'>
            <CollectionClientContent prefilter={prefilterObject} />
        </div>
    );
}
