'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getProviderNameFromId } from './utils/clinical-note-provider-map';
import React, { useEffect, useState } from 'react';
import ClinicalNoteDisplayTiptap from './note-tiptap';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar-v2';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { isNoteEditableCheckProvider } from '../../../utils/clinical-notes/clinical-note-functions';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    updateClinicalNote,
    updateClinicalNoteTemplateData,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import ClinicalTemplateRender from './clinical-template-render';
import { ClinicalNoteTemplateData } from '@/app/utils/constants/clinical-note-template-latest-versions';

interface ClinicalNoteAndTemplateAccordionProps {
    note_data: ClinicalNotesV2Supabase;
    provider_id: string;
    refreshData: () => void;
}

export default function ClinicalNoteAndTemplateAccordion({
    note_data,
    provider_id,
    refreshData,
}: ClinicalNoteAndTemplateAccordionProps) {
    /**
     * you can tell if the aggregated note is a bmi vs template vs note based on:
     *
     * bmi => data_type = bmi && type = patient_data
     * template => data_type = template && type = patient_data
     * note => type = note
     *
     */

    const isNoteInEditableTimePeriod = isNoteEditableCheckProvider(
        note_data,
        provider_id
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editsMade, setEditsMade] = useState<boolean>(false);
    const [noteValue, setNoteValue] = useState<string>(note_data.note || '');
    const [new_text_value, setNewTextValue] = useState<string>(
        note_data.note ?? ''
    );
    const [successSnackbarOpen, setSuccessSnackbarOpen] =
        useState<boolean>(false);
    const [templateOptionData, setTemplateOptionData] = useState<
        ClinicalNoteTemplateData[]
    >(note_data.metadata);

    useEffect(() => {
        setTemplateOptionData(note_data.metadata);
    }, [note_data]);

    useEffect(() => {
        if (new_text_value !== note_data.note && note_data.type === 'note') {
            setEditsMade(true);
        }
    }, [new_text_value]);

    const handleAccordionChange = () => {
        setIsExpanded((prev) => !prev);
    };

    const beginEditingClinicalNote = () => {
        if (isNoteInEditableTimePeriod) {
            setEditing(true);
        }
    };

    const cancelEditingClinicalNote = () => {
        setEditing(false);
    };

    const changeEditsMade = (value: boolean) => {
        setEditsMade(value);
    };

    const sendClinicalNoteUpdate = async () => {
        switch (note_data.type) {
            case 'note':
                try {
                    const editor_id = provider_id;
                    await updateClinicalNote(
                        note_data.id!,
                        new_text_value,
                        editor_id!,
                        note_data.note,
                        note_data.last_modified_at,
                        note_data.created_at
                    );
                } catch (error: any) {
                    console.error('Error in updating clinical note', error);
                }
                break;

            default:
                console.log('Issue in update.');
                break;
        }

        refreshData();
        setEditing(false);
    };

    const updateClinicalNoteTemplate = async () => {
        const userId = (await readUserSession()).data.session?.user.id;

        updateClinicalNoteTemplateData(
            note_data.id!,
            templateOptionData,
            provider_id
        );
        updateClinicalNote(note_data.id!, noteValue, userId!);

        setEditsMade(false);
        setEditing(false);
        setSuccessSnackbarOpen(true);
        refreshData();
    };

    // const renderProductHrefName = (product_href: string | undefined) => {
    //     switch (product_href) {
    //         case 'semaglutide':
    //             return 'Semaglutide';
    //         case 'tirzepatide':
    //             return 'Tirzepatide';
    //         default:
    //             return product_href;
    //     }
    // };

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

    const renderCreatedDate = (dateString: string | undefined) => {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);

        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    const renderSummary = () => {
        switch (note_data.type) {
            case 'note':
                return `Provider Clinical Note Manual ${renderCreatedDate(
                    note_data.created_at
                )}`;
            case 'patient_data':
                if (note_data.data_type === 'template') {
                    return `Provider Clinical Note Template ${renderCreatedDate(
                        note_data.created_at
                    )}`;
                }

            default:
                console.log('this was the datatype: ', note_data.type);
                return 'Error in parsing Note';
        }
    };

    const renderContent = () => {
        switch (note_data.type) {
            case 'note':
                return (
                    <>
                        <BioType className='provider-dropdown-title'>
                            Clinical Note:
                        </BioType>
                        <ClinicalNoteDisplayTiptap
                            content={note_data.note ?? 'none'}
                            editable={editing}
                            onContentChange={setNewTextValue}
                        />
                    </>
                );
            case 'patient_data':
                return (
                    <>
                        <ClinicalTemplateRender
                            editing={editing}
                            editable={editing}
                            note_data={note_data}
                            setEditsMade={changeEditsMade}
                            setTemplateOptionData={setTemplateOptionData}
                            templateOptionData={templateOptionData}
                            noteValue={noteValue}
                            setNoteValue={setNoteValue}
                        />
                    </>
                );

            default:
                return 'Error in parsing Note';
        }
    };

    const renderEditabilityContent = () => {
        switch (note_data.type) {
            case 'note':
                return (
                    <div className='flex flex-row justify-end'>
                        {!editing ? (
                            <Button
                                variant='outlined'
                                onClick={beginEditingClinicalNote}
                                size='small'
                                disabled={!isNoteInEditableTimePeriod}
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
                        ) : editsMade ? (
                            <Button
                                className='outlined'
                                color='primary'
                                onClick={sendClinicalNoteUpdate}
                                size='small'
                                variant='outlined'
                                sx={{
                                    maxHeight: '35px',
                                    borderRadius: '12px',
                                    borderColor: 'primary',
                                    color: 'primary',
                                    marginRight: '10px',
                                    ':hover': {
                                        color: 'primary',
                                        borderColor: 'primary',
                                    },
                                }}
                            >
                                <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-primary'>
                                    {/* <SaveOutlinedIcon
                                        sx={{ fontSize: '20px' }}
                                    /> */}
                                    Save
                                </span>
                            </Button>
                        ) : (
                            <Button
                                className='outlined'
                                color='error'
                                variant='outlined'
                                onClick={cancelEditingClinicalNote}
                                sx={{
                                    maxHeight: '35px',
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
                        )}
                    </div>
                );
            case 'patient_data':
                return (
                    <div className='flex flex-row justify-end gap-2'>
                        {editsMade && (
                            <Button
                                className='outlined'
                                color='primary'
                                onClick={updateClinicalNoteTemplate}
                                size='small'
                                variant='outlined'
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
                                }}
                            >
                                <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-primary'>
                                    Save
                                </span>
                            </Button>
                        )}

                        {!editing && isNoteInEditableTimePeriod && (
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    setEditing(true);
                                }}
                                size='small'
                                sx={{
                                    maxHeight: '40px',
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
                        )}

                        {editing && (
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    setEditing(false);
                                    setEditsMade(false);
                                    setTemplateOptionData(note_data.metadata);
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
                        )}
                    </div>
                );

            default:
                return 'Error in parsing Note';
        }
    };

    return (
        <>
            <BioverseSnackbarMessage
                open={successSnackbarOpen}
                setOpen={setSuccessSnackbarOpen}
                color={'success'}
                message={'Clinical Note Updated'}
            />
            <Accordion disableGutters style={{ boxShadow: 'none' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => handleAccordionChange()}
                >
                    <BioType
                        className={`provider-dropdown-title ${
                            isExpanded ? 'underline' : ''
                        }`}
                    >
                        {renderSummary()}
                    </BioType>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex flex-col rounded-md bg-[#E5EDF4] gap-2 p-2 mb-2'>
                        {note_data.last_modified_at &&
                        note_data.editing_provider ? (
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='provider-dropdown-title text-weak '>
                                        Updated by:{' '}
                                    </BioType>
                                    <BioType className='provider-dropdown-title text-strong mb-[7px]'>
                                        {note_data.editing_provider.first_name}{' '}
                                        {note_data.editing_provider.last_name}
                                    </BioType>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='provider-dropdown-title text-weak mb-1'>
                                        Amended on:{' '}
                                    </BioType>
                                    <BioType className='provider-dropdown-title text-strong mb-1'>
                                        {convertTimestamp(
                                            note_data.last_modified_at
                                        )}
                                    </BioType>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='provider-dropdown-title text-weak'>
                                        Created by:{' '}
                                    </BioType>
                                    <BioType className='provider-dropdown-title'>
                                        {getProviderNameFromId(
                                            note_data.created_by!
                                        )}
                                    </BioType>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='provider-dropdown-title text-weak '>
                                        Added on:{' '}
                                    </BioType>
                                    <BioType className='provider-dropdown-title '>
                                        {convertTimestamp(
                                            note_data.created_at!
                                        )}
                                    </BioType>
                                </div>
                            </div>
                        )}
                    </div>
                    {renderEditabilityContent()}
                    <div className='flex flex-col'>{renderContent()}</div>
                    <div className='flex flex-row w-full justify-end '>
                        {editsMade && (
                            <Button
                                className='outlined'
                                color='primary'
                                onClick={updateClinicalNoteTemplate}
                                size='small'
                                variant='outlined'
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
                                    marginTop: '10px',
                                    marginRight: '10px',
                                }}
                            >
                                <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-primary'>
                                    Save
                                </span>
                            </Button>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    );
}
