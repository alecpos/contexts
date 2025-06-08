import type { Metadata } from 'next';
import CollectionClientContent from '@/app/components/collections/pageContents/collection-client-content';

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
