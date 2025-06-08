'use client';
import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const FacebookPixelEvents: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init('766845491697432'); //don't forget to change this
            });
    }, [pathname, searchParams]);

    return null;
};
