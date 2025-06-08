'use server';

import EDMatchComponent from '@/app/components/intake-v2/ed/ed-match/ed-match';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

export default async function EDMatchPage() {
    const user_id = (await readUserSession()).data.session?.user.id!;

    return (
        <>
            <EDMatchComponent user_id={user_id} />
        </>
    );
}
