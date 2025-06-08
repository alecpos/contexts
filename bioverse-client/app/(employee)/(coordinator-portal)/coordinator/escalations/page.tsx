'use server';

import EscalationDashboardContainer from '@/app/components/coordinator-portal/escalation-dashboard/components/escalation-dashboard-container';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';

interface CoordinatorPortalPageProps {}

export default async function CoordinatorEscalationsPage({}: CoordinatorPortalPageProps) {
    return (
        <>
            <div className='flex flex-col justify-center items-center'>
                <EscalationDashboardContainer />
            </div>
        </>
    );
}
