import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { OrderStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import OrderItemComponent from './components/OrderItem';
import FailedPaymentMessage from './components/FailedPaymentMessage';

interface Props {
    orderData: OrderStatusCategories;
    personalData: AccountNameEmailPhoneData;
}

interface StatusBarProperty {
    name: string;
    bgColor: string;
}

interface StatusBarProperties {
    [key: string]: StatusBarProperty;
    review: StatusBarProperty;
    'payment-failed': StatusBarProperty;
    shipped: StatusBarProperty;
    canceled: StatusBarProperty;
    delivered: StatusBarProperty;
    'pharmacy-processing': StatusBarProperty;
    processing: StatusBarProperty;
}

const defaultOrderState = {
    delivered: [],
    'payment-failed': [],
    review: [],
    shipped: [],
    canceled: [],
    'pharmacy-processing': [],
    processing: [],
};

const statusBarProperties: StatusBarProperties = {
    delivered: { name: 'Delivered', bgColor: 'bg-[#2E7D3233]' },
    'payment-failed': {
        name: 'Failed payment. Please re-enter payment information',
        bgColor: 'bg-[#D32F2F33]',
    },
    shipped: { name: 'Shipped', bgColor: 'bg-[#286BA233]' },
    canceled: { name: 'Canceled', bgColor: 'bg-[#00000026]' },
    review: { name: 'Provider Review in Progress', bgColor: 'bg-[#EF6C0033]' },
    'pharmacy-processing': {
        name: 'Pharmacy Processing',
        bgColor: 'bg-[#286BA233]',
    },
    processing: {
        name: 'Processing',
        bgColor: 'bg-[#286BA233]',
    },
};

export default function OrderList({ orderData, personalData }: Props) {
    const [orders, setOrders] =
        useState<OrderStatusCategories>(defaultOrderState);

    useEffect(() => {
        if (orderData) {
            setOrders(orderData);
        }
    }, [orderData]);

    function areAllKeysEmpty(
        orderStatusCategories: OrderStatusCategories
    ): boolean {
        return Object.keys(orderStatusCategories).every(
            (key) =>
                orderStatusCategories[key as keyof OrderStatusCategories]
                    .length === 0
        );
    }

    function renderNoOrders() {
        return (
            <Paper elevation={2} className='py-3 px-5 w-full'>
                <div
                    className={`mb-8 bg-black flex justify-center items-center self-stretch h-6 rounded-[100px] p-4`}
                >
                    <BioType className='body1 text-[13px] text-white'>
                        You have no orders.
                    </BioType>
                </div>
            </Paper>
        );
    }

    function renderPopulatedArrays(orderLst: OrderStatusCategories) {
        const elements: any = [];
        Object.entries(orderLst).forEach(([key, value], index) => {
            if (value.length > 0) {
                elements.push(
                    <Paper
                        elevation={2}
                        className='py-3 px-5 w-full'
                        key={index}
                    >
                        <div className='w-full' key={key}>
                            {/* Status Bar */}
                            <div
                                className={`${statusBarProperties[key]['bgColor']} flex justify-center items-center self-stretch h-6 rounded-[100px] p-4`}
                            >
                                <BioType className='body1 text-[13px]'>
                                    {statusBarProperties[key]['name']}
                                </BioType>
                            </div>
                            {/* Render Subscription Items */}
                            <div className='flex flex-col mt-1'>
                                {value.map((v, index) => (
                                    <OrderItemComponent
                                        order={v}
                                        key={index}
                                        final={index === value.length - 1}
                                        personalData={personalData}
                                    />
                                ))}
                            </div>
                        </div>
                    </Paper>
                );
            }
        });
        return elements;
    }

    return (
        <div className='flex flex-col space-y-4'>
            {orderData['payment-failed'].length > 0 && (
                <FailedPaymentMessage
                    prescription={orderData['payment-failed'][0].name}
                />
            )}
            {areAllKeysEmpty(orderData) && renderNoOrders()}
            {renderPopulatedArrays(orderData)}
        </div>
    );
}
