'use server';
import type { PropsWithChildren } from 'react';
import { getAuthLevel } from '../utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import NavBar from '../components/navigation/components/nav-bar';
import { getCurrentEmployeeRole } from '../utils/database/controller/employees/employees-api';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const authLevel = await getAuthLevel();
    if (authLevel < 3) {
        return redirect('/collections');
    }
    const role = await getCurrentEmployeeRole();

    return (
        <>
            <NavBar className="" role={role} />
            <main className="mt-[var(--nav-height)]">{children}</main>
        </>
    );
}
