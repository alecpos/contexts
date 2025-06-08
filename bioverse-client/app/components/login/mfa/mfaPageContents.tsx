'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import {
    Button,
    CircularProgress,
    Link,
    Paper,
    TextField,
} from '@mui/material';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';

interface Props {
    url: string;
}

export default function MfaPageContents({ url }: Props) {
    const router = useRouter();

    const onEnrolled = () => {
        router.push('/');
    };

    const onCancelled = async () => {
        await signOutUser();
        router.push('/');
    };

    const [factorId, setFactorId] = useState('');
    const [qr, setQR] = useState(''); // holds the QR code image SVG
    const [verifyCode, setVerifyCode] = useState(''); // contains the code entered by the user
    const [error, setError] = useState(''); // holds an error message
    const [enrollmentStarted, setEnrollmentStarted] = useState<boolean>(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);

    const supabase = createSupabaseBrowserClient();

    const onEnableClicked = () => {
        setError('');
        setIsVerifyingCode(true);
        (async () => {
            const challenge = await supabase.auth.mfa.challenge({ factorId });
            if (challenge.error) {
                setError(challenge.error.message);
                throw challenge.error;
            }

            const challengeId = challenge.data.id;

            const verify = await supabase.auth.mfa.verify({
                factorId,
                challengeId,
                code: verifyCode,
            });
            if (verify.error) {
                setError(verify.error.message);
                throw verify.error;
            }

            onEnrolled();
        })();

        setIsVerifyingCode(false);
    };

    useEffect(() => {
        if (enrollmentStarted) {
            (async () => {
                const { data, error } = await supabase.auth.mfa.enroll({
                    factorType: 'totp',
                });
                if (error) {
                    throw error;
                }

                setFactorId(data.id);

                // Supabase Auth returns an SVG QR code which you can convert into a data
                // URL that you can place in an <img> tag.
                setQR(data.totp.qr_code);
            })();
        }
    }, [enrollmentStarted]);

    useEffect(() => {
        if (verifyCode.length >= 6) {
            onEnableClicked();
        }
    }, [verifyCode]);

    return (
        <div className='flex flex-col items-center'>
            <Paper className='flex flex-col p-[36px] mt-[16%] self-center justify-self-center w-[456px]'>
                <div className='flex relative justify-center w-[314px] h-[80px] self-center'>
                    <div
                        onClick={() => {
                            onCancelled();
                        }}
                        className='cursor-pointer'
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                            fill
                            alt='Bioverse Banner'
                            sizes='314px'
                            unoptimized
                        />
                    </div>
                </div>

                {error && <div className='error'>{error}</div>}
                {!enrollmentStarted && (
                    <div className='flex flex-col items-stat justify-center gap-[16px] mt-4 text-start'>
                        <BioType className='itd-subtitle'>
                            Please enroll in MFA to continue using the
                            application.
                        </BioType>
                        <BioType className='itd-subtitle text-[#00000099]'>
                            Click below to begin MFA process
                        </BioType>
                        <div className='w-full flex flex-col gap-2'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => {
                                    setEnrollmentStarted(true);
                                }}
                                fullWidth
                                sx={{
                                    height: '42px',
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                }}
                            >
                                Begin
                            </Button>
                            <Button
                                fullWidth
                                variant='outlined'
                                color='error'
                                onClick={onCancelled}
                                sx={{
                                    flexShrink: 1,
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
                {enrollmentStarted && (
                    <div className='flex flex-col items-center gap-4'>
                        <BioType className='itd-subtitle self-center pt-3 pb-1'>
                            Please enter the code from your Authenticator App.
                        </BioType>
                        <img src={qr} width={296} height={296} />
                        <TextField
                            type='text'
                            fullWidth
                            value={verifyCode}
                            onChange={(e) =>
                                setVerifyCode(e.target.value.trim())
                            }
                            label='Verification Code'
                            variant='outlined'
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onEnableClicked}
                            fullWidth
                            sx={{
                                height: '42px',
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                            }}
                        >
                            {!isVerifyingCode ? (
                                <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={22}
                                />
                            ) : (
                                'Enable MFA'
                            )}
                        </Button>
                        <Button
                            fullWidth
                            variant='text'
                            color='primary'
                            onClick={onCancelled}
                            sx={{ textDecoration: 'underline', flexShrink: 1 }}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </Paper>
        </div>
    );
}
