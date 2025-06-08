'use client';

import { analytics } from '@/app/components/analytics';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { Button } from '@mui/material';

export default function SignOutButton() {
    const handleSignOut = () => {
        analytics.reset();
        signOutUser();
    };

    return (
        <>
            <Button variant="contained" onClick={handleSignOut}>
                LOG OUT
            </Button>
        </>
    );
}
