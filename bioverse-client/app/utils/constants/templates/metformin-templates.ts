import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const METFORMIN_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Patient denies pregnancy/breastfeeding.',
                'Denies severe renal/hepatic disease, congestive heart failure, acute/chronic metabolic acidosis. ',
                'Patient denies pregnancy/breastfeeding.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx (Select all that apply): ',
            setting: 'Dx',
            values: [
                'R63.8 Other symptoms and signs concerning food and fluid intake',
                'R73.01 Impaired Fasting Glucose',
                'R73.03 Pre-diabetes',
                'E11.9 Type 2 diabetes mellitus without complications',
                'R73.8 Hyperglycemia',
                'E88.819 Insulin resistance',
                'E66.01 Morbid Obesity due to excess calories',
                'E66.3 Overweight',
                'E66.9 Obesity',
                'E28.2 Polycystic ovarian syndrome',
                'Z72.3 Lack of physical exercise',
                'Z72.4 Inappropriate diet and eating habits',
                'Z83.3 Family history of diabetes mellitus',
                'Z82.49 Family history of ischemic heart disease and other diseases of the circulatory system',
                'I10 Essential hypertension',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Metformin (select one)',
            values: ['Approved', 'Denied. Refer to PCP'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Dose (select one)',
            values: ['500 mg', '850 mg', '1000 mg (default)', '1500 mg'],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

export const METFORMIN_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Patient denies pregnancy/breastfeeding.',
                'Denies severe renal/hepatic disease, congestive heart failure, acute/chronic metabolic acidosis. ',
                'Patient denies pregnancy/breastfeeding.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies:',
            setting: 'Dx',
            values: [
                'R63.8 Other symptoms and signs concerning food and fluid intake',
                'R73.01 Impaired Fasting Glucose',
                'R73.03 Pre-diabetes',
                'R73.8 Hyperglycemia',
                'E11.9 Type 2 diabetes mellitus without complications',
                'E88.819 Insulin resistance',
                'E66.01 Morbid Obesity due to excess calories',
                'E66.3 Overweight',
                'E66.9 Obesity',
                'E28.2 Polycystic ovarian syndrome',
                'Z72.3 Lack of physical exercise',
                'Z72.4 Inappropriate diet and eating habits',
                'Z83.3 Family history of diabetes mellitus',
                'Z82.49 Family history of ischemic heart disease and other diseases of the circulatory system',
                'I10 Essential hypertension',
                'Z00: Encounter for general examination without complaint, suspected or reported diagnosis',
                'Other (add in note)',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Lab required? (select one)',
            values: ['Before initiation AND annually', 'Annually'],
        },

        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Prescription is (select one): ',
            values: ['Approved', 'Pending (add note)', 'Denied. Refer to PCP'],
        },

        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            custom: {
                defaultSelectValue: '1000 mg',
            },
            title: 'Dose (select one): ',
            values: ['500 mg', '850 mg', '1000 mg', '1500 mg', 'N/A'],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            title: '',
            values: [
                'I have provided information regarding medication instructions, precautions, side effects and lifestyle recommendations to the patient.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};
