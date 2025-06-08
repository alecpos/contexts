'use server';

import type { PropsWithChildren } from 'react';

import CoordinatorNavBar from '../../components/coordinator-portal/navbar/coordinator-portal-navbar';
import { getCurrentEmployeeRole } from '../../utils/database/controller/employees/employees-api';
import { BV_AUTH_TYPE } from '../../types/auth/authorization-types';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const role = await getCurrentEmployeeRole();

    return (
        <>
            <CoordinatorNavBar user_role={role ?? BV_AUTH_TYPE.DEFAULT} />
            <main className='mt-[var(--nav-height)]'>{children}</main>
        </>
    );
}
