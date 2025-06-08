import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const WL_CAPSULE_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Patient denies pregnancy/breastfeeding.',
                'Medications and allergies reviewed. No concurrent use of opioids, MAOIs, bupropion, naltrexone, topiramate.',
                'Denies epilepsy, glaucoma, current/past suicidal ideations, severe liver disease, current/past eating disorder, kidney issues, acute porphyria',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies: ',
            setting: 'Dx',
            values: [
                'E66.01 Morbid Obesity due to excess calories',
                'E66.3 Overweight',
                'E66.9 Obesity',
                'Z72.4 Inappropriate Diet and Eating Habits',
                'R63.5 Abnormal weight gain',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Visit Type',
            values: ['Initiation', 'Continuation'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Bupropion/Naltrexone/Topiramate approved (select one)',
            values: ['Follow up in 1 month', 'Follow up in 3 months', 'Denied'],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

export const WL_CAPSULE_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                "Pt agrees to asynchronous encounter via intake and consented to telehealth consent. Pt's identification confirmed via photo ID. Pt is determined to be appropriate for asynchronous care and is 18 or older",
                'Pt denies pregnancy/breastfeeding.',
                'Medications and allergies reviewed. No concurrent use of opioids, MAOIs, bupropion, naltrexone, topiramate.',
                'Denies epilepsy, glaucoma, current/past suicidal ideations, severe liver disease, current/past eating disorder, kidney issues, acute porphyria',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx: Select all that applies: ',
            setting: 'Dx',
            values: [
                'E66.01 Morbid Obesity due to excess calories',
                'E66.3 Overweight',
                'E66.9 Obesity',
                'Z72.4 Inappropriate Diet and Eating Habits',
                'R63.5 Abnormal weight gain',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Visit Type',
            values: ['Initiation', 'Continuation'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Bupropion/Naltrexone/Topiramate approved (select one)',
            values: ['Follow up in 1 month', 'Follow up in 3 months', 'Denied'],
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
