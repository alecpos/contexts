'use server';

import ProviderMessageDashboard from '@/app/components/provider-portal/messages/components/provider-message-dashboard/provider-message-dashboard';
import {
    readUserSession,
    getAuthLevel,
} from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';

export default async function ProviderPortalMessages() {
    const { data: activeSession } = await readUserSession();

    if (!activeSession.session) {
        return redirect('/provider-auth/login');
    }

    // Getting access levels
    const authLevel = await getAuthLevel();

    const userId = activeSession?.session?.user?.id;

    if (!userId || !authLevel) {
        return null;
    }

    // People using this: Provider, customer support & admins
    // Auth Access Roles
    // Access Level 0: Provider: Can see all messages sent by their patients
    // Access Level 1: Admin & Customer Support: Can see all messages sent by all patients

    return (
        <div className="flex flex-col w-full justify-self-center justify-center items-center h-full">
            {/* <AdminMessageCenter
                availableUsers={availableUsers}
                accessLevel={accessLevel}
                userId={userId}
                authLevel={authLevel}
                threads_data={threads_data}
            /> */}
            <ProviderMessageDashboard userId={userId} />
        </div>
    );
}

// Left hand panel of search bar and users to message

// Retrieve: All users to message
