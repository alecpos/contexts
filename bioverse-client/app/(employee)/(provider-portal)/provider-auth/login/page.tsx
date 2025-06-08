'use server';

import ProviderPortalLoginCard from '@/app/components/login/PrivilegedLogin';
import React from 'react';

interface Props {
    searchParams: { originalRef: any };
}
export default async function ProviderPortalLogin({ searchParams }: Props) {
    const url = searchParams.originalRef;
    const decodedUrl = decodeURI(url);

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <ProviderPortalLoginCard url={decodedUrl} role="provider" />
            </div>
        </>
    );
}
