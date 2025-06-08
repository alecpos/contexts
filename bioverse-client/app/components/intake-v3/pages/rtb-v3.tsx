'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AnimatedContinueButton from '../../intake-v2/buttons/AnimatedContinueButton';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../../intake-v2/styles/intake-tailwind-declarations';
import RTBBannerV3 from '../rtb/RTBBannerV3';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';

interface RTBProps {}

export default function ReasonsToBelieveComponentV3({}: RTBProps) {
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
        <div className={`justify-center flex animate-slideRight pb-16 md:pb-0 mt-[1.25rem] md:mt-[48px] `}>
            <div className="flex flex-col gap-[20px] md:gap-[48px] h-full overflow-y-hidden">
                <BioType className={`inter-h5-question-header`}>
                    You no longer have to do it alone. We&apos;re here to help!
                </BioType>
                <div className="flex flex-col gap-[8px] h-full ">
                    {/* <AnimatedBioType
                        text={`You can now get an affordable and clinically effective way to lose weight (and keep it off)!`}
                        className={'h5 !text-primary'}
                        gap_y={1}
                    /> */}

                    <RTBBannerV3
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className='w-[1.5rem] md:w-[24px]'
                                viewBox="0 0 24 25"
                                fill="none"
                            >
                                <g clip-path="url(#clip0_21419_291816)">
                                    <path
                                        d="M1 1.35132L23 23.3513"
                                        stroke="black"
                                        stroke-opacity="0.9"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M12.75 1.47144C12.75 1.05722 12.4142 0.721436 12 0.721436C11.5858 0.721436 11.25 1.05722 11.25 1.47144V4.72144H9.5C8.37283 4.72144 7.29183 5.1692 6.4948 5.96623C6.16179 6.29924 5.88975 6.68183 5.68586 7.09664L6.8448 8.25558C6.96903 7.79486 7.21218 7.37017 7.55546 7.02689C8.07118 6.51117 8.77065 6.22144 9.5 6.22144H11.25V11.7214H10.3107L12.75 14.1608V13.2214H14.5C15.2293 13.2214 15.9288 13.5112 16.4445 14.0269C16.9603 14.5426 17.25 15.2421 17.25 15.9714C17.25 16.6865 16.9715 17.3728 16.4746 17.8854L17.5354 18.9462C18.3135 18.1522 18.75 17.0843 18.75 15.9714C18.75 14.8443 18.3022 13.7633 17.5052 12.9662C16.7082 12.1692 15.6272 11.7214 14.5 11.7214H12.75V6.22144H17C17.4142 6.22144 17.75 5.88565 17.75 5.47144C17.75 5.05722 17.4142 4.72144 17 4.72144H12.75V1.47144ZM16.2927 19.8248L15.1188 18.6509C14.9175 18.6974 14.71 18.7214 14.5 18.7214H12.75V16.2821L11.25 14.7821V18.7214H6C5.58579 18.7214 5.25 19.0572 5.25 19.4714C5.25 19.8856 5.58579 20.2214 6 20.2214H11.25V23.4714C11.25 23.8856 11.5858 24.2214 12 24.2214C12.4142 24.2214 12.75 23.8856 12.75 23.4714V20.2214H14.5C15.1253 20.2214 15.7364 20.0836 16.2927 19.8248ZM9.68934 13.2214L5.25404 8.78613C5.25135 8.84774 5.25 8.90952 5.25 8.97144C5.25 10.0986 5.69777 11.1796 6.4948 11.9766C7.29183 12.7737 8.37283 13.2214 9.5 13.2214H9.68934Z"
                                        fill="black"
                                        fill-opacity="0.9"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_21419_291816">
                                        <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                            transform="translate(0 0.471436)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                        text={
                            'We don’t charge a membership fee like other companies do.'
                        }
                    />

                    <RTBBannerV3
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className='w-[1.5rem] md:w-[24px]'
                                viewBox="0 0 24 25"
                                fill="none"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.42969 4.57124C1.42969 3.21537 2.52884 2.11621 3.88472 2.11621H4.44934V3.61621H3.88472C3.35727 3.61621 2.92969 4.04379 2.92969 4.57124V8.72149C2.92969 10.7235 4.55261 12.3464 6.55459 12.3464C8.55656 12.3464 10.1795 10.7235 10.1795 8.72149V4.57124C10.1795 4.04379 9.7519 3.61621 9.22446 3.61621H8.59401V2.11621H9.22446C10.5803 2.11621 11.6795 3.21537 11.6795 4.57124V8.72149C11.6795 11.2743 9.81305 13.3911 7.37036 13.7818V18.2542C7.37036 19.951 8.74588 21.3266 10.4427 21.3266C12.1395 21.3266 13.515 19.951 13.515 18.2542V14.2081C13.515 12.1807 15.1585 10.5371 17.186 10.5371H17.3437C19.2255 10.5371 20.7617 12.0166 20.8527 13.8758C21.847 14.1916 22.5674 15.1223 22.5674 16.2212C22.5674 17.5801 21.4658 18.6816 20.1069 18.6816C18.7481 18.6816 17.6465 17.5801 17.6465 16.2212C17.6465 15.1265 18.3614 14.1988 19.3498 13.8794C19.2631 12.8476 18.398 12.0371 17.3437 12.0371H17.186C15.987 12.0371 15.015 13.0091 15.015 14.2081V18.2542C15.015 20.7795 12.9679 22.8266 10.4427 22.8266C7.91745 22.8266 5.87036 20.7795 5.87036 18.2542V13.8011C3.36345 13.4666 1.42969 11.3199 1.42969 8.72149V4.57124ZM19.1465 16.2212C19.1465 15.6908 19.5765 15.2607 20.1069 15.2607C20.6374 15.2607 21.0674 15.6908 21.0674 16.2212C21.0674 16.7516 20.6374 17.1816 20.1069 17.1816C19.5765 17.1816 19.1465 16.7516 19.1465 16.2212Z"
                                    fill="black"
                                    fill-opacity="0.9"
                                />
                            </svg>
                        }
                        text={'Your virtual consultation is FREE.'}
                    />

                    <RTBBannerV3
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className='w-[1.5rem] md:w-[24px]'
                                viewBox="0 0 24 25"
                                fill="none"
                            >
                                <path
                                    d="M15 2.47144H6C5.46957 2.47144 4.96086 2.68215 4.58579 3.05722C4.21071 3.43229 4 3.941 4 4.47144V20.4714C4 21.0019 4.21071 21.5106 4.58579 21.8856C4.96086 22.2607 5.46957 22.4714 6 22.4714H18C18.5304 22.4714 19.0391 22.2607 19.4142 21.8856C19.7893 21.5106 20 21.0019 20 20.4714V7.47144M15 2.47144L20 7.47144M15 2.47144V7.47144H20"
                                    stroke="black"
                                    stroke-opacity="0.9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M8.03125 17.793V12.576M8.03125 12.576V8.67891C8.03125 8.60289 8.09288 8.54126 8.1689 8.54126H12.6933C12.7693 8.54126 12.8309 8.60289 12.8309 8.67891V12.4384C12.8309 12.5144 12.7693 12.576 12.6933 12.576H8.03125Z"
                                    stroke="black"
                                    stroke-opacity="0.9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M9.586 12.6671L16.068 19.1493"
                                    stroke="black"
                                    stroke-opacity="0.9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M16.4505 14.4536L11.6953 19.2088"
                                    stroke="black"
                                    stroke-opacity="0.9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                />
                            </svg>
                        }
                        text={'You only pay for the medication if prescribed.'}
                    />

                    <RTBBannerV3
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className='w-[1.5rem] md:w-[24px]'
                                viewBox="0 0 24 25"
                                fill="none"
                            >
                                <path
                                    d="M3.27002 7.43146L12 12.4815L20.73 7.43146M12 22.5514V12.4714M21 16.4715V8.47146C20.9996 8.12073 20.9071 7.77627 20.7315 7.47262C20.556 7.16898 20.3037 6.91682 20 6.74146L13 2.74146C12.696 2.56592 12.3511 2.47351 12 2.47351C11.6489 2.47351 11.304 2.56592 11 2.74146L4 6.74146C3.69626 6.91682 3.44398 7.16898 3.26846 7.47262C3.09294 7.77627 3.00036 8.12073 3 8.47146V16.4715C3.00036 16.8222 3.09294 17.1666 3.26846 17.4703C3.44398 17.7739 3.69626 18.0261 4 18.2015L11 22.2015C11.304 22.377 11.6489 22.4694 12 22.4694C12.3511 22.4694 12.696 22.377 13 22.2015L20 18.2015C20.3037 18.0261 20.556 17.7739 20.7315 17.4703C20.9071 17.1666 20.9996 16.8222 21 16.4715Z"
                                    stroke="black"
                                    stroke-opacity="0.9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        }
                        text={
                            'If prescribed, your treatment is shipped to you quickly for FREE.'
                        }
                    />

                    <RTBBannerV3
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className='w-[1.5rem] md:w-[24px]'
                                viewBox="0 0 24 25"
                                fill="none"
                            >
                                <path
                                    d="M21 15.4714C21 16.0019 20.7893 16.5106 20.4142 16.8856C20.0391 17.2607 19.5304 17.4714 19 17.4714H7L3 21.4714V5.47144C3 4.941 3.21071 4.43229 3.58579 4.05722C3.96086 3.68215 4.46957 3.47144 5 3.47144H19C19.5304 3.47144 20.0391 3.68215 20.4142 4.05722C20.7893 4.43229 21 4.941 21 5.47144V15.4714Z"
                                    stroke="black"
                                    stroke-opacity="0.9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        }
                        text={
                            'You can message your provider at any time through the BIOVERSE portal.'
                        }
                    />

                    <div className='h-6'></div>

                    <AnimatedContinueButtonV3
                        onClick={pushToNextRoute}
                        // buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
