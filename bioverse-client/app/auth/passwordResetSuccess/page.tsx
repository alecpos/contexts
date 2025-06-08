import PasswordResetSuccess from '@/app/components/login/PasswordResetSuccess';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import React, { Suspense } from 'react';

export default async function PasswordResetSuccessPage() {
    const sessionData = (await readUserSession()).data.session;
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <PasswordResetSuccess sessionData={sessionData} />
            </Suspense>
        </>
    );
}
