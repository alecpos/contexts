import SignUpPageContents from '@/app/components/login/signUpContents';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Bioverse: Sign up Page',
    description: 'Sign up for an account',
};

interface Props {
    searchParams: { originalRef: any };
}

export default async function Page({ searchParams }: Props) {
    const session = await readUserSession();

    if (session.data.session !== null) {
        return redirect('/collections');
    }

    const url = searchParams.originalRef;
    const decodedUrl = decodeURI(url);

    return (
        <>
            <SignUpPageContents url={decodedUrl} />
        </>
    );
}
