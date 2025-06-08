'use server';

import EngineerDashboardTable from '@/app/components/engineer-portal/engineer-dashboard';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';

interface EngineerPortalPageProps {}

export default async function EngineerPortalHomePage({}: EngineerPortalPageProps) {
    const sessionData = (await readUserSession()).data.session;

    if (!sessionData || !sessionData?.user.id) {
        return redirect(`/login`);
    }

    return (
        <>
            <div className='flex flex-col justify-center items-center'>
                <EngineerDashboardTable current_user_id={sessionData.user.id} />
            </div>
        </>
    );
}
