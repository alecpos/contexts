'use server';

import AdminAppControlContainer from '@/app/components/admin/application-control/application-control';
import { getCurrentEmployeeRole } from '@/app/utils/database/controller/employees/employees-api';
import { redirect } from 'next/navigation';

export default async function AppControlPage() {
    const role = await getCurrentEmployeeRole();

    if (!role) {
        return redirect('/');
    }

    return (
        <>
            <AdminAppControlContainer role={role} />
        </>
    );
}
