import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const ZOFRAN_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Pt requesting ondansetron for nausea from GLP-1 therapy. Medical history, medications, and allergies reviewed. (Select one)',
            values: [
                'Rx approved. Dispense #10. Follow up prn.',
                'Rx approved. Dispense #20. Follow up prn.',
                'Rx denied. (Add note)',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            title: '',
            values: [
                'Patient was provided information regarding medication instructions, precautions, side effects and lifestyle recommendations.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};
