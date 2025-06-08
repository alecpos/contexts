'use client';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    signInUser,
    signUpWithEmailAndPassword,
} from '@/app/utils/actions/auth/server-signIn-signOut';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { mutate } from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import GoogleOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-google-v2';
import AppleOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-apple-v2';
import FacebookOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-facebook-v2';
import LoginGraphic from '../../login-graphic/login-graphic';
import { getCookie } from 'cookies-next';
import {
    identifyUser,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import { ACCOUNT_CREATED } from '@/app/services/customerio/event_names';
import { trackLeadEvent } from '@/app/services/tracking/tracking';
import { completeProviderSignup } from '@/app/utils/actions/provider/auth';
import { addCustomerSupportToPatientOnSignup } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { insertNewProfileAdsTracking } from '@/app/(testing_and_development)/olivier-dev/utils';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';

interface Props {
    forProvider?: boolean;
    setMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
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

export default function SignUpFormDrawer({ forProvider, setMode }: Props) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

    const router = useRouter();
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);
    const url = getFullPathAfterDomain();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    function getFullPathAfterDomain(): string {
        // Get the pathname, search, and hash from the window location object
        const path = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;

        // Concatenate them to form the full path
        const fullPath = `${path}${search}${hash}`;

        // Return the full path
        return fullPath;
    }

    /**
     * OnSubmit function signs user up into supabase and then logs user in automatically.
     * @param data form data containing email & password
     */
    const onSubmit = async (data: any) => {
        setIsSigningUp(true);
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
                    user_id: userId,
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
        setIsSigningUp(false);
    };

    return (
        <div className="flex flex-col md:w-full gap-[40px] md:p-0 md:max-w-[456px]">
            <div className="flex justify-center self-center">
                <BioType className="itd-subtitle">Create an account</BioType>
            </div>

            <div className="flex p-0 flex-col items-stretch gap-[16px]">
                <div className="flex justify-start">
                    <BioType className="itd-h1 text-[32px]">
                        Let&apos;s get your account started
                    </BioType>
                </div>

                <div className="flex gap-[16px] flex-col">
                    <GoogleOAuthButtonV2 currentUrl={url} />
                    <AppleOAuthButtonV2 currentUrl={url} />
                    <FacebookOAuthButtonV2 currentUrl={url} />
                </div>

                <div className="flex flex-col items-center">
                    <BioType className="itd-body flex flex-row gap-2">
                        <span className="text-[#00000099]">
                            Already have an account?
                        </span>{' '}
                        <BioType
                            className="text-[#286BA2] underline"
                            onClick={() => setMode('login')}
                        >
                            Log in
                        </BioType>
                    </BioType>
                </div>

                <div className="flex flex-row items-center gap-3 my-[16px]">
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                    <BioType className="itd-body text-black">or</BioType>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="body1 self-center flex flex-col gap-4 w-full"
                >
                    <TextField
                        {...register('email')}
                        label="Email"
                        variant="outlined"
                        inputProps={{
                            style: {
                                fontFamily: 'Tw Cen MT Pro SemiMedium',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22px',
                                letterSpacing: '0.15px',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                fontFamily: 'Tw Cen MT Pro SemiMedium',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22px',
                                letterSpacing: '0.15px',
                            },
                        }}
                        fullWidth
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
                        InputLabelProps={{
                            style: {
                                fontFamily: 'Tw Cen MT Pro SemiMedium',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22px',
                                letterSpacing: '0.15px',
                            },
                        }}
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

                    <div className="flex w-full items-center flex-col gap-2">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                height: '52px',
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                                fontFamily: 'Tw Cen MT Pro SemiMedium',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22px',
                                letterSpacing: '0.15px',
                            }}
                        >
                            {isSigningUp ? (
                                <>
                                    <CircularProgress
                                        style={{ color: 'white' }}
                                        size={23}
                                    />
                                </>
                            ) : (
                                'CREATE ACCOUNT'
                            )}
                        </Button>

                        <div className="mt-[32px]">
                            <BioType className="itd-body text-[18px] leading-[22px]">
                                By proceeding with email, Google, Apple, or
                                Facebook, you acknowledge that you are over 18
                                years of age, and agree to the{' '}
                                <Link
                                    href="https://www.gobioverse.com/terms-of-use"
                                    className="text-[#286BA2]"
                                >
                                    Terms and Conditions
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="https://www.gobioverse.com/privacy-policy"
                                    className="text-[#286BA2]"
                                >
                                    Privacy Policy
                                </Link>
                                , and{' '}
                                <Link
                                    href="https://www.gobioverse.com/telehealth-consent"
                                    className="text-[#286BA2]"
                                >
                                    Consent to Telehealth.
                                </Link>
                            </BioType>
                        </div>

                        <div className="mt-[32px]">
                            <LoginGraphic />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
