'use server';

import { getURL } from '@/app/utils/functions/utils';

export async function getNextCoordinatorTask(
    userId: string,
): Promise<number | null> {
    const url = await getURL();

    const res = await fetch(`${url}/api/coordinator-portal/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.BV_API_KEY}`,
        },
        body: JSON.stringify({
            userId: userId,
        }),
    });

    const data = await res.json();
    return data.taskItemId;
}
