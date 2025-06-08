'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import RN_Dashboard_Table from '@/app/components/registered-nurse-portal/dashboard/rn-dashboard-table';
import {
    getCurrentEmployeeRole,
    getEmployeeRecordById,
} from '@/app/utils/database/controller/employees/employees-api';

export default async function ProviderPortal() {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession.session?.user.id;

    const employee_authorization = await getCurrentEmployeeRole();
    const employee_data = await getEmployeeRecordById(user_id!);

    return (
        <div
            className='min-h-screen w-full'
            style={{
                background:
                    'linear-gradient(180deg, rgba(178, 232, 255, 0.20) 0%, rgba(178, 232, 255, 0.00) 100%), #FFF',
            }}
        >
            <div className='flex flex-row justify-center min-h-[100vh]'>
                <div className='flex flex-col gap-6 mb-[150px] min-w-[75vw] max-w-[95vw] mt-10'>
                    <RN_Dashboard_Table
                        userId={user_id!}
                        employee_authorization={employee_authorization}
                        employee_name={employee_data?.display_name}
                    />
                </div>
            </div>
        </div>
    );
}
