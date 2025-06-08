import ResetPassword from '@/app/components/login/ResetPassword';
import React, { Suspense } from 'react';

export default function ResetPasswordPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPassword />
            </Suspense>
        </>
    );
}
