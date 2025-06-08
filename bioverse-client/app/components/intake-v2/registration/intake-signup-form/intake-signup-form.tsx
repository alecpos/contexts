'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import AppleOAuthButton from '@/app/components/login/oauth-button/oauth-apple';
import FacebookOAuthButton from '@/app/components/login/oauth-button/oauth-facebook';
import GoogleOAuthButton from '@/app/components/login/oauth-button/oauth-google';
import {
    LEAD_STARTED,
    SIGNUP_VIEWED,
} from '@/app/services/mixpanel/mixpanel-constants';
import {
    signInUser,
    signUpWithEmailAndPassword,
} from '@/app/utils/actions/auth/server-signIn-signOut';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import { addCustomerSupportToPatientOnSignup } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import { ACCOUNT_CREATED } from '@/app/services/customerio/event_names';
import { trackLeadEvent } from '@/app/services/tracking/tracking';
import {
    identifyUser,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import {
    checkMixpanelEventFired,
    checkMixpanelSignUpViewedFired,
} from '@/app/utils/database/controller/mixpanel/mixpanel';
import { isAdvertisedProduct } from '@/app/utils/functions/pricing';
import {
    B12_INJECTION_PRODUCT_HREF,
    GLUTATHIONE_INJECTION_PRODUCT_HREF,
    NAD_INJECTION_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    aliasRudderstackEvent,
    trackRudderstackEvent,
} from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import React from 'react';
import { insertNewProfileAdsTracking } from '@/app/(testing_and_development)/olivier-dev/utils';

interface Props {
    currentPath: string;
    setIsOnSignUp: Dispatch<SetStateAction<boolean>>;
    product_href: string;
    userSignUpPush: () => void;
}

interface SignupResult {
    success: boolean;
    data?: any;
    error?: any;
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

// #TODO: Add discount to banner
export default function IntakeSignUpV2({
    currentPath,
    setIsOnSignUp,
    product_href,
    userSignUpPush,
}: Props) {
    const [anonId, setAnonId] = useLocalStorage('anonId', '');
    const [productHref, setProductHref] = useLocalStorage('product_href', '');
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    /**
     * Use Effect sends mixpanel payload for signup viewed with anonId
     */
    useEffect(() => {
        const signUpViewed = async () => {
            setProductHref(product_href);

            let anon_uuid = anonId;
            if (!anonId || anonId === '') {
                anon_uuid = uuidv4();
                setAnonId(anon_uuid);
            }
            const { data: signupData, error: signupError } =
                await checkMixpanelSignUpViewedFired(anon_uuid);

            if (!signupData && isAdvertisedProduct(product_href)) {
                const mixpanel_payload = {
                    event: SIGNUP_VIEWED,
                    properties: {
                        $device_id: anon_uuid,
                        product_name: product_href,
                    },
                };

                await trackRudderstackEvent(
                    anon_uuid,
                    RudderstackEvent.SIGNUP_VIEWED,
                    JSON.stringify({ product_name: product_href }),
                );

                // await trackMixpanelEvent(SIGNUP_VIEWED, mixpanel_payload);

                // await createMixpanelSignUpAudit(anon_uuid!, SIGNUP_VIEWED);
            }
        };

        signUpViewed();
    }, [anonId, product_href, setAnonId, setProductHref]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);

    const onSubmit = async (data: any) => {
        setIsButtonLoading(true);
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

                setLeadEventId(eventId);

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
                        product_href,
                    );

                    await aliasRudderstackEvent(userId, anonId);

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

                    await triggerEvent(userId, ACCOUNT_CREATED, {
                        context: {
                            event_id: eventId,
                            fbc,
                            fbp,
                            event_time: Math.floor(Date.now() / 1000),
                            traits: {
                                email: signInResult.data?.user?.email,
                            },
                        },
                        product_name: product_href,
                    });

                    const gclid = urlParams.get('gclid');
                    const fbclid = urlParams.get('fbclid');

                    if (gclid) {
                        await insertNewProfileAdsTracking(
                            userId,
                            gclid,
                            'google',
                        );
                    }

                    if (fbclid) {
                        await insertNewProfileAdsTracking(
                            userId,
                            fbclid,
                            'meta',
                        );
                    }

                    trackLeadEvent(payload_meta, values);

                    addCustomerSupportToPatientOnSignup(
                        signInResult.data?.user?.id,
                    );
                }
                // router.push('/nextPage'); // Navigate
                userSignUpPush();
            }
        } catch (error) {
            console.log(error, 'Signup failed');
            setIsButtonLoading(false);
        }
    };

    const handleChangeToLogIn = () => {
        setIsOnSignUp((prev) => !prev);
    };

    const renderSignupTitle = (product: string) => {
        switch (product) {
            case PRODUCT_HREF.OZEMPIC:
            case PRODUCT_HREF.ZEPBOUND:
            case PRODUCT_HREF.SEMAGLUTIDE:
            case PRODUCT_HREF.MOUNJARO:
            case PRODUCT_HREF.TIRZEPATIDE:
            case PRODUCT_HREF.WEGOVY:
            case PRODUCT_HREF.OZEMPIC_TEST:
            case PRODUCT_HREF.METFORMIN:
            case PRODUCT_HREF.WEIGHT_LOSS:
                return (
                    <div>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                        >
                            Prescription Weight Loss That Puts You First!
                        </BioType>
                    </div>
                );
            case GLUTATHIONE_INJECTION_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                        >
                            Affordable glutathione supplementation starts here!
                        </BioType>
                    </div>
                );
            case PRODUCT_HREF.NAD_NASAL_SPRAY:
            case NAD_INJECTION_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                        >
                            Affordable NAD+ supplementation starts here!
                        </BioType>
                    </div>
                );
            case B12_INJECTION_PRODUCT_HREF:
                return (
                    <div>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                        >
                            Affordable B12 supplementation starts here!
                        </BioType>
                    </div>
                );
            case PRODUCT_HREF.RUSH_MELTS:
            case PRODUCT_HREF.ED_GLOBAL:
                return (
                    <div>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                        >
                            Affordable ED solutions start here!
                        </BioType>
                    </div>
                );
            default:
                return (
                    <>
                        <div>
                            <BioType
                                className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                            >
                                Let&apos;s see if BIOVERSE is right for you.
                            </BioType>
                        </div>
                        <div>
                            {/* {!isWeightLoss &&
                                product_href !== NAD_INJECTION_PRODUCT_HREF && (
                                    <BioType
                                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Let&apos;s see if BIOVERSE is right for
                                        you.
                                    </BioType>
                                )} */}
                        </div>
                    </>
                );
        }
    };

    return (
        <>
            <div className="flex justify-center flex-col w-full ">
                <div className="flex p-0 flex-col gap-2 md:max-w-[520px]">
                    {renderSignupTitle(product_href)}
                    <div className="flex flex-col gap-2">
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Create an account to save your progress and order
                            your treatment.
                        </BioType>

                        <div
                            className={`${INTAKE_PAGE_BODY_TAILWIND} flex flex-row gap-2`}
                        >
                            Already have an account?{' '}
                            <div
                                onClick={handleChangeToLogIn}
                                className="text-[#286BA2] no-underline hover:underline hover:cursor-pointer"
                            >
                                Login
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-col">
                        <GoogleOAuthButton currentUrl={currentPath} />
                        <AppleOAuthButton currentUrl={currentPath} />
                        <FacebookOAuthButton currentUrl={currentPath} />
                    </div>

                    <div className="flex flex-row items-center gap-3">
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                        <Typography className="body2 text-text">or</Typography>
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="body1 self-center flex flex-col gap-4 w-full"
                    >
                        <TextField
                            {...register('email')}
                            variant="outlined"
                            placeholder="Email address"
                            fullWidth
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '34px',
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    top: '5%',
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
                            placeholder="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '34px',
                                },
                            }}
                        />
                        {errors.password && (
                            <p className="text-red-600 body3">
                                {errors.password.message}
                            </p>
                        )}
                        <div className="flex w-full justify-end self-end flex-col gap-2">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="py-4"
                                sx={{
                                    height: '58px',
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                }}
                            >
                                {!isButtonLoading ? (
                                    'Sign Up'
                                ) : (
                                    <CircularProgress
                                        sx={{ color: '#FFFFFF' }}
                                    />
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="body1 flex flex-row items-center justify-center">
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[16px] not-italic leading-[18px] tracking-[0.16px]`}
                        >
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
                </div>
            </div>
        </>
    );
}
