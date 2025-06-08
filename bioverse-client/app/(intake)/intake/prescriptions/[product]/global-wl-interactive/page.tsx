'use server';

import InteractiveBMI from '@/app/components/intake-v4/pages/interactive-bmi';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface Props {
    params: { product: string };
    searchParams: { pvn: any; st: any; psn: any; sd: any; ub: any };
}

export default async function GlobalWLInteractive({
    params,
    searchParams,
}: Props) {
    const user_id = (await readUserSession()).data.session?.user.id!;
    return (
        <>
            <InteractiveBMI userId={user_id} />
        </>
    );
}
