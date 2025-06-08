import { NextRequest, NextResponse } from 'next/server';
import { SDK } from '@ringcentral/sdk';

export async function POST(req: NextRequest) {
    const rc = new SDK({
        server: process.env.RC_SERVER_URL,
        clientId: process.env.RC_APP_CLIENT_ID,
        clientSecret: process.env.RC_APP_CLIENT_SECRET,
    });

    try {
        await rc.login({ jwt: process.env.RC_USER_JWT });
        const response = await rc.platform().post('/restapi/v1.0/client-info/sip-provision', {
            sipInfo: [{ transport: 'WSS' }],
        });

        const data = await response.json();
        const sipInfo = data.sipInfo[0];

        await rc.logout();
        return NextResponse.json({ sipInfo });
    } catch (error) {
        console.error('SIP Provision Error:', error);
        return NextResponse.json({ error: 'Failed to get SIP info' }, { status: 500 });
    }
}