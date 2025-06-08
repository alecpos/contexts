import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { OrderItem } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { OrderType } from '@/app/types/orders/order-types';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';
import { getPriceUsingOrderNumber } from '@/app/services/stripe/prices';
import useSWR from 'swr';
import { CircularProgress } from '@mui/material';
import PDFInvoiceButton from '../../generateInvoicePdf';

interface Props {
    order: OrderItem;
    final: boolean;
    personalData: AccountNameEmailPhoneData;
}

export default function OrderItemComponent({
    order,
    final,
    personalData,
}: Props) {
    const router = useRouter();

    const {
        data: priceDataNumber,
        error: price_error,
        isLoading: price_isLoading,
    } = useSWR(
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
            ? null
            : `${order.id}-price`,
        () => getPriceUsingOrderNumber(order.renewal_order_id ?? order.id)
    );

    if (price_isLoading) {
        return (
            <div className='w-full flex justify-center mt-8 mb-8'>
                <CircularProgress style={{ color: '#286BA2' }} size={22} />
            </div>
        );
    }

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

    const generateTrackingUrl = () => {
        if (!order.tracking_number) {
            return '';
        }

        if (
            order.assigned_pharmacy === EASYPOST_PHARMACIES.TMC ||
            order.assigned_pharmacy === EASYPOST_PHARMACIES.EMPOWER
        ) {
            return `https://www.ups.com/track?tracknum=${order.tracking_number}`;
        } else {
            return `https://tools.usps.com/go/TrackConfirmAction_input?strOrigTrackNum=${order.tracking_number}`;
        }
    };

    return (
        <div className='w-full flex flex-col mt-4  space-y-4'>
            <div className='flex justify-between md:justify-start md:space-x-8'>
                {order.image_ref && (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${order.image_ref[0]}`}
                        alt={order.name}
                        width={100}
                        height={100}
                        className='rounded-lg hidden md:block'
                        sizes='(max-width:  100px)  100vw,  100px'
                        unoptimized
                    />
                )}
                <div className='hidden md:flex md:justify-between w-full'>
                    <BioType className='body1 text-black text-[16px]'>
                        {order.name}
                        <br />
                        {order.pharmacy_display_name?.split('-')[1]}
                    </BioType>
                    <div className='flex flex-col space-y-4 w-[160px]'>
                        {/* Order Created */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                Order created
                            </BioType>
                            <BioType className='body1 text-black text-[16px]'>
                                {dateParser(order.created_at)}
                            </BioType>
                        </div>
                        {/* Tracking Number */}
                        {order.tracking_number && (
                            <div className='flex flex-col space-y-2'>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Tracking Number
                                </BioType>

                                <a
                                    href={generateTrackingUrl()}
                                    target='_blank'
                                    className='decoration-black'
                                >
                                    <BioType className='body1 text-black text-[16px]'>
                                        {order.tracking_number}
                                    </BioType>
                                </a>
                            </div>
                        )}
                        {/* Shipping Address */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                Shipping Address
                            </BioType>
                            <div className='flex flex-col'>
                                <BioType className='body1 text-black text-[16px]'>
                                    {order.address_line1}
                                </BioType>
                                {order.address_line2 &&
                                    order.address_line2 !== '' && (
                                        <BioType className='body1 text-black text-[16px]'>
                                            {order.address_line2}
                                        </BioType>
                                    )}
                                <BioType className='body1 text-black text-[16px]'>
                                    {order.city}, {order.state} {order.zip}
                                </BioType>
                            </div>
                        </div>
                        {/* Total */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                Total
                            </BioType>
                            <BioType className='body1 text-black text-[16px]'>
                                $
                                {order?.price
                                    ? Number(order.price).toFixed(2)
                                    : priceDataNumber?.toFixed(2)}
                            </BioType>
                        </div>
                        {/* Order Number */}
                        <div className='flex flex-col space-y-2'>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                Order Number
                            </BioType>
                            <BioType className='body1 text-black text-[16px]'>
                                {order.order_type === OrderType.Order
                                    ? order.id
                                    : order.renewal_order_id}
                            </BioType>
                        </div>
                        {/* Receipt Download */}
                        {(order.order_status === 'Payment-Completed' ||
                            order.order_status ===
                                'Approved-CardDown-Finalized' ||
                            (order.order_status &&
                                /Paid/.test(order.order_status))) && (
                            <div className='flex flex-col space-y-2'>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Receipt
                                </BioType>
                                <BioType className='body1 text-black text-[16px]'>
                                    <PDFInvoiceButton
                                        order={order}
                                        personalData={personalData}
                                    />
                                </BioType>
                            </div>
                        )}
                    </div>
                </div>
                <div className='md:hidden flex flex-col space-y-4'>
                    <BioType className='body1 text-black text-[16px]'>
                        {order.name}
                        <br />
                        {order.pharmacy_display_name &&
                            order.pharmacy_display_name.split('-')[1]}
                    </BioType>
                    {/* Order Created */}
                    <div className='flex flex-col space-y-2'>
                        <BioType className='body1 text-[#00000099] text-[16px]'>
                            Order created
                        </BioType>
                        <BioType className='body1 text-black text-[16px]'>
                            {dateParser(order.created_at)}
                        </BioType>
                    </div>
                    {/* Tracking Number Mobile */}
                    {order.tracking_number && (
                        <div className='flex flex-col space-y-2'>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                Tracking Number
                            </BioType>
                            <a
                                href={generateTrackingUrl()}
                                target='_blank'
                                className='decoration-black'
                            >
                                <BioType className='body1 text-black text-[16px]'>
                                    {order.tracking_number}
                                </BioType>
                            </a>
                        </div>
                    )}
                    {/* Shipping Address */}
                    <div className='flex flex-col space-y-2'>
                        <BioType className='body1 text-[#00000099] text-[16px]'>
                            Shipping Address
                        </BioType>
                        <div className='flex flex-col'>
                            <BioType className='body1 text-black text-[16px]'>
                                {order.address_line1}
                            </BioType>
                            {order.address_line2 &&
                                order.address_line2 !== '' && (
                                    <BioType className='body1 text-black text-[16px]'>
                                        {order.address_line2}
                                    </BioType>
                                )}
                            <BioType className='body1 text-black text-[16px]'>
                                {order.city}, {order.state} {order.zip}
                            </BioType>
                        </div>
                    </div>
                    {/* Total */}
                    <div className='flex flex-col space-y-2'>
                        <BioType className='body1 text-[#00000099] text-[16px]'>
                            Total
                        </BioType>
                        <BioType className='body1 text-black text-[16px]'>
                            $
                            {order?.price
                                ? Number(order.price).toFixed(2)
                                : priceDataNumber?.toFixed(2)}
                        </BioType>
                    </div>
                    {/* Order Number */}
                    <div className='flex flex-col space-y-2'>
                        <BioType className='body1 text-[#00000099] text-[16px]'>
                            Order Number
                        </BioType>
                        <BioType className='body1 text-black text-[16px]'>
                            {order.order_type === OrderType.Order
                                ? order.id
                                : order.renewal_order_id}
                        </BioType>
                    </div>
                    {/* Receipt Download */}
                    {(order.order_status === 'Payment-Completed' ||
                        order.order_status === 'Approved-CardDown-Finalized' ||
                        (order.order_status &&
                            /Paid/.test(order.order_status))) && (
                        <div className='flex flex-col space-y-2'>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                Receipt
                            </BioType>
                            <BioType className='body1 text-black text-[16px]'>
                                <PDFInvoiceButton
                                    order={order}
                                    personalData={personalData}
                                />
                            </BioType>
                        </div>
                    )}
                </div>
                {order.image_ref && (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${order.image_ref}`}
                        alt={order.name}
                        width={100}
                        height={100}
                        className='rounded-lg md:hidden'
                        sizes='(max-width:  100px)  100vw,  100px'
                        unoptimized
                    />
                )}
            </div>
            {!final && (
                <div className='mx-auto w-[100%] h-[1px] bg-[#1B1B1B1F] mt-4 mb-4'></div>
            )}
        </div>
    );
}
