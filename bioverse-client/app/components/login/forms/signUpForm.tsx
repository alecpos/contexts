'use client';

import { useForm } from 'react-hook-form';
import { Button, TextField, Typography } from '@mui/material';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import Image from 'next/image';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import OauthButton from '../oauth-button/oauth-button';
import {
    signInUser,
    signUpWithEmailAndPassword,
} from '@/app/utils/actions/auth/server-signIn-signOut';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import GoogleOAuthButton from '../oauth-button/oauth-google';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useEffect, useState } from 'react';
import { trackLeadEvent } from '@/app/services/tracking/tracking';
import { addCustomerSupportToPatientOnSignup } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { getCookie } from 'cookies-next';
import { completeProviderSignup } from '@/app/utils/actions/provider/auth';
import FacebookOAuthButton from '../oauth-button/oauth-facebook';
import { getURL } from '@/app/utils/functions/utils';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import AppleOAuthButton from '../oauth-button/oauth-apple';
import { ACCOUNT_CREATED } from '@/app/services/customerio/event_names';
import {
    identifyUser,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import { mutate } from 'swr';
import { insertNewProfileAdsTracking } from '@/app/(testing_and_development)/olivier-dev/utils';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';

interface Props {
    url: string;
    onComplete?: () => Promise<void>;
    forProvider?: boolean;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain at least one special character',
        )
        .required('Password is required'),
});
export default function SignUpForm({ url, onComplete, forProvider }: Props) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const [anonId, setAnonId] = useLocalStorage('anonId', '');
    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    /**
     * OnSubmit function signs user up into supabase and then logs user in automatically.
     * @param data form data containing email & password
     */
    const onSubmit = async (data: any) => {
        const signUpResult = await signUpWithEmailAndPassword(data);

        const signInResult = await signInUser(data);

        if (!signInResult.success) {
            setErrorMessage(
                'This email is already registered with Bioverse. Please log in using your credentials.',
            );
        } else {
            // const originalRef = localStorage.getItem('originalRef');

            // run a given callback, if any, to signal signup completion

            if (forProvider) {
                const { error } = await completeProviderSignup();
                if (error) {
                    console.error(error);
                }
            }

            const payload_meta = {
                ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' && {
                    test_event_code:
                        process.env.NEXT_PUBLIC_PIXEL_TEST_EVENT_ID,
                }),
            };

            const signup_json = JSON.parse(signUpResult);

            if (!signup_json.error) {
                const userId = signInResult.data?.user?.id;

                if (!userId) {
                    router.push('/');
                    return;
                }

                const eventId = `${userId}-${Date.now()}`;

                setLeadEventId(eventId);

                const values = {
                    email: signInResult?.data?.user?.email,
                    fbp,
                    fbc,
                    user_id: signInResult?.data?.user?.id,
                    eventId,
                };

                if (signInResult.data?.user?.created_at) {
                    const date = new Date(
                        signInResult.data?.user?.created_at,
                    ).getTime();

                    await identifyUser(userId, {
                        email: signInResult.data?.user?.email,
                        created_at: Math.floor(date / 1000),
                        anonymousId: window.rudderanalytics.getAnonymousId(),
                    });
                    window.rudderanalytics.identify(userId, {
                        email: signInResult.data?.user?.email,
                        created_at: Math.floor(date / 1000),
                    });
                } else {
                    await identifyUser(userId, {
                        email: signInResult.data?.user?.email,
                        anonymousId: window.rudderanalytics.getAnonymousId(),
                    });
                    window.rudderanalytics.identify(userId, {
                        email: signInResult.data?.user?.email,
                    });
                }

                await triggerEvent(userId, ACCOUNT_CREATED, {
                    context: {
                        event_id: eventId,
                        fbc,
                        fbp,
                        traits: {
                            email: signInResult.data?.user?.email,
                        },
                    },
                    product_name: product_href,
                });

                const gclid = urlParams.get('gclid');
                const fbclid = urlParams.get('fbclid');

                if (gclid) {
                    await insertNewProfileAdsTracking(userId, gclid, 'google');
                }

                if (fbclid) {
                    await insertNewProfileAdsTracking(userId, fbclid, 'meta');
                }

                trackLeadEvent(payload_meta, values);

                addCustomerSupportToPatientOnSignup(
                    signInResult.data?.user.id || '',
                );

                mutate('session');

                // const url = await getURL();
                // router.push(url);
            }
            // if (url !== undefined) {
            //     // Redirect the user back to the original page
            //     if (!signup_json.error) {
            //         router.push(`${url}`);
            //     } else {
            //         router.push(url);
            //     }
            // } else {
            //     // Redirect to a default page if no stored URL is found
            //     if (!signup_json.error) {
            //         router.push('/collections');
            //     } else {
            //         router.push('/');
            //     }
            // }
        }
    };

    return (
        <div className="flex justify-center flex-col w-full gap-[40px] p-4 md:p-0">
            <div className="flex relative justify-center w-[314px] h-[80px] self-center -mt-10 md:mt-0">
                <Link href="/">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                        fill
                        alt="Bioverse Banner"
                        sizes="314px"
                        unoptimized
                    />
                </Link>
            </div>
            <div className="flex justify-center -mt-3">
                <BioType className="h3 text-[#286BA2] text-center">
                    Begin Your <br className="md:hidden" /> BIOVERSE Journey
                </BioType>
            </div>
            <div className="flex justify-center -mt-8 md:-mt-10">
                <BioType className="text-center font-twcsemimedium text-[#1b1b1b] opacity-90 text-[16px] not-italic leading-[18px] tracking-[0.16px]">
                    Let&apos;s see if BIOVERSE is right for you.
                    <br className="md:hidden" /> Create an account to learn
                    more.
                </BioType>
            </div>
            <div className="flex gap-2 flex-col -mt-7 md:-mt-4">
                <GoogleOAuthButton currentUrl={url} />
                <AppleOAuthButton currentUrl={url} />
                <FacebookOAuthButton currentUrl={url} />
            </div>
            <div className="body2 flex flex-row items-center gap-3">
                <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                or
                <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
            </div>

            <div className="flex p-0 flex-col items-stretch gap-[1.94vw] md:-mt-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="body1 self-center flex flex-col gap-2 w-full"
                >
                    <TextField
                        {...register('email')}
                        label="Email address"
                        variant="outlined"
                        fullWidth
                        sx={{
                            opacity: 90,
                            fontWeight: 100,
                            fontFamily: 'Tw Cen MT Pro SemiMedium, sans-serif',
                            color: '#1b1b1b',
                        }}
                    />
                    {errors.email && (
                        <p className="text-red-600 body3">
                            {errors.email.message}
                        </p>
                    )}

                    <TextField
                        {...register('password')}
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                    />
                    {errors.password && (
                        <p className="text-red-600 body3">
                            {errors.password.message}
                        </p>
                    )}

                    {errorMessage && (
                        <div className="body1 text-red-600 mt-2 flex justify-center">
                            {errorMessage}
                        </div>
                    )}
                    <div className="mt-2 md:mt-3">
                        <Button
                            sx={{ width: '100%' }}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Continue with email
                        </Button>
                    </div>
                </form>

                <div className="body1 flex flex-row items-center justify-center md:-mt-3">
                    <BioType className="body2 text-[16px] font-[100] not-italic leading-[18px] tracking-[0.16px]">
                        By proceeding, you acknowledge that you are over 18
                        years of age, and agree to the{' '}
                        <Link
                            href="https://www.gobioverse.com/terms-of-use"
                            className="text-[#286BA2] no-underline"
                        >
                            Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="https://www.gobioverse.com/privacy-policy"
                            className="text-[#286BA2] no-underline"
                        >
                            Privacy Policy
                        </Link>
                        , and{' '}
                        <Link
                            href="https://www.gobioverse.com/telehealth-consent"
                            className="text-[#286BA2] no-underline"
                        >
                            Consent to Telehealth.
                        </Link>
                    </BioType>
                </div>
                <div className="flex justify-center md:-mt-6">
                    <BioType className="body2">
                        Already have an account?{' '}
                        <Link
                            href={`${
                                forProvider ? '/provider-auth' : ''
                            }/login${
                                url
                                    ? `?originalRef=${encodeURIComponent(url)}`
                                    : ''
                            }`}
                            className="text-[#286BA2] underline-offset-2"
                        >
                            Log in
                        </Link>
                    </BioType>
                </div>
            </div>
        </div>
    );
}
