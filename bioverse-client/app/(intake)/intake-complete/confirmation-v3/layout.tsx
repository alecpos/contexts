import Script from 'next/script';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<unknown>) {
    return (
        <>
        
            <main>
                <div className=""></div>
                {children}
            </main>
        </>
    );
}
