import CheckEmail from '@/app/components/login/CheckEmail';
import React, { Suspense } from 'react';

export default function CheckEmailPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <CheckEmail />
            </Suspense>
        </>
    );
}
