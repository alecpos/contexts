import { NextRequest, NextResponse } from 'next/server';
import { writeQuestionnaireAnswer } from '@/app/utils/database/controller/questionnaires/questionnaire';

/**
 * API endpoint to record a patient's goal weight.
 * Expects JSON: { user_id: string, weight: number }
 */
export async function POST(req: NextRequest) {
  try {
    const { user_id, weight } = await req.json();
    if (!user_id || typeof weight !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const QUESTION_ID_GOAL_WEIGHT = 2303;
    await writeQuestionnaireAnswer(user_id, QUESTION_ID_GOAL_WEIGHT, { formData: [weight] }, 1);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('goal-weight POST error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
