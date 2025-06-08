'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import EscalateOrderDialog from '@/app/components/provider-coordinator-shared/all-patients/components/patient-page/tab-components/orders/components/components/escalation/escalate-order-dialog';
import { Button } from '@mui/material';
import React, { useState } from 'react';

interface DemographicsProps {
    order_data: DBOrderData;
    patient_data: DBPatientData;
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function OrderAccordionContent({
    order_data,
    patient_data,
}: DemographicsProps) {
    const [showEscalateDialog, setShowEscalateDialog] =
        useState<boolean>(false);

    return (
        <>
            {order_data && (
                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col flex-grow items-start gap-3">
                            <div className="flex flex-col gap-0">
                                <BioType className="itd-input">
                                    Pharmacy Name
                                </BioType>
                                <BioType className="itd-body">
                                    {order_data.assigned_pharmacy
                                        ? capitalizeFirstLetter(
                                              order_data.assigned_pharmacy,
                                          )
                                        : 'N/A'}
                                </BioType>
                            </div>
                            <div className="flex flex-col gap-0">
                                <BioType className="itd-input">
                                    Order ID
                                </BioType>
                                <BioType className="itd-body">
                                    {order_data.id}
                                </BioType>
                            </div>

                            <div className="flex flex-col gap-0">
                                <BioType className="itd-input">
                                    Approval Time
                                </BioType>
                                <BioType className="itd-body">
                                    {order_data.approval_denial_timestamp ??
                                        'not tracked'}
                                </BioType>
                            </div>
                        </div>
                        <div className="flex flex-col flex-grow items-start gap-3">
                            <div className="flex flex-col gap-0">
                                <Button
                                    color="info"
                                    variant="outlined"
                                    onClick={() => {
                                        setShowEscalateDialog(true);
                                    }}
                                    sx={{
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        padding: '8px 24px',
                                        fontSize: '16px',
                                        color: '#CC9596',
                                        textTransform: 'none',
                                        border: '1px solid #CC9596',
                                        ':hover': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                >
                                    Escalate
                                </Button>
                                <EscalateOrderDialog
                                    open={showEscalateDialog}
                                    onClose={() => {
                                        setShowEscalateDialog(false);
                                    }}
                                    order_data={order_data}
                                    profile_data={patient_data}
                                />
                            </div>

                            <div className="flex flex-col gap-0">
                                <BioType className="itd-input">
                                    Approving Provider
                                </BioType>
                                <BioType className="itd-body">
                                    {order_data.provider
                                        ? order_data.provider.name
                                        : 'Not Tracked'}
                                </BioType>
                            </div>

                            <div className="flex flex-col gap-0">
                                <BioType className="itd-input">
                                    Discount Applied?
                                </BioType>
                                <BioType className="itd-body">
                                    {order_data?.discount_id?.length > 0
                                        ? 'True'
                                        : 'False'}
                                </BioType>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <BioType className="itd-input">
                                Shipping Information
                            </BioType>
                            <div className="flex flex-col">
                                <BioType className="itd-body">
                                    <span className="itd-input">
                                        • Shipping Status:
                                    </span>{' '}
                                    <span className="itd-body">
                                        {order_data.shipping_status}
                                    </span>
                                </BioType>
                                <BioType className="itd-body">
                                    <span className="itd-input">
                                        • Tracking #:
                                    </span>{' '}
                                    <span className="itd-body">
                                        {order_data.tracking_number}
                                    </span>
                                </BioType>
                                {order_data.assigned_pharmacy === 'empower' && (
                                    <BioType className="itd-body">
                                        <span className="itd-input">
                                            • Empower Order ID (LFID):
                                        </span>{' '}
                                        <span className="itd-body">
                                            {
                                                order_data
                                                    ?.external_tracking_metadata
                                                    ?.lfOrderId
                                            }
                                        </span>
                                    </BioType>
                                )}
                                <BioType className="itd-body">
                                    <span className="itd-input">
                                        • Pharmacy Order Status:
                                    </span>{' '}
                                    <span className="itd-body">
                                        {order_data.external_tracking_metadata
                                            ? order_data
                                                  .external_tracking_metadata
                                                  .orderStatus
                                            : ''}
                                    </span>
                                </BioType>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <BioType className="itd-input">
                                Subscription Status
                            </BioType>
                            <BioType className="itd-body">
                                {order_data.subscription
                                    ? order_data.subscription.status
                                    : ''}
                            </BioType>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
