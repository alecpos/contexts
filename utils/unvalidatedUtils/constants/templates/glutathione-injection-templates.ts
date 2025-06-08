import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const GLUTATHIONE_INJECTION_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'No sulfa allergy or milk intolerance',
                'Denies pregnancy/breastfeeding',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies: ',
            setting: 'Dx',
            values: [
                'L81.4 Melanin hyperpigmentation',
                'R23.4 Changes in skin texture',
                'R53.8 Other malaise and fatigue',
                'R63.5 Abnormal weight gain',
                'E88.819 Insulin resistance',
                'R41.9 Unspecified symptoms and signs involving cognitive functions and awareness',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Glutathione Injection: (Select one)',
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

export const GLUTATHIONE_INJECTION_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'No sulfa allergy or milk intolerance',
                'Denies pregnancy/breastfeeding',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies: ',
            setting: 'Dx',
            values: [
                'L81.4 Melanin hyperpigmentation',
                'R23.4 Changes in skin texture',
                'R53.8 Other malaise and fatigue',
                'R63.5 Abnormal weight gain',
                'E88.819 Insulin resistance',
                'R41.9 Unspecified symptoms and signs involving cognitive functions and awareness',
                'E56 Other vitamin deficiencies',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Glutathione Injection: (Select one)',
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
