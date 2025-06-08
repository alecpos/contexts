'use server';

import { getAllCheckupResponsesWithSession } from '@/app/utils/database/controller/questionnaires/questionnaire';

export async function devScript() {
    const res = await getAllCheckupResponsesWithSession(
        'e555bc9a-d60e-4bf9-894d-79723180178f'
    );

    return res;
}
