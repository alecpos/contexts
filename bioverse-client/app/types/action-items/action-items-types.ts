export interface ActionItemType {
    id: number;
    created_at: Date;
    type: string;
    patient_id: string;
    last_updated_at: Date;
    active: boolean;
    submission_time: string;
    subscription_id: number;
    product_href: string;
    action_type: ActionType;
    iteration: number;
    question_set_version: number;
    questionnaire_session_id?: number;
}

export interface ItemConfig {
    title: string;
    description: string;
    button: {
        text: string;
        href: string;
    };
}

export enum ActionType {
    CheckUp = 'check_up',
    DosageSelection = 'dosage_selection',
    IDVerification = 'id_verification',
}
