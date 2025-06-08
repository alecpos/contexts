'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import { useState } from 'react';
import ContinueButton from '../buttons/ContinueButton';
import RTBBanner from '../rtb/rtb-banner';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';

interface RTBProps {}

export default function ReasonsToBelieveComponent({}: RTBProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    // const [showButton, setShowButton] = useState(false);

    // // useEffect to change the state after a certain delay, e.g., 5 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowButton(true);
    //     }, 4000); // 5000 milliseconds = 5 seconds

    //     // Cleanup function to clear the timer if the component unmounts
    //     return () => clearTimeout(timer);
    // }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className={`justify-center flex animate-slideRight`}>
            <div className="flex flex-col gap-8 h-full overflow-y-hidden">
                <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                    You no longer have to do it alone. We&apos;re here to help!
                </BioType>
                <div className="flex flex-col gap-4 h-full">
                    {/* <AnimatedBioType
                        text={`You can now get an affordable and clinically effective way to lose weight (and keep it off)!`}
                        className={'h5 !text-primary'}
                        gap_y={1}
                    /> */}

                    <RTBBanner
                        icon={
                            <MoneyOffIcon fontSize={'medium'} color="primary" />
                        }
                        text={
                            'We don’t charge a membership fee like other companies do.'
                        }
                    />

                    <RTBBanner
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 32 32"
                            >
                                <path
                                    fill="#59B7C1"
                                    d="M4.598 3h1.42A.99.99 0 0 1 7 4c0 .552-.44 1-.981 1H4.5c-.484 0-.5.25-.5.5V8h.007a276.66 276.66 0 0 0 0 2.612L4.004 11H2V5.611A2.607 2.607 0 0 1 4.598 3m-2.58 9c.167 3.874 2.365 6.534 5.982 6.945v4.677C8 27.133 10.583 30 14 30s6-2.857 6-6.378V20c0-2.086.904-3 3-3c1.73 0 2.713.61 2.946 2.19a3.001 3.001 0 1 0 1.991-.04C27.577 16.756 25.69 15.015 23 15c-2.928-.017-5 2-5 5.1v3.522C18 25.907 16.218 28 14 28s-4-2.093-4-4.378v-4.677c3.62-.407 5.816-3.068 5.988-6.945h-2.032c-.312 3.333-2.217 5-4.952 5s-4.63-1.667-4.952-5zM27 23.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3M14 11h2c.003-.912.007-2.754 0-2.983V5.61A2.607 2.607 0 0 0 13.402 3h-1.42A.99.99 0 0 0 11 4c0 .552.44 1 .981 1H13.5c.484 0 .5.25.5.5z"
                                />
                            </svg>
                        }
                        text={'Your virtual consultation is FREE.'}
                    />

                    <RTBBanner
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 25 24"
                                fill="none"
                            >
                                <rect
                                    width="32"
                                    height="32"
                                    transform="translate(0.5)"
                                    fill="white"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M5.5 2C5.36739 2 5.24021 2.05268 5.14645 2.14645C5.05268 2.24021 5 2.36739 5 2.5V21.5C5 21.6326 5.05268 21.7598 5.14645 21.8536C5.24021 21.9473 5.36739 22 5.5 22H19.5C19.6326 22 19.7598 21.9473 19.8536 21.8536C19.9473 21.7598 20 21.6326 20 21.5V7.5C20 7.3674 19.9473 7.24025 19.8535 7.1465L14.8535 2.1465C14.7598 2.05273 14.6326 2.00003 14.5 2H5.5ZM6 21V3H14V7.5C14 7.63261 14.0527 7.75979 14.1464 7.85355C14.2402 7.94732 14.3674 8 14.5 8H19V21H6ZM18.293 7L15 3.707V7H18.293ZM9 16.5H10V13H10.793L13.293 15.5L11.6465 17.1465L12.3535 17.8535L14 16.207L15.6465 17.8535L16.3535 17.1465L14.707 15.5L16.3535 13.8535L15.6465 13.1465L14 14.793L12.1975 12.9905C12.7089 12.9405 13.1814 12.6956 13.517 12.3066C13.8527 11.9176 14.0258 11.4143 14.0004 10.9011C13.975 10.388 13.753 9.90424 13.3806 9.55028C13.0082 9.19632 12.5138 8.99928 12 9H9.5C9.36739 9 9.24021 9.05268 9.14645 9.14645C9.05268 9.24021 9 9.36739 9 9.5V16.5ZM12 12H10V10H12C12.2652 10 12.5196 10.1054 12.7071 10.2929C12.8946 10.4804 13 10.7348 13 11C13 11.2652 12.8946 11.5196 12.7071 11.7071C12.5196 11.8946 12.2652 12 12 12Z"
                                    fill="#59B7C1"
                                />
                            </svg>
                        }
                        text={'You only pay for the medication if prescribed.'}
                    />

                    <RTBBanner
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 25 24"
                                fill="none"
                            >
                                <rect
                                    width="24"
                                    height="24"
                                    transform="translate(0.5)"
                                    fill="white"
                                />
                                <path
                                    d="M14.0584 2.97624C13.057 2.57563 11.9399 2.57563 10.9384 2.97624L4.03004 5.74224C3.69633 5.8757 3.41021 6.10601 3.20854 6.40349C3.00686 6.70098 2.89886 7.05204 2.89844 7.41144V16.5866C2.89838 16.9465 3.00616 17.298 3.20786 17.596C3.40957 17.894 3.69595 18.1246 4.03004 18.2582L10.9384 21.0218C11.9399 21.4225 13.057 21.4225 14.0584 21.0218L20.9668 18.2582C21.3009 18.1246 21.5873 17.894 21.789 17.596C21.9907 17.298 22.0985 16.9465 22.0984 16.5866V7.41144C22.0983 7.05183 21.9904 6.70052 21.7887 6.40279C21.587 6.10507 21.3007 5.87458 20.9668 5.74104L14.0584 2.97624ZM11.3848 4.09224C12.1001 3.80613 12.898 3.80613 13.6132 4.09224L19.8832 6.60024L17.1484 7.69224L9.76364 4.74024L11.3848 4.09224ZM8.14844 5.38464L15.5332 8.33784L12.4984 9.55344L5.11364 6.59904L8.14844 5.38464ZM13.0984 10.6046L20.8984 7.48464V16.5854C20.8987 16.7055 20.8629 16.8228 20.7957 16.9223C20.7285 17.0218 20.6331 17.0988 20.5216 17.1434L13.6132 19.907C13.4452 19.973 13.2724 20.0246 13.0984 20.0606V10.6046ZM11.8984 10.6046V20.0606C11.723 20.0248 11.5511 19.9734 11.3848 19.907L4.47524 17.1434C4.36401 17.0989 4.26868 17.022 4.20153 16.9228C4.13437 16.8235 4.09847 16.7065 4.09844 16.5866V7.48584L11.8984 10.6046Z"
                                    fill="#59B7C1"
                                />
                            </svg>
                        }
                        text={
                            'If prescribed, your treatment is shipped to you quickly for FREE.'
                        }
                    />

                    <RTBBanner
                        icon={
                            <ChatBubbleOutlineOutlinedIcon
                                fontSize={'medium'}
                                color="primary"
                            />
                        }
                        text={
                            'You can message your provider at any time through the BIOVERSE portal.'
                        }
                    />

                    {/* {showButton && ( */}
                    <div></div>
                    <div></div>

                    <AnimatedContinueButton
                        onClick={pushToNextRoute}
                        // buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
