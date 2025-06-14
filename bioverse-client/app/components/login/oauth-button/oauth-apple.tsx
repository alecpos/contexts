'use client';

import { Button, SvgIcon } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { appleOauthSignIn } from '@/app/utils/actions/auth/oauth';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import { INTAKE_INPUT_TAILWIND } from '../../intake-v2/styles/intake-tailwind-declarations';
import { useSearchParams } from 'next/navigation';

interface Props {
    currentUrl: string;
}

export default function AppleOAuthButton({ currentUrl }: Props) {
    // const url = localStorage.getItem('originalRef') || '/';
    const [anonId, setAnonId] = useLocalStorage('anonId', '');
    const [productHref, setProductHref] = useLocalStorage('product_href', '');
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);

    const logInWithGoogle = async () => {
        const gclid = urlParams.get('gclid');
        const fbclid = urlParams.get('fbclid');

        const eventId = `${anonId}-${Date.now()}`;

        setLeadEventId(eventId);

        if (gclid) {
            await appleOauthSignIn(
                currentUrl,
                anonId,
                productHref,
                gclid,
                'google',
                eventId,
            );
        } else if (fbclid) {
            await appleOauthSignIn(
                currentUrl,
                anonId,
                productHref,
                fbclid,
                'meta',
                eventId,
            );
        } else {
            await appleOauthSignIn(
                currentUrl,
                anonId,
                productHref,
                '',
                'none',
                eventId,
            );
        }
    };

    return (
        <>
            <Button
                sx={{
                    borderColor: '#D8D8D8',
                    height: '64px',
                    // borderRadius: '12px',
                    backgroundColor: 'white',
                }}
                variant="outlined"
                onClick={logInWithGoogle}
                startIcon={
                    <>
                        <SvgIcon
                            color="primary"
                            fontSize="large"
                            className="mr-0.5"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <g clipPath="url(#clip0_8291_21237)">
                                    <path
                                        d="M21.792 18.7033C21.429 19.5418 20.9994 20.3136 20.5016 21.0232C19.8231 21.9906 19.2676 22.6602 18.8395 23.0321C18.1758 23.6424 17.4647 23.955 16.7032 23.9728C16.1566 23.9728 15.4973 23.8172 14.73 23.5017C13.9601 23.1876 13.2525 23.0321 12.6056 23.0321C11.9271 23.0321 11.1994 23.1876 10.4211 23.5017C9.64153 23.8172 9.01355 23.9817 8.53342 23.9979C7.80322 24.0291 7.07539 23.7076 6.3489 23.0321C5.88521 22.6276 5.30523 21.9343 4.61043 20.9521C3.86498 19.9033 3.25211 18.687 2.77198 17.3004C2.25777 15.8026 2 14.3523 2 12.9482C2 11.3398 2.34754 9.95259 3.04367 8.79011C3.59076 7.85636 4.31859 7.11979 5.22953 6.57906C6.14046 6.03834 7.12473 5.76279 8.18469 5.74516C8.76467 5.74516 9.52524 5.92457 10.4704 6.27715C11.4129 6.63091 12.0181 6.81032 12.2834 6.81032C12.4817 6.81032 13.154 6.60054 14.2937 6.18234C15.3714 5.7945 16.281 5.63391 17.0262 5.69717C19.0454 5.86012 20.5624 6.6561 21.5712 8.09013C19.7654 9.18432 18.8721 10.7169 18.8898 12.6829C18.9061 14.2142 19.4617 15.4886 20.5535 16.5004C21.0483 16.97 21.6009 17.333 22.2156 17.5907C22.0823 17.9774 21.9416 18.3477 21.792 18.7033ZM17.161 0.480137C17.161 1.68041 16.7225 2.8011 15.8484 3.83841C14.7937 5.07155 13.5179 5.78413 12.1343 5.67168C12.1167 5.52769 12.1065 5.37614 12.1065 5.21688C12.1065 4.06462 12.6081 2.83147 13.4989 1.82321C13.9436 1.3127 14.5092 0.888228 15.1951 0.549615C15.8796 0.216055 16.5269 0.031589 17.1358 0C17.1536 0.160458 17.161 0.320926 17.161 0.480121V0.480137Z"
                                        fill="#1B1B1B"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_8291_21237">
                                        <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </SvgIcon>
                    </>
                }
            >
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} text-[18px] text-[#666666] normal-case border-[#D8D8D8]`}
                >
                    Continue with Apple
                </BioType>
            </Button>
        </>
    );
}
