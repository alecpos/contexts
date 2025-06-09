'use server';

import GlobalIntro from '@/app/components/intake-v4/pages/global-intro';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface Props {
    params: { product: string };
    searchParams: { pvn: any; st: any; psn: any; sd: any; ub: any };
}

export default async function GlobalWLLongIntroPage({
    params,
    searchParams,
}: Props) {
    const user_id = (await readUserSession()).data.session?.user.id!;
    return (
        <>
            <GlobalIntro />
        </>
    );
}
