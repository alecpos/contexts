'use client';
import React, { Dispatch, SetStateAction } from 'react';
import MessageDisplay from './message/message-display';
import PrescribeDisplay from './prescribe/prescribe-display';
import MacrosDisplay from './macros/macros-display';
import { OrderType } from '@/app/types/orders/order-types';

interface TabDisplayOptionsProps {
    selected: string;
    patient_data: DBPatientData;
    order_data: DBOrderData;
    orderType: OrderType;
    providerName: string;
    credentials: string;
    providerId: string;
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    statusTag: string | undefined;
    responseRequired: boolean;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
}
const TabDisplayOptions = ({
    selected,
    patient_data,
    order_data,
    orderType,
    providerName,
    credentials,
    providerId,
    setTabSelected,
    messageContent,
    setMessageContent,
    statusTag,
    responseRequired,
    setResponseRequired,
}: TabDisplayOptionsProps) => {
    switch (selected) {
        case 'messages':
            return (
                <MessageDisplay
                    patient_data={patient_data}
                    providerId={providerId}
                    providerName={providerName}
                    credentials={credentials}
                    setTabSelected={setTabSelected}
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    orderType={orderType}
                    order_data={order_data}
                    responseRequired={responseRequired}
                    setResponseRequired={setResponseRequired}
                    statusTag={statusTag}
                />
            );
        case 'prescribe':
            return (
                <PrescribeDisplay
                    patient_data={patient_data}
                    order_data={order_data}
                    orderType={orderType}
                    providerId={providerId}
                    statusTag={statusTag}
                />
            );
        case 'macros':
            return (
                <MacrosDisplay
                    setTabSelected={setTabSelected}
                    setMessageContent={setMessageContent}
                />
            );

        default:
            return <></>;
    }
};

export default TabDisplayOptions;
