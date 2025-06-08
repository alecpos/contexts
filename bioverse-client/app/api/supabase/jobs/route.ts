'use server';

import { JobFactory } from '@/app/utils/functions/jobs/JobsFactory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const apiKey = `Bearer ${process.env.SUPABASE_JOBS_API_KEY}`;

    if (authHeader !== apiKey) {
        console.error('Unauthorized job api', authHeader);
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Get the JSON data from the request body
        const jsonData = await req.json();

        const JobFactoryInstance = new JobFactory(jsonData);

        const res = await JobFactoryInstance.processRequest();

        if (!res) {
            console.error('Could not process request supabase jobs', jsonData);
            return new NextResponse(
                JSON.stringify({ error: 'Internal Server Error' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new NextResponse(JSON.stringify(res), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing webhook:', error);

        // Return an error response
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
