'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import ProviderOrderTable from '@/app/components/provider-portal/order-table/components/provider-dashboard-table';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getProviderList } from '@/app/utils/database/controller/providers/providers-api';

export default async function ProviderPortal() {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession.session?.user.id;

    const permission_result = await verifyUserPermission(
        BV_AUTH_TYPE.LEAD_PROVIDER
    );

    const provider_list = await getProviderList();

    return (
        <div
            className='min-h-screen w-full'
            style={{
                background:
                    'linear-gradient(180deg, rgba(178, 232, 255, 0.20) 0%, rgba(178, 232, 255, 0.00) 100%), #FFF',
            }}
        >
            <div className='flex flex-row justify-center min-h-[100vh]'>
                <div className='flex flex-col gap-6 mb-[150px] min-w-[75vw] max-w-[95vw]'>
                    <ProviderOrderTable
                        userId={user_id!}
                        isPortalAdmin={true}
                        isLeadProviderOrHigher={
                            permission_result.access_granted
                        }
                        provider_list={provider_list ?? []}
                    />
                    {/* <ProviderOrderTableNewOrders processedOrders={generalOrders} /> */}
                </div>
            </div>
        </div>
    );
}
