'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import AltSummaryCarouselCard from './alt-summary-carousel-card';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AltSummaryCarousel {
    product: string;
}

interface CarouselCard {
    title: string;
    description: string;
}

const cards: CarouselCard[] = [
    {
        title: 'Buproprion HCl',
        description:
            'Bupropion can help with weight loss by reducing hunger and cravings, and increasing energy levels. This medication can be combined with a reduced-calorie diet and exercise to help with weight loss and maintenance.',
    },
    {
        title: 'Naltrexone HCl',
        description:
            'Naltrexone HCl can work to suppress your appetite and break the cycle of elevated insulin and weight gain. When combined with Buproprion HCl, these medications will suppress sugar and carb cravings.',
    },
    {
        title: 'Topiramate',
        description:
            'Topiramate can be prescribed off-label to aid in weight loss. appetite suppression (reduced calorie intake), preventing the body from storing excess fat, and lowering some fat and cholesterol levels.',
    },
];

export default function AltSummaryCarouselComponent({}: AltSummaryCarousel) {
    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            direction='horizontal' // Explicitly set the direction to horizontal
            slidesPerView={1.5}
            initialSlide={0}
            centeredSlides={true}
            slidesPerGroup={1}
            parallax={true}
            style={{
                paddingRight: '0px',
                padding: '4px',
            }}
            breakpoints={{
                // when window width is >= 320px
                320: {
                    width: 500,
                    slidesPerView: 1,
                },
                // when window width is >= 480px
                480: {
                    width: 600,
                    slidesPerView: 1.5,
                },
            }}
        >
            {cards.map((item, index: number) => {
                return (
                    <SwiperSlide key={index}>
                        <AltSummaryCarouselCard data={item} />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}

/**
 * <Swiper
            direction="horizontal" // Explicitly set the direction to horizontal
            spaceBetween={100}
            slidesPerView={3}
            initialSlide={0}
            centeredSlides={false}
            slidesPerGroup={1}
            parallax={true}
            // style={{paddingLeft:'50px'}}
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
                    slidesPerView: 2.2,
                    spaceBetween: 50,
                },
            }}
        >
            {data.map((item: Treatment, index: number) => {
                return (
                    <SwiperSlide key={index}>
                        <PopularTreatmentItem
                            itemDetails={item}
                            isHomePage={isHomePage}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
 */
