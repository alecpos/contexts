'use client';

import { Button, SvgIcon } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    facebookOAuthSignIn,
    googleOAuthSignIn,
} from '@/app/utils/actions/auth/oauth';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';
import { INTAKE_INPUT_TAILWIND } from '../../intake-v2/styles/intake-tailwind-declarations';
import { useSearchParams } from 'next/navigation';

interface Props {
    currentUrl: string;
}

export default function FacebookOAuthButton({ currentUrl }: Props) {
    // const url = localStorage.getItem('originalRef') || '/';
    const [anonId, setAnonId] = useLocalStorage('anonId', '');
    const [productHref, setProductHref] = useLocalStorage('product_href', '');
    const [leadEventId, setLeadEventId] = useLocalStorage('lead_event_id', '');

    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);

    const logInWithFacebook = async () => {
        const gclid = urlParams.get('gclid');
        const fbclid = urlParams.get('fbclid');

        const eventId = `${anonId}-${Date.now()}`;

        setLeadEventId(eventId);

        if (gclid) {
            await facebookOAuthSignIn(
                currentUrl,
                anonId,
                productHref,
                gclid,
                'google',
                eventId,
            );
        } else if (fbclid) {
            await facebookOAuthSignIn(
                currentUrl,
                anonId,
                productHref,
                fbclid,
                'meta',
                eventId,
            );
        } else {
            await facebookOAuthSignIn(
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
                onClick={logInWithFacebook}
                className="h5"
                variant="outlined"
                sx={{
                    borderColor: '#D8D8D8',
                    height: '64px',
                    // borderRadius: '12px',
                    backgroundColor: 'white',
                }}
                startIcon={
                    <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g
                            id="Facebook - Original"
                            clipPath="url(#clip0_1661_56293)"
                        >
                            <path
                                id="Vector"
                                d="M24.5 12C24.5 5.37258 19.1274 0 12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 17.9895 4.8882 22.954 10.625 23.8542V15.4688H7.57812V12H10.625V9.35625C10.625 6.34875 12.4166 4.6875 15.1576 4.6875C16.4701 4.6875 17.8438 4.92188 17.8438 4.92188V7.875H16.3306C14.84 7.875 14.375 8.80008 14.375 9.75V12H17.7031L17.1711 15.4688H14.375V23.8542C20.1118 22.954 24.5 17.9895 24.5 12Z"
                                fill="#1877F2"
                            />
                            <path
                                id="Vector_2"
                                d="M17.1711 15.4688L17.7031 12H14.375V9.75C14.375 8.80102 14.84 7.875 16.3306 7.875H17.8438V4.92188C17.8438 4.92188 16.4705 4.6875 15.1576 4.6875C12.4166 4.6875 10.625 6.34875 10.625 9.35625V12H7.57812V15.4688H10.625V23.8542C11.8674 24.0486 13.1326 24.0486 14.375 23.8542V15.4688H17.1711Z"
                                fill="white"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1661_56293">
                                <rect
                                    width="24"
                                    height="24"
                                    fill="white"
                                    transform="translate(0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                }
            >
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} text-[18px] text-[#666666] normal-case border-[#D8D8D8]`}
                >
                    Continue with Facebook
                </BioType>
            </Button>
        </>
    );
}
