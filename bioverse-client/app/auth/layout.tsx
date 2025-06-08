'use server';
import type { PropsWithChildren } from 'react';
import NavBar from '../components/navigation/components/nav-bar';
import { getCurrentEmployeeRole } from '../utils/database/controller/employees/employees-api';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const role = await getCurrentEmployeeRole();

    return (
        <>
            {/* <NavBar className='' hideLinks={true} role={role} /> */}
            <main className='mt-[var(--nav-height)] overflow-y-auto w-full'>
                {children}
            </main>
        </>
    );
}
