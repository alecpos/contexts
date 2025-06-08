'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Status } from '@/app/types/global/global-enumerators';
import {
    changeEscalationStatus,
    editEscalationNote,
} from '@/app/utils/database/controller/escalations/escalations-api';
import {
    TableRow,
    TableCell,
    IconButton,
    Button,
    Collapse,
} from '@mui/material';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { KeyedMutator } from 'swr';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditNoteModal from './escalation-note-edit-modal';

interface EscalationTableRowProps {
    escalation_data: {
        id: string | number;
        created_at: string;
        last_updated_at: string;
        metadata: any;
        note: string;
        order_id: string;
        patient_id: string;
        status: string;
        type: string;
        patient: {
            first_name: string;
            last_name: string;
        };
        escalated_by: string;
        escalator: {
            display_name: string;
        };
    };
    mutate: KeyedMutator<PatientEscalationData[]>;
}

export default function EscalationTableRow({
    escalation_data,
    mutate,
}: EscalationTableRowProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [openNoteEditModal, setOpenNoteEditModal] = useState<boolean>(false);

    const markStatusResolved = async () => {
        const result = await changeEscalationStatus(
            escalation_data.id,
            'resolved'
        );
        if (result === Status.Success) {
            mutate();
        }
    };

    const reopenEscalation = async () => {
        const result = await changeEscalationStatus(
            escalation_data.id,
            'pending'
        );

        if (result === Status.Success) {
            mutate();
        }
    };

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

    const editNoteValue = async (newNote: string) => {
        const res = await editEscalationNote(escalation_data.id, newNote);

        if (res === Status.Success) {
            setOpenNoteEditModal(false);
            mutate();
        }
    };

    const renderEscalationType = (type: string) => {
        switch (type) {
            case 'cancel':
                return <BioType>Cancel Order</BioType>;
            case 'new_rx':
                return <BioType>New Rx</BioType>;
            case 'escalate':
                return <BioType>Escalation</BioType>;
        }
    };

    return (
        <Fragment>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    cursor: 'pointer',
                }}
            >
                <TableCell>{escalation_data.order_id}</TableCell>
                <TableCell>
                    {convertTimestamp(escalation_data.created_at)}
                </TableCell>
                <TableCell>
                    {convertTimestamp(escalation_data.last_updated_at)}
                </TableCell>
                <TableCell>
                    {renderEscalationType(escalation_data.type)}
                </TableCell>
                <TableCell>
                    <BioType
                        className={`${
                            escalation_data.status === 'pending'
                                ? 'text-orange-400'
                                : 'text-green-400'
                        }`}
                    >
                        {escalation_data.status.toUpperCase()}
                    </BioType>
                </TableCell>
                <TableCell>
                    <Link href={`all-patients/${escalation_data.patient_id}`}>
                        {escalation_data.patient.first_name}{' '}
                        {escalation_data.patient.last_name}
                    </Link>
                </TableCell>
                <TableCell onClick={() => setOpen(!open)}>
                    {open ? (
                        <IconButton>
                            <KeyboardArrowUpIcon />
                        </IconButton>
                    ) : (
                        <IconButton>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell
                    style={{ paddingBottom: 20, paddingTop: 0 }}
                    colSpan={9}
                >
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <div className='flex flex-col gap-2'>
                            <div>
                                <BioType>
                                    <div className='itd-subtitle'>Note:</div>
                                    <div className='itd-body'>
                                        {escalation_data.note}
                                    </div>
                                </BioType>
                            </div>
                            <div>
                                <BioType className='itd-body'>
                                    <div className='itd-subtitle'>
                                        Email Body:
                                    </div>
                                    <div className='p-2'>
                                        {escalation_data.metadata
                                            .email_content ?? 'No Content'}
                                    </div>
                                </BioType>
                            </div>
                            <div>
                                <BioType>
                                    <div className='itd-subtitle'>
                                        Escalated By:
                                    </div>
                                    {escalation_data?.escalator?.display_name ??
                                        'Not Tracked'}
                                </BioType>
                            </div>
                            <div className='flex flex-row gap-2'>
                                {escalation_data.status === 'pending' ? (
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={markStatusResolved}
                                    >
                                        Mark as resolved
                                    </Button>
                                ) : (
                                    <Button
                                        variant='outlined'
                                        color='warning'
                                        onClick={reopenEscalation}
                                    >
                                        Mark Pending
                                    </Button>
                                )}
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => {
                                        setOpenNoteEditModal(true);
                                    }}
                                >
                                    Update Note
                                </Button>
                                <EditNoteModal
                                    open={openNoteEditModal}
                                    onClose={() => {
                                        setOpenNoteEditModal(false);
                                    }}
                                    note={escalation_data.note}
                                    onSave={editNoteValue}
                                />
                            </div>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}
