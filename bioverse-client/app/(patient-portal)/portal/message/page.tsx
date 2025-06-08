'use server';

import MessageMainContainer from '@/app/components/patient-portal/message/message-main-container';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';

const Page = async () => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Fmessage');
    }

    const userId = activeSession.session.user.id;

    return (
        <div className='box-border flex flex-col w-full'>
            <div className='flex-grow h-full bg-[#F9F9F9] w-full'>
                <MessageMainContainer user_id={userId} />
            </div>
        </div>
    );
};

export default Page;
