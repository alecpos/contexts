'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RedirectHandlerProps {
    role: 'provider' | 'registered-nurse';
}

export default function RedirectHandler({ role }: RedirectHandlerProps) {
    const router = useRouter();

    useEffect(() => {
        router.replace(`/${role}-auth/login`);
    }, [router]);

    return null; // This component only handles redirects
}
