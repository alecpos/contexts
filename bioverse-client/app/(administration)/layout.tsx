'use server';
import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import DarkFooter from '../components/footer/darkFooter';
import NavBar from '../components/navigation/components/nav-bar';
import { getCurrentEmployeeRole } from '../utils/database/controller/employees/employees-api';
import { BV_AUTH_TYPE } from '../types/auth/authorization-types';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const role = await getCurrentEmployeeRole();

    if (role !== BV_AUTH_TYPE.ADMIN) {
        return redirect('/');
    }

    return (
        <>
            <NavBar className='' role={role} />
            <main className='mt-[var(--nav-height)] overflow-y-auto w-full'>
                {children}
            </main>

            <div className=''>
                <DarkFooter />
            </div>
        </>
    );
}
