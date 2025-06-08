import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const TELMISARTAN_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Patient denies pregnancy/breastfeeding.',
                'Medication, allergies, med/surgical hx reviewed. Pt is not on aliskiren (Tekturna)',
                'Patient denies severe liver, kidney, heart disease.',
                'Patient reports blood pressure reading within 6 months between 130-160/80-110. (For patients 65+ bp range 140-160/80-110)',
                'Denies CP, SOB, dizziness, severe headaches',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'I10 Essential hypertension',
                'R03.0 Elevated blood pressure reading',
                'Z82.49 Family history of ischemic heart disease and other diseases of the circulatory system.',
                'E88.81 Metabolic syndrome',
                'E78.5 Hyperlipidemia',
                'R73.01 Impaired Fasting Glucose',
                'R73.03 Pre-diabetes',
                'E11.9 Type 2 diabetes mellitus without complications',
                'E78.00 Hypercholesterolemia',
                'E78.1 Hypertriglyceridemia',
                'E88.819 Insulin resistance',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Telmisartan 20mg (select one):',
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
