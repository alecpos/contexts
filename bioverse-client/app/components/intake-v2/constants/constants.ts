/**
 * Constants associated with intake but not specific enough to warrant their own file.
 */

import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { DosageDurationAnswers } from '@/app/types/intake/intake-flow-types';

export const ALLOWED_STATES: USStates[] = [
    USStates.Florida,
    USStates.Texas,
    USStates.NewJersey,
    USStates.Michigan,
    USStates.California,
    USStates.Ohio,
    USStates.Pennsylvania,
    USStates.Washington,
    USStates.NorthCarolina,
    USStates.Virginia,
    USStates.Indiana,
    USStates.Illinois,
    USStates.Colorado,
];
export const SEMAGLUTIDE_PRODUCTS = [
    PRODUCT_HREF.OZEMPIC,
    PRODUCT_HREF.SEMAGLUTIDE,
    PRODUCT_HREF.WEGOVY,
    PRODUCT_HREF.OZEMPIC_TEST,
];
export const TIRZEPATIDE_PRODUCTS = [
    PRODUCT_HREF.TIRZEPATIDE,
    PRODUCT_HREF.MOUNJARO,
    PRODUCT_HREF.ZEPBOUND,
];

export const SKINCARE_PRODUCT_HREF: string[] = [PRODUCT_HREF.TRETINOIN];
export const WEIGHT_LOSS_PRODUCT_HREF: string[] = [
    PRODUCT_HREF.OZEMPIC,
    PRODUCT_HREF.ZEPBOUND,
    PRODUCT_HREF.SEMAGLUTIDE,
    PRODUCT_HREF.MOUNJARO,
    PRODUCT_HREF.TIRZEPATIDE,
    PRODUCT_HREF.WEGOVY,
    PRODUCT_HREF.OZEMPIC_TEST,
];

export const TRANSITION_SCREEN_NAMES = [
    'wl-goal-transition',
    'wl-family-transition',
    'glp-1-warning-transition',
    'nad-researchers',
    'skincare-ingredients',
    'skincare-results',
    'skincare-reviews',
    'skincare-side-effects',
    'glp-select-treatment',
    'wl-customer-review-transition',
    'wl-up-next-hh-transition',
    'ed-drug-warning',
    'wl-sleep-fact',
    'wl-hormone-info',
    'wl-suicidal-prevention',
    'wl-nicotine-info',
    'wl-final-review-request',
    'wl-side-effect-disclaimer',
    'wl-checkup-side-effect-seek-help',
    'competitor-comparisons',
    'ro-competitor-comparison',
    'found-competitor-comparison',
    'ivim-health-competitor-comparison',
    'weight-watchers-competitor-comparison',
    'noom-competitor-comparison',
    'other-plans-competitor-comparison',
    'henry-meds-competitor-comparison',
];

export const WEIGHTLOSS_GOAL_QUESTION_ID = 167;
export const WEIGHTLOSS_RECENT_DOSE_QUESTION_ID = 282;

export const dosageDurationMap = new Map<string, number>([
    [DosageDurationAnswers.OneWeek, 1],
    [DosageDurationAnswers.TwoWeeks, 2],
    [DosageDurationAnswers.ThreeWeeks, 3],
    [DosageDurationAnswers.OneMonth, 4],
    [DosageDurationAnswers.OneMonthPlus, 5],
]);

export const CALIFORNIA_ALLOWED_PRODUCTS = [
    // PRODUCT_HREF.B12_INJECTION,
    //PRODUCT_HREF.TRETINOIN,
    // PRODUCT_HREF.GLUTATIONE_INJECTION,
    PRODUCT_HREF.SEMAGLUTIDE,
    PRODUCT_HREF.TIRZEPATIDE,
    PRODUCT_HREF.WEIGHT_LOSS,
    //PRODUCT_HREF.ED_GLOBAL,
];
