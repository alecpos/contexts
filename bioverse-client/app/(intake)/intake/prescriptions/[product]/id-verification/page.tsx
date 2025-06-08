'use server';

import IDVerificationV2 from '@/app/components/intake-v2/pages/id-verification';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';

export default async function IntakeLicenseSelfiePage() {
    const session = await readUserSession();

    const { license, selfie, name, gender } = await getIDVerificationData(
        session.data.session?.user.id || ''
    );

    return (
        <>
            <IDVerificationV2
                user_id={session.data.session?.user.id!}
                userGender={gender}
                patientName={name}
                preExistingLicense={license}
                preExistingSelfie={selfie}
            />
        </>
    );
}
