'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { updateClinicalNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
} from '@mui/material';
import ClinicalNoteDisplayTiptap from './note-tiptap';
import React from 'react';
import AllergyMedicationPreviousHistoryModal from './allergy-med-previous-history-modal';
import { getProviderNameFromId } from './utils/clinical-note-provider-map';

interface AllergyMedClinicalNoteDisplayProps {
    note_data: ClinicalNotesV2Supabase;
    refreshData: () => void;
    data_type: string;
}

export default function AllergyMedicationClinicalNoteAccordion({
    note_data,
    refreshData,
    data_type,
}: AllergyMedClinicalNoteDisplayProps) {
    const [editing, setEditing] = useState<boolean>(false);
    const [editsMade, setEditsMade] = useState<boolean>(false);
    const [new_text_value, setNewTextValue] = useState<string>(
        note_data.note ?? ''
    );
    const [isExpanded, setIsExpanded] = useState(true);
    const [previousHistoryDialogOpen, setPreviousHistoryDialogOpen] =
        useState<boolean>(false);

    const openDialog = () => {
        console.log('setting true');
        setPreviousHistoryDialogOpen(true);
    };

    const closeDialog = () => {
        setPreviousHistoryDialogOpen(false);
    };

    const beginEditingClinicalNote = () => {
        setEditing(true);
    };

    const cancelEditingClinicalNote = () => {
        setEditing(false);
    };

    useEffect(() => {
        if (new_text_value !== note_data.note) {
            setEditsMade(true);
        }
    }, [new_text_value]);

    const sendClinicalNoteUpdate = async () => {
        try {
            const editor_id = (await readUserSession()).data.session?.user.id;
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
        refreshData();
        setEditing(false);
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

    const renderSummaryText = () => {
        switch (data_type) {
            case 'allergy':
                return 'Allergy Information';
            case 'medication':
                return 'Current Medication Information';
        }
    };

    const renderDetailsText = () => {
        switch (data_type) {
            case 'allergy':
                return 'Allergies';
            case 'medication':
                return 'Medications';
        }
    };

    const handleAccordionChange = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className='flex flex-col inter-basic gap-4 ' style={{ boxShadow: 'none' }}>
            <Accordion defaultExpanded disableGutters style={{ boxShadow: 'none' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => handleAccordionChange()}
                >
                    <BioType
                        className={`provider-dropdown-title text-[16px] ${
                            isExpanded ? 'underline' : ''
                        }`}
                    >
                        {renderSummaryText()}
                    </BioType>
                </AccordionSummary>
                <div className=' flex flex-row justify-between px-[18px]'>
                    <ClinicalNoteDisplayTiptap
                            content={note_data.note ?? 'none'}
                            editable={editing}
                            onContentChange={setNewTextValue}
                        />
                    {!editing ? (
                            <Button
                                variant='outlined'
                                onClick={beginEditingClinicalNote}
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
                        ) : editsMade ? (
                            <Button
                                variant='outlined'
                                onClick={sendClinicalNoteUpdate}
                                size='small'
                                sx={{
                                    maxHeight: '35px',
                                    borderRadius: '12px',
                                    borderColor: 'primary',
                                    color: 'primary',
                                    marginRight: '10px',
                                    ":hover": {
                                        color: 'primary',
                                        borderColor: 'primary',
                                    }
                                }}
                                >
                                <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-primary'>
                                    Save
                                </span>
                            </Button>
                        ) : (
                            <Button
                                className='outlined'
                        
                                variant='outlined'
                                onClick={cancelEditingClinicalNote}
                                size='small'
                                sx={{
                                    maxHeight: '35px',
                                    borderRadius: '12px',
                                    borderColor: 'red',
                                    color: 'red',
                                    ":hover": {
                                        color: 'red',
                                        borderColor: 'red',
                                    }
                                }}
                            >
                                <span className='flex flex-row items-center gap-2 text-[14px] inter-basic font-bold normal-case text-red-400'>
                                    Cancel
                                </span>
                            </Button>
                    )}
                </div>
                <AccordionDetails
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                    }}
                >
                    <div className='flex flex-col  bg-[#E5EDF4] gap-2 p-2 mb-2 mt-1.5'>
                        {/* {note_data.last_modified_at &&
                        note_data.editing_provider ? (
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='itd-input'>
                                        Updated by:{' '}
                                    </BioType>
                                    <BioType>
                                        {note_data.editing_provider.first_name}{' '}
                                        {note_data.editing_provider.last_name}
                                    </BioType>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='itd-input'>
                                        Amended on:{' '}
                                    </BioType>
                                    <BioType>
                                        {convertTimestamp(
                                            note_data.last_modified_at
                                        )}
                                    </BioType>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='itd-input'>
                                        Created by:{' '}
                                    </BioType>
                                    <BioType>
                                        {getProviderNameFromId(
                                            note_data.created_by!
                                        )}
                                    </BioType>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <BioType className='itd-input'>
                                        Added on:{' '}
                                    </BioType>
                                    <BioType>
                                        {convertTimestamp(
                                            note_data.created_at!
                                        )}
                                    </BioType>
                                </div>
                            </div>
                        )} */}
                                                  
                        <div className='flex flex-row justify-between'>
                            <div>
                                {note_data.note_history ? (
                                    <>
                                        <div onClick={() => openDialog()}>
                                            <BioType className='text-strong inter-basic text-[14px] items-center flex gap-1 hover:underline cursor-pointer'>
                                                <RestoreOutlinedIcon
                                                    sx={{ fontSize: '20px' }}
                                                />
                                                {note_data.note_history.length}{' '}
                                                previous versions
                                            </BioType>
                                        </div>
                                        <AllergyMedicationPreviousHistoryModal
                                            dialogOpen={
                                                previousHistoryDialogOpen
                                            }
                                            onClose={closeDialog}
                                            note_history_array={
                                                note_data.note_history
                                            }
                                            data_type={note_data.data_type}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div onClick={() => openDialog()}>
                                            <BioType className='text-[#8E9397] inter-basic text-[14px] items-center flex gap-1 hover:underline cursor-pointer'>
                                                <RestoreOutlinedIcon
                                                    sx={{ fontSize: '20px' }}
                                                />
                                                No previous versions
                                            </BioType>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                        
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
