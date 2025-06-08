import { Question } from '../questionnaire-question-constants';

export const WEIGHTLOSS_CHECKUP_QUESTIONS_VERSION_TWO: Question[] = [
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
            type: 'checkbox',
            options: ['1 week', '2 weeks', '3 weeks', '4 weeks'],
            question: 'How many weeks have you been taking this dose?',
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
            type: 'input',
            question:
                'Tell us anything else you’d like your provider to know when refilling your medication.',
            fieldCount: 1,
            placeholder: ['Tell us more.'],
            multiline: true,
        },
    },
    {
        question: {
            type: 'checkbox',
            options: [
                'Yes, something has changed about my medical history',
                'No, I don’t have any changes to report',
            ],
            question:
                'Since the last time you reported your medical information, has there been any change in your medical history?',
            placeholder: 'Please select an option.',
            singleChoice: true,
        },
    },
    {
        question: {
            type: 'input',
            question:
                'Please tell us what’s new with your health, including new medical conditions or diagnoses.',
            fieldCount: 1,
            placeholder: ["Tell us what's new."],
            multiline: true,
        },
    },
    {
        question: {
            type: 'checkbox',
            options: [
                'Yes, I am taking a new medication',
                'No, I don’t have any changes to report',
            ],
            question:
                'Since the last time you reported your medical information, are you taking any new medications?',
            placeholder: 'Please select an option.',
            singleChoice: true,
        },
    },
    {
        question: {
            type: 'input',
            question: 'Please list any new medications you are taking.',
            fieldCount: 1,
            placeholder: ['Tell us the names and dosages.'],
            multiline: true,
        },
    },
];
