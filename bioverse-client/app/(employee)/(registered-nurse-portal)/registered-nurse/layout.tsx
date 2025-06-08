'use server';

import RegisteredNurseNavbar from '@/app/components/registered-nurse-portal/nav-bar/registered-nurse-nav-bar';
import { getCurrentEmployeeRole } from '@/app/utils/database/controller/employees/employees-api';
import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
    const role = await getCurrentEmployeeRole();

    return (
        <>
            <RegisteredNurseNavbar role={role!} />
            <main className="mt-[var(--nav-height)]">{children}</main>
        </>
    );
}
