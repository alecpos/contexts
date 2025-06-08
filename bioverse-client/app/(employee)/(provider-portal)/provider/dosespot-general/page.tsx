import DoseSpotIframeGeneralContainer from '@/app/components/provider-portal/dose-spot-iframe/dose-spot-general-iframe-container';
import { getUserIdFromSession } from '@/app/utils/actions/auth/auth-actions';
import { redirect } from 'next/navigation';

export default async function DoseSpotGeneralPage() {
    const providerUid = await getUserIdFromSession();

    if (!providerUid) {
        return redirect('/provider-auth/login');
    }

    return (
        <>
            <div className="flex flex-col justify-self-center items-center justify-center">
                <div className="flex flex-col w-[80%]">
                    <DoseSpotIframeGeneralContainer providerId={providerUid} />
                </div>
            </div>
        </>
    );
}
