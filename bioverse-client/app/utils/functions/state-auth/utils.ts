import { USStates } from '@/app/types/enums/master-enums';
import {
    ED_FREQUENCY,
    PRODUCT_HREF,
} from '@/app/types/global/product-enumerator';

// To be used prior to confirmation screen, if applicable
export function getUserStateEligibilitySelectionScreen(
    product_href: string,
    frequency: string,
    state: string | null,
): boolean {
    const INELIGIBLE_STATES: Record<string, Record<string, string[]>> = {
        [PRODUCT_HREF.PEAK_CHEWS]: {
            [ED_FREQUENCY.AS_NEEDED]: [
                USStates.NorthCarolina,
                USStates.California,
            ],
            [ED_FREQUENCY.DAILY]: [USStates.California],
        },
        [PRODUCT_HREF.VIAGRA]: {
            [ED_FREQUENCY.AS_NEEDED]: [USStates.NorthCarolina],
        },
        [PRODUCT_HREF.TADALAFIL]: {
            [ED_FREQUENCY.DAILY]: [USStates.NorthCarolina],
        },
        [PRODUCT_HREF.RUSH_CHEWS]: {
            [ED_FREQUENCY.AS_NEEDED]: [USStates.California],
            [ED_FREQUENCY.DAILY]: [USStates.California],
        },
        [PRODUCT_HREF.X_MELTS]: {
            [ED_FREQUENCY.AS_NEEDED]: [USStates.California],
            [ED_FREQUENCY.DAILY]: [USStates.California],
        },
        [PRODUCT_HREF.X_CHEWS]: {
            [ED_FREQUENCY.AS_NEEDED]: [USStates.California],
            [ED_FREQUENCY.DAILY]: [USStates.California],
        },
    };

    if (!state) {
        return true;
    }

    // Check if the product has ineligible states and if the state is in that list
    if (
        INELIGIBLE_STATES[product_href] &&
        INELIGIBLE_STATES[product_href][frequency] &&
        INELIGIBLE_STATES[product_href][frequency].includes(state)
    ) {
        return false; // User is in an ineligible state
    }

    return true; // User is eligible by default
}

// To be used when patient selects their dosage
export function getUserStateEligibilityDosage(
    product_href: string,
    frequency: string,
    dosage: string | undefined,
    state: string | null,
): boolean {
    const INELIGIBLE_STATES: Record<
        string,
        Record<string, Record<string, string[]>>
    > = {
        [PRODUCT_HREF.TADALAFIL]: {
            [ED_FREQUENCY.AS_NEEDED]: {
                '5mg': [USStates.NorthCarolina],
                '20mg': [USStates.NorthCarolina],
            },
        },
        [PRODUCT_HREF.CIALIS]: {
            [ED_FREQUENCY.AS_NEEDED]: {
                '10 mg': [USStates.NorthCarolina],
                '20 mg': [USStates.NorthCarolina],
            },
        },
    };

    if (!state || !dosage) {
        return true; // Assume eligibility if state or dosage is missing
    }

    // Check if the product and dosage exist in INELIGIBLE_STATES before accessing them
    if (
        INELIGIBLE_STATES[product_href] &&
        INELIGIBLE_STATES[product_href][frequency] &&
        INELIGIBLE_STATES[product_href][frequency][dosage] &&
        INELIGIBLE_STATES[product_href][frequency][dosage].includes(state)
    ) {
        return false; // User is in an ineligible state
    }

    return true; // Default to eligible if no restrictions are found
}

// To be checked on state selection screen
export function stateSelectionUserEligbility(
    product_href: string,
    state: USStates,
) {
    const INELIGIBLE_STATES: Record<string, USStates[]> = {
        [PRODUCT_HREF.METFORMIN]: [USStates.NorthCarolina],
        [PRODUCT_HREF.B12_INJECTION]: [USStates.NorthCarolina],
        [PRODUCT_HREF.GLUTATIONE_INJECTION]: [USStates.NorthCarolina],
        [PRODUCT_HREF.NAD_FACE_CREAM]: [USStates.NorthCarolina],
        [PRODUCT_HREF.NAD_INJECTION]: [USStates.NorthCarolina],
        [PRODUCT_HREF.NAD_NASAL_SPRAY]: [USStates.NorthCarolina],
        [PRODUCT_HREF.NAD_PATCHES]: [USStates.NorthCarolina],
        [PRODUCT_HREF.X_CHEWS]: [USStates.California],
        [PRODUCT_HREF.X_MELTS]: [USStates.California],
        [PRODUCT_HREF.RUSH_CHEWS]: [USStates.California],
        [PRODUCT_HREF.RUSH_MELTS]: [USStates.California],
    };

    if (
        INELIGIBLE_STATES[product_href] &&
        INELIGIBLE_STATES[product_href].includes(state)
    ) {
        return false;
    }

    return true;
}
