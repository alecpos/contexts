'use server';

import { headers } from 'next/headers';
import NotFoundComponent from './components/not-found/not-found-client';

export default async function NotFound({}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const headersList = headers();
    const referer = headersList.get('referer');

    return <NotFoundComponent referer={referer} />;
}
