'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, TextField } from '@mui/material';
import { Fragment, useState } from 'react';
import useSWR from 'swr';

import { getUserStatusTagNotes } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getInternalNotesForPatientId } from '@/app/utils/database/controller/internal_notes/internal-notes-api';
import AddManualInternalNoteDialog from './add-manual-note-dialog';

interface InternalNoteTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: any;
}

export default function InternalNoteTabContent({
    profile_data,
}: InternalNoteTabProps) {
    /**
     * When status tags are written they have notes which are considered internal notes. This pulls those.
     */
    const {
        data: status_tag_notes,
        error: status_tag_error,
        isLoading: status_tags_loading,
        mutate: mutate_status_tags,
    } = useSWR(`${profile_data.id}-status-tag-notes`, () =>
        getUserStatusTagNotes(profile_data.id)
    );

    /**
     * Manual internal notes are written to the internal_notes table in the database.
     * This will pull those
     */
    const {
        data: internal_notes,
        error: internal_notes_error,
        isLoading: internal_notes_loading,
        mutate: mutate_internal_notes,
    } = useSWR(`${profile_data.id}-internal-notes`, () =>
        getInternalNotesForPatientId(profile_data.id)
    );

    const [manualNoteDialogOpen, setManualNoteDialogOpen] =
        useState<boolean>(false);

    /**
     * We concat the status tag notes and the manual internal notes
     * Technically this way will make the manual ones appear in a certain order on the list.
     * A parser might be needed in the future to order them fully by created date.
     */
    const internal_note_records = [
        ...((internal_notes as AllPatientsInternalNoteData[]) || []),
        ...((status_tag_notes?.data as AllPatientsInternalNoteData[]) || []),
    ];

    console.log(internal_note_records);

    if (status_tags_loading || internal_notes_loading) {
        return <LoadingScreen />;
    }

    if (status_tag_error || internal_notes_error) {
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
                    <div className='flex flex-col items-start self-start w-full gap-6 mt-4'>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                setManualNoteDialogOpen(true);
                            }}
                        >
                            Add Manual Internal Note
                        </Button>
                        <AddManualInternalNoteDialog
                            open={manualNoteDialogOpen}
                            onClose={() => setManualNoteDialogOpen(false)}
                            mutate_internal_notes={mutate_internal_notes}
                            patient_id={profile_data.id}
                            internal_note_records={internal_note_records}
                        />
                        {internal_note_records &&
                            internal_note_records.map((note, index) => {
                                return (
                                    <>
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
                                        {note.last_modified_by !==
                                            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a' &&
                                            (note.note ? (
                                                <>
                                                    <InternalNoteTabRow
                                                        note={note}
                                                        key={note.id}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <BioType className='body1'>
                                                        Changed to{' '}
                                                        {note.status_tag} status
                                                        w/o note
                                                    </BioType>
                                                </>
                                            ))}
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
}

interface InternalNoteTabRow {
    note: AllPatientsInternalNoteData;
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
                            {note.first_name
                                ? `Note by ${note.first_name} ${note.last_name}:`
                                : `Note by ${note.employee?.display_name}`}
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
