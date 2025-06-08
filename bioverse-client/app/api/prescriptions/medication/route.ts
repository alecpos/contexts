import { NextRequest, NextResponse } from 'next/server';
import { writeQuestionnaireAnswer } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getDoseSpotIframeUrlForGeneral } from '@/app/services/dosespot/v2/iframe/iframe-url-controller-v2';

const QUESTION_ID_SELECTED_MEDICATION = 2357;

/**
 * Stub endpoint to create a prescription record for the selected medication.
 * Expects JSON: { user_id: string, medication: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { user_id, medication } = await req.json();
    if (!user_id || typeof medication !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await writeQuestionnaireAnswer(
      user_id,
      QUESTION_ID_SELECTED_MEDICATION,
      { formData: [medication] },
      1
    );

    const { url } = await getDoseSpotIframeUrlForGeneral(user_id);

    return NextResponse.json({ success: true, doseSpotUrl: url });
  } catch (error: any) {
    console.error('medication POST error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
