'use client';

import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { getInternalNotesForPatientId } from '@/app/utils/database/controller/internal_notes/internal-notes-api';
import useSWR from 'swr';
import InternalNoteItem from './internal-note-item';
import { getUserStatusTagNotes } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import StatusTagNoteItem from './status-tag-note-item';

interface InternalNotesAccordionProps {
    patientId: string;
}

async function fetchInternalNotesData(patientId: string) {
    const [internalNotes, statusTagNotes] = await Promise.all([
        getInternalNotesForPatientId(patientId),
        getUserStatusTagNotes(patientId),
    ]);

    return {
        internalNotes,
        statusTagNotes,
    };
}

export default function ProviderInternalNotesAccordionContent({
    patientId,
}: InternalNotesAccordionProps) {
    const { data, isLoading } = useSWR(
        patientId ? `${patientId}-notes` : null,
        () => fetchInternalNotesData(patientId),
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!data) {
        return null;
    }

    const combinedNotes = [data.internalNotes, data.statusTagNotes.data]
        .flat()
        .sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    return (
        <>
            <div className="flex flex-col overflow-auto h-full gap-4">
                {combinedNotes &&
                    combinedNotes.map((note, index) => {
                        if (note.first_name) {
                            return (
                                <StatusTagNoteItem
                                    statusTagNoteData={note}
                                    key={index}
                                />
                            );
                        } else if (note.employee) {
                            return (
                                <InternalNoteItem
                                    noteData={note}
                                    key={index}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
            </div>
        </>
    );
}
