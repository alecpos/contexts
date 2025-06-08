'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CreateNoteTextEditor from './create-clinical-note-text-editor';
import { useState } from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { mutate } from 'swr';
import { postNewClinicalNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { ClinicalNoteType } from '@/app/utils/database/controller/clinical_notes/clinical_notes_enums';
import { Button, CircularProgress } from '@mui/material';
import { PRODUCT_NAME_HREF_MAP } from '@/app/types/global/product-enumerator';

interface ClinicalNoteCreationTabProps {
    patient_id: string;
    product_href: string;
    onClose: () => void;
}

export default function ClinicalNoteCreationTab({
    patient_id,
    product_href,
    onClose,
}: ClinicalNoteCreationTabProps) {
    const [creationNoteValue, setCreationNoteValue] = useState<string>('');
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const addClinicalNote = async () => {
        setButtonLoading(true);
        if (!creationNoteValue || creationNoteValue === '<p></p>') {
            return;
        }

        const author_id = (await readUserSession()).data.session?.user.id;

        const { data, error } = await postNewClinicalNote(
            patient_id,
            author_id!,
            ClinicalNoteType.NOTE,
            creationNoteValue
        );

        mutate(`${patient_id}-clinical-notes`, true);

        if (error) {
            console.error('clinical note post error details: ', error);
        }

        setCreationNoteValue('');

        setButtonLoading(false);
        onClose();
        // }
    };

    function getCurrentDateMMDDYYYY(): string {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();

        return `${month}/${day}/${year}`;
    }

    return (
        <>
            <div className='flex flex-col p-4 gap-2'>
                <BioType className='provider-dropdown-title text-strong'>Note</BioType>
                <div className='flex flex-col rounded-md bg-[#E5EDF4] w-full'>
                    <div className='flex flex-row justify-between pt-2 px-2'>
                        <BioType className='provider-dropdown-title text-[#00000099]'>
                            Product
                        </BioType>
                        <div className='flex flex-col w-[20%]'>
                            <BioType className='provider-dropdown-title text-[#00000099]'>
                                Date
                            </BioType>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between px-2 pb-2'>
                        <BioType className='provider-dropdown-title text-strong'>
                            {PRODUCT_NAME_HREF_MAP[product_href]}
                        </BioType>
                        <div className='flex flex-col w-[20%]'>
                            <BioType className='provider-dropdown-title text-strong'>
                                {getCurrentDateMMDDYYYY()}
                            </BioType>
                        </div>
                    </div>
                </div>
                <div>
                    <CreateNoteTextEditor
                        clinicalNoteTextInputValue={creationNoteValue}
                        setClinicalNoteTextInputValue={setCreationNoteValue}
                    />
                </div>
                <div className='flex flex-col items-center'>
                    <Button
                        variant='contained'
                        size='large'
                        sx={{ 
                            borderRadius: '12px', 
                            backgroundColor: 'black',
                            paddingX: '32px',
                            paddingY: '14px',
                            ":hover": {
                                backgroundColor: 'darkslategray',
                            }
                        }}
                        onClick={() => {
                            addClinicalNote();
                        }}
                    >
                        {buttonLoading ? (
                            <CircularProgress sx={{ color: 'white' }} />
                        ) : (
                            <span className='normal-case provider-bottom-button-text  text-white'>Add Note</span>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}
