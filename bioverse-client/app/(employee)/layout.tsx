'use server';

import type { PropsWithChildren } from 'react';
import { getCurrentEmployeeRole } from '../utils/database/controller/employees/employees-api';
import { BV_AUTH_TYPE } from '../types/auth/authorization-types';
import { readUserSession } from '../utils/actions/auth/session-reader';
import dynamic from 'next/dynamic';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const role = await getCurrentEmployeeRole();
    const userId = (await readUserSession()).data.session?.user.id;

    const EmployeeClientLayout = dynamic(() => import('./EmployeeClientLayout'), { ssr: false });

    return (
        <>
            <EmployeeClientLayout userId={userId!} isAdmin={role === BV_AUTH_TYPE.ADMIN} employeeRole={role!}>
                {children}
            </EmployeeClientLayout>
        </>
    );
}
