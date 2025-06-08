interface QUESTIONNAIRE_QUESTIONS_TYPE {
    id: number;
    question: any;
}

interface QUESTIONNAIRE_QUESTIONNAIRES_TYPE {
    id: number;
    product_name: string;
    product_id?: number;
    type?: string;
    question_set_version?: number;
    created_at: Date;
}

interface QUESTIONNAIRE_SESSIONS_TYPE {
    id: number;
    created_at: Date;
    user_id?: string;
    completion_time?: Date;
    metadata: any;
}

interface QUESTIONNAIRE_JUNCTION_TYPE {
    question_id?: number;
    questionnaire_id?: number;
    priority?: number;
    id: number;
}

interface QUESTIONNAIRE_ANSWERS_TYPE {
    id: number;
    created_at: Date;
    user_id?: string;
    question_id?: number;
    answer: any;
    answer_set_version?: number;
    session_id?: number;
}
