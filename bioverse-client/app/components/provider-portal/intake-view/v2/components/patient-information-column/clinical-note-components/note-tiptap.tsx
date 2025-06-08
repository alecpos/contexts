'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { tiptapExtensions } from '../../../utils/tiptap-editor-config/tiptap-editor-config';

interface TipTapProps {
    content: string;
    editable: boolean;
    onContentChange: (content: string) => void;
}

const ClinicalNoteDisplayTiptap = ({
    content,
    editable,
    onContentChange,
}: TipTapProps) => {
    const editor = useEditor({
        extensions: tiptapExtensions,
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onContentChange(html);
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    useEffect(() => {
        if (editor) {
            editor.setOptions({
                editable: editable,
                editorProps: {
                    attributes: {
                        class: editable
                            ? 'border border-gray-300 border-solid rounded-md p-2 provider-clinical-notes-bmi-text'
                            : 'provider-clinical-notes-bmi-text',
                    },
                },
            });
        }
    }, [editor, editable]);

    return <EditorContent editor={editor} />;
};

export default ClinicalNoteDisplayTiptap;
