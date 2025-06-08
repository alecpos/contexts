'use server';

import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';

import { getLatestRenewalOrderForSubscription } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { redirect } from 'next/navigation';
import { getURL } from '@/app/utils/functions/utils';
import { verifyUserIntakePermission } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/verify-intake-view-permission';
import { USStates } from '@/app/types/enums/master-enums';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getUserState } from '@/app/utils/database/controller/profiles/profiles';
import ProviderReviewContainer from '@/app/components/provider-portal/provider-patient-review/review-container/provider-review-container';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';

interface Props {
    params: {
        orderId: string;
    };
    searchParams: {
        skip: string;
    };
}

export default async function ProviderIntakeViewPage({
    params,
    searchParams,
}: Props) {
    const { data: activeSession } = await readUserSession();

    const providerId = activeSession?.session?.user.id;

    const { type: orderType, data: orderData } = await fetchOrderData(
        params.orderId
    );

    const { state, error } = await getUserState(orderData.customer_uid);

    let permission;
    let access_data = await verifyUserIntakePermission(
        (orderData.state as USStates) ?? (state as USStates)
    );
    permission = access_data.access;

    const employeeAuthorization = await getEmployeeAuthorization(
        providerId ?? ''
    );

    if (providerId === '24138d35-e26f-4113-bcd9-7f275c4f9a47') {
        permission = true;
    }

    if (permission === false) {
        return (
            <div className='flex flex-col justify-center p-8'>
                <BioType className='itd-subtitle'>No Permission</BioType>
                <BioType className='itd-body'>
                    Reason: {access_data.reason}
                </BioType>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-[90vh] max-h-[calc(100vh - var(--nav-height))] overflow-x-hidden'>
            <ProviderReviewContainer
                source={'dashboard'}
                userId={providerId!}
                orderId={
                    orderData.renewal_order_id
                        ? orderData.renewal_order_id
                        : orderData.id
                }
                employeeAuthorization={employeeAuthorization}
            />
        </div>
    );
}
