'use client';

import { Button, SvgIcon } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { googleOAuthSignIn } from '@/app/utils/actions/auth/oauth';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import { INTAKE_INPUT_TAILWIND } from '../../intake-v2/styles/intake-tailwind-declarations';
import React from 'react';
import { useSearchParams } from 'next/navigation';

interface Props {
    currentUrl: string;
}

export default function GoogleOAuthButton({ currentUrl }: Props) {
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
            await googleOAuthSignIn(
                currentUrl,
                anonId,
                productHref,
                gclid,
                'google',
                eventId,
            );
        } else if (fbclid) {
            await googleOAuthSignIn(
                currentUrl,
                anonId,
                productHref,
                fbclid,
                'meta',
                eventId,
            );
        } else {
            await googleOAuthSignIn(
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
                fullWidth
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
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g
                                    id="Google - Original"
                                    clipPath="url(#clip0_1661_56287)"
                                >
                                    <path
                                        id="Vector"
                                        d="M23.7663 12.2765C23.7663 11.4608 23.7001 10.6406 23.559 9.83813H12.2402V14.4591H18.722C18.453 15.9495 17.5888 17.2679 16.3233 18.1056V21.104H20.1903C22.4611 19.014 23.7663 15.9274 23.7663 12.2765Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        id="Vector_2"
                                        d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        id="Vector_3"
                                        d="M5.50277 14.3002C5.00011 12.8099 5.00011 11.196 5.50277 9.70569V6.61475H1.51674C-0.185266 10.0055 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3002Z"
                                        fill="#FBBC04"
                                    />
                                    <path
                                        id="Vector_4"
                                        d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                                        fill="#EA4335"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1661_56287">
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
                    Continue with Google
                </BioType>
            </Button>
        </>
    );
}
