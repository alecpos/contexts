'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TabsDisplay from '../tab-column/tabs-display';
import DisplayOptions from '../tab-column/display-options';
import { OrderType } from '@/app/types/orders/order-types';
import useSWR from 'swr';
import { getProviderFromId } from '@/app/utils/database/controller/providers/providers-api';

interface TabColumnProps {
    providerId: string;
    patient_data: DBPatientData;
    order_data: DBOrderData;
    orderType: OrderType;
    statusTag: string | undefined;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    responseRequired: boolean;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
}
export default function TabColumn({
    providerId,
    patient_data,
    order_data,
    orderType,
    statusTag,
    messageContent,
    setMessageContent,
    responseRequired,
    setResponseRequired,
}: TabColumnProps) {
    const [providerName, setProviderName] = useState<string>('');
    const [credentials, setCredentials] = useState<string>('');
    const [tabSelected, setTabSelected] = useState<string>('messages');

    const { data: provider_data } = useSWR(`provider-info`, () =>
        getProviderFromId(providerId)
    );

    useEffect(() => {
        if (provider_data) {
            setProviderName(provider_data.name!);
            setCredentials(provider_data.credentials!);
        }
    }, [provider_data]);

    return (
        <div className='flex flex-col h-full bg-white rounded flex-grow '>
            <TabsDisplay
                tabSelected={tabSelected}
                setTabSelected={setTabSelected}
                providerId={providerId}
            />

            <div className=' overflow-auto'>
                <DisplayOptions
                    selected={tabSelected}
                    patient_data={patient_data}
                    order_data={order_data}
                    orderType={orderType}
                    providerId={providerId}
                    providerName={providerName}
                    credentials={credentials}
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    setTabSelected={setTabSelected}
                    statusTag={statusTag}
                    responseRequired={responseRequired}
                    setResponseRequired={setResponseRequired}
                />
            </div>
        </div>
    );
}
