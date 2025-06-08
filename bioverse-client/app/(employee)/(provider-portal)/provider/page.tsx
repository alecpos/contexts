'use server';

import RedirectHandler from '@/app/components/navigation/redirect-handler/RedirectHandler';
import ProviderAnnouncements from '@/app/components/provider-portal/welcome/ProviderAnnouncements';
import ProviderWelcomeComponent from '@/app/components/provider-portal/welcome/ProviderWelcome';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    getCurrentEmployeeRole,
    getEmployeeRecordById,
} from '@/app/utils/database/controller/employees/employees-api';
import { UUID } from 'crypto';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {}

export default async function ProviderWelcomePage({}: Props) {
    try {
        const role_data = await verifyUserPermission(BV_AUTH_TYPE.PROVIDER);

        const { data: activeSession } = await readUserSession();
        const user_id = activeSession.session?.user.id;

        if (!role_data.access_granted || !user_id) {
            return <RedirectHandler role='provider' />;
        }

        const employeeData = await getEmployeeRecordById(user_id);

        const employeeName = employeeData.display_name;

        if (!employeeName) {
            return <RedirectHandler role='provider' />;
        }

        const role = await getCurrentEmployeeRole();

        return (
            <>
                <div className='flex justify-center items-start'>
                    <ProviderAnnouncements
                        providerId={user_id as UUID}
                        role={role ?? BV_AUTH_TYPE.DEFAULT}
                    />
                    <ProviderWelcomeComponent
                        name={employeeName as string}
                        user_id={user_id}
                    />
                </div>
            </>
        );
    } catch (error) {
        console.error(error);
        return redirect('/provider-auth/login');
    }
}
