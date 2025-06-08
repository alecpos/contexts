'use client';

import { tiptapExtensions } from '@/app/components/coordinator-portal/thread-view/provider-view-clone/utils/tiptap-editor-config/tiptap-editor-config';
import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';

interface MessageBubbleProps {
    content: string;
}

export default function MessageBubbleProviderPreview({
    content,
}: MessageBubbleProps) {
    const editor = useEditor({
        extensions: tiptapExtensions,
        content: content,
        editorProps: {
            attributes: {
                class: 'rounded-md p-2',
            },
        },
        editable: false,
    });

    useEffect(() => {
        if (editor && editor.commands) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <>
            <EditorContent editor={editor} />
        </>
    );
}
