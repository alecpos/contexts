'use server';

import TXPatientCSV from '@/app/components/provider-portal/csv-download/TXPatientCSV';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';

export default async function TxPatientListPage() {
    const { data: activeSession } = await readUserSession();
    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e'
    const loggedInUserId = activeSession?.session?.user.id;

    if (!loggedInUserId) {
        return null;
    }

    const loggedInUserAuthorization = await getEmployeeAuthorization(
        loggedInUserId
    );

    return (
        <div
            className='flex flex-col mt-28 w-full items-center justify-center'
            id='provider-tx-patient-list-page'
        >
            <TXPatientCSV />
        </div>
    );
}
