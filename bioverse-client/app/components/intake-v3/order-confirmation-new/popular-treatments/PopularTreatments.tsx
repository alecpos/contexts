'use client';

import { Paper, useMediaQuery } from '@mui/material';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import PopularTreatmentItem from './PopularTreatmentItem';

interface Props {
    filtered: string[];
}

interface Treatment {
    title: string;
    description: string;
    deal: string;
    image_ref: string;
    getStartedHref: string;
    learnMoreHref: string;
    href: string;
    bg_color: string;
}

const data: Treatment[] = [
    {
        title: 'NAD+ INJECTION',
        description:
            'Support cellular metabolism and longevity with NAD+. Without NAD+, life would cease to exist.',
        deal: 'As low as $340/month',
        image_ref:
            'product-images/nad-injection/nad_injection_clear_concentration.png',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/nad-injection/registration?pvn=0&st=monthly&pvt=1000mg%2F5ml+vial&sd=23c',
        learnMoreHref: 'https://app.gobioverse.com/prescriptions/nad-injection',
        href: 'nad-injection',
        bg_color: '#d5c4ea',
    },
    {
        title: 'GLUTATHIONE INJECTION',
        description:
            'Powerful antioxidant that plays a key role in detoxification and immune support',
        deal: 'As low as $149/month',
        image_ref:
            'product-images/glutathione-injection/glutathione_clear_concentration.png',
        learnMoreHref:
            'https://app.gobioverse.com/prescriptions/glutathione-injection',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/glutathione-injection/registration?pvn=0&st=monthly&pvt=200mg%2Fml+%2810ml+vial%29&sd=23c',
        href: 'glutathione-injection',
        bg_color: '#e3bbd6',
    },
    {
        title: 'B12 INJECTION',
        description:
            'Boost energy levels, protect neurological functions, and support DNA synthesis.',
        deal: 'As low as $179/quarter',
        image_ref:
            'product-images/b12-injection/b12_injection_clear_concentration.png',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/b12-injection/registration?pvn=0&st=quarterly&pvt=10ml&sd=23c',
        learnMoreHref: 'https://app.gobioverse.com/prescriptions/b12-injection',
        href: 'b12-injection',
        bg_color: '#e2baba',

    },
    {
        title: 'TIRZEPATIDE',
        description:
            'Lose weight and keep it off. The same ingredient in Mounjaro® and Zepbound™',
        deal: 'As low as $399/month',
        image_ref: 'product-images/tirzepatide/tirzepatide_clear_shadow.png',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/tirzepatide/wl-intro-1?pvn=0&st=monthly&pvt=vial',
        learnMoreHref: 'https://app.gobioverse.com/prescriptions/tirzepatide',
        href: 'tirzepatide',
        bg_color: '#e8eac2',
    },
    {
        title: 'SEMAGLUTIDE',
        description:
            'Lose weight with semaglutide. The same active ingredient in Ozempic® and Wegovy®',
        deal: 'As low as $295/month',
        image_ref: 'product-images/semiglutide/sema_clear_shadow.png',
        learnMoreHref: 'https://app.gobioverse.com/prescriptions/semaglutide',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/semaglutide/wl-intro-1?pvn=0&st=monthly&pvt=vial',
        href: 'semaglutide',
        bg_color: '#aac9a9',
    },
];

import 'swiper/css';
import './styles.css';
import 'swiper/css/pagination';

export default function PopularTreatments({ filtered }: Props) {
    const isNotMobile = useMediaQuery('(min-width:640px)');

    return (

        <div className="w-full flex justify-center relative">
            <div className="w-full max-w-screen overflow-hidden h-[440px] ">
            <div
                className="absolute top-0 right-0 h-full w-12 pointer-events-none hidden sm:block"
                style={{
                background: "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #fafafa 100%)",
                }}
            ></div>
            <div className="flex flex-row gap-2 sm:gap-4 overflow-x-scroll scrollbar-hide pr-24 absolute top-0 left-0 w-full">
                {data.map((item: Treatment, index: number) => {
                if (!filtered.includes(item.href))
                    return (
                    <PopularTreatmentItem
                        key={index}
                        title={item.title}
                        description={item.description}
                        deal={item.deal}
                        image_ref={item.image_ref}
                        getStartedHref={item.getStartedHref}
                        learnMoreHref={item.learnMoreHref}
                        bg_color={item.bg_color}
                    />
                    );
                })}
            </div>
            </div>
        </div>

         
    );
}
