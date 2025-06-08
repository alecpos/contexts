import { NextRequest, NextResponse } from 'next/server';

/**
 * Stub endpoint to create a prescription record for the selected medication.
 * Expects JSON: { user_id: string, medication: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { user_id, medication } = await req.json();
    if (!user_id || !medication) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // TODO: implement persistence logic
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('medication POST error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
