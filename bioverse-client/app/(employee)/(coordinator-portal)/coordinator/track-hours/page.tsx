'use server';

import CoordaintorTimeTrackerContent from '@/app/components/coordinator-portal/track-hours/coordinator-time-tracker-content';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import { getCoordinatorArray } from '@/app/utils/functions/coordinator-portal/time-tracker/coordinator-time-tracker-functions';
import React from 'react';

interface PageProps {}

export default async function TrackHoursPage({}: PageProps) {
    const { data: activeSession } = await readUserSession();
    const loggedInUserId = activeSession?.session?.user.id;

    if (!loggedInUserId) {
        return null;
    }

    const loggedInUserAuthorization = await getEmployeeAuthorization(
        loggedInUserId
    );

    if (!loggedInUserAuthorization) {
        return null;
    }

    const coordinatorArray = await getCoordinatorArray();

    const filteredArray =
        loggedInUserAuthorization === BV_AUTH_TYPE.ADMIN ||
        loggedInUserAuthorization === BV_AUTH_TYPE.LEAD_COORDINATOR
            ? coordinatorArray
            : coordinatorArray.filter(
                  (coordinator) => coordinator.id === loggedInUserId
              );

    return (
        <>
            <CoordaintorTimeTrackerContent coordinatorArray={filteredArray} />
        </>
    );
}
