'use server';
import { Suspense, type PropsWithChildren } from 'react';
import { readUserSession } from '../utils/actions/auth/session-reader';
// import { getActionItems } from '../utils/actions/action-items/action-items-actions';
import PatientPortalNavBar from '../components/patient-portal/nav-bar/patient-nav-bar';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const sessionData = (await readUserSession()).data.session;
    return (
        <Suspense>
            <div className='bg-[#F9F9F9] min-h-screen flex flex-col flex-grow'>
                <PatientPortalNavBar loggedIn={sessionData ? true : false} />
                <main
                    className={`mt-[var(--nav-height-mobile)] md:mt-[var(--nav-height)] flex flex-col`}
                >
                    {children}
                </main>
            </div>
        </Suspense>
    );
}
