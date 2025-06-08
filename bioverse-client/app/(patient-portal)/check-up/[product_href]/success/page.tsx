'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import CheckupSuccess from '@/app/components/patient-portal/check-up/success/CheckupSuccess';

interface CheckupSuccessPageProps {
    params: {
        product_href: string;
    };
}

const CheckupSuccessPage = async ({ params }: CheckupSuccessPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    return (
        <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen md:max-w-[490px]'>
            <CheckupSuccess questionnaireName={params.product_href} />
        </div>
    );
};

export default CheckupSuccessPage;
