import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const ACARBOSE_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Medication, allergies, med/surgical hx reviewed.',
                'Denies diabetic ketoacidosis, liver cirrhosis, hx of IBD, colonic ulcerations, intestinal obstruction.',
                'Pt denies breastfeeding.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'R73.01 Impaired Fasting Glucose',
                'R73.03 Pre-diabetes',
                'E11.9 Type 2 diabetes mellitus without complications',
                'R73.8 Hyperglycemia',
                'E88.819 Insulin resistance',
                'E66.01 Morbid Obesity due to excess calories',
                'E66.3 Overweight',
                'E66.9 Obesity',
                'R63.5 Abnormal weight gain',
                'Z72.3 Lack of physical exercise',
                'Z83.3 Family history of diabetes mellitus',
                'Z82.49 Family history of ischemic heart disease and other diseases of the circulatory system.',
                'Z96.49 Presence of other endocrine implants',
                'I10 Essential hypertension',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Acarbose (select one):',
            values: [
                'Approved. Follow-up in 3 months or prn.',
                'Denied. Refer to PCP. ',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.DROPDOWN,
            title: 'Dose: ',
            values: [
                '25 mg',
                '25 mg prn (up to 8x/month)',
                '25 mg BID',
                '50 mg BID',
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
