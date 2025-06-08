'use client';

import React, { useState, useEffect } from 'react';
import VerticalDivider from '../../global-components/dividers/verticalDivider/verticalDivider';
import ManageSubscription from './manageSubscription';
import MobileManageSubscription from './manageSubscriptionMobile';
import Image from 'next/image';

import { Button, CardMedia } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { constructPricingStructure } from '@/app/utils/functions/pricing';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { getTMCOrderInformation } from '@/app/services/pharmacy-integration/tmc/tmc-actions';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';

interface OrderItemProps {
    orderId: string;
    PatientOrderDetails: string;
    status: OrderItemStatus;
    productName: string;
    price: string;
    dateOrderPlaced: string;
    shippingInfo: ShippingInformation;
    imageUrl: string;
    backgroundColor: string;
    isSubscribed: boolean;
    frequency?: string; // Now optional
    expiryDate?: string; // Now optional
    nextRefillDate?: string; // Now optional
    productHref: string;
    assigned_pharmacy: string | null;
    shipping_status: string | null;
    tracking_number: string | null;
    variant_index: number;
    subscription_type: string;
    variant_text: string;
    discount_id: string[] | null;
}

const OrderItem: React.FC<OrderItemProps> = ({
    orderId,
    status,
    productName,
    price,
    dateOrderPlaced,
    shippingInfo,
    isSubscribed,
    frequency,
    expiryDate,
    nextRefillDate,
    productHref,
    imageUrl,
    assigned_pharmacy,
    shipping_status,
    tracking_number,
    variant_index,
    subscription_type,
    variant_text,
    discount_id,
}) => {
    const statusBadgeColors = {
        Approved: 'bg-[#2E7D32]',
        'Pending Approval': 'bg-[#0288D1]',
        'Unable to Approve': 'bg-[#D32F2F]',
        Active: 'bg-[#2E7D32]',
        Paused: 'bg-[#EF6C00]',
        Canceled: 'bg-[#D32F2F]',
    };
    const [isSubscriptionPanelOpen, setIsSubscriptionPanelOpen] =
        useState(false);

    const [pricingStructure, setPricingStructure] = useState<any>({});

    const [tmcOrderData, setTMCOrderData] = useState<{
        order_status: string | null;
        shipping_information: any[] | null;
        shipping_status: string | null;
        error: any | null;
    }>();

    useEffect(() => {
        (async () => {
            const { data: priceData, error: priceDataError } =
                await getPriceVariantTableData(productHref);

            if (priceDataError) {
                console.error(
                    'Error fetching data for prescription:',
                    priceDataError
                );
            }

            const productData = {
                productName: productHref,
                variant: variant_index,
                variantText: variant_text,
                subscriptionType: subscription_type,
            };
            const shouldDiscount = discount_id && discount_id[0] ? true : false;
            setPricingStructure(
                constructPricingStructure(
                    productData,
                    priceData!,
                    shouldDiscount
                )
            );

            if (assigned_pharmacy == 'tmc') {
                const tmc_order_shipping_data = await getTMCOrderInformation(
                    orderId
                );

                setTMCOrderData(tmc_order_shipping_data);
            }
        })();
    }, []);

    const toggleSubscriptionPanel = () => {
        setIsSubscriptionPanelOpen(!isSubscriptionPanelOpen);
    };

    const HorizontalDivider = () => (
        <div className={`h-px bg-gray-400 w-full`}></div>
    );

    const HorizontalDividerLight = () => (
        <div className={`h-px bg-gray-300 w-full`}></div>
    );

    const dateParser = (dateToParse: string): string => {
        const date = new Date(dateToParse);

        // Pad the month and day with a leading zero if they are less than 10
        const pad = (num: number) => (num < 10 ? '0' + num : num.toString());

        // Format the date as MM/DD/YYYY
        const formattedDate =
            pad(date.getMonth() + 1) +
            '/' +
            pad(date.getDate()) +
            '/' +
            date.getFullYear();

        // Format the time as HH:MM AM/PM
        let hours = date.getHours();
        const minutes = pad(date.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        const formattedTime = pad(hours) + ':' + minutes + ' ' + ampm;

        return formattedDate + ' ' + formattedTime;
    };

    const isButtonEnabled = status === 'Active' || status === 'Approved';

    const priceStructureText = (
        <>
            <div className='flex justify-between body1 text-[#1b1b1b] opacity-60 text-[16px] mt-1'>
                <BioType className=''>Item:</BioType>
                <BioType className=''>${pricingStructure.item_price}</BioType>
            </div>
            {pricingStructure['subscribe_save_price'] && (
                <div className='flex justify-between body1 text-[#1b1b1b] opacity-60 text-[16px]'>
                    <BioType>Subscribe + Save</BioType>
                    <BioType>
                        - ${pricingStructure['subscribe_save_price']}
                    </BioType>
                </div>
            )}

            {discount_id && (
                <div className='flex justify-between body1 text-[#1b1b1b] opacity-60 text-[16px]'>
                    <BioType>Your Coupon Savings</BioType>
                    <BioType>
                        -$
                        {pricingStructure.coupon_price}
                    </BioType>
                </div>
            )}
            <div className='flex justify-between body1 text-[#1b1b1b] opacity-80 text-[16px]'>
                <BioType>Total (if perscribed)</BioType>
                <BioType>${pricingStructure.total_price}</BioType>
            </div>

            {subscription_type === 'monthly' ||
                (subscription_type === 'quarterly' && (
                    <div className='flex justify-between body1 text-[#1b1b1b] opacity-80 text-[13px]'>
                        <BioType>First order only</BioType>
                    </div>
                ))}
        </>
    );

    /**
     *
     *
     * This component has a Mobile / Desktop Distinction. Labeled Below.
     *
     *
     */
    return (
        <>
            {/**
             * MOBILE VERSION BELOW
             */}

            <div
                className={`pt-4 mb-6 grey-border rounded-lg flex flex-col md:hidden bg-white`}
            >
                <div className='flex justify-between items-center pl-4'>
                    <h4 className='text-lg font-semibold'>Order #{orderId}</h4>
                </div>
                <p className='text-sm text-gray-500 pl-4 mb-2'>
                    {dateParser(dateOrderPlaced)}
                </p>

                <HorizontalDivider />

                <div className='flex justify-between'>
                    <div>
                        <span
                            className={`inline-block rounded-full text-white px-3 py-1 text-xs font-medium ${statusBadgeColors[status]} mt-2 mb-2 ml-4`}
                        >
                            {status}
                        </span>
                    </div>
                </div>
                <div className='ml-4 mr-4'>
                    {' '}
                    <HorizontalDividerLight />
                </div>

                {/* Product Information with Image */}
                <div className='flex items-start mt-2 pl-4'>
                    {/* Product Image */}
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageUrl}`}
                        alt={productName}
                        width={160}
                        height={160}
                        className='mr-4 rounded'
                        sizes='(max-width:  160px)  100vw,  160px'
                        unoptimized
                    />

                    {/* Product Name and Price */}
                    <div className='w-[220px]'>
                        <h4 className='font-bold text-base mb-1'>
                            {productName}
                        </h4>
                        {pricingStructure && <>{priceStructureText}</>}
                    </div>
                </div>
                <div className='h-px bg-gray-300 w-full my-4'></div>

                {/* Shipping Information and Action Buttons */}
                <div className={`mt-auto order-last md:order-none`}>
                    <div className='mb-2'>
                        <p className='text-sm pl-4'>Shipping Information</p>
                    </div>
                    <div className='h-px bg-gray-300 w-full mb-4'></div>
                    <div className='mt-2'>
                        <p className='text-sm whitespace-pre-line pl-4'>
                            {shippingInfo.address_line1}
                        </p>
                        <p className='text-sm whitespace-pre-line pl-4'>
                            {shippingInfo.address_line2}
                        </p>
                        <p className='text-sm whitespace-pre-line pl-4'>
                            {shippingInfo.city} , {shippingInfo.state}{' '}
                            {shippingInfo.zip}
                        </p>
                    </div>
                    <div className='mt-4 flex justify-center pl-4 flex-col pb-2'>
                        {/* <Button
                                variant="contained"
                                sx={{
                                    height: '40px', // Equivalent to h-10 in Tailwind CSS
                                    px: '1.25rem', // Equivalent to px-5 in Tailwind CSS
                                    mb: 2, // Equivalent to mb-2 in Tailwind CSS
                                    fontSize: '1rem', // Equivalent to text-md in Tailwind CSS
                                    width: '16rem', // Equivalent to w-64 in Tailwind CSS
                                    backgroundColor: isButtonEnabled
                                        ? '#286BA2'
                                        : 'gray',
                                    ':hover': {
                                        backgroundColor: isButtonEnabled
                                            ? '#1d4a71'
                                            : 'gray',
                                    },
                                    cursor: isButtonEnabled
                                        ? 'pointer'
                                        : 'not-allowed',
                                }}
                                disabled={!isButtonEnabled}
                            >
                                Track Order
                            </Button> */}
                        <BioType className='body1'>
                            Shipment Status:{' '}
                            {shipping_status ? shipping_status : 'in review'}
                        </BioType>
                        <BioType className='body1'>
                            Tracking #:{' '}
                            {tracking_number
                                ? tracking_number
                                : 'Not yet assigned'}
                        </BioType>
                    </div>
                    {isSubscribed && (
                        <div className='flex justify-center pb-4'>
                            <Button
                                variant='outlined'
                                onClick={toggleSubscriptionPanel}
                                sx={{
                                    px: '1.25rem', // Equivalent to px-5 in Tailwind CSS
                                    borderRadius: '0.375rem', // Equivalent to rounded in Tailwind CSS (default border-radius)
                                    width: '16rem', // Equivalent to w-64 in Tailwind CSS
                                    fontSize: '1rem', // Equivalent to text-base in Tailwind CSS
                                }}
                            >
                                Manage Subscription
                            </Button>
                        </div>
                    )}
                    <MobileManageSubscription
                        isOpen={isSubscriptionPanelOpen}
                        onClose={toggleSubscriptionPanel}
                        status={status}
                        productName={productName}
                        price={price}
                        orderId={orderId}
                        productHref={productHref}
                        imageUrl={imageUrl}
                    />
                </div>
            </div>

            {/**
             * DESKTOP VERSION BELOW
             */}

            <div className='hidden md:flex w-full'>
                {isSubscribed ? (
                    <div className='pt-4 pr-4 pl-4 mb-6 bg-white border grey-border w-full flex flex-row'>
                        {/* Left Section */}
                        <div
                            className='flex flex-col w-1/2 pr-2'
                            style={{ flexBasis: '66.666%' }}
                        >
                            <div className='flex justify-between mb-3'>
                                <h4 className='text-lg font-semibold'>
                                    Order #{orderId}
                                </h4>
                                <span
                                    className={`inline-block rounded-full text-white px-3 py-1 text-xs font-medium ${statusBadgeColors[status]}`}
                                >
                                    {status}
                                </span>
                            </div>
                            <HorizontalDivider />

                            {/* Product Information with Image */}
                            <div className='flex items-start mt-3 mb-3'>
                                {/* Product Image */}
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageUrl}`}
                                    alt={productName}
                                    width={160}
                                    height={160}
                                    className='mr-4 rounded'
                                    sizes='(max-width:  160px)  100vw,  160px'
                                    unoptimized
                                />
                                <div className='mb-3'>
                                    {/* First Product Name and Price */}
                                    <div className='w-[200px]'>
                                        <h4 className='font-bold text-base mb-1'>
                                            {productName}
                                        </h4>
                                        {pricingStructure && (
                                            <>{priceStructureText}</>
                                        )}
                                    </div>

                                    {/* Second Product Name and Price */}
                                    {/* <div>
                                        <p className="text-sm mb-1 mt-2">
                                            Frequency: {frequency} | Next Refill
                                            Date:
                                            {nextRefillDate}
                                        </p>
                                        <p className="mt-2 text-sm">
                                            Exp. Date: {expiryDate}
                                        </p>{' '}
                                    </div> */}
                                </div>

                                {/* Product Name and Price */}
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='w-px bg-black self-stretch -mt-4'></div>

                        {/* Right Section */}
                        <div
                            className='flex flex-col w-1/2 pl-2 '
                            style={{ flexBasis: '33.333%' }}
                        >
                            <div className='flex justify-start text-center'>
                                <p className='text-sm mb-3 pt-2'>
                                    Shipping Information
                                </p>
                            </div>
                            <HorizontalDivider />
                            <div className='mt-2'>
                                <p className='text-sm whitespace-pre-line pl-4'>
                                    {shippingInfo.address_line1}
                                </p>
                                <p className='text-sm whitespace-pre-line pl-4'>
                                    {shippingInfo.address_line2}
                                </p>
                                <p className='text-sm whitespace-pre-line pl-4'>
                                    {shippingInfo.city} , {shippingInfo.state}{' '}
                                    {shippingInfo.zip}
                                </p>
                            </div>
                            <div className='mt-auto flex flex-col pl-4 justify-center'>
                                {/* <Button
                                        variant='contained'
                                        sx={{
                                            height: '40px',
                                            px: '1.25rem',
                                            mb: 2,
                                            width: '16rem',
                                            backgroundColor: isButtonEnabled
                                                ? undefined
                                                : 'gray',
                                            cursor: isButtonEnabled
                                                ? 'pointer'
                                                : 'not-allowed',
                                        }}
                                        disabled={!isButtonEnabled}
                                    >
                                        Track Order
                                    </Button> */}
                                <BioType className='body1'>
                                    Shipment Status:{' '}
                                    {tmcOrderData &&
                                        tmcOrderData.shipping_status}
                                    {shipping_status
                                        ? shipping_status
                                        : 'in review'}
                                </BioType>
                                <BioType className='body1'>
                                    Tracking #:{' '}
                                    {tmcOrderData &&
                                        tmcOrderData.shipping_information &&
                                        tmcOrderData.shipping_information[0]
                                            .trcaking_no}
                                    {tracking_number
                                        ? tracking_number
                                        : 'Not yet assigned'}
                                </BioType>
                            </div>
                            {isSubscribed && (
                                <div className='flex justify-center pb-4'>
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            height: '40px',
                                            px: '1.25rem',
                                            width: '16rem',
                                        }}
                                        onClick={toggleSubscriptionPanel}
                                    >
                                        Manage Subscription
                                    </Button>
                                </div>
                            )}
                            <ManageSubscription
                                isOpen={isSubscriptionPanelOpen}
                                onClose={toggleSubscriptionPanel}
                                status={status}
                                orderId={orderId}
                                productName={productName}
                                price={price}
                                productHref={productHref}
                                imageUrl={imageUrl}
                            />
                        </div>
                    </div>
                ) : (
                    <div className='pt-4 pr-4 pl-4 mb-6 bg-white border grey-border relative flex flex-col black-border'>
                        <div className='flex justify-between w-full mb-4'>
                            <h4 className='text-lg font-semibold'>
                                Order #{orderId}
                            </h4>
                            <p className='text-sm text-gray-500'>
                                {dateParser(dateOrderPlaced)}
                            </p>
                        </div>
                        <HorizontalDivider />

                        <div className='flex flex-grow'>
                            {/* Left Section */}
                            <div className='flex flex-col w-2/3 pr-2 '>
                                <div className='py-2'>
                                    <div className='flex justify-between'>
                                        <span
                                            className={`inline-block rounded-full text-white px-3 py-1 text-xs font-medium ${statusBadgeColors[status]}`}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                <HorizontalDivider />

                                {/* Product Information with Image */}
                                <div className='flex items-start mt-3 mb-3'>
                                    {/* Product Image */}
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageUrl}`}
                                        alt={productName}
                                        width={160}
                                        height={160}
                                        className='mr-4 rounded'
                                        sizes='(max-width:  160px)  100vw,  160px'
                                        unoptimized
                                    />

                                    {/* Product Name and Price */}
                                    <div className='w-[220px]'>
                                        <h4 className='font-bold text-base mb-1'>
                                            {productName}
                                        </h4>
                                        {pricingStructure && (
                                            <>{priceStructureText}</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {isSubscribed ? (
                                <div>
                                    <VerticalDivider
                                        backgroundColor='black'
                                        width='1px'
                                    />
                                </div>
                            ) : (
                                <div>
                                    <VerticalDivider
                                        backgroundColor='black'
                                        width='1px'
                                    />
                                </div>
                            )}
                            {/* Right Section */}
                            <div className='flex flex-col w-1/3 pl-2 '>
                                <div className='flex justify-center text-center'>
                                    <p className='text-sm mb-3 pt-2'>
                                        Shipping Information
                                    </p>
                                </div>
                                <HorizontalDivider />
                                <div className='mt-2'>
                                    <p className='text-sm whitespace-pre-line pl-4'>
                                        {shippingInfo.address_line1}
                                    </p>
                                    <p className='text-sm whitespace-pre-line pl-4'>
                                        {shippingInfo.address_line2}
                                    </p>
                                    <p className='text-sm whitespace-pre-line pl-4'>
                                        {shippingInfo.city} ,{' '}
                                        {shippingInfo.state} {shippingInfo.zip}
                                    </p>
                                </div>
                                <div className='mt-10 flex justify-center'>
                                    <Button
                                        variant='contained'
                                        sx={{
                                            height: '40px', // Equivalent to h-10 in Tailwind CSS
                                            px: '1.25rem', // Equivalent to px-5 in Tailwind CSS
                                            mb: 2, // Equivalent to mb-2 in Tailwind CSS
                                            width: '16rem', // Equivalent to w-64 in Tailwind CSS
                                            backgroundColor: isButtonEnabled
                                                ? undefined
                                                : 'gray', // Apply gray background if button is disabled
                                            cursor: isButtonEnabled
                                                ? 'pointer'
                                                : 'not-allowed', // Change cursor based on button enabled state
                                        }}
                                        disabled={!isButtonEnabled}
                                    >
                                        Track Order
                                    </Button>
                                </div>
                                {isSubscribed && ( // Conditionally render this button
                                    <div className='flex justify-center pb-4'>
                                        <Button
                                            variant='outlined'
                                            sx={{
                                                height: '40px', // Equivalent to h-10 in Tailwind CSS
                                                px: '1.25rem', // Equivalent to px-5 in Tailwind CSS
                                                width: '16rem', // Equivalent to w-64 in Tailwind CSS
                                            }}
                                            onClick={toggleSubscriptionPanel}
                                        >
                                            Manage Subscription
                                        </Button>
                                    </div>
                                )}
                                <ManageSubscription
                                    isOpen={isSubscriptionPanelOpen}
                                    onClose={toggleSubscriptionPanel}
                                    status={status}
                                    orderId={orderId}
                                    productName={''}
                                    price={''}
                                    productHref={productHref}
                                    imageUrl={imageUrl}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrderItem;
