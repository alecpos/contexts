'use client';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { Button, CircularProgress, Paper, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { mutate } from 'swr';

interface MFAProps {
    url: string;
}

export default function MfaVerifyPageContents({ url }: MFAProps) {
    const [verifyCode, setVerifyCode] = useState('');
    const [error, setError] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    const searchParams = useSearchParams();

    const usr = searchParams.get('usr') ?? '';

    useEffect(() => {
        if (verifyCode.length >= 6) {
            onSubmitClicked();
        }
        if (verifyCode.length < 6) {
            setError(false);
        }
    }, [verifyCode]);

    const router = useRouter();

    const onCancelled = async () => {
        await signOutUser();
        router.push('/');
    };

    console.log('OUtisde URL: ', url, ' outside USR: ', usr);

    const onSubmitClicked = () => {
        setIsVerifying(true);
        const supabase = createSupabaseBrowserClient();

        (async () => {
            const factors = await supabase.auth.mfa.listFactors();
            if (factors.error) {
                throw factors.error;
            }

            const totpFactor = factors.data.totp[0];

            if (!totpFactor) {
                throw new Error('No TOTP factors found!');
            }

            const factorId = totpFactor.id;

            const challenge = await supabase.auth.mfa.challenge({ factorId });
            if (challenge.error) {
                setError(true);
                throw challenge.error;
            }

            const challengeId = challenge.data.id;

            const verify = await supabase.auth.mfa.verify({
                factorId,
                challengeId,
                code: verifyCode,
            });
            if (verify.error) {
                setError(true);
            } else {
                console.log('URL: ', url, 'USR: ', usr);

                if (url === 'undefined' || url === '/') {
                    if (usr === 'provider') {
                        router.push('/provider');
                    } else {
                        router.push('/');
                    }
                } else {
                    router.push(url ?? '/');
                }
            }
        })();

        setIsVerifying(false);
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <Paper className="flex flex-col p-[36px] mt-[15%] self-center justify-self-center w-[456px] gap-[16px]">
                    <div className="flex relative justify-center w-[237px] h-[63px] self-center text-center">
                        <div
                            onClick={() => {
                                onCancelled();
                            }}
                            className="cursor-pointer"
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                                fill
                                alt="Bioverse Banner"
                                sizes="237px"
                                unoptimized
                            />
                        </div>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <BioType className="itd-subtitle self-center">
                        Please enter the code from your Authenticator app.
                    </BioType>

                    <div className="flex flex-col items-center gap-[24px]">
                        <TextField
                            type="text"
                            value={verifyCode}
                            fullWidth
                            onChange={(e) => {
                                if (e.target.value.trim().length < 7) {
                                    setVerifyCode(e.target.value.trim());
                                }
                            }}
                            variant="outlined"
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderWidth: '2px',
                                        borderColor: error
                                            ? '#E99797'
                                            : 'default',
                                    },
                                    '&:hover fieldset': {
                                        borderWidth: '2px',
                                        borderColor: error
                                            ? '#E99797'
                                            : 'default',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderWidth: '2px',
                                        borderColor: error
                                            ? '#E99797'
                                            : 'default',
                                    },
                                },
                            }}
                        />

                        {error && (
                            <>
                                <Paper
                                    elevation={0}
                                    className="flex bg-[#FDEDED] p-[16px]"
                                >
                                    <div className="flex flex-row">
                                        <div>
                                            <ErrorOutlineIcon
                                                sx={{
                                                    color: '#D32F2F',
                                                    marginTop: '12px',
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-[12px] p-[13px]">
                                            <BioType className="itd-subtitle text-[#5F2120]">
                                                Invalid MFA Code
                                            </BioType>
                                            <BioType className="itd-body text-[#5F2120]">
                                                The multi-factor authentication
                                                (MFA) could not be verified.
                                                Either the code that you entered
                                                is not valid or you&apos;re not
                                                using a supported MFA deliver.
                                            </BioType>
                                        </div>
                                    </div>
                                </Paper>
                            </>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSubmitClicked}
                            fullWidth
                            sx={{
                                height: '42px',
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                            }}
                        >
                            {isVerifying ? (
                                <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={22}
                                />
                            ) : (
                                'Submit'
                            )}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            color="primary"
                            onClick={onCancelled}
                            size="small"
                            sx={{ textDecoration: 'underline', flexShrink: 1 }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Paper>
            </div>
        </>
    );
}
