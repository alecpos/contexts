'use server';

import GoalWeight from '@/app/components/intake-v4/pages/goal-weight';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface Props {
  params: { product: string };
  searchParams: { pvn: any; st: any; psn: any; sd: any; ub: any };
}

export default async function GlobalWLLongGoalWeight({ params, searchParams }: Props) {
  const user_id = (await readUserSession()).data.session?.user.id!;
  return (
    <GoalWeight userId={user_id} />
  );
}
