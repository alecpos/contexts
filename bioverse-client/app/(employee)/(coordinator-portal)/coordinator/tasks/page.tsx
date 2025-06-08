'use server';

import TaskAssignmentComponent from '@/app/components/coordinator-portal/tasks/task-assignment-page/components/task-assignment-container';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import React from 'react';

interface TaskPageProps {}

export default async function ProviderTaskPage({}: TaskPageProps) {
    const userId = (await readUserSession()).data.session?.user.id;
    const employeeAuthorization = await getEmployeeAuthorization(userId ?? '');

    return (
        <>
            <TaskAssignmentComponent
                userId={userId ?? ''}
                employeeAuthorization={employeeAuthorization}
            />
        </>
    );
}
