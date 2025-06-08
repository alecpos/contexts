'use server';

import PatientInformationContainer from '@/app/components/provider-coordinator-shared/all-patients/components/patient-page/patient-container';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getCurrentEmployeeRole } from '@/app/utils/database/controller/employees/employees-api';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        patient_id: string;
    };
    searchParams: {
        tab: string;
    };
}

export default async function AllPatientsPage({ params, searchParams }: Props) {
    const role = await getCurrentEmployeeRole();
    const { data: activeSession } = await readUserSession();
    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e'
    const user_id = activeSession?.session?.user.id;

    if (!determineAccessByRoleName(role, BV_AUTH_TYPE.PROVIDER) || !user_id) {
        return redirect('/');
    }

    const current_tab_index = searchParams.tab;

    return (
        <>
            <div className="flex justify-center items-center py-10 px-40">
                <PatientInformationContainer
                    patient_id={params.patient_id}
                    access_type={role}
                    current_tab_index={
                        current_tab_index
                            ? parseInt(current_tab_index)
                            : undefined
                    }
                    user_id={user_id}
                />
            </div>
        </>
    );
}
