'use server';

import TimeTrackerContent from '@/app/components/provider-portal/track-hours-v2/provider-time-tracker-content';
import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import {
    getProviderArray,
    getRegisteredNurseArray,
} from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-functions';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

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

    const providerArray = await getRegisteredNurseArray();

    const filteredArray =
        loggedInUserAuthorization === BV_AUTH_TYPE.ADMIN ||
        loggedInUserAuthorization === BV_AUTH_TYPE.LEAD_PROVIDER
            ? providerArray
            : providerArray.filter(
                  (provider) => provider.id === loggedInUserId
              );

    return (
        <>
            <TimeTrackerContent providerArray={filteredArray} />
        </>
    );
}
