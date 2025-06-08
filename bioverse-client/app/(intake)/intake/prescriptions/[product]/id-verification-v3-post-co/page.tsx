'use server';

import IDVerificationV3 from '@/app/components/intake-v3/pages/id-verification-v3';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';

export default async function IntakeLicenseSelfiePage() {
    const session = await readUserSession();

    const { license, selfie, name, gender } = await getIDVerificationData(
        session.data.session?.user.id || '',
    );

    return (
        <>
            <IDVerificationV3
                user_id={session.data.session?.user.id!}
                userGender={gender}
                patientName={name}
                preExistingLicense={license}
                preExistingSelfie={selfie}
            />
        </>
    );
}
