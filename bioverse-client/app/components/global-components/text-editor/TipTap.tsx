'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

interface TipTapProps {
    content: string;
    editable: boolean;
    onContentChange: (content: string) => void;
}

const Tiptap = ({ content, editable, onContentChange }: TipTapProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'ml-4',
                    },
                },
                bold: {
                    HTMLAttributes: {
                        class: 'font-twcsemibold',
                    },
                },
            }),
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: 'Reply',
            }),
            Underline.configure({}),
        ],
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

export default Tiptap;
