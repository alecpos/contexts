import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

    const credentials = {
        server: process.env.RC_SERVER_URL,
        clientId: process.env.RC_APP_CLIENT_ID,
        clientSecret: process.env.RC_APP_CLIENT_SECRET,
        jwt: process.env.RC_USER_JWT ,
    };

    return NextResponse.json(credentials);
}

