'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { tiptapExtensions } from '@/app/components/provider-portal/intake-view/v2/utils/tiptap-editor-config/tiptap-editor-config';

interface TipTapProps {
    content: string;
}

const PreviewTipTap = ({ content }: TipTapProps) => {
    const editor = useEditor({
        extensions: tiptapExtensions,
        content: content,
        editable: false,
    });

    return (
        <div className='itd-body-inter text-[16px] leading-[20px] text-left truncate text-weak sm:text-sm mt-1'>
            <EditorContent editor={editor} />
        </div>
    );
};

export default PreviewTipTap;
