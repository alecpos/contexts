import { itemList } from '@/app/services/pharmacy-integration/empower/empower-item-list';
import {
    RenewalOrderStatus,
    RenewalOrderTabs,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { getPrescriptionSentAudit } from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import { Fragment, useState, useEffect } from 'react';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { isEmpty } from 'lodash';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React from 'react';
import parseLastUsedScript from './parse-script';


interface RenewalOrderAccordionRowProps {
    renewalOrder: RenewalOrderTabs;
}

const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * 
 * This uses the assigned_pharmacy and the prescription_json columns of the renewal order to display the sigs and the details of the vial (concentration)
 * HOWEVER, it uses the product_href and variant_index to display what offer the patient ordered using the product_variants table (the dosages)
 * THIS should not be a problem as the dosages will be the same for the same offer, even if the pharmacy is different.
 * 
 * If the if the assigned pharmacy in the renewal order differs from the pharmacy that got the script, then the script will be formatted differently and the error gets displayed:
 * "Could not parse [pharmacy] script. Was the script resent to a different pharmacy?"
 * 
 */
export default function RenewalOrderAccordionRow({
    renewalOrder,
}: RenewalOrderAccordionRowProps) {

    const [whatThePatientWasSent, setWhatThePatientWasSent] = useState<string>('');
    const [scriptSentDate, setScriptSentDate] = useState<string>('');


    useEffect(() => {
        //Figure out what the patient was ordered using the product_variants table and the variant_index/product_href
        const checkOrderDataAudit = async () => {
            const productVariantRecordOrRenewalOrder = await getPriceDataRecordWithVariant(renewalOrder.product_href, renewalOrder.variant_index);
            if (productVariantRecordOrRenewalOrder) {
                setWhatThePatientWasSent(`${capitalizeFirstLetter(productVariantRecordOrRenewalOrder?.cadence)} ${capitalizeFirstLetter(renewalOrder.product_href)} ${productVariantRecordOrRenewalOrder?.dosages}`);
            }
        }

        //Figure out when the script was sent using the order_data_audit table
        const checkScriptSentDate = async () => {
            const scriptSentDate = await getPrescriptionSentAudit(69, renewalOrder.renewal_order_id);
            if (scriptSentDate && scriptSentDate.length > 0) {
                setScriptSentDate(scriptSentDate[scriptSentDate.length - 1].created_at);
            }
        }

        checkOrderDataAudit();
        checkScriptSentDate();
    }, [renewalOrder]);

    
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
                const url = `http://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${renewalOrder.tracking_number}`;
                window.open(url, '_blank');
            default:
                return;
        }
    };

    const parseShippingData = () => {
        switch (renewalOrder.assigned_pharmacy) {
            case 'empower':
                return (
                    <>
                        <BioType className=''>
                            <span className='provider-tabs-subtitle text-black'>
                                • Shipping Status:{' '}
                            </span>
                            <span className='provider-tabs-subtitle-weak'>
                                {renewalOrder.shipping_status}
                            </span>
                        </BioType>
                        <BioType>
                            <span className='provider-tabs-subtitle text-black'>
                                • Tracking #:{' '}
                            </span>
                            <span
                                className='provider-tabs-subtitle-weak hover:cursor-pointer underline hover:text-primary'
                                onClick={() => {
                                    redirectShipping('empower');
                                }}
                            >
                                {renewalOrder.tracking_number}
                            </span>
                        </BioType>
                        {renewalOrder.external_tracking_metadata && (
                            <>
                                {renewalOrder.external_tracking_metadata
                                    .lfOrderId && (
                                    <BioType className='provider-tabs-subtitle '>
                                        <BioType>
                                            <span className='provider-tabs-subtitle '>
                                                • Empower Order ID (LFID):
                                            </span>{' '}
                                            <span>
                                                {
                                                    renewalOrder
                                                        .external_tracking_metadata
                                                        .lfOrderId
                                                }
                                            </span>
                                        </BioType>
                                    </BioType>
                                )}
                                <BioType className='text-black'>
                                    <BioType>
                                        <span className='provider-tabs-subtitle-weak text-black'>
                                            • Pharmacy Order Status:
                                        </span>{' '}
                                        <span className='provider-tabs-subtitle-weak'>
                                            {
                                                renewalOrder
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
                            <span className='provider-tabs-subtitle text-black'>Shipping Status: </span>
                            <span className='provider-tabs-subtitle-weak'>
                                {renewalOrder.shipping_status}
                            </span>
                        </BioType>
                        <BioType>
                            <span className='provider-tabs-subtitle text-black'>Tracking #: </span>
                            <span className='provider-tabs-subtitle-weak'>
                                {renewalOrder.tracking_number}
                            </span>
                        </BioType>
                    </>
                );
        }
    };

    const getCheckedInStatus = () => {
        if (renewalOrder.submission_time) {
            return 'Yes';
        } else {
            return 'No';
        }
    };

    const getPaymentStatus = () => {
        if (
            renewalOrder.order_status.includes('Paid') ||
            renewalOrder.order_status === RenewalOrderStatus.PharmacyProcessing
        ) {
            return 'Yes';
        } else if (renewalOrder.order_status.includes('Unpaid')) {
            return 'No';
        } else {
            return 'Unknown';
        }
    };

    return (
        <Fragment>
            <div className='flex flex-col justify-start items-start gap-2 py-6'>
                <div className='flex flex-col justify-start items-start w-full gap-2'>
                    <BioType>
                        <span className='provider-tabs-subtitle-weak'>Order ID: </span>
                        <span className='provider-tabs-subtitle'>
                            {renewalOrder.renewal_order_id}
                        </span>
                    </BioType>
                    <BioType className='flex flex-row gap-2'>
                        <span className='provider-tabs-subtitle-weak'>Completed Check-in?</span>
                        <span className='provider-tabs-subtitle'>{getCheckedInStatus()}</span>
                    </BioType>
                    <BioType className='flex flex-row gap-2'>
                        <span className='provider-tabs-subtitle-weak'>Paid?</span>
                        <span className='provider-tabs-subtitle'>{getPaymentStatus()}</span>
                    </BioType>

                    <BioType className='flex flex-col'>
                        <span className='provider-tabs-subtitle-weak'>Approving Provider: </span>
                        <span className='provider-tabs-subtitle'>
                            {renewalOrder.provider_name
                                ? renewalOrder.provider_name
                                : 'not tracked'}
                        </span>
                    </BioType>
                    {/**
                     * Conditionally renders approval time if it exists.
                     */}
                    {renewalOrder.approval_denial_timestamp && (
                        <BioType className='flex flex-col gap-0'>
                            <span className='provider-tabs-subtitle-weak'>Approval Time: </span>
                            <p className='provider-tabs-subtitle'>
                                {convertTimestamp(
                                    renewalOrder.approval_denial_timestamp
                                )}
                            </p>
                        </BioType>
                    )}
                    <BioType className='flex flex-col gap-0'>
                        <span className='provider-tabs-subtitle-weak'>
                            Shipping Information:{' '}
                        </span>
                        <div className='flex flex-col ml-2'>
                            {parseShippingData()}
                        </div>
                    </BioType>
                    {renewalOrder.subscription_id && (
                        <BioType className='flex flex-row gap-2'>
                            <span className='provider-tabs-subtitle-weak'>
                                Subscription Status:{' '}
                            </span>
                            <span className='provider-tabs-subtitle'>
                                {renewalOrder.subscription_status}
                            </span>
                        </BioType>
                    )}
                </div>
                <div className='flex flex-col'>
                    <BioType>
                        <span className='provider-tabs-subtitle-weak'>
                            Pharmacy / Script Information
                        </span>
                    </BioType>

                    <div className='flex flex-col ml-2'>

                        {whatThePatientWasSent && (
                            <BioType className='provider-tabs-subtitle'>
                                <span className='provider-tabs-subtitle'>• {whatThePatientWasSent}</span>
                            </BioType>
                        )}        
                        <BioType className='provider-tabs-subtitle'>
                            • Script sent on:{' '}
                            <span className='provider-tabs-subtitle text-green-600'>
                                {scriptSentDate ? convertTimestamp(scriptSentDate) : 'not tracked - check tracking numbers and orders table for this patient'}
                            </span>
                        </BioType>
                        <BioType className='provider-tabs-subtitle'>
                            • Cadence:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {capitalizeFirstLetter(renewalOrder.subscription_type)}
                            </span>
                        </BioType>
                        <BioType className='provider-tabs-subtitle'>
                            • Pharmacy:{' '}
                            <span className='provider-tabs-subtitle-weak'>
                                {capitalizeFirstLetter(renewalOrder.assigned_pharmacy)}
                            </span>
                        </BioType>

                    
                        <div className=''>
                            {renewalOrder.prescription_json &&
                                parseLastUsedScript(
                                    renewalOrder.prescription_json,
                                    renewalOrder.assigned_pharmacy,
                                    renewalOrder
                            )}
                        </div>
                    </div>
                </div>
            </div>{' '}
        </Fragment>
    );
}
