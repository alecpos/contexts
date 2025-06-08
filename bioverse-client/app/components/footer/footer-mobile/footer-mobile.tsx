import React from 'react';
import Link from 'next/link';
import './style.css';
import Image from 'next/image';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export const FooterMobile = () => {
    return (
        <div className='footer-mobile'>
            <div className='columns'>
                <div className='column'>
                    <Link href={'/'}>
                        <div className='relative w-[72.5vw] aspect-[4.26]'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                                alt={'bioverse-logo'}
                                fill
                                unoptimized
                            />
                        </div>
                    </Link>
                </div>
                <div className='frame'>
                    <div className='content-wrapper'>
                        <div className='content'>
                            <div className='text-wrapper'>
                                {' '}
                                <div className='body1bold'>POPULAR</div>
                            </div>
                            <div className='footer-links'>
                                <Link
                                    href={'/collections?fpf=nad-support'}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className='div'>
                                        {' '}
                                        <div className='body1'>
                                            NAD+ Support
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href={'/collections?fpf=weight-loss'}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className='div'>
                                        {' '}
                                        <div className='body1'>Weight loss</div>
                                    </div>
                                </Link>
                                <Link
                                    href={
                                        '/collections?fpf=health-and-longevity'
                                    }
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className='div'>
                                        {' '}
                                        <div className='body1'>
                                            Health and Longevity
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href={'/collections?fpf=gsh-support'}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className='div'>
                                        {' '}
                                        <div className='body1'>GSH Support</div>
                                    </div>
                                </Link>
                                <Link
                                    href={'/collections'}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className='div'>
                                        {' '}
                                        <div className='body1'>
                                            See all treatments
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='div-wrapper'>
                        <div className='content-2'>
                            <div className='text-wrapper'>
                                {' '}
                                <div className='body1bold'>LEARN</div>
                            </div>
                            <div className='footer-links'>
                                <div className='link'>
                                    {' '}
                                    <div className='body1'>Home</div>
                                </div>
                                <div className='div'>
                                    {' '}
                                    <div className='body1'>About</div>
                                </div>
                                <div className='div'>
                                    {' '}
                                    <div className='body1'>FAQs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='column-2'>
                        <div className='content-3'>
                            <div className='text-wrapper'>
                                {' '}
                                <div className='body1bold'>RESOURCES</div>
                            </div>
                            <div className='footer-links'>
                                <div className='link-2'>
                                    {' '}
                                    <div className='body1'>
                                        Terms &amp; conditions
                                    </div>
                                </div>
                                <div className='link-3'>
                                    {' '}
                                    <div className='body1'>Privacy policy</div>
                                </div>
                                <div className='link-4'>
                                    {' '}
                                    <div className='body1'>
                                        Telehealth Consent
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='column-3'>
                        <div className='content-4'>
                            <div className='text-wrapper'>
                                <div className='body1bold'>CONNECT</div>
                            </div>
                            <div className='footer-links'>
                                <div className='link-2'>
                                    <div className='body1'>
                                        info@gobioverse.com
                                    </div>
                                </div>
                                <div className='link-5'>
                                    <div className='body1'>(631) 676-1754</div>
                                </div>
                                <div className='social-links'>
                                    <FacebookIcon className='mr-2' />
                                    <InstagramIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='text'>
                    {' '}
                    <div className='body1'>
                        © 2024 BIOVERSE, Inc. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};
