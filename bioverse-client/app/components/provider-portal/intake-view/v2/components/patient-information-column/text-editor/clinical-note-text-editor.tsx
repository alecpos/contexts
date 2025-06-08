'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, CircularProgress } from '@mui/material';

import { Dispatch, SetStateAction, useState } from 'react';
import { postNewClinicalNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { ClinicalNoteType } from '@/app/utils/database/controller/clinical_notes/clinical_notes_enums';
import { mutate } from 'swr';
import ClinicalNoteInputTiptap from './clinical-note-tiptap';

interface ClinicalNoteTextEditorProps {
    clinicalNoteTextInputValue: string;
    setClinicalNoteTextInputValue: Dispatch<SetStateAction<string>>;
    patient_id: string;
    setTabSelected: Dispatch<SetStateAction<string>>;
    setMacroDestination: Dispatch<SetStateAction<string>>;
}

export default function ClinicalNoteTextEditor({
    clinicalNoteTextInputValue,
    setClinicalNoteTextInputValue,
    patient_id,
    setTabSelected,
    setMacroDestination,
}: ClinicalNoteTextEditorProps) {
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const addClinicalNote = async () => {
        setIsButtonLoading(true);
        if (
            !clinicalNoteTextInputValue ||
            clinicalNoteTextInputValue === '<p></p>'
        ) {
            setIsButtonLoading(false);
            return;
        }

        const author_id = (await readUserSession()).data.session?.user.id;

        if (
            clinicalNoteTextInputValue.includes('***') ||
            clinicalNoteTextInputValue.includes('{{')
        ) {
            setErrorMessage(
                'The message contains parameters that need to be replaced. Please check the message content'
            );
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            setIsButtonLoading(false);
        } else {
            const { data, error } = await postNewClinicalNote(
                patient_id,
                author_id!,
                ClinicalNoteType.NOTE,
                clinicalNoteTextInputValue
            );

            mutate(`${patient_id}-clinical-note-data-PRVIT`, true);

            if (error) {
                console.error('clinical note post error details: ', error);
            }

            setClinicalNoteTextInputValue('');

            setIsButtonLoading(false);
        }
    };

    return (
        <>
            <div className='flex flex-col gap-2'>
                <div id='clinical-note-text-field' className='itd-body'>
                    <ClinicalNoteInputTiptap
                        // key={clinicalNoteTextInputValue}
                        content={clinicalNoteTextInputValue}
                        onContentChange={setClinicalNoteTextInputValue}
                    />
                </div>
                {errorMessage && (
                    <BioType className='body1 text-red-400 ml-2'>
                        {errorMessage}
                    </BioType>
                )}

                <div id='info-line' className='flex flex-col justify-end'>
                    <BioType className='itd-body text-[#9E9E9E] text-end'>
                        Enter to add new line
                    </BioType>{' '}
                    <div className='flex justify-end'>
                        {isButtonLoading ? (
                            <Button variant='contained' sx={{ width: '160px' }}>
                                <CircularProgress
                                    size={24}
                                    sx={{ color: 'white' }}
                                />
                            </Button>
                        ) : (
                            <Button
                                variant='contained'
                                sx={{ width: '160px' }}
                                onClick={addClinicalNote}
                            >
                                Add Note
                            </Button>
                        )}
                    </div>
                </div>

                <div
                    id='macros-button'
                    className='flex flex-col justify-center items-center'
                >
                    <Button
                        variant='outlined'
                        className='p-4'
                        onClick={() => {
                            setMacroDestination('clinical-notes');
                            setTabSelected('macros');
                        }}
                    >
                        MACROS
                    </Button>
                </div>
            </div>
        </>
    );
}
