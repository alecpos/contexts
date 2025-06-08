'use server';
import type { PropsWithChildren } from 'react'; // Make sure to import ReactLenis
import DarkFooter from '../components/footer/darkFooter';

import NavBar from '../components/navigation/components/nav-bar';
import { getCurrentEmployeeRole } from '../utils/database/controller/employees/employees-api';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const role = await getCurrentEmployeeRole();

    return (
        <div className="">
            <div>{/**  */}</div>
            <NavBar className="" role={role} />
            <main className="mt-[var(--nav-height)] overflow-y-auto w-full min-h-[60vh]">
                {children}
            </main>

            <div className="mt-auto">
                <DarkFooter />
            </div>
        </div>
    );
}
