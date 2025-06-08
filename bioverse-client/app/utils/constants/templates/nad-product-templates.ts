import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const NAD_INJECTION_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Denies pregnancy/breastfeeding',
                'No liver or kidney disease',
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
                'F39 Unspecified mood disorder',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'NAD Injection: (Select one)',
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

export const NAD_PATCHES_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Denies pregnancy/breastfeeding',
                'No liver or kidney disease',
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
                'F39 Unspecified mood disorder',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'NAD Patches: (Select one)',
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

export const NAD_NASAL_SPRAY_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Denies pregnancy/breastfeeding',
                'No liver or kidney disease',
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
                'F39 Unspecified mood disorder',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'NAD Nasal Spray: (Select one)',
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

export const NAD_COMBINED_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Pt denies pregnancy/breastfeeding.',
                'No liver or kidney disease',
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
                'F39 Unspecified mood disorder',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.DROPDOWN,
            title: 'NAD+ (select-one):',
            values: ['Injections', 'Patches', 'Nasal Spray'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: ' ',
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
