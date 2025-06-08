export enum QuestionnaireType {
    CheckUp = 'check_up',
    Intake = 'intake',
}

export interface IntakeQuestionnaire {
    question_id: number;
    question: any;
    answer: any;
    product_name: string;
}

export interface CheckupQuestionnaire {
    question_id: number;
    question: any;
    answer: any;
}

export interface TaskViewQuestionData {
    product_name: string;
    submission_time: string;
    responses: TaskViewQuestionResponse[];
}

export interface TaskViewQuestionResponse {
    question_id: number;
    question: {
        question: string;
        options?: string[];
        noneBox?: boolean;
        other?: boolean;
    };
    answer: {
        answer: string;
        question: string;
        formData: string[];
    };
}

export interface CheckupResponse {
    question_id: number;
    question: {
        type: string;
        options: any[];
        question: string;
        placeholder: any;
        singleChoice?: boolean;
        multiline?: boolean;
        fieldCount?: number;
        label?: any[];
        noneBox?: boolean;
        other?: boolean;
    };
    answer: any;
    product_name: string;
    submission_time?: string;
}

export interface GroupedResponses {
    [key: string]: CheckupResponse[];
}

export interface CheckupResponseReturn {
    product_name: string;
    responses: CheckupResponse[];
    index: number;
    checkup_name?: string;
    submission_time: string;
}

export interface QuestionnaireAnswer {
    id: number;
    created_at: Date;
    user_id: string;
    question_id: number;
    answer: any;
    answer_set_version: number;
}

export interface QuestionInformation {
    question_id: number;
    question: any;
    answer: any | null;
}

export enum GLP1Questions {
    TakenGLP1 = 280,
    WhichGLP1 = 281,
    RecentWeeklyDosage = 282,
    DosageDuration = 284,
    ContinueSameDosage = 286,
    NewRequestedDosage = 287,
}

export type DosageInfo = {
    dosage: number;
    monthly_variant_index: number;
    bundle_variant_index: number;
};

export type MedicationDictionary = {
    semaglutide: {
        [key: string]: DosageInfo;
    };
    tirzepatide: {
        [key: string]: DosageInfo;
    };
};
