/**
 * The following questions need logic applied to tell what to send them to AFTER the user has answered & must send the user to a different question.
 *
 * 23: Which of the following apply to your reproductive status?
 * 275: What was your sex assigned at birth?
 * 276: Do you identify as a man?
 * 278: Do you have any family members who struggle with their weight?
 * 280: CUSTOM: glp-1-before
 * 281: Which of the following GLP-1 medication have you taken over the last month?
 * 282: What was the most recent weekly dose of Compounded Semaglutide you took?
 * 283: What was the most recent weekly dose of Compounded Tirzepatide you took?
 * 284: CUSTOM: glp-how-long
 * 285: CUSTOM: glp-1-side-effects
 * 286: Would you like to continue with the same medication and dosage?
 * 287: What dosage would you like to switch to?
 * 505: Custom: GLP-1 Warning Transition Screen
 * 506: On average, how much weight are you losing per week?
 */

/**
 * List of question ID's such that if the user is on this question ID, there needs to be a pre-emptive check before proceeding to the next question.
 */
export const QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_POST: string[] = [
    '164',
    '275',
    '276',
    '278',
    '280',
    '281',
    '282',
    '283',
    '285',
    '286',
    '539',
    '540',
    '541',
    '542',
    '543',
    '544',
    '545',
    '546',
    '287',
    '505',
    '506',
    '895',
    '808',
    '166',
    '44',
    '1173',
    '1943',
    '15',
    '1948',
    '1973', //goes into ED 1974 or skips - ED
    '1974', //determines next path in tree - ED
    '1979',
    '1982',
    '1985',
    '1988',
    '1980',
    '1983',
    '1986',
    '167',
    '278',
];

/**
 * These are the question ID's which if the user is routing to them, then there needs to be a logical check as to whether they belong on that question
 */
export const QUESTIONS_WITH_CUSTOM_ROUTING_CHECK_PRE: string[] = [
    '23',
    '287',
    '288',
    '289',
    '290',
    '554',
    '555',
    '1100',
    '1102',
];

export const GENDER_IDENTITY_QUESTION_SET: string[] = ['275', '276', '277'];

export const WEIGHT_LOSS_DIETING_QUESTION_SET: string[] = ['164', '172'];

export const ADDITIONAL_MEDICATIONS_QUESTION_SET: string[] = [
    '895',
    '803',
    '804',
    '805',
];

export const WEIGHT_LOSS_GLP_1_QUESTION_SET: string[] = [
    '280',
    '281',
    '282',
    '283',
    '284',
    '285',
    '286',
    '505',
    '287',
    '506',
];

export const WL_FAMILY_STRUGGLE_QUESTION_SET: string[] = ['278', '279'];

export const WL_GOAL_QUESTION_SET: string[] = ['167', '174'];

export const MENTAL_HEALTH_QUESTION_SET: string[] = ['808', '809', '810'];

export const WL_INTAKE_REPRODUCTIVE_QUESTION_SET: string[] = ['288', '289'];

export const SKINCARE_INTAKE_REPRODUCTIVE_QUESTION_SET: string[] = [
    '554',
    '555',
];

// used for b12 and glutathione
export const GENERAL_INTAKE_REPRODUCTIVE_QUESTION_SET: string[] = [
    '1100',
    '1102',
];

export const INTAKE_REPRODUCTIVE_QUESTION_SET: string[] = ['23'];

export const CONDITIONAL_QUESTIONS_LIST: string[] = [
    '172',
    '277',
    '281',
    '282',
    '283',
    '284',
    '285',
    '286',
    '287',
    '288',
    '289',
];
