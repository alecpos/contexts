'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent, EditorEvents } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';

import { Button } from '@mui/material';

interface MacrosTiptapProps {
    content: string;
}
const MacrosTiptap = ({content}:MacrosTiptapProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                
            }),
        ],
        editable: false,
        content: content,

        
    });
    return (
        <>
            <EditorContent editor={editor} />
        </>
    );
};

export default MacrosTiptap;
