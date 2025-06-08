'use server';

import type { PropsWithChildren } from 'react';

import { getCurrentEmployeeRole } from '@/app/utils/database/controller/employees/employees-api';
import React from 'react';
import ProviderNavBar from '@/app/components/provider-portal/nav-bar/provider-nav-bar';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const role = await getCurrentEmployeeRole();

    return (
        <>
            <ProviderNavBar role={role!} />
            <main className='mt-[var(--nav-height)]'>{children}</main>
        </>
    );
}
