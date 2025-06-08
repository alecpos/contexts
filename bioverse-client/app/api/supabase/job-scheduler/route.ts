'use server';

import { JobScheduler } from '@/app/types/job-scheduler/job-scheduler-types';
import { JobSchedulerFactory } from '@/app/utils/functions/job-scheduler/JobSchedulerFactory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const apiKey = `Bearer ${process.env.SUPABASE_JOBS_API_KEY}`;

    // if (authHeader !== apiKey) {
    //     console.error('Unauthorized job api', authHeader);
    //     return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
    //         status: 401,
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // }

    try {
        // Get the JSON data from the request body
        const jobData = (await req.json()) as JobScheduler;

        const jobFactory = new JobSchedulerFactory(jobData);

        await jobFactory.executeJob();

        return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (error) {
        console.error('Error processing job:', error);

        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
