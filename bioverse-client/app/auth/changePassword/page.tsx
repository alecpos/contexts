'use server';
import ChangePassword from '@/app/components/login/ChangePassword';
import React, { Suspense } from 'react';

interface PageProps {
    params: {
        code: string;
    };
}

export default async function ChangePasswordPage({ params }: PageProps) {
    // await logUserInWithCode(params.code);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ChangePassword code={params.code} />
            </Suspense>
        </>
    );
}
