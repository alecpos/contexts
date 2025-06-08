import { Suspense } from 'react';
import SignUpPageContents from '@/app/components/login/signUpContents';
import { completeProviderSignup } from '@/app/utils/actions/provider/auth';

const ProviderPortalSignup = () => {
    // const onProviderSignupComplete = async () => {
    //     const { error } = await completeProviderSignup();
    //     if (error) console.error(error);
    // };

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <SignUpPageContents url="/provider/dashboard" forProvider />
            </Suspense>
        </>
    );
};

export default ProviderPortalSignup;
