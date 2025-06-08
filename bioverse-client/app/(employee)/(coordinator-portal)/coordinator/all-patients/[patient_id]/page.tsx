'use server';

import PatientInformationContainer from '@/app/components/provider-coordinator-shared/all-patients/components/patient-page/patient-container';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

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
    const role_data = await verifyUserPermission(BV_AUTH_TYPE.COORDINATOR);

    const { data: activeSession } = await readUserSession();
    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e'
    const user_id = activeSession?.session?.user.id;

    if (!role_data.access_granted || !user_id) {
        return redirect('/');
    }

    const determineRole = () => {
        switch (role_data.role) {
            case 'coordinator':
                return BV_AUTH_TYPE.COORDINATOR;
            case 'lead-coordinator':
                return BV_AUTH_TYPE.LEAD_COORDINATOR;
            case 'provider':
                return BV_AUTH_TYPE.PROVIDER;
            case 'developer':
                return BV_AUTH_TYPE.DEVELOPER;
            case 'admin':
                return BV_AUTH_TYPE.ADMIN;
            default:
                return null;
        }
    };

    const current_tab_index = searchParams.tab;

    return (
        <>
            <div className="flex justify-center items-center py-10 px-40">
                <PatientInformationContainer
                    patient_id={params.patient_id}
                    access_type={determineRole()}
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
