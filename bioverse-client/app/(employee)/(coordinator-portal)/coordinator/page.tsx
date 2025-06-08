'use server';

import CoordinatorDashboardTable from '@/app/components/coordinator-portal/dashboard/coordinator-dashboard';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';

interface CoordinatorPortalPageProps {}

export default async function CoordinatorPortalHomePage({}: CoordinatorPortalPageProps) {
    const isLead = await verifyUserPermission(BV_AUTH_TYPE.LEAD_COORDINATOR);

    return (
        <>
            <div className='flex flex-col justify-center items-center'>
                <CoordinatorDashboardTable
                    isLeadCoordinator={isLead.access_granted}
                />
            </div>
        </>
    );
}
