'use client';
import { Button, TextField } from '@mui/material';
import BioType from '../global-components/bioverse-typography/bio-type/bio-type';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    loggerTester,
    logUserInWithCode,
} from '@/app/utils/functions/auth/password-reset/password-reset';

interface Props {
    code: string;
}

export default function ChangePassword({ code }: Props) {
    const [firstPassword, setFirstPassword] = useState<string>('');
    const [secondPassword, setSecondPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        passwordConfirm: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async () => {
        const supabase = createSupabaseBrowserClient();

        // const result = await logUserInWithCode(code);
        // console.log('code login result', result);

        const session = await supabase.auth.getSession();

        await loggerTester(session);

        if (firstPassword !== secondPassword) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 10000);
            return;
        }

        const { data, error } = await supabase.auth.updateUser({
            password: firstPassword,
        });
        router.push('/auth/passwordResetSuccess');
    };
    return (
        <div className='flex justify-center'>
            <div className='w-[341px]'>
                <div className='mt-24 mb-4'>
                    <BioType className='h3 text-[#286BA2] text-[36px] leading-[36px]'>
                        Reset password
                    </BioType>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col'>
                        <TextField
                            {...register('password')}
                            placeholder='New password'
                            value={firstPassword}
                            type='password'
                            onChange={(e) => {
                                setFirstPassword(e.target.value);
                                setError(false);
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& > fieldset': {
                                        border: 'none',
                                    },
                                },
                                backgroundColor: '#EBEBEB',
                                borderRadius: '10px',
                                width: '100%',
                                marginBottom: '16px',
                            }}
                        />
                        {errors.password && (
                            <BioType className='body3 text-red-600 text-[16px] mb-1 -mt-1'>
                                {errors.password.message}
                            </BioType>
                        )}
                        <TextField
                            {...register('passwordConfirm')}
                            placeholder='Confirm new password'
                            value={secondPassword}
                            type='password'
                            onChange={(e) => {
                                setSecondPassword(e.target.value);
                                setError(false);
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& > fieldset': {
                                        border: 'none',
                                    },
                                },
                                backgroundColor: '#EBEBEB',
                                borderRadius: '10px',
                                width: '100%',
                            }}
                        />
                    </div>
                    {errors.passwordConfirm && (
                        <BioType className='body3 text-red-600 text-[16px] mt-2'>
                            {errors.passwordConfirm.message}
                        </BioType>
                    )}
                    {error && (
                        <BioType className='body3 text-red-600 text-[16px] mt-2'>
                            Please enter the same password
                        </BioType>
                    )}
                    <div className='w-full mt-5'>
                        <Button
                            variant='contained'
                            type='submit'
                            sx={{ width: '100%', height: '45px' }}
                        >
                            Change Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
