'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface LoadingScreenProps {
    style?: React.CSSProperties;
    size?: number;
    timeout?: number;
    reloadRoute?: string;
    fallback?: React.ReactNode;
}

export default function LoadingScreen({
    style,
    size = 150,
    timeout = 6000,
    reloadRoute = '/intake/prescriptions/',
    fallback,
}: LoadingScreenProps) {
    const pathname = usePathname();

    const handleReload = useCallback(() => {
        if (pathname.startsWith(reloadRoute)) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [pathname, timeout, reloadRoute]);

    useEffect(() => {
        return handleReload();
    }, [handleReload]);

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <div
            className='flex flex-row justify-center w-full items-center md:mt-10 gap-4'
            style={style}
        >
            <Image
                src='/img/loading-animation/loading-animation.gif'
                alt='Loading...'
                width={size}
                height={size}
                priority
                unoptimized
                className='animate-pulse'
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
            />
        </div>
    );
}
