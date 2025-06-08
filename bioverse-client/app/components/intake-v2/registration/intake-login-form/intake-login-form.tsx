'use client';
import { Button, TextField, Typography } from '@mui/material';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import GoogleOAuthButton from '@/app/components/login/oauth-button/oauth-google';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Link from 'next/link';
import FacebookOAuthButton from '@/app/components/login/oauth-button/oauth-facebook';
import LoadingButton from '../../loading/loading-button';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import AppleOAuthButton from '@/app/components/login/oauth-button/oauth-apple';
import { url } from 'inspector';

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
        <div className="flex justify-center mb-[80px]  md:max-w-[456px]">
            <div className={`w-full gap-[10px] flex flex-col items-start`}>
                <div>
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
                </div>
                <div className="flex gap-2 flex-col">
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Log in to existing user:
                    </BioType>
                    <div className="body1 flex flex-row gap-2">
                        New User?{' '}
                        <div
                            onClick={handleChangeToSignUp}
                            className="text-blue-500 no-underline hover:underline hover:cursor-pointer"
                        >
                            Sign Up
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="body1 self-center flex flex-col gap-2 w-full"
                >
                    <div className="flex gap-2 flex-col">
                        <GoogleOAuthButton currentUrl={currentPath} />
                        <AppleOAuthButton currentUrl={currentPath} />
                        <FacebookOAuthButton currentUrl={currentPath} />
                    </div>

                    <div className="flex flex-row items-center gap-3">
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                        <Typography className="body2 text-gray-500">
                            or
                        </Typography>
                        <HorizontalDivider
                            backgroundColor={'#D3D3D3'}
                            height={1}
                        />
                    </div>

                    <TextField
                        {...register('email')}
                        label="Email address"
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
                        label="Password"
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
                        InputLabelProps={{
                            style: {
                                top: '5%',
                            },
                        }}
                    />
                    {errors.password && (
                        <p className="text-red-600 body3">
                            {errors.password.message}
                        </p>
                    )}
                    {/* <div className="flex flex-row items-center gap-3">
						<HorizontalDivider
							backgroundColor={'#D3D3D3'}
							height={1}
						/>
						<Typography className="body2 text-gray-500">
							or
						</Typography>
						<HorizontalDivider
							backgroundColor={'#D3D3D3'}
							height={1}
						/>
					</div> */}
                    <div className="flex w-full justify-end self-end flex-col gap-2 mt-2">
                        {!isButtonLoading ? (
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
                                Login
                            </Button>
                        ) : (
                            <LoadingButton />
                        )}
                    </div>
                    <div className="body1 flex flex-row items-center justify-center">
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
                </form>
            </div>
        </div>
    );
}
