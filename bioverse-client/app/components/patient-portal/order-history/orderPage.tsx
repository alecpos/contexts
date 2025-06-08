'use client';
import React, { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { OrderStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import OrderList from './components/OrderList';

// Inside OrderItemProps definition

interface Props {
    orderData: OrderStatusCategories;
    personalData: AccountNameEmailPhoneData;
}

export default function OrderPage({ orderData, personalData }: Props) {
    if (!orderData) {
        return null;
    }
    return (
        <div
            id="main-order-page-component"
            className="container mx-auto w-full px-4 max-w-[650px]"
        >
            <div className="w-full md:mt-12">
                <BioType className="text-black h6 mb-3 md:mb-6 sm:text-[36px]">
                    Your Orders
                </BioType>

                <OrderList orderData={orderData} personalData={personalData} />
            </div>
        </div>
    );
}
