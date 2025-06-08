import { NextResponse } from 'next/server';

const MEDICATION_OPTIONS = ['Ozempic', 'Mounjaro', 'Zepbound', 'BIOVERSE Weight Loss Capsule'];

/**
 * Returns medication options available for the global weight loss funnel.
 */
export async function GET() {
  return NextResponse.json({ medications: MEDICATION_OPTIONS });
}
