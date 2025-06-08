'use server';

import RedirectHandler from '@/app/components/navigation/redirect-handler/RedirectHandler';
import RegisteredNurseWelcomeComponent from '@/app/components/registered-nurse-portal/welcome/RegisteredNurseWelcome';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    getCurrentEmployeeRole,
    getEmployeeRecordById,
} from '@/app/utils/database/controller/employees/employees-api';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {}

export default async function RegisteredNurseWelcomePage({}: Props) {
    try {
        // TODO: Test that this works properly with a registered nurse user
        const role_data = await verifyUserPermission(
            BV_AUTH_TYPE.REGISTERED_NURSE,
        );

        const { data: activeSession } = await readUserSession();
        const user_id = activeSession.session?.user.id;

        // TODO: Test registered nurse login
        if (!role_data.access_granted || !user_id) {
            return <RedirectHandler role="registered-nurse" />;
        }

        const employeeData = await getEmployeeRecordById(user_id);

        const employeeName = employeeData.display_name;

        if (!employeeName) {
            console.log('employeeName', employeeName);
            return <RedirectHandler role="registered-nurse" />;
        }

        const role = await getCurrentEmployeeRole();

        return (
            <>
                <div className="flex justify-center items-start">
                    <RegisteredNurseWelcomeComponent
                        name={employeeName as string}
                        role={role ?? BV_AUTH_TYPE.DEFAULT}
                    />
                </div>
            </>
        );
    } catch (error) {
        console.error(error);
        return redirect('/registered-nurse-auth/login');
    }
}
