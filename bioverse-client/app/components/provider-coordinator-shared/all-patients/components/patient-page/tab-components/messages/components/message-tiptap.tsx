'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import './message-editor-styling.css';
import { Checkbox, FormControlLabel } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import TipTapURLInputModal from '@/app/components/coordinator-portal/thread-view/provider-view-clone/components/patient-information-column/text-editor/tiptap-url-input-modal';
import { tiptapInputExtensions } from '@/app/components/coordinator-portal/thread-view/provider-view-clone/utils/tiptap-editor-config/tiptap-editor-config';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface TipTapProps {
    content: string;
    onContentChange: (content: string) => void;
    containsPHI: boolean;
    setContainsPHI: React.Dispatch<React.SetStateAction<boolean>>;
    responseRequired: boolean;
    setResponseRequired: React.Dispatch<React.SetStateAction<boolean>>;
    requiresCoordinator: boolean;
    setRequiresCoordinator: React.Dispatch<React.SetStateAction<boolean>>;
    access_type: BV_AUTH_TYPE | null;
}

const AllPatientsMessageInputTiptap = ({
    content,
    onContentChange,
    containsPHI,
    setContainsPHI,
    responseRequired,
    setResponseRequired,
    requiresCoordinator,
    setRequiresCoordinator,
    access_type,
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
                class: 'border border-gray-300 border-solid rounded-md p-2',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only update content if it's different and the editor is not focused
            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
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
            <div id='option-row' className='flex flex-col'>
                <div className='flex flex-row'>
                    {access_type === BV_AUTH_TYPE.PROVIDER ||
                        (access_type === BV_AUTH_TYPE.LEAD_PROVIDER && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={responseRequired}
                                        onClick={() => {
                                            setResponseRequired(
                                                (prev) => !prev
                                            );
                                        }}
                                        // onChange={}
                                    />
                                }
                                label={
                                    <BioType className='itd-body'>
                                        Requires Response
                                    </BioType>
                                }
                            />
                        ))}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={requiresCoordinator}
                                onClick={() => {
                                    setRequiresCoordinator((prev) => !prev);
                                }}
                                // onChange={}
                            />
                        }
                        label={
                            <BioType className='itd-body'>
                                Coordinator Required
                            </BioType>
                        }
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={containsPHI}
                                onClick={() => {
                                    setContainsPHI((prev) => !prev);
                                }}
                                // onChange={}
                            />
                        }
                        label={<BioType className='itd-body'>PHI</BioType>}
                    />
                </div>
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
            <EditorContent editor={editor} />
            <TipTapURLInputModal
                open={urlInputModalOpen}
                onClose={closeURLInputModal}
                setLink={setLink}
            />
        </>
    );
};

export default AllPatientsMessageInputTiptap;
