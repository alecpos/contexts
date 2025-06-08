'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import PatientIDVerification from '@/app/components/patient-portal/patient-portal-client/patient-id-verification';

interface Props {}

export default async function Page({}: Props) {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Faccount-information');
    }
    const userId = activeSession.session.user.id;

    const { license, selfie, name, gender } = await getIDVerificationData(
        userId || ''
    );

    const accountProfileData = await getAccountProfileData(userId);
    if (!accountProfileData) {
        throw new Error('Account profile data not found');
    }

    const personalData: AccountNameEmailPhoneData = {
        first_name: accountProfileData.first_name,
        last_name: accountProfileData.last_name,
        email: activeSession.session.user.email!, // Email from session data
        phone_number: accountProfileData.phone_number,
        date_of_birth: accountProfileData.date_of_birth,
    };

    return (
        <>
            <div className='flex justify-center h-screen'>
                <div className='sm:min-w-[700px] max-w-[800px]'>
                    <PatientIDVerification
                        user_id={userId}
                        userGender={gender}
                        patientName={name}
                    />
                </div>
            </div>
        </>
    );
}
