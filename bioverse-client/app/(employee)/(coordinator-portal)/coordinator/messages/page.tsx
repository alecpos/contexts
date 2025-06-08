'use server';

import CoordinatorMessageDashboard from '@/app/components/coordinator-portal/message-dashboard/message-dashboard';

interface CoordinatorPortalPageProps {}

export default async function CoordinatorMessagePage({}: CoordinatorPortalPageProps) {
    return (
        <>
            <div className='flex flex-col justify-center items-center'>
                <CoordinatorMessageDashboard />
            </div>
        </>
    );
}
