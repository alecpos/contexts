import type { Metadata } from 'next';

import { redirect } from 'next/navigation';
import { readUserSessionCheckForMFARequirement } from '@/app/utils/actions/auth/session-reader';
import MfaVerifyPageContents from '@/app/components/login/mfa/mfaVerifyPageContents';

export const metadata: Metadata = {
    title: 'Bioverse: Login',
    description: 'Login or Sign up for an Account!',
};

interface Props {
    searchParams: { originalRef: any };
}

export default async function Page({ searchParams }: Props) {
    const url = searchParams.originalRef;
    const decodedUrl = decodeURI(url);

    const user_mfa_data = await readUserSessionCheckForMFARequirement();

    if (!user_mfa_data) {
        return redirect('/login');
    }

    if (user_mfa_data.assurance_level.data?.currentLevel === 'aal2') {
        if (decodedUrl === 'undefined') {
            return redirect('/');
        }

        return redirect(`/${decodedUrl}`);
    }

    return (
        <>
            <MfaVerifyPageContents url={decodedUrl} />
        </>
    );
}
