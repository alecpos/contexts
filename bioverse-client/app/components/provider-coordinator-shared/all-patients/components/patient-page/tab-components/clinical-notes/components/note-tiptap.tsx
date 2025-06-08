'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { tiptapExtensions } from '@/app/components/provider-portal/intake-view/v2/utils/tiptap-editor-config/tiptap-editor-config';


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
            onContentChange(html); // Call the dispatch function with the new content
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setOptions({
                editable: editable,
                editorProps: {
                    attributes: {
                        class: editable
                            ? 'border border-gray-300 border-solid rounded-md p-2'
                            : '',
                    },
                },
            });
        }
    }, [editor, editable]);

    return <EditorContent editor={editor} />;
};

export default ClinicalNoteDisplayTiptap;