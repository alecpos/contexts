'use client';
import { Button, CircularProgress, TextField } from '@mui/material';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import GoogleOAuthButton from '../oauth-button/oauth-google';
import { useRouter } from 'next/navigation';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import FacebookOAuthButton from '../oauth-button/oauth-facebook';
import AppleOAuthButton from '../oauth-button/oauth-apple';
import { mutate } from 'swr';
import React, { useState } from 'react';

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

export default function LoginForm({
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
                'There was a problem with your username or password.'
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
        <div className='flex -mt-20 md:mt-0 justify-center flex-col w-full gap-[40px] p-4 md:p-0'>
            <div className='flex relative justify-center w-[314px] h-[80px] self-center'>
                <Link href={'/'}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                        fill
                        alt='Bioverse Banner'
                        sizes='314px'
                        unoptimized
                    />
                </Link>
            </div>

            <div className='flex p-0 flex-col items-stretch gap-[1.94vw]'>
                <div className='flex justify-center'>
                    <BioType className='h3 text-[#286BA2]'>
                        Welcome back
                    </BioType>
                </div>
                <div className='flex justify-center -mt-4 md:-mt-8'>
                    <BioType className='h5 text-[#393939] text-[21px]'>
                        Let&apos;s get you logged in.
                    </BioType>
                </div>

                <div className='flex gap-2 flex-col'>
                    <GoogleOAuthButton currentUrl={url} />
                    <AppleOAuthButton currentUrl={url} />
                    <FacebookOAuthButton currentUrl={url} />
                </div>

                <div className='flex flex-row items-center gap-3'>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                    <BioType className='body2 text-gray-500'>or</BioType>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='body1 self-center flex flex-col gap-4 w-full'
                >
                    <TextField
                        {...register('email')}
                        label='Email address'
                        variant='outlined'
                        className='text-[16px] font-[400] not-italic leading-[24px] tracking-[0.15px]'
                        inputProps={{
                            style: {
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: '300',
                                lineHeight: '24px',
                                letterSpacing: '0.15px',
                            },
                        }}
                        fullWidth
                    />
                    {errors.email && (
                        <p className='text-red-600 body3'>
                            {errors.email.message}
                        </p>
                    )}

                    <TextField
                        {...register('password')}
                        label='Password'
                        type='password'
                        variant='outlined'
                        fullWidth
                    />
                    <div className='flex justify-end'>
                        <Link
                            href='/auth/resetPassword'
                            className='no-underline'
                        >
                            <BioType className='text-[16px] text-[#286BA2] -mt-1 -mb-1'>
                                Forgot Password?
                            </BioType>
                        </Link>
                    </div>
                    {errors.password && (
                        <p className='text-red-600 body3'>
                            {errors.password.message}
                        </p>
                    )}

                    {errorMessage && (
                        <div className='body1 text-red-600 mt-2 flex justify-center'>
                            {errorMessage}
                        </div>
                    )}

                    <div className='flex w-full items-center flex-col gap-2'>
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            fullWidth
                        >
                            {isLoggingIn ? (
                                <>
                                    <CircularProgress
                                        style={{ color: 'white' }}
                                        size={23}
                                    />
                                </>
                            ) : (
                                'Continue to Log In'
                            )}
                        </Button>
                        <div className='body1 flex flex-row items-center justify-center mt-4'>
                            <BioType className='body2 text-[16px] font-[100] not-italic leading-[18px] tracking-[0.16px]'>
                                By proceeding, you acknowledge that you are over
                                18 years of age, and agree to the{' '}
                                <Link
                                    href='https://www.gobioverse.com/terms-of-use'
                                    className='text-[#286BA2] no-underline'
                                >
                                    Terms and Conditions
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href='https://www.gobioverse.com/privacy-policy'
                                    className='text-[#286BA2] no-underline'
                                >
                                    Privacy Policy
                                </Link>
                                , and{' '}
                                <Link
                                    href='https://www.gobioverse.com/telehealth-consent'
                                    className='text-[#286BA2] no-underline'
                                >
                                    Consent to Telehealth.
                                </Link>
                            </BioType>
                        </div>
                        <BioType className='body2'>
                            First time here?{' '}
                            <Link
                                href={`${
                                    forProvider ? '/provider-auth' : ''
                                }/signup${
                                    url
                                        ? `?originalRef=${encodeURIComponent(
                                              url
                                          )}`
                                        : ''
                                }`}
                                className='text-[#286BA2] underline-offset-2'
                            >
                                Create your account
                            </Link>
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
