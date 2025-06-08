'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import PatientUploadDocument from '@/app/components/patient-portal/patient-portal-client/patient-upload-document';

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

    return (
        <>
            <div className='flex justify-center h-screen'>
                <div className='sm:min-w-[700px] max-w-[800px]'>
                    <PatientUploadDocument
                        user_id={userId}
                        patientName={name}
                    />
                </div>
            </div>
        </>
    );
}
