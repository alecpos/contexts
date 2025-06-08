'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getAllPatientEscalations } from '@/app/utils/database/controller/escalations/escalations-api';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
import EscalationTableRowAllPatients from './components/escalation-table-row-all-patients';

interface OrderTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}
export default function EscalationTabAllPatientsContent({
    profile_data,
    access_type,
}: OrderTabProps) {
    const {
        data: escalations,
        error,
        isLoading,
        mutate: mutate_escalations,
    } = useSWR(`${profile_data.id}-escalations`, () =>
        getAllPatientEscalations(profile_data.id)
    );

    console.log(escalations);

    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>(
        'success'
    );
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

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
                <div className='flex flex-row w-full justify-center items-center'>
                    <BioType className='h5'>Escalations</BioType>
                </div>

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
                                                Pharmacy
                                            </TableCell>
                                            <TableCell className='h6medium'>
                                                Issue Type
                                            </TableCell>
                                            <TableCell className='h6medium'>
                                                Escalated Date
                                            </TableCell>
                                            <TableCell className='h6medium'>
                                                Escalation Status
                                            </TableCell>
                                            <TableCell className='h6medium'>
                                                Last Updated At
                                            </TableCell>
                                            <TableCell id='escalation-accordion-expand-column'></TableCell>
                                        </TableRow>
                                        {escalations?.map(
                                            (escalation_data: any) => {
                                                return (
                                                    <>
                                                        <EscalationTableRowAllPatients
                                                            escalation_data={
                                                                escalation_data
                                                            }
                                                            mutate_escalations={
                                                                mutate_escalations
                                                            }
                                                        />
                                                    </>
                                                );
                                            }
                                        )}
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
