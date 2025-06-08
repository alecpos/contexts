'use client';
import { Button, TextField } from '@mui/material';
import BioType from '../global-components/bioverse-typography/bio-type/bio-type';

import './styles.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
    const pathname = usePathname();
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const signout = async () => {
            const supabase = await createSupabaseBrowserClient();
            const { error } = await supabase.auth.signOut();

            localStorage.clear();
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(
                        /=.*/,
                        '=;expires=' + new Date().toUTCString() + ';path=/'
                    );
            });
        };
        signout();
    });

    const getURL = () => {
        let url =
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            'http://localhost:3000/';
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to include a trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!emailRegex.test(email)) {
            setError(true);
        }

        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `${getURL()}auth/changePassword`,
            }
        );

        router.push(`/auth/checkEmail?email=${email}`);
    };
    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col w-[341px] space-y-5'>
                <div className='mt-24'>
                    <BioType className='h3 text-[#286BA2] text-[36px] leading-[36px]'>
                        Forgot Password?
                    </BioType>
                    <BioType className='body3 text-[16px] leading-[18px] mt-4'>
                        Enter your email below and we will send you a link to
                        reset your password
                    </BioType>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        {error && (
                            <BioType className='body3 text-red-600 text-[16px] mb-1'>
                                Please enter a valid email
                            </BioType>
                        )}
                        <TextField
                            placeholder='Email address*'
                            value={email}
                            onChange={(e) => {
                                setError(false);
                                setEmail(e.target.value);
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& > fieldset': {
                                        border: 'none',
                                    },
                                },
                                backgroundColor: '#EBEBEB',
                                borderRadius: '12px',
                                width: '100%',
                            }}
                        />
                    </div>
                    <div className='w-full mt-5'>
                        <Button
                            variant='contained'
                            type='submit'
                            sx={{ width: '100%', height: '45px' }}
                        >
                            Reset Password
                        </Button>
                    </div>
                </form>
                <div>
                    <BioType className='body3 text-[16px] leading-[18px]'>
                        Remember your password?{' '}
                        <Link
                            href='/login'
                            className='text-blue-500 no-underline hover:underline'
                        >
                            Back to login
                        </Link>
                    </BioType>
                </div>
            </div>
        </div>
    );
}
