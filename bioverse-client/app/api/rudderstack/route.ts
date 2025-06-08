'use server';
import { NextRequest, NextResponse } from 'next/server';
import RudderAnalytics, { apiObject } from '@rudderstack/rudder-sdk-node';
import { RudderstackEventType } from '@/app/types/services/rudderstack/rudderstack-types';

const client = new RudderAnalytics(process.env.RUDDERSTACK_API_KEY!, {
    dataPlaneUrl: process.env.RUDDERSTACK_DATA_PLANE_URL!,
    flushAt: 20,
    flushInterval: 20000,
    // the max number of elements that the SDK can hold in memory,
    // this is different than the Redis list created when persistence is enabled.
    // This restricts the data in-memory when Redis is down, unreachable etc.
    maxInternalQueueSize: 20000,
});

// client.createPersistenceQueue(
//     {
//         redisOpts: {
//             host: 'localhost',
//         },
//     },
//     (err) => {},
// );

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    const apiKey = `Bearer ${process.env.SUPABASE_JOBS_API_KEY}`;

    if (authHeader !== apiKey) {
        console.error('Unauthorized job api', authHeader);
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { eventType, payload } = await request.json();

    // console.log('Received rudderstack request', eventType, payload);

    try {
        if (eventType === RudderstackEventType.Track) {
            const pulled_context = payload.properties.context;

            const { context, ...properties_no_context } = payload.properties;

            // console.log(
            //     'rudderstack monitor check nathan ',
            //     properties_no_context,
            //     ' payload properties ',
            //     payload.properties
            // );

            // const req = client.track(payload);
            //sending twice as test:
            const req2 = client.track({
                event: payload.event,
                properties: properties_no_context,
                context: pulled_context,
                userId: payload.userId,
            });

            // console.log('Rudderstack Testing With Events Sent', {
            //     event: payload.event,
            //     properties: payload.properties,
            //     context: payload.properties.context,
            //     userId: payload.userId,
            // });
        } else if (eventType === RudderstackEventType.Identify) {
            const req = client.identify(payload);
        } else if (eventType === RudderstackEventType.Alias) {
            const res = client.alias(payload);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error tracking event:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
