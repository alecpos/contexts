'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LegitScriptSeal from './legit-script-seal/legit-script-seal';
import { usePathname } from 'next/navigation';
import HorizontalDivider from '../global-components/dividers/horizontalDivider/horizontalDivider';

export default function Footer() {
    const pathname = usePathname();

    if (pathname.includes('message')) {
        return <></>;
    }
    return (
        <>
            <div className='items-center flex flex-col gap-10 pb-[8px]  md:px-16 bg-[#F7F6F7] overflow-hidden md:max-w-[100vw]'>
                <div className='flex flex-col items-center md:flex-row md:items-start md:pt-16 justify-around gap-6 md:max-w-[1200px]'>
                    <div className='mt-8'>
                        <Link
                            href={'/'}
                            className='pt-[3rem] md:pt-0 pb-[2rem]'
                        >
                            <Image
                                src='/img/bioverse-logo-full.png'
                                alt='bioverse-logo'
                                width={215}
                                height={52}
                                unoptimized
                            />
                        </Link>
                        <div className='flex justify-center'>
                            <LegitScriptSeal />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
                        <div
                            id='popular-and-learn-col'
                            className='flex flex-row-reverse md:flex-row w-[75vw] md:w-auto  justify-between md:justify-start gap-8 md:gap-16'
                        >
                            <div className='flex flex-col flex-1'>
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <div className='body1bold text-[#212121]'>
                                            LEARN
                                        </div>
                                    </div>
                                    <div className='gap-2 flex flex-col body1'>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/home'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>Home</div>
                                        </a>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/about'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>About</div>
                                        </a>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/faqs'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>FAQs</div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col flex-1'>
                                <div className='flex flex-col gap-4 text-nowrap'>
                                    <div>
                                        <div className='body1bold text-[#212121]'>
                                            POPULAR
                                        </div>
                                    </div>
                                    <div className='gap-2 flex flex-col body1'>
                                        <Link
                                            href={
                                                '/collections?fpf=nad-support'
                                            }
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className='body1'>
                                                NAD+ Support
                                            </div>
                                        </Link>
                                        <Link
                                            href={
                                                '/collections?fpf=weight-loss'
                                            }
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className='body1'>
                                                Weight loss
                                            </div>
                                        </Link>
                                        <Link
                                            href={
                                                '/collections?fpf=health-and-longevity'
                                            }
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className='body1'>
                                                Health and Longevity
                                            </div>
                                        </Link>
                                        <Link
                                            href={
                                                '/collections?fpf=gsh-support'
                                            }
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className='body1'>
                                                GSH Support
                                            </div>
                                        </Link>
                                        <Link
                                            href={'/collections'}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className='body1'>
                                                See all treatments
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/**
                         * Second Set of columns:
                         */}

                        <div
                            id='popular-and-learn-col'
                            className='flex flex-row w-[75vw] md:w-auto md:justify-normal justify-between gap-8'
                        >
                            <div className='flex flex-col flex-1'>
                                <div className='flex flex-col gap-4'>
                                    <div className='text-wrapper'>
                                        <div className='body1bold text-[#212121]'>
                                            RESOURCES
                                        </div>
                                    </div>
                                    <div className='gap-2 flex flex-col body1'>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/terms-of-use'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>
                                                Terms &amp; conditions
                                            </div>
                                        </a>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/privacy-policy'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>
                                                Privacy policy
                                            </div>
                                        </a>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/telehealth-consent'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>
                                                Telehealth Consent
                                            </div>
                                        </a>
                                        <a
                                            href={
                                                'https://www.gobioverse.com/returns-refunds'
                                            }
                                            className='no-underline'
                                        >
                                            <div className='body1'>
                                                Returns & Refunds
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col flex-1'>
                                <div className='flex flex-col gap-4'>
                                    <div className='text-wrapper-2'>
                                        <div className='body1bold text-[#212121]'>
                                            CONNECT
                                        </div>
                                    </div>
                                    <div className='gap-2 flex flex-col body1'>
                                        <div className='link-4'>
                                            {' '}
                                            <div className='body1'>
                                                info@gobioverse.com
                                            </div>
                                        </div>
                                        <div className='link-5'>
                                            {' '}
                                            <div className='body1'>
                                                (747) 666-8167
                                            </div>
                                        </div>
                                    </div>
                                    <div className='social-links'>
                                        <FacebookIcon className='mr-3' />
                                        <InstagramIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-[80%]'>
                    <HorizontalDivider backgroundColor={'#B1B1B1'} height={1} />
                </div>

                <div className='mb-10'>
                    <span className='body1 text-[#333]'>
                        © 2024 BIOVERSE, Inc. All rights reserved.
                    </span>
                </div>
            </div>
        </>
    );
}
