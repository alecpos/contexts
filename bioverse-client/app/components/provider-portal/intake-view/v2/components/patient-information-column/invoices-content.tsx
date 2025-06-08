import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
// import { convertPaymentIntentToInvoiceTableItem } from './functions/invoice-content-functions';
import { getCustomerPaymentIntents } from '@/app/services/stripe/paymentIntent';
import { getPaymentIntentRefunds } from '@/app/services/stripe/refunds';
import Stripe from 'stripe';
import { getCustomerStripeId } from '@/app/utils/database/controller/profiles/profiles';
import { convertPaymentIntentToInvoiceTableItem } from '@/app/components/provider-coordinator-shared/all-patients/components/patient-page/tab-components/invoices/functions/invoice-content-functions';

interface InvoiceTabProps {
    patient_data: DBPatientData;
    isOpenInvoices: boolean;
}

export default function InvoiceTab({
    patient_data,
    isOpenInvoices,
}: InvoiceTabProps) {
    const router = useRouter();
    const [invoices, setInvoices] = useState<InvoiceTableItem[]>([]);

    const [stripeCustomerId, setStripeCustomerId] = useState<string>('');

    const { data } = useSWR(
        isOpenInvoices ? `subscriptions-${patient_data.id}` : null,
        () => getCustomerStripeId(patient_data.id)
    );

    const {
        data: payment_intent_list,
        error: error_pi,
        isLoading: loading_pi,
    } = useSWR(
        stripeCustomerId ? `${patient_data.id}-payment-intents` : null,
        () => getCustomerPaymentIntents(stripeCustomerId)
    );

    const redirectToPatientStripe = () => {
        window.open(
            `https://dashboard.stripe.com/customers/${stripeCustomerId}`,
            '_blank'
        );
    };

    useEffect(() => {
        if (data) {
            const stripe_id = data.data?.stripe_customer_id;
            setStripeCustomerId(stripe_id);
        }
    }, [data]);

    useEffect(() => {
        if (payment_intent_list) {
            const converted_list: InvoiceTableItem[] =
                convertPaymentIntentToInvoiceTableItem(payment_intent_list);
            setInvoices(converted_list);
        }
    }, [payment_intent_list]);

    return (
        <>
            <div className='flex flex-col w-full gap-4 mt-4'>
                <div className='flex flex-row w-full justify-center items-center'>
                    <BioType className='h5'>Invoices</BioType>
                </div>

                <div className='flex flex-col justify-start items-start w-full'>
                    <BioType
                        className='h6 text-primary underline hover:cursor-pointer'
                        onClick={redirectToPatientStripe}
                    >
                        Patient Stripe
                    </BioType>
                </div>

                <div className='flex flex-col w-full justify-center items-center body1'>
                    <div className='flex flex-col w-full'>
                        {invoices && (
                            <>
                                {invoices.map((invoice, index) => (
                                    <InvoiceTableRow
                                        invoice={invoice}
                                        key={invoice.id as string}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

interface InvoiceTableRowProps {
    invoice: InvoiceTableItem;
}

function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
    const [open, setOpen] = useState(false);
    const [refundInformation, setRefundInformation] =
        useState<Stripe.Refund[]>();

    const {
        data: refund_data,
        error: error_refund,
        isLoading: loading_refund,
    } = useSWR(`${invoice.id}-refund-data`, () =>
        getPaymentIntentRefunds(invoice.id)
    );

    useEffect(() => {
        if (refund_data) {
            setRefundInformation(refund_data);
        }
    }, [refund_data]);

    const parseStripeStatus = (status: string) => {
        switch (status) {
            case 'succeeded':
                return 'Payment Complete';

            case 'requires_payment_method':
                return 'Retrying Payment';

            case 'canceled':
                return 'Invoice Canceled';
        }
    };

    return (
        <Fragment>
            <div className='flex flex-col gap-2 mb-6'>
                <BioType className='itd-subtitle'>
                    {invoice.description}
                </BioType>
                <BioType className='flex flex-col '>
                    <span className='itd-input'>Subscription Status: </span>
                    <span className='itd-body'>
                        {parseStripeStatus(invoice.status)}
                    </span>
                </BioType>
                <BioType className='flex flex-col '>
                    <span className='itd-input'>Amount due: </span>
                    <span className='itd-body'>${invoice.amountDue / 100}</span>
                </BioType>
                <BioType className='flex flex-col '>
                    <span className='itd-input'>Created at: </span>
                    <span className='itd-body'>{invoice.created}</span>
                </BioType>
                <BioType className='flex flex-col '>
                    <span className='itd-input'>Charge type: </span>
                    <span className='itd-body'>{invoice.chargeType}</span>
                </BioType>
            </div>
        </Fragment>
    );
}
