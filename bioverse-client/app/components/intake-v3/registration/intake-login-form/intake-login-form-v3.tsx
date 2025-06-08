'use client';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import GoogleOAuthButton from '@/app/components/login/oauth-button/oauth-google';
import GoogleOAuthButtonV3 from '../../buttons/oauth-buttons/oauth-google-v3';
import AppleOAuthButtonV3 from '../../buttons/oauth-buttons/oauth-apple-v3';
import FacebookOAuthButtonV3 from '../../buttons/oauth-buttons/oauth-facebook-v3';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Link from 'next/link';
import FacebookOAuthButton from '@/app/components/login/oauth-button/oauth-facebook';
import AppleOAuthButton from '@/app/components/login/oauth-button/oauth-apple';
import { url } from 'inspector';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
    currentPath: string;
    setIsOnSignUp: Dispatch<SetStateAction<boolean>>;
    isWeightLoss: boolean;
    userLoginPush: () => void;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function IntakeLoginV2({
    setIsOnSignUp,
    currentPath,
    isWeightLoss,
    userLoginPush,
}: Props) {
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: any) => {
        //set button loading state to spinner
        setIsButtonLoading(true);

        //proceed with the sign in
        const signInData = await signInUser(data);

        if (signInData.data?.user.id) {
            window.rudderanalytics.identify(signInData.data.user.id);
        }

        userLoginPush();
    };

    const handleChangeToSignUp = () => {
        setIsOnSignUp((prev) => !prev);
    };

    return (
        <div className="flex justify-center mb-[80px]  md:max-w-[456px] pb-4 md:pb-0 mt-[1.25rem] md:mt-[48px] ">
            <div className={`w-full flex flex-col items-start `}>
                {/* <div>
                    <BioType
                        className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-[#286BA2]`}
                    >
                        {isWeightLoss
                            ? ''
                            : 'Yay, smooth, rejuvenated skin starts here!'}
                    </BioType>
                </div>
                <div>
                    {!isWeightLoss && (
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Let&apos;s see if BIOVERSE is right for you.
                        </BioType>
                    )}
                </div> */}
                <div className="flex flex-col mb-[1.25rem] md:mb-[48px]">
                    <BioType className={`inter-h5-question-header`}>
                        Welcome back
                    </BioType>
                    <div className="intake-subtitle text-weak text-weak flex flex-row gap-2 mt-[0.75rem] md:mt-[12px]">
                        Don&apos;t have an account?
                        <div
                            onClick={handleChangeToSignUp}
                            className="text-blue-500 underline text-[#1e9cd2] hover:cursor-pointer"
                        >
                            Sign Up
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col  w-full "
                >
                    <div className="flex flex-col space-y-1">
                        <BioType className="intake-v3-form-label text-strong">
                            Email address
                        </BioType>
                        <TextField
                            {...register('email')}
                            variant="outlined"
                            fullWidth
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '16px',
                                    borderColor: 'black',
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
                    </div>
                    <div className="flex flex-col space-y-1  mt-[1rem] md:mt-[16px]">
                        <BioType className="intake-v3-form-label text-strong">
                            Password
                        </BioType>
                        <TextField
                            {...register('password')}
                            type="password"
                            variant="outlined"
                            fullWidth
                            inputProps={{
                                style: {
                                    textAlign: 'start',
                                    color: 'black',
                                    fontSize: '1.1em',
                                    height: '16px',
                                },
                            }}
                        />
                        {errors.password && (
                            <p className="text-red-600 body3">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-row items-center gap-3 my-[2rem] md:my-[32px]">
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                        <BioType className="intake-v3-form-label text-strong">
                            OR
                        </BioType>
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                    </div>
                    <div className="flex gap-[1rem] md:gap[16px] flex-col w-full">
                        <GoogleOAuthButtonV3 currentUrl={currentPath} />
                        <AppleOAuthButtonV3 currentUrl={currentPath} />
                        <FacebookOAuthButtonV3 currentUrl={currentPath} />
                    </div>

                    <div className="flex w-full justify-end self-end flex-col gap-2 mt-[1.25rem] md:mt-[48px]">
                        {!isButtonLoading ? (
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="h-[3rem] md:h-[48px] intake-v3-form-label-bold normal-case "
                                sx={{
                                    height: '43px',
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                    borderRadius: '12px',
                                }}
                            >
                                Continue
                            </Button>
                        ) : (
                            <LoadingButton />
                        )}
                    </div>
                </form>

                <div className=" flex flex-row items-center justify-center mt-5">
                    <BioType
                        className={`inter-h5-regular text-[14px] leading-4`}
                    >
                        By proceeding, you acknowledge that you are over 18
                        years of age, and agree to the{' '}
                        <Link
                            href="https://www.gobioverse.com/terms-of-use"
                            className="text-[#1e9cd2] underline"
                        >
                            Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="https://www.gobioverse.com/privacy-policy"
                            className="text-[#1e9cd2] underline"
                        >
                            Privacy Policy
                        </Link>
                        , and{' '}
                        <Link
                            href="https://www.gobioverse.com/telehealth-consent"
                            className="text-[#1e9cd2] underline"
                        >
                            Consent to Telehealth treatment
                        </Link>
                    </BioType>
                </div>
            </div>
        </div>
    );
}
