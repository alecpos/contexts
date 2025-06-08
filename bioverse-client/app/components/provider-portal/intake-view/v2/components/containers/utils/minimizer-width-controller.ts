/**
 * This file is used to control the width of the intake view windows dependent on which ones are visible or not.
 *
 */

/**
 * At time of writing, only two windows are minimizable. In the future there may be further need.
 */

export interface ProviderWidths {
    intake: number;
    patientInformation: number;
    tabWindow: number;
}

export function determineProviderIntakeWidth(
    intake_visible: boolean,
    patient_information_visible: boolean
    // tab_window_visible: boolean
): ProviderWidths {
    if (!intake_visible && !patient_information_visible) {
        return { intake: 24.5, patientInformation: 41.3, tabWindow: 41.3 };
    }

    if (intake_visible && !patient_information_visible) {
        return { intake: 0, patientInformation: 45.6, tabWindow: 45.6 };
    }

    if (!intake_visible && patient_information_visible) {
        return { intake: 30.5, patientInformation: 0, tabWindow: 62.7 };
    }

    if (intake_visible && patient_information_visible) {
        return { intake: 0, patientInformation: 0, tabWindow: 93.2 };
    }

    return { intake: 24.5, patientInformation: 41.3, tabWindow: 41.3 };
}
