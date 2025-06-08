import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export const tiptapExtensions = [
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
    Underline.configure({}),
    Link.configure({
        autolink: true,
        openOnClick: 'whenNotEditable',
        linkOnPaste: true,
    }),
];

export const tiptapInputExtensions = [
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
    Link.configure({
        autolink: true,
        openOnClick: 'whenNotEditable',
        linkOnPaste: true,
    }).extend({
        inclusive: false,
    }),
];
