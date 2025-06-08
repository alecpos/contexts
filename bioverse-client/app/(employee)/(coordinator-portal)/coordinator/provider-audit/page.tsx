'use server';
import ProviderAuditMainContainer from '@/app/components/coordinator-portal/provider-audit/containers/provider-audit-main-container';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';

import { redirect } from 'next/navigation';

interface PageProps {}

export default async function ProviderAuditPage({}: PageProps) {
    const allowed = (await verifyUserPermission(BV_AUTH_TYPE.LEAD_COORDINATOR))
        .access_granted;
    if (!allowed) {
        return redirect('/coordinator');
    }

    return (
        <div className='flex h-screen'>
            <ProviderAuditMainContainer />
        </div>
    );
}
