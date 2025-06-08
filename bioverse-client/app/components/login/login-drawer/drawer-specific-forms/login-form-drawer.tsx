'use client';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { useState } from 'react';
import { KeyedMutator, mutate } from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import GoogleOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-google-v2';
import AppleOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-apple-v2';
import FacebookOAuthButtonV2 from '../../oauth-button/v2-buttons/oauth-facebook-v2';
import LoginGraphic from '../../login-graphic/login-graphic';
import React from 'react';

interface Props {
    forProvider?: boolean;
    determineRedirect: (userId: string) => void;
    setMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
    revalidate_session: KeyedMutator<any>;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function LoginFormDrawer({
    forProvider,
    determineRedirect,
    setMode,
    revalidate_session,
}: Props) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

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
        } else {
            if (signInResult.data?.user.id) {
                window.rudderanalytics.identify(signInResult.data.user.id);
            }
        }

        mutate('session-with-mfa');
        revalidate_session();
        await determineRedirect(signInResult.data?.user.id ?? '');
        setIsLoggingIn(false);
    };

    return (
        <div className='flex flex-col w-full gap-[40px] md:p-0 md:max-w-[456px]'>
            <div className='flex justify-center self-center'>
                <BioType className='itd-subtitle'>Login</BioType>
            </div>

            <div className='flex p-0 flex-col items-stretch gap-[16px]'>
                <div className='flex justify-start'>
                    <BioType className='itd-h1'>Welcome back</BioType>
                </div>

                <div className='flex gap-[16px] flex-col'>
                    <GoogleOAuthButtonV2
                        currentUrl={getFullPathAfterDomain()}
                    />
                    <AppleOAuthButtonV2 currentUrl={getFullPathAfterDomain()} />
                    <FacebookOAuthButtonV2
                        currentUrl={getFullPathAfterDomain()}
                    />
                </div>

                <div className='flex flex-col items-center'>
                    <BioType className='itd-body flex flex-row gap-2'>
                        <span className='text-[#00000099]'>
                            First time here?
                        </span>{' '}
                        <BioType
                            className='text-[#286BA2] underline'
                            onClick={() => setMode('signup')}
                        >
                            Create an account
                        </BioType>
                    </BioType>
                </div>

                <div className='flex flex-row items-center gap-3 my-[16px]'>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                    <BioType className='itd-body text-black'>or</BioType>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='body1 self-center flex flex-col gap-4 w-full'
                >
                    <TextField
                        {...register('email')}
                        label='Email'
                        variant='outlined'
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
                    <div className='flex justify-end'>
                        <Link
                            href='/auth/resetPassword'
                            className='no-underline'
                        >
                            <BioType className='itd-body text-[18px] text-[#286BA2] -mt-1 -mb-1 underline'>
                                Forgot your password?
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
                                'Log In'
                            )}
                        </Button>

                        <div className='mt-[32px]'>
                            <LoginGraphic />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
