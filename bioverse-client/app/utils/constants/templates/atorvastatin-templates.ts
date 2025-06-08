import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const ATORVASTATIN_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Patient denies pregnancy/breastfeeding',
                'Patient denies active liver disease or severe kidney disease',
                'Medication, allergies, medical/surgical hx reviewed.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'Z82.49 Family history of ischemic heart disease and other diseases of the circulatory system.',
                'E78.00 Hypercholesterolemia',
                'E78.1 Hypertriglyceridemia',
                'E78.5 Hyperlipidemia',
                'E88.81 Metabolic syndrome',
                'E88.819 Insulin resistance',
                'I10 Essential hypertension',
                'R03.0 Elevated blood pressure reading',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Atorvastatin 10mg daily (select one):',
            values: [
                'Approved. Follow-up in 3 months or prn.',
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
