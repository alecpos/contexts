import RouteMiddleLayer from '@/app/components/intake-v2/middlelayer/route-middle-layer';
import React, { Suspense } from 'react';

export default function MiddleLayerPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <RouteMiddleLayer />
            </Suspense>
        </>
    );
}
