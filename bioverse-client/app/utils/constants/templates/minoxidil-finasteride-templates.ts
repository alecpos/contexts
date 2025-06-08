import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const MINOXIDIL_FINASTERIDE_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Medication, allergies, med/surgical hx reviewed.',
                'Denies history of liver issues, high-grade prostate cancer, depression or sexual dysfunction.',
                'Pt denies burning pain, patches of rough, scaly skin, or scarring, pustules or crusting on scalp.',
                '(Female) Patient is postmenopausal',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'L64.9 Androgenic alopecia',
                'L65.9 Nonscarring hair loss, unspecified',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Topical Minoxidil Spray/Finasteride 6%/0.25% (select one):',
            values: [
                'Approved. Follow up in 6 months or prn.',
                'Denied. Refer to PCP. ',
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
