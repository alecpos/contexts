'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { fetchHistoryLogsForPatient } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientHistoryTaskName } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesModal from './components/NotesModal';

interface PatientHistoryLogsProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

export default function PatientHistoryLogs({
    access_type,
    profile_data,
}: PatientHistoryLogsProps) {
    const {
        data: logsData,
        error: logsError,
        isLoading: logsLoading,
    } = useSWR(`${profile_data.id}-logs`, () =>
        fetchHistoryLogsForPatient(profile_data.id),
    );

    const [openNotes, setOpenNotes] = useState<boolean>(false);
    const [currentNotes, setCurrentNotes] = useState<any>({});

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <>
            <div className="flex flex-col w-full gap-4 mt-4">
                <div className="flex flex-row w-full justify-center items-center">
                    <BioType className="h5">Patient History Logs</BioType>
                </div>

                <div className="flex flex-col w-full justify-center items-center body1">
                    <div className="flex flex-col w-full justify-center items-center">
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650, width: '100%' }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Log ID</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Task Name</TableCell>
                                        <TableCell>Notes</TableCell>
                                        {/* <TableCell>Refund</TableCell> */}
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                {logsData && (
                                    <TableBody>
                                        {logsData.map((log, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{log.id}</TableCell>
                                                <TableCell>
                                                    {convertTimestamp(
                                                        log.created_at,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        PatientHistoryTaskName[
                                                            log.task_name
                                                        ]
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setCurrentNotes(
                                                                typeof log.notes ===
                                                                    'string'
                                                                    ? JSON.parse(
                                                                          log.notes,
                                                                      )
                                                                    : log.notes,
                                                            );
                                                            setOpenNotes(true);
                                                        }}
                                                    >
                                                        <DescriptionIcon />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <NotesModal
                isModalOpen={openNotes}
                setIsModalOpen={setOpenNotes}
                notes={currentNotes}
            />
        </>
    );
}
