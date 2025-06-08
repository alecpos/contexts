'use server';

import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

export default async function LoadingScreenPage() {
    return (
        <div style={{
            height: "calc(100vh - var(--nav-height))",
            display: "flex",
            alignItems: "center"
        }}>
            <LoadingScreen />
        </div>
    );
}
