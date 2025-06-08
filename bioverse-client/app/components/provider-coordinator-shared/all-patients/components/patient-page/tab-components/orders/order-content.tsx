'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getPatientOrderTabData } from '@/app/utils/database/controller/orders/orders-api';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Button,
} from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { getRenewalOrdersForTab } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import RenewalOrderTabRow from './components/RenewalOrderTabRow';
import { listCustomerPaymentMethods } from '@/app/services/stripe/customer';
import ManualOrderCreationDialog from './components/components/ManualOrderCreationDialog';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import OrderTabRow from './components/order-tab-row';
import React from 'react';

interface OrderTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}
export default function OrderTabContent({
    profile_data,
    access_type,
}: OrderTabProps) {
    const [createNewOrderOpen, setCreateNewOrderOpen] =
        useState<boolean>(false);
    const {
        data: orders,
        error,
        isLoading,
        mutate: mutate_orders,
    } = useSWR(`orders-${profile_data.id}`, () =>
        getPatientOrderTabData(profile_data.id)
    );

    const {
        data: renewalOrders,
        error: renewalOrdersError,
        isLoading: renewalOrdersLoading,
    } = useSWR(`renewal-orders-${profile_data.id}`, () =>
        getRenewalOrdersForTab(profile_data.id)
    );

    const { data: stripe_payment_data } = useSWR(
        `${profile_data.id}-stripe-payment-data`,
        () => listCustomerPaymentMethods(profile_data.stripe_customer_id)
    );

    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>(
        'success'
    );
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    if (stripe_payment_data) {
    }

    const orderArr = orders?.data as OrderTabOrder[];

    if (isLoading || renewalOrdersLoading) {
        return <LoadingScreen />;
    }

    if (error || renewalOrdersError) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <>
            <div className='flex flex-col w-full justify-center items-center gap-4 mt-4'>
                <div className='flex flex-row w-full justify-center items-center'>
                    <BioType className='h5'>Order Information</BioType>
                </div>

                {stripe_payment_data && (
                    <>
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.COORDINATOR
                        ) && (
                            <div className='flex flex-row self-start'>
                                <Button
                                    sx={{ 
                                        borderRadius: '12px', 
                                        backgroundColor: 'black',
                                        paddingX: '32px',
                                        paddingY: '14px',
                                        ":hover": {
                                            backgroundColor: 'darkslategray',
                                        }
                                    }}
                                    onClick={() => {
                                        setCreateNewOrderOpen(true);
                                    }}
                                >
                                    <span className='normal-case provider-bottom-button-text  text-white'>+ Manual Create Order</span>
                                </Button>
                            </div>
                        )}
                        <ManualOrderCreationDialog
                            profile_data={profile_data}
                            stripe_data={JSON.parse(stripe_payment_data).data}
                            open={createNewOrderOpen}
                            onClose={() => {
                                setCreateNewOrderOpen(false);
                            }}
                            setShowSnackbar={setShowSnackbar}
                            setSnackbarMessage={setSnackbarMessage}
                            setSnackbarStatus={setSnackbarStatus}
                        />
                    </>
                )}

                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    <div className='flex flex-col items-start self-start w-full gap-2'>
                        <TableContainer component={Paper}>
                            <div style={{ padding: '0 32px' }}>
                                <Table aria-label='collapsible table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='h6medium'>
                                                Bioverse Order ID
                                            </TableCell>
                                            <TableCell className='h6medium'>
                                                Product
                                            </TableCell>
                                            <TableCell className='h6medium'></TableCell>
                                            <TableCell className='h6medium'>
                                                Created At
                                            </TableCell>
                                            <TableCell className='h6medium'>
                                                Order Status
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                        {orderArr?.map((dataRow) => {
                                            return (
                                                <OrderTabRow
                                                    order_data={dataRow}
                                                    key={dataRow.id}
                                                    mutate_orders={
                                                        mutate_orders
                                                    }
                                                    access_type={access_type}
                                                    profile_data={profile_data}
                                                />
                                            );
                                        })}
                                        {renewalOrders?.map((renewalOrder) => {
                                            return (
                                                <RenewalOrderTabRow
                                                    renewalOrder={renewalOrder}
                                                    access_type={access_type}
                                                    key={
                                                        renewalOrder.renewal_order_id
                                                    }
                                                    profile_data={profile_data}
                                                    mutate_orders={
                                                        mutate_orders
                                                    }
                                                />
                                            );
                                        })}
                                    </TableHead>
                                </Table>
                            </div>
                        </TableContainer>
                    </div>
                )}
                <BioverseSnackbarMessage
                    color={snackbarStatus}
                    message={snackbarMessage}
                    open={showSnackbar}
                    setOpen={setShowSnackbar}
                />
            </div>
        </>
    );
}
