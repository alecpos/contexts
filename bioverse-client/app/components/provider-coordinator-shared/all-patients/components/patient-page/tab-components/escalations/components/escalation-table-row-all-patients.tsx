'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { TableRow, TableCell, Collapse, Button } from '@mui/material';
import { Fragment, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { KeyedMutator, MutatorCallback, MutatorOptions } from 'swr';
import EditEscalationNoteDialog from './edit-escalation-note-dialog';
import { Status } from '@/app/types/global/global-enumerators';
import { changeEscalationStatus } from '@/app/utils/database/controller/escalations/escalations-api';

interface EscalationTabRowProps {
    escalation_data: PatientEscalationData;
    mutate_escalations: KeyedMutator<PatientEscalationData[]>;
}

export default function EscalationTableRowAllPatients({
    escalation_data,
    mutate_escalations,
}: EscalationTabRowProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

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

    const convertTypeToReadable = (type: string) => {
        switch (type) {
            case 'escalate':
                return 'Escalation';
            case 'new_rx':
                return 'New Rx';
            case 'cancel':
                return 'Cancellation';
        }
    };

    const capitalizeFirstChar = (str: string | null) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const markStatusResolved = async () => {
        const result = await changeEscalationStatus(
            escalation_data.id,
            'resolved'
        );
        if (result === Status.Success) {
            mutate_escalations();
        }
    };

    const reopenEscalation = async () => {
        const result = await changeEscalationStatus(
            escalation_data.id,
            'pending'
        );

        if (result === Status.Success) {
            mutate_escalations();
        }
    };

    return (
        <Fragment>
            <TableRow sx={{ width: '100%' }}>
                <TableCell component='th' className='body1 '>
                    <BioType>
                        {capitalizeFirstChar(escalation_data.assigned_pharmacy)}
                    </BioType>
                </TableCell>
                <TableCell component='th' className='body1 '>
                    <BioType>
                        {convertTypeToReadable(escalation_data.type)}
                    </BioType>
                </TableCell>
                <TableCell component='th' className='body1'>
                    <BioType>
                        {convertTimestamp(escalation_data.created_at)}
                    </BioType>
                </TableCell>
                <TableCell component='th' className='body1 '>
                    <BioType>{escalation_data.status}</BioType>
                </TableCell>
                <TableCell component='th' className='body1'>
                    <BioType>
                        {convertTimestamp(escalation_data.last_updated_at)}
                    </BioType>
                </TableCell>
                <TableCell
                    component='th'
                    className='body1 text-primary'
                    onClick={() => setOpen(!open)}
                    sx={{
                        cursor: 'pointer',
                    }}
                >
                    <BioType>
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </BioType>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <div className='flex flex-row justify-start items-start gap-20 px-4 py-6'>
                            <div className='flex flex-col'>
                                <BioType className='it-body'>
                                    <span className='it-subtitle'>
                                        Patient Name:{' '}
                                    </span>
                                    {escalation_data.patient.first_name}{' '}
                                    {escalation_data.patient.last_name}
                                </BioType>
                                <BioType className='it-subtitle'>
                                    Escalation Note:
                                </BioType>
                                <BioType className='it-body'>
                                    {escalation_data.note}
                                </BioType>

                                <div className='flex p-2 flex-row gap-2'>
                                    <Button
                                        variant='outlined'
                                        onClick={() => {
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        Edit Note
                                    </Button>
                                    <EditEscalationNoteDialog
                                        escalation_id={escalation_data.id}
                                        open={editDialogOpen}
                                        handleClose={() => {
                                            setEditDialogOpen(false);
                                        }}
                                        current_note={escalation_data.note}
                                        mutate_escalations={mutate_escalations}
                                    />
                                    {escalation_data.status === 'pending' ? (
                                        <Button
                                            variant='contained'
                                            color='success'
                                            onClick={markStatusResolved}
                                        >
                                            Mark as resolved
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='contained'
                                            color='warning'
                                            onClick={reopenEscalation}
                                        >
                                            Mark Pending
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}
