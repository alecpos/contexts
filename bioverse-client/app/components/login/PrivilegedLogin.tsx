'use client';
import { useEffect, useState } from 'react';
import { readUserSessionCheckForMFARequirement } from '@/app/utils/actions/auth/session-reader';
import { Paper, Button, CircularProgress, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingScreen from '../global-components/loading-screen/loading-screen';
import { mutate } from 'swr';
import useSWR from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LogoHorizontal from '@/app/components/navigation/components/logo-horizontal/logo-horizontal';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import React from 'react';
import GoogleOAuthButton from './oauth-button/oauth-google';

interface Props {
    url: string;
    role: 'provider' | 'registered-nurse';
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function PrivilegedLoginCard({ url, role }: Props) {
    const baseUrl = `/${role}`;

    const {
        data: session_mfa_data,
        error: swr_error,
        isLoading: swr_loading,
    } = useSWR(`session-with-mfa`, () =>
        readUserSessionCheckForMFARequirement(),
    );

    const router = useRouter();
    useEffect(() => {
        if (session_mfa_data && session_mfa_data.user_id) {
            if (session_mfa_data.mfa_required === false) {
                router.push(url === 'undefined' ? baseUrl : url);
            } else {
                if (
                    session_mfa_data.assurance_level.data?.currentLevel ===
                    'aal1'
                ) {
                    if (
                        session_mfa_data.assurance_level.data.nextLevel ===
                        'aal1'
                    ) {
                        router.push(
                            `/login/mfa-enroll?originalRef=${encodeURI(
                                url,
                            )}&usr=provider`,
                        );
                    }
                    if (
                        session_mfa_data.assurance_level.data.nextLevel ===
                        'aal2'
                    ) {
                        router.push(
                            `/login/mfa-verify?originalRef=${encodeURI(
                                url,
                            )}&usr=provider`,
                        );
                    }
                } else if (
                    session_mfa_data.assurance_level.data?.currentLevel ===
                    'aal2'
                ) {
                    router.push(url === 'undefined' ? baseUrl : url);
                }
            }
        }
    }, [session_mfa_data, router, url]);

    const determineRedirect = async () => {
        const supabase = createSupabaseBrowserClient();

        const assurance_level =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (session_mfa_data && session_mfa_data.user_id) {
            if (session_mfa_data.mfa_required === false) {
                router.push(url ?? `/`);
            } else {
                if (assurance_level.data?.currentLevel === 'aal1') {
                    if (assurance_level.data.nextLevel === 'aal1') {
                        router.push(
                            `/login/mfa-enroll?originalRef=${encodeURI(url)}`,
                        );
                    }
                    if (assurance_level.data.nextLevel === 'aal2') {
                        router.push(
                            `/login/mfa-verify?originalRef=${encodeURI(url)}`,
                        );
                    }
                } else if (assurance_level.data?.currentLevel === 'aal2') {
                    router.push(url ?? `/`);
                }
            }
        }
    };
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: any) => {
        setIsLoggingIn(true);
        const signInResult = await signInUser(data);

        if (!signInResult.success) {
            setErrorMessage('There was a problem with your email or password.');
        }

        mutate('session-with-mfa');
        await determineRedirect();
        setIsLoggingIn(false);
    };

    if (swr_loading) {
        return <LoadingScreen />;
    }

    const encodedRedirectPath = encodeURIComponent(baseUrl);

    return (
        <>
            <Paper className="flex flex-col px-4 pb-4 w-full max-w-sm">
                <div className="p-4">
                    <div className="flex justify-center items-center pt-4">
                        <div className="flex flex-row items-center">
                            <Link href={'/'} className="relative font-normal">
                                <div>
                                    <LogoHorizontal
                                        breakpoint="desktop"
                                        className="!flex-[0_0_auto]"
                                        logoColor="/img/bioverse-logo.png"
                                        status="visitor"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <br></br>
                    <div className="flex p-0 flex-col items-stretch gap-[16px] ">
                        <div className="flex justify-start">
                            <BioType className="text-primary itd-h1">
                                {role === 'registered-nurse'
                                    ? 'Registered Nurse '
                                    : 'Provider '}
                                Portal Login
                            </BioType>
                        </div>
                        <div className="flex justify-start">
                            <BioType className="itd-subtitle">
                                Welcome Back! Enter your email and password.
                            </BioType>
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
                                    },
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
                                    {isLoggingIn ? (
                                        <>
                                            <CircularProgress
                                                style={{ color: 'white' }}
                                                size={23}
                                            />
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </div>
                        </form>
                        <div className="flex w-full items-center">
                            <GoogleOAuthButton
                                currentUrl={encodedRedirectPath}
                            />
                        </div>
                    </div>
                </div>
            </Paper>
        </>
    );
}
