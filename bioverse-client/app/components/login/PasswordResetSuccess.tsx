'use client';

import Link from 'next/link';
import BioType from '../global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { Session } from '@supabase/supabase-js';
import { PASSWORD_UPDATED } from '@/app/services/customerio/event_names';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';

interface Props {
    sessionData: Session | null;
}

export default function PasswordResetSuccess({ sessionData }: Props) {
    useEffect(() => {
        // Supabase auto signs user in after password reset
        const onPageLoad = async () => {
            if (sessionData && sessionData.user.id) {
                await triggerEvent(sessionData.user.id, PASSWORD_UPDATED);
            }
        };
        onPageLoad();
    }, []);

    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col w-[341px] space-y-5'>
                <div className='mt-24'>
                    <BioType className='h3 text-[#286BA2] text-[36px] leading-[36px]'>
                        Password reset.
                    </BioType>
                    <BioType className='body3 text-[16px] leading-[18px] mt-4'>
                        Your password was successfully updated.
                    </BioType>
                </div>

                <div>
                    <div className='w-full mt-5'>
                        <Link href={'/login'}>
                            <Button
                                variant='contained'
                                type='submit'
                                sx={{ width: '100%', height: '45px' }}
                            >
                                BACK TO LOGIN
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
