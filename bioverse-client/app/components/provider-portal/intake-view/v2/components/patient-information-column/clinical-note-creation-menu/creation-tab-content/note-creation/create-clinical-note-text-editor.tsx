'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

import { Dispatch, SetStateAction, useState } from 'react';
import CreateClinicalNoteInputTiptap from './create-note-tiptap';

interface ClinicalNoteTextEditorProps {
    clinicalNoteTextInputValue: string;
    setClinicalNoteTextInputValue: Dispatch<SetStateAction<string>>;
}

export default function CreateNoteTextEditor({
    clinicalNoteTextInputValue,
    setClinicalNoteTextInputValue,
}: ClinicalNoteTextEditorProps) {
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    return (
        <>
            <div className='flex flex-col gap-2'>
                <div id='clinical-note-text-field' className='provider-dropdown-title text-weak'>
                    <CreateClinicalNoteInputTiptap
                        // key={clinicalNoteTextInputValue}
                        content={clinicalNoteTextInputValue}
                        onContentChange={setClinicalNoteTextInputValue}
                    />
                </div>
            </div>
        </>
    );
}
