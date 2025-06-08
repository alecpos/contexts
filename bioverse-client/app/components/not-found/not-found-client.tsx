'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import BioType from '../global-components/bioverse-typography/bio-type/bio-type';

interface NotFoundProps {
    referer: string | null;
}

export default function NotFoundComponent({ referer }: NotFoundProps) {
    const router = useRouter();

    // useEffect(() => {
    //     const timeoutId = setTimeout(async () => {
    //         await auditNotFoundToSupabase(referer ?? 'path-not-found');
    //     }, 2000);

    //     // Cleanup function to clear the timeout if the component unmounts
    //     return () => clearTimeout(timeoutId);
    // }, [referer]);

    return (
        <div className='flex flex-col justify-center items-center mt-[150px] gap-4'>
            <BioType className='h5 text-center'>
                Sorry, we couldn&apos;t find the page you were looking for...
            </BioType>
            <div className='flex flex-row gap-4'>
                <Button
                    variant='outlined'
                    onClick={() => {
                        router.back();
                    }}
                >
                    Go back
                </Button>
            </div>
        </div>
    );
}
