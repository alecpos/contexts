'use server';

import ProviderHistoryComponent from '@/app/components/provider-portal/history/provider-history';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

export default async function ProviderHistoryPage() {
    const userId = (await readUserSession()).data.session?.user.id;

    return (
        <>
            <ProviderHistoryComponent userId={userId ?? ''} />
        </>
    );
}
