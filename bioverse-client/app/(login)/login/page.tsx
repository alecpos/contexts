import type { Metadata } from 'next';
import LoginPageContents from '../../components/login/loginPageContents';
import React from 'react';

export const metadata: Metadata = {
    title: 'Bioverse: Login',
    description: 'Login or Sign up for an Account!',
};

interface Props {
    searchParams: { originalRef: any };
}

export default async function Page({ searchParams }: Props) {
    const url = searchParams.originalRef;
    const decodedUrl = decodeURI(url);

    return (
        <>
            <LoginPageContents url={decodedUrl} />
        </>
    );
}
