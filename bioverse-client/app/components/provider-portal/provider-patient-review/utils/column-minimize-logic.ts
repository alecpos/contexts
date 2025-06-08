export interface ProviderReviewWidth {
    patientInformation: number;
    clinicalNotes: number;
    tabWindow: number;
}

export function determineProviderReviewWidth(
    intake_visible: boolean,
    patient_information_visible: boolean
    // tab_window_visible: boolean
): ProviderReviewWidth {
    if (!intake_visible && !patient_information_visible) {
        return {
            patientInformation: 33,
            clinicalNotes: 33,
            tabWindow: 33,
        };
    }

    if (intake_visible && !patient_information_visible) {
        return { patientInformation: 0, clinicalNotes: 50, tabWindow: 50 };
    }

    if (!intake_visible && patient_information_visible) {
        return { patientInformation: 50, clinicalNotes: 0, tabWindow: 50 };
    }

    if (intake_visible && patient_information_visible) {
        return { patientInformation: 0, clinicalNotes: 0, tabWindow: 92 };
    }

    return { patientInformation: 33, clinicalNotes: 33, tabWindow: 33 };
}
