'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface RequestConfirmedScreenProps {}
export default function FirstTimeRequestConfirmedScreen({}: RequestConfirmedScreenProps) {
    /**
     * Modify element CSS here.
     */
    const router = useRouter();
    const css_variables = {
        //Mobile
        container_width_mobile: '90vw',
        header_text_class_mobile: 'it-h1',
        button_container_class_mobile:
            'fixed md:static bottom-[25px] flex w-[90vw] md:w-full',

        //Desktop
        container_width_desktop: '500px',
        container_gap: '28px',
        logo_width: 170,
        logo_height: 41,
        header_text_class: 'itd-h1',
        body_text_class: 'itd-subtitle text-[#00000099] font-[20px]',
        button_sx: {
            height: '52px',
            backgroundColor: '#000000',
            '&:hover': {
                backgroundColor: '#666666',
            },
        },

        //Shared
        header_text_color: 'text-primary',
    };

    return (
        <>
            <div
                className={`flex flex-col mt-12 w-[${css_variables.container_width_mobile}] md:w-[${css_variables.container_width_desktop}] gap-[${css_variables.container_gap}]`}
            >
                <Image
                    src={'/img/bioverse-logo-full.png'}
                    alt={'logo'}
                    width={css_variables.logo_width}
                    height={css_variables.logo_height}
                    unoptimized
                />

                <div id="header-text">
                    <BioType
                        className={`${css_variables.header_text_class_mobile} md:${css_variables.header_text_class} ${css_variables.header_text_color}`}
                    >
                        Your request is confirmed.
                    </BioType>
                </div>

                <div id="body-text">
                    <BioType className={css_variables.body_text_class}>
                        Our partner pharmacy will fulfill your shipment shortly.
                    </BioType>
                </div>

                <div
                    id="continue-button"
                    className={css_variables.button_container_class_mobile}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        sx={css_variables.button_sx}
                        onClick={() => router.push('/portal/order-history')}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </>
    );
}
