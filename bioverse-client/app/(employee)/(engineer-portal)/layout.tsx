'use server';

import EngineerNavBar from '@/app/components/engineer-portal/navbar/engineer-portal-navbar';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const user_id = (await readUserSession()).data.session?.user.id;

    return (
        <>
            <EngineerNavBar user_id={user_id} />
            <main className='mt-[var(--nav-height)]'>{children}</main>
        </>
    );
}
