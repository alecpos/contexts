'use client';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mutate } from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';

import GoogleOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-google-v2';
import AppleOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-apple-v2';
import FacebookOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-facebook-v2';
import React from 'react';

interface Props {
    url: string;
    forProvider?: boolean;
    determineRedirect: () => void;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function LoginFormV2({
    url,
    forProvider,
    determineRedirect,
}: Props) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const router = useRouter();

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
            setErrorMessage(
                'There was a problem with your username or password.',
            );
        }

        if (signInResult.data?.user.id) {
            window.rudderanalytics.identify(signInResult.data.user.id);
        }

        mutate('session-with-mfa');
        await determineRedirect();
        setIsLoggingIn(false);
    };

    return (
        <div className="flex md:mt-0 flex-col h-[100vh] w-full md:py-[46px]">
            <div className="flex justify-center w-full">
                <div className="flex w-[206px] h-[66px] md:px-[20px] pt-[25px] pr-[24px] pb-[24px] items-center">
                    <img
                        src="/img/brandv2/bioverse-logo.svg"
                        alt="Bioverse Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div className="flex p-0 flex-col items-stretch gap-[16px] sm:py-[40px] px-[16px]">
                <div className="flex justify-start">
                    <BioType className="inter-h1 text-[28px] bg-gradient-to-r from-[#3B8DC5] to-[#59B7C1] bg-clip-text text-transparent">
                        Welcome back
                    </BioType>
                </div>

                <div className="flex flex-col items-left">
                    <BioType className="inter-body">
                        <span className="text-[#00000099] text-[16px]">
                            Don&apos;t have an account?
                        </span>{' '}
                        <Link
                            href={`${
                                forProvider ? '/provider-auth' : ''
                            }/signup${
                                url
                                    ? `?originalRef=${encodeURIComponent(url)}`
                                    : ''
                            }`}
                            className="text-[#286BA2] text-[16px] underline-offset-2"
                        >
                            Sign up
                        </Link>
                    </BioType>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="body1 self-center flex flex-col gap-4 w-full"
                >
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                        >
                            Email address *
                        </label>
                        <TextField
                            {...register('email')}
                            id="email"
                            placeholder="example@gmail.com"
                            variant="outlined"
                            InputProps={{
                                style: {
                                    fontFamily: 'Inter Regular, sans-serif',
                                    fontSize: '16px',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    lineHeight: '22px',
                                    letterSpacing: '0.15px',
                                    borderRadius: '12px',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: {
                                    display: 'none',
                                },
                            }}
                            fullWidth
                        />
                        {errors.password && (
                            <p className="text-red-600 body3">
                                {errors.password.message}
                            </p>
                        )}
                        {errors.email && (
                            <p className="text-red-600 body3 font-inter">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1"
                        >
                            Password *
                        </label>
                        <TextField
                            {...register('password')}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                style: {
                                    fontFamily: 'Inter Regular, sans-serif',
                                    fontSize: '16px',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    lineHeight: '22px',
                                    letterSpacing: '0.15px',
                                    borderRadius: '12px',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: {
                                    display: 'none',
                                },
                            }}
                        />

                        <div className="flex justify-end mt-2">
                            <Link
                                href="/auth/resetPassword"
                                className="no-underline"
                            >
                                <BioType className="inter-body text-[16px] text-[#286BA2] -mt-1 -mb-1 underline">
                                    Forgot your password?
                                </BioType>
                            </Link>
                        </div>

                        {errors.password && (
                            <p className="text-red-600 body3 font-inter">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {errorMessage && (
                        <div className="body1 text-red-600 mt-2 flex justify-center font-inter">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-row items-center gap-3 my-[16px]">
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                        <BioType className="inter-body text-black">or</BioType>
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                    </div>

                    <div className="flex gap-[16px] flex-col">
                        <GoogleOAuthButtonV2 currentUrl={url} />
                        <AppleOAuthButtonV2 currentUrl={url} />
                        <FacebookOAuthButtonV2 currentUrl={url} />
                    </div>

                    <div className="mt-8 md:pt-[150px] sm:pt-[36px]">
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
                                fontFamily: 'Inter Regular, sans-serif',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: '22px',
                                letterSpacing: '0.15px',
                                borderRadius: '12px',
                                textTransform: 'none',
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
                                'Continue'
                            )}
                        </Button>
                    </div>

                    <div className="mt-[16px]">
                        <BioType className="inter-body text-[14px] leading-[20px] text-gray-600">
                            By proceeding, you acknowledge that you are over 18
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
                                Consent to Telehealth
                            </Link>{' '}
                            treatment.
                        </BioType>
                    </div>
                </form>
            </div>
        </div>
    );
}
function useSearchParams(): [any] {
    throw new Error('Function not implemented.');
}
