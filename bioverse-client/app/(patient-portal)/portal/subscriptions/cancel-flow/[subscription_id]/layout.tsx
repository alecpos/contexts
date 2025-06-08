'use server';
import { Suspense, type PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    // if (!sessionData) {
    //     return redirect('/login?originalRef=%2Fportal%2Faccount-information');
    // }

    return (
        <Suspense>
            <div className="min-h-screen bg-[#F9F9F9]">
                <div className={`md:mt-[var(--nav-height)] h-full `}>
                    <div className={`px-4 h-full mt-9 md:mt-[160px]`}>
                        {children}
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
