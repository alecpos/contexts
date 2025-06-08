'use client';
import { getAllOrdersWithStatusArray } from '@/app/utils/database/controller/orders/orders-api';
import {
    getProfilesCreatedAfterDate,
    getProfilesCreatedAfterDateWithFirstName,
} from '@/app/utils/database/controller/profiles/profiles';
import { useEffect, useState } from 'react';

interface NumberDisplayProps {}

export default function NumberDisplay({}: NumberDisplayProps) {
    const BIOVERSE_LAUNCH_DATE = new Date('2024-03-01T17:00:00-05:00');

    const [currentProfileData, setCurrentProfileData] = useState<any[]>();
    const [currentLeadData, setCurrentLeadData] = useState<any[]>();
    const [ordersProcessed, setOrdersProcessed] = useState<any[]>();
    const [ordersApproved, setOrdersApproved] = useState<any[]>();
    const [ordersPaymentFailed, setOrdersPaymentFailed] = useState<any[]>();
    const [ordersDeclined, setOrdersDeclined] = useState<any[]>();

    const [afterThisDate, setAfterThisDate] =
        useState<Date>(BIOVERSE_LAUNCH_DATE);

    useEffect(() => {
        (async () => {
            const userArray = await getProfilesCreatedAfterDate(afterThisDate);
            setCurrentProfileData(userArray);

            const userArrayWithFirstName =
                await getProfilesCreatedAfterDateWithFirstName(afterThisDate);
            setCurrentLeadData(userArrayWithFirstName);

            const orderArrayProcessed = await getAllOrdersWithStatusArray(
                ['Approved-CardDown-Finalized'],
                afterThisDate
            );
            setOrdersProcessed(orderArrayProcessed ?? []);

            const orderArrayApproved = await getAllOrdersWithStatusArray(
                [
                    'Approved-CardDown-Finalized',
                    'Approved-CardDown',
                    'Payment-Completed',
                ],
                afterThisDate
            );
            setOrdersApproved(orderArrayApproved ?? []);

            const orderArrayPaymentFail = await getAllOrdersWithStatusArray(
                ['Payment-Declined'],
                afterThisDate
            );
            setOrdersPaymentFailed(orderArrayPaymentFail ?? []);

            const orderArrayDeclined = await getAllOrdersWithStatusArray(
                ['Denied-CardDown'],
                afterThisDate
            );
            setOrdersDeclined(orderArrayDeclined ?? []);
        })();
    }, [afterThisDate]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAfterThisDate(new Date(event.target.value));
    };

    return (
        <div className='flex flex-col justify-center items-center py-10 gap-10'>
            <input
                type='date'
                value={afterThisDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
            />
            <div>
                Customers: {currentProfileData ? currentProfileData.length : 0}
            </div>
            <div>Leads: {currentLeadData ? currentLeadData.length : 0}</div>

            <div>
                Orders Paid and Shipped out:{' '}
                {ordersProcessed ? ordersProcessed.length : 0}
            </div>

            <div>
                Orders Approved: {ordersApproved ? ordersApproved.length : 0}
            </div>

            <div>
                Payment Failures:{' '}
                {ordersPaymentFailed ? ordersPaymentFailed.length : 0}
            </div>

            <div>
                Orders Declined: {ordersDeclined ? ordersDeclined.length : 0}
            </div>
        </div>
    );
}
