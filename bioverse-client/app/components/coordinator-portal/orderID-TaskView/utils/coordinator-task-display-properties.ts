import { StatusTag } from '@/app/types/status-tags/status-types';

export function getCoordinatorTaskTitle(statusTag: StatusTag) {
    switch (statusTag) {
        case StatusTag.AwaitingResponse:
            return 'Follow up with a response';
        case StatusTag.FollowUp:
            return 'Send a follow-up message or check in with the patient';
        case StatusTag.IDDocs:
            return `Request or verify the patient's docs or required documents`;
        case StatusTag.Coordinator:
            return 'Review for decision and message';
        case StatusTag.ReadPatientMessage:
            return 'Review and respond to the patient&apos;s message';
        case StatusTag.LeadCoordinator:
            return 'Review for decision and message';
        case StatusTag.DoctorLetterRequired:
            return 'Request a doctor&apos;s letter or supporting medical documentation';
        case StatusTag.CancelOrderOrSubscription:
            return `Process the cancellation of the patient's order or subscription`;
        default:
            return `No Title Mapped For Status Tag. ${statusTag}`;
    }
}

export interface CoordinatorReviewWidth {
    patientInformation: number;
    clinicalNotes: number;
    tabWindow: number;
}

export function determineCoordinatorWidthArray(
    intake_visible: boolean,
    patient_information_visible: boolean
): CoordinatorReviewWidth {
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
