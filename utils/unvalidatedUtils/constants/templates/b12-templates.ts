import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const B12_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Denies pregnancy/breastfeeding',
                'Medications and allergies reviewed',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'R41.9 Unspecified symptoms and signs involving cognitive functions and awareness',
                'R53.8 Other malaise and fatigue',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'B12 Injection: (Select one)',
            values: [
                'Approved. Follow-up in 3 months',
                'Denied. Refer to PCP. ',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

export const B12_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Denies pregnancy/breastfeeding',
                'Medications and allergies reviewed',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'R41.9 Unspecified symptoms and signs involving cognitive functions and awareness',
                'R53.8 Other malaise and fatigue',
                'E56 Other vitamin deficiencies',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'B12 Injection: (Select one)',
            values: ['Approved. Follow-up in 3 months', 'Denied'],
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
