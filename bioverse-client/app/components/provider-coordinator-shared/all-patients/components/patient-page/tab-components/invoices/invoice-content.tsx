import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Collapse,
    IconButton,
    Button,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import { convertPaymentIntentToInvoiceTableItem } from './functions/invoice-content-functions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getCustomerPaymentIntents } from '@/app/services/stripe/paymentIntent';
import {
    createRefundForPaymentIntent,
    getPaymentIntentRefunds,
} from '@/app/services/stripe/refunds';
import Stripe from 'stripe';
import dynamic from 'next/dynamic';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import { createRechargeForPayment } from '@/app/services/stripe/recharge';
import RefundHistoryDialog from './components/refund-history-modal';
import { isEmpty } from 'lodash';

const DynamicRefundConfirmationDialog = dynamic(
    () => import('../invoices/components/invoice-refund-dialog'),
    {
        loading: () => <></>,
    }
);

const DynamicRechargeConfirmationDialog = dynamic(
    () => import('../invoices/components/invoice-recharge-dialog'),
    {
        loading: () => <></>,
    }
);

interface InvoiceTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

export default function InvoiceTab({
    profile_data,
    access_type,
}: InvoiceTabProps) {
    const [invoices, setInvoices] = useState<InvoiceTableItem[]>([]);

    const { data: payment_intent_list } = useSWR(
        `${profile_data.id}-payment-intents`,
        () => getCustomerPaymentIntents(profile_data.stripe_customer_id)
    );

    const redirectToPatientStripe = () => {
        window.open(
            `https://dashboard.stripe.com/customers/${profile_data.stripe_customer_id}`,
            '_blank'
        );
    };

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

                {determineAccessByRoleName(
                    access_type,
                    BV_AUTH_TYPE.LEAD_COORDINATOR
                ) && (
                    <div className='flex flex-col justify-start items-start w-full'>
                        <BioType
                            className='h6 text-primary underline hover:cursor-pointer'
                            onClick={redirectToPatientStripe}
                        >
                            Patient Stripe
                        </BioType>
                    </div>
                )}

                <div className='flex flex-col w-full justify-center items-center body1'>
                    <div className='flex flex-col w-full justify-center items-center'>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650, width: '100%' }}
                                aria-label='simple table'
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Amount Due</TableCell>
                                        <TableCell>Amount Refunded</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Charge Type</TableCell>
                                        {/* <TableCell>Refund</TableCell> */}
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                {invoices && (
                                    <TableBody>
                                        {invoices.map((invoice, index) => (
                                            <InvoiceTableRow
                                                stripe_customer_id={
                                                    profile_data.stripe_customer_id
                                                }
                                                invoice={invoice}
                                                key={invoice.id as string}
                                                access_type={access_type}
                                            />
                                        ))}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

interface InvoiceTableRowProps {
    stripe_customer_id: string;
    invoice: InvoiceTableItem;
    access_type: BV_AUTH_TYPE | null;
}

function InvoiceTableRow({
    stripe_customer_id,
    invoice,
    access_type,
}: InvoiceTableRowProps) {
    const [open, setOpen] = useState(false);
    const [refundInformation, setRefundInformation] =
        useState<Stripe.Refund[]>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [rechargeDialogOpen, setRechargeDialogOpen] =
        useState<boolean>(false);

    const [refundSuccessSnackbarOpen, setRefundSuccessSnackbarState] =
        useState<boolean>(false);
    const [refundFailureSnackbarOpen, setRefundFailureSnackbarState] =
        useState<boolean>(false);

    const [rechargeSuccessSnackbarOpen, setRechargeSuccessSnackbarState] =
        useState<boolean>(false);
    const [rechargeFailureSnackbarOpen, setRechargeFailureSnackbarState] =
        useState<boolean>(false);

    const [refundHistoryModalOpen, setRefundHistoryModalOpenState] =
        useState<boolean>(false);

    const openRefundHistoryModal = () => {
        setRefundHistoryModalOpenState(true);
    };

    const closeRefundHistoryModal = () => {
        setRefundHistoryModalOpenState(false);
    };

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

    const getTotalRefundAmount = (): number => {
        let totalRefunded = 0;
        if (refundInformation) {
            refundInformation.forEach((stripe_refund_object) => {
                totalRefunded += stripe_refund_object.amount;
            });
        }

        return totalRefunded;
    };

    const openStripeInvoiceInNewTab = () => {
        const url = `https://dashboard.stripe.com/payments/${invoice.id}`;
        window.open(url, '_blank');
    };

    const createRefund = async (reason: string, amount: number) => {
        const result = await createRefundForPaymentIntent(
            invoice.id,
            amount,
            reason
        );
        if (result.status === 'success') {
            setRefundSuccessSnackbarState(true);
            setDialogOpen(false);
        } else {
            setRefundFailureSnackbarState(true);
        }
    };

    const createRecharge = async (reason: string, amount: number) => {
        const result = await createRechargeForPayment(
            stripe_customer_id,
            invoice,
            amount,
            reason
        );
        if (result.status === 'success') {
            setRechargeSuccessSnackbarState(true);
            setRechargeDialogOpen(false);
        } else {
            setRechargeFailureSnackbarState(true);
        }
    };

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
            <TableRow
                sx={{
                    // '& > *': { borderBottom: 'unset' },
                    cursor: 'pointer',
                }}
                onClick={() => setOpen(!open)}
            >
                <TableCell>{invoice.description}</TableCell>
                <TableCell>{parseStripeStatus(invoice.status)}</TableCell>
                <TableCell>${invoice.amountDue / 100}</TableCell>
                <TableCell>
                    {refundInformation && refundInformation?.length > 0
                        ? (getTotalRefundAmount() / 100).toFixed(2)
                        : '-'}
                </TableCell>
                <TableCell>{invoice.created}</TableCell>
                <TableCell>{invoice.productName}</TableCell>
                <TableCell>{invoice.chargeType}</TableCell>
                {/* <TableCell>
                    {refundInformation ? refundInformation.status : '-'}
                </TableCell> */}
                <TableCell>
                    <IconButton aria-label='expand row' size='small'>
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0, width: '100%' }}
                    colSpan={9}
                >
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <div className='flex flex-row p-4 gap-20'>
                            <div className='flex flex-col gap-2'>
                                <BioType className='body1 text-[22px]'>
                                    Invoice Stripe Link:
                                </BioType>
                                <div onClick={openStripeInvoiceInNewTab}>
                                    <BioType className='text-primary body1 hover:underline cursor-pointer'>
                                        Go to Stripe Invoice
                                    </BioType>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <BioType className='text-[22px] body1'>
                                    Refunds:
                                </BioType>

                                {!isEmpty(refundInformation) && (
                                    <>
                                        <div>
                                            <BioType
                                                className='body1 hover:underline text-primary cursor-pointer'
                                                onClick={openRefundHistoryModal}
                                            >
                                                View Refund History
                                            </BioType>
                                        </div>
                                        <div>
                                            <BioType>
                                                Original amount:{' '}
                                                {invoice.amountDue / 100}
                                            </BioType>
                                            <BioType>
                                                Refunded amount:{' '}
                                                {(
                                                    getTotalRefundAmount() / 100
                                                ).toFixed(2)}
                                            </BioType>
                                            <BioType>
                                                Amount remaining:{' '}
                                                {(
                                                    invoice.amountDue / 100 -
                                                    getTotalRefundAmount() / 100
                                                ).toFixed(2)}
                                            </BioType>
                                        </div>
                                    </>
                                )}

                                {determineAccessByRoleName(
                                    access_type,
                                    BV_AUTH_TYPE.LEAD_COORDINATOR
                                ) && (
                                    <>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            onClick={() => {
                                                setDialogOpen(true);
                                            }}
                                        >
                                            Refund Charge
                                        </Button>

                                        {!invoice.description.includes(
                                            'Recharge'
                                        ) && (
                                            <Button
                                                variant='contained'
                                                color='error'
                                                onClick={() => {
                                                    setRechargeDialogOpen(true);
                                                }}
                                            >
                                                Recharge
                                            </Button>
                                        )}
                                    </>
                                )}

                                {/* <RefundConfirmationDialog
                                    open={refundHistoryModalOpen}
                                    onClose={closeRefundHistoryModal}
                                    payment_intent_id={invoice.id}
                                /> */}

                                <RefundHistoryDialog
                                    open={refundHistoryModalOpen}
                                    onClose={closeRefundHistoryModal}
                                    payment_intent_id={
                                        invoice.payment_intent_data.id
                                    }
                                />

                                <DynamicRefundConfirmationDialog
                                    open={dialogOpen}
                                    onClose={() => {
                                        setDialogOpen(false);
                                    }}
                                    onConfirm={createRefund}
                                    total={
                                        invoice.amountDue -
                                        (refundInformation
                                            ? getTotalRefundAmount()
                                            : 0)
                                    }
                                />
                                <DynamicRechargeConfirmationDialog
                                    open={rechargeDialogOpen}
                                    onClose={() => {
                                        setRechargeDialogOpen(false);
                                    }}
                                    onConfirm={createRecharge}
                                    total={
                                        invoice.amountDue -
                                        (refundInformation
                                            ? getTotalRefundAmount()
                                            : 0)
                                    }
                                />

                                <BioverseSnackbarMessage
                                    open={refundSuccessSnackbarOpen}
                                    setOpen={setRefundSuccessSnackbarState}
                                    color={'success'}
                                    message={
                                        'The Refund has been created, rest assured and keep up the great work you amazing person 🚀'
                                    }
                                />

                                <BioverseSnackbarMessage
                                    open={refundFailureSnackbarOpen}
                                    setOpen={setRefundFailureSnackbarState}
                                    color={'error'}
                                    message={
                                        'There was an error that happened while creating the refund. Please notify Nathan. 🆘'
                                    }
                                />
                                <BioverseSnackbarMessage
                                    open={rechargeSuccessSnackbarOpen}
                                    setOpen={setRechargeSuccessSnackbarState}
                                    color={'success'}
                                    message={
                                        'The Recharge has been created, rest assured and keep up the great work you amazing person 🚀'
                                    }
                                />

                                <BioverseSnackbarMessage
                                    open={rechargeFailureSnackbarOpen}
                                    setOpen={setRechargeFailureSnackbarState}
                                    color={'error'}
                                    message={
                                        'There was an error that happened while creating the recharge. Please notify Nathan. 🆘'
                                    }
                                />
                            </div>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}
