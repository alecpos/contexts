'use server';

import GlobalWLUpNext from '@/app/components/intake-v4/pages/global-up-next';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface Props {
  params: { product: string };
  searchParams: { pvn: any; st: any; psn: any; sd: any; ub: any };
}

export default async function GlobalWLLongUpNextPage({ params, searchParams }: Props) {
  const user_id = (await readUserSession()).data.session?.user.id!;
  return (
    <>
      <GlobalWLUpNext />
    </>
  );
}
