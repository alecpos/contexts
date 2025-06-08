'use server';

import PrivilegedPortalLoginCard from '@/app/components/login/PrivilegedLogin';
import React from 'react';

interface Props {
    searchParams: { originalRef: any };
}
export default async function RegisteredNursePortalLogin({
    searchParams,
}: Props) {
    const url = searchParams.originalRef;
    const decodedUrl = decodeURI(url);

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <PrivilegedPortalLoginCard
                    url={decodedUrl}
                    role="registered-nurse"
                />
            </div>
        </>
    );
}
