import { getPatientOrderTabData } from '@/app/utils/database/controller/orders/orders-api';
import { getRenewalOrdersForTab } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import OrdersAccordionRow from './orders-components/order-accordion';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Tooltip } from '@mui/material';
import { RenewalOrderTabs } from '@/app/types/renewal-orders/renewal-orders-types';
import RenewalOrderAccordionRow from './orders-components/renewal-order-accordion';
import { useEffect } from 'react';
import { getPrescriptionSentAudit } from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';

interface OrderContentProps {
    patient_id: string;
    isOpenOrders: boolean;
}
export default function OrderAccordionContent({
    patient_id,
    isOpenOrders,
}: OrderContentProps) {
    const params = useParams();
    const orderId = params.orderId as string;

    const { data, isLoading } = useSWR(
        isOpenOrders ? `orders-${patient_id}` : null,
        () => getPatientOrderTabData(patient_id)
    );

    const { data: renewalOrders, isLoading: renewalOrdersLoading } = useSWR(
        isOpenOrders ? `renewal-orders-${patient_id}` : null,
        () => getRenewalOrdersForTab(patient_id)
    );

    const orderArr = data?.data as OrderTabOrder[];
    const renewalArr = renewalOrders as RenewalOrderTabs[];

    //sort renewalArr by created_at
    if (renewalArr) {
        renewalArr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (isLoading || renewalOrdersLoading) {
        return <LoadingScreen />;
    }

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div className='h-auto overflow-y-auto flex flex-col w-full'>
            {renewalArr?.map((dataRow, index) => {
                if (String(dataRow.renewal_order_id) !== orderId) {
                    return (
                        <Accordion disableGutters key={index} style={{boxShadow: 'none'}}>
                            <AccordionSummary
                                sx={[
                                    {
                                        backgroundColor:
                                            'rgba(40, 107, 162, 0.12)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    },
                                    {
                                        '&hover:': {
                                            backgroundColor:
                                                'rgba(40, 107, 162, 1)',
                                        },
                                    },
                                ]}
                            >
                                <div className='w-full flex flex-row gap-5'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='provider-tabs-subtitle-weak'>Order ID</p>
                                        <p className='provider-tabs-subtitle'>
                                            {dataRow.renewal_order_id}
                                        </p>
                                    </div>
                                    {dataRow.autoshipped && 
                                      !dataRow.dosage_selection_completed &&
                                        (<div className='bg-gradient-to-r from-cyan-100 to-green-100 text-white px-2 py-1 rounded-md border-solid border-2 border-cyan-500 w-[130px] flex flex-col justify-center items-center'>
                                            <Tooltip title="Patient did not complete their dosage selection form, so we automatically sent them a monthly vial.">
                                                <span className='body1bold'>
                                                    ✅ Autoshipped 
                                                </span>
                                            </Tooltip>
                                        </div>)
                                    }
                                </div>
                                
                                <div className='w-full'>
                                    <p className='provider-tabs-subtitle-weak'>Approval Date</p>
                                    <p className='provider-tabs-subtitle'>
                                        {convertTimestamp(
                                            dataRow.approval_denial_timestamp
                                        ) ?? 'not tracked'}
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <RenewalOrderAccordionRow
                                    renewalOrder={dataRow}
                                />
                            </AccordionDetails>
                        </Accordion>
                    );
                }

                return null;
            })}

            {orderArr?.map((dataRow, index) => {
                if (String(dataRow.id) !== orderId) {
                    return (
                        <Accordion disableGutters key={index} style={{boxShadow: 'none'}}>
                            <AccordionSummary
                                sx={[
                                    {
                                        backgroundColor:
                                            'rgba(40, 107, 162, 0.12)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    },
                                    {
                                        '&hover:': {
                                            backgroundColor:
                                                'rgba(40, 107, 162, 1)',
                                        },
                                    },
                                ]}
                            >
                                <div className='w-full'>
                                    <p className='provider-tabs-subtitle-weak'>Order ID</p>
                                    <p className='provider-tabs-subtitle'>{dataRow.id}</p>
                                </div>
                                <div className='w-full'>
                                    <p className='provider-tabs-subtitle-weak'>Approval Date</p>
                                    <p className='provider-tabs-subtitle'>
                                        {convertTimestamp(
                                            dataRow.approval_denial_timestamp
                                        ) ?? 'not tracked'}
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <OrdersAccordionRow order_data={dataRow} />
                            </AccordionDetails>
                        </Accordion>
                    );
                }
                return null;
            })}


        </div>
    );
}
