'use server';

import SkincareUpload from '@/app/components/intake-v2/pages/skincare-upload';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getSideProfileData } from '@/app/utils/database/controller/profiles/profiles';

export default async function IntakeSelfiePage() {
    const session = await readUserSession();

    const { selfie, name, gender, rightSideFace, leftSideFace } =
        await getSideProfileData(session.data.session?.user.id || '');

    return (
        <>
            <SkincareUpload
                user_id={session.data.session?.user.id!}
                userGender={gender}
                patientName={name}
                
                preExistingSelfie={selfie}
                preExistingRightSideFace={rightSideFace}
                preExistingLeftSideFace={leftSideFace}
            />
        </>
    );
}
