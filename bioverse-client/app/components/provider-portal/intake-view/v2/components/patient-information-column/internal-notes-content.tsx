'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import useSWR from 'swr';
import { Fragment, useEffect, useState } from 'react';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { getUserStatusTagNotes } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { TextField } from '@mui/material';
import React from 'react';

interface InternalNotesContent {
    patient_id: string;
    product_href: string;
    isOpenInternalNotes: boolean;
}

export default function InternalNotesAccordionContent({
    patient_id,
    product_href,
    isOpenInternalNotes,
}: InternalNotesContent) {
    const { data, error, isLoading } = useSWR(
        isOpenInternalNotes ? `${patient_id}-internal-notes` : null,
        () => getUserStatusTagNotes(patient_id)
    );

    const internal_note_records = data?.data as PatientStatusTagsSBR[];

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error || !internal_note_records) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <div className='flex flex-col w-full gap-4'>
            <div className='flex flex-col w-full justify-center items-center gap-4'>
                <div className='flex flex-col w-full justify-center items-center mt-4'>
                    <div className='flex flex-col items-start self-start w-full gap-6 mt-4'>
                        {internal_note_records &&
                            internal_note_records.map((note, index) => {
                                return (
                                    <div key={index}>
                                        {index == 0 ||
                                        internal_note_records[index].order_id !=
                                            internal_note_records[index - 1]
                                                .order_id ? (
                                            <BioType className='h5'>
                                                Order{' '}
                                                {
                                                    internal_note_records[index]
                                                        .order_id
                                                }
                                            </BioType>
                                        ) : (
                                            <></>
                                        )}

                                        {note.note ? (
                                            <>
                                                <InternalNoteTabRow
                                                    note={note}
                                                    key={note.id}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <BioType className='body1'>
                                                    Changed to {note.status_tag}{' '}
                                                    status
                                                </BioType>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InternalNoteTabRow {
    note: PatientStatusTagsSBR;
}

function InternalNoteTabRow({ note }: InternalNoteTabRow) {
    const [open, setOpen] = useState(false);

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

    const convertStatus = (status: string) => {
        if (status === 'Incomplete') {
            return (
                <>
                    <BioType className='body1 text-red-600'>Incomplete</BioType>
                </>
            );
        }

        return (
            <>
                <BioType className='body1 text-primary'>Complete</BioType>
            </>
        );
    };

    return (
        <>
            <Fragment>
                <div className='flex flex-col justify-start items-start gap-4 w-full'>
                    <div className='flex flex-col w-full'>
                        <BioType className='h6'>
                            Note by {note.first_name} {note.last_name}:
                        </BioType>

                        <BioType className='body1'>
                            {note.status_tag} status
                        </BioType>
                        <BioType className='body1'>
                            {convertTimestamp(
                                note.created_at?.toString() as string
                            )}
                        </BioType>

                        <TextField
                            disabled
                            fullWidth
                            value={note.note}
                            multiline
                            sx={{
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: '#1B1B1BDE',
                                },
                            }}
                        />
                    </div>
                </div>
            </Fragment>
        </>
    );
}
