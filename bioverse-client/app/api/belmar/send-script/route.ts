import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    return Response.json({}, { status: 200 });
}
