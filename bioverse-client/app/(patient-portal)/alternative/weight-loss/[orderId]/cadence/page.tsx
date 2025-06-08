'use server';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import AltCadenceSelectionComponent from '@/app/components/patient-portal/alternative-selection/weight-loss/cadence-selection/alt-cadence-selection';
import { VERIFY_ORDER_DATA_CODES } from '@/app/types/alternatives/weight-loss/alternative-weight-loss-types';
import { Status } from '@/app/types/global/global-enumerators';
import { verifyAlternativeRequiredOrderData } from '@/app/utils/actions/alternatives/weight-loss/alternative-weight-loss-actions';

interface PageProps {
    params: {
        orderId: string;
    };
}

export default async function SelectAlternativeCadencePage({
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
                        <BioType className='it-subtitle md:itd-subtitle'>
                            There was an issue with getting the details of the
                            order. Please give us a message through our patient
                            portal.
                        </BioType>
                    </div>
                );
        }
    }

    if (!data.order_data?.metadata?.selected_alternative_product) {
        return (
            <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                <BioType className='it-subtitle md:itd-subtitle'>
                    There was an issue with getting the details of the order.
                    Please go back and select a product once more.
                </BioType>
            </div>
        );
    }
    return (
        <>
            <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
                <AltCadenceSelectionComponent order_data={data.order_data} />
            </div>
        </>
    );
}
