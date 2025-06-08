'use client';
import Link from 'next/link';
import BioType from '../global-components/bioverse-typography/bio-type/bio-type';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { Button } from '@mui/material';

export default function CheckEmail() {
    const searchParams = useSearchParams();
    const [disabled, setDisabled] = useState(false);

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

    const resendLink = async () => {
        const supabase = createSupabaseBrowserClient();
        const email = searchParams.get('email');

        if (email && !disabled) {
            const { data, error } = await supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${getURL()}auth/changePassword`,
                }
            );
            setDisabled(true);
            setTimeout(() => {
                setDisabled(false);
            }, 10000);
        }
    };

    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col w-[341px] space-y-5'>
                <div className='mt-24'>
                    <BioType className='h3 text-[#286BA2] text-[36px] leading-[36px]'>
                        Check your email.
                    </BioType>
                    <BioType className='body3 text-[16px] leading-[18px] mt-4'>
                        We have sent you an e-mail with a link to reset your
                        password. When you receive it, click the link and create
                        a new password
                    </BioType>
                </div>
                <div>
                    <BioType className='body3 text-[16px] leading-[18px]'>
                        Didn&apos;t receive it?{' '}
                        <a
                            onClick={resendLink}
                            className='text-blue-500 no-underline hover:underline cursor-pointer'
                            aria-disabled
                        >
                            Resend Link
                        </a>
                    </BioType>
                </div>
                <div className='w-full mt-5'>
                    <Link href='/login'>
                        <Button
                            variant='contained'
                            type='submit'
                            sx={{ width: '100%', height: '45px' }}
                        >
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
