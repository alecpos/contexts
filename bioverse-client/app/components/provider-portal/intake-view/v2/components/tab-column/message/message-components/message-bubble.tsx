'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { tiptapExtensions } from '../../../../utils/tiptap-editor-config/tiptap-editor-config';
import { useEffect, useMemo } from 'react';

interface MessageBubbleProps {
    content: string;
}

const MessageBubble = React.memo(
    ({ content }: MessageBubbleProps) => {
        // Memoize the editor configuration
        const editorConfig = useMemo(
            () => ({
                extensions: tiptapExtensions,
                content: content,
                editorProps: {
                    attributes: {
                        class: 'rounded-md provider-message-tab-sender-title',
                    },
                },
                editable: false,
            }),
            [content] // Add content as a dependency to update when content changes
        );

        const editor = useEditor(editorConfig);

        useEffect(() => {
            if (editor && content) {
                editor.commands.setContent(content);
            }
        }, [content, editor]);

        // No need for contentKey as React.memo handles the re-rendering
        return <EditorContent editor={editor} />;
    },
    (prevProps, nextProps) => {
        // Custom comparison function
        return prevProps.content === nextProps.content;
    }
);

// Add display name for React DevTools
MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
