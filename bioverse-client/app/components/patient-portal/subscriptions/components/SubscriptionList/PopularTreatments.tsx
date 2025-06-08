'use client';

import { Paper, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import PopularTreatmentItem from './components/PopularTreatmentItem';

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
    },
    {
        title: 'TIRZEPATIDE',
        description:
            'Lose weight and keep it off. The same ingredient in Mounjaro® and Zepbound™',
        deal: 'As low as $229/month',
        image_ref: 'product-images/tirzepatide/tirzepatide_clear_shadow.png',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/tirzepatide/wl-intro-1?pvn=0&st=monthly&pvt=vial',
        learnMoreHref: 'https://app.gobioverse.com/prescriptions/tirzepatide',
        href: 'tirzepatide',
    },
    {
        title: 'SEMAGLUTIDE',
        description:
            'Lose weight with semaglutide. The same active ingredient in Ozempic® and Wegovy®',
        deal: 'As low as $129/month',
        image_ref: 'product-images/semiglutide/sema_clear_shadow.png',
        learnMoreHref: 'https://app.gobioverse.com/prescriptions/semaglutide',
        getStartedHref:
            'https://app.gobioverse.com/intake/prescriptions/semaglutide/wl-intro-1?pvn=0&st=monthly&pvt=vial',
        href: 'semaglutide',
    },
];

import 'swiper/css';
import './styles.css';
import 'swiper/css/pagination';

export default function PopularTreatments({ filtered }: Props) {
    const isNotMobile = useMediaQuery('(min-width:640px)');

    return (
        <Swiper
            direction='horizontal' // Explicitly set the direction to horizontal
            spaceBetween={100}
            slidesPerView={3}
            initialSlide={0}
            centeredSlides={false}
            slidesPerGroup={1}
            parallax={true}
            breakpoints={{
                // when window width is >= 320px
                320: {
                    width: 320,
                    slidesPerView: 1.3,
                    spaceBetween: 100,
                },
                // when window width is >= 480px
                480: {
                    width: 480,
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                // when window width is >= 640px
                640: {
                    width: 640,
                    slidesPerView: 3,
                    spaceBetween: 50,
                },
            }}
        >
            {data.map((item: Treatment, index: number) => {
                if (!filtered.includes(item.href))
                    return (
                        <SwiperSlide key={index}>
                            <PopularTreatmentItem
                                title={item.title}
                                description={item.description}
                                deal={item.deal}
                                image_ref={item.image_ref}
                                getStartedHref={item.getStartedHref}
                                learnMoreHref={item.learnMoreHref}
                            />
                        </SwiperSlide>
                    );
            })}
            <SwiperSlide></SwiperSlide>
        </Swiper>
    );
}
