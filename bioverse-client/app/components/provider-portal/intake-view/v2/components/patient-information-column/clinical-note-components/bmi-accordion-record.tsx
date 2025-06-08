'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Alert,
    Button,
    CircularProgress,
    Snackbar,
    Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BMIEditModal from './bmi-edit-modal';
import { updateClinicalNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { mutate } from 'swr';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar-v2';

interface BMIAccodrionRecordProps {
    bmi_note_data: ClinicalNotesV2Supabase;
    initial_note?: string | null;
    last_note?: ClinicalNotesV2Supabase | null;
}

export default function BMIAccordionRecord({
    bmi_note_data,
    initial_note,
    last_note,
}: BMIAccodrionRecordProps) {
    const [noteValue, setNoteValue] = useState<string | undefined>(
        bmi_note_data.note
    );
    const [editingNote, setEditingNote] = useState<boolean>(false);
    const [noteHasBeenEdited, setNoteHasBeenEdited] = useState<boolean>(false);
    const [isUpdatingBMINote, setIsUpdatingBMINote] = useState<boolean>(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] =
        useState<boolean>(false);

    useEffect(() => {
        if (noteValue !== bmi_note_data.note) {
            setNoteHasBeenEdited(true);
        } else {
            setNoteHasBeenEdited(false);
        }
    }, [noteValue]);

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    function converteTimestamp2(isoString: string): string {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    }

    const updateBMIRecord = async () => {
        setIsUpdatingBMINote(true);

        const current_provider_id = (await readUserSession()).data.session?.user
            .id;

        if (!current_provider_id) {
            setErrorSnackbarOpen(true);
            return;
        }

        const { data, error } = await updateClinicalNote(
            bmi_note_data.id!,
            noteValue!,
            current_provider_id,
            bmi_note_data.note,
            bmi_note_data.last_modified_at ?? undefined,
            bmi_note_data.created_at ?? undefined
        );

        console.log('data: ', data);
        if (!data) {
            setErrorSnackbarOpen(true);
            setIsUpdatingBMINote(false);

            return;
        } else {
            mutate(`${bmi_note_data.patient_id}-clinical-notes`);
            setIsUpdatingBMINote(false);
            setEditingNote(false);
            setNoteHasBeenEdited(false);
            setSuccessSnackbarOpen(true);
            return;
        }
    };

    //bmi notes come in a string format, this function converts the string to an object
    const convertNoteValueStringToObject = (
        noteValue: string | undefined
    ): {
        ogNote: string;
        heightF: number;
        heightI: number;
        weight: number;
        bmi: number;
    } | null => {
        if (!noteValue) {
            //if noteValue is null, then maybe the the weight value is in metadata, we'll use height from initial_note
            //The long term solution would be to change the way that check-ins handle the creation of the clinical_note_v2 record, then we could delete this code below:
            const initalNoteHeightAndWeightMatch = initial_note?.match(
                /Height:\s*(\d+)\s*ft\s*(\d+)/
            );
            let feet = 0;
            let inches = 0;

            if (initalNoteHeightAndWeightMatch) {
                feet = parseInt(initalNoteHeightAndWeightMatch[1], 10);
                inches = parseInt(initalNoteHeightAndWeightMatch[2], 10);
            }

            if (bmi_note_data?.metadata?.weight_lbs && feet && inches) {
                const weight = Number(bmi_note_data?.metadata?.weight_lbs);
                const heightF = Number(feet) ?? 0;
                const heightI = Number(inches) ?? 0;
                const bmi = (weight / (heightF * 12 + heightI) ** 2) * 703;
                return {
                    ogNote: '?',
                    heightF: heightF,
                    heightI: heightI,
                    weight: Number(weight.toFixed(2)),
                    bmi: bmi,
                };
            }
            //if the weight is not available in metadata, or if the height is not available in the initial note, then we show error message
            return {
                ogNote: '?',
                heightF: 0,
                heightI: 0,
                weight: 0,
                bmi: 0,
            };
        }

        if (!noteValue.trim()) {
            return {
                ogNote: '?',
                heightF: 0,
                heightI: 0,
                weight: 0,
                bmi: 0,
            };
        }

        try {
            const splitNote = noteValue.split(',');
            const heightMatch = splitNote[0]?.match(
                /Height:\s*(\d+)\s*ft\s*(\d+)/
            );
            const heightF = heightMatch ? parseInt(heightMatch[1], 10) : null;
            const heightI = heightMatch ? parseInt(heightMatch[2], 10) : null;
            const weightMatch = splitNote[1]?.match(/Weight:\s*(\d+)/);
            const weight = weightMatch ? parseInt(weightMatch[1], 10) : null;
            if (heightF === null || heightI === null || weight === null) {
                return {
                    ogNote: noteValue,
                    heightF: 0,
                    heightI: 0,
                    weight: 0,
                    bmi: 0,
                };
            }

            const bmi = (weight / (heightF * 12 + heightI) ** 2) * 703;
            return {
                ogNote: noteValue,
                heightF,
                heightI,
                weight,
                bmi,
            };
        } catch (error) {
            console.error(
                'Error converting note value string to object: ',
                error
            );
            return {
                ogNote: noteValue,
                heightF: 0,
                heightI: 0,
                weight: 0,
                bmi: 0,
            };
        }
    };

    const weightDeltaColor = (weight: number, initialWeight: number) => {
        if (weight - initialWeight < 0) {
            return 'text-green-600';
        } else {
            return 'text-red-500';
        }
    };

    const upOrDownArrow = (weight: number, initialWeight: number) => {
        if (weight - initialWeight < 0) {
            return '↓';
        } else {
            return '↑';
        }
    };

    return (
        <>
            <BMIEditModal
                open={editingNote}
                onClose={() => setEditingNote(false)}
                setNoteValue={setNoteValue}
                updateBMIRecord={updateBMIRecord}
                noteValueObject={convertNoteValueStringToObject(noteValue)}
            />
            <BioverseSnackbarMessage
                open={successSnackbarOpen}
                setOpen={setSuccessSnackbarOpen}
                color={'success'}
                message={'BMI Note Updated'}
            />

            {convertNoteValueStringToObject(noteValue)?.weight !== 0 ? (
                <div className='flex flex-row rounded-md justify-between gap-2 p-2 mb-2'>
                    <div className='flex flex-col justify-between w-full'>
                        <div className=' flex flex-col '>
                            <div className='flex flex-row  gap-1 inter-basic text-[14px] '>
                                <p className=' provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                    Weight:{' '}
                                </p>
                                <p className='provider-clinical-notes-bmi-text text-strong leading-[19px]'>
                                    {
                                        convertNoteValueStringToObject(
                                            noteValue
                                        )?.weight
                                    }{' '}
                                    lbs{' '}
                                </p>
                                {initial_note && (
                                    <>
                                        <p className='provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                            | Initial:
                                        </p>

                                        {/* show the initial weight */}
                                        <p className='provider-clinical-notes-bmi-text text-strong leading-[19px]'>
                                            {
                                                convertNoteValueStringToObject(
                                                    initial_note
                                                )?.weight
                                            }{' '}
                                            lbs
                                        </p>

                                        {/* show the absolute delta between current weight and initial weight */}
                                        <p
                                            className={`provider-clinical-notes-bmi-text  leading-[19px] ${weightDeltaColor(
                                                convertNoteValueStringToObject(
                                                    noteValue
                                                )?.weight ?? 0,
                                                convertNoteValueStringToObject(
                                                    initial_note
                                                )?.weight ?? 0
                                            )}`}
                                        >
                                            {Math.abs(
                                                (convertNoteValueStringToObject(
                                                    noteValue
                                                )?.weight ?? 0) -
                                                    (convertNoteValueStringToObject(
                                                        initial_note
                                                    )?.weight ?? 0)
                                            ).toFixed(0)}{' '}
                                            lbs
                                        </p>

                                        {/* show the percentage delta between current weight and initial weight */}
                                        <p
                                            className={`provider-clinical-notes-bmi-text  leading-[19px] ${weightDeltaColor(
                                                convertNoteValueStringToObject(
                                                    noteValue
                                                )?.weight ?? 0,
                                                convertNoteValueStringToObject(
                                                    initial_note
                                                )?.weight ?? 0
                                            )}`}
                                        >
                                            (
                                            {Math.abs(
                                                100 -
                                                    Math.abs(
                                                        (convertNoteValueStringToObject(
                                                            noteValue
                                                        )?.weight ?? 0) /
                                                            (convertNoteValueStringToObject(
                                                                initial_note
                                                            )?.weight ?? 0)
                                                    ) *
                                                        100
                                            ).toFixed(0)}
                                            %)
                                        </p>

                                        {/* show up or down arrow for current to initial weight delta */}
                                        <p
                                            className={`provider-clinical-notes-bmi-text  leading-[19px] ${weightDeltaColor(
                                                convertNoteValueStringToObject(
                                                    noteValue
                                                )?.weight ?? 0,
                                                convertNoteValueStringToObject(
                                                    initial_note
                                                )?.weight ?? 0
                                            )}`}
                                        >
                                            {upOrDownArrow(
                                                convertNoteValueStringToObject(
                                                    noteValue
                                                )?.weight ?? 0,
                                                convertNoteValueStringToObject(
                                                    initial_note
                                                )?.weight ?? 0
                                            )}
                                        </p>
                                    </>
                                )}
                            </div>
                            {last_note && (
                                <div className='flex flex-row gap-1 inter-basic text-[14px] leading-[19px]'>
                                    <p className='provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                        Last:
                                    </p>

                                    {/* show the last weight */}
                                    <p className='provider-clinical-notes-bmi-text text-strong leading-[19px]'>
                                        {
                                            convertNoteValueStringToObject(
                                                last_note.note
                                            )?.weight
                                        }{' '}
                                        lbs,{' '}
                                        <span style={{ fontWeight: 100 }}>
                                            (reported{' '}
                                            {converteTimestamp2(
                                                last_note.created_at ?? ''
                                            )}
                                            )
                                        </span>
                                    </p>

                                    {/* show the absolute delta between current weight and last weight */}
                                    <p
                                        className={`provider-clinical-notes-bmi-text  leading-[19px] ${weightDeltaColor(
                                            convertNoteValueStringToObject(
                                                noteValue
                                            )?.weight ?? 0,
                                            convertNoteValueStringToObject(
                                                last_note.note
                                            )?.weight ?? 0
                                        )}`}
                                    >
                                        {Math.abs(
                                            (convertNoteValueStringToObject(
                                                noteValue
                                            )?.weight ?? 0) -
                                                (convertNoteValueStringToObject(
                                                    last_note.note
                                                )?.weight ?? 0)
                                        ).toFixed(0)}{' '}
                                        lbs
                                    </p>

                                    {/* show the percentage delta between current weight and last weight */}
                                    <p
                                        className={`provider-clinical-notes-bmi-text  leading-[19px] ${weightDeltaColor(
                                            convertNoteValueStringToObject(
                                                noteValue
                                            )?.weight ?? 0,
                                            convertNoteValueStringToObject(
                                                last_note.note
                                            )?.weight ?? 0
                                        )}`}
                                    >
                                        (
                                        {Math.abs(
                                            100 -
                                                ((convertNoteValueStringToObject(
                                                    noteValue
                                                )?.weight ?? 0) /
                                                    (convertNoteValueStringToObject(
                                                        last_note.note
                                                    )?.weight ?? 0)) *
                                                    100
                                        ).toFixed(0)}
                                        %)
                                    </p>

                                    {/* show up or down arrow for current to last weight delta */}
                                    <p
                                        className={`provider-clinical-notes-bmi-text  leading-[19px] ${weightDeltaColor(
                                            convertNoteValueStringToObject(
                                                noteValue
                                            )?.weight ?? 0,
                                            convertNoteValueStringToObject(
                                                last_note.note
                                            )?.weight ?? 0
                                        )}`}
                                    >
                                        {upOrDownArrow(
                                            convertNoteValueStringToObject(
                                                noteValue
                                            )?.weight ?? 0,
                                            convertNoteValueStringToObject(
                                                last_note.note
                                            )?.weight ?? 0
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className='flex flex-row gap-1 inter-basic text-[14px] leading-[19px]'>
                                <p className=' provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                    BMI:
                                </p>
                                <p className='provider-clinical-notes-bmi-text text-strong leading-[19px]'>
                                    {convertNoteValueStringToObject(
                                        noteValue
                                    )?.bmi.toFixed(2)}
                                </p>
                                {initial_note && (
                                    <>
                                        <p className='provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                            | Initial:
                                        </p>

                                        <p className='provider-clinical-notes-bmi-text text-strong leading-[19px]'>
                                            {convertNoteValueStringToObject(
                                                initial_note
                                            )?.bmi.toFixed(2)}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <BioType className='provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                            {convertTimestamp(bmi_note_data.created_at ?? '')}
                        </BioType>
                        {bmi_note_data.creating_provider && (
                            <BioType className='provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                Created manually by:{' '}
                                {bmi_note_data.creating_provider.first_name}{' '}
                                {bmi_note_data.creating_provider.last_name}
                            </BioType>
                        )}
                        {bmi_note_data.editing_provider && (
                            <BioType className='provider-clinical-notes-bmi-text text-weak leading-[19px]'>
                                Edited by:{' '}
                                {bmi_note_data.editing_provider.first_name}{' '}
                                {bmi_note_data.editing_provider.last_name} on{' '}
                                {convertTimestamp(
                                    bmi_note_data.last_modified_at ?? ''
                                )}
                            </BioType>
                        )}

                        {/* <ClinicalNoteDisplayTiptap
                        content={noteValue ?? 'none'}
                        editable={editingNote}
                        onContentChange={(content: string) => {
                            setNoteValue(content);
                        }}
                    /> */}
                    </div>
                    {!isUpdatingBMINote ? (
                        <div className='w-[80px]'>
                            {noteHasBeenEdited && (
                                <Tooltip title='Save Changes'>
                                    <Button
                                        variant='outlined'
                                        onClick={() => {
                                            updateBMIRecord();
                                        }}
                                        size='small'
                                        sx={{
                                            maxHeight: '60px',
                                            borderRadius: '12px',
                                            borderColor: 'primary',
                                            color: 'primary',

                                            ':hover': {
                                                color: 'primary',
                                                borderColor: 'primary',
                                            },
                                            paddingX: '13px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-primary'>
                                            Save
                                        </span>
                                    </Button>
                                </Tooltip>
                            )}
                            {!editingNote && !noteHasBeenEdited ? (
                                <Tooltip title='Edit'>
                                    <Button
                                        variant='outlined'
                                        onClick={() => {
                                            setEditingNote(true);
                                        }}
                                        size='small'
                                        sx={{
                                            maxHeight: '60px',
                                            borderRadius: '12px',
                                            borderColor: 'black',
                                        }}
                                    >
                                        <span className='flex flex-row items-center gap-2 text-[14px] inter-basic text-strong font-bold normal-case'>
                                            <EditOutlinedIcon
                                                sx={{
                                                    fontSize: '20px',
                                                    color: 'gray',
                                                }}
                                            />
                                            Edit
                                        </span>
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title='Cancel'>
                                    <Button
                                        variant='outlined'
                                        onClick={() => {
                                            setNoteValue(bmi_note_data.note);
                                            setEditingNote(false);
                                        }}
                                        size='small'
                                        sx={{
                                            maxHeight: '60px',
                                            borderRadius: '12px',
                                            borderColor: 'red',
                                            color: 'red',
                                            ':hover': {
                                                color: 'red',
                                                borderColor: 'red',
                                            },
                                        }}
                                    >
                                        <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-red-400'>
                                            Cancel
                                        </span>
                                    </Button>
                                </Tooltip>
                            )}
                        </div>
                    ) : (
                        <>
                            <CircularProgress />
                        </>
                    )}
                </div>
            ) : (
                <div className='inter-basic'>
                    <p>BMI data formatted incorrectly.</p>
                    <p className='font-bold italic bg-amber-100 w-fit'>
                        Contact engineering to fix
                    </p>
                    <p>{convertTimestamp(bmi_note_data.created_at ?? '')}</p>
                    <p>{bmi_note_data.note ?? ''}</p>
                </div>
            )}

            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setErrorSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setErrorSnackbarOpen(false)}
                    severity='error'
                    sx={{ width: '100%' }}
                >
                    There was an error in the application please refresh the
                    page and try again
                </Alert>
            </Snackbar>
        </>
    );
}
