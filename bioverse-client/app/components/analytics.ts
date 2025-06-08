'use client';

import { AnalyticsBrowser } from '@customerio/cdp-analytics-browser';

export const analytics = AnalyticsBrowser.load({
    writeKey: process.env.NEXT_PUBLIC_CUSTOMERIO_KEY ?? '',
});

export default function Analytics() {
    return null;
}
