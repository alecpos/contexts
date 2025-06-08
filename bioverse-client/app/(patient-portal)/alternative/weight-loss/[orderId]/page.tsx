'use server';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import AltOptionSelectionComponent from '@/app/components/patient-portal/alternative-selection/weight-loss/option-selection/alt-option-selection';
import { VERIFY_ORDER_DATA_CODES } from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { Status } from '@/app/types/global/global-enumerators';
import { verifyAlternativeRequiredOrderData } from '@/app/utils/actions/alternatives/weight-loss/alternative-weight-loss-actions';

interface PageProps {
    params: {
        orderId: string;
    };
}

export default async function alternativeWeightLossSelectionPage({
    params,
}: PageProps) {
    const orderId = params.orderId;
    const { status, data } = await verifyAlternativeRequiredOrderData(orderId);

    if (status != Status.Success || !data?.order_data) {
        switch (data.code) {
            case VERIFY_ORDER_DATA_CODES.NO_ORDER:
                return (
                    <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                        <BioType className='it-subtitle md:itd-subtitle'>
                            There was no order found.
                        </BioType>
                    </div>
                );
            case VERIFY_ORDER_DATA_CODES.NOT_ELIGIBLE:
                return (
                    <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                        <BioType className='it-subtitle md:itd-subtitle mt-16 p-4'>
                            There was an issue with getting the details of the
                            order. Please give us a message through our patient
                            portal.
                        </BioType>
                    </div>
                );
        }
    }

    return (
        <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
            <AltOptionSelectionComponent order_data={data.order_data!} />
        </div>
    );
}
