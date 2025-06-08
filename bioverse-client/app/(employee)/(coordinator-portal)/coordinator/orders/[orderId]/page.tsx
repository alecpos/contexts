'use server';

import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
import { OrderType } from '@/app/types/orders/order-types';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import CoordinatorOrderViewContainer from '@/app/components/coordinator-portal/orderID-TaskView/order-id-container';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface Props {
    params: {
        orderId: string;
    };
}

export default async function CoordinatorIntakeViewPage({ params }: Props) {
    const { type: orderType, data: orderData } = await fetchOrderData(
        params.orderId
    );

    const { data: activeSession } = await readUserSession();
    const userId = activeSession?.session?.user.id;

    const patient_id =
        orderType === OrderType.Order
            ? orderData.customer_uid
            : orderData.customer_uuid;
    // TODO: If renewal order, fetch the original order's intake answers

    const { data: patientData, error: patientDataError } =
        await getPatientInformationById(patient_id);

    if (patientDataError || !patientData) {
        return (
            <>
                <div>
                    <BioType>
                        There was an error with fetching this order. Please try
                        again later.
                    </BioType>
                    <BioType>Error Message: {patientDataError.message}</BioType>
                </div>
            </>
        );
    }

    const permission_data = await verifyUserPermission(
        BV_AUTH_TYPE.LEAD_COORDINATOR
    );

    return (
        <div className='flex flex-col max-h-screen'>
            <CoordinatorOrderViewContainer
                orderId={params.orderId}
                patient_data={patientData}
                order_data={orderData}
                isLead={permission_data.access_granted}
                userId={userId!}
            />
        </div>
    );
}
