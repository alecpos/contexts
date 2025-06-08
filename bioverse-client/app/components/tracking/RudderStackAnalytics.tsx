'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RudderStackAnalytics() {
    const pathname = usePathname(); // Get the current pathname
    useEffect(() => {
        if (window.rudderanalytics) {

            if (
                pathname.includes('/coordinator') || 
                pathname.includes('/provider') || 
                pathname.includes('/portal')
            ) {
                //don't sent page load events for these routes. 
                return;
            }
            
            window.rudderanalytics.page(); // Call rudderanalytics.page() on route change
        }
    }, [pathname]); // Trigger the effect when the pathname changes
    return null;
}
