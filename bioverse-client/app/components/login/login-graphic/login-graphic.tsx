'use client';

import { Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import Image from 'next/image';

interface LoginGraphic {}

export default function LoginGraphic({}: LoginGraphic) {
    return (
        <div className='w-full'>
            <Paper
                elevation={0}
                className='w-[90vw] md:w-[456px] items-center justify-start flex h-[341px] relative overflow-hidden'
                style={{
                    borderRadius: '16px',
                    backgroundColor: 'rgba(59, 141, 197, 0.04)',
                }}
            >
                <div className='flex flex-col max-w-[236px] pl-[30px] gap-[16px]'>
                    <div>
                        <BioType className='itd-body text-primary text-[32px] leading-[40px]'>
                            Unmatched value. Real results.
                        </BioType>
                    </div>

                    <div className='flex flex-col gap-[12px]'>
                        <div className='flex flex-row items-center gap-[12px]'>
                            <CheckBoxRoundedIcon />
                            <BioType className='itd-subtitle text-[20px]'>
                                From $129/month
                            </BioType>
                        </div>
                        <div className='flex flex-row items-center gap-[12px]'>
                            <CheckBoxRoundedIcon />
                            <BioType className='itd-subtitle text-[20px]'>
                                No insurance required
                            </BioType>
                        </div>
                        <div className='flex flex-row items-center gap-[12px]'>
                            <CheckBoxRoundedIcon />
                            <BioType className='itd-subtitle text-[20px]'>
                                No membership fee
                            </BioType>
                        </div>
                        <div className='flex flex-row items-center gap-[12px]'>
                            <CheckBoxRoundedIcon />
                            <BioType className='itd-subtitle text-[20px]'>
                                Cancel anytime
                            </BioType>
                        </div>
                    </div>
                </div>
                <div
                    className='absolute'
                    style={{ right: '-100px', top: '-10px', zIndex: 5 }}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}/product-images/semaglutide/semaglutide-floating-login-graphic.png`}
                        width={388}
                        height={388}
                        alt={''}
                    />
                </div>

                <div
                    className='absolute'
                    style={{
                        right: '-70px',
                        top: '25px',
                        height: '296px',
                        width: '296px',
                        borderRadius: 'var(--none, 296px)',
                        background:
                            'radial-gradient(50% 50% at 50% 50%, rgba(59, 141, 197, 0.90) 0%, rgba(59, 141, 197, 0.00) 100%)',
                        zIndex: 3,
                    }}
                ></div>
            </Paper>
        </div>
    );
}
