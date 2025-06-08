'use server';
import QuestionIDComponent from '@/app/components/intake-v2/pages/question-id';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface QuestionNumberProps {
    params: {
        product: string;
        question_id: number;
    };
    searchParams: {
        [key: string]: string;
    };
}

export default async function IntakeQuestionsPage({
    params,
    searchParams,
}: QuestionNumberProps) {
    const session = await readUserSession();
    const user_id = session?.data?.session?.user?.id;

    if (!user_id) {
        // Handle case where there is no user session
        return redirect(
            `/login?originalRef=%2Fintake%2Fprescription%2F${params.product}`,
        );
    }

    const userProfileData = await getAccountProfileData(user_id);
    const current_question = params.question_id;

    return (
        <Suspense>
            <QuestionIDComponent
                current_question={current_question}
                user_id={user_id}
                userProfileData={userProfileData}
            />
        </Suspense>
    );
}
