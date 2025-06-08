'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import './message-editor-styling.css';
import { tiptapInputExtensions } from './tiptap-editor-config';

interface ThreadTipTapProps {
    content: string;
    onContentChange: (content: string) => void;
}

const ThreadTipTap = ({ content, onContentChange }: ThreadTipTapProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const adjustHeight = useCallback(() => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            const isEmpty = content === '<p></p>' || content === '';

            if (isEmpty) {
                editorRef.current.style.height = '38px'; // Height for single line + padding
            } else {
                // Reset height to auto to get the correct scrollHeight
                editorRef.current.style.height = 'auto';
                const scrollHeight = editorRef.current.scrollHeight;
                const newHeight = Math.min(scrollHeight, 150); // Max height of 150px
                editorRef.current.style.height = `${newHeight}px`;
            }
        }
    }, []);

    const editor = useEditor({
        extensions: tiptapInputExtensions,
        content: content,
        onUpdate: ({ editor }) => {
            onContentChange(editor.getHTML());
            adjustHeight();
        },
        editorProps: {
            attributes: {
                class: 'border-0',
            },
            handleKeyDown: (view, event: KeyboardEvent) => {
                // If Shift+Enter is pressed
                if (event.key === 'Enter' && event.shiftKey) {
                    const target = event.target as HTMLElement;
                    const form = target.closest('form');
                    const sendButton = document.querySelector(
                        '[data-send-message]'
                    ) as HTMLElement;

                    if (sendButton) {
                        event.preventDefault();
                        sendButton.click();
                        return true;
                    }
                    if (form) {
                        event.preventDefault();
                        form.requestSubmit();
                        return true;
                    }
                    return false;
                }
                // Regular Enter just adds a new line (default behavior)
                return false;
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
            adjustHeight();
        }
    }, [content, editor, adjustHeight]);

    // Initial height adjustment
    useEffect(() => {
        adjustHeight();
    }, [adjustHeight]);

    return (
        <div className='w-full' style={{ minHeight: '38px' }}>
            <EditorContent editor={editor} ref={editorRef} />
        </div>
    );
};

export default ThreadTipTap;
