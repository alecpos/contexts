import {
    ClinicalNoteTemplate,
    ClinicalNoteTemplateOptionType,
} from '../clinical-note-template-latest-versions';

export const GLP1_INTAKE_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patients identification confirmed via photo ID. Patient is determined to be appropriate for asynchronous care and is 18 or older',
                'Patients medical intake (medical/ surgical history, current medications, and allergies) reviewed.',
                'Patient does NOT have the following absolute contraindications: personal or family history of MEN2/ MTC, history of type 1 diabetes, history of pancreatitis, on insulin therapy, on a sulfonylurea.',
                'Patient is NOT pregnant or breastfeeding.',
                'Patient does NOT have a history of suicide attempts or active suicidal ideations.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Patient is approved for (select all that apply): ',
            values: [
                'Semaglutide',
                'Tirzepatide',
                'Ondansetron 4mg',
                'None. Patient is not eligible for GLP-1s',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Therapy status (select one): ',
            values: ['Initiation', 'Continuation', 'Not applicable'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Titration schedule (select one): ',
            values: ['Standard', 'Custom (Add in note)', 'Not applicable'],
        },
        {
            type: ClinicalNoteTemplateOptionType.DROPDOWN,
            title: 'Starting Dose: ',
            values: [
                'Semaglutide 0.25mg',
                'Semaglutide 0.5mg',
                'Semaglutide 1.25mg',
                'Semaglutide 2.5mg',
                'Tirzepatide 2.5mg',
                'Tirzepatide 5mg',
                'Tirzepatide 7.5mg',
                'Tirzepatide 10mg',
                'Tirzepatide 12.5mg',
                'None',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx (select all that apply): ',
            setting: 'Dx',
            custom: 'GLP1DX',
            values: [
                'E66.3 Overweight',
                'E66.9 Obesity',
                'E66.01 Morbid Obesity',
                'E11.9 Type 2 Diabetes without complications',
                'R73.03 Prediabetes',
                'R73.01 Impaired Fasting Glucose',
                'E88.81 Metabolic Syndrome',
                'K21.9 GERD',
                'E87.5 Hyperlipidemia',
                'E78.1 Hypertriglyceridemia',
                'I10.9 Essential Hypertension',
                'I48.2 Chronic atrial fibrillation',
                'N18.9 Chronic Kidney Disease',
                'K76.0 NAFLD',
                'E28.2 PCOS',
                'F33.9 Major Depressive Disorder',
                'F41.1 Generalized anxiety disorder',
                'M79.2 Neuralgia and neuritis, unspecified',
                'G47.33 Obstructive Sleep Apnea',
                'M13.9 Osteoarthritis',
                'M54.5 Low Back Pain, unspecified',
                'M25.5 Pain in unspecified joint',
                'Z72.4 Inappropriate Diet and Eating Habits',
                'R11.0 Nausea',
                'None of the above',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Follow Up: ',
            values: ['1 month', '3 month', 'N/A'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            custom: {
                type: 'tooltip',
                text: 'Standing Order',
                hover: [
                    'Patient is tolerating medication (mild side effects, lasting 1-2 days after injection), administered minimum of 2 injections, minimum duration of at least 14 days on a given dose, BMI ≥ 25, and:',
                    'Losing < 6% of body weight in a month → Ok to increase, stay, or decrease the dose',
                    'Losing ≥ 6% of body weight in a month → Decrease dose',
                ],
            },
            values: ['Approved', 'Not approved (Add note)'],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

export const GLP1_RENEWAL_TEMPLATE: ClinicalNoteTemplate = {
    version: 1,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Check-in reviewed',
                'Medical history, medication and allergies reviewed and updated as needed',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Plan (Select one): ',
            values: [
                'CONTINUE PROTOCOL. Patient is deemed suitable to continue on standard titration schedule.',
                'DIFFERENT PROTOCOL. Titration schedule needs to be adjusted. Add note.',
                'SWITCH MEDICATION. Patient is no longer approved to continue on current medication.',
                'DISCONTINUE: Patient is not approved to continue on GLP1s',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.DROPDOWN,
            title: 'Dose: ',
            setting: 'dose-selection',
            values: [
                'Semaglutide 0.25mg',
                'Semaglutide 0.5mg',
                'Semaglutide 1mg',
                'Semaglutide 1.25mg',
                'Semaglutide 2.5mg',
                'Tirzepatide 2.5mg',
                'Tirzepatide 5mg',
                'Tirzepatide 7.5mg',
                'Tirzepatide 10mg',
                'Tirzepatide 12.5mg',
                'None',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Follow-up (select one): ',
            values: ['1 month', '3 month', 'N/A'],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

export const GLP1_RENEWAL_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Check-in reviewed',
                'Medical history, medication and allergies reviewed and updated as needed',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Plan (Select one): ',
            values: [
                'CONTINUE PROTOCOL. Patient is deemed suitable to continue on standard titration schedule.',
                'DIFFERENT PROTOCOL. Titration schedule needs to be adjusted. Add note.',
                'SWITCH MEDICATION. Patient is no longer approved to continue on current medication.',
                'DISCONTINUE: Patient is not approved to continue on GLP1s',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            title: 'Dosing: ',
            values: [
                'Semaglutide 0.25mg',
                'Semaglutide 0.5mg',
                'Semaglutide 1.25mg',
                'Semaglutide 2.5mg',
                'Tirzepatide 2.5mg',
                'Tirzepatide 5mg',
                'Tirzepatide 7.5mg',
                'Tirzepatide 10mg',
                'Tirzepatide 12.5mg',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Follow-up (select one): ',
            values: ['1 month', '3 month', 'N/A'],
        },
        {
            type: ClinicalNoteTemplateOptionType.NOTE,
            values: [],
        },
    ],
};

export const GLP1_INTAKE_TEMPLATE_V2: ClinicalNoteTemplate = {
    version: 2,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                `Patient agrees to asynchronous encounter via intake and consented to telehealth consent. Patient's identification confirmed via photo ID and selfie. Patient is determined to be appropriate for asynchronous care and is 18 or older`,
                `Patient's medical intake (medical/ surgical history, current medications, and allergies) reviewed.`,
                `Patient does NOT have the following absolute contraindications: personal or family history of MEN2/ MTC, history of type 1 diabetes, history of pancreatitis, on insulin therapy, on a sulfonylurea.`,
                `Patient is NOT pregnant or breastfeeding.`,
                `Patient does NOT have a history of suicide attempts or active suicidal ideations.`,
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Dx (select all that apply): ',
            setting: 'Dx',
            custom: 'GLP1DX',
            values: [
                'E66.3 Overweight',
                'E66.9 Obesity',
                'E66.01 Morbid Obesity',
                'E11.9 Type 2 Diabetes without complications',
                'R73.03 Prediabetes',
                'R73.01 Impaired Fasting Glucose',
                'E88.81 Metabolic Syndrome',
                'K21.9 GERD',
                'E87.5 Hyperlipidemia',
                'E78.1 Hypertriglyceridemia',
                'I10.9 Essential Hypertension',
                'I48.2 Chronic atrial fibrillation',
                'N18.9 Chronic Kidney Disease',
                'K76.0 NAFLD',
                'E28.2 PCOS',
                'F33.9 Major Depressive Disorder',
                'F41.1 Generalized anxiety disorder',
                'M79.2 Neuralgia and neuritis, unspecified',
                'G47.33 Obstructive Sleep Apnea',
                'M13.9 Osteoarthritis',
                'M54.5 Low Back Pain, unspecified',
                'M25.5 Pain in unspecified joint',
                'Z72.4 Inappropriate Diet and Eating Habits',
                'R11.0 Nausea',
                'None of the above',
                'Other (Add in note)',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'WL treatment status (select one): ',
            values: ['Initiation', 'Continuation', 'Not applicable'],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: false,
            title: 'Patient is approved for (select all that apply): ',
            values: [
                'Semaglutide',
                'Tirzepatide',
                'Metformin',
                'Bioverse Weight Loss Capsules',
                'Ondansetron 4mg',
                'Pending (add note)',
                'None. Patient is not eligible for any weight loss medications',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.DROPDOWN,
            title: 'Starting Dose: ',
            values: [
                'Semaglutide 0.25mg',
                'Semaglutide 0.5mg',
                'Semaglutide 1mg',
                'Semaglutide 1.25mg',
                'Semaglutide 2.5mg',
                'Tirzepatide 2.5mg',
                'Tirzepatide 5mg',
                'Tirzepatide 7.5mg',
                'Tirzepatide 10mg',
                'Tirzepatide 12.5mg',
                'None',
                'Other',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Pt is receiving: ',
            values: [
                '1-month supply',
                '3-month supply',
                '6-month supply',
                'None. Pt is denied (Add denial reason in note)',
                'Other. (Add a note)',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            custom: {
                type: 'tooltip',
                text: 'Standing Order',
                hover: [
                    'Patient with no reported side effects, administered minimum of 2 injections of a particular dose, minimum duration of at least 14 days on a given dose, BMI ≥ 22, and:',
                    'Losing < 5% of body weight in a month → Eligible to increase, stay, or decrease dose',
                    'Losing ≥ 5% of body weight in a month → Forward to provider',
                ],
            },
            values: ['Approved', 'Not approved (Add note)'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Follow-up (select one): ',
            values: ['1 month', '3 month', 'None. Refer to PCP'],
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

export const GLP1_RENEWAL_TEMPLATE_V3: ClinicalNoteTemplate = {
    version: 3,
    render: [
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            default: true,
            values: [
                'Check-in reviewed',
                'Medical history, medication and allergies reviewed and updated as needed',
                'Weight trends and side effects reviewed.',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Plan (Select one): ',
            values: [
                'CONTINUE PROTOCOL. Patient is deemed suitable to continue on standard titration schedule.',
                'DIFFERENT PROTOCOL. Titration schedule needs to be adjusted. Add note.',
                'SWITCH MEDICATION. Patient is no longer approved to continue on current medication.',
                'DISCONTINUE: Patient is not approved to continue on GLP1s',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.MULTISELECT,
            title: 'Approved Dosage Options: ',
            values: [
                'Semaglutide 0.25mg',
                'Semaglutide 0.5mg',
                'Semaglutide 1mg',
                'Semaglutide 1.25mg',
                'Semaglutide 2.5mg',
                'Tirzepatide 2.5mg',
                'Tirzepatide 5mg',
                'Tirzepatide 7.5mg',
                'Tirzepatide 10mg',
                'Tirzepatide 12.5mg',
                'Other (Add in note)',
                'None',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            title: 'Follow-up (select one): ',
            values: [
                '1 -month supply refill',
                '3 -month supply refill',
                '6 -month supply refill',
                'Ondansetron prn nausea/vomiting',
                'None. This is a check-in',
                'None. Patient to discontinue WL medication',
            ],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            custom: {
                type: 'tooltip',
                text: 'Standing Order',
                hover: [
                    'Patient with no reported side effects, administered minimum of 2 injections of a particular dose, minimum duration of at least 14 days on a given dose, BMI ≥ 22, and:',
                    'Losing < 5% of body weight in a month → Eligible to increase, stay, or decrease dose',
                    'Losing ≥ 5% of body weight in a month → Forward to provider',
                ],
            },
            values: ['Approved', 'Not approved (Add note)'],
        },
        {
            type: ClinicalNoteTemplateOptionType.SELECT,
            default: false,
            title: 'Follow-up (select one): ',
            values: ['1 month', '3 month', 'None. Refer to PCP', 'N/A'],
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
