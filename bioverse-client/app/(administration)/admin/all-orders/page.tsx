'use server';

import AllOrdersPageContainer from '@/app/components/admin/all-orders/page-container';
import AllPatientsPageContainer from '@/app/components/provider-coordinator-shared/all-patients/components/page-container';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { redirect } from 'next/navigation';

interface Props {}

export default async function AllOrdersPage({}: Props) {
    const role_data = await verifyUserPermission(BV_AUTH_TYPE.PROVIDER);

    if (!role_data.access_granted) {
        return redirect('/');
    }

    const determineRole = () => {
        switch (role_data.role) {
            case 'coordinator':
                return BV_AUTH_TYPE.COORDINATOR;
            case 'lead-coordinator':
                return BV_AUTH_TYPE.LEAD_COORDINATOR;
            case 'provider':
                return BV_AUTH_TYPE.PROVIDER;
            case 'developer':
                return BV_AUTH_TYPE.DEVELOPER;
            case 'admin':
                return BV_AUTH_TYPE.ADMIN;
            default:
                return null;
        }
    };

    return (
        <>
            <div className='flex justify-center items-start py-10 px-10'>
                <AllOrdersPageContainer access_type={determineRole()} />
            </div>
        </>
    );
}
