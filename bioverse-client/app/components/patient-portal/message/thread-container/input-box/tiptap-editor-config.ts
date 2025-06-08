import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';

export const tiptapInputExtensions = [
    StarterKit.configure({
        // Disable all formatting features
        bold: false,
        italic: false,
        strike: false,
        code: false,
        bulletList: false,
        orderedList: false,
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
    }),
    Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'Reply...',
    }),
];
