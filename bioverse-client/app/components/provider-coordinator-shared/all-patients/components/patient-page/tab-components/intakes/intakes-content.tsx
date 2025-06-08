'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    IconButton,
    Collapse,
} from '@mui/material';
import { Fragment, useState } from 'react';
import useSWR from 'swr';
import { obtainIntakeTabData } from './intake-tab-function';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import { ActionItemType } from '@/app/types/action-items/action-items-types';
import RenewalIntakeTabRow from './components/renewal-intake-tab-row';
import IntakeTabRow from './components/intake-tab-row';
import React from 'react';

interface IntakesTabContentProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: any;
}

export default function IntakesTabContent({
    profile_data,
    access_type,
}: IntakesTabContentProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { data, error, isLoading } = useSWR(
        `orders-and-checks-${profile_data.id}`,
        () => obtainIntakeTabData(profile_data.id)
    );

    const orderArr = data?.order_data as OrderTabOrder[];
    const renewalArr = data?.renewal_data;

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <>
            <div className='flex flex-col w-full justify-center items-center gap-4 mt-4'>
                <div className='flex flex-col w-full justify-center items-center mt-4'>
                    <BioType className='h5'>Patient Intakes</BioType>

                    <div className='flex flex-col items-start self-start w-full gap-2 mt-4'>
                        <TableContainer component={Paper}>
                            <div style={{ padding: '0 32px' }}>
                                <Table aria-label='collapsible table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='body1bold'>
                                                BV Order #
                                            </TableCell>
                                            <TableCell className='body1'>
                                                Start Date
                                            </TableCell>
                                            <TableCell className='body1'>
                                                Completion Date
                                            </TableCell>
                                            <TableCell className='body1'>
                                                Status
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                        {orderArr &&
                                            orderArr.map((order) => {
                                                return (
                                                    <IntakeTabRow
                                                        order={order}
                                                        key={order.id}
                                                    />
                                                );
                                            })}
                                        {renewalArr &&
                                            renewalArr.map(
                                                (
                                                    actionItem: ActionItemType
                                                ) => {
                                                    return (
                                                        <Fragment
                                                            key={actionItem.id}
                                                        >
                                                            <RenewalIntakeTabRow
                                                                actionItem={
                                                                    actionItem
                                                                }
                                                            />
                                                        </Fragment>
                                                    );
                                                }
                                            )}
                                        {/* {dosageArr &&
                                            dosageArr.map(
                                                (suggestion_item, index) => {
                                                    return (
                                                        <DosageSuggestionTabRow
                                                            dosage_suggestion_data={
                                                                suggestion_item
                                                            }
                                                            key={index}
                                                        />
                                                    );
                                                }
                                            )} */}
                                    </TableHead>
                                </Table>
                            </div>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    );
}
