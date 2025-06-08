'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { tiptapExtensions } from '@/app/components/provider-portal/intake-view/v2/utils/tiptap-editor-config/tiptap-editor-config';
import './message-tiptap-overrides.css';

interface TipTapProps {
    content: string;
}

const PatientThreadMessageTipTap = ({ content }: TipTapProps) => {
    const editor = useEditor({
        extensions: tiptapExtensions,
        content: content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'bioverse-thread-message-content',
            },
        },
    });

    return (
        <div className='flex flex-col h-full inter-body-chat text-left'>
            <EditorContent editor={editor} />
        </div>
    );
};

export default PatientThreadMessageTipTap;
