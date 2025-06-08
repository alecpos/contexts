'use server';

import { cloneDeep } from 'lodash';

import { WEIGHTLOSS_CHECKUP_QUESTIONS_VERSION_THREE } from './weightloss-questions/weightloss-questions-v3';

export interface Question {
    question: any;
    id?: number;
}

const WL_CHECKUP_QUESTIONS: Question[] = [
    {
        question: {
            type: 'input',
            label: ['lbs.'],
            question: 'What is your current weight?',
            fieldCount: 1,
            placeholder: ['Enter value'],
        },
    },
    {
        question: {
            type: 'input',
            label: ['lbs.'],
            question: 'What is your goal weight?',
            fieldCount: 1,
            placeholder: ['Enter value'],
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
                        'Have you been taking your last prescription as instructed?',
                    nextStepReq: 'No',
                },
                {
                    step: 2,
                    type: 'input',
                    placeholder: 'Please provide detailed information.',
                },
            ],
            stepCount: 2,
        },
    },
    {
        question: {
            type: 'checkbox',
            options: ['Yes', 'No'],
            question: 'If appropriate, would you like to increase your dose?',
            placeholder:
                'Most patients will increase their dosage at this point.',
            singleChoice: true,
        },
    },
    {
        question: {
            type: 'checkbox',
            options: [
                'Within the week',
                '2 weeks ago',
                '3-4 weeks ago',
                '1-3 months ago',
                '3+ months ago',
            ],
            question: 'How many week(s) ago was your last injection?',
            placeholder: 'Please select an option.',
            singleChoice: false,
        },
    },
    {
        question: {
            type: 'checkbox',
            options: ['Yes', 'No'],
            question:
                'Are you experiencing any severe side effects from your weight loss medication?',
            singleChoice: true,
        },
    },
    {
        question: {
            type: 'custom',
            question: 'Transition Screen',
            skippable: false,
            custom_name: 'wl-checkup-side-effect-seek-help',
        },
    },
    {
        question: {
            type: 'custom',
            question:
                'Before we review your treatment request, is there anything else you want your prescriber to know about your health?',
            skippable: false,
            custom_name: 'wl-checkup-last-question',
        },
    },
];

const NON_WL_CHECKUP_QUESTIONS: Question[] = [
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
            type: 'logic',
            steps: [
                {
                    step: 1,
                    type: 'mcq',
                    options: ['Yes', 'No'],
                    question: 'Are you happy with your current medication?',
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
                    options: ['No', 'Yes'],
                    question:
                        'Are you currently experiencing any side effects from your medication?',
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
            multiline: true,
            fieldCount: 1,
            placeholder: ['Tell us what’s new.'],
        },
    },
    {
        question: {
            type: 'checkbox',
            options: [
                'Yes, I am taking a new medication',
                "No, I don't have any changes to report",
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
            multiline: true,
            fieldCount: 1,
            placeholder: ['Tell us the names and dosages.'],
        },
    },
];

export async function constructWeightlossCheckupQuestions(
    last_question_id: number
): Promise<Question[]> {
    let counter = last_question_id + 1;
    let weightlossQuestions = cloneDeep(
        WEIGHTLOSS_CHECKUP_QUESTIONS_VERSION_THREE
    );

    for (
        let i = 0;
        i < WEIGHTLOSS_CHECKUP_QUESTIONS_VERSION_THREE.length;
        i++
    ) {
        weightlossQuestions[i]['id'] = counter;

        // FOR GLP-1 Checkup Weekly Dose
        if (
            weightlossQuestions[i].question.custom_name ===
            'glp-checkup-weekly-dose'
        ) {
            weightlossQuestions[i].question.referenceQuestionId = counter - 1;
        }

        counter += 1;
    }
    return weightlossQuestions;
}

export async function constructNonWeightlossCheckupQuestions(
    last_question_id: number
): Promise<Question[]> {
    let counter = last_question_id + 1;
    let questions = cloneDeep(NON_WL_CHECKUP_QUESTIONS);

    for (let i = 0; i < NON_WL_CHECKUP_QUESTIONS.length; i++) {
        questions[i]['id'] = counter;
        counter += 1;
    }

    return questions;
}

export async function constructCheckupJunction(
    questions: Question[],
    questionnaire_id: number,
    last_question_id: number
) {
    let priority = 0;
    let res = [];

    for (let i = 0; i < questions.length; i++) {
        res.push({
            questionnaire_id,
            priority,
            question_id: questions[i]['id'],
            id: last_question_id + i,
        });
        priority += 10;
    }
    return res;
}
