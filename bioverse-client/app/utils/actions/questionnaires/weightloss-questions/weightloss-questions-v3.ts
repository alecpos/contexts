import { Question } from '../questionnaire-question-constants';

export const WEIGHTLOSS_CHECKUP_QUESTIONS_VERSION_THREE: Question[] = [
    {
        question: {
            type: 'input',
            label: ['lbs.'],
            question: 'What is your current weight?',
            fieldCount: 1,
            placeholder: [],
        },
    },
    {
        question: {
            type: 'checkbox',
            other: true,
            options: [
                'Compounded Semaglutide',
                'Compounded Tirzepatide',
                'Wegovy® (Semaglutide)',
                'Ozempic® (Semaglutide)',
                'Mounjaro® (Tirzepatide)',
            ],
            question: "Please confirm which medication you're taking",
            singleChoice: true,
        },
    },
    {
        question: {
            type: 'custom',
            question:
                'What was the most recent weekly dose of [previous answer] you took?',
            skippable: false,
            custom_name: 'glp-checkup-weekly-dose',
        },
    },
    {
        question: {
            type: 'checkbox',
            options: ['1 week', '2 weeks', '3 weeks', '4 weeks'],
            question: 'How many weeks have you been taking this dose?',
            singleChoice: true,
        },
    },
    {
        question: {
            type: 'logic',
            steps: [
                {
                    step: 1,
                    type: 'mcq',
                    options: ['Yes', 'No'],
                    question: 'Are you happy with your current dosage?',
                    nextStepReq: 'No',
                },
                {
                    step: 2,
                    type: 'input',
                    placeholder: 'Tell us more.',
                },
            ],
            stepCount: 2,
        },
    },
    {
        question: {
            type: 'logic',
            subtitle: 'Most patients will increase their dosage at this point.',
            steps: [
                {
                    step: 1,
                    type: 'mcq',
                    options: ['Yes', 'No'],
                    question:
                        'Would you like to continue with the same medication at a higher dosage?',
                    nextStepReq: 'Yes',
                },
                {
                    step: 2,
                    type: 'input',
                    placeholder: 'Tell us more.',
                },
            ],
            stepCount: 2,
        },
    },
    {
        question: {
            type: 'logic',
            steps: [
                {
                    step: 1,
                    type: 'mcq',
                    options: ['No', 'Yes'],
                    question:
                        'Are you currently experiencing any side effects from your weight loss medication?',
                    nextStepReq: 'Yes',
                },
                {
                    step: 2,
                    type: 'input',
                    placeholder: 'Tell us more.',
                },
            ],
            stepCount: 2,
        },
    },
    {
        question: {
            type: 'custom',
            question:
                "Tell us anything else you'd like your provider to know when refilling your medication.",
            custom_name: 'wl-checkin-anythingelse',
            skippable: false,
        },
    },
    {
        question: {
            type: 'logic',
            steps: [
                {
                    step: 1,
                    type: 'mcq',
                    options: [
                        "No, I don't have any changes to report",
                        'Yes, something has changed about my medical history',
                    ],
                    question:
                        'Are you currently experiencing any side effects from your weight loss medication?',
                    nextStepReq:
                        'Yes, something has changed about my medical history',
                },
                {
                    step: 2,
                    type: 'input',
                    question:
                        "Please tell us what's new with your health, including new medical conditions or diagnoses.",
                },
            ],
            stepCount: 2,
        },
    },
    {
        question: {
            type: 'logic',
            steps: [
                {
                    step: 1,
                    type: 'mcq',
                    options: [
                        "No, I don't have any changes to report",
                        'Yes, I am taking a new medication',
                    ],
                    question:
                        'Since last time you reported your medical information, are you taking any new medications?',
                    nextStepReq: 'Yes, I am taking a new medication',
                },
                {
                    step: 2,
                    type: 'input',
                    question: 'Please list any new medications you are taking.',
                },
            ],
            stepCount: 2,
        },
    },
];
