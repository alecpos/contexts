'use server';
import { Suspense, type PropsWithChildren } from 'react';
import { Drawer } from '@mui/material';
import {
    getAuthLevel,
    readUserSession,
} from '@/app/utils/actions/auth/session-reader';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const sessionData = (await readUserSession()).data.session;

    // if (!sessionData) {
    //     return redirect('/login?originalRef=%2Fportal%2Faccount-information');
    // }

    const authLevel = await getAuthLevel();

    return (
        <Suspense>
            <div className="min-h-screen bg-white pb-9">
                <div className={` px-4 h-full `}>{children}</div>
            </div>
        </Suspense>
    );
}
