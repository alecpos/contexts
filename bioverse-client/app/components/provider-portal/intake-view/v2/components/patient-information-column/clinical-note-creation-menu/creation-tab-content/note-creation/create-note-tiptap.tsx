'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import './clinical-note-editor-styling.css';
import { useCallback, useEffect, useState } from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import { tiptapInputExtensions } from '../../../../../utils/tiptap-editor-config/tiptap-editor-config';
import TipTapURLInputModal from '../../../text-editor/tiptap-url-input-modal';

interface TipTapProps {
    content: string;
    onContentChange: (content: string) => void;
}

const CreateClinicalNoteInputTiptap = ({
    content,
    onContentChange,
}: TipTapProps) => {
    const [urlInputModalOpen, setUrlInputModalOpen] = useState<boolean>(false);
    const openURLInputModal = () => {
        setUrlInputModalOpen(true);
    };
    const closeURLInputModal = () => {
        setUrlInputModalOpen(false);
    };

    const editor = useEditor({
        extensions: tiptapInputExtensions,
        content: content,
        onUpdate: ({ editor }) => {
            onContentChange(editor.getHTML()); // Call the dispatch function with the new content
        },
        editorProps: {
            attributes: {
                class: 'border border-gray-300 border-solid rounded-md py-2 px-6 min-h-[150px]',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const setLink = useCallback(
        (url: string, text: string) => {
            if (!url || !text) return; // Check if the URL or text is empty

            editor
                ?.chain()
                .focus()
                .insertContent(`<a href="${url}">${text}</a>`) // Insert the text with the link
                .run();
        },
        [editor]
    );

    return (
        <>
            <EditorContent editor={editor} />
            <div id='option-row' className='flex flex-row justify-between'>
                <div className='flex flex-row p-2 gap-1'>
                    <div
                        onClick={() =>
                            editor!.chain().focus().toggleBold().run()
                        }
                        className={
                            editor?.isActive('bold')
                                ? 'bg-blue-300 rounded-lg cursor-pointer '
                                : 'cursor-pointer'
                        }
                    >
                        <FormatBoldIcon />
                    </div>
                    <div
                        onClick={() =>
                            editor!.chain().focus().toggleItalic().run()
                        }
                        className={
                            editor?.isActive('italic')
                                ? 'bg-green-300 rounded-lg cursor-pointer '
                                : 'cursor-pointer'
                        }
                    >
                        <FormatItalicIcon className='cursor-pointer' />
                    </div>
                    <div
                        onClick={() =>
                            editor!.chain().focus().toggleUnderline().run()
                        }
                        className={
                            editor?.isActive('underline')
                                ? 'bg-red-300 rounded-lg cursor-pointer '
                                : 'cursor-pointer'
                        }
                    >
                        <FormatUnderlinedIcon className='cursor-pointer' />
                    </div>
                    <div
                        onClick={() =>
                            editor!.chain().focus().toggleBulletList().run()
                        }
                        className={
                            editor?.isActive('bulletList')
                                ? 'bg-orange-300 rounded-lg cursor-pointer '
                                : 'cursor-pointer'
                        }
                    >
                        <FormatListBulletedIcon className='cursor-pointer' />
                    </div>

                    <div
                        onClick={openURLInputModal}
                        className={
                            editor?.isActive('link')
                                ? 'bg-purple-300 rounded-lg cursor-pointer '
                                : 'cursor-pointer'
                        }
                    >
                        <LinkIcon className='cursor-pointer' />
                    </div>
                </div>
            </div>
            <TipTapURLInputModal
                open={urlInputModalOpen}
                onClose={closeURLInputModal}
                setLink={setLink}
            />
        </>
    );
};

export default CreateClinicalNoteInputTiptap;
