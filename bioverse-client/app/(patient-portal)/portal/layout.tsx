'use server';
import { Suspense, type PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getActionItems } from '@/app/utils/database/controller/action-items/action-items-actions';

import DarkFooter from '@/app/components/footer/darkFooter';
import ActionItemsBanner from '@/app/components/patient-portal/action-items/action-items-banner';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';
import { ActionType } from '@/app/types/action-items/action-items-types';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
    const sessionData = (await readUserSession()).data.session;
    if (!sessionData) {
        return redirect('/login?originalRef=%2Fportal%2Faccount-information');
    }
    const actionItems = await getActionItems(sessionData.user.id);

    const idVerificationData = await getIDVerificationData(sessionData.user.id);

    const hasId =
        idVerificationData.license !== null &&
        idVerificationData.selfie !== null &&
        idVerificationData.name !== null;

    const showActionItems = actionItems.length > 0 || !hasId;

    if (!hasId) {
        actionItems.push({
            id: 0,
            created_at: new Date(),
            type: 'id-verification',
            patient_id: sessionData.user.id,
            last_updated_at: new Date(),
            active: true,
            submission_time: new Date().toISOString(),
            subscription_id: 0,
            product_href: '',
            action_type: ActionType.IDVerification,
            iteration: 0,
            question_set_version: 0,
        });
    }

    return (
        <Suspense>
            <div className='bg-[#F9F9F9] flex flex-col'>
                {showActionItems && (
                    <ActionItemsBanner actionItems={actionItems} />
                )}
                <div className=''>{children}</div>
                <DarkFooter />
            </div>
        </Suspense>
    );
}
