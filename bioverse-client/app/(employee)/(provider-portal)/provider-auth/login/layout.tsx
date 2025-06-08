import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<unknown>) {
    return (
        <div
            style={{
                background: 'linear-gradient(#DDEAEE, #FFFFFF)',
                height: '100vh',
            }}
        >
            {children}
        </div>
    );
}
