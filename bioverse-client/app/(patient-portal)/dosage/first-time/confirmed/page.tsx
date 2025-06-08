'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import FirstTimeRequestConfirmedScreen from '@/app/components/patient-portal/dosage-selection-first-time/FirstTimeRequestConfirmed';

interface RequestConfirmedPageProps {
    params: {
        variant_index: string;
        product: string;
    };
}

const FirstTimeRequestConfirmedPage = async ({
    params,
}: RequestConfirmedPageProps) => {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession?.session?.user.id;
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    return (
        <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
            <FirstTimeRequestConfirmedScreen />
        </div>
    );
};

export default FirstTimeRequestConfirmedPage;
