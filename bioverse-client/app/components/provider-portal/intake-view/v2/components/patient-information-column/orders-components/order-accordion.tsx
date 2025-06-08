import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { KeyedMutator } from 'swr';

import { itemList } from '@/app/services/pharmacy-integration/empower/empower-item-list';
import React, { useEffect, useState } from 'react';
import { PRODUCT_NAME_HREF_MAP } from '@/app/types/global/product-enumerator';
import { getPrescriptionSentAudit } from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import parseLastUsedScript from './parse-script';

interface OrdersAccordionRowProps {
    order_data: OrderTabOrder;
}


const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};


export default function OrdersAccordionRow({
    order_data,
}: OrdersAccordionRowProps) {

    const [whatThePatientWasSent, setWhatThePatientWasSent] = useState<string>('');
    const [scriptSentDate, setScriptSentDate] = useState<string>('');


    useEffect(() => {
        const checkOrderDataAudit = async () => {
            const productVariantRecordOrRenewalOrder = await getPriceDataRecordWithVariant(order_data.product_href, order_data.variant_index);
            if (productVariantRecordOrRenewalOrder) {
                setWhatThePatientWasSent(`${capitalizeFirstLetter(productVariantRecordOrRenewalOrder?.cadence)} ${capitalizeFirstLetter(order_data.product_href)} ${productVariantRecordOrRenewalOrder?.dosages}`);
            }
        }

        const checkScriptSentDate = async () => {
            const scriptSentDate = await getPrescriptionSentAudit(order_data.id);
            if (scriptSentDate && scriptSentDate.length > 0) {
                setScriptSentDate(scriptSentDate[scriptSentDate.length - 1].created_at);
            }
        }

        checkOrderDataAudit();
        checkScriptSentDate();
    }, [order_data]);

    
    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };            

    const redirectShipping = (pharmacy: string) => {
        switch (pharmacy) {
            case 'empower':
                const url = `http://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${order_data.tracking_number}`;
                window.open(url, '_blank');
            default:
                return;
        }
    };

    const parseShippingData = () => {
        switch (order_data.assigned_pharmacy) {
            case 'empower':
                return (
                    <>
                        <BioType className='itd-input'>
                            Shipping Status:{' '}
                        </BioType>
                        <BioType className='itd-body'>
                            {order_data.shipping_status}
                        </BioType>

                        <BioType>
                            <span className='itd-input'>Tracking #: </span>
                            <span
                                className='itd-body hover:cursor-pointer underline hover:text-primary'
                                onClick={() => {
                                    redirectShipping('empower');
                                }}
                            >
                                {order_data.tracking_number}
                            </span>
                        </BioType>
                        {order_data.external_tracking_metadata && (
                            <>
                                <BioType className='itd-body'>
                                    <BioType>
                                        <span className='itd-input'>
                                            Empower Order ID (LFID):
                                        </span>{' '}
                                        <span>
                                            {
                                                order_data
                                                    .external_tracking_metadata
                                                    .lfOrderId
                                            }
                                        </span>
                                    </BioType>
                                </BioType>
                                <BioType className='itd-body'>
                                    <BioType>
                                        <span className='itd-input'>
                                            Pharmacy Order Status:
                                        </span>{' '}
                                        <span>
                                            {
                                                order_data
                                                    .external_tracking_metadata
                                                    .orderStatus
                                            }
                                        </span>
                                    </BioType>
                                </BioType>
                            </>
                        )}
                    </>
                );

            default:
                return (
                    <>
                        <BioType>
                            <span className='provider-tabs-subtitle'>Shipping Status: </span>
                            <span className='provider-tabs-subtitle-weak'>
                                {order_data.shipping_status}
                            </span>
                        </BioType>
                        <BioType>
                            <span className='provider-tabs-subtitle'>Tracking #: </span>
                            <span className='provider-tabs-subtitle-weak'>
                                {order_data.tracking_number}
                            </span>
                        </BioType>
                        {/* <>Placeholder default</> */}
                    </>
                );
        }
    };

    return (
        <div className='h-auto overflow-y-auto flex flex-col w-full gap-y-3'>
            {/* <div>
                <div className='w-full'>
                    <p className='provider-tabs-subtitle'>Medication</p>
                    <p className='itd-body'>
                        {order_data
                            ? PRODUCT_NAME_HREF_MAP[order_data.product_href]
                            : 'Unknown'}
                    </p>
                </div>
            </div> */}

            <div className='flex items-center'>
                {/*Approval provider: */}
                <div className='w-full'>
                    <p className='provider-tabs-subtitle-weak'>Approval Provider</p>
                    <p className='provider-tabs-subtitle'>
                        {order_data.provider
                            ? order_data.provider.name
                            : 'Not Tracked'}
                    </p>
                </div>
                {/*Subscription status: */}
                <div className='w-full'>
                    <p className='provider-tabs-subtitle-weak'>Subscription Status</p>
                    <p className='provider-tabs-subtitle'>
                        {order_data.subscription
                            ? order_data.subscription.status
                            : '-'}
                    </p>
                </div>
            </div>

            {/*PHARMACY / SCRIPT INFO:*/}
            {order_data.subscription?.last_used_script && (
                <div>
                    <p className='provider-tabs-subtitle-weak'>Pharmacy/Script Information</p>
                    {whatThePatientWasSent && (
                        <BioType className='provider-tabs-subtitle'>
                            • {whatThePatientWasSent}
                        </BioType>
                    )}
                    {scriptSentDate ? (
                        <BioType className='provider-tabs-subtitle'>
                            • Script sent on:  {' '}
                            <span className='provider-tabs-subtitle text-green-600'>{convertTimestamp(scriptSentDate)}</span>
                        </BioType>
                    ) : (
                        <BioType className='provider-tabs-subtitle'>
                            • Script sent on: {' '}
                            <span className='provider-tabs-subtitle-weak'>not tracked - check tracking numbers and orders table for this patient</span>
                        </BioType>
                    )}
                    <BioType className='provider-tabs-subtitle'>
                        • Pharmacy name: {' '}
                            <span className='provider-tabs-subtitle-weak '>
                                {capitalizeFirstLetter(order_data.assigned_pharmacy) }
                            </span>
                    </BioType>
                    <div className=''>
                        {parseLastUsedScript(
                            order_data.pharmacy_script,
                            order_data.assigned_pharmacy,
                            order_data
                        )}
                    </div>
                </div>
            )}

            {/*SHIPPING INFORMATION*/}
            <div>
                <p className='provider-tabs-subtitle-weak'>Shipping Information</p>
                <ul className=' ml-2'>
                    <div className=' provider-tabs-subtitle'>
                        <p>
                        • Shipping Statuses:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {order_data.shipping_status}
                            </span>
                        </p>
                    </div>
                    <div className='list-disc provider-tabs-subtitle'>
                        <p>
                        • Tracking #:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {order_data.tracking_number}
                            </span>
                        </p>
                    </div>
                    <div className='list-disc provider-tabs-subtitle'>
                        {order_data.assigned_pharmacy === 'empower' && (
                            <p>
                                 • Empower Order ID (LFID):{' '}
                                <span className='provider-tabs-subtitle-weak'>
                                    {
                                        order_data?.external_tracking_metadata
                                            ?.lfOrderId
                                    }
                                </span>
                            </p>
                        )}
                    </div>
                    <div className='list-disc provider-tabs-subtitle'>
                        <p>
                        • Discount applied?{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {order_data?.discount_id?.length > 0
                                    ? 'True'
                                    : 'False'}
                            </span>
                        </p>
                    </div>
                </ul>
            </div>
        </div>
    );
}
