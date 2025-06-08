'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import RequestConfirmedScreen from '@/app/components/patient-portal/check-up-requested/request-confirmed/request-confirmed-screen';

interface RequestConfirmedPageProps {
    params: {
        variant_index: string;
        product: string;
    };
}

const RequestConfirmedPage = async ({ params }: RequestConfirmedPageProps) => {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession?.session?.user.id;
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    return (
        <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
            <RequestConfirmedScreen />
        </div>
    );
};

export default RequestConfirmedPage;
