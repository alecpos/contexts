'use server';

import EDSelection from '@/app/components/intake-v2/ed/ed-selection/ed-selection-component';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

export default async function EDSelectionPage() {
    const user_id = (await readUserSession()).data.session?.user.id!;

    return <EDSelection user_id={user_id} />;
}
