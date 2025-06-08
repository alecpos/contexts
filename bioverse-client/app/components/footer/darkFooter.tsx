'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LegitScriptSeal from './legit-script-seal/legit-script-seal';
import { usePathname } from 'next/navigation';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import {
    createTheme,
    ThemeProvider,
    Theme,
    useTheme,
} from '@mui/material/styles';
import { Checkbox, TextField } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { insertMarketingOptIn } from '@/app/utils/database/controller/marketing_opt_ins/marketing';
import BioType from '../global-components/bioverse-typography/bio-type/bio-type';

const customFooterInputTheme = (outerTheme: Theme) =>
    createTheme({
        palette: {
            mode: outerTheme.palette.mode,
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '--TextField-brandBorderColor': '#ffffff',

                        // '--TextField-brandBorderHoverColor': 'yellow',
                        // '--TextField-brandBorderFocusedColor': 'pink',
                        '& label': {
                            color: '#ffffff',
                            opacity: 0.6,
                            fontFamily: ['Tw Cen MT Pro', 'sans-serif'],
                            fontSize: '.75rem',
                            fontStyle: 'normal',
                            fontWeight: '300',
                            lineHeight: '24px',
                        },
                        '& label.Mui-focused': {
                            color: '#ffffff',
                            opacity: 0.6,
                        },
                        '& input': {
                            color: '#ffffff', // Set text color to white
                            width: '80%', // Set the width of the input field
                            fontFamily:['Tw Cen MT Pro', 'sans-serif'],
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: '300',
                            lineHeight: '24px',
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: 'var(--TextField-brandBorderColor)',
                    },
                    root: {
                        [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: '#ffffff',
                        },
                        [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]:
                            {
                                borderColor: '#ffffff',
                            },
                    },
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        height: '100%',
                        color: '#ffffff',
                    },
                },
            },
        },
    });

export default function DarkFooter() {
    const pathname = usePathname();

    const [currentEmail, setCurrentEmail] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);

    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const [showLearnLinks, setShowLearnLinks] = useState<boolean>(false);
    const [showPopularLinks, setShowPopularLinks] = useState<boolean>(false);
    const [showResourcesLinks, setShowResourcesLinks] =
        useState<boolean>(false);
    const [showConnectLinks, setShowConnectLinks] = useState<boolean>(false);
    const outerTheme = useTheme();

    const handleValueChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setCurrentEmail(event.target.value);
    };

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setTermsAgreed(event.target.checked);
    };
    if (pathname.includes('message')) {
        return <></>;
    }

    const handleMarketingOptIn = async () => {
        await insertMarketingOptIn(currentEmail);
        setEmailSubmitted(true);
    };

    return (
        <>
            <ThemeProvider theme={customFooterInputTheme(outerTheme)}>
                <div className="items-center flex flex-col gap-12 py-20 px-4 lg:px-16 bg-[#000000] overflow-hidden lg:max-w-[100vw]">
                    <div className="flex flex-col items-center  lg:items-start  justify-around gap-6 lg:max-w-[1200px]">
                        <div className="w-full flex flex-col items-center gap-12">
                            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
                                <div className="flex flex-col lg:flex-row w-full lg:w-auto  justify-between lg:justify-start gap-12 lg:gap-[61px">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col lg:gap-5 gap-4 lg:w-[14.875rem]">
                                            <div className="lg:fd-header f-header-large text-[#FFF] ">
                                                Get the latest from BIOVERSE
                                            </div>

                                            <div className="relative flex items-center w-full lg:w-auto">
                                                <TextField
                                                    label="Email address"
                                                    fullWidth
                                                    onChange={handleValueChange}
                                                />
                                                {termsAgreed && (
                                                    <div
                                                        onClick={
                                                            handleMarketingOptIn
                                                        }
                                                        className="absolute right-[10px] hover:cursor-pointer"
                                                    >
                                                        <ArrowForwardIcon
                                                        // sx={{
                                                        //     position: 'absolute',
                                                        //     right: '10px',
                                                        // }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {currentEmail &&
                                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                                    currentEmail,
                                                ) && (
                                                    <div className="w-full flex flex-row">
                                                        <Checkbox
                                                            sx={{
                                                                color: '#FFFFFF',
                                                                opacity: 0.5,
                                                            }}
                                                            checked={
                                                                termsAgreed
                                                            }
                                                            onChange={
                                                                handleCheckboxChange
                                                            }
                                                        />
                                                        <div className="f-body lg:fd-body  text-[#FFF]">
                                                            I agree to the{' '}
                                                            <span className="text-[#808080]">
                                                                <a
                                                                    href="https://www.gobioverse.com/terms-of-use"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#FFFFFF] opacity-50"
                                                                >
                                                                    Terms and
                                                                    Conditions
                                                                </a>
                                                            </span>
                                                            ,{' '}
                                                            <span className="text-[#808080]">
                                                                <a
                                                                    href="https://www.gobioverse.com/privacy-policy"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#808080]"
                                                                >
                                                                    Privacy
                                                                    Policy
                                                                </a>
                                                            </span>
                                                            , and{' '}
                                                            <span className="text-[#808080]">
                                                                <a
                                                                    href="https://www.gobioverse.com/telehealth-consent"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#808080]"
                                                                >
                                                                    Telehealth
                                                                    Consent
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            {emailSubmitted && (
                                                <BioType className="f-body lg:fd-body  text-primary">
                                                    Thank you for opting in to
                                                    receive updates from
                                                    BIOVERSE!
                                                </BioType>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-9">
                                            <div
                                                className="text-wrapper-2 flex justify-between lg:min-w-[162px]"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className="fd-header text-[#FFF]">
                                                    LEARN
                                                </div>
                                                <div className="lg:hidden">
                                                    {showLearnLinks ? (
                                                        <KeyboardArrowUpIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowLearnLinks(
                                                                    !showLearnLinks,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <KeyboardArrowDownIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowLearnLinks(
                                                                    !showLearnLinks,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className={`gap-6 flex flex-col f-body lg:fd-body  ${
                                                    !showLearnLinks && 'hidden'
                                                } lg:flex text-[#FFF]`}
                                            >
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/home'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Home
                                                    </div>
                                                </a>
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/about'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        About
                                                    </div>
                                                </a>
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/faqs'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        FAQs
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-9 text-nowrap">
                                            <div
                                                className=" flex justify-between  lg:min-w-[162px]"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className="fd-header text-[#FFF]">
                                                    POPULAR
                                                </div>
                                                <div className="lg:hidden">
                                                    {showPopularLinks ? (
                                                        <KeyboardArrowUpIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowPopularLinks(
                                                                    !showPopularLinks,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <KeyboardArrowDownIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowPopularLinks(
                                                                    !showPopularLinks,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={`gap-6 flex flex-col f-body lg:fd-body  ${
                                                    !showPopularLinks &&
                                                    'hidden'
                                                } lg:flex text-[#FFF]`}
                                            >
                                                <Link
                                                    href={
                                                        '/collections?fpf=weight-loss'
                                                    }
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Weight loss
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={
                                                        '/collections?fpf=nad-support'
                                                    }
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        NAD+ Support
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={
                                                        '/collections?fpf=health-and-longevity'
                                                    }
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Health + Longevity
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={
                                                        '/collections?fpf=gsh-support'
                                                    }
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        GSH Support
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={'/collections'}
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        See all treatments
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-9">
                                            <div
                                                className="text-wrapper-2 flex justify-between"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className="fd-header text-[#FFF]">
                                                    RESOURCES
                                                </div>
                                                <div className="lg:hidden">
                                                    {showResourcesLinks ? (
                                                        <KeyboardArrowUpIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowResourcesLinks(
                                                                    !showResourcesLinks,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <KeyboardArrowDownIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowResourcesLinks(
                                                                    !showResourcesLinks,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={`gap-6 flex flex-col f-body lg:fd-body  ${
                                                    !showResourcesLinks &&
                                                    'hidden'
                                                } lg:flex text-[#FFF]`}
                                            >
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/terms-of-use'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Terms &amp; conditions
                                                    </div>
                                                </a>
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/privacy-policy'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Privacy policy
                                                    </div>
                                                </a>
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/telehealth-consent'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Telehealth Consent
                                                    </div>
                                                </a>
                                                <a
                                                    href={
                                                        'https://www.gobioverse.com/returns-refunds'
                                                    }
                                                    className="no-underline"
                                                >
                                                    <div className="f-body lg:fd-body  text-[#FFF]">
                                                        Returns & Refunds
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-9">
                                            <div
                                                className="text-wrapper-2 flex justify-between"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className="fd-header text-[#FFF]">
                                                    CONNECT
                                                </div>
                                                <div className="lg:hidden">
                                                    {showConnectLinks ? (
                                                        <KeyboardArrowUpIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowConnectLinks(
                                                                    !showConnectLinks,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <KeyboardArrowDownIcon
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                            onClick={() =>
                                                                setShowConnectLinks(
                                                                    !showConnectLinks,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className='w-full'>
                                                <div
                                                    className={`gap-6 flex flex-col f-body lg:fd-body  ${
                                                        !showConnectLinks &&
                                                        'hidden'
                                                    } lg:flex text-[#FFF]`}
                                                >
                                                    <div className="link-4">
                                                        {' '}
                                                        <div className="f-body lg:fd-body  text-[#FFF]">
                                                            info@gobioverse.com
                                                        </div>
                                                    </div>
                                                    <div className="link-5">
                                                        {' '}
                                                        <div className="f-body lg:fd-body  text-[#FFF]">
                                                            (747) 666-8167
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="social-links text-center lg:text-start mt-6 lg:mx-0">
                                                    <img
                                                        className="h-4 w-4 mr-3"
                                                        alt={'Facebook Icon'}
                                                        src={
                                                            '/img/footer/facebook.svg'
                                                        }
                                                    />
                                                    <img
                                                        className="h-4 w-4 mr-3"
                                                        alt={'Instagram Icon'}
                                                        src={
                                                            '/img/footer/instagram.svg'
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-row flex-col-reverse items-center gap-6 w-full">
                                <LegitScriptSeal />
                                <span className="f-body lg:fd-body  text-[#FFF]">
                                    © 2024 BIOVERSE, Inc. All rights reserved.
                                </span>
                            </div>
                        </div>

                        <div className="relative opacity-30 w-full">
                            <Link href={'/'} style={{ color: '#4d4d4d' }}>
                                <Image
                                    src="/img/bioverse-logo-gray.png"
                                    alt="Bioverse Dark Logo"
                                    width={0}
                                    height={0}
                                    sizes="100%"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }} // optional
                                    unoptimized
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </>
    );
}
