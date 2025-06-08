'use client';

import React, { useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { useRouter, useSearchParams } from 'next/navigation';
import FacebookOAuthButtonV3 from '../buttons/oauth-buttons/oauth-facebook-v3';
import AppleOAuthButtonV3 from '../buttons/oauth-buttons/oauth-apple-v3';
import GoogleOAuthButtonV3 from '../buttons/oauth-buttons/oauth-google-v3';
import {
    identifyUser,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import { ACCOUNT_CREATED } from '@/app/services/customerio/event_names';
import { LEAD_STARTED } from '@/app/services/mixpanel/mixpanel-constants';
import { trackLeadEvent } from '@/app/services/tracking/tracking';
import {
    signUpWithEmailAndPassword,
    signInUser,
} from '@/app/utils/actions/auth/server-signIn-signOut';
import { checkMixpanelEventFired } from '@/app/utils/database/controller/mixpanel/mixpanel';
import { addCustomerSupportToPatientOnSignup } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { aliasRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { SignupResult } from '../registration/intake-signup-form/intake-signup-form-v3';
import { getCookie } from 'cookies-next';
import { mutate } from 'swr';
import { insertNewProfileAdsTracking } from '@/app/(testing_and_development)/olivier-dev/utils';

interface Props {
    product_href: string;
}

interface EmailCheckFormInput {
    email: string;
}

interface RegistrationFormInput {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
});

const registrationValidationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/, 'Password must contain at least one symbol'),
});

export default function WLRegistrationPreGraphDialog({ product_href }: Props) {
    const router = useRouter();
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [currentForm, setCurrentForm] = useState<
        'emailCheck' | 'registration'
    >('emailCheck');
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

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
        register: registerEmailCheck,
        handleSubmit: handleSubmitEmailCheck,
        formState: { errors: emailCheckErrors },
        setValue: setEmailCheckValue,
    } = useForm<EmailCheckFormInput>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: email,
        },
    });

    const {
        register: registerRegistration,
        handleSubmit: handleSubmitRegistration,
        formState: { errors: registrationErrors },
        setValue: setRegistrationValue,
    } = useForm<RegistrationFormInput>({
        resolver: yupResolver(registrationValidationSchema),
        defaultValues: {
            email: email,
            password: password,
        },
    });

    // Add effect to update form values when email/password changes
    React.useEffect(() => {
        setEmailCheckValue('email', email);
        setRegistrationValue('email', email);
        setRegistrationValue('password', password);
    }, [email, password, setEmailCheckValue, setRegistrationValue]);

    const onSubmitEmailCheck = handleSubmitEmailCheck(async () => {
        setCurrentForm('registration');
    });

    const onSubmitRegistration = handleSubmitRegistration(async () => {
        setIsButtonLoading(true);
        const anonId = window.rudderanalytics.getAnonymousId();
        const data = {
            email,
            password,
            anonymousId: anonId,
        };
        const signUpResult = await signUpWithEmailAndPassword(data);
        const signUpResultJSON = JSON.parse(signUpResult);

        let isRegistered = false;

        if (
            signUpResultJSON.error &&
            signUpResultJSON.error.message === 'User already registered'
        ) {
            isRegistered = true;
        }

        const signInResult = (await signInUser(data)) as SignupResult;

        try {
            if (signInResult.success) {
                const payload_meta = {
                    ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' && {
                        test_event_code:
                            process.env.NEXT_PUBLIC_PIXEL_TEST_EVENT_ID,
                    }),
                };

                const userId = signInResult.data?.user?.id;

                const eventId = `${userId}-${Date.now()}`;

                const values = {
                    email: signInResult?.data?.user?.email,
                    user_id: signInResult?.data?.user?.id,
                    fbp,
                    fbc,
                    eventId,
                    ...(searchParams.get('gclid') && {
                        gclid: searchParams.get('gclid'),
                    }),
                };

                const signup_json = JSON.parse(signUpResult);

                if (userId) {
                    window.rudderanalytics.identify(userId);
                }

                // Is a new account
                if (!signup_json.error) {
                    const { data, error } = await checkMixpanelEventFired(
                        userId!,
                        LEAD_STARTED,
                        product_href
                    );

                    await aliasRudderstackEvent(userId, anonId);

                    const date = new Date(
                        signInResult.data?.user?.created_at
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

                    try {
                        //if they have a gclid, add it to profile_ads_tracking so the rudderstack reverse ETL will pick it up.
                        const gclid = urlParams.get('gclid');
                        if (gclid) {
                            await insertNewProfileAdsTracking(userId, gclid, 'google');
                        }
                    } catch (error) {
                        console.log(error, 'Error inserting profile ads tracking');
                    }

                    trackLeadEvent(payload_meta, values);

                    addCustomerSupportToPatientOnSignup(
                        signInResult.data?.user?.id
                    );
                }

                mutate('user-session');
            }
        } catch (error) {
            console.log(error, 'Signup failed');
            setIsButtonLoading(false);
        }
    });

    return (
        <div className='flex flex-col w-full gap-[16px] md:p-0 md:max-w-[456px] mt-2 mb-2'>
            <div className='flex p-0 flex-col items-stretch gap-[16px]'>
                <div className='flex justify-start'>
                    <BioType className='itd-h5 inter-tight font-normal text-[23px] leading-[28px] text-[#000000E5]'>
                        See how much weight you could lose
                    </BioType>
                </div>

                {currentForm === 'emailCheck' ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmitEmailCheck();
                        }}
                        className='body1 self-center flex flex-col gap-4 w-full'
                    >
                        <div className=''>
                            <label
                                htmlFor='email'
                                className='inter-tight font-normal text-[18px] leading-[24px] text-[#000626E5]'
                            >
                                Email address
                            </label>
                            <TextField
                                {...registerEmailCheck('email', {
                                    onChange: (e) => setEmail(e.target.value),
                                })}
                                id='email'
                                value={email}
                                variant='outlined'
                                inputProps={{
                                    className:
                                        'inter-tight font-normal text-[18px] leading-[24px] text-[#000626E5] rounded-[12px] h-[48px] px-[14px] py-0 hover:',
                                }}
                                fullWidth
                                error={!!emailCheckErrors.email}
                            />
                            {emailCheckErrors.email && (
                                <BioType className='inter-tight text-[14px] leading-[18px] text-red-500 mt-1'>
                                    {emailCheckErrors.email.message}
                                </BioType>
                            )}
                        </div>

                        <div className='flex w-full items-center flex-col gap-2'>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                className='inter-tight'
                                sx={{
                                    height: '48px',
                                    backgroundColor: '#000000E5',
                                    fontSize: '18px !important',
                                    fontWeight: '700',
                                    lineHeight: '24px',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#000000E5',
                                        boxShadow: 'none',
                                    },
                                }}
                            >
                                View results
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmitRegistration();
                        }}
                        className='body1 self-center flex flex-col gap-4 w-full'
                    >
                        <div className=''>
                            <label
                                htmlFor='email'
                                className='inter-tight font-normal text-[18px] leading-[24px] text-[#000626E5]'
                            >
                                Email address
                            </label>
                            <TextField
                                {...registerRegistration('email', {
                                    onChange: (e) => setEmail(e.target.value),
                                })}
                                id='email'
                                value={email}
                                variant='outlined'
                                inputProps={{
                                    className:
                                        'inter-tight font-normal text-[18px] leading-[24px] text-[#000626E5] rounded-[12px] h-[48px] px-[14px] py-0 hover:',
                                }}
                                fullWidth
                                error={!!registrationErrors.email}
                            />
                            {registrationErrors.email && (
                                <BioType className='inter-tight text-[14px] leading-[18px] text-red-500 mt-1'>
                                    {registrationErrors.email.message}
                                </BioType>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='inter-tight font-normal text-[18px] leading-[24px] text-[#000626E5]'
                            >
                                Password
                            </label>
                            <TextField
                                {...registerRegistration('password', {
                                    onChange: (e) =>
                                        setPassword(e.target.value),
                                })}
                                id='password'
                                type='password'
                                variant='outlined'
                                fullWidth
                                value={password}
                                inputProps={{
                                    className:
                                        'inter-tight font-normal text-[18px] leading-[24px] text-[#000626E5] rounded-[12px] h-[48px] px-[14px] py-0 hover:',
                                }}
                                error={!!registrationErrors.password}
                            />
                            {registrationErrors.password && (
                                <BioType className='inter-tight text-[14px] leading-[18px] text-red-500 mt-1'>
                                    {registrationErrors.password.message}
                                </BioType>
                            )}
                        </div>

                        <div className=''>
                            <ul>
                                <li className='ml-4'>
                                    <BioType className='itd-body inter-tight font-normal text-[14px] leading-[18px] text-[#333333BF]'>
                                        Password must be at least 8 characters
                                        long
                                    </BioType>
                                </li>
                                <li className='ml-4'>
                                    <BioType className='itd-body inter-tight font-normal text-[14px] leading-[18px] text-[#333333BF]'>
                                        Include at least one uppercase letter
                                    </BioType>
                                </li>
                                <li className='ml-4'>
                                    <BioType className='itd-body inter-tight font-normal text-[14px] leading-[18px] text-[#333333BF]'>
                                        Include at least one lowercase letter
                                    </BioType>
                                </li>
                                <li className='ml-4'>
                                    <BioType className='itd-body inter-tight font-normal text-[14px] leading-[18px] text-[#333333BF]'>
                                        Include at least one number
                                    </BioType>
                                </li>
                                <li className='ml-4'>
                                    <BioType className='itd-body inter-tight font-normal text-[14px] leading-[18px] text-[#333333BF]'>
                                        Include at least one symbol
                                    </BioType>
                                </li>
                            </ul>
                        </div>

                        <div className='flex w-full items-center flex-col gap-2'>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                className='inter-tight'
                                sx={{
                                    height: '48px',
                                    backgroundColor: '#000000E5',
                                    fontSize: '18px !important',
                                    fontWeight: '700',
                                    lineHeight: '24px',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#000000E5',
                                        boxShadow: 'none',
                                    },
                                }}
                            >
                                {!isButtonLoading ? (
                                    <BioType className='intake-v3-form-label-bold'>
                                        View Results
                                    </BioType>
                                ) : (
                                    <CircularProgress
                                        sx={{ color: '#FFFFFF' }}
                                    />
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                <div className=''>
                    <BioType className='itd-body inter-tight font-normal text-[14px] leading-[18px]'>
                        By proceeding, you acknowledge that you are over 18
                        years of age, and agree to the{' '}
                        <Link
                            href='https://www.gobioverse.com/terms-of-use'
                            className='text-[#1E9CD2]'
                        >
                            Terms and Conditions
                        </Link>{' '}
                        ,{' '}
                        <Link
                            href='https://www.gobioverse.com/privacy-policy'
                            className='text-[#1E9CD2]'
                        >
                            Privacy Policy
                        </Link>
                        , and{' '}
                        <Link
                            href='https://www.gobioverse.com/telehealth-consent'
                            className='text-[#1E9CD2]'
                        >
                            Consent to Telehealth treatment.
                        </Link>
                    </BioType>
                </div>

                <div className='flex flex-row items-center gap-3'>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                    <BioType className='itd-body uppercase font-normal text-[18px] leading-[24px] text-[#000626E5]'>
                        or
                    </BioType>
                    <HorizontalDivider backgroundColor={'#D3D3D3'} height={1} />
                </div>

                <div className='flex gap-[16px] flex-col'>
                    <GoogleOAuthButtonV3
                        currentUrl={getFullPathAfterDomain()}
                    />
                    <AppleOAuthButtonV3 currentUrl={getFullPathAfterDomain()} />
                    <FacebookOAuthButtonV3
                        currentUrl={getFullPathAfterDomain()}
                    />
                </div>
            </div>
        </div>
    );
}
