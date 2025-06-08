'use client';

import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { getAllEscalations } from '@/app/utils/database/controller/escalations/escalations-api';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material';
import useSWR from 'swr';
import EscalationTableRow from './escalation-table-row';
import { Fragment } from 'react';

interface EscalationDashboardContainerProps {}

export default function EscalationDashboardContainer() {
    const { data, isLoading, error, mutate } = useSWR(`escalations`, () =>
        getAllEscalations()
    );

    console.log(data);

    return (
        <div className='flex flex-col mt-10'>
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
                                            Order ID
                                        </TableCell>
                                        <TableCell className='itd-subtitle'>
                                            Escalated At
                                        </TableCell>
                                        <TableCell className='itd-subtitle'>
                                            Last Updated
                                        </TableCell>
                                        <TableCell className='itd-subtitle'>
                                            Type
                                        </TableCell>
                                        <TableCell className='h6medium'>
                                            Status
                                        </TableCell>
                                        <TableCell className='h6medium'>
                                            Patient
                                        </TableCell>
                                        <TableCell className='itd-subtitle'>
                                            Expand
                                        </TableCell>
                                    </TableRow>
                                    {data!?.map((escalation) => {
                                        return (
                                            <Fragment key={escalation.id}>
                                                <EscalationTableRow
                                                    escalation_data={escalation}
                                                    mutate={mutate}
                                                    key={escalation.id}
                                                />
                                            </Fragment>
                                        );
                                    })}
                                </TableHead>
                            </Table>
                        </div>
                    </TableContainer>
                </div>
            )}
        </div>
    );
}
